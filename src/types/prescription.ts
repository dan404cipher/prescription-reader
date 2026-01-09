// Prescription Schema Types

export interface Patient {
    name: string;
    age?: number;
    gender?: 'Male' | 'Female' | 'Other';
}

export interface Doctor {
    name?: string;
    department?: string;
}

export interface Visit {
    date?: string;
    type?: 'OPD' | 'IPD';
}

export interface Clinical {
    symptoms: string[];
    diagnosis: string[];
}

export interface Medicine {
    name: string;
    dosage?: string;
    frequency?: string;
    duration?: string;
}

export interface PrescriptionResult {
    id: string;
    imageUrl: string;
    patient: Patient;
    doctor: Doctor;
    visit: Visit;
    clinical: Clinical;
    medicines: Medicine[];
    additionalNotes?: {
        advice?: string;
        followUp?: string;
    };
    confidence: number;
    confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW';
    rawOcrText?: string;
    processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
    error?: string;
}

export interface AggregateAnalysis {
    totalPrescriptions: number;
    commonDiagnoses: Array<{ name: string; count: number }>;
    topMedicines: Array<{ name: string; count: number }>;
    departmentDistribution: Array<{ name: string; count: number }>;
    flags: string[];
    averageConfidence: number;
}

export interface UploadedFile {
    id: string;
    file: File;
    preview: string;
    status: 'uploading' | 'processing' | 'completed' | 'failed';
    progress: number;
    result?: PrescriptionResult;
    error?: string;
}
