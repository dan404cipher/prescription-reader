'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart3,
    Pill,
    Activity,
    AlertTriangle,
    Building2,
    TrendingUp,
    Search,
    X
} from 'lucide-react';
import { AggregateAnalysis, PrescriptionResult } from '@/types/prescription';

interface AggregateViewProps {
    analysis: AggregateAnalysis;
    prescriptions: PrescriptionResult[];
    onFilterChange?: (filter: string | null) => void;
}

export default function AggregateView({ analysis, prescriptions, onFilterChange }: AggregateViewProps) {
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleFilterClick = (filter: string) => {
        const newFilter = activeFilter === filter ? null : filter;
        setActiveFilter(newFilter);
        onFilterChange?.(newFilter);
    };

    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 0.7) return 'var(--accent-success)';
        if (confidence >= 0.5) return 'var(--accent-warning)';
        return 'var(--accent-error)';
    };

    const getConfidenceLabel = (confidence: number) => {
        if (confidence >= 0.7) return 'HIGH';
        if (confidence >= 0.5) return 'MEDIUM';
        return 'LOW';
    };

    return (
        <div className="aggregate-container">
            {/* Header Stats */}
            <div className="stats-grid">
                <motion.div
                    className="stat-card glass-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0 }}
                >
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                        <BarChart3 size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-value">{analysis.totalPrescriptions}</span>
                        <span className="stat-label">Total Prescriptions</span>
                    </div>
                </motion.div>

                <motion.div
                    className="stat-card glass-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                        <Activity size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-value">{analysis.commonDiagnoses.length}</span>
                        <span className="stat-label">Unique Diagnoses</span>
                    </div>
                </motion.div>

                <motion.div
                    className="stat-card glass-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}>
                        <Pill size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-value">{analysis.topMedicines.length}</span>
                        <span className="stat-label">Unique Medicines</span>
                    </div>
                </motion.div>

                <motion.div
                    className="stat-card glass-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div
                        className="stat-icon"
                        style={{
                            background: `linear-gradient(135deg, ${getConfidenceColor(analysis.averageConfidence)}, ${getConfidenceColor(analysis.averageConfidence)}88)`
                        }}
                    >
                        <TrendingUp size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-value">{Math.round(analysis.averageConfidence * 100)}%</span>
                        <span className="stat-label">Avg. Confidence ({getConfidenceLabel(analysis.averageConfidence)})</span>
                    </div>
                </motion.div>
            </div>

            {/* Search and Filter */}
            <div className="search-section">
                <div className="search-box glass-card">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search diagnoses, medicines, or patients..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button className="search-clear" onClick={() => setSearchQuery('')}>
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>

            {/* Analysis Sections */}
            <div className="analysis-grid">
                {/* Common Diagnoses */}
                <motion.div
                    className="analysis-card glass-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="analysis-header">
                        <Activity size={18} />
                        <h3>Common Diagnoses</h3>
                    </div>
                    <div className="analysis-list">
                        {analysis.commonDiagnoses.length > 0 ? (
                            analysis.commonDiagnoses.map((item, index) => (
                                <div
                                    key={index}
                                    className={`analysis-item ${activeFilter === item.name ? 'active' : ''}`}
                                    onClick={() => handleFilterClick(item.name)}
                                >
                                    <span className="item-name">{item.name}</span>
                                    <div className="item-bar-container">
                                        <div
                                            className="item-bar"
                                            style={{
                                                width: `${(item.count / analysis.totalPrescriptions) * 100}%`,
                                                background: 'var(--gradient-primary)'
                                            }}
                                        />
                                    </div>
                                    <span className="item-count">{item.count}</span>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">No diagnoses recorded</div>
                        )}
                    </div>
                </motion.div>

                {/* Top Medicines */}
                <motion.div
                    className="analysis-card glass-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="analysis-header">
                        <Pill size={18} />
                        <h3>Top Medicines</h3>
                    </div>
                    <div className="analysis-list">
                        {analysis.topMedicines.length > 0 ? (
                            analysis.topMedicines.map((item, index) => (
                                <div
                                    key={index}
                                    className={`analysis-item ${activeFilter === item.name ? 'active' : ''}`}
                                    onClick={() => handleFilterClick(item.name)}
                                >
                                    <span className="item-name">{item.name}</span>
                                    <div className="item-bar-container">
                                        <div
                                            className="item-bar"
                                            style={{
                                                width: `${(item.count / analysis.totalPrescriptions) * 100}%`,
                                                background: 'var(--gradient-secondary)'
                                            }}
                                        />
                                    </div>
                                    <span className="item-count">{item.count}</span>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">No medicines recorded</div>
                        )}
                    </div>
                </motion.div>

                {/* Department Distribution */}
                {analysis.departmentDistribution.length > 0 && (
                    <motion.div
                        className="analysis-card glass-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <div className="analysis-header">
                            <Building2 size={18} />
                            <h3>Departments</h3>
                        </div>
                        <div className="analysis-list">
                            {analysis.departmentDistribution.map((item, index) => (
                                <div
                                    key={index}
                                    className={`analysis-item ${activeFilter === item.name ? 'active' : ''}`}
                                    onClick={() => handleFilterClick(item.name)}
                                >
                                    <span className="item-name">{item.name}</span>
                                    <div className="item-bar-container">
                                        <div
                                            className="item-bar"
                                            style={{
                                                width: `${(item.count / analysis.totalPrescriptions) * 100}%`,
                                                background: 'linear-gradient(135deg, #f59e0b, #d97706)'
                                            }}
                                        />
                                    </div>
                                    <span className="item-count">{item.count}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Flags & Warnings */}
                {analysis.flags.length > 0 && (
                    <motion.div
                        className="analysis-card glass-card flags-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                    >
                        <div className="analysis-header">
                            <AlertTriangle size={18} />
                            <h3>Flags & Warnings</h3>
                        </div>
                        <div className="flags-list">
                            {analysis.flags.map((flag, index) => (
                                <div key={index} className="flag-item">
                                    <AlertTriangle size={14} />
                                    <span>{flag}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            <style jsx>{`
        .aggregate-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
        }

        .stat-icon {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .stat-content {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1;
        }

        .stat-label {
          font-size: 13px;
          color: var(--text-secondary);
          margin-top: 4px;
        }

        .search-section {
          display: flex;
          gap: 12px;
        }

        .search-box {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
        }

        .search-icon {
          color: var(--text-muted);
        }

        .search-box input {
          flex: 1;
          background: none;
          border: none;
          color: var(--text-primary);
          font-size: 14px;
          outline: none;
        }

        .search-box input::placeholder {
          color: var(--text-muted);
        }

        .search-clear {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .search-clear:hover {
          color: var(--text-primary);
        }

        .analysis-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        @media (max-width: 768px) {
          .analysis-grid {
            grid-template-columns: 1fr;
          }
        }

        .analysis-card {
          padding: 20px;
        }

        .analysis-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
          color: var(--accent-primary);
        }

        .analysis-header h3 {
          font-size: 15px;
          font-weight: 600;
        }

        .analysis-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .analysis-item {
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          background: var(--bg-secondary);
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .analysis-item:hover {
          background: var(--bg-tertiary);
        }

        .analysis-item.active {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .item-name {
          font-size: 13px;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .item-bar-container {
          height: 6px;
          background: var(--bg-tertiary);
          border-radius: 3px;
          overflow: hidden;
        }

        .item-bar {
          height: 100%;
          border-radius: 3px;
          transition: width 0.5s ease;
        }

        .item-count {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-secondary);
          min-width: 24px;
          text-align: right;
        }

        .empty-state {
          color: var(--text-muted);
          font-size: 13px;
          padding: 16px;
          text-align: center;
        }

        .flags-card {
          grid-column: span 2;
        }

        @media (max-width: 768px) {
          .flags-card {
            grid-column: span 1;
          }
        }

        .flags-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .flag-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.2);
          border-radius: var(--radius-sm);
          color: var(--accent-warning);
          font-size: 13px;
        }
      `}</style>
        </div>
    );
}
