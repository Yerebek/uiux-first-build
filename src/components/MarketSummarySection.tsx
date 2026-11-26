import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, CandlestickChart, LineChart, Maximize2 } from 'lucide-react';
import { AssetCategory, MarketSymbol, SummaryRange } from '../types/market';
import { formatPrice, generateSummarySeries } from '../data/marketData';

interface MarketSummarySectionProps {
  symbols: MarketSymbol[];
  selectedSymbol: MarketSymbol;
  onSelectSymbol: (symbol: MarketSymbol) => void;
  onOpenSupercharts: (symbol: MarketSymbol) => void;
}

const ASSET_TABS: AssetCategory[] = [
  'Indices',
  'Stocks',
  'Crypto',
  'Futures',
  'Forex',
  'Bonds',
];

const RANGES: SummaryRange[] = ['1D', '1M', '3M', '1Y', '5Y', 'All'];

export const MarketSummarySection: React.FC<MarketSummarySectionProps> = ({
  symbols,
  selectedSymbol,
  onSelectSymbol,
  onOpenSupercharts,
}) => {
  const [activeCategory, setActiveCategory] = useState<AssetCategory>(selectedSymbol.category);
  const [range, setRange] = useState<SummaryRange>('3M');
  const [chartMode, setChartMode] = useState<'area' | 'candles'>('area');
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveCategory(selectedSymbol.category);
  }, [selectedSymbol.category]);

  const categorySymbols = useMemo(
    () => symbols.filter((s) => s.category === activeCategory).slice(0, 6),
    [symbols, activeCategory]
  );

  const handleCategoryChange = (cat: AssetCategory) => {
    setActiveCategory(cat);
    const first = symbols.find((s) => s.category === cat);
    if (first) onSelectSymbol(first);
  };

  const bars = useMemo(
    () => generateSummarySeries(selectedSymbol, range),
    [selectedSymbol, range]
  );

  const firstBar = bars[0];
  const lastBar = bars[bars.length - 1];
  const rangeDelta = lastBar.close - firstBar.open;
  const rangeDeltaPct = (rangeDelta / firstBar.open) * 100;
  const isRangeUp = rangeDelta >= 0;

  const activeBar = hoverIdx !== null && bars[hoverIdx] ? bars[hoverIdx] : lastBar;

  // Draw HiDPI interactive summary canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || bars.length === 0) return;

    const draw = () => {
      const rect = container.getBoundingClientRect();
      const width = Math.max(320, Math.floor(rect.width));
      const height = 340;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.scale(dpr, dpr);

      const padLeft = 16;
      const padRight = 76;
      const padTop = 20;
      const padBottom = 34;
      const plotW = width - padLeft - padRight;
      const plotH = height - padTop - padBottom;

      ctx.clearRect(0, 0, width, height);

      let minP = Infinity;
      let maxP = -Infinity;
      for (const b of bars) {
        if (b.low < minP) minP = b.low;
        if (b.high > maxP) maxP = b.high;
      }
      const span = maxP - minP || 1;
      minP -= span * 0.08;
      maxP += span * 0.08;

      const xFor = (i: number) => padLeft + (i / (bars.length - 1)) * plotW;
      const yFor = (p: number) => padTop + (1 - (p - minP) / (maxP - minP)) * plotH;

      // Subtle horizontal gridlines + price axis
      const gridRows = 5;
      ctx.font = '500 11px "JetBrains Mono", monospace';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';

      for (let r = 0; r <= gridRows; r++) {
        const val = maxP - (r / gridRows) * (maxP - minP);
        const y = padTop + (r / gridRows) * plotH;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padLeft, y);
        ctx.lineTo(width - padRight, y);
        ctx.stroke();

        ctx.fillStyle = '#787b86';
        ctx.fillText(formatPrice(val, selectedSymbol.decimals), width - padRight + 8, y);
      }

      // X-axis date labels
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      const labelStep = Math.max(1, Math.floor(bars.length / 6));
      for (let i = 0; i < bars.length; i += labelStep) {
        const x = xFor(i);
        ctx.fillStyle = '#787b86';
        ctx.fillText(bars[i].label, x, height - padBottom + 10);
      }

      const accent = isRangeUp ? '#089981' : '#f23645';

      if (chartMode === 'area') {
        // Gradient fill
        const grad = ctx.createLinearGradient(0, padTop, 0, padTop + plotH);
        grad.addColorStop(0, isRangeUp ? 'rgba(8, 153, 129, 0.34)' : 'rgba(242, 54, 69, 0.34)');
        grad.addColorStop(1, 'rgba(19, 23, 34, 0.0)');

        ctx.beginPath();
        ctx.moveTo(xFor(0), yFor(bars[0].close));
        for (let i = 1; i < bars.length; i++) {
          ctx.lineTo(xFor(i), yFor(bars[i].close));
        }
        ctx.lineTo(xFor(bars.length - 1), padTop + plotH);
        ctx.lineTo(xFor(0), padTop + plotH);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();

        // Stroke line
        ctx.beginPath();
        ctx.moveTo(xFor(0), yFor(bars[0].close));
        for (let i = 1; i < bars.length; i++) {
          ctx.lineTo(xFor(i), yFor(bars[i].close));
        }
        ctx.strokeStyle = accent;
        ctx.lineWidth = 2;
        ctx.stroke();
      } else {
        // Candlesticks
        const barW = Math.max(2, (plotW / bars.length) * 0.64);
        bars.forEach((b, i) => {
          const x = xFor(i);
          const up = b.close >= b.open;
          const color = up ? '#089981' : '#f23645';
          ctx.strokeStyle = color;
          ctx.fillStyle = color;
          ctx.lineWidth = 1.2;

          ctx.beginPath();
          ctx.moveTo(x, yFor(b.high));
          ctx.lineTo(x, yFor(b.low));
          ctx.stroke();

          const topY = yFor(Math.max(b.open, b.close));
          const botY = yFor(Math.min(b.open, b.close));
          const bodyH = Math.max(1.5, botY - topY);
          ctx.fillRect(x - barW / 2, topY, barW, bodyH);
        });
      }

      // Current price dashed horizontal line + right pill tag
      const lastY = yFor(lastBar.close);
      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padLeft, lastY);
      ctx.lineTo(width - padRight, lastY);
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = accent;
      ctx.fillRect(width - padRight + 2, lastY - 10, padRight - 6, 20);
      ctx.fillStyle = '#ffffff';
      ctx.font = '600 11px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(formatPrice(lastBar.close, selectedSymbol.decimals), width - padRight + 7, lastY);

      // Hover Crosshair
      if (hoverIdx !== null && bars[hoverIdx]) {
        const hx = xFor(hoverIdx);
        const hy = yFor(bars[hoverIdx].close);
        ctx.save();
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = 'rgba(209, 212, 220, 0.45)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(hx, padTop);
        ctx.lineTo(hx, padTop + plotH);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(padLeft, hy);
        ctx.lineTo(width - padRight, hy);
        ctx.stroke();
        ctx.restore();

        // Focus dot
        ctx.beginPath();
        ctx.arc(hx, hy, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = accent;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#131722';
        ctx.stroke();
      }
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(container);
    return () => ro.disconnect();
  }, [bars, chartMode, hoverIdx, isRangeUp, lastBar.close, selectedSymbol.decimals]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const padLeft = 16;
    const padRight = 76;
    const plotW = rect.width - padLeft - padRight;
    if (x < padLeft || x > rect.width - padRight) {
      setHoverIdx(null);
      return;
    }
    const ratio = (x - padLeft) / plotW;
    const idx = Math.max(0, Math.min(bars.length - 1, Math.round(ratio * (bars.length - 1))));
    setHoverIdx(idx);
  };

  return (
    <section id="markets-section" className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
      {/* Section Header + Category Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Market summary
          </h2>
          <p className="text-sm text-[#787b86] mt-1">
            Interactive multi-asset quotes across global indices, equities, crypto, futures, forex, and sovereign yields.
          </p>
        </div>

        {/* Asset Class Tabs */}
        <div
          className="flex items-center gap-1 p-1 bg-[#131722] border border-[#2a2e39] rounded-lg overflow-x-auto"
          role="tablist"
          aria-label="Market asset categories"
        >
          {ASSET_TABS.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={activeCategory === cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#2962ff] text-white'
                  : 'text-[#b2b5be] hover:text-white hover:bg-[#1e222d]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chart Card */}
      <div className="bg-[#131722] border border-[#2a2e39] rounded-xl overflow-hidden">
        {/* Selected Symbol Header Bar */}
        <div className="px-5 py-4 border-b border-[#2a2e39] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{ backgroundColor: selectedSymbol.monogramBg }}
            >
              {selectedSymbol.monogramText}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="font-display text-lg font-bold text-white">
                  {selectedSymbol.name}
                </h3>
                <span className="font-mono text-xs text-[#787b86]">
                  {selectedSymbol.exchange}:{selectedSymbol.ticker}
                </span>
              </div>
              <div className="flex flex-wrap items-baseline gap-3 mt-0.5 font-mono tabular-nums">
                <span className="text-xl font-bold text-white">
                  {formatPrice(activeBar.close, selectedSymbol.decimals)}
                </span>
                <span className="text-xs text-[#787b86]">{selectedSymbol.currency}</span>
                <span
                  className={`inline-flex items-center gap-0.5 text-sm font-semibold ${
                    isRangeUp ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  {isRangeUp ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {isRangeUp ? '+' : ''}
                  {formatPrice(rangeDelta, selectedSymbol.decimals)} ({isRangeUp ? '+' : ''}
                  {rangeDeltaPct.toFixed(2)}%)
                </span>
                <span className="text-xs text-[#787b86]">{activeBar.label}</span>
              </div>
            </div>
          </div>

          {/* Chart Mode & Supercharts Launch */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center p-0.5 bg-[#0e1118] border border-[#2a2e39] rounded-lg">
              <button
                type="button"
                onClick={() => setChartMode('area')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  chartMode === 'area'
                    ? 'bg-[#2a2e39] text-white'
                    : 'text-[#787b86] hover:text-white'
                }`}
              >
                <LineChart className="w-3.5 h-3.5" />
                Area
              </button>
              <button
                type="button"
                onClick={() => setChartMode('candles')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  chartMode === 'candles'
                    ? 'bg-[#2a2e39] text-white'
                    : 'text-[#787b86] hover:text-white'
                }`}
              >
                <CandlestickChart className="w-3.5 h-3.5" />
                Candles
              </button>
            </div>

            <button
              type="button"
              onClick={() => onOpenSupercharts(selectedSymbol)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#2962ff] hover:bg-[#1e53e5] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              Open in Supercharts
            </button>
          </div>
        </div>

        {/* Interactive Canvas Viewport */}
        <div ref={containerRef} className="relative w-full h-[340px] bg-[#131722]">
          <canvas
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoverIdx(null)}
            className="block w-full h-full cursor-crosshair"
          />
        </div>

        {/* Timeframe Bar */}
        <div className="px-5 py-2.5 border-t border-[#2a2e39] bg-[#0e1118] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            {RANGES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  range === r
                    ? 'bg-[#2962ff]/20 text-[#2962ff]'
                    : 'text-[#787b86] hover:text-white hover:bg-white/5'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="text-xs font-mono tabular-nums text-[#787b86] flex items-center gap-4">
            <span>O {formatPrice(activeBar.open, selectedSymbol.decimals)}</span>
            <span>H {formatPrice(activeBar.high, selectedSymbol.decimals)}</span>
            <span>L {formatPrice(activeBar.low, selectedSymbol.decimals)}</span>
            <span>C {formatPrice(activeBar.close, selectedSymbol.decimals)}</span>
          </div>
        </div>
      </div>

      {/* 6 Selectable Ticker Cards Below */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mt-4">
        {categorySymbols.map((sym) => {
          const isSelected = sym.ticker === selectedSymbol.ticker;
          const isUp = sym.change >= 0;
          return (
            <button
              key={sym.ticker}
              type="button"
              onClick={() => onSelectSymbol(sym)}
              className={`text-left p-4 rounded-xl border transition-colors duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-[#1e222d] border-[#2962ff]'
                  : 'bg-[#131722] border-[#2a2e39] hover:border-[#434651]'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                    style={{ backgroundColor: sym.monogramBg }}
                  >
                    {sym.monogramText}
                  </div>
                  <div className="min-w-0">
                    <div className="font-mono text-xs font-bold text-white truncate">
                      {sym.ticker}
                    </div>
                    <div className="text-[11px] text-[#787b86] truncate">{sym.name}</div>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-baseline justify-between gap-2 font-mono tabular-nums">
                <span className="text-sm font-semibold text-[#f0f3fa]">
                  {formatPrice(sym.price, sym.decimals)}
                </span>
                <span
                  className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
                    isUp ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  {isUp ? '+' : ''}
                  {sym.changePct.toFixed(2)}%
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
