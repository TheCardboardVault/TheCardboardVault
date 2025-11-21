const mongoose = require('mongoose');
require('dotenv').config();
const Deal = require('./models/deal');

// Sample TCG deals data
const sampleDeals = [
    {
        cardName: 'Charizard VMAX (Shiny)',
        price: 89.99,
        source: 'TCGPlayer',
        affiliateLink: 'https://www.tcgplayer.com/product/charizard-vmax',
        imageUrl: 'https://product-images.tcgplayer.com/fit-in/437x437/234708.jpg'
    },
    {
        cardName: 'Pikachu V-UNION',
        price: 24.99,
        source: 'eBay',
        affiliateLink: 'https://www.ebay.com/itm/pikachu-v',
        imageUrl: 'https://product-images.tcgplayer.com/fit-in/437x437/239546.jpg'
    },
    {
        cardName: 'Black Lotus (Alpha)',
        price: 28999.99,
        source: 'TCGPlayer',
        affiliateLink: 'https://www.tcgplayer.com/product/black-lotus',
        imageUrl: 'https://product-images.tcgplayer.com/fit-in/437x437/2.jpg'
    },
    {
        cardName: 'Mox Sapphire',
        price: 4500.00,
        source: 'eBay',
        affiliateLink: 'https://www.ebay.com/itm/mox-sapphire',
        imageUrl: 'https://product-images.tcgplayer.com/fit-in/437x437/3093.jpg'
    },
    {
        cardName: 'Blue-Eyes White Dragon (LOB-001)',
        price: 450.00,
        source: 'TCGPlayer',
        affiliateLink: 'https://www.tcgplayer.com/product/blue-eyes',
        imageUrl: 'https://product-images.tcgplayer.com/fit-in/437x437/153293.jpg'
    },
    {
        cardName: 'Dark Magician Girl',
        price: 125.50,
        source: 'eBay',
        affiliateLink: 'https://www.ebay.com/itm/dark-magician',
        imageUrl: 'https://product-images.tcgplayer.com/fit-in/437x437/19029.jpg'
    },
    {
        cardName: 'Liliana of the Veil',
        price: 65.99,
        source: 'TCGPlayer',
        affiliateLink: 'https://www.tcgplayer.com/product/liliana',
        imageUrl: 'https://product-images.tcgplayer.com/fit-in/437x437/52678.jpg'
    },
    {
        cardName: 'Mewtwo EX (Full Art)',
        price: 35.00,
        source: 'eBay',
        affiliateLink: 'https://www.ebay.com/itm/mewtwo-ex',
        imageUrl: 'https://product-images.tcgplayer.com/fit-in/437x437/64002.jpg'
    },
    {
        cardName: 'Jace, the Mind Sculptor',
        price: 89.50,
        source: 'TCGPlayer',
        affiliateLink: 'https://www.tcgplayer.com/product/jace',
        imageUrl: 'https://product-images.tcgplayer.com/fit-in/437x437/36163.jpg'
    },
    {
        cardName: 'Exodia the Forbidden One',
        price: 85.00,
        source: 'eBay',
        affiliateLink: 'https://www.ebay.com/itm/exodia',
        imageUrl: 'https://product-images.tcgplayer.com/fit-in/437x437/18694.jpg'
    }
];

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing deals
        await Deal.deleteMany({});
        console.log('Cleared existing deals');

        // Insert sample deals
        for (const deal of sampleDeals) {
            await Deal.create(deal);
        }

        console.log(`✅ Successfully added ${sampleDeals.length} sample deals!`);

        // Show what was added
        const deals = await Deal.find().sort({ price: 1 });
        console.log('\nDeals in database:');
        deals.forEach(deal => {
            console.log(`- ${deal.cardName}: $${deal.price} (${deal.source})`);
        });

        await mongoose.disconnect();
        console.log('\n✓ Disconnected from MongoDB');

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

seedDatabase();
