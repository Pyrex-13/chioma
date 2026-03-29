'use client';

import { useState } from 'react';
import { Layers, ArrowUpRight, Copy, CheckCircle } from 'lucide-react';

const SDKS = [
  {
    id: 'js',
    language: 'JavaScript / TypeScript',
    packageName: '@chioma/sdk',
    installCmd: 'npm install @chioma/sdk',
    version: '1.2.4',
    status: 'stable',
    repoUrl: 'https://github.com/chioma-protocol/chioma-js',
    description:
      'Full-featured SDK for Node.js and browser environments. Includes typed request/response interfaces for all Chioma API resources.',
    features: ['TypeScript-first', 'Tree-shakeable', 'Webhook helpers', 'Stellar SDK integration'],
  },
  {
    id: 'python',
    language: 'Python',
    packageName: 'chioma-sdk',
    installCmd: 'pip install chioma-sdk',
    version: '0.9.1',
    status: 'beta',
    repoUrl: 'https://github.com/chioma-protocol/chioma-python',
    description:
      'Async-first Python SDK built on httpx. Supports all payment and listing endpoints with Pydantic models.',
    features: ['Async / await', 'Pydantic models', 'Stellar XDR signing', 'Webhook verification'],
  },
  {
    id: 'rust',
    language: 'Rust',
    packageName: 'chioma',
    installCmd: 'cargo add chioma',
    version: '0.3.0',
    status: 'beta',
    repoUrl: 'https://github.com/chioma-protocol/chioma-rs',
    description:
      'High-performance Rust crate for backend services that need to interact with the Chioma payment layer and Stellar network.',
    features: ['No-std compatible', 'WASM target', 'Soroban bindings', 'Rate-limit retries'],
  },
  {
    id: 'go',
    language: 'Go',
    packageName: 'github.com/chioma-protocol/chioma-go',
    installCmd: 'go get github.com/chioma-protocol/chioma-go',
    version: '0.1.0',
    status: 'alpha',
    repoUrl: 'https://github.com/chioma-protocol/chioma-go',
    description:
      'Idiomatic Go client with context propagation, retries, and structured logging support.',
    features: ['Context-aware', 'Structured logging', 'Retry backoff', 'Webhook middleware'],
  },
];

const statusBadge: Record<string, string> = {
  stable: 'bg-emerald-500/15 text-emerald-400 border-emerald-400/20',
  beta: 'bg-amber-500/15 text-amber-400 border-amber-400/20',
  alpha: 'bg-red-500/15 text-red-400 border-red-400/20',
};

const langColor: Record<string, string> = {
  js: 'from-yellow-500/20 to-amber-500/20 border-yellow-400/20',
  python: 'from-blue-500/20 to-cyan-500/20 border-blue-400/20',
  rust: 'from-orange-500/20 to-red-500/20 border-orange-400/20',
  go: 'from-cyan-500/20 to-teal-500/20 border-cyan-400/20',
};

export default function SdksPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (id: string, cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">SDKs & Libraries</h2>
        <p className="text-blue-200/60 text-sm mt-1">
          Official client libraries maintained by the Chioma core team. All SDKs are open-source.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {SDKS.map((sdk) => (
          <div
            key={sdk.id}
            id={`dev-sdk-${sdk.id}`}
            className={`rounded-2xl bg-gradient-to-br ${langColor[sdk.id]} border p-6 space-y-5`}
          >
            {/* Title row */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Layers size={18} className="text-white/70" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{sdk.language}</h3>
                  <code className="text-xs text-blue-200/60 font-mono">{sdk.packageName}</code>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`px-2 py-0.5 rounded-full border text-[11px] font-semibold uppercase ${statusBadge[sdk.status]}`}>
                  {sdk.status}
                </span>
                <span className="text-xs text-blue-300/40 font-mono">v{sdk.version}</span>
              </div>
            </div>

            <p className="text-blue-200/70 text-xs leading-relaxed">{sdk.description}</p>

            {/* Install command */}
            <div className="flex items-center gap-2 rounded-xl bg-slate-950/60 border border-white/10 px-4 py-2.5">
              <code className="text-sm text-emerald-300 font-mono flex-1">{sdk.installCmd}</code>
              <button
                id={`dev-sdk-copy-${sdk.id}`}
                onClick={() => handleCopy(sdk.id, sdk.installCmd)}
                className="text-blue-300/40 hover:text-blue-200 transition-colors flex-shrink-0"
                aria-label="Copy install command"
              >
                {copied === sdk.id ? (
                  <CheckCircle size={15} className="text-emerald-400" />
                ) : (
                  <Copy size={15} />
                )}
              </button>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-1.5">
              {sdk.features.map((f) => (
                <span
                  key={f}
                  className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-blue-300/60 text-[11px] font-medium"
                >
                  {f}
                </span>
              ))}
            </div>

            {/* GitHub link */}
            <a
              href={sdk.repoUrl}
              id={`dev-sdk-repo-${sdk.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-300/60 hover:text-blue-200 transition-colors"
            >
              View on GitHub
              <ArrowUpRight size={13} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
