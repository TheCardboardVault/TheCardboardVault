const { scrapeTCGPlayer } = require('./tcgplayer');
const { scrapeTCGPlayerAPI } = require('./tcgplayer-api');
const { scrapeEbay } = require('./ebay');
const Deal = require('../models/deal');

/**
 * Scrape all sources for a given search term
 * @param {string} searchTerm - The card to search for
 * @param {Object} mongoose - Mongoose instance for DB operations
 * @returns {Promise<number>} Number of deals saved
 */
async function scrapeAll(searchTerm, mongoose) {
    console.log(`\n=== Starting scrape for: "${searchTerm}" ===\n`);

    let totalSaved = 0;

    try {
        // Run all scrapers in parallel for speed
        const [tcgWebResults, tcgApiResults, ebayResults] = await Promise.all([
            scrapeTCGPlayer(searchTerm).catch(err => {
                console.error('[TCGPlayer Web] Failed:', err.message);
                return [];
            }),
            scrapeTCGPlayerAPI(searchTerm).catch(err => {
                console.error('[TCGPlayer API] Failed:', err.message);
                return [];
            }),
            scrapeEbay(searchTerm).catch(err => {
                console.error('[eBay] Failed:', err.message);
                return [];
            })
        ]);

        const allResults = [...tcgWebResults, ...tcgApiResults, ...ebayResults];

        // Save to database
        for (const deal of allResults) {
            try {
                await Deal.findOneAndUpdate(
                    { cardName: deal.cardName, source: deal.source },
                    deal,
                    { upsert: true, new: true }
                );
                totalSaved++;
            } catch (err) {
                // Likely a duplicate key error, which is fine
                console.log(`[DB] Skipped duplicate: ${deal.cardName} (${deal.source})`);
            }
        }

        console.log(`\n=== Scrape Complete: ${totalSaved} deals saved ===\n`);

    } catch (error) {
        console.error('[Scraper] Error:', error.message);
    }

    return totalSaved;
}

module.exports = { scrapeAll, scrapeTCGPlayer, scrapeTCGPlayerAPI, scrapeEbay };
