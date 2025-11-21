const axios = require('axios');

/**
 * TCGPlayer API scraper using official API
 * More reliable than web scraping
 */

let accessToken = null;
let tokenExpiry = null;

/**
 * Get access token for TCGPlayer API
 */
async function getAccessToken() {
    // Return cached token if still valid
    if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
        return accessToken;
    }

    const publicKey = process.env.TCGPLAYER_PUBLIC_KEY;
    const privateKey = process.env.TCGPLAYER_PRIVATE_KEY;

    if (!publicKey || !privateKey) {
        throw new Error('TCGPlayer API keys not configured in .env file');
    }

    try {
        const response = await axios.post('https://api.tcgplayer.com/token',
            new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: publicKey,
                client_secret: privateKey
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        accessToken = response.data.access_token;
        // Token expires in seconds, cache it for that duration minus 1 minute for safety
        tokenExpiry = Date.now() + ((response.data.expires_in - 60) * 1000);

        console.log('[TCGPlayer API] Access token obtained');
        return accessToken;

    } catch (error) {
        console.error('[TCGPlayer API] Failed to get access token:', error.response?.data || error.message);
        throw error;
    }
}

/**
 * Search for cards using TCGPlayer API
 * @param {string} searchTerm - The card name to search for
 * @returns {Promise<Array>} Array of deal objects
 */
async function scrapeTCGPlayerAPI(searchTerm = 'charizard') {
    console.log(`[TCGPlayer API] Searching for: ${searchTerm}`);
    const results = [];

    try {
        const token = await getAccessToken();

        // Search for products
        const searchResponse = await axios.get(
            `https://api.tcgplayer.com/catalog/products`,
            {
                params: {
                    categoryId: 1, // Pokemon TCG category
                    productName: searchTerm,
                    limit: 50,
                    offset: 0
                },
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            }
        );

        const products = searchResponse.data.results || [];

        if (products.length === 0) {
            console.log('[TCGPlayer API] No products found');
            return results;
        }

        // Get product IDs
        const productIds = products.map(p => p.productId).join(',');

        // Get pricing for these products
        const priceResponse = await axios.get(
            `https://api.tcgplayer.com/pricing/product/${productIds}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            }
        );

        const priceData = priceResponse.data.results || [];

        // Combine product info with pricing
        products.forEach(product => {
            const pricing = priceData.find(p => p.productId === product.productId);

            if (pricing && pricing.marketPrice) {
                results.push({
                    cardName: product.name,
                    price: pricing.marketPrice,
                    source: 'TCGPlayer API',
                    affiliateLink: product.url || `https://www.tcgplayer.com/product/${product.productId}`,
                    imageUrl: product.imageUrl || 'https://via.placeholder.com/200x280?text=No+Image',
                    lastUpdated: new Date()
                });
            }
        });

        console.log(`[TCGPlayer API] Found ${results.length} deals`);

    } catch (error) {
        // Handle invalid key error gracefully
        if (error.response?.data?.error === 'invalid_grant') {
            console.log('[TCGPlayer API] Invalid API keys. Skipping API scrape.');
            return [];
        }
        console.error('[TCGPlayer API] Error:', error.response?.data || error.message);
    }

    return results;
}

module.exports = { scrapeTCGPlayerAPI, getAccessToken };
