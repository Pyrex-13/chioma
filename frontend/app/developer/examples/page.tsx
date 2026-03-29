'use client';

import { useState } from 'react';
import { Code2, Copy, CheckCircle } from 'lucide-react';

const EXAMPLES = [
  {
    id: 'rent-payment',
    title: 'Initiate Rent Payment',
    description: 'Send USDC rent from a tenant wallet to landlord + agent via Stellar.',
    language: 'typescript',
    code: `import { ChiomaClient } from '@chioma/sdk';

const chioma = new ChiomaClient({ apiKey: process.env.CHIOMA_SECRET_KEY });

const payment = await chioma.payments.initiateRent({
  tenantId: 'usr_abc123',
  propertyId: 'prop_xyz789',
  amount: '1500.00',
  asset: 'USDC',
  memo: 'March 2026 rent',
});

console.log(payment.stellarTxHash);
// => 'abc1234…'`,
  },
  {
    id: 'webhook-verify',
    title: 'Verify a Webhook Signature',
    description: 'Validate the X-Chioma-Signature header to ensure authenticity.',
    language: 'typescript',
    code: `import { verifyWebhookSignature } from '@chioma/sdk/webhooks';

app.post('/chioma-webhook', (req, res) => {
  const rawBody = req.rawBody; // Buffer
  const signature = req.headers['x-chioma-signature'];
  const secret = process.env.CHIOMA_WEBHOOK_SECRET;

  const isValid = verifyWebhookSignature(rawBody, signature, secret);

  if (!isValid) {
    return res.status(401).send('Invalid signature');
  }

  const event = req.body;
  if (event.type === 'payment.completed') {
    // handle payment confirmation
  }

  res.sendStatus(200);
});`,
  },
  {
    id: 'list-properties',
    title: 'List Available Properties',
    description: 'Fetch paginated property listings with optional location filter.',
    language: 'typescript',
    code: `import { ChiomaClient } from '@chioma/sdk';

const chioma = new ChiomaClient({ apiKey: process.env.CHIOMA_SECRET_KEY });

const { data, meta } = await chioma.properties.list({
  location: 'Lagos, Nigeria',
  minRent: 500,
  maxRent: 2000,
  asset: 'USDC',
  page: 1,
  limit: 20,
});

data.forEach((property) => {
  console.log(property.title, property.monthlyRent);
});`,
  },
  {
    id: 'escrow-release',
    title: 'Release Security Deposit',
    description: 'Release a locked escrow deposit on move-out approval.',
    language: 'typescript',
    code: `import { ChiomaClient } from '@chioma/sdk';

const chioma = new ChiomaClient({ apiKey: process.env.CHIOMA_SECRET_KEY });

const result = await chioma.payments.releaseEscrow({
  leaseId: 'lease_mn456',
  reason: 'move_out_approved',
  approvedBy: 'usr_landlord_789',
});

console.log(result.status);      // => 'released'
console.log(result.txHash);      // => 'def567…'
console.log(result.releasedAt);  // => '2026-03-29T18:00:00Z'`,
  },
];

export default function ExamplesPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Code Examples</h2>
        <p className="text-blue-200/60 text-sm mt-1">
          Ready-to-run snippets covering the most common Chioma integration patterns.
        </p>
      </div>

      <div className="space-y-6">
        {EXAMPLES.map((ex) => (
          <div
            key={ex.id}
            id={`dev-example-${ex.id}`}
            className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
          >
            {/* Title bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400/20 flex items-center justify-center flex-shrink-0">
                  <Code2 size={15} className="text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{ex.title}</h3>
                  <p className="text-blue-300/50 text-xs mt-0.5">{ex.description}</p>
                </div>
              </div>
              <button
                id={`dev-example-copy-${ex.id}`}
                onClick={() => handleCopy(ex.id, ex.code)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-blue-300/60 hover:text-blue-200 text-xs font-medium transition-all flex-shrink-0"
                aria-label="Copy code"
              >
                {copied === ex.id ? (
                  <>
                    <CheckCircle size={13} className="text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    Copy
                  </>
                )}
              </button>
            </div>

            {/* Code block */}
            <div className="overflow-x-auto">
              <pre className="px-6 py-5 text-sm font-mono text-blue-100/90 leading-relaxed whitespace-pre">
                <code>{ex.code}</code>
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
