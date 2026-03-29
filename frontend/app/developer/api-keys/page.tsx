'use client';

import { useState } from 'react';
import {
  KeyRound,
  Plus,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

const MOCK_KEYS = [
  {
    id: 'key_1',
    name: 'Production Secret Key',
    prefix: 'sk_live_',
    masked: 'sk_live_••••••••••••••••••••••Kx9a',
    environment: 'production',
    created: '2026-01-14',
    lastUsed: '2026-03-28',
    permissions: ['payments:write', 'webhooks:write', 'listings:read'],
  },
  {
    id: 'key_2',
    name: 'Sandbox Test Key',
    prefix: 'sk_test_',
    masked: 'sk_test_••••••••••••••••••••••mZ3r',
    environment: 'sandbox',
    created: '2026-02-01',
    lastUsed: '2026-03-29',
    permissions: ['payments:write', 'webhooks:write', 'listings:write'],
  },
  {
    id: 'key_3',
    name: 'Read-Only Auditor Key',
    prefix: 'sk_live_',
    masked: 'sk_live_••••••••••••••••••••••Ab1z',
    environment: 'production',
    created: '2026-03-10',
    lastUsed: 'Never',
    permissions: ['payments:read', 'listings:read'],
  },
];

const envBadge = (env: string) =>
  env === 'production'
    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-400/20'
    : 'bg-amber-500/15 text-amber-400 border border-amber-400/20';

export default function ApiKeysPage() {
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (id: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">API Keys</h2>
          <p className="text-blue-200/60 text-sm mt-1">
            Manage your secret keys for sandbox and production environments.
          </p>
        </div>
        <button
          id="dev-create-api-key"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
            bg-gradient-to-r from-indigo-600 to-blue-600
            hover:from-indigo-500 hover:to-blue-500
            text-white text-sm font-semibold shadow-lg transition-all duration-200"
        >
          <Plus size={16} />
          Create New Key
        </button>
      </div>

      {/* Warning */}
      <div className="flex items-start gap-3 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-5">
        <AlertCircle size={18} className="text-amber-400 mt-0.5 flex-shrink-0" />
        <p className="text-amber-200/80 text-sm leading-relaxed">
          <strong className="text-amber-300">Keep your secret keys safe.</strong> Never expose
          them in client-side code or public repositories. Rotate compromised keys immediately.
        </p>
      </div>

      {/* Keys list */}
      <div className="space-y-4">
        {MOCK_KEYS.map((key) => (
          <div
            key={key.id}
            id={`dev-api-key-${key.id}`}
            className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/20 flex items-center justify-center flex-shrink-0">
                  <KeyRound size={18} className="text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{key.name}</p>
                  <p className="text-xs text-blue-300/50 mt-0.5">
                    Created {key.created} · Last used {key.lastUsed}
                  </p>
                </div>
              </div>
              <span className={`self-start sm:self-auto px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${envBadge(key.environment)}`}>
                {key.environment}
              </span>
            </div>

            {/* Key value row */}
            <div className="flex items-center gap-2 rounded-xl bg-slate-950/60 border border-white/10 px-4 py-3 font-mono text-sm text-blue-200/80">
              <span className="flex-1 truncate">
                {revealedKey === key.id ? key.prefix + 'EXAMPLE_FULL_KEY_VALUE' : key.masked}
              </span>
              <button
                id={`dev-key-reveal-${key.id}`}
                onClick={() => setRevealedKey(revealedKey === key.id ? null : key.id)}
                className="text-blue-300/50 hover:text-blue-200 transition-colors flex-shrink-0"
                aria-label={revealedKey === key.id ? 'Hide key' : 'Reveal key'}
              >
                {revealedKey === key.id ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <button
                id={`dev-key-copy-${key.id}`}
                onClick={() => handleCopy(key.id, key.masked)}
                className="text-blue-300/50 hover:text-blue-200 transition-colors flex-shrink-0"
                aria-label="Copy API key"
              >
                {copied === key.id ? (
                  <CheckCircle size={16} className="text-emerald-400" />
                ) : (
                  <Copy size={16} />
                )}
              </button>
            </div>

            {/* Permissions */}
            <div className="flex flex-wrap gap-1.5">
              {key.permissions.map((p) => (
                <span
                  key={p}
                  className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-blue-300/60 text-[11px] font-medium"
                >
                  {p}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1 border-t border-white/10">
              <button
                id={`dev-key-rotate-${key.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-300/70 hover:bg-white/5 hover:text-blue-200 transition-all"
              >
                <RefreshCw size={13} />
                Rotate
              </button>
              <button
                id={`dev-key-delete-${key.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400/70 hover:bg-red-500/10 hover:text-red-400 transition-all"
              >
                <Trash2 size={13} />
                Revoke
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
