const axios = require('axios');

const API_URL = 'http://localhost:5001/api/auth';

async function testAuth() {
    console.log('🧪 Starting Auth Verification...');

    // Generate random user
    const randomId = Math.floor(Math.random() * 10000);
    const testUser = {
        username: `testuser${randomId}`,
        email: `test${randomId}@example.com`,
        password: 'password123'
    };

    try {
        // 1. Register
        console.log(`\n1. Registering user: ${testUser.username}...`);
        const registerRes = await axios.post(`${API_URL}/register`, testUser);

        if (registerRes.status === 201) {
            console.log('✅ Registration successful');
            console.log('Token received:', !!registerRes.data.token);
        } else {
            console.log('❌ Registration failed:', registerRes.data);
            return;
        }

        // 2. Login
        console.log(`\n2. Logging in user...`);
        const loginRes = await axios.post(`${API_URL}/login`, {
            email: testUser.email,
            password: testUser.password
        });

        if (loginRes.status === 200) {
            console.log('✅ Login successful');
            const token = loginRes.data.token;

            // 3. Get Me (Protected Route)
            console.log(`\n3. Accessing protected route (/me)...`);
            const meRes = await axios.get(`${API_URL}/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (meRes.status === 200) {
                console.log('✅ Protected route accessed successfully');
                console.log('User data:', meRes.data.user);

                if (meRes.data.user.email === testUser.email) {
                    console.log('✅ User data matches');
                } else {
                    console.log('❌ User data mismatch');
                }
            }
        }

        console.log('\n🎉 Auth Flow Verification Complete!');

    } catch (error) {
        console.error('\n❌ Test Failed:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else if (error.request) {
            console.error('No response received. Request:', error.request);
        } else {
            console.error('Error config:', error.config);
        }
    }
}

testAuth();
