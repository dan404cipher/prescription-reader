'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image, X, FileImage, Loader2 } from 'lucide-react';
import { UploadedFile } from '@/types/prescription';

interface UploadZoneProps {
    onFilesUploaded: (files: UploadedFile[]) => void;
    uploadedFiles: UploadedFile[];
    onRemoveFile: (id: string) => void;
    isProcessing: boolean;
}

export default function UploadZone({
    onFilesUploaded,
    uploadedFiles,
    onRemoveFile,
    isProcessing
}: UploadZoneProps) {
    const [isDragging, setIsDragging] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const remainingSlots = 5 - uploadedFiles.length;
        const filesToAdd = acceptedFiles.slice(0, remainingSlots);

        const newFiles: UploadedFile[] = filesToAdd.map((file) => ({
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            file,
            preview: URL.createObjectURL(file),
            status: 'uploading' as const,
            progress: 0,
        }));

        onFilesUploaded(newFiles);
        setIsDragging(false);
    }, [onFilesUploaded, uploadedFiles.length]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
            'application/pdf': ['.pdf'],
        },
        maxFiles: 5 - uploadedFiles.length,
        disabled: uploadedFiles.length >= 5 || isProcessing,
        onDragEnter: () => setIsDragging(true),
        onDragLeave: () => setIsDragging(false),
    });

    const getStatusColor = (status: UploadedFile['status']) => {
        switch (status) {
            case 'uploading': return 'var(--accent-secondary)';
            case 'processing': return 'var(--accent-warning)';
            case 'completed': return 'var(--accent-success)';
            case 'failed': return 'var(--accent-error)';
        }
    };

    const getStatusText = (status: UploadedFile['status']) => {
        switch (status) {
            case 'uploading': return 'Uploading...';
            case 'processing': return 'Processing OCR...';
            case 'completed': return 'Completed';
            case 'failed': return 'Failed';
        }
    };

    return (
        <div className="upload-container">
            {/* Dropzone */}
            <div
                {...getRootProps()}
                className={`dropzone ${isDragActive || isDragging ? 'dropzone-active' : ''} ${uploadedFiles.length >= 5 ? 'dropzone-disabled' : ''}`}
                style={{
                    transform: isDragActive ? 'scale(1.02)' : 'scale(1)',
                    borderColor: isDragActive ? 'var(--accent-primary)' : 'var(--border-color)',
                    transition: 'all 0.2s ease',
                }}
            >
                <input {...getInputProps()} />
                <div className="dropzone-content">
                    <div
                        className="dropzone-icon"
                        style={{
                            transform: isDragActive ? 'translateY(-10px) scale(1.1)' : 'translateY(0) scale(1)',
                            transition: 'transform 0.2s ease',
                        }}
                    >
                        <Upload size={48} strokeWidth={1.5} />
                    </div>
                    <h3>
                        {uploadedFiles.length >= 5
                            ? 'Maximum files reached (5)'
                            : isDragActive
                                ? 'Drop prescriptions here'
                                : 'Drag & drop prescription images'
                        }
                    </h3>
                    <p>
                        {uploadedFiles.length >= 5
                            ? 'Remove files to upload more'
                            : `Supports JPG, PNG, PDF • Up to ${5 - uploadedFiles.length} more files`
                        }
                    </p>
                    {uploadedFiles.length < 5 && !isProcessing && (
                        <button className="btn-secondary" style={{ marginTop: '16px' }}>
                            <Image size={18} />
                            Browse Files
                        </button>
                    )}
                </div>
            </div>

            {/* File Preview Grid */}
            <AnimatePresence mode="popLayout">
                {uploadedFiles.length > 0 && (
                    <motion.div
                        className="file-grid"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        {uploadedFiles.map((file, index) => (
                            <motion.div
                                key={file.id}
                                className="file-card glass-card"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ delay: index * 0.05 }}
                                layout
                            >
                                {/* Remove button */}
                                {!isProcessing && file.status !== 'processing' && (
                                    <button
                                        className="file-remove"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRemoveFile(file.id);
                                        }}
                                    >
                                        <X size={14} />
                                    </button>
                                )}

                                {/* Image preview */}
                                <div className="file-preview">
                                    {file.preview ? (
                                        <img src={file.preview} alt={file.file.name} />
                                    ) : (
                                        <FileImage size={32} />
                                    )}
                                    {/* Processing overlay */}
                                    {(file.status === 'uploading' || file.status === 'processing') && (
                                        <div className="file-processing-overlay">
                                            <Loader2 className="spinner" size={24} />
                                        </div>
                                    )}
                                </div>

                                {/* File info */}
                                <div className="file-info">
                                    <span className="file-name">{file.file.name}</span>
                                    <span
                                        className="file-status"
                                        style={{ color: getStatusColor(file.status) }}
                                    >
                                        {getStatusText(file.status)}
                                    </span>
                                </div>

                                {/* Progress bar */}
                                {(file.status === 'uploading' || file.status === 'processing') && (
                                    <div className="progress-bar">
                                        <motion.div
                                            className="progress-bar-fill"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${file.progress}%` }}
                                        />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
        .upload-container {
          width: 100%;
        }

        .dropzone {
          border: 2px dashed var(--border-color);
          border-radius: var(--radius-xl);
          padding: 48px 24px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: var(--bg-glass);
          backdrop-filter: blur(10px);
        }

        .dropzone:hover:not(.dropzone-disabled) {
          border-color: var(--accent-primary);
          box-shadow: var(--shadow-glow);
        }

        .dropzone-active {
          border-color: var(--accent-primary);
          background: rgba(16, 185, 129, 0.05);
          box-shadow: var(--shadow-glow);
        }

        .dropzone-disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .dropzone-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .dropzone-icon {
          color: var(--accent-primary);
          opacity: 0.8;
        }

        .dropzone h3 {
          font-size: 20px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .dropzone p {
          font-size: 14px;
          color: var(--text-secondary);
        }

        .file-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 16px;
          margin-top: 24px;
        }

        .file-card {
          position: relative;
          padding: 12px;
          overflow: hidden;
        }

        .file-remove {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: var(--accent-error);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          transition: all 0.2s ease;
        }

        .file-remove:hover {
          background: rgba(239, 68, 68, 0.4);
          transform: scale(1.1);
        }

        .file-preview {
          width: 100%;
          height: 140px;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: var(--bg-tertiary);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .file-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .file-processing-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .spinner {
          animation: spin 1s linear infinite;
          color: var(--accent-primary);
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .file-info {
          margin-top: 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .file-name {
          font-size: 13px;
          font-weight: 500;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .file-status {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .file-card .progress-bar {
          margin-top: 8px;
        }
      `}</style>
        </div>
    );
}
