'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Stethoscope,
    Calendar,
    Pill,
    FileText,
    ChevronDown,
    ChevronUp,
    AlertCircle,
    Clock,
    CheckCircle2
} from 'lucide-react';
import { PrescriptionResult } from '@/types/prescription';

interface ResultsProps {
    prescriptions: PrescriptionResult[];
}

export default function Results({ prescriptions }: ResultsProps) {
    const [expandedId, setExpandedId] = useState<string | null>(
        prescriptions.length > 0 ? prescriptions[0].id : null
    );

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const getConfidenceBadgeClass = (level: PrescriptionResult['confidenceLevel']) => {
        switch (level) {
            case 'HIGH': return 'badge badge-high';
            case 'MEDIUM': return 'badge badge-medium';
            case 'LOW': return 'badge badge-low';
        }
    };

    const getConfidenceIcon = (level: PrescriptionResult['confidenceLevel']) => {
        switch (level) {
            case 'HIGH': return <CheckCircle2 size={12} />;
            case 'MEDIUM': return <Clock size={12} />;
            case 'LOW': return <AlertCircle size={12} />;
        }
    };

    if (prescriptions.length === 0) {
        return null;
    }

    return (
        <div className="results-container">
            <AnimatePresence mode="popLayout">
                {prescriptions.map((rx, index) => (
                    <motion.div
                        key={rx.id}
                        className="result-card glass-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        layout
                    >
                        {/* Card Header */}
                        <div
                            className="result-header"
                            onClick={() => toggleExpand(rx.id)}
                        >
                            <div className="result-header-left">
                                <div className="result-thumbnail">
                                    <img src={rx.imageUrl} alt="Prescription" />
                                </div>
                                <div className="result-summary">
                                    <h3>{rx.patient.name || 'Unknown Patient'}</h3>
                                    <p>
                                        {rx.patient.age && `${rx.patient.age} yrs`}
                                        {rx.patient.gender && ` • ${rx.patient.gender}`}
                                        {rx.doctor.department && ` • ${rx.doctor.department}`}
                                    </p>
                                </div>
                            </div>
                            <div className="result-header-right">
                                <span className={getConfidenceBadgeClass(rx.confidenceLevel)}>
                                    {getConfidenceIcon(rx.confidenceLevel)}
                                    {rx.confidenceLevel} ({Math.round(rx.confidence * 100)}%)
                                </span>
                                <button className="expand-btn">
                                    {expandedId === rx.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Expanded Content */}
                        <AnimatePresence>
                            {expandedId === rx.id && (
                                <motion.div
                                    className="result-content"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="result-grid">
                                        {/* Left: Original Image */}
                                        <div className="result-image-section">
                                            <h4>Original Prescription</h4>
                                            <div className="result-image">
                                                <img src={rx.imageUrl} alt="Original prescription" />
                                            </div>
                                        </div>

                                        {/* Right: Structured Data */}
                                        <div className="result-data-section">
                                            {/* Patient Info */}
                                            <div className="data-block">
                                                <div className="data-block-header">
                                                    <User size={16} />
                                                    <span>Patient Information</span>
                                                </div>
                                                <div className="data-block-content">
                                                    <div className="data-row">
                                                        <span className="data-label">Name</span>
                                                        <span className="data-value">{rx.patient.name || 'Not specified'}</span>
                                                    </div>
                                                    <div className="data-row">
                                                        <span className="data-label">Age</span>
                                                        <span className="data-value">{rx.patient.age ? `${rx.patient.age} years` : 'Not specified'}</span>
                                                    </div>
                                                    <div className="data-row">
                                                        <span className="data-label">Gender</span>
                                                        <span className="data-value">{rx.patient.gender || 'Not specified'}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Doctor Info */}
                                            <div className="data-block">
                                                <div className="data-block-header">
                                                    <Stethoscope size={16} />
                                                    <span>Doctor Information</span>
                                                </div>
                                                <div className="data-block-content">
                                                    <div className="data-row">
                                                        <span className="data-label">Name</span>
                                                        <span className="data-value">{rx.doctor.name || 'Not specified'}</span>
                                                    </div>
                                                    <div className="data-row">
                                                        <span className="data-label">Department</span>
                                                        <span className="data-value">{rx.doctor.department || 'Not specified'}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Visit Info */}
                                            {(rx.visit.date || rx.visit.type) && (
                                                <div className="data-block">
                                                    <div className="data-block-header">
                                                        <Calendar size={16} />
                                                        <span>Visit Details</span>
                                                    </div>
                                                    <div className="data-block-content">
                                                        {rx.visit.date && (
                                                            <div className="data-row">
                                                                <span className="data-label">Date</span>
                                                                <span className="data-value">{rx.visit.date}</span>
                                                            </div>
                                                        )}
                                                        {rx.visit.type && (
                                                            <div className="data-row">
                                                                <span className="data-label">Type</span>
                                                                <span className="data-value">{rx.visit.type}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Clinical Info */}
                                            <div className="data-block">
                                                <div className="data-block-header">
                                                    <FileText size={16} />
                                                    <span>Clinical Information</span>
                                                </div>
                                                <div className="data-block-content">
                                                    {rx.clinical.symptoms.length > 0 && (
                                                        <div className="data-row">
                                                            <span className="data-label">Symptoms</span>
                                                            <div className="data-tags">
                                                                {rx.clinical.symptoms.map((s, i) => (
                                                                    <span key={i} className="tag">{s}</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {rx.clinical.diagnosis.length > 0 && (
                                                        <div className="data-row">
                                                            <span className="data-label">Diagnosis</span>
                                                            <div className="data-tags">
                                                                {rx.clinical.diagnosis.map((d, i) => (
                                                                    <span key={i} className="tag tag-primary">{d}</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Medicines */}
                                            {rx.medicines.length > 0 && (
                                                <div className="data-block">
                                                    <div className="data-block-header">
                                                        <Pill size={16} />
                                                        <span>Prescribed Medicines</span>
                                                    </div>
                                                    <div className="medicines-list">
                                                        {rx.medicines.map((med, i) => (
                                                            <div key={i} className="medicine-item">
                                                                <div className="medicine-name">{med.name}</div>
                                                                <div className="medicine-details">
                                                                    {med.dosage && <span>{med.dosage}</span>}
                                                                    {med.frequency && <span className="medicine-freq">{med.frequency}</span>}
                                                                    {med.duration && <span>{med.duration}</span>}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Additional Notes */}
                                            {rx.additionalNotes && (rx.additionalNotes.advice || rx.additionalNotes.followUp) && (
                                                <div className="data-block">
                                                    <div className="data-block-header">
                                                        <FileText size={16} />
                                                        <span>Additional Notes</span>
                                                    </div>
                                                    <div className="data-block-content">
                                                        {rx.additionalNotes.advice && (
                                                            <div className="data-row">
                                                                <span className="data-label">Advice</span>
                                                                <span className="data-value">{rx.additionalNotes.advice}</span>
                                                            </div>
                                                        )}
                                                        {rx.additionalNotes.followUp && (
                                                            <div className="data-row">
                                                                <span className="data-label">Follow-up</span>
                                                                <span className="data-value">{rx.additionalNotes.followUp}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </AnimatePresence>

            <style jsx>{`
        .results-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .result-card {
          overflow: hidden;
        }

        .result-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .result-header:hover {
          background: rgba(255, 255, 255, 0.02);
        }

        .result-header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .result-thumbnail {
          width: 60px;
          height: 60px;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: var(--bg-tertiary);
        }

        .result-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .result-summary h3 {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .result-summary p {
          font-size: 13px;
          color: var(--text-secondary);
        }

        .result-header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .expand-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s ease;
        }

        .expand-btn:hover {
          color: var(--text-primary);
        }

        .result-content {
          border-top: 1px solid var(--border-color);
          overflow: hidden;
        }

        .result-grid {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 24px;
          padding: 24px;
        }

        @media (max-width: 768px) {
          .result-grid {
            grid-template-columns: 1fr;
          }
        }

        .result-image-section h4,
        .result-data-section h4 {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
        }

        .result-image {
          border-radius: var(--radius-md);
          overflow: hidden;
          background: var(--bg-tertiary);
          max-height: 400px;
        }

        .result-image img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .result-data-section {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .data-block {
          background: var(--bg-secondary);
          border-radius: var(--radius-md);
          overflow: hidden;
        }

        .data-block-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: var(--bg-tertiary);
          font-size: 13px;
          font-weight: 600;
          color: var(--accent-primary);
        }

        .data-block-content {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .data-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .data-label {
          font-size: 11px;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .data-value {
          font-size: 14px;
          color: var(--text-primary);
        }

        .data-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .tag {
          padding: 4px 12px;
          background: var(--bg-tertiary);
          border-radius: 20px;
          font-size: 12px;
          color: var(--text-secondary);
        }

        .tag-primary {
          background: rgba(16, 185, 129, 0.15);
          color: var(--accent-primary);
        }

        .medicines-list {
          padding: 12px 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .medicine-item {
          padding: 12px;
          background: var(--bg-tertiary);
          border-radius: var(--radius-sm);
        }

        .medicine-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 6px;
        }

        .medicine-details {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          font-size: 12px;
          color: var(--text-secondary);
        }

        .medicine-freq {
          background: rgba(59, 130, 246, 0.15);
          color: var(--accent-secondary);
          padding: 2px 8px;
          border-radius: 4px;
        }
      `}</style>
        </div>
    );
}
