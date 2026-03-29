'use client';

import { LifeBuoy, ExternalLink, MessageCircle, Mail, BookOpen } from 'lucide-react';

const RESOURCES = [
  {
    id: 'telegram',
    icon: MessageCircle,
    label: 'Community (Telegram)',
    description: 'Join 500+ builders in the Chioma developer community. Ask questions, share projects.',
    href: 'https://t.me/chiomagroup',
    cta: 'Join the group',
    color: 'text-blue-400',
    bg: 'bg-blue-500/15 border-blue-400/20',
  },
  {
    id: 'email',
    icon: Mail,
    label: 'Email Support',
    description: 'For urgent issues, billing questions, or private security disclosures.',
    href: 'mailto:developers@chioma.app',
    cta: 'Send an email',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/15 border-indigo-400/20',
  },
  {
    id: 'docs',
    icon: BookOpen,
    label: 'Full Documentation',
    description: 'Deep-dive guides covering authentication flows, Stellar concepts, and escrow patterns.',
    href: '/developer/docs',
    cta: 'Read the docs',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15 border-emerald-400/20',
  },
];

const FAQS = [
  {
    q: 'Which Stellar network should I use for testing?',
    a: 'Chioma sandbox environments are configured against Stellar Testnet. Use the test Friendbot to fund wallets and set your API key environment to "sandbox".',
  },
  {
    q: 'How do I handle webhook failures and retries?',
    a: 'Chioma retries failed webhook deliveries up to 5 times with exponential back-off (1 min, 5 min, 30 min, 2 h, 8 h). We recommend returning 200 quickly and processing asynchronously.',
  },
  {
    q: 'Can I accept currencies other than USDC?',
    a: 'Yes. We support any SEP-31 anchor asset. Configure the asset code and issuer in your payment request. The built-in DEX will handle path payments automatically.',
  },
  {
    q: 'What rate limits apply to API keys?',
    a: 'Default limits are 60 requests/minute per key for sandbox and 600/minute for production. Contact us to request higher limits for enterprise integrations.',
  },
];

export default function DeveloperSupportPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/20 flex items-center justify-center flex-shrink-0">
          <LifeBuoy size={22} className="text-indigo-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Support</h2>
          <p className="text-blue-200/60 text-sm mt-0.5">
            We're here to help you ship faster on Stellar.
          </p>
        </div>
      </div>

      {/* Support channels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {RESOURCES.map((r) => {
          const Icon = r.icon;
          return (
            <a
              key={r.id}
              href={r.href}
              id={`dev-support-${r.id}`}
              target={r.id !== 'docs' ? '_blank' : undefined}
              rel="noopener noreferrer"
              className={`group rounded-2xl border p-6 space-y-4 hover:scale-[1.02] transition-all duration-200 ${r.bg}`}
            >
              <Icon size={24} className={r.color} />
              <div>
                <h3 className="text-sm font-bold text-white">{r.label}</h3>
                <p className="text-blue-200/60 text-xs mt-1.5 leading-relaxed">{r.description}</p>
              </div>
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${r.color} group-hover:underline`}>
                {r.cta}
                <ExternalLink size={12} />
              </span>
            </a>
          );
        })}
      </div>

      {/* FAQ */}
      <div>
        <h3 className="text-xs font-semibold text-blue-300/50 uppercase tracking-widest mb-5">
          Frequently Asked Questions
        </h3>
        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              id={`dev-faq-${i + 1}`}
              className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-2"
            >
              <h4 className="text-sm font-semibold text-white">{faq.q}</h4>
              <p className="text-blue-200/60 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
