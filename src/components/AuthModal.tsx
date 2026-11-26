import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchSupercharts: () => void;
}

const PLANS = [
  {
    name: 'Basic',
    audience: 'For casual market watchers',
    monthly: '$0',
    annual: '$0',
    highlights: ['1 chart per tab', '2 indicators per chart', 'Global market summary'],
  },
  {
    name: 'Essential',
    audience: 'For active swing traders',
    monthly: '$14.95',
    annual: '$12.95',
    highlights: ['2 charts per tab', '5 indicators per chart', '20 active price alerts'],
  },
  {
    name: 'Plus',
    audience: 'For multi-screen technical analysis',
    monthly: '$29.95',
    annual: '$24.95',
    highlights: ['4 charts per tab', '10 indicators per chart', '100 technical alerts'],
  },
  {
    name: 'Premium',
    audience: 'For high-precision desk workflows',
    monthly: '$59.95',
    annual: '$49.95',
    highlights: ['8 charts per tab', '25 indicators per chart', 'Second-based intervals'],
  },
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLaunchSupercharts,
}) => {
  const [billing, setBilling] = useState<'annual' | 'monthly'>('annual');
  const [selectedPlan, setSelectedPlan] = useState('Essential');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Get started with TradingView"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-[#131722] border border-[#2a2e39] rounded-xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-[#2a2e39] flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-white">
              Start charting with TradingView
            </h2>
            <p className="text-xs text-[#787b86] mt-0.5">
              Choose a workspace tier or launch Supercharts immediately with a Basic account.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#787b86] hover:text-white rounded-md hover:bg-white/5 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Billing Switch */}
          <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
            <div className="inline-flex items-center p-1 bg-[#0e1118] border border-[#2a2e39] rounded-lg">
              <button
                type="button"
                onClick={() => setBilling('annual')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  billing === 'annual' ? 'bg-[#2962ff] text-white' : 'text-[#b2b5be]'
                }`}
              >
                Annual (Save 16%)
              </button>
              <button
                type="button"
                onClick={() => setBilling('monthly')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  billing === 'monthly' ? 'bg-[#2962ff] text-white' : 'text-[#b2b5be]'
                }`}
              >
                Monthly
              </button>
            </div>
            <span className="text-xs text-[#787b86]">
              30-day free trial available on all paid tiers
            </span>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {PLANS.map((plan) => {
              const active = selectedPlan === plan.name;
              const price = billing === 'annual' ? plan.annual : plan.monthly;
              return (
                <button
                  key={plan.name}
                  type="button"
                  onClick={() => setSelectedPlan(plan.name)}
                  className={`text-left p-4 rounded-xl border transition-colors cursor-pointer flex flex-col justify-between ${
                    active
                      ? 'bg-[#1e222d] border-[#2962ff]'
                      : 'bg-[#0e1118] border-[#2a2e39] hover:border-[#434651]'
                  }`}
                >
                  <div>
                    <div className="text-sm font-bold text-white">{plan.name}</div>
                    <div className="text-[11px] text-[#787b86] mt-0.5">{plan.audience}</div>
                    <div className="mt-3 font-mono tabular-nums">
                      <span className="text-2xl font-bold text-white">{price}</span>
                      <span className="text-xs text-[#787b86]">/mo</span>
                    </div>
                    <ul className="mt-3 space-y-1.5">
                      {plan.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-1.5 text-xs text-[#d1d4dc]">
                          <Check className="w-3.5 h-3.5 text-[#089981] shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Email Capture / Instant Workspace Launch */}
          {submitted ? (
            <div className="p-4 rounded-xl bg-[#089981]/15 border border-[#089981]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-white">
                  Workspace ready for {email} ({selectedPlan} tier)
                </div>
                <div className="text-xs text-[#b2b5be] mt-0.5">
                  Your interactive Supercharts terminal and watchlist preferences are active.
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLaunchSupercharts();
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#2962ff] hover:bg-[#1e53e5] rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
              >
                Open Supercharts
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email to save layouts and alerts"
                  className="w-full px-4 py-2.5 text-sm bg-[#0e1118] border border-[#2a2e39] focus:border-[#2962ff] rounded-lg text-white placeholder-[#787b86] focus:outline-none"
                />
                {error && <p className="text-xs text-[#f23645] mt-1">{error}</p>}
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 text-sm font-semibold text-white bg-[#2962ff] hover:bg-[#1e53e5] rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
              >
                Continue with {selectedPlan}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
