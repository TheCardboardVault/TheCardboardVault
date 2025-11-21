const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const Deal = require('./models/deal');
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Successfully connected to MongoDB Atlas!'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5001'], // Allow Vite dev server and API calls
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());

// Auth routes
// Auth routes
app.use('/api/auth', authRoutes);

// Root route for health check
app.get('/', (req, res) => {
    res.json({ message: 'The Cardboard Vault API is running 🚀' });
});


// API route to get all deals
app.get('/api/deals', async (req, res) => {
    try {
        const { search } = req.query;

        // If search term provided, trigger fresh scraping first
        if (search && search.trim() !== '') {
            console.log(`[API] Triggering scrape for: "${search}"`);

            // // Import scraper
            // const { scrapeAll } = require('./scrapers');

            // // Run scrape and wait for it to complete
            // try {
            //     const count = await scrapeAll(search, mongoose);
            //     console.log(`[API] Scrape completed: ${count} deals found`);
            // } catch (scrapeErr) {
            //     console.error(`[API] Scrape error:`, scrapeErr.message);
            //     // Continue to search DB even if scrape fails
            // }
            console.log('[API] Scraping temporarily disabled for deployment.');
        }

        // Build query
        let query = {};
        if (search) {
            query = {
                cardName: { $regex: search, $options: 'i' }
            };
        }

        // Fetch from database
        const deals = await Deal.find(query).sort({ price: 1 }).limit(100);

        res.json({
            success: true,
            count: deals.length,
            searchTerm: search || null,
            deals: deals
        });
    } catch (err) {
        console.error('Error fetching deals:', err);
        res.status(500).json({
            success: false,
            message: 'Error fetching deals from the database.'
        });
    }
});

// API route to trigger scraping
app.post('/api/scrape', async (req, res) => {
    try {
        const { searchTerm } = req.body;

        if (!searchTerm || searchTerm.trim() === '') {
            return res.status(400).json({ message: 'searchTerm is required' });
        }

        // // Import scraper
        // const { scrapeAll } = require('./scrapers');

        // // Run scrape in background (don't await)
        // scrapeAll(searchTerm, mongoose).then(count => {
        //     console.log(`[API] Scrape for "${searchTerm}" completed: ${count} deals`);
        // }).catch(err => {
        //     console.error(`[API] Scrape for "${searchTerm}" failed:`, err.message);
        // });
        console.log('[API] Scraping temporarily disabled for deployment.');

        res.json({
            message: `Scraping for "${searchTerm}" initiated. Check back in a moment!`,
            searchTerm
        });

    } catch (err) {
        console.error('Error triggering scrape:', err);
        res.status(500).json({ message: 'Error triggering scrape.' });
    }
});

app.listen(PORT, () => {
    console.log(`API Server is running on http://localhost:${PORT}`);
});