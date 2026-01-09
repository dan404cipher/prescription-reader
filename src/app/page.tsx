'use client';

import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Bell,
    Settings,
    Search,
    Loader2,
    ChevronLeft,
    Menu // Added Menu icon
} from 'lucide-react';
import PrescriptionList from '@/components/PrescriptionList';
import PrescriptionViewer from '@/components/PrescriptionViewer';
import { UploadedFile, PrescriptionResult, AggregateAnalysis } from '@/types/prescription';
import { processPrescriptionImage } from '@/ai/ocr/handwriting';
import { useSidebar } from '@/context/SidebarContext'; // Import context

export default function Dashboard() {
    const { toggleSidebar } = useSidebar(); // Use context
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Mobile view state: 'list' or 'viewer'
    const [mobileView, setMobileView] = useState<'list' | 'viewer'>('list');

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
                setMobileView('viewer'); // Switch to viewer on mobile
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

    const handleSelectPrescription = (id: string) => {
        setSelectedId(id);
        setMobileView('viewer'); // Switch to viewer on mobile when selecting
    };

    const selectedFile = uploadedFiles.find(f => f.id === selectedId) || null;

    return (
        <div className="lg:h-full flex flex-col gap-4 lg:gap-6">
            {/* Top Bar */}
            <header className="flex justify-between items-center bg-white p-3 lg:p-4 rounded-xl border border-gray-200 shadow-sm">

                <div className="flex items-center gap-3">
                    {/* Mobile Hamburger - Now aligned inside header */}
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                        <Menu size={24} />
                    </button>

                    {/* Mobile: Back button when viewing */}
                    {mobileView === 'viewer' && (
                        <button
                            onClick={() => setMobileView('list')}
                            className="lg:hidden flex items-center gap-1 text-gray-600 mr-2"
                        >
                            <ChevronLeft size={20} />
                            <span className="text-sm">Back</span>
                        </button>
                    )}

                    <h1 className="text-lg lg:text-xl font-bold text-gray-800 hidden sm:block">Prescriptions</h1>
                    {/* Show Rx label on mobile only if not viewing details, otherwise title is hidden/flexible */}
                    {mobileView === 'list' && <h1 className="text-lg font-bold text-gray-800 sm:hidden">Rx</h1>}
                </div>

                <div className="flex items-center gap-2 lg:gap-4">
                    {/* Search - Hidden on small mobile */}
                    <div className="relative hidden sm:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search prescriptions..."
                            className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-48 lg:w-64 transition-all"
                        />
                    </div>

                    <button onClick={() => fileInputRef.current?.click()} className="btn-primary flex items-center gap-2 shadow-lg shadow-emerald-100 text-sm lg:text-base px-3 lg:px-4 py-2">
                        <Plus size={18} />
                        <span className="hidden sm:inline">New Upload</span>
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        multiple
                        accept="image/png, image/jpeg, application/pdf"
                        onChange={handleFileUpload}
                    />

                    <div className="h-8 w-px bg-gray-200 mx-1 lg:mx-2 hidden sm:block"></div>

                    <button className="p-2 text-gray-400 hover:text-gray-600 relative hidden sm:block">
                        <Bell size={20} />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    </button>
                    <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold text-sm">
                        JD
                    </div>
                </div>
            </header>

            {/* Main Split View - Responsive */}
            <div className="flex-1 lg:min-h-0 flex gap-4 lg:gap-6">
                {/* Left Column: List - Full width on mobile, hidden when viewing */}
                <div className={`
                    w-full lg:w-80 flex-shrink-0
                    ${mobileView === 'viewer' ? 'hidden lg:block' : 'block'}
                `}>
                    <PrescriptionList
                        prescriptions={uploadedFiles}
                        selectedId={selectedId}
                        onSelect={handleSelectPrescription}
                        isProcessing={isProcessing}
                        onUploadTrigger={() => fileInputRef.current?.click()}
                    />
                </div>

                {/* Right Column: Viewer - Full width on mobile, hidden when listing */}
                <div className={`
                    flex-1 min-w-0
                    ${mobileView === 'list' ? 'hidden lg:block' : 'block'}
                `}>
                    <PrescriptionViewer item={selectedFile} />
                </div>
            </div>
        </div>
    );
}
