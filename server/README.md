# TCG Deal Finder - Server

Backend API and scraper for The Cardboard Vault.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your MongoDB connection:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/tcgdeals
PORT=5000
```

## Running the Server

Start the API server:
```bash
node server.js
```

The server will run on `http://localhost:5000`.

## Running the Scraper

Run the scraper manually to populate deals:
```bash
node scraper.js
```

The scraper will search for popular cards across TCGPlayer and eBay.

## API Endpoints

### GET `/api/deals`
Get all deals, sorted by price (lowest first).

**Query Parameters:**
- `search` (optional): Filter deals by card name

**Example:**
```bash
curl http://localhost:5000/api/deals?search=charizard
```

### POST `/api/scrape`
Trigger a scrape for a specific card.

**Body:**
```json
{
  "searchTerm": "pikachu vmax"
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"searchTerm": "pikachu vmax"}'
```

## Project Structure

```
server/
├── server.js          # Express API server
├── scraper.js         # Main scraper entry point
├── models/
│   └── deal.js        # MongoDB Deal schema
└── scrapers/
    ├── index.js       # Scraper coordinator
    ├── tcgplayer.js   # TCGPlayer scraper
    └── ebay.js        # eBay scraper
```
