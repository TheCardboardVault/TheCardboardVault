const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { scrapeAll } = require('./scrapers');

dotenv.config();

/**
 * Main scraper execution
 * Searches for popular cards across all sources
 */
async function main() {
    console.log('\n🔍 Starting TCG Deal Scraper\n');

    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✓ Connected to MongoDB\n');

        // Define cards to search for
        // You can expand this list or make it dynamic
        const searchTerms = [
            'charizard base set pokemon',
            'black lotus magic',
            'blue eyes white dragon yugioh',
            'pikachu vmax pokemon',
            'liliana of the veil magic'
        ];

        let totalDeals = 0;

        // Scrape each search term
        for (const term of searchTerms) {
            const count = await scrapeAll(term, mongoose);
            totalDeals += count;

            // Add delay between searches to be respectful
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        console.log(`\n✓ Scraping complete! Total deals saved: ${totalDeals}\n`);

    } catch (error) {
        console.error('\n✗ Scraper error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('✓ Disconnected from MongoDB\n');
    }
}

// Run if executed directly
if (require.main === module) {
    main();
}

module.exports = { main };