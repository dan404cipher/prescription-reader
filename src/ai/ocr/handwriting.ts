// Handwriting OCR and Image Processing
// Uses Google Vision API for enterprise-grade handwriting recognition
// Falls back to mock data when API keys are not available

import { PrescriptionResult } from '@/types/prescription';
import { getConfidenceLevel } from '@/ai/analysis/aggregate';

// Mock data for demonstration when API keys are not available
const MOCK_PRESCRIPTIONS: Partial<PrescriptionResult>[] = [
    {
        patient: { name: 'Ramesh Kumar', age: 45, gender: 'Male' },
        doctor: { name: 'Dr. Sharma', department: 'General Medicine' },
        visit: { date: '2025-01-08', type: 'OPD' },
        clinical: {
            symptoms: ['Fever for 3 days', 'Body ache', 'Mild cough'],
            diagnosis: ['Upper Respiratory Tract Infection', 'Viral Fever'],
        },
        medicines: [
            { name: 'Paracetamol', dosage: '650mg', frequency: 'BD', duration: '5 days' },
            { name: 'Cetirizine', dosage: '10mg', frequency: 'OD', duration: '5 days' },
            { name: 'Amoxicillin', dosage: '500mg', frequency: 'TDS', duration: '5 days' },
        ],
        additionalNotes: { advice: 'Drink plenty of fluids, rest', followUp: 'Review after 5 days if symptoms persist' },
        confidence: 0.87,
    },
    {
        patient: { name: 'Priya Singh', age: 32, gender: 'Female' },
        doctor: { name: 'Dr. Patel', department: 'Gastroenterology' },
        visit: { date: '2025-01-08', type: 'OPD' },
        clinical: {
            symptoms: ['Acidity', 'Burning sensation', 'Loss of appetite'],
            diagnosis: ['Gastroesophageal Reflux Disease'],
        },
        medicines: [
            { name: 'Pantoprazole', dosage: '40mg', frequency: 'OD', duration: '2 weeks' },
            { name: 'Domperidone', dosage: '10mg', frequency: 'TDS', duration: '1 week' },
        ],
        additionalNotes: { advice: 'Avoid spicy food, eat small frequent meals', followUp: 'Review after 2 weeks' },
        confidence: 0.92,
    },
    {
        patient: { name: 'Suresh Reddy', age: 58, gender: 'Male' },
        doctor: { name: 'Dr. Gupta', department: 'Cardiology' },
        visit: { date: '2025-01-07', type: 'OPD' },
        clinical: {
            symptoms: ['Chest discomfort', 'Shortness of breath on exertion'],
            diagnosis: ['Hypertension', 'Ischemic Heart Disease'],
        },
        medicines: [
            { name: 'Amlodipine', dosage: '5mg', frequency: 'OD', duration: 'Continue' },
            { name: 'Aspirin', dosage: '75mg', frequency: 'OD', duration: 'Continue' },
            { name: 'Atorvastatin', dosage: '20mg', frequency: 'HS', duration: 'Continue' },
        ],
        additionalNotes: { advice: 'Low salt diet, regular walking', followUp: 'Review after 1 month' },
        confidence: 0.78,
    },
    {
        patient: { name: 'Anjali Devi', age: 28, gender: 'Female' },
        doctor: { name: 'Dr. Mehta', department: 'ENT' },
        visit: { date: '2025-01-08', type: 'OPD' },
        clinical: {
            symptoms: ['Sore throat', 'Difficulty swallowing', 'Ear pain'],
            diagnosis: ['Acute Tonsillitis'],
        },
        medicines: [
            { name: 'Azithromycin', dosage: '500mg', frequency: 'OD', duration: '3 days' },
            { name: 'Ibuprofen', dosage: '400mg', frequency: 'BD', duration: '3 days' },
            { name: 'Chlorhexidine Gargle', dosage: '', frequency: 'TDS', duration: '5 days' },
        ],
        additionalNotes: { advice: 'Warm saline gargles', followUp: 'Review if fever develops' },
        confidence: 0.85,
    },
    {
        patient: { name: 'Mohammed Ali', age: 62, gender: 'Male' },
        doctor: { name: 'Dr. Khan', department: 'Nephrology' },
        visit: { date: '2025-01-06', type: 'IPD' },
        clinical: {
            symptoms: ['Swelling in legs', 'Reduced urine output', 'Fatigue'],
            diagnosis: ['Chronic Kidney Disease Stage 3', 'Type 2 Diabetes Mellitus'],
        },
        medicines: [
            { name: 'Metformin', dosage: '500mg', frequency: 'BD', duration: 'Continue' },
            { name: 'Furosemide', dosage: '40mg', frequency: 'OD', duration: '2 weeks' },
            { name: 'Erythropoietin', dosage: '4000 IU', frequency: 'Weekly', duration: 'Continue' },
        ],
        additionalNotes: { advice: 'Fluid restriction 1.5L/day, protein limited diet', followUp: 'Next dialysis in 2 days' },
        confidence: 0.65,
    },
];

/**
 * Process a prescription image - calls real API, throws on error
 */
export async function processPrescriptionImage(
    imageFile: File,
    imageId: string,
    imageUrl: string
): Promise<PrescriptionResult> {
    console.log(`[OCR] Processing image: ${imageFile.name} (${(imageFile.size / 1024).toFixed(1)} KB)`);

    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('imageId', imageId);

    const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
        console.error('[OCR] API Error:', data.error);
        throw new Error(data.error || 'Analysis failed');
    }

    console.log('[OCR] Success! Patient:', data.patient?.name);
    return {
        ...data,
        imageUrl,
    };
}

/**
 * Generate mock prescription result
 */
function useMockData(imageId: string, imageUrl: string): Promise<PrescriptionResult> {
    return new Promise((resolve) => {
        // Simulate processing delay
        setTimeout(() => {
            const mockIndex = Math.floor(Math.random() * MOCK_PRESCRIPTIONS.length);
            const mockData = MOCK_PRESCRIPTIONS[mockIndex];

            const confidence = (mockData.confidence || 0.8) + (Math.random() * 0.1 - 0.05);
            const clampedConfidence = Math.min(1, Math.max(0, confidence));

            resolve({
                id: imageId,
                imageUrl,
                patient: mockData.patient || { name: 'Unknown' },
                doctor: mockData.doctor || {},
                visit: mockData.visit || {},
                clinical: mockData.clinical || { symptoms: [], diagnosis: [] },
                medicines: mockData.medicines || [],
                additionalNotes: mockData.additionalNotes,
                confidence: clampedConfidence,
                confidenceLevel: getConfidenceLevel(clampedConfidence),
                rawOcrText: '[Mock Data - Configure API keys for real OCR]',
                processingStatus: 'completed',
            });
        }, 1500 + Math.random() * 1000);
    });
}
