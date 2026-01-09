// Aggregate Analysis for Multiple Prescriptions

import { PrescriptionResult, AggregateAnalysis } from '@/types/prescription';

/**
 * Analyze multiple prescriptions and generate aggregate insights
 */
export function analyzeMultiplePrescriptions(prescriptions: PrescriptionResult[]): AggregateAnalysis {
    const diagnosisCounts: Record<string, number> = {};
    const medicineCounts: Record<string, number> = {};
    const departmentCounts: Record<string, number> = {};
    const flags: string[] = [];
    let totalConfidence = 0;
    let lowConfidenceCount = 0;
    let missingPatientAge = 0;
    let missingDoctorName = 0;

    prescriptions.forEach((rx) => {
        // Count diagnoses
        rx.clinical.diagnosis.forEach((diag) => {
            const key = diag.toLowerCase().trim();
            diagnosisCounts[key] = (diagnosisCounts[key] || 0) + 1;
        });

        // Count medicines
        rx.medicines.forEach((med) => {
            const key = med.name.toLowerCase().trim();
            medicineCounts[key] = (medicineCounts[key] || 0) + 1;
        });

        // Count departments
        if (rx.doctor.department) {
            const key = rx.doctor.department.toLowerCase().trim();
            departmentCounts[key] = (departmentCounts[key] || 0) + 1;
        }

        // Track confidence
        totalConfidence += rx.confidence;
        if (rx.confidence < 0.5) lowConfidenceCount++;

        // Track missing data
        if (!rx.patient.age) missingPatientAge++;
        if (!rx.doctor.name) missingDoctorName++;
    });

    // Generate flags
    if (lowConfidenceCount > 0) {
        flags.push(`${lowConfidenceCount} prescription(s) have low OCR confidence`);
    }
    if (missingPatientAge > 0) {
        flags.push(`${missingPatientAge} prescription(s) missing patient age`);
    }
    if (missingDoctorName > 0) {
        flags.push(`${missingDoctorName} prescription(s) missing doctor name`);
    }

    // Sort and format results
    const sortByCount = (obj: Record<string, number>) =>
        Object.entries(obj)
            .sort((a, b) => b[1] - a[1])
            .map(([name, count]) => ({
                name: name.charAt(0).toUpperCase() + name.slice(1),
                count,
            }));

    return {
        totalPrescriptions: prescriptions.length,
        commonDiagnoses: sortByCount(diagnosisCounts).slice(0, 5),
        topMedicines: sortByCount(medicineCounts).slice(0, 5),
        departmentDistribution: sortByCount(departmentCounts),
        flags,
        averageConfidence: prescriptions.length > 0 ? totalConfidence / prescriptions.length : 0,
    };
}

/**
 * Calculate confidence level label from numeric score
 */
export function getConfidenceLevel(confidence: number): 'HIGH' | 'MEDIUM' | 'LOW' {
    if (confidence >= 0.7) return 'HIGH';
    if (confidence >= 0.5) return 'MEDIUM';
    return 'LOW';
}

/**
 * Find repeat patients across prescriptions (by name matching)
 */
export function findRepeatPatients(prescriptions: PrescriptionResult[]): string[] {
    const nameCounts: Record<string, number> = {};

    prescriptions.forEach((rx) => {
        if (rx.patient.name) {
            const key = rx.patient.name.toLowerCase().trim();
            nameCounts[key] = (nameCounts[key] || 0) + 1;
        }
    });

    return Object.entries(nameCounts)
        .filter(([, count]) => count > 1)
        .map(([name]) => name.charAt(0).toUpperCase() + name.slice(1));
}

/**
 * Check for same-day visits
 */
export function findSameDayVisits(prescriptions: PrescriptionResult[]): string[] {
    const dateCounts: Record<string, number> = {};

    prescriptions.forEach((rx) => {
        if (rx.visit.date) {
            dateCounts[rx.visit.date] = (dateCounts[rx.visit.date] || 0) + 1;
        }
    });

    return Object.entries(dateCounts)
        .filter(([, count]) => count > 1)
        .map(([date, count]) => `${date}: ${count} visits`);
}
