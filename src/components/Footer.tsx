import React from 'react';

interface FooterProps {
  onNavigateView: (view: 'portal' | 'supercharts', sectionId?: string) => void;
  onOpenGetStarted: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateView, onOpenGetStarted }) => {
  return (
    <footer className="bg-[#000000] border-t border-white/10 pt-14 pb-10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-white/10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 text-white">
              <svg
                width="26"
                height="16"
                viewBox="0 0 36 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M0 0H14V6H8V22H0V0Z" fill="currentColor" />
                <circle cx="20" cy="4" r="4" fill="currentColor" />
                <path d="M16 22L23 8H31L24 22H16Z" fill="currentColor" />
                <path d="M26 22L33 8H36L29 22H26Z" fill="#2962FF" />
              </svg>
              <span className="font-display text-lg font-bold tracking-tight">TradingView</span>
            </div>
            <p className="text-xs text-[#787b86] mt-3 leading-relaxed">
              Look first / Then leap. Built for active traders, quantitative researchers, and global investors.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-white mb-3">Products</h3>
            <ul className="space-y-2 text-xs text-[#787b86]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateView('supercharts')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Supercharts
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateView('portal', 'markets-section')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Stock Screener
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateView('portal', 'markets-section')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Economic Calendar
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenGetStarted}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Pricing & Plans
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-white mb-3">Markets</h3>
            <ul className="space-y-2 text-xs text-[#787b86]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateView('portal', 'markets-section')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Global Indices
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateView('portal', 'markets-section')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  US Equities
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateView('portal', 'markets-section')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Cryptocurrencies
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateView('portal', 'markets-section')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Forex & Futures
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-white mb-3">Community</h3>
            <ul className="space-y-2 text-xs text-[#787b86]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateView('portal', 'community-section')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Trade Ideas
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateView('portal', 'community-section')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Pine Script Library
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateView('portal', 'brokers-section')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Broker Reviews
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-white mb-3">Workspace</h3>
            <ul className="space-y-2 text-xs text-[#787b86]">
              <li>
                <button
                  type="button"
                  onClick={onOpenGetStarted}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Create Free Account
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateView('supercharts')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Paper Trading Desk
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateView('portal', 'products-section')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Platform Overview
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#787b86]">
          <p>© 2026 TradingView Interface Replication. Market quotes simulated for interactive charting.</p>
          <div className="flex items-center gap-6">
            <span>Terms of Use</span>
            <span>Privacy Policy</span>
            <span>Risk Disclosure</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
