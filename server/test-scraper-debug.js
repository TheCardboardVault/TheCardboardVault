const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { scrapeAll } = require('./scrapers');

dotenv.config();

async function testScraper() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        console.log('Starting scrape for "Charizard"...');
        const count = await scrapeAll('Charizard', mongoose);
        console.log(`Scrape complete. Found ${count} deals.`);

    } catch (err) {
        console.error('Test failed:', err);
    } finally {
        await mongoose.disconnect();
    }
}

testScraper();
