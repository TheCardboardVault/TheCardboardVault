const axios = require('axios');

const API_URL = 'http://localhost:5001/api/auth';

async function testFeatures() {
    console.log('🧪 Starting Features Verification...');

    // Generate random user
    const randomId = Math.floor(Math.random() * 10000);
    const testUser = {
        username: `featureUser${randomId}`,
        email: `feature${randomId}@example.com`,
        password: 'password123'
    };

    let token = '';

    try {
        // 1. Register
        console.log(`\n1. Registering user: ${testUser.username}...`);
        const registerRes = await axios.post(`${API_URL}/register`, testUser);
        token = registerRes.data.token;
        console.log('✅ Registration successful');

        // 2. Update Profile (Theme & Username)
        console.log(`\n2. Updating profile (Theme: emerald, Username: updatedUser${randomId})...`);
        const updateRes = await axios.put(`${API_URL}/update`, {
            username: `updatedUser${randomId}`,
            theme: 'emerald'
        }, { headers: { Authorization: `Bearer ${token}` } });

        if (updateRes.data.user.theme === 'emerald' && updateRes.data.user.username === `updatedUser${randomId}`) {
            console.log('✅ Profile update successful');
        } else {
            console.log('❌ Profile update failed:', updateRes.data);
        }

        // 3. Bad Word Validation
        console.log(`\n3. Testing bad word validation...`);
        try {
            await axios.put(`${API_URL}/update`, {
                username: 'adminUser'
            }, { headers: { Authorization: `Bearer ${token}` } });
            console.log('❌ Bad word validation FAILED (Should have rejected)');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.log('✅ Bad word validation successful (Rejected as expected)');
            } else {
                console.log('❌ Unexpected error:', error.message);
            }
        }

        // 4. Claim Daily Reward
        console.log(`\n4. Claiming daily reward...`);
        const rewardRes = await axios.post(`${API_URL}/reward`, {
            action: 'daily_login'
        }, { headers: { Authorization: `Bearer ${token}` } });

        if (rewardRes.data.pointsAdded === 50) {
            console.log('✅ Daily reward claimed (+50 points)');
        } else {
            console.log('❌ Daily reward failed:', rewardRes.data);
        }

        // 5. Claim Duplicate Reward
        console.log(`\n5. Attempting duplicate claim...`);
        try {
            await axios.post(`${API_URL}/reward`, {
                action: 'daily_login'
            }, { headers: { Authorization: `Bearer ${token}` } });
            console.log('❌ Duplicate claim FAILED (Should have rejected)');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.log('✅ Duplicate claim rejected as expected');
            } else {
                console.log('❌ Unexpected error:', error.message);
            }
        }

        console.log('\n🎉 Features Verification Complete!');

    } catch (error) {
        console.error('\n❌ Test Failed:', error.response ? error.response.data : error.message);
    }
}

testFeatures();
