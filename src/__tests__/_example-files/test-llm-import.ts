import fs from 'fs';
import path from 'path';

// Define the mock request url and endpoint behavior
const TEST_ENDPOINT = 'http://localhost:3000/api/parse-statement';
const FILE_PATH = path.resolve(__dirname, 'import-statement-example.pdf');

async function run() {
    if (!fs.existsSync(FILE_PATH)) {
        console.error('Test PDF file not found at:', FILE_PATH);
        process.exit(1);
    }

    const fileBuffer = fs.readFileSync(FILE_PATH);
    const blob = new Blob([fileBuffer], { type: 'application/pdf' });

    const formData = new FormData();
    formData.append('file', blob, 'import-statement-example.pdf');

    console.log('Sending test PDF to endpoint...');

    try {
        const res = await fetch(TEST_ENDPOINT, {
            method: 'POST',
            body: formData,
        });

        if (!res.ok) {
            console.error('Endpoint failed with status:', res.status, res.statusText);
            const errBody = await res.text();
            console.error('Error Body:', errBody);
            return;
        }

        const json = await res.json();
        console.log('--- Successfully Parsed Response ---');
        console.log(JSON.stringify(json.transactions, null, 2));

    } catch (err) {
        console.error('Fetch failed', err);
    }
}

run();
