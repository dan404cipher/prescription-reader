AI-Driven Handwritten Prescription Analysis
Prototype – Technical Design Document
1. Objective
Build a standalone AI prototype that accepts multiple handwritten doctor prescriptions (e.g., 5 images), performs OCR + AI-based medical understanding, and produces a structured, searchable, human-readable output through a simple UI.
The system must work with scribbled, unstructured handwritten prescriptions and demonstrate:
Accurate text extraction
Medical context understanding
Structured prescription output
Cross-prescription analysis
No HMS integration. No production infra. No model training.
2. Scope (Strictly In-Scope)
Inputs
1–5 scanned handwritten prescriptions (JPG / PNG / PDF)
Mixed handwriting styles
Medical shorthand and abbreviations
Outputs
Structured prescription data per image
Aggregated analysis across uploads
Confidence indicators
Human-readable + JSON output
3. AI System Overview
High-Level AI Flow
Uploaded Prescription Images
        ↓
Image Preprocessing (Quality Enhancement)
        ↓
Handwriting OCR
        ↓
Raw Text Cleanup
        ↓
AI Medical Structuring (LLM)
        ↓
Medical Normalization
        ↓
Per-Prescription Output
        ↓
Cross-Prescription Analysis
4. AI Components (Detailed)
4.1 Image Preprocessing (AI-Supporting Step)
Goal: Improve OCR accuracy for handwritten content.
Techniques Used
Grayscale conversion
Noise reduction
Contrast normalization
Skew correction
Why This Matters
Handwriting OCR accuracy can improve 20–35% with proper preprocessing.
Output
Cleaned image optimized for OCR
4.2 Handwritten OCR Layer
Technology
Enterprise-grade handwriting OCR API
(Azure Read / Google Vision Handwriting)
Why Not Open-Source OCR
Doctor handwriting requires models trained on large medical datasets
Open-source OCR fails on cursive and shorthand
OCR Output (Raw)
Line-by-line extracted text
Spatial ordering preserved
Confidence score per line (if available)
Example (raw):
Pt: Ramesh 45/M
C/o fever 3 days
Dx: URTI
Tab PCM 650 BD
Syp Benadryl
This output is not usable yet.
4.3 OCR Text Cleaning & Segmentation
Purpose
Prepare noisy OCR output for AI understanding.
Operations
Remove stray symbols
Merge broken lines
Normalize spacing
Preserve original ordering
Segmentation Logic
Split text into logical regions:
Header (patient + doctor info)
Clinical notes
Medicines
Advice / follow-up
4.4 AI Medical Structuring (Core Intelligence)
Technology
Large Language Model (LLM)
Prompt-based extraction (no fine-tuning)
Input to AI
Cleaned OCR text
Instruction to extract only known medical fields
AI Responsibilities
The AI must:
Infer structure from chaos
Handle spelling mistakes
Understand medical shorthand
Ignore irrelevant scribbles
Extracted Fields (Strict Schema)
Each prescription must produce:
Patient Information
- Name
- Age
- Gender (if inferable)

Doctor Information
- Doctor name
- Department (if inferable)

Visit Details
- Date
- OPD/IPD (if inferable)

Clinical Information
- Symptoms
- Provisional diagnosis

Treatment
- Medicines
  - Name
  - Dosage
  - Frequency
  - Duration (if present)

Additional Notes
- Advice
- Follow-up
Output Format (Per Prescription)
{
  "patient": {
    "name": "Ramesh",
    "age": 45,
    "gender": "Male"
  },
  "doctor": {
    "name": "Dr. Kumar",
    "department": "General Medicine"
  },
  "visit": {
    "date": "2025-01-08"
  },
  "clinical": {
    "symptoms": ["fever"],
    "diagnosis": ["Upper Respiratory Tract Infection"]
  },
  "medicines": [
    {
      "name": "Paracetamol",
      "dosage": "650 mg",
      "frequency": "BD"
    }
  ],
  "confidence": 0.86
}
4.5 Medical Normalization Layer (Non-ML)
Purpose
Convert informal medical language into standardized data.
Examples
Raw OCR	Normalized
PCM	Paracetamol
BD	Twice daily
TDS	Three times daily
URTI	Upper Respiratory Tract Infection
Implementation
Static medical dictionary
Rule-based expansion
Department-aware medicine lists
This is not model training.
4.6 Confidence Scoring (Trust Layer)
Why Needed
Doctor handwriting is unreliable
Hospital stakeholders require trust indicators
Inputs
OCR confidence
Missing mandatory fields
AI self-assessed certainty
Output
Confidence score (0–1)
Label:
HIGH
MEDIUM
LOW
5. Multi-Prescription Analysis (When 5 Are Uploaded)
Once multiple prescriptions are processed, the AI performs aggregate analysis.
5.1 Cross-Prescription Insights
AI should identify:
Common diagnoses
Frequently prescribed medicines
Repeat patients (if names match)
Department distribution
Date clustering (same-day visits)
Example Aggregate Output
{
  "summary": {
    "total_prescriptions": 5,
    "common_diagnoses": ["Fever", "URTI"],
    "top_medicines": ["Paracetamol", "Amoxicillin"]
  },
  "flags": [
    "2 prescriptions have low OCR confidence",
    "1 prescription missing patient age"
  ]
}
6. UI Expectations (AI-Facing Only)
Upload Screen
Upload up to 5 images
Show processing status per file
Results Screen
For each prescription:
Original image (left)
Structured output (right)
Confidence indicator
Aggregate View
Summary cards
Keyword-based filtering (diagnosis / medicine)
7. What This Prototype Proves
Handwritten prescriptions can be digitized
Medical context can be inferred without training
Hospital staff workload can be reduced
Searchable medical history is feasible
8. Explicit Non-Goals (Important)
No model training
No HMS integration
No authentication
No role-based access
No production deployment
9. Why This Is Cursor-Friendly
Clear module separation
Prompt-based AI logic
No dataset dependency
Easy iteration
Easy demo
10. Suggested Folder Structure (AI-Only)
ai-prescription-prototype/
│
├── ui/
│   ├── upload.tsx
│   ├── results.tsx
│
├── ai/
│   ├── ocr/
│   │   └── handwriting.ts
│   ├── prompts/
│   │   └── prescription_extraction.md
│   ├── normalization/
│   │   └── medical_terms.ts
│   ├── analysis/
│   │   └── aggregate.ts
│
└── types/
    └── prescription.schema.ts
11. Key Line You Can Say Confidently
“This prototype demonstrates real-world handwritten prescription digitization using AI reasoning and enterprise OCR, without any model training, while remaining extensible for future clinical workflows.”