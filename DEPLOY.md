# Render Deployment Guide

## Quick Deploy to Render

1. **Connect to GitHub**:
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `TheCardboardVault/TheCardboardVault`

2. **Configure Service**:
   - Render will auto-detect the `render.yaml` file
   - Or manually set:
     - **Build Command**: `cd server && npm install`
     - **Start Command**: `cd server && npm start`
     - **Environment**: Node

3. **Set Environment Variables**:
   In the Render dashboard, add these environment variables:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random string for JWT tokens
   - `NODE_ENV`: `production`

4. **Deploy**:
   - Click "Create Web Service"
   - Render will build and deploy automatically
   - Your API will be available at: `https://the-cardboard-vault-api.onrender.com`

## Seed the Database

After deployment, seed the database with sample data:

```bash
# From the server directory
node seed-data.js
```

This will add 10 sample card deals to your database.

## Verify Deployment

1. Visit your API URL: `https://the-cardboard-vault-api.onrender.com`
   - Should see: `{"message": "The Cardboard Vault API is running 🚀"}`

2. Check the deals endpoint: `https://the-cardboard-vault-api.onrender.com/api/deals`
   - Should return JSON with card deals

3. Visit your frontend: `https://thecardboardvault.github.io/TheCardboardVault/`
   - Cards should now load!

## Troubleshooting

- **504 Gateway Timeout**: Render free tier spins down after inactivity. First request may take 30-60 seconds.
- **No cards showing**: Run the seed script to populate the database.
- **CORS errors**: Ensure the GitHub Pages URL is in the CORS configuration (already added).
