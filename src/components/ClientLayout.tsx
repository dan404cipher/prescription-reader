'use client';

import React from 'react';
import { SidebarProvider } from '@/context/SidebarContext';
import Sidebar from '@/components/Sidebar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <div className="flex w-full min-h-screen lg:h-screen bg-[var(--bg-main)] lg:overflow-hidden">
                <Sidebar />
                <main className="flex-1 ml-0 lg:ml-20 p-4 lg:p-8 lg:h-full lg:overflow-hidden flex flex-col">
                    {children}
                </main>
            </div>
        </SidebarProvider>
    );
}
