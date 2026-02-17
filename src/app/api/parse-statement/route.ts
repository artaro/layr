import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `You are a financial data extraction assistant. Given raw text content from a bank statement (CSV or PDF), extract all transactions and return them as a JSON array.

Each transaction must have these fields:
- "date": string in YYYY-MM-DD format
- "time": string in HH:mm format (24-hour), or empty string if not found
- "description": string describing the transaction
- "amount": number (always positive)
- "type": either "income" or "expense"

Rules:
- If the amount is negative or described as a debit/withdrawal/payment, it is an "expense"
- If the amount is positive or described as a credit/deposit/salary, it is an "income"
- Always use positive numbers for the amount field
- Parse dates into YYYY-MM-DD format regardless of the original format
- Parse times into HH:mm (24-hour) format. If no time is present, use an empty string ""
- Keep the original description text, clean up any extra whitespace
- If you cannot determine income vs expense, default to "expense"
- Return ONLY a valid JSON array, no markdown, no explanation, no extra text

Example output:
[{"date":"2026-01-15","time":"12:30","description":"Lunch at CentralWorld","amount":350,"type":"expense"},{"date":"2026-01-14","time":"","description":"Salary","amount":45000,"type":"income"}]`;

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid "text" field' },
        { status: 400 }
      );
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY is not configured' },
        { status: 500 }
      );
    }

    // Truncate to avoid token limits (~32k chars should be safe for most statements)
    const truncatedText = text.substring(0, 32000);

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Extract all transactions from this bank statement:\n\n${truncatedText}`,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1,
      max_tokens: 8000,
      response_format: { type: 'json_object' },
    });

    const content = chatCompletion.choices[0]?.message?.content || '[]';

    // Parse the LLM response — it might return { transactions: [...] } or just [...]
    let transactions;
    try {
      const parsed = JSON.parse(content);
      transactions = Array.isArray(parsed) ? parsed : parsed.transactions || [];
    } catch {
      return NextResponse.json(
        { error: 'Failed to parse LLM response', raw: content },
        { status: 500 }
      );
    }

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error('Parse statement error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
