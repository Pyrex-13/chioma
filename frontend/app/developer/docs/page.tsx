'use client';

import { useState } from 'react';
import {
  BookOpen,
  Search,
  ChevronDown,
  ChevronRight,
  Zap,
  Lock,
  CreditCard,
  Home,
  Users,
} from 'lucide-react';

const ENDPOINT_GROUPS = [
  {
    id: 'payments',
    icon: CreditCard,
    label: 'Payments',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15',
    endpoints: [
      { method: 'POST', path: '/payments/rent', summary: 'Initiate a rent payment', badge: 'new' },
      { method: 'GET', path: '/payments/:id', summary: 'Retrieve payment by ID', badge: null },
      { method: 'GET', path: '/payments', summary: 'List all payments (paginated)', badge: null },
      { method: 'POST', path: '/payments/escrow/release', summary: 'Release escrow deposit', badge: null },
    ],
  },
  {
    id: 'properties',
    icon: Home,
    label: 'Properties',
    color: 'text-blue-400',
    bg: 'bg-blue-500/15',
    endpoints: [
      { method: 'GET', path: '/properties', summary: 'List property listings', badge: null },
      { method: 'POST', path: '/property-listings/wizard/start', summary: 'Start listing wizard draft', badge: null },
      { method: 'PATCH', path: '/property-listings/wizard/:id/step', summary: 'Save wizard step', badge: null },
      { method: 'POST', path: '/property-listings/wizard/:id/publish', summary: 'Publish listing', badge: null },
    ],
  },
  {
    id: 'webhooks',
    icon: Zap,
    label: 'Webhooks',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/15',
    endpoints: [
      { method: 'POST', path: '/webhooks', summary: 'Register a new webhook endpoint', badge: null },
      { method: 'GET', path: '/webhooks', summary: 'List all registered webhooks', badge: null },
      { method: 'DELETE', path: '/webhooks/:id', summary: 'Delete a webhook', badge: null },
    ],
  },
  {
    id: 'auth',
    icon: Lock,
    label: 'Authentication',
    color: 'text-violet-400',
    bg: 'bg-violet-500/15',
    endpoints: [
      { method: 'POST', path: '/auth/login', summary: 'Authenticate a user', badge: null },
      { method: 'POST', path: '/auth/refresh', summary: 'Refresh access token', badge: null },
      { method: 'POST', path: '/auth/logout', summary: 'Invalidate session', badge: null },
    ],
  },
  {
    id: 'users',
    icon: Users,
    label: 'Users',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/15',
    endpoints: [
      { method: 'GET', path: '/users/:id', summary: 'Get user profile', badge: null },
      { method: 'PATCH', path: '/users/:id', summary: 'Update user profile', badge: null },
    ],
  },
];

const methodColor: Record<string, string> = {
  GET: 'bg-blue-500/20 text-blue-400 border border-blue-400/30',
  POST: 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/30',
  PATCH: 'bg-amber-500/20 text-amber-400 border border-amber-400/30',
  PUT: 'bg-amber-500/20 text-amber-400 border border-amber-400/30',
  DELETE: 'bg-red-500/20 text-red-400 border border-red-400/30',
};

export default function ApiDocsPage() {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ payments: true });
  const [query, setQuery] = useState('');

  const toggle = (id: string) =>
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));

  const filtered = ENDPOINT_GROUPS.map((g) => ({
    ...g,
    endpoints: g.endpoints.filter(
      (e) =>
        !query ||
        e.path.toLowerCase().includes(query.toLowerCase()) ||
        e.summary.toLowerCase().includes(query.toLowerCase()),
    ),
  })).filter((g) => g.endpoints.length > 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">API Documentation</h2>
          <p className="text-blue-200/60 text-sm mt-1">
            REST endpoints for Chioma's rental infrastructure. Base URL:{' '}
            <code className="font-mono text-indigo-300 bg-white/5 px-1.5 py-0.5 rounded-md text-xs">
              https://api.chioma.app/v1
            </code>
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-blue-200/70">
          <BookOpen size={15} className="text-indigo-400" />
          <span>v1.0 — stable</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300/40"
          size={16}
        />
        <input
          id="dev-docs-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search endpoints…"
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10
            text-white placeholder:text-blue-300/30 text-sm
            focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
        />
      </div>

      {/* Endpoint groups */}
      <div className="space-y-3">
        {filtered.map((group) => {
          const Icon = group.icon;
          const isOpen = !!openGroups[group.id];
          return (
            <div
              key={group.id}
              id={`dev-docs-group-${group.id}`}
              className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
            >
              <button
                onClick={() => toggle(group.id)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-lg ${group.bg} flex items-center justify-center`}>
                    <Icon size={16} className={group.color} />
                  </span>
                  <span className="text-sm font-semibold text-white">{group.label}</span>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-blue-300/60 text-[11px] font-medium">
                    {group.endpoints.length}
                  </span>
                </div>
                {isOpen ? (
                  <ChevronDown size={16} className="text-blue-300/50" />
                ) : (
                  <ChevronRight size={16} className="text-blue-300/50" />
                )}
              </button>

              {isOpen && (
                <div className="border-t border-white/10 divide-y divide-white/5">
                  {group.endpoints.map((ep) => (
                    <div
                      key={ep.path}
                      id={`dev-docs-ep-${ep.method.toLowerCase()}-${ep.path.replace(/[/:]/g, '-').replace(/^-/, '')}`}
                      className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold w-14 text-center flex-shrink-0 ${methodColor[ep.method]}`}>
                        {ep.method}
                      </span>
                      <code className="text-blue-200/90 text-sm font-mono">{ep.path}</code>
                      <span className="text-blue-300/50 text-sm flex-1 hidden sm:block">{ep.summary}</span>
                      {ep.badge && (
                        <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[10px] font-semibold uppercase">
                          {ep.badge}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
