import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  activeView: 'portal' | 'supercharts';
  onNavigateView: (view: 'portal' | 'supercharts', sectionId?: string) => void;
  onOpenGetStarted: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onNavigateView,
  onOpenGetStarted,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: { label: string; view: 'portal' | 'supercharts'; sectionId?: string }[] = [
    { label: 'Products', view: 'portal', sectionId: 'products-section' },
    { label: 'Community', view: 'portal', sectionId: 'community-section' },
    { label: 'Markets', view: 'portal', sectionId: 'markets-section' },
    { label: 'Brokers', view: 'portal', sectionId: 'brokers-section' },
    { label: 'Supercharts', view: 'supercharts' },
  ];

  const handleLinkClick = (item: (typeof navItems)[number]) => {
    setMobileOpen(false);
    onNavigateView(item.view, item.sectionId);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#000000]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single line, no subtext or badges) */}
        <button
          type="button"
          onClick={() => onNavigateView('portal')}
          className="flex items-center gap-2.5 text-white whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#2962ff] rounded-md cursor-pointer"
          aria-label="TradingView Home"
        >
          <svg
            width="28"
            height="18"
            viewBox="0 0 36 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="shrink-0"
          >
            <path d="M0 0H14V6H8V22H0V0Z" fill="currentColor" />
            <circle cx="20" cy="4" r="4" fill="currentColor" />
            <path d="M16 22L23 8H31L24 22H16Z" fill="currentColor" />
            <path d="M26 22L33 8H36L29 22H26Z" fill="#2962FF" />
          </svg>
          <span className="font-display text-lg font-bold tracking-tight">TradingView</span>
        </button>

        {/* Zone 2: 5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#b2b5be]">
          {navItems.map((item) => {
            const isActive = item.view === 'supercharts' && activeView === 'supercharts';
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => handleLinkClick(item)}
                className={`whitespace-nowrap shrink-0 py-1 transition-colors duration-150 cursor-pointer border-b-2 ${
                  isActive
                    ? 'text-white border-[#2962ff]'
                    : 'border-transparent hover:text-white hover:border-white/30'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action + mobile menu button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenGetStarted}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-[#2962ff] hover:bg-[#1e53e5] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
          >
            Get started
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-[#d1d4dc] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0b0e14] px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleLinkClick(item)}
              className="block w-full text-left px-3 py-2.5 text-sm font-medium text-[#d1d4dc] hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap"
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              onOpenGetStarted();
            }}
            className="w-full mt-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#2962ff] hover:bg-[#1e53e5] rounded-lg whitespace-nowrap"
          >
            Get started
          </button>
        </div>
      )}
    </header>
  );
};
