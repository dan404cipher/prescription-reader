import React from 'react';
import { UploadedFile } from '@/types/prescription';
import { Download, Printer, Share2, Maximize2, AlertCircle, CheckCircle, Pill, Stethoscope, FileText, User, Calendar, Activity, Sparkles, ScanLine } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PrescriptionViewerProps {
    item: UploadedFile | null;
}



// Scanning Effect Overlay
function ScanningOverlay() {
    return (
        <div className="absolute inset-0 z-10 overflow-hidden rounded-lg pointer-events-none">
            {/* Glass Backdrop */}
            <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-[2px]" />

            {/* Scanning Line moving Top to Bottom */}
            <motion.div
                className="absolute left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_20px_rgba(52,211,153,0.8)] z-20"
                initial={{ top: "0%" }}
                animate={{ top: "100%" }}
                transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />

            {/* Grid/Tech Effect Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />

            {/* Pulsing Center Status */}
            <div className="absolute inset-0 flex items-center justify-center z-30">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0.9 }}
                    animate={{ scale: 1.05, opacity: 1 }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                    className="bg-black/60 backdrop-blur-md text-emerald-400 px-6 py-3 rounded-full flex items-center gap-3 border border-emerald-500/30 shadow-2xl"
                >
                    <Sparkles size={18} className="animate-pulse" />
                    <span className="font-mono text-sm tracking-widest font-bold">ANALYZING...</span>
                </motion.div>
            </div>
        </div>
    );
}

