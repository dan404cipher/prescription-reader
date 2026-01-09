'use client';

import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Bell,
    Settings,
    Search,
    Loader2
} from 'lucide-react';
import PrescriptionList from '@/components/PrescriptionList';
import PrescriptionViewer from '@/components/PrescriptionViewer';
import { UploadedFile, PrescriptionResult, AggregateAnalysis } from '@/types/prescription';
import { processPrescriptionImage } from '@/ai/ocr/handwriting';

export default function Dashboard() {
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const [isProcessing, setIsProcessing] = useState(false);

    // Hidden file input ref
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handle new file uploads via button
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const newFiles: UploadedFile[] = Array.from(files).map(file => ({
                id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                file,
                preview: URL.createObjectURL(file), // Create local preview
                status: 'uploading' as const,
                progress: 0,
            }));

            setUploadedFiles(prev => [...prev, ...newFiles]);
            // Auto-select the first new file
            if (newFiles.length > 0) {
                setSelectedId(newFiles[0].id);
                // Trigger processing for new files automatically
                processFiles(newFiles);
            }
        }
    };

    const processFiles = async (filesToProcess: UploadedFile[]) => {
        setIsProcessing(true);

        for (const file of filesToProcess) {
            // 1. Update status to processing
            setUploadedFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: 'processing', progress: 10 } : f));

            try {
                // 2. Process image
                const result = await processPrescriptionImage(file.file, file.id, file.preview);

                // 3. Update status to completed
                setUploadedFiles(prev => prev.map(f =>
                    f.id === file.id ? { ...f, status: 'completed', progress: 100, result } : f
                ));
            } catch (error) {
                console.error(error);
                setUploadedFiles(prev => prev.map(f =>
                    f.id === file.id ? { ...f, status: 'failed', error: 'Analysis failed' } : f
                ));
            }
        }
        setIsProcessing(false);
    };

    const selectedFile = uploadedFiles.find(f => f.id === selectedId) || null;

    return (
        <div className="h-full flex flex-col gap-6">
            {/* Top Bar */}
            <header className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <h1 className="text-xl font-bold text-gray-800">Prescriptions</h1>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search prescriptions..."
                            className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64 transition-all"
                        />
                    </div>

                    <button onClick={() => fileInputRef.current?.click()} className="btn-primary flex items-center gap-2 shadow-lg shadow-emerald-100">
                        <Plus size={18} />
                        <span>New Upload</span>
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        multiple
                        accept="image/png, image/jpeg, application/pdf"
                        onChange={handleFileUpload}
                    />

                    <div className="h-8 w-px bg-gray-200 mx-2"></div>

                    <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                        <Bell size={20} />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    </button>
                    <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold text-sm">
                        JD
                    </div>
                </div>
            </header>

            {/* Main Split View */}
            <div className="flex-1 min-h-0 flex gap-6">
                {/* Left Column: List */}
                <div className="w-80 flex-shrink-0">
                    <PrescriptionList
                        prescriptions={uploadedFiles}
                        selectedId={selectedId}
                        onSelect={setSelectedId}
                        isProcessing={isProcessing}
                    />
                </div>

                {/* Right Column: Viewer */}
                <div className="flex-1 min-w-0">
                    <PrescriptionViewer item={selectedFile} />
                </div>
            </div>
        </div>
    );
}
