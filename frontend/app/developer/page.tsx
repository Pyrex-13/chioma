'use client';

import Link from 'next/link';
import {
  BookOpen,
  Webhook,
  KeyRound,
  Layers,
  Code2,
  Activity,
  ArrowRight,
  Zap,
  Shield,
  Globe,
} from 'lucide-react';
import { useAuth } from '@/store/authStore';

const quickLinks = [
  {
    label: 'API Documentation',
    description: 'Explore all endpoints, request shapes, and response schemas.',
    href: '/developer/docs',
    icon: BookOpen,
    color: 'from-blue-500/20 to-indigo-500/20 border-blue-400/20',
    iconColor: 'text-blue-400',
  },
  {
    label: 'Webhooks',
    description: 'Configure event listeners for real-time payment and lease updates.',
    href: '/developer/webhooks',
    icon: Webhook,
    color: 'from-indigo-500/20 to-purple-500/20 border-indigo-400/20',
    iconColor: 'text-indigo-400',
  },
  {
    label: 'API Keys',
    description: 'Manage your secret and publishable keys for sandbox and production.',
    href: '/developer/api-keys',
    icon: KeyRound,
    color: 'from-violet-500/20 to-pink-500/20 border-violet-400/20',
    iconColor: 'text-violet-400',
  },
  {
    label: 'SDKs & Libraries',
    description: 'Official SDKs for JavaScript, Python, Rust, and more.',
    href: '/developer/sdks',
    icon: Layers,
    color: 'from-cyan-500/20 to-teal-500/20 border-cyan-400/20',
    iconColor: 'text-cyan-400',
  },
  {
    label: 'Code Examples',
    description: 'Ready-to-run snippets for common Chioma integration patterns.',
    href: '/developer/examples',
    icon: Code2,
    color: 'from-emerald-500/20 to-green-500/20 border-emerald-400/20',
    iconColor: 'text-emerald-400',
  },
  {
    label: 'API Status',
    description: 'Live uptime metrics and incident history for all services.',
    href: '/developer/status',
    icon: Activity,
    color: 'from-amber-500/20 to-orange-500/20 border-amber-400/20',
    iconColor: 'text-amber-400',
  },
];

const highlights = [
  {
    icon: Zap,
    label: 'Fast Settlement',
    description: 'Stellar finalises payments in ~5 seconds, reflected via webhooks instantly.',
  },
  {
    icon: Shield,
    label: 'Secure by Default',
    description: 'All keys are scoped, rate-limited, and rotatable without downtime.',
  },
  {
    icon: Globe,
    label: 'Multi-Currency',
    description: 'Accept USDC, NGN, KES, GHS and any SEP-31 anchor asset out of the box.',
  },
];

export default function DeveloperDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-10">
      {/* Hero greeting */}
      <section className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-900/40 via-blue-900/30 to-slate-900/40 border border-indigo-400/20 p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.15),transparent_60%)] pointer-events-none" />
        <div className="relative">
          <p className="text-indigo-300/80 text-sm font-medium mb-2">
            Welcome back, {user?.firstName ?? 'Developer'} 👋
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
            Chioma Developer Portal
          </h2>
          <p className="text-blue-200/70 text-base max-w-2xl leading-relaxed">
            Build on top of Stellar-powered rental infrastructure. Access API keys,
            configure webhooks, browse documentation, and ship faster with our official SDKs.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/developer/docs"
              id="dev-cta-docs"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                bg-gradient-to-r from-indigo-600 to-blue-600
                hover:from-indigo-500 hover:to-blue-500
                text-white text-sm font-semibold shadow-lg shadow-indigo-900/30
                transition-all duration-200"
            >
              Explore API Docs
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/developer/api-keys"
              id="dev-cta-keys"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                bg-white/10 hover:bg-white/15 border border-white/15
                text-white text-sm font-semibold transition-all duration-200"
            >
              <KeyRound size={16} />
              Get API Keys
            </Link>
          </div>
        </div>
      </section>

      {/* Why Chioma API */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {highlights.map((h) => {
          const Icon = h.icon;
          return (
            <div
              key={h.label}
              className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/20 flex items-center justify-center">
                <Icon size={20} className="text-indigo-400" />
              </div>
              <h3 className="text-sm font-semibold text-white">{h.label}</h3>
              <p className="text-blue-200/60 text-xs leading-relaxed">{h.description}</p>
            </div>
          );
        })}
      </section>

      {/* Quick Links Grid */}
      <section>
        <h2 className="text-xs font-semibold text-blue-300/50 uppercase tracking-widest mb-4">
          Portal Sections
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.label}
                href={link.href}
                id={`dev-quick-${link.label.toLowerCase().replace(/\s+/g, '-').replace(/[&]/g, 'and')}`}
                className={`group rounded-2xl bg-gradient-to-br ${link.color} border
                  p-6 space-y-3 hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-900/20
                  transition-all duration-200`}
              >
                <div className="flex items-center justify-between">
                  <Icon size={22} className={link.iconColor} />
                  <ArrowRight
                    size={16}
                    className="text-blue-300/30 group-hover:text-blue-200 group-hover:translate-x-1 transition-all"
                  />
                </div>
                <h3 className="text-sm font-semibold text-white">{link.label}</h3>
                <p className="text-blue-200/60 text-xs leading-relaxed">{link.description}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
