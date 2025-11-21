const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing MongoDB connection...');
console.log('URI:', process.env.MONGO_URI.replace(/:[^:@]+@/, ':****@')); // Hide password

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ Successfully connected to MongoDB!');
        return mongoose.connection.db.admin().ping();
    })
    .then(() => {
        console.log('✅ Ping successful!');
        return mongoose.disconnect();
    })
    .then(() => {
        console.log('✅ Disconnected successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Connection failed:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    });
