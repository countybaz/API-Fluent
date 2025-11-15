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
        const { offer_id, start_date, end_date } = body;

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

        const response = await axios.get(url, { params });
        const data = await parseXML(response.data);

        let subIds = [];
        if (data.sub_id_summary_response && data.sub_id_summary_response.sub_ids) {
            const subIdData = data.sub_id_summary_response.sub_ids.sub_id_summary;
            
            // Handle single sub ID (not array)
            if (!Array.isArray(subIdData)) {
                subIds = [subIdData];
            } else {
                subIds = subIdData;
            }

            // ⚠️ PRIVACY: Format sub IDs WITHOUT revenue data
            // VAs only see Sub ID names, no financial info
            subIds = subIds.map(sub => ({
                sub_id: sub.sub_id,
                sub_id_name: sub.sub_id_name || `Sub ID ${sub.sub_id}`,
                // Revenue/conversions/clicks hidden from VA
                // Backend still receives it from API, just doesn't send to frontend
            }));

            // Sort alphabetically by name instead of revenue
            subIds.sort((a, b) => a.sub_id_name.localeCompare(b.sub_id_name));
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, subIds })
        };

    } catch (error) {
        console.error('Error fetching sub IDs:', error.message);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ success: false, error: error.message })
        };
    }
};
