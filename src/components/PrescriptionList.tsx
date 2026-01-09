'use client';

import React from 'react';
import { UploadedFile } from '@/types/prescription';
import { Calendar, ChevronRight, User, Pill, Activity } from 'lucide-react';

interface PrescriptionListProps {
    prescriptions: UploadedFile[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    isProcessing: boolean;
    onUploadTrigger: () => void;
}

export default function PrescriptionList({
    prescriptions,
    selectedId,
    onSelect,
    isProcessing,
    onUploadTrigger
}: PrescriptionListProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
                <h2 className="font-semibold text-lg text-gray-800">Active Prescriptions</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer hover:text-emerald-600">
                    Sort by date <ChevronRight size={16} className="rotate-90" />
                </div>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {prescriptions.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center bg-gray-50/50 rounded-lg m-2 border-2 border-dashed border-gray-100">
                        <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                            <Pill size={28} className="opacity-50" />
                        </div>
                        <p className="text-base font-medium text-gray-600">No prescriptions yet</p>
                        <p className="text-sm mt-1 mb-4">Upload a file to get started</p>
                        <button
                            onClick={onUploadTrigger}
                            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors shadow-sm"
                        >
                            Upload Prescription
                        </button>
                    </div>
                )}

                {prescriptions.map((item) => {
                    const result = item.result;
                    const isSelected = selectedId === item.id;
                    const statusColor = item.status === 'completed' ? 'text-emerald-500' :
                        item.status === 'failed' ? 'text-red-500' : 'text-amber-500';

                    return (
                        <div
                            key={item.id}
                            onClick={() => onSelect(item.id)}
                            className={`p-4 rounded-xl cursor-pointer transition-all border ${isSelected
                                ? 'bg-emerald-50 border-emerald-200 shadow-sm'
                                : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-200'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className={`font-semibold text-base ${isSelected ? 'text-emerald-900' : 'text-gray-900'}`}>
                                        {result?.doctor?.department || 'General Prescription'}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {result?.doctor?.name || 'Dr. Unknown'}
                                    </p>
                                </div>
                                {item.result?.patient?.name && (
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                                        <User size={18} className="text-gray-500" />
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-4 mt-4">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Calendar size={16} />
                                    {result?.visit?.date || new Date().toLocaleDateString()}
                                </div>
                                {result?.medicines && result.medicines.length > 0 && (
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Pill size={16} />
                                        {result.medicines.length} medicines
                                    </div>
                                )}
                            </div>

                            {/* Status Indicator for items processing/failed */}
                            {item.status !== 'completed' && (
                                <div className={`text-sm mt-3 font-medium flex items-center gap-2 ${statusColor}`}>
                                    <Activity size={14} className={item.status === 'processing' ? 'animate-pulse' : ''} />
                                    {item.status === 'processing' ? 'Analyzing...' : item.status === 'failed' ? 'Failed' : 'Uploading...'}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
