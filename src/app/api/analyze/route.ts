import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { buildExtractionPrompt } from '@/ai/prompts/prescription_extraction';
import { getConfidenceLevel } from '@/ai/analysis/aggregate';
import { normalizeMedicine, normalizeFrequency, normalizeDiagnosis } from '@/ai/normalization/medical_terms';
import { PrescriptionResult } from '@/types/prescription';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

/**
 * Use OpenAI Vision API for handwriting OCR
 */
async function performOCR(imageBase64: string): Promise<string> {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API key not configured');
    }

    console.log('[OCR] Using OpenAI Vision with model:', OPENAI_MODEL);

    const completion = await openai.chat.completions.create({
        model: OPENAI_MODEL,
        messages: [
            {
                role: 'system',
                content: 'You are an OCR assistant. Extract ALL visible text from the image exactly as written, preserving the original layout and line breaks. Include all handwritten text, even if unclear.',
            },
            {
                role: 'user',
                content: [
                    {
                        type: 'text',
                        text: 'Please extract all text from this prescription image. Return only the extracted text, preserving line breaks and layout.',
                    },
                    {
                        type: 'image_url',
                        image_url: {
                            url: `data:image/jpeg;base64,${imageBase64}`,
                            detail: 'high',
                        },
                    },
                ],
            },
        ],
        max_tokens: 1000,
    });

    const extractedText = completion.choices[0]?.message?.content || '';
    console.log('[OCR] Extracted text length:', extractedText.length);
    return extractedText;
}

/**
 * Use OpenAI to extract structured prescription data
 */
async function extractWithLLM(ocrText: string): Promise<{
    patient: { name?: string; age?: number; gender?: string };
    doctor: { name?: string; department?: string };
    visit: { date?: string; type?: string };
    clinical: { symptoms: string[]; diagnosis: string[] };
    medicines: Array<{ name: string; dosage?: string; frequency?: string; duration?: string }>;
    additionalNotes?: { advice?: string; followUp?: string };
    confidence: number;
}> {
    console.log('[LLM] Extracting structured data...');
    const prompt = buildExtractionPrompt(ocrText);

    const completion = await openai.chat.completions.create({
        model: OPENAI_MODEL,
        messages: [
            {
                role: 'system',
                content: 'You are a medical AI assistant that extracts structured data from prescription text. Always respond with valid JSON only, no markdown.',
            },
            {
                role: 'user',
                content: prompt,
            },
        ],
        temperature: 0.1,
        max_tokens: 2000,
    });

    const responseText = completion.choices[0]?.message?.content || '{}';

    try {
        let cleanedResponse = responseText.trim();
        if (cleanedResponse.startsWith('```json')) cleanedResponse = cleanedResponse.slice(7);
        if (cleanedResponse.startsWith('```')) cleanedResponse = cleanedResponse.slice(3);
        if (cleanedResponse.endsWith('```')) cleanedResponse = cleanedResponse.slice(0, -3);

        const parsed = JSON.parse(cleanedResponse.trim());
        return {
            patient: parsed.patient || {},
            doctor: parsed.doctor || {},
            visit: parsed.visit || {},
            clinical: {
                symptoms: parsed.clinical?.symptoms || [],
                diagnosis: parsed.clinical?.diagnosis || [],
            },
            medicines: parsed.medicines || [],
            additionalNotes: parsed.additionalNotes,
            confidence: parsed.confidence || 0.75,
        };
    } catch (parseError) {
        console.error('[LLM] JSON parse error:', parseError);
        return {
            patient: {},
            doctor: {},
            visit: {},
            clinical: { symptoms: [], diagnosis: [] },
            medicines: [],
            confidence: 0.3,
        };
    }
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const imageId = formData.get('imageId') as string || `img-${Date.now()}`;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        console.log('[API] Processing:', file.name, `(${(file.size / 1024).toFixed(1)} KB)`);

        // Convert file to base64
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString('base64');

        // Step 1: Perform OCR
        console.log('[API] Step 1: OCR...');
        const ocrText = await performOCR(base64);
        console.log('[API] OCR preview:', ocrText.substring(0, 100) + '...');

        if (!ocrText || ocrText.trim().length === 0) {
            return NextResponse.json(
                { error: 'Could not extract text from image. Please ensure the image is clear.' },
                { status: 400 }
            );
        }

        // Step 2: Extract structured data
        console.log('[API] Step 2: LLM extraction...');
        const extracted = await extractWithLLM(ocrText);
        console.log('[API] Patient:', extracted.patient?.name);

        // Step 3: Normalize medical terms
        const normalizedMedicines = (extracted.medicines || []).map(med => ({
            ...med,
            name: normalizeMedicine(med.name),
            frequency: med.frequency ? normalizeFrequency(med.frequency) : undefined,
        }));

        const normalizedDiagnosis = (extracted.clinical?.diagnosis || []).map(d => normalizeDiagnosis(d));

        // Build final result
        const result: PrescriptionResult = {
            id: imageId,
            imageUrl: '',
            patient: {
                name: extracted.patient?.name || 'Unknown',
                age: extracted.patient?.age,
                gender: extracted.patient?.gender,
            },
            doctor: extracted.doctor || {},
            visit: {
                date: extracted.visit?.date || new Date().toISOString().split('T')[0],
                type: extracted.visit?.type || 'OPD',
            },
            clinical: {
                symptoms: extracted.clinical?.symptoms || [],
                diagnosis: normalizedDiagnosis,
            },
            medicines: normalizedMedicines,
            additionalNotes: extracted.additionalNotes,
            confidence: extracted.confidence,
            confidenceLevel: getConfidenceLevel(extracted.confidence),
            rawOcrText: ocrText,
            processingStatus: 'completed',
        };

        console.log('[API] ✓ Complete!');
        return NextResponse.json(result);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('[API] Error:', errorMessage);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
