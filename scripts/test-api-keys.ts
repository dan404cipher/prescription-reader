// Quick test script for Google Cloud Vision API
// Run with: npx tsx scripts/test-api-keys.ts

import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
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
const OPENAI_API_KEY = envVars.OPENAI_API_KEY;

async function testGoogleVision() {
    console.log('\n🔍 Testing Google Cloud Vision API...');

    if (!GOOGLE_CLOUD_API_KEY || GOOGLE_CLOUD_API_KEY === 'your_google_cloud_api_key_here') {
        console.log('❌ Google Cloud API key not configured');
        return false;
    }

    try {
        // Test with a simple base64 image (1x1 white pixel)
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

        if (data.error) {
            console.log('❌ Google Vision API Error:', data.error.message);
            return false;
        }

        if (data.responses) {
            console.log('✅ Google Cloud Vision API is working!');
            return true;
        }

        console.log('⚠️ Unexpected response:', JSON.stringify(data, null, 2));
        return false;
    } catch (error) {
        console.log('❌ Connection error:', error);
        return false;
    }
}

async function testOpenAI() {
    console.log('\n🤖 Testing OpenAI API...');

    if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your_openai_api_key_here') {
        console.log('❌ OpenAI API key not configured');
        return false;
    }

    try {
        const response = await fetch('https://api.openai.com/v1/models', {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
            },
        });

        if (response.ok) {
            console.log('✅ OpenAI API is working!');
            return true;
        } else {
            const error = await response.json();
            console.log('❌ OpenAI API Error:', error.error?.message || 'Unknown error');
            return false;
        }
    } catch (error) {
        console.log('❌ Connection error:', error);
        return false;
    }
}

async function main() {
    console.log('🔑 API Key Verification Test\n');
    console.log('='.repeat(40));

    const googleOk = await testGoogleVision();
    const openaiOk = await testOpenAI();

    console.log('\n' + '='.repeat(40));
    console.log('\n📊 Summary:');
    console.log(`   Google Vision: ${googleOk ? '✅ Working' : '❌ Not working'}`);
    console.log(`   OpenAI:        ${openaiOk ? '✅ Working' : '❌ Not working'}`);

    if (googleOk && openaiOk) {
        console.log('\n🎉 All APIs configured correctly! You can now analyze prescriptions.\n');
    } else {
        console.log('\n⚠️  Some APIs need attention. Check the errors above.\n');
    }
}

main();
