const puppeteer = require('puppeteer');

/**
 * Scrapes eBay for a specific card
 * @param {string} searchTerm - The card name to search for
 * @returns {Promise<Array>} Array of deal objects
 */
async function scrapeEbay(searchTerm = 'charizard pokemon card') {
    console.log(`[eBay] Searching for: ${searchTerm}`);
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

    // Set a real User-Agent to avoid detection
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    try {
        // Build search URL - focusing on sold/completed listings for accurate pricing
        const searchUrl = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(searchTerm)}&LH_Sold=1&LH_Complete=1&_sop=13`;

        await page.goto(searchUrl, {
            waitUntil: 'domcontentloaded',
            timeout: 30000
        });

        // Wait for listings to load - check for both s-item and s-card
        try {
            await page.waitForSelector('.s-item', { timeout: 10000 });
        } catch (e) {
            console.log('[eBay] Standard .s-item selector not found immediately');
        }

        // Extract listing data
        const listings = await page.evaluate(() => {
            const items = [];
            // Try both selectors
            const listingElements = document.querySelectorAll('.s-item, .s-card');

            listingElements.forEach((element, index) => {
                // Skip "Shop on eBay" or other non-result items
                if (element.textContent.includes('Shop on eBay')) return;

                if (items.length >= 20) return; // Limit results

                try {
                    // Try multiple selectors for robustness
                    const titleEl = element.querySelector('.s-item__title') || element.querySelector('.s-card__title');
                    const priceEl = element.querySelector('.s-item__price') || element.querySelector('.s-card__price');
                    const linkEl = element.querySelector('.s-item__link') || element.querySelector('.s-card__link');
                    const imgEl = element.querySelector('.s-item__image-wrapper img') || element.querySelector('.s-card__image img');

                    if (titleEl && priceEl && linkEl) {
                        const cardName = titleEl.textContent.trim();
                        const priceText = priceEl.textContent.trim();

                        // Handle price ranges (take the first price)
                        let price = parseFloat(
                            priceText
                                .replace('$', '')
                                .replace(',', '')
                                .split(' to ')[0]
                        );

                        const url = linkEl.href;
                        const imageUrl = imgEl ? imgEl.src : '';

                        if (!isNaN(price) && cardName !== 'Shop on eBay' && !cardName.startsWith('Shop on eBay')) {
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
        listings.forEach(listing => {
            results.push({
                cardName: listing.cardName,
                price: listing.price,
                source: 'eBay',
                affiliateLink: listing.url, // Direct product link
                imageUrl: listing.imageUrl || 'https://via.placeholder.com/200x280?text=No+Image',
                lastUpdated: new Date()
            });
        });

        console.log(`[eBay] Found ${results.length} deals`);

    } catch (error) {
        console.error('[eBay] Scraping error:', error.message);
    } finally {
        await browser.close();
    }

    return results;
}

module.exports = { scrapeEbay };
