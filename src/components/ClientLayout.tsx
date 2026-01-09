'use client';

import React from 'react';
import { SidebarProvider } from '@/context/SidebarContext';
import Sidebar from '@/components/Sidebar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen bg-[var(--bg-main)]">
                <Sidebar />
                <main className="flex-1 ml-0 lg:ml-20 p-4 lg:p-8 overflow-hidden min-h-screen">
                    {children}
                </main>
            </div>
        </SidebarProvider>
    );
}
