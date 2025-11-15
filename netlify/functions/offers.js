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
        const url = `${FLUENT_CONFIG.baseUrl}/affiliates/api/2/offers.asmx/OfferFeed`;
        const params = {
            api_key: FLUENT_CONFIG.apiKey,
            affiliate_id: FLUENT_CONFIG.affiliateId,
            offer_status_id: 3 // Active offers only
        };

        const response = await axios.get(url, { params });
        const data = await parseXML(response.data);

        // Extract offers
        let offers = [];
        if (data.offer_feed_response && data.offer_feed_response.offers) {
            const offerData = data.offer_feed_response.offers.offer;
            
            // Handle single offer (not array)
            if (!Array.isArray(offerData)) {
                offers = [offerData];
            } else {
                offers = offerData;
            }

            // Format offers (minimal data only)
            offers = offers.map(offer => ({
                offer_id: offer.offer_id,
                offer_name: offer.offer_name,
                campaign_id: offer.campaign_id
            }));
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, offers })
        };

    } catch (error) {
        console.error('Error fetching offers:', error.message);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ success: false, error: error.message })
        };
    }
};
