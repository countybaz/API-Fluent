const axios = require('axios');
const xml2js = require('xml2js');

// ============================================
// CONFIGURE YOUR API CREDENTIALS HERE
// ============================================
const FLUENT_CONFIG = {
    baseUrl: process.env.FLUENT_BASE_URL || 'https://login.affluentco.com',
    apiKey: process.env.FLUENT_API_KEY || '8WPZfzSVVfcFtSmLVkmgQ',
    affiliateId: process.env.FLUENT_AFFILIATE_ID || '208361'
};
// ============================================

// Helper function to parse XML to JSON
const parseXML = (xml) => {
    return new Promise((resolve, reject) => {
        xml2js.parseString(xml, { explicitArray: false }, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

exports.handler = async (event, context) => {
    // Enable CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    };

    // Handle preflight
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        const { offer_id, sub_id, start_date, end_date, ad_spend } = body;

        const url = `${FLUENT_CONFIG.baseUrl}/api/1/reports.asmx/SubIDSummary`;
        const params = {
            api_key: FLUENT_CONFIG.apiKey,
            start_date: start_date,
            end_date: end_date,
            source_affiliate_id: FLUENT_CONFIG.affiliateId,
            site_offer_id: offer_id,
            event_id: 0,
            revenue_filter: 'conversions_and_events'
        };

        // Add sub_id if specified
        if (sub_id && sub_id !== 'all') {
            params.subid_id = sub_id;
        }

        const response = await axios.get(url, { params });
        const data = await parseXML(response.data);

        // Calculate revenue internally (VA never sees this)
        let totalRevenue = 0;
        let totalConversions = 0;
        let totalClicks = 0;

        if (data.sub_id_summary_response && data.sub_id_summary_response.sub_ids) {
            const subIdData = data.sub_id_summary_response.sub_ids.sub_id_summary;
            
            let subIds = Array.isArray(subIdData) ? subIdData : [subIdData];

            subIds.forEach(sub => {
                totalRevenue += parseFloat(sub.revenue || 0);
                totalConversions += parseFloat(sub.macro_event_conversions || 0);
                totalClicks += parseInt(sub.clicks || 0);
            });
        }

        // Calculate ROAS
        const roas = ad_spend > 0 ? (totalRevenue / ad_spend) : 0;
        const profit = totalRevenue - ad_spend;

        // ⚠️ PRIVACY: Return ONLY ROAS to VA
        // Revenue, profit, conversions, clicks are HIDDEN
        // VAs cannot reverse-engineer revenue from ROAS alone (they'd need to know exact revenue)
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                results: {
                    roas: parseFloat(roas.toFixed(2)),
                    ad_spend: parseFloat(ad_spend.toFixed(2)),
                    // Revenue HIDDEN from VA
                    // Profit HIDDEN from VA  
                    // Conversions HIDDEN from VA
                    // Clicks HIDDEN from VA
                }
            })
        };

    } catch (error) {
        console.error('Error calculating ROAS:', error.message);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ success: false, error: error.message })
        };
    }
};