export default function PrescriptionViewer({ item }: PrescriptionViewerProps) {
    if (!item) {
        return (
            <div className="h-full bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center text-gray-400 p-8">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <FileText size={40} className="opacity-40" />
                </div>
                <p className="text-xl font-medium text-gray-500">No prescription selected</p>
                <p className="text-base">Select an item from the list to view details</p>
            </div>
        );
    }

    const { result, preview, status } = item;
    const isProcessing = status === 'processing' || status === 'uploading';

    return (
        <div className="h-full flex flex-col gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-1 min-h-0 relative overflow-hidden">

                {isProcessing ? (
                    // PROCESSING VIEW: Centered Image with Scanning Overlay
                    <div className="h-full flex flex-col items-center justify-center relative">
                        <div className="relative w-full max-w-3xl h-full bg-gray-50 rounded-xl overflow-hidden border border-gray-100 shadow-inner flex items-center justify-center">
                            <img
                                src={preview}
                                alt="Prescription Processing"
                                className="max-w-full max-h-full object-contain p-4 mix-blend-multiply opacity-90"
                            />
                            <ScanningOverlay />
                        </div>
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-6 py-3 rounded-full shadow-lg border border-gray-100 text-center">
                            <p className="text-emerald-600 font-semibold text-sm flex items-center gap-2">
                                <ScanLine size={16} className="animate-pulse" />
                                Extracting structured data from handwriting...
                            </p>
                        </div>
                    </div>
                ) : (
                    // COMPLETED VIEW: Split Layout
                    <div className="flex flex-col md:flex-row gap-6 h-full">
                        {/* Left: Original Image Preview */}
                        <div className="w-full md:w-1/2 flex flex-col gap-4">
                            <h3 className="text-base font-semibold text-gray-700 flex items-center gap-2">
                                <FileText size={20} className="text-emerald-500" />
                                Original Scan
                            </h3>
                            <div className="relative flex-1 bg-gray-50 rounded-lg border border-gray-100 overflow-hidden group">
                                <img
                                    src={preview}
                                    alt="Prescription"
                                    className="w-full h-full object-contain p-2"
                                />
                                <button className="absolute bottom-3 right-3 p-2.5 bg-white/90 backdrop-blur shadow-sm rounded-lg hover:bg-white transition-colors opacity-0 group-hover:opacity-100">
                                    <Maximize2 size={20} className="text-gray-600" />
                                </button>
                            </div>
                            {/* QR and Metadata mockups */}
                            <div className="flex gap-3">
                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 flex-1 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded border border-gray-200 flex items-center justify-center">
                                        <span className="text-sm font-mono font-bold">QR</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">RX ID</p>
                                        <p className="text-sm font-mono text-gray-800">{item.id.split('-')[1]}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Extracted Data */}
                        <div className="w-full md:w-1/2 flex flex-col min-h-0">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{result?.patient?.name || 'Unknown Patient'}</h2>
                                    <p className="text-base text-gray-500 flex items-center gap-2 mt-1">
                                        <User size={18} /> {result?.patient?.age ? `${result.patient.age} yrs` : 'Age N/A'} • {result?.patient?.gender || 'Gender N/A'}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                                        <Share2 size={22} />
                                    </button>
                                    <button className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                                        <Printer size={22} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 space-y-6">

                                {/* Visit Info */}
                                <div className="bg-blue-50/50 rounded-lg p-5 border border-blue-100/50">
                                    <h4 className="text-sm font-bold text-blue-800 uppercase tracking-wider flex items-center gap-2 mb-3">
                                        <Calendar size={16} /> Visit Details
                                    </h4>
                                    <div className="flex gap-6">
                                        <div>
                                            <p className="text-sm text-gray-500">Date</p>
                                            <p className="text-base font-semibold text-gray-900">{result?.visit?.date || 'Not specified'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Type</p>
                                            <span className={`inline-block px-3 py-1 text-sm font-medium rounded ${result?.visit?.type === 'IPD' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {result?.visit?.type || 'OPD'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Doctor Info */}
                                <div className="bg-emerald-50/50 rounded-lg p-5 border border-emerald-100/50">
                                    <div className="flex justify-between mb-2">
                                        <h4 className="text-sm font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-2">
                                            <Stethoscope size={16} /> Prescribed By
                                        </h4>
                                    </div>
                                    <p className="text-base font-semibold text-gray-900">{result?.doctor?.name || 'Not specified'}</p>
                                    <p className="text-sm text-gray-500">{result?.doctor?.department || 'Department not specified'}</p>
                                </div>

                                {/* Clinical Info - Symptoms & Diagnosis */}
                                <div className="bg-orange-50/50 rounded-lg p-5 border border-orange-100/50">
                                    <h4 className="text-sm font-bold text-orange-800 uppercase tracking-wider flex items-center gap-2 mb-4">
                                        <Activity size={16} /> Clinical Information
                                    </h4>

                                    {/* Symptoms */}
                                    {result?.clinical?.symptoms && result.clinical.symptoms.length > 0 && (
                                        <div className="mb-4">
                                            <p className="text-sm text-gray-500 mb-2">Symptoms</p>
                                            <div className="flex flex-wrap gap-2">
                                                {result.clinical.symptoms.map((s, i) => (
                                                    <span key={i} className="px-3 py-1 bg-white border border-orange-100 text-orange-700 text-sm rounded-full font-medium shadow-sm">
                                                        {s}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Diagnosis */}
                                    {result?.clinical?.diagnosis && result.clinical.diagnosis.length > 0 && (
                                        <div>
                                            <p className="text-sm text-gray-500 mb-2">Diagnosis</p>
                                            <div className="flex flex-wrap gap-2">
                                                {result.clinical.diagnosis.map((d, i) => (
                                                    <span key={i} className="px-3 py-1 bg-white border border-emerald-100 text-emerald-700 text-sm rounded-full font-medium shadow-sm">
                                                        {d}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Show message if no clinical info */}
                                    {(!result?.clinical?.symptoms || result.clinical.symptoms.length === 0) &&
                                        (!result?.clinical?.diagnosis || result.clinical.diagnosis.length === 0) && (
                                            <p className="text-sm text-gray-400 italic">No clinical information extracted</p>
                                        )}
                                </div>

                                {/* Medicines */}
                                <div>
                                    <h4 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Pill size={20} className="text-emerald-500" /> Medications
                                    </h4>
                                    {result?.medicines && result.medicines.length > 0 ? (
                                        <div className="space-y-3">
                                            {result.medicines.map((med, i) => (
                                                <div key={i} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-emerald-200 transition-colors">
                                                    <div>
                                                        <p className="font-medium text-gray-900 text-base">{med.name}</p>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            {[med.dosage, med.duration].filter(Boolean).join(' • ') || 'No dosage info'}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="inline-block px-3 py-1.5 bg-white border border-gray-200 text-gray-600 text-sm rounded font-medium">
                                                            {med.frequency || 'OD'}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-400 italic p-4 bg-gray-50 rounded-lg">No medications extracted</p>
                                    )}
                                </div>

                                {/* Additional Notes */}
                                {result?.additionalNotes && (result.additionalNotes.advice || result.additionalNotes.followUp) && (
                                    <div className="bg-yellow-50/50 rounded-lg p-5 border border-yellow-100/50">
                                        <h4 className="text-sm font-bold text-yellow-800 uppercase tracking-wider flex items-center gap-2 mb-4">
                                            <FileText size={16} /> Additional Notes
                                        </h4>
                                        {result.additionalNotes.advice && (
                                            <div className="mb-4">
                                                <p className="text-sm text-gray-500 mb-1">Advice</p>
                                                <p className="text-base text-gray-900">{result.additionalNotes.advice}</p>
                                            </div>
                                        )}
                                        {result.additionalNotes.followUp && (
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Follow-up</p>
                                                <p className="text-base text-gray-900">{result.additionalNotes.followUp}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* OCR Confidence */}
                                <div className="p-4 rounded-lg bg-gray-50 border border-gray-100 flex items-center gap-4">
                                    {result?.confidence && result.confidence > 0.8 ? (
                                        <CheckCircle size={20} className="text-emerald-500" />
                                    ) : (
                                        <AlertCircle size={20} className="text-amber-500" />
                                    )}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm font-medium text-gray-600">AI Confidence</span>
                                            <span className="text-sm font-bold text-gray-900">{Math.round((result?.confidence || 0) * 100)}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${result?.confidence && result.confidence > 0.8 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                                style={{ width: `${(result?.confidence || 0) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>



                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
