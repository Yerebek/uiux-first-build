import React, { useMemo, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Search } from 'lucide-react';
import { MarketSymbol } from '../types/market';
import { formatPrice } from '../data/marketData';

interface ScreenerSectionProps {
  symbols: MarketSymbol[];
  onOpenSupercharts: (symbol: MarketSymbol) => void;
}

type ScreenerFilter = 'Most Active' | 'Top Gainers' | 'Top Losers' | 'Tech Leaders';

const Sparkline: React.FC<{ data: number[]; isUp: boolean }> = ({ data, isUp }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const w = 96;
  const h = 28;
  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * w;
      const y = h - 3 - ((val - min) / span) * (h - 6);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible" aria-hidden="true">
      <polyline
        fill="none"
        stroke={isUp ? '#089981' : '#f23645'}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

export const ScreenerSection: React.FC<ScreenerSectionProps> = ({
  symbols,
  onOpenSupercharts,
}) => {
  const [filter, setFilter] = useState<ScreenerFilter>('Most Active');
  const [search, setSearch] = useState('');

  const stockRows = useMemo(() => {
    const stocks = symbols.filter((s) => s.category === 'Stocks');
    let list = [...stocks];

    if (filter === 'Top Gainers') {
      list.sort((a, b) => b.changePct - a.changePct);
    } else if (filter === 'Top Losers') {
      list.sort((a, b) => a.changePct - b.changePct);
    } else if (filter === 'Tech Leaders') {
      list = list.filter((s) =>
        ['Semiconductors', 'Software', 'Consumer Tech', 'Enterprise AI', 'Interactive Media'].includes(
          s.sector || ''
        )
      );
    }

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (s) =>
          s.ticker.toLowerCase().includes(q) ||
          s.name.toLowerCase().includes(q) ||
          (s.sector || '').toLowerCase().includes(q)
      );
    }

    return list;
  }, [symbols, filter, search]);

  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-white/10">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            US stocks screener
          </h2>
          <p className="text-sm text-[#787b86] mt-1">
            Real-time price action, valuation multiples, 52-week positioning, and algorithmic technical ratings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#787b86] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter ticker or sector..."
              className="pl-9 pr-3 py-1.5 text-sm bg-[#131722] border border-[#2a2e39] focus:border-[#2962ff] rounded-lg text-white placeholder-[#787b86] focus:outline-none w-52"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-[#131722] border border-[#2a2e39] rounded-lg overflow-x-auto">
            {(['Most Active', 'Top Gainers', 'Top Losers', 'Tech Leaders'] as ScreenerFilter[]).map(
              (tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFilter(tab)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    filter === tab
                      ? 'bg-[#2962ff] text-white'
                      : 'text-[#b2b5be] hover:text-white hover:bg-[#1e222d]'
                  }`}
                >
                  {tab}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* High-density Screener Table */}
      <div className="bg-[#131722] border border-[#2a2e39] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#2a2e39] text-xs font-medium text-[#787b86] bg-[#0e1118]">
                <th className="py-3 px-4 whitespace-nowrap">Symbol</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Last</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Chg %</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Volume</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Market cap</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">P/E</th>
                <th className="py-3 px-4 whitespace-nowrap">52W range</th>
                <th className="py-3 px-4 whitespace-nowrap">7D trend</th>
                <th className="py-3 px-4 whitespace-nowrap">Tech rating</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e222d] text-sm">
              {stockRows.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-10 px-4 text-center text-[#787b86]">
                    No stocks match "{search}". Clear the filter to view all equities.
                  </td>
                </tr>
              ) : (
                stockRows.map((sym) => {
                  const isUp = sym.change >= 0;
                  const low52 = sym.low52w ?? sym.price * 0.7;
                  const high52 = sym.high52w ?? sym.price * 1.1;
                  const pos52 = Math.max(
                    4,
                    Math.min(96, ((sym.price - low52) / (high52 - low52 || 1)) * 100)
                  );
                  const ratingColor =
                    sym.rating === 'Strong Buy' || sym.rating === 'Buy'
                      ? 'text-[#089981]'
                      : sym.rating === 'Sell' || sym.rating === 'Strong Sell'
                      ? 'text-[#f23645]'
                      : 'text-[#b2b5be]';

                  return (
                    <tr
                      key={sym.ticker}
                      onClick={() => onOpenSupercharts(sym)}
                      className="hover:bg-[#1e222d]/80 transition-colors cursor-pointer"
                    >
                      <td className="py-2.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                            style={{ backgroundColor: sym.monogramBg }}
                          >
                            {sym.monogramText}
                          </div>
                          <div>
                            <div className="font-mono text-sm font-semibold text-white">
                              {sym.ticker}
                            </div>
                            <div className="text-xs text-[#787b86]">
                              {sym.name} · {sym.sector}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-2.5 px-4 text-right font-mono tabular-nums font-semibold text-[#f0f3fa] whitespace-nowrap">
                        ${formatPrice(sym.price, sym.decimals)}
                      </td>

                      <td className="py-2.5 px-4 text-right font-mono tabular-nums whitespace-nowrap">
                        <span
                          className={`inline-flex items-center justify-end gap-0.5 font-semibold ${
                            isUp ? 'text-[#089981]' : 'text-[#f23645]'
                          }`}
                        >
                          {isUp ? (
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          ) : (
                            <ArrowDownRight className="w-3.5 h-3.5" />
                          )}
                          {isUp ? '+' : ''}
                          {sym.changePct.toFixed(2)}%
                        </span>
                      </td>

                      <td className="py-2.5 px-4 text-right font-mono tabular-nums text-[#d1d4dc] whitespace-nowrap">
                        {sym.volumeLabel}
                      </td>

                      <td className="py-2.5 px-4 text-right font-mono tabular-nums text-[#d1d4dc] whitespace-nowrap">
                        {sym.marketCap}
                      </td>

                      <td className="py-2.5 px-4 text-right font-mono tabular-nums text-[#b2b5be] whitespace-nowrap">
                        {sym.peRatio}
                      </td>

                      <td className="py-2.5 px-4 whitespace-nowrap">
                        <div className="w-24">
                          <div className="h-1.5 w-full bg-[#2a2e39] rounded-full relative overflow-hidden">
                            <div
                              className="h-full bg-[#2962ff] rounded-full"
                              style={{ width: `${pos52}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] font-mono tabular-nums text-[#787b86] mt-1">
                            <span>{low52.toFixed(0)}</span>
                            <span>{high52.toFixed(0)}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-2.5 px-4 whitespace-nowrap">
                        <Sparkline data={sym.sparkline} isUp={isUp} />
                      </td>

                      <td className={`py-2.5 px-4 font-medium text-xs whitespace-nowrap ${ratingColor}`}>
                        {sym.rating}
                      </td>

                      <td className="py-2.5 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenSupercharts(sym);
                          }}
                          className="px-3 py-1 text-xs font-semibold text-[#d1d4dc] hover:text-white bg-[#2a2e39]/60 hover:bg-[#2962ff] rounded-md transition-colors cursor-pointer"
                        >
                          Chart
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
