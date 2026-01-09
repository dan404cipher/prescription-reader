'use client';

import React from 'react';
import {
    LayoutDashboard,
    Stethoscope,
    Calendar,
    FileText,
    MessageSquare,
    Clock,
    HelpCircle,
    LogOut,
    X,
} from 'lucide-react';
import { useSidebar } from '@/context/SidebarContext';

const NAV_ITEMS = [
    { icon: LayoutDashboard, label: 'Dashboard', disabled: true },
    { icon: Stethoscope, label: 'Doctors', disabled: true },
    { icon: Calendar, label: 'Appointments', disabled: true },
    { icon: FileText, label: 'Prescriptions', active: true },
    { icon: MessageSquare, label: 'Messages', disabled: true },
    { icon: Clock, label: 'History', disabled: true },
];

const BOTTOM_ITEMS = [
    { icon: HelpCircle, label: 'Help', disabled: true },
    { icon: LogOut, label: 'Logout', disabled: true },
];

export default function Sidebar() {
    const { isOpen, closeSidebar } = useSidebar();

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar */}
            <div className={`
                w-20 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 z-50
                transition-transform duration-300
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0
            `}>
                {/* Close Button (Mobile Only) */}
                <button
                    onClick={closeSidebar}
                    className="lg:hidden absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600"
                >
                    <X size={20} />
                </button>

                {/* Logo Area */}
                <div className="p-4 flex items-center justify-center">
                    <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-bold">
                        <FileText size={28} />
                    </div>
                </div>

                {/* Main Navigation */}
                <nav className="flex-1 px-2 py-6 space-y-2">
                    {NAV_ITEMS.map((item) => (
                        <div
                            key={item.label}
                            onClick={closeSidebar}
                            className={`group relative flex items-center justify-center p-3 rounded-xl transition-all ${item.active
                                ? 'bg-emerald-50 text-emerald-600 shadow-sm'
                                : item.disabled
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 cursor-pointer'
                                }`}
                        >
                            <item.icon size={26} strokeWidth={1.5} />
                            {/* Tooltip */}
                            <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-lg">
                                {item.label}
                                {item.disabled && <span className="text-gray-400 ml-2 text-xs">(Coming soon)</span>}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Bottom Actions */}
                <div className="p-2 border-t border-gray-100 space-y-2 pb-6">
                    {BOTTOM_ITEMS.map((item) => (
                        <div
                            key={item.label}
                            className="group relative flex items-center justify-center p-3 rounded-xl text-gray-300 cursor-not-allowed"
                        >
                            <item.icon size={26} strokeWidth={1.5} />
                            {/* Tooltip */}
                            <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-lg">
                                {item.label}
                                <span className="text-gray-400 ml-2 text-xs">(Coming soon)</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
