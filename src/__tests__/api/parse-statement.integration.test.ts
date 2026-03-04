/**
 * Integration test: parse-statement API with real PDF
 *
 * Sends `import-statement-example.pdf` (KBank Feb 2026 statement)
 * to the parse-statement endpoint and verifies extracted transactions.
 *
 * Prerequisites:
 *   1. Dev server running: `npm run dev`
 *   2. LLM_API_KEY configured in .env.local
 *
 * Run: npx jest src/__tests__/api/parse-statement.integration.test.ts
 *
 * @jest-environment node
 */

import fs from 'fs';
import path from 'path';

// ── Config ───────────────────────────────────────────────────────────────────

const API_URL = process.env.TEST_API_URL || 'http://localhost:3000/api/parse-statement';
const PDF_PATH = path.resolve(__dirname, '../_example-files/import-statement-example.pdf');

// ── Expected transactions from the PDF (KBank Feb 2026) ─────────────────────
// Derived from all 3 pages. "ยอดยกมา" (balance carry-forward) rows excluded.

interface ExpectedTx {
    date: string;
    amount: number;
    type: 'income' | 'expense';
    descriptionContains?: string;
}

const EXPECTED_TRANSACTIONS: ExpectedTx[] = [
    // Page 1
    { date: '2026-02-02', amount: 150.00, type: 'expense', descriptionContains: 'X9772' },
    { date: '2026-02-02', amount: 1100.00, type: 'expense', descriptionContains: 'X7314' },
    { date: '2026-02-03', amount: 47.80, type: 'expense', descriptionContains: 'XHSF0' },
    { date: '2026-02-04', amount: 32614.01, type: 'income', descriptionContains: 'X7043' },
    { date: '2026-02-04', amount: 1826.68, type: 'expense', descriptionContains: 'X2198' },
    { date: '2026-02-04', amount: 12861.64, type: 'expense', descriptionContains: 'X3608' },
    { date: '2026-02-04', amount: 1745.83, type: 'expense', descriptionContains: 'X3914' },
    { date: '2026-02-04', amount: 25.00, type: 'expense', descriptionContains: 'X5738' },
    { date: '2026-02-04', amount: 169.00, type: 'expense', descriptionContains: 'X4043' },
    { date: '2026-02-04', amount: 59.00, type: 'expense', descriptionContains: 'X2001' },
    { date: '2026-02-04', amount: 89.00, type: 'expense', descriptionContains: 'X2001' },
    { date: '2026-02-05', amount: 160.00, type: 'expense', descriptionContains: 'X5706' },
    { date: '2026-02-06', amount: 95.00, type: 'expense', descriptionContains: 'X1075' },
    { date: '2026-02-07', amount: 47.80, type: 'expense', descriptionContains: 'XC6QG' },
    { date: '2026-02-08', amount: 298.50, type: 'expense', descriptionContains: 'XTHTG' },
    { date: '2026-02-08', amount: 298.50, type: 'expense', descriptionContains: 'X0S2G' },
    { date: '2026-02-08', amount: 298.50, type: 'expense', descriptionContains: 'XP360' },
    { date: '2026-02-09', amount: 1000.00, type: 'expense', descriptionContains: 'X4841' },
    { date: '2026-02-10', amount: 11.00, type: 'expense', descriptionContains: 'X4043' },
    { date: '2026-02-10', amount: 148.00, type: 'expense', descriptionContains: 'X5093' },
    { date: '2026-02-11', amount: 10.00, type: 'expense', descriptionContains: 'X9190' },
    { date: '2026-02-11', amount: 75.00, type: 'expense', descriptionContains: 'X2001' },
    { date: '2026-02-11', amount: 79.00, type: 'expense', descriptionContains: 'X7202' },
    { date: '2026-02-12', amount: 185.00, type: 'expense', descriptionContains: 'X9952' },
    { date: '2026-02-13', amount: 160.00, type: 'expense', descriptionContains: 'X5706' },
    { date: '2026-02-13', amount: 15.00, type: 'expense', descriptionContains: 'X9873' },
    { date: '2026-02-13', amount: 114.00, type: 'expense', descriptionContains: 'X0001' },
    { date: '2026-02-13', amount: 75.00, type: 'expense', descriptionContains: 'X2001' },
    // Page 2
    { date: '2026-02-13', amount: 199.00, type: 'expense', descriptionContains: 'X6001' },
    { date: '2026-02-14', amount: 720.00, type: 'expense', descriptionContains: 'X7442' },
    { date: '2026-02-15', amount: 290.00, type: 'expense', descriptionContains: 'X5112' },
    { date: '2026-02-15', amount: 12982.00, type: 'expense', descriptionContains: 'X8792' },
    { date: '2026-02-15', amount: 344.00, type: 'expense', descriptionContains: 'X2369' },
    { date: '2026-02-16', amount: 20.00, type: 'expense', descriptionContains: 'X4043' },
    { date: '2026-02-16', amount: 2266.72, type: 'expense', descriptionContains: 'X8004' },
    { date: '2026-02-16', amount: 160.00, type: 'expense', descriptionContains: 'X6687' },
    { date: '2026-02-17', amount: 145.00, type: 'expense', descriptionContains: 'X9952' },
    { date: '2026-02-19', amount: 125.00, type: 'expense', descriptionContains: 'X9952' },
    { date: '2026-02-19', amount: 200.00, type: 'expense', descriptionContains: 'X3589' },
    { date: '2026-02-21', amount: 799.00, type: 'expense', descriptionContains: 'X9827' },
    { date: '2026-02-21', amount: 35.00, type: 'expense', descriptionContains: 'X7255' },
    { date: '2026-02-22', amount: 328.00, type: 'expense', descriptionContains: 'X6015' },
    { date: '2026-02-22', amount: 180.00, type: 'expense', descriptionContains: 'X8778' },
    { date: '2026-02-22', amount: 120.00, type: 'expense', descriptionContains: 'X3964' },
    { date: '2026-02-22', amount: 200.00, type: 'expense', descriptionContains: 'X3589' },
    { date: '2026-02-23', amount: 170.00, type: 'expense', descriptionContains: 'X9952' },
    { date: '2026-02-23', amount: 1550.00, type: 'expense', descriptionContains: 'X1613' },
    { date: '2026-02-24', amount: 150.00, type: 'expense', descriptionContains: 'X5519' },
    { date: '2026-02-24', amount: 25.00, type: 'expense', descriptionContains: 'X4987' },
    { date: '2026-02-24', amount: 169.00, type: 'expense', descriptionContains: 'X5093' },
    { date: '2026-02-24', amount: 200.00, type: 'expense', descriptionContains: 'X3589' },
    { date: '2026-02-25', amount: 2000.00, type: 'expense', descriptionContains: 'X4841' },
    { date: '2026-02-25', amount: 115.00, type: 'expense', descriptionContains: 'X9725' },
    { date: '2026-02-25', amount: 11.00, type: 'expense', descriptionContains: 'X4043' },
    // Page 3
    { date: '2026-02-25', amount: 55.00, type: 'expense', descriptionContains: 'X2001' },
    { date: '2026-02-27', amount: 40.00, type: 'expense', descriptionContains: 'X1119' },
    { date: '2026-02-28', amount: 125.00, type: 'expense', descriptionContains: 'X9952' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

async function sendPdfToEndpoint(): Promise<{
    status: number;
    body: { transactions?: Array<{ date: string; amount: number; type: string; description: string; time?: string }>; error?: string };
}> {
    const fileBuffer = fs.readFileSync(PDF_PATH);
    const blob = new Blob([fileBuffer], { type: 'application/pdf' });
    const formData = new FormData();
    formData.append('file', blob, 'import-statement-example.pdf');

    const res = await fetch(API_URL, { method: 'POST', body: formData });
    const body = await res.json();
    return { status: res.status, body };
}

async function isServerRunning(): Promise<boolean> {
    try {
        const res = await fetch(API_URL, { method: 'GET' });
        // Even a 405 means the server is up
        return res.status !== 0;
    } catch {
        return false;
    }
}

// ── Tests ────────────────────────────────────────────────────────────────────

let serverUp = false;
let cachedResponse: Awaited<ReturnType<typeof sendPdfToEndpoint>> | null = null;

/** Call the API once and cache the result for all tests */
async function getResponse() {
    if (!cachedResponse) {
        cachedResponse = await sendPdfToEndpoint();
    }
    return cachedResponse;
}

beforeAll(async () => {
    if (!fs.existsSync(PDF_PATH)) {
        console.warn('⚠ Test PDF not found at:', PDF_PATH);
        return;
    }
    serverUp = await isServerRunning();
    if (!serverUp) {
        console.warn('⚠ Dev server not running. Skipping integration tests. Start with: npm run dev');
    }
});

// Integration tests skipped if dev server is not running
// describeIf logic removed to fix unused variable lint error

describe('POST /api/parse-statement — KBank PDF import', () => {

    beforeEach(() => {
        if (!serverUp) {
            console.warn('Skipping: dev server not running');
        }
    });

    // itIfServer logic removed to fix unused variable lint error

    it('should return 200 with transactions array', async () => {
        if (!serverUp) return;
        const { status, body } = await getResponse();

        expect(status).toBe(200);
        expect(body.transactions).toBeDefined();
        expect(Array.isArray(body.transactions)).toBe(true);
        expect(body.transactions!.length).toBeGreaterThan(0);
    }, 120_000);

    it('should extract approximately 57 transactions', async () => {
        if (!serverUp) return;
        const { body } = await getResponse();
        const count = body.transactions!.length;

        // Allow ±3 tolerance for LLM extraction variance
        expect(count).toBeGreaterThanOrEqual(EXPECTED_TRANSACTIONS.length - 3);
        expect(count).toBeLessThanOrEqual(EXPECTED_TRANSACTIONS.length + 3);
    }, 120_000);

    it('should have valid structure for every transaction', async () => {
        if (!serverUp) return;
        const { body } = await getResponse();

        for (const tx of body.transactions!) {
            expect(tx.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
            expect(typeof tx.amount).toBe('number');
            expect(tx.amount).toBeGreaterThan(0);
            expect(['income', 'expense']).toContain(tx.type);
            expect(typeof tx.description).toBe('string');
            expect(tx.description.length).toBeGreaterThan(0);
        }
    }, 120_000);

    it('should identify exactly 1 income transaction (32,614.01 received on 2026-02-04)', async () => {
        if (!serverUp) return;
        const { body } = await getResponse();

        const incomes = body.transactions!.filter((t) => t.type === 'income');
        expect(incomes.length).toBe(1);
        expect(incomes[0].amount).toBeCloseTo(32614.01, 0);
        expect(incomes[0].date).toBe('2026-02-04');
    }, 120_000);

    it('should extract dates in February 2026 only', async () => {
        if (!serverUp) return;
        const { body } = await getResponse();

        for (const tx of body.transactions!) {
            expect(tx.date).toMatch(/^2026-02-/);
        }
    }, 120_000);

    it('should match key transactions by date, amount, and type', async () => {
        if (!serverUp) return;
        const { body } = await getResponse();
        const txs = body.transactions!;

        // Spot-check unique transactions by date + amount + type
        const spotChecks: Omit<ExpectedTx, 'descriptionContains'>[] = [
            { date: '2026-02-04', amount: 1826.68, type: 'expense' },   // TTB transfer
            { date: '2026-02-04', amount: 12861.64, type: 'expense' },  // Krungsri card
            { date: '2026-02-04', amount: 32614.01, type: 'income' },   // KK transfer in
            { date: '2026-02-21', amount: 35.00, type: 'expense' },     // MUJI
            { date: '2026-02-16', amount: 2266.72, type: 'expense' },   // MITTARE insurance
            { date: '2026-02-23', amount: 1550.00, type: 'expense' },   // Krungthai card
            { date: '2026-02-28', amount: 125.00, type: 'expense' },    // Last tx page 3
        ];

        const missing: string[] = [];
        for (const check of spotChecks) {
            const match = txs.find(
                (t) =>
                    t.date === check.date &&
                    Math.abs(t.amount - check.amount) < 0.02 &&
                    t.type === check.type
            );
            if (!match) {
                missing.push(`${check.date} ฿${check.amount} ${check.type}`);
            }
        }
        expect(missing).toEqual([]);
    }, 120_000);

    it('should extract detailed descriptions from รายละเอียด column, not generic รายการ', async () => {
        if (!serverUp) return;
        const { body } = await getResponse();
        const txs = body.transactions!;

        // The system prompt instructs to use 'รายละเอียด' (detail) column.
        // Generic descriptions like "ชำระเงิน" or "โอนเงิน" come from 'รายการ'
        // (transaction type) column and are NOT useful for identifying transactions.
        const genericDescriptions = ['ชำระเงิน', 'โอนเงิน', 'รับโอนเงิน', 'หักบัญชี'];
        const genericCount = txs.filter((t) =>
            genericDescriptions.includes(t.description.trim())
        ).length;

        // If most descriptions are generic, the LLM is reading the wrong column
        const genericPercentage = (genericCount / txs.length) * 100;

        // Expectation: descriptions should be detailed (contain ref codes like X1234,
        // merchant names, account info). Allow at most 20% generic.
        if (genericPercentage > 20) {
            console.warn(
                `⚠ ${genericPercentage.toFixed(0)}% of descriptions are generic (ชำระเงิน/โอนเงิน). ` +
                `LLM may be reading 'รายการ' column instead of 'รายละเอียด'. ` +
                `Consider updating the system prompt to be more explicit.`
            );
        }
        expect(genericPercentage).toBeLessThan(20);
    }, 120_000);

    it('should NOT include balance carry-forward rows (ยอดยกมา)', async () => {
        if (!serverUp) return;
        const { body } = await getResponse();

        const carryForwards = body.transactions!.filter((t) =>
            t.description.includes('ยอดยกมา')
        );
        expect(carryForwards).toHaveLength(0);
    }, 120_000);

    it('should have all amounts as positive numbers', async () => {
        if (!serverUp) return;
        const { body } = await getResponse();

        for (const tx of body.transactions!) {
            expect(typeof tx.amount).toBe('number');
            expect(tx.amount).toBeGreaterThan(0);
        }
    }, 120_000);

    it('expense total should be within 5% of expected sum', async () => {
        if (!serverUp) return;
        const { body } = await getResponse();

        const actualExpenseTotal = body.transactions!
            .filter((t) => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const expectedExpenseTotal = EXPECTED_TRANSACTIONS
            .filter((t) => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const tolerance = expectedExpenseTotal * 0.05;
        expect(actualExpenseTotal).toBeGreaterThan(expectedExpenseTotal - tolerance);
        expect(actualExpenseTotal).toBeLessThan(expectedExpenseTotal + tolerance);
    }, 120_000);

    it('should log full response for manual inspection', async () => {
        if (!serverUp) return;
        const { body } = await getResponse();
        const txs = body.transactions!;

        console.log(`\n📊 Parsed ${txs.length} transactions from KBank PDF`);
        console.log(`   Income:  ${txs.filter(t => t.type === 'income').length} txns`);
        console.log(`   Expense: ${txs.filter(t => t.type === 'expense').length} txns`);
        console.log(`   Total expense: ฿${txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0).toLocaleString()}`);
        console.log(`   Total income:  ฿${txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0).toLocaleString()}`);

        // Print first 5 for quick inspection
        console.log('\n   Sample transactions:');
        txs.slice(0, 5).forEach((t, i) => {
            console.log(`   ${i + 1}. ${t.date} | ${t.type.padEnd(7)} | ฿${t.amount.toLocaleString().padStart(10)} | ${t.description.substring(0, 60)}`);
        });
    }, 120_000);
});
