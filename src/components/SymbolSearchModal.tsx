import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { AssetCategory, MarketSymbol } from '../types/market';
import { formatPrice } from '../data/marketData';

interface SymbolSearchModalProps {
  isOpen: boolean;
  symbols: MarketSymbol[];
  onClose: () => void;
  onSelectSymbol: (symbol: MarketSymbol, openInChart: boolean) => void;
  defaultOpenInChart?: boolean;
}

const CATEGORIES: ('All' | AssetCategory)[] = [
  'All',
  'Stocks',
  'Crypto',
  'Indices',
  'Futures',
  'Forex',
  'Bonds',
];

export const SymbolSearchModal: React.FC<SymbolSearchModalProps> = ({
  isOpen,
  symbols,
  onClose,
  onSelectSymbol,
  defaultOpenInChart = true,
}) => {
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState<'All' | AssetCategory>('All');
  const [highlightedIdx, setHighlightedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setHighlightedIdx(0);
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [isOpen]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return symbols.filter((sym) => {
      const catMatch = activeCat === 'All' || sym.category === activeCat;
      if (!catMatch) return false;
      if (!q) return true;
      return (
        sym.ticker.toLowerCase().includes(q) ||
        sym.name.toLowerCase().includes(q) ||
        sym.exchange.toLowerCase().includes(q)
      );
    });
  }, [symbols, query, activeCat]);

  useEffect(() => {
    setHighlightedIdx(0);
  }, [query, activeCat]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIdx((prev) => Math.min(filtered.length - 1, prev + 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIdx((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'Enter' && filtered[highlightedIdx]) {
        e.preventDefault();
        onSelectSymbol(filtered[highlightedIdx], defaultOpenInChart);
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, filtered, highlightedIdx, onClose, onSelectSymbol, defaultOpenInChart]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Symbol Search"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#131722] border border-[#2a2e39] rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Row */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#2a2e39]">
          <Search className="w-5 h-5 text-[#787b86] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ticker, company, crypto pair, or index (e.g. NVDA, BTCUSD, SPX)"
            className="w-full bg-transparent text-[#f0f3fa] placeholder-[#787b86] text-base focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-xs text-[#787b86] hover:text-white px-2 py-1 rounded cursor-pointer"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#787b86] hover:text-white rounded-md hover:bg-white/5 cursor-pointer"
            aria-label="Close symbol search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filter Bar */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-[#2a2e39] overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCat(cat)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeCat === cat
                  ? 'bg-[#2962ff] text-white'
                  : 'text-[#b2b5be] hover:text-white hover:bg-[#1e222d]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[420px] overflow-y-auto divide-y divide-[#1e222d]">
          {filtered.length === 0 ? (
            <div className="py-12 px-6 text-center">
              <p className="text-sm text-[#d1d4dc] font-medium">No matching symbols found</p>
              <p className="text-xs text-[#787b86] mt-1">
                Try searching for SPX, NVDA, BTCUSD, EURUSD, or switch asset category.
              </p>
            </div>
          ) : (
            filtered.map((sym, idx) => {
              const isUp = sym.change >= 0;
              const isHighlighted = idx === highlightedIdx;
              return (
                <div
                  key={`${sym.exchange}:${sym.ticker}`}
                  onMouseEnter={() => setHighlightedIdx(idx)}
                  onClick={() => {
                    onSelectSymbol(sym, defaultOpenInChart);
                    onClose();
                  }}
                  className={`flex items-center justify-between gap-4 px-4 py-3 cursor-pointer transition-colors ${
                    isHighlighted ? 'bg-[#1e222d]' : 'hover:bg-[#1e222d]/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                      style={{ backgroundColor: sym.monogramBg }}
                    >
                      {sym.monogramText}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-semibold text-white">
                          {sym.ticker}
                        </span>
                        <span className="text-xs text-[#787b86] truncate">{sym.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#787b86]">
                        <span>{sym.exchange}</span>
                        <span aria-hidden="true">·</span>
                        <span>{sym.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right font-mono tabular-nums">
                      <div className="text-sm font-medium text-[#f0f3fa]">
                        {formatPrice(sym.price, sym.decimals)}
                      </div>
                      <div
                        className={`text-xs font-medium ${
                          isUp ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {isUp ? '+' : ''}
                        {sym.changePct.toFixed(2)}%
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectSymbol(sym, true);
                        onClose();
                      }}
                      className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#d1d4dc] hover:text-white bg-[#2a2e39]/60 hover:bg-[#2962ff] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Chart
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="px-4 py-2.5 bg-[#0e1118] border-t border-[#2a2e39] flex items-center justify-between text-[11px] text-[#787b86]">
          <span>Use ↑ ↓ to navigate, Enter to launch chart</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
};
