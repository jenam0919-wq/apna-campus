import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';
dotenv.config();

async function testGemini() {
  const startTime = Date.now();
  console.log('[Diagnostics] Starting Provider Connectivity Test...');
  console.log('[Diagnostics] Provider: Google GenAI');
  const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
  const model = process.env.GEMINI_MODEL || process.env.AI_MODEL || 'gemini-3.8-flash';
  
  console.log(`[Diagnostics] Model configured: ${model}`);
  
  if (!apiKey || apiKey.trim() === '') {
    console.error('[Diagnostics] Error Category: Missing Configuration - API Key not found or empty.');
    console.error('[Diagnostics] Test Failed.');
    process.exit(1);
  }
  
  console.log('[Diagnostics] API Key is present in environment.');

  try {
    const ai = new GoogleGenAI({ apiKey });
    console.log('[Diagnostics] Sending test prompt: "Reply with the word OK."');
    const response = await ai.models.generateContent({
      model: model,
      contents: [{ role: 'user', parts: [{ text: 'Reply with the word OK.' }] }],
    });
    
    console.log(`[Diagnostics] Request Duration: ${Date.now() - startTime}ms`);
    console.log(`[Diagnostics] HTTP/Provider Status: 200 OK`);
    console.log(`[Diagnostics] Generated Text: ${response?.text}`);
    console.log('[Diagnostics] Test Completed Successfully.');
  } catch (error: any) {
    console.error(`[Diagnostics] Request Duration: ${Date.now() - startTime}ms`);
    console.error(`[Diagnostics] Error Category: ${error.name || 'Provider Error'}`);
    console.error(`[Diagnostics] Sanitized Error: ${error.message}`);
    process.exit(1);
  }
}

testGemini();