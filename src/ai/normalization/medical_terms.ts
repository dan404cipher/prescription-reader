// Medical Terms Normalization Dictionary
// Converts medical abbreviations and shorthand to human-readable terms

export const MEDICINE_ABBREVIATIONS: Record<string, string> = {
    // Common medicines
    'PCM': 'Paracetamol',
    'PARA': 'Paracetamol',
    'AMOX': 'Amoxicillin',
    'AZT': 'Azithromycin',
    'AZITHRO': 'Azithromycin',
    'METRO': 'Metronidazole',
    'CEFTRI': 'Ceftriaxone',
    'CIPRO': 'Ciprofloxacin',
    'DICLO': 'Diclofenac',
    'IBU': 'Ibuprofen',
    'IBUPRO': 'Ibuprofen',
    'ORS': 'Oral Rehydration Salts',
    'PAN': 'Pantoprazole',
    'PANTO': 'Pantoprazole',
    'OME': 'Omeprazole',
    'OMEZ': 'Omeprazole',
    'RANITID': 'Ranitidine',
    'CETRIZ': 'Cetirizine',
    'LORATA': 'Loratadine',
    'DOMP': 'Domperidone',
    'DOM': 'Domperidone',
    'MULTIVIT': 'Multivitamin',
    'VITAMIN C': 'Ascorbic Acid',
    'VIT C': 'Ascorbic Acid',
    'VIT D': 'Cholecalciferol',
    'B12': 'Cyanocobalamin',
    'IRON': 'Ferrous Sulfate',
    'FeSO4': 'Ferrous Sulfate',
    'CALC': 'Calcium',
};

export const FREQUENCY_ABBREVIATIONS: Record<string, string> = {
    'OD': 'Once daily',
    'BD': 'Twice daily',
    'BID': 'Twice daily',
    'TDS': 'Three times daily',
    'TID': 'Three times daily',
    'QDS': 'Four times daily',
    'QID': 'Four times daily',
    'HS': 'At bedtime',
    'SOS': 'As needed',
    'PRN': 'As needed',
    'STAT': 'Immediately',
    'AC': 'Before meals',
    'PC': 'After meals',
    'AM': 'In the morning',
    'PM': 'In the evening',
    'Q4H': 'Every 4 hours',
    'Q6H': 'Every 6 hours',
    'Q8H': 'Every 8 hours',
    'Q12H': 'Every 12 hours',
    'WEEKLY': 'Once weekly',
    'ALT': 'Alternate days',
};

export const DIAGNOSIS_ABBREVIATIONS: Record<string, string> = {
    'URTI': 'Upper Respiratory Tract Infection',
    'LRTI': 'Lower Respiratory Tract Infection',
    'UTI': 'Urinary Tract Infection',
    'AGE': 'Acute Gastroenteritis',
    'GERD': 'Gastroesophageal Reflux Disease',
    'HTN': 'Hypertension',
    'DM': 'Diabetes Mellitus',
    'T2DM': 'Type 2 Diabetes Mellitus',
    'IHD': 'Ischemic Heart Disease',
    'CAD': 'Coronary Artery Disease',
    'CHF': 'Congestive Heart Failure',
    'COPD': 'Chronic Obstructive Pulmonary Disease',
    'CKD': 'Chronic Kidney Disease',
    'TB': 'Tuberculosis',
    'PID': 'Pelvic Inflammatory Disease',
    'OA': 'Osteoarthritis',
    'RA': 'Rheumatoid Arthritis',
    'DVT': 'Deep Vein Thrombosis',
    'PE': 'Pulmonary Embolism',
    'MI': 'Myocardial Infarction',
    'CVA': 'Cerebrovascular Accident',
    'TIA': 'Transient Ischemic Attack',
    'BPH': 'Benign Prostatic Hyperplasia',
    'AKI': 'Acute Kidney Injury',
    'ARDS': 'Acute Respiratory Distress Syndrome',
};

export const ROUTE_ABBREVIATIONS: Record<string, string> = {
    'PO': 'By mouth',
    'IV': 'Intravenous',
    'IM': 'Intramuscular',
    'SC': 'Subcutaneous',
    'SL': 'Sublingual',
    'INH': 'Inhaled',
    'TOP': 'Topical',
    'PR': 'Per rectum',
    'PV': 'Per vaginum',
    'OPTH': 'Ophthalmic',
};

export const CLINICAL_ABBREVIATIONS: Record<string, string> = {
    'C/O': 'Complains of',
    'c/o': 'Complains of',
    'H/O': 'History of',
    'h/o': 'History of',
    'K/C': 'Known case of',
    'k/c': 'Known case of',
    'O/E': 'On examination',
    'o/e': 'On examination',
    'N/V': 'Nausea/Vomiting',
    'SOB': 'Shortness of breath',
    'Dx': 'Diagnosis',
    'Rx': 'Prescription',
    'Sx': 'Symptoms',
    'Hx': 'History',
    'Tx': 'Treatment',
    'Fx': 'Fracture',
    'Pt': 'Patient',
    'Px': 'Prognosis',
    'F/U': 'Follow-up',
    'f/u': 'Follow-up',
    'Tab': 'Tablet',
    'Cap': 'Capsule',
    'Syp': 'Syrup',
    'Inj': 'Injection',
    'Susp': 'Suspension',
    'Drops': 'Drops',
};

/**
 * Normalize a medical term using all dictionaries
 */
export function normalizeMedicalTerm(term: string): string {
    const upperTerm = term.toUpperCase().trim();

    // Check all dictionaries
    if (MEDICINE_ABBREVIATIONS[upperTerm]) {
        return MEDICINE_ABBREVIATIONS[upperTerm];
    }
    if (FREQUENCY_ABBREVIATIONS[upperTerm]) {
        return FREQUENCY_ABBREVIATIONS[upperTerm];
    }
    if (DIAGNOSIS_ABBREVIATIONS[upperTerm]) {
        return DIAGNOSIS_ABBREVIATIONS[upperTerm];
    }
    if (ROUTE_ABBREVIATIONS[upperTerm]) {
        return ROUTE_ABBREVIATIONS[upperTerm];
    }
    if (CLINICAL_ABBREVIATIONS[term]) {
        return CLINICAL_ABBREVIATIONS[term];
    }

    return term;
}

/**
 * Normalize frequency text
 */
export function normalizeFrequency(frequency: string): string {
    const upperFreq = frequency.toUpperCase().trim();
    return FREQUENCY_ABBREVIATIONS[upperFreq] || frequency;
}

/**
 * Normalize diagnosis text
 */
export function normalizeDiagnosis(diagnosis: string): string {
    const upperDiag = diagnosis.toUpperCase().trim();
    return DIAGNOSIS_ABBREVIATIONS[upperDiag] || diagnosis;
}

/**
 * Normalize medicine name
 */
export function normalizeMedicine(medicine: string): string {
    const upperMed = medicine.toUpperCase().trim();
    return MEDICINE_ABBREVIATIONS[upperMed] || medicine;
}

/**
 * Process and normalize an entire prescription result
 */
export function normalizePrescription(rawText: string): string {
    let normalized = rawText;

    // Replace clinical abbreviations
    Object.entries(CLINICAL_ABBREVIATIONS).forEach(([abbr, full]) => {
        const regex = new RegExp(`\\b${abbr.replace('/', '\\/')}\\b`, 'gi');
        normalized = normalized.replace(regex, full);
    });

    return normalized;
}
