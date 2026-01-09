// Detailed Google Cloud Vision API Diagnostics
// Run with: npx tsx scripts/diagnose-google-cloud.ts

import * as fs from 'fs';
import * as path from 'path';

const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars: Record<string, string> = {};

envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && !key.startsWith('#')) {
        envVars[key.trim()] = valueParts.join('=').trim();
    }
});

const GOOGLE_CLOUD_API_KEY = envVars.GOOGLE_CLOUD_API_KEY;

async function diagnoseGoogleCloud() {
    console.log('🔍 Google Cloud Vision API Diagnostics\n');
    console.log('='.repeat(50));

    // Check 1: API Key exists
    console.log('\n1️⃣ Checking API Key...');
    if (!GOOGLE_CLOUD_API_KEY || GOOGLE_CLOUD_API_KEY === 'your_google_cloud_api_key_here') {
        console.log('   ❌ API key not configured in .env.local');
        return;
    }
    console.log(`   ✅ API key found (${GOOGLE_CLOUD_API_KEY.substring(0, 10)}...)`);

    // Check 2: Test API with simple request
    console.log('\n2️⃣ Testing API connection...');
    try {
        const testImage = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

        const response = await fetch(
            `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_CLOUD_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    requests: [{
                        image: { content: testImage },
                        features: [{ type: 'LABEL_DETECTION', maxResults: 1 }]
                    }]
                }),
            }
        );

        const data = await response.json();

        console.log('\n📋 Full API Response:');
        console.log(JSON.stringify(data, null, 2));

        if (data.error) {
            console.log('\n❌ API Error Details:');
            console.log(`   Code: ${data.error.code}`);
            console.log(`   Status: ${data.error.status}`);
            console.log(`   Message: ${data.error.message}`);

            console.log('\n💡 Troubleshooting Steps:');
            console.log('   1. Make sure you enabled billing at:');
            console.log('      https://console.cloud.google.com/billing');
            console.log('   2. Verify the Cloud Vision API is enabled:');
            console.log('      https://console.cloud.google.com/apis/library/vision.googleapis.com');
            console.log('   3. Check if your API key has the right permissions:');
            console.log('      https://console.cloud.google.com/apis/credentials');
            console.log('   4. Wait 5-10 minutes after enabling billing');
            console.log('   5. Try creating a NEW API key after billing is enabled');

            return;
        }

        if (data.responses) {
            console.log('\n✅ Google Cloud Vision API is working perfectly!');
            return;
        }

    } catch (error) {
        console.log('   ❌ Network error:', error);
    }
}

diagnoseGoogleCloud();
