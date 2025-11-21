const puppeteer = require('puppeteer');

/**
 * Scrapes TCGPlayer for a specific card
 * @param {string} searchTerm - The card name to search for
 * @returns {Promise<Array>} Array of deal objects
 */
async function scrapeTCGPlayer(searchTerm = 'charizard base set') {
    console.log(`[TCGPlayer] Searching for: ${searchTerm}`);
    const results = [];

    const browser = await puppeteer.launch({
        headless: "new",
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-blink-features=AutomationControlled',
            '--window-size=1920,1080'
        ]
    });

    const page = await browser.newPage();

    // Set a real User-Agent
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    try {
        // Build search URL
        const searchUrl = `https://www.tcgplayer.com/search/all/product?q=${encodeURIComponent(searchTerm)}&view=grid`;
        await page.goto(searchUrl, {
            waitUntil: 'domcontentloaded',
            timeout: 30000
        });

        // Wait for results to load - new selector
        try {
            await page.waitForSelector('a[href^="/product/"]', { timeout: 10000 });
        } catch (e) {
            console.log('[TCGPlayer] Product links not found immediately');
        }

        // Extract card data from search results
        const cards = await page.evaluate(() => {
            const items = [];
            // Select all product links
            const resultElements = document.querySelectorAll('a[href^="/product/"]');

            resultElements.forEach((element, index) => {
                if (index >= 20) return; // Limit results

                try {
                    // New selectors based on inspection
                    // Title is often in h4 > span or just h4
                    const titleEl = element.querySelector('h4 span') || element.querySelector('h4') || element.querySelector('.product-card__title');
                    const priceEl = element.querySelector('.product-card__market-price--value');
                    const imgEl = element.querySelector('img');

                    if (titleEl && priceEl) {
                        const cardName = titleEl.textContent.trim();
                        const priceText = priceEl.textContent.trim();
                        const price = parseFloat(priceText.replace('$', '').replace(',', ''));
                        const url = element.href;
                        const imageUrl = imgEl ? imgEl.src : '';

                        if (!isNaN(price)) {
                            items.push({ cardName, price, url, imageUrl });
                        }
                    }
                } catch (err) {
                    // Skip individual item errors
                }
            });

            return items;
        });

        // Transform to deal format
        cards.forEach(card => {
            results.push({
                cardName: card.cardName,
                price: card.price,
                source: 'TCGPlayer Web',
                affiliateLink: card.url, // Direct product link
                imageUrl: card.imageUrl || 'https://via.placeholder.com/200x280?text=No+Image',
                lastUpdated: new Date()
            });
        });

        console.log(`[TCGPlayer] Found ${results.length} deals`);

    } catch (error) {
        console.error('[TCGPlayer] Scraping error:', error.message);
    } finally {
        await browser.close();
    }

    return results;
}

module.exports = { scrapeTCGPlayer };
