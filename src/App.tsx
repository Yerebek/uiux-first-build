import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Search } from 'lucide-react';
import {
  BROKER_PARTNERS,
  COMMUNITY_IDEAS,
  ECONOMIC_EVENTS,
  MARKET_SYMBOLS,
  TOP_STORIES,
  formatPrice,
} from './data/marketData';
import { MarketSymbol } from './types/market';
import { Navbar } from './components/Navbar';
import { MarketSummarySection } from './components/MarketSummarySection';
import { ScreenerSection } from './components/ScreenerSection';
import { CommunityIdeasSection } from './components/CommunityIdeasSection';
import { NewsAndCalendarSection } from './components/NewsAndCalendarSection';
import { SuperchartsTerminal } from './components/SuperchartsTerminal';
import { SymbolSearchModal } from './components/SymbolSearchModal';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';

const QUICK_TICKERS = ['SPX', 'BTCUSD', 'NVDA', 'EURUSD', 'GC1!'];

export default function App() {
  const [activeView, setActiveView] = useState<'portal' | 'supercharts'>('portal');
  const [selectedSymbol, setSelectedSymbol] = useState<MarketSymbol>(MARKET_SYMBOLS[0]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchOpensChart, setSearchOpensChart] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [heroImgFallback, setHeroImgFallback] = useState(false);

  // Global Cmd/Ctrl + K symbol search shortcut
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpensChart(true);
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleNavigateView = (view: 'portal' | 'supercharts', sectionId?: string) => {
    setActiveView(view);
    if (view === 'portal') {
      if (sectionId) {
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 40);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0 });
    }
  };

  const handleOpenSupercharts = (sym?: MarketSymbol) => {
    if (sym) setSelectedSymbol(sym);
    setActiveView('supercharts');
    window.scrollTo({ top: 0 });
  };

  const handleOpenTickerByCode = (ticker: string) => {
    const found = MARKET_SYMBOLS.find((s) => s.ticker === ticker);
    if (found) {
      handleOpenSupercharts(found);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#f0f3fa] flex flex-col">
      <Navbar
        activeView={activeView}
        onNavigateView={handleNavigateView}
        onOpenGetStarted={() => setAuthModalOpen(true)}
      />

      {activeView === 'supercharts' ? (
        <SuperchartsTerminal
          activeSymbol={selectedSymbol}
          allSymbols={MARKET_SYMBOLS}
          onSelectSymbol={(sym) => setSelectedSymbol(sym)}
          onOpenSearch={() => {
            setSearchOpensChart(true);
            setSearchOpen(true);
          }}
          onBackToPortal={() => handleNavigateView('portal')}
        />
      ) : (
        <main className="flex-1">
          {/* Iconic TradingView Dark Cosmic Horizon Hero */}
          <section className="relative overflow-hidden border-b border-white/10">
            {!heroImgFallback ? (
              <img
                src="/src/assets/images/hero_cosmos_horizon_1795659004168.jpg"
                alt="Deep space horizon glow backdrop"
                referrerPolicy="no-referrer"
                onError={() => setHeroImgFallback(true)}
                className="absolute inset-0 w-full h-full object-cover object-bottom opacity-90"
              />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(41,98,255,0.28)_0%,_#000000_70%)]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-[#000000]" />

            <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32 text-center">
              <h1
                className="font-display font-bold text-white tracking-tight mx-auto max-w-4xl leading-[1.06]"
                style={{ fontSize: 'clamp(2.6rem, 5.4vw, 4.75rem)', textWrap: 'balance' }}
              >
                Look first / Then leap.
              </h1>

              <p className="text-base sm:text-xl text-[#d1d4dc] mt-5 max-w-2xl mx-auto">
                The best trades require research, then commitment.
              </p>

              {/* Signature TradingView Hero Search Bar */}
              <div className="mt-9 max-w-xl mx-auto">
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpensChart(true);
                    setSearchOpen(true);
                  }}
                  className="w-full flex items-center justify-between gap-3 px-5 py-3.5 bg-[#131722]/90 hover:bg-[#1e222d] border border-[#2a2e39] hover:border-[#434651] rounded-full text-left transition-colors shadow-xl backdrop-blur-md cursor-pointer"
                >
                  <span className="flex items-center gap-3 text-sm sm:text-base text-[#787b86]">
                    <Search className="w-5 h-5 text-[#d1d4dc] shrink-0" />
                    <span>Search markets here</span>
                  </span>
                  <span className="font-mono text-xs text-[#787b86] border border-[#2a2e39] px-2 py-0.5 rounded hidden sm:inline">
                    Ctrl K
                  </span>
                </button>

                {/* Quick Ticker Access Strip */}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  {QUICK_TICKERS.map((ticker) => {
                    const sym = MARKET_SYMBOLS.find((s) => s.ticker === ticker);
                    if (!sym) return null;
                    const isUp = sym.change >= 0;
                    return (
                      <button
                        key={sym.ticker}
                        type="button"
                        onClick={() => handleOpenSupercharts(sym)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#131722]/80 hover:bg-[#1e222d] border border-white/10 text-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <span className="font-mono font-semibold text-white">{sym.ticker}</span>
                        <span className="font-mono tabular-nums text-[#b2b5be]">
                          {formatPrice(sym.price, sym.decimals)}
                        </span>
                        <span
                          className={`font-mono tabular-nums font-semibold ${
                            isUp ? 'text-[#089981]' : 'text-[#f23645]'
                          }`}
                        >
                          {isUp ? '+' : ''}
                          {sym.changePct.toFixed(2)}%
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Hero Primary CTA */}
              <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => handleOpenSupercharts(selectedSymbol)}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#2962ff] hover:bg-[#1e53e5] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Launch Supercharts
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigateView('portal', 'markets-section')}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-[#d1d4dc] hover:text-white bg-[#131722]/80 hover:bg-[#1e222d] border border-[#2a2e39] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Explore market summary
                </button>
              </div>
            </div>
          </section>

          <MarketSummarySection
            symbols={MARKET_SYMBOLS}
            selectedSymbol={selectedSymbol}
            onSelectSymbol={(sym) => setSelectedSymbol(sym)}
            onOpenSupercharts={(sym) => handleOpenSupercharts(sym)}
          />

          <ScreenerSection
            symbols={MARKET_SYMBOLS}
            onOpenSupercharts={(sym) => handleOpenSupercharts(sym)}
          />

          <CommunityIdeasSection
            ideas={COMMUNITY_IDEAS}
            onOpenIdeaSymbol={handleOpenTickerByCode}
          />

          <NewsAndCalendarSection
            stories={TOP_STORIES}
            events={ECONOMIC_EVENTS}
            brokers={BROKER_PARTNERS}
            onOpenTicker={handleOpenTickerByCode}
            onLaunchSupercharts={() => handleOpenSupercharts(selectedSymbol)}
          />
        </main>
      )}

      {activeView === 'portal' && (
        <Footer
          onNavigateView={handleNavigateView}
          onOpenGetStarted={() => setAuthModalOpen(true)}
        />
      )}

      <SymbolSearchModal
        isOpen={searchOpen}
        symbols={MARKET_SYMBOLS}
        onClose={() => setSearchOpen(false)}
        defaultOpenInChart={searchOpensChart}
        onSelectSymbol={(sym, openInChart) => {
          setSelectedSymbol(sym);
          if (openInChart) {
            setActiveView('supercharts');
            window.scrollTo({ top: 0 });
          }
        }}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLaunchSupercharts={() => handleOpenSupercharts(selectedSymbol)}
      />
    </div>
  );
}
