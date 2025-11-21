// Simple test without axios
const http = require('http');

http.get('http://localhost:5000/api/deals', (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Headers:`, res.headers);

        if (res.statusCode === 200) {
            const deals = JSON.parse(data);
            console.log(`\n✅ Found ${deals.length} deals`);
            if (deals.length > 0) {
                console.log('\nFirst 3 deals:');
                deals.slice(0, 3).forEach(deal => {
                    console.log(`- ${deal.cardName}: $${deal.price}`);
                });
            }
        } else {
            console.log(`❌ Error: ${res.statusCode}`);
            console.log(data);
        }
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
});
