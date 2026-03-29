'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, Search, Bell, User } from 'lucide-react';
import { DeveloperSidebar } from '@/components/developer/DeveloperSidebar';
import { DeveloperNav } from '@/components/developer/DeveloperNav';
import { developerNavItems } from '@/data/developer-nav-items';
import { useAuth } from '@/store/authStore';
import { ClientErrorBoundary } from '@/components/error/ClientErrorBoundary';

export default function DeveloperPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  // Server middleware protects /developer/* but add a client-side role guard too
  if (!loading && (!isAuthenticated || !user)) {
    router.replace('/login?callbackUrl=/developer');
    return null;
  }

  if (!loading && user && user.role !== 'admin' && user.role !== 'agent') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-2xl border border-amber-400/20 bg-amber-500/10 backdrop-blur-xl p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center mx-auto">
            <User size={28} className="text-amber-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Access Restricted</h2>
          <p className="text-amber-200/80 text-sm leading-relaxed">
            The Developer Portal is only accessible to admins and agents. If you
            believe this is a mistake, please contact your administrator.
          </p>
          <button
            onClick={() => router.replace('/dashboard')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white flex flex-col lg:flex-row font-sans">
      {/* Sidebar */}
      <DeveloperSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        navItems={developerNavItems}
      />

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0 min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 backdrop-blur-xl bg-slate-950/80 border-b border-white/10">
          <div className="h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            {/* Left — mobile toggle + title */}
            <div className="flex items-center gap-4">
              <button
                id="dev-sidebar-toggle"
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-blue-200 hover:bg-white/10 rounded-xl transition-colors"
                aria-label="Open developer sidebar"
              >
                <Menu size={24} />
              </button>
              <div className="hidden sm:flex flex-col">
                <h1 className="text-xl font-bold tracking-tight text-white leading-none">
                  Developer Portal
                </h1>
                <span className="text-xs text-indigo-400/80 font-medium mt-0.5">
                  Chioma API Platform
                </span>
              </div>
            </div>

            {/* Right — search + notifications + avatar */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Search bar (desktop) */}
              <div className="hidden md:flex relative w-60">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300/50"
                  size={16}
                />
                <input
                  id="dev-search"
                  type="text"
                  placeholder="Search docs, endpoints…"
                  className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white placeholder:text-blue-300/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                />
              </div>
              {/* Search icon (mobile) */}
              <button
                id="dev-search-mobile"
                className="md:hidden p-2 text-blue-200 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* Notifications */}
              <button
                id="dev-notifications"
                className="relative p-2 text-blue-200 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Notifications"
              >
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-400 border-2 border-slate-950" />
              </button>

              {/* Avatar */}
              <button
                id="dev-user-avatar"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 hover:bg-indigo-500/30 transition-all"
                aria-label="User profile"
              >
                {user ? (
                  <span className="text-sm font-bold">
                    {user.firstName.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <User size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Breadcrumb + mobile tab nav */}
          <DeveloperNav />
        </header>

        {/* Page Content */}
        <ClientErrorBoundary
          source="app/developer/layout.tsx-main"
          fallbackTitle="Developer Portal error"
          fallbackDescription="Something went wrong loading this developer view. Please retry."
        >
          <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto overflow-x-hidden">
            {children}
          </main>
        </ClientErrorBoundary>
      </div>
    </div>
  );
}
