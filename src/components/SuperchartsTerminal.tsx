import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  BarChart2,
  CandlestickChart,
  ChevronDown,
  Crosshair,
  LineChart,
  Minus,
  Moon,
  PanelRightClose,
  PanelRightOpen,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Ruler,
  Search,
  SlidersHorizontal,
  Sun,
  Trash2,
  TrendingUp,
} from 'lucide-react';
import {
  ChartDrawing,
  ChartStyle,
  ChartTimeframe,
  DrawingTool,
  MarketSymbol,
  OHLCBar,
} from '../types/market';
import {
  calculateBollinger,
  calculateEMA,
  calculateRSI,
  calculateSMA,
  computeTechnicalGauge,
  formatPrice,
  generateChartBars,
} from '../data/marketData';

interface SuperchartsTerminalProps {
  activeSymbol: MarketSymbol;
  allSymbols: MarketSymbol[];
  onSelectSymbol: (symbol: MarketSymbol) => void;
  onOpenSearch: () => void;
  onBackToPortal: () => void;
}

const TIMEFRAMES: ChartTimeframe[] = ['1m', '5m', '15m', '1H', '4H', '1D', '1W'];

export const SuperchartsTerminal: React.FC<SuperchartsTerminalProps> = ({
  activeSymbol,
  allSymbols,
  onSelectSymbol,
  onOpenSearch,
  onBackToPortal,
}) => {
  const [timeframe, setTimeframe] = useState<ChartTimeframe>('1H');
  const [chartStyle, setChartStyle] = useState<ChartStyle>('candles');
  const [tool, setTool] = useState<DrawingTool>('crosshair');
  const [chartTheme, setChartTheme] = useState<'dark' | 'light'>('dark');
  const [isLive, setIsLive] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showIndicatorsMenu, setShowIndicatorsMenu] = useState(false);

  // Indicators state
  const [showSMA20, setShowSMA20] = useState(true);
  const [showEMA50, setShowEMA50] = useState(true);
  const [showBollinger, setShowBollinger] = useState(false);
  const [showRSI, setShowRSI] = useState(true);
  const [showVolume, setShowVolume] = useState(true);

  // Chart bars + live ticks
  const [bars, setBars] = useState<OHLCBar[]>(() =>
    generateChartBars(activeSymbol, timeframe, 150)
  );
  const [visibleCount, setVisibleCount] = useState(90);
  const [rightOffset, setRightOffset] = useState(0); // bars hidden from right

  // Drawings
  const [drawings, setDrawings] = useState<ChartDrawing[]>([]);
  const [pendingPoint, setPendingPoint] = useState<{ index: number; price: number } | null>(
    null
  );
  const [hoverPoint, setHoverPoint] = useState<{
    index: number;
    price: number;
    x: number;
    y: number;
  } | null>(null);

  // Panning
  const dragRef = useRef<{ startX: number; startOffset: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  // Watchlist & Paper Position state
  const [watchlistTickers, setWatchlistTickers] = useState<string[]>([
    'SPX',
    'NDX',
    'NVDA',
    'AAPL',
    'TSLA',
    'BTCUSD',
    'ETHUSD',
    'EURUSD',
    'GC1!',
  ]);
  const [paperPosition, setPaperPosition] = useState<{
    ticker: string;
    side: 'Long' | 'Short';
    entry: number;
    qty: number;
  } | null>(null);

  // Regenerate bars when symbol or timeframe changes
  useEffect(() => {
    setBars(generateChartBars(activeSymbol, timeframe, 150));
    setRightOffset(0);
    setVisibleCount(90);
    setDrawings([]);
    setPendingPoint(null);
  }, [activeSymbol, timeframe]);

  // Live tick simulation on latest bar
  useEffect(() => {
    if (!isLive) return;
    const id = window.setInterval(() => {
      setBars((prev) => {
        if (prev.length === 0) return prev;
        const copy = [...prev];
        const last = { ...copy[copy.length - 1] };
        const step = (Math.random() - 0.492) * last.close * 0.0016;
        const nextClose = Math.max(0.0001, last.close + step);
        last.close = nextClose;
        last.high = Math.max(last.high, nextClose);
        last.low = Math.min(last.low, nextClose);
        last.volume += Math.round(Math.random() * 4500);
        copy[copy.length - 1] = last;
        return copy;
      });
    }, 1200);
    return () => window.clearInterval(id);
  }, [isLive]);

  const sma20 = useMemo(() => calculateSMA(bars, 20), [bars]);
  const ema50 = useMemo(() => calculateEMA(bars, 50), [bars]);
  const bollinger = useMemo(() => calculateBollinger(bars, 20, 2), [bars]);
  const rsi14 = useMemo(() => calculateRSI(bars, 14), [bars]);
  const gauge = useMemo(() => computeTechnicalGauge(bars), [bars]);

  const latestBar = bars[bars.length - 1];
  const prevBar = bars[bars.length - 2] ?? latestBar;
  const liveChange = latestBar ? latestBar.close - prevBar.close : 0;
  const liveChangePct = prevBar && prevBar.close ? (liveChange / prevBar.close) * 100 : 0;

  const endIdx = Math.max(10, bars.length - rightOffset);
  const startIdx = Math.max(0, endIdx - visibleCount);
  const visibleBars = useMemo(() => bars.slice(startIdx, endIdx), [bars, startIdx, endIdx]);

  // Helper to convert canvas coordinates <-> bar index & price
  const getLayoutMetrics = useCallback(
    (width: number, height: number) => {
      const padLeft = 10;
      const padRight = 76;
      const padTop = 18;
      const padBottom = 28;
      const rsiHeight = showRSI ? Math.min(108, Math.floor(height * 0.22)) : 0;
      const gap = showRSI ? 14 : 0;
      const mainH = Math.max(160, height - padTop - padBottom - rsiHeight - gap);
      const plotW = Math.max(200, width - padLeft - padRight);

      let minP = Infinity;
      let maxP = -Infinity;
      for (const b of visibleBars) {
        if (b.low < minP) minP = b.low;
        if (b.high > maxP) maxP = b.high;
      }
      if (!Number.isFinite(minP) || !Number.isFinite(maxP)) {
        minP = activeSymbol.price * 0.95;
        maxP = activeSymbol.price * 1.05;
      }
      const span = maxP - minP || 1;
      minP -= span * 0.08;
      maxP += span * 0.08;

      return {
        padLeft,
        padRight,
        padTop,
        padBottom,
        mainH,
        rsiHeight,
        gap,
        plotW,
        minP,
        maxP,
      };
    },
    [visibleBars, showRSI, activeSymbol.price]
  );

  // Main Canvas Render
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = viewportRef.current;
    if (!canvas || !container || visibleBars.length === 0) return;

    const render = () => {
      const rect = container.getBoundingClientRect();
      const width = Math.max(320, Math.floor(rect.width));
      const height = Math.max(360, Math.floor(rect.height));
      const dpr = window.devicePixelRatio || 1;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.scale(dpr, dpr);

      const isDark = chartTheme === 'dark';
      const bg = isDark ? '#131722' : '#ffffff';
      const gridColor = isDark ? 'rgba(255,255,255,0.055)' : 'rgba(15,23,42,0.07)';
      const borderColor = isDark ? '#2a2e39' : '#e2e8f0';
      const axisText = isDark ? '#787b86' : '#64748b';

      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      const m = getLayoutMetrics(width, height);
      const count = visibleBars.length;
      const stepX = m.plotW / Math.max(1, count);
      const xForLocal = (li: number) => m.padLeft + (li + 0.5) * stepX;
      const xForGlobal = (gi: number) => xForLocal(gi - startIdx);
      const yForPrice = (p: number) =>
        m.padTop + (1 - (p - m.minP) / (m.maxP - m.minP)) * m.mainH;

      // Grid lines & Price Axis
      ctx.font = '500 11px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      const rows = 6;
      for (let r = 0; r <= rows; r++) {
        const y = m.padTop + (r / rows) * m.mainH;
        const p = m.maxP - (r / rows) * (m.maxP - m.minP);
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(m.padLeft, y);
        ctx.lineTo(width - m.padRight, y);
        ctx.stroke();

        ctx.fillStyle = axisText;
        ctx.fillText(formatPrice(p, activeSymbol.decimals), width - m.padRight + 7, y);
      }

      // Vertical Grid + Time Axis
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      const vStep = Math.max(1, Math.floor(count / 7));
      for (let i = 0; i < count; i += vStep) {
        const x = xForLocal(i);
        ctx.strokeStyle = gridColor;
        ctx.beginPath();
        ctx.moveTo(x, m.padTop);
        ctx.lineTo(x, height - m.padBottom);
        ctx.stroke();

        ctx.fillStyle = axisText;
        ctx.fillText(visibleBars[i].label, x, height - m.padBottom + 8);
      }

      // Right & bottom axis divider lines
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(width - m.padRight, 0);
      ctx.lineTo(width - m.padRight, height - m.padBottom);
      ctx.moveTo(0, height - m.padBottom);
      ctx.lineTo(width, height - m.padBottom);
      ctx.stroke();

      // Volume Histogram (bottom 20% of main pane)
      if (showVolume) {
        let maxVol = 1;
        for (const b of visibleBars) if (b.volume > maxVol) maxVol = b.volume;
        const volMaxH = m.mainH * 0.2;
        const barW = Math.max(1.5, stepX * 0.68);
        visibleBars.forEach((b, li) => {
          const x = xForLocal(li);
          const vh = (b.volume / maxVol) * volMaxH;
          const up = b.close >= b.open;
          ctx.fillStyle = up ? 'rgba(8, 153, 129, 0.28)' : 'rgba(242, 54, 69, 0.28)';
          ctx.fillRect(x - barW / 2, m.padTop + m.mainH - vh, barW, vh);
        });
      }

      // Bollinger Bands
      if (showBollinger) {
        const drawBand = (arr: (number | null)[], color: string) => {
          ctx.beginPath();
          let started = false;
          for (let li = 0; li < count; li++) {
            const val = arr[startIdx + li];
            if (val === null) continue;
            const x = xForLocal(li);
            const y = yForPrice(val);
            if (!started) {
              ctx.moveTo(x, y);
              started = true;
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.1;
          ctx.stroke();
        };
        drawBand(bollinger.upper, 'rgba(41, 98, 255, 0.65)');
        drawBand(bollinger.lower, 'rgba(41, 98, 255, 0.65)');
      }

      // Main Price Series
      if (chartStyle === 'line' || chartStyle === 'area') {
        if (chartStyle === 'area') {
          const grad = ctx.createLinearGradient(0, m.padTop, 0, m.padTop + m.mainH);
          grad.addColorStop(0, 'rgba(41, 98, 255, 0.32)');
          grad.addColorStop(1, 'rgba(41, 98, 255, 0.0)');
          ctx.beginPath();
          ctx.moveTo(xForLocal(0), yForPrice(visibleBars[0].close));
          for (let li = 1; li < count; li++) {
            ctx.lineTo(xForLocal(li), yForPrice(visibleBars[li].close));
          }
          ctx.lineTo(xForLocal(count - 1), m.padTop + m.mainH);
          ctx.lineTo(xForLocal(0), m.padTop + m.mainH);
          ctx.closePath();
          ctx.fillStyle = grad;
          ctx.fill();
        }
        ctx.beginPath();
        ctx.moveTo(xForLocal(0), yForPrice(visibleBars[0].close));
        for (let li = 1; li < count; li++) {
          ctx.lineTo(xForLocal(li), yForPrice(visibleBars[li].close));
        }
        ctx.strokeStyle = '#2962ff';
        ctx.lineWidth = 2;
        ctx.stroke();
      } else {
        const candleW = Math.max(2, stepX * 0.66);
        visibleBars.forEach((b, li) => {
          const x = xForLocal(li);
          const up = b.close >= b.open;
          const color = up ? '#089981' : '#f23645';
          const topY = yForPrice(Math.max(b.open, b.close));
          const botY = yForPrice(Math.min(b.open, b.close));
          const bodyH = Math.max(1.5, botY - topY);

          ctx.strokeStyle = color;
          ctx.lineWidth = 1.25;
          ctx.beginPath();
          ctx.moveTo(x, yForPrice(b.high));
          ctx.lineTo(x, yForPrice(b.low));
          ctx.stroke();

          if (chartStyle === 'hollow' && up) {
            ctx.fillStyle = bg;
            ctx.fillRect(x - candleW / 2, topY, candleW, bodyH);
            ctx.strokeRect(x - candleW / 2, topY, candleW, bodyH);
          } else {
            ctx.fillStyle = color;
            ctx.fillRect(x - candleW / 2, topY, candleW, bodyH);
          }
        });
      }

      // SMA 20 & EMA 50 Overlays
      const drawOverlay = (arr: (number | null)[], color: string) => {
        ctx.beginPath();
        let started = false;
        for (let li = 0; li < count; li++) {
          const val = arr[startIdx + li];
          if (val === null) continue;
          const x = xForLocal(li);
          const y = yForPrice(val);
          if (!started) {
            ctx.moveTo(x, y);
            started = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      };
      if (showSMA20) drawOverlay(sma20, '#2962ff');
      if (showEMA50) drawOverlay(ema50, '#f59e0b');

      // Render User Drawings
      const allDrawings =
        pendingPoint && hoverPoint
          ? [
              ...drawings,
              {
                id: 'preview',
                type: tool === 'horizontal' ? 'horizontal' : (tool as 'trendline' | 'fib' | 'measure'),
                p1: pendingPoint,
                p2: { index: hoverPoint.index, price: hoverPoint.price },
              } as ChartDrawing,
            ]
          : drawings;

      allDrawings.forEach((d) => {
        if (d.type === 'horizontal') {
          const y = yForPrice(d.p1.price);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(m.padLeft, y);
          ctx.lineTo(width - m.padRight, y);
          ctx.stroke();

          ctx.fillStyle = '#0284c7';
          ctx.fillRect(width - m.padRight + 2, y - 9, m.padRight - 6, 18);
          ctx.fillStyle = '#ffffff';
          ctx.font = '600 10px "JetBrains Mono", monospace';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText(formatPrice(d.p1.price, activeSymbol.decimals), width - m.padRight + 6, y);
        } else if (d.p2) {
          const x1 = xForGlobal(d.p1.index);
          const y1 = yForPrice(d.p1.price);
          const x2 = xForGlobal(d.p2.index);
          const y2 = yForPrice(d.p2.price);

          if (d.type === 'trendline') {
            ctx.strokeStyle = '#2962ff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();

            [
              [x1, y1],
              [x2, y2],
            ].forEach(([cx, cy]) => {
              ctx.beginPath();
              ctx.arc(cx, cy, 4, 0, Math.PI * 2);
              ctx.fillStyle = '#ffffff';
              ctx.fill();
              ctx.strokeStyle = '#2962ff';
              ctx.stroke();
            });
          } else if (d.type === 'fib') {
            const levels = [0, 0.236, 0.382, 0.5, 0.618, 1];
            const leftX = Math.min(x1, x2);
            const rightX = Math.max(x1, x2, leftX + 120);
            levels.forEach((lvl) => {
              const p = d.p1.price + (d.p2!.price - d.p1.price) * lvl;
              const ly = yForPrice(p);
              ctx.strokeStyle = lvl === 0.618 || lvl === 0.5 ? '#f59e0b' : 'rgba(56, 189, 248, 0.7)';
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(leftX, ly);
              ctx.lineTo(rightX, ly);
              ctx.stroke();

              ctx.fillStyle = isDark ? '#d1d4dc' : '#1e293b';
              ctx.font = '500 10px "JetBrains Mono", monospace';
              ctx.textAlign = 'left';
              ctx.textBaseline = 'bottom';
              ctx.fillText(`${(lvl * 100).toFixed(1)}% (${formatPrice(p, activeSymbol.decimals)})`, leftX + 4, ly - 2);
            });
          } else if (d.type === 'measure') {
            const left = Math.min(x1, x2);
            const top = Math.min(y1, y2);
            const boxW = Math.abs(x2 - x1);
            const boxH = Math.abs(y2 - y1);
            const diff = d.p2.price - d.p1.price;
            const diffPct = (diff / (d.p1.price || 1)) * 100;
            const barDelta = Math.abs(d.p2.index - d.p1.index);
            const up = diff >= 0;

            ctx.fillStyle = up ? 'rgba(8, 153, 129, 0.16)' : 'rgba(242, 54, 69, 0.16)';
            ctx.strokeStyle = up ? '#089981' : '#f23645';
            ctx.lineWidth = 1;
            ctx.fillRect(left, top, boxW, boxH);
            ctx.strokeRect(left, top, boxW, boxH);

            const label = `${up ? '+' : ''}${formatPrice(diff, activeSymbol.decimals)} (${up ? '+' : ''}${diffPct.toFixed(2)}%) · ${barDelta} bars`;
            ctx.fillStyle = up ? '#089981' : '#f23645';
            ctx.fillRect(left, top - 22, Math.max(150, label.length * 6.5), 20);
            ctx.fillStyle = '#ffffff';
            ctx.font = '600 10px "JetBrains Mono", monospace';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(label, left + 6, top - 12);
          }
        }
      });

      // Latest Price Tag & Dotted Line
      const currentPrice = visibleBars[visibleBars.length - 1].close;
      const lastOpen = visibleBars[visibleBars.length - 1].open;
      const priceColor = currentPrice >= lastOpen ? '#089981' : '#f23645';
      const cy = yForPrice(currentPrice);

      ctx.save();
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = priceColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(m.padLeft, cy);
      ctx.lineTo(width - m.padRight, cy);
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = priceColor;
      ctx.fillRect(width - m.padRight + 1, cy - 10, m.padRight - 4, 20);
      ctx.fillStyle = '#ffffff';
      ctx.font = '600 11px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(formatPrice(currentPrice, activeSymbol.decimals), width - m.padRight + 6, cy);

      // RSI Sub-pane
      if (showRSI && m.rsiHeight > 40) {
        const rsiTop = m.padTop + m.mainH + m.gap;
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, rsiTop - 6);
        ctx.lineTo(width, rsiTop - 6);
        ctx.stroke();

        // 70 / 30 band
        const y70 = rsiTop + (1 - 70 / 100) * m.rsiHeight;
        const y30 = rsiTop + (1 - 30 / 100) * m.rsiHeight;
        ctx.fillStyle = 'rgba(126, 87, 194, 0.08)';
        ctx.fillRect(m.padLeft, y70, m.plotW, y30 - y70);

        ctx.save();
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = 'rgba(120, 123, 134, 0.45)';
        ctx.beginPath();
        ctx.moveTo(m.padLeft, y70);
        ctx.lineTo(width - m.padRight, y70);
        ctx.moveTo(m.padLeft, y30);
        ctx.lineTo(width - m.padRight, y30);
        ctx.stroke();
        ctx.restore();

        // RSI Curve
        ctx.beginPath();
        let started = false;
        for (let li = 0; li < count; li++) {
          const rVal = rsi14[startIdx + li];
          if (rVal === null) continue;
          const rx = xForLocal(li);
          const ry = rsiTop + (1 - rVal / 100) * m.rsiHeight;
          if (!started) {
            ctx.moveTo(rx, ry);
            started = true;
          } else {
            ctx.lineTo(rx, ry);
          }
        }
        ctx.strokeStyle = '#9c6ade';
        ctx.lineWidth = 1.6;
        ctx.stroke();

        const lastRsi = rsi14[endIdx - 1] ?? 50;
        ctx.fillStyle = axisText;
        ctx.font = '500 10px "JetBrains Mono", monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText('70', width - m.padRight + 8, y70);
        ctx.fillText('30', width - m.padRight + 8, y30);

        ctx.fillStyle = '#9c6ade';
        ctx.fillText(`RSI(14) ${lastRsi.toFixed(1)}`, m.padLeft + 6, rsiTop + 8);
      }

      // Crosshair Overlay
      if (hoverPoint && hoverPoint.x < width - m.padRight && hoverPoint.y < height - m.padBottom) {
        ctx.save();
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = isDark ? 'rgba(209, 212, 220, 0.4)' : 'rgba(15, 23, 42, 0.35)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(hoverPoint.x, m.padTop);
        ctx.lineTo(hoverPoint.x, height - m.padBottom);
        ctx.moveTo(m.padLeft, hoverPoint.y);
        ctx.lineTo(width - m.padRight, hoverPoint.y);
        ctx.stroke();
        ctx.restore();

        // Crosshair Y tag
        if (hoverPoint.y <= m.padTop + m.mainH) {
          ctx.fillStyle = isDark ? '#363a45' : '#334155';
          ctx.fillRect(width - m.padRight + 1, hoverPoint.y - 9, m.padRight - 4, 18);
          ctx.fillStyle = '#ffffff';
          ctx.font = '500 10px "JetBrains Mono", monospace';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText(
            formatPrice(hoverPoint.price, activeSymbol.decimals),
            width - m.padRight + 6,
            hoverPoint.y
          );
        }
      }
    };

    render();
    const ro = new ResizeObserver(render);
    ro.observe(container);
    return () => ro.disconnect();
  }, [
    visibleBars,
    chartTheme,
    chartStyle,
    showSMA20,
    showEMA50,
    showBollinger,
    showRSI,
    showVolume,
    sma20,
    ema50,
    bollinger,
    rsi14,
    startIdx,
    endIdx,
    drawings,
    pendingPoint,
    hoverPoint,
    tool,
    activeSymbol.decimals,
    getLayoutMetrics,
  ]);

  const coordsToData = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const m = getLayoutMetrics(rect.width, rect.height);
    const localIdx = Math.max(
      0,
      Math.min(visibleBars.length - 1, Math.round(((x - m.padLeft) / m.plotW) * visibleBars.length - 0.5))
    );
    const globalIdx = startIdx + localIdx;
    const clampedY = Math.max(m.padTop, Math.min(m.padTop + m.mainH, y));
    const price = m.maxP - ((clampedY - m.padTop) / m.mainH) * (m.maxP - m.minP);
    return { index: globalIdx, price, x, y };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pt = coordsToData(e.clientX, e.clientY);
    if (!pt) return;

    if (tool === 'crosshair') {
      dragRef.current = { startX: e.clientX, startOffset: rightOffset };
      return;
    }

    if (tool === 'horizontal') {
      setDrawings((prev) => [
        ...prev,
        { id: `h-${Date.now()}`, type: 'horizontal', p1: { index: pt.index, price: pt.price } },
      ]);
      return;
    }

    if (!pendingPoint) {
      setPendingPoint({ index: pt.index, price: pt.price });
    } else {
      setDrawings((prev) => [
        ...prev,
        {
          id: `d-${Date.now()}`,
          type: tool as 'trendline' | 'fib' | 'measure',
          p1: pendingPoint,
          p2: { index: pt.index, price: pt.price },
        },
      ]);
      setPendingPoint(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pt = coordsToData(e.clientX, e.clientY);
    if (pt) setHoverPoint(pt);

    if (dragRef.current && tool === 'crosshair') {
      const dx = e.clientX - dragRef.current.startX;
      const canvas = canvasRef.current;
      const w = canvas ? canvas.getBoundingClientRect().width : 800;
      const pxPerBar = Math.max(3, w / visibleCount);
      const barShift = Math.round(dx / pxPerBar);
      const maxOff = Math.max(0, bars.length - 25);
      setRightOffset(Math.max(0, Math.min(maxOff, dragRef.current.startOffset + barShift)));
    }
  };

  const handleMouseUp = () => {
    dragRef.current = null;
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 8 : -8;
    setVisibleCount((prev) => Math.max(24, Math.min(bars.length, prev + delta)));
  };

  const activeHoverBar =
    hoverPoint && bars[hoverPoint.index] ? bars[hoverPoint.index] : latestBar;

  const isDark = chartTheme === 'dark';

  const watchlistSymbols = useMemo(
    () =>
      watchlistTickers
        .map((t) => allSymbols.find((s) => s.ticker === t))
        .filter((s): s is MarketSymbol => !!s),
    [watchlistTickers, allSymbols]
  );

  // Ensure active symbol is shown in watchlist if user searched a different one
  useEffect(() => {
    if (!watchlistTickers.includes(activeSymbol.ticker)) {
      setWatchlistTickers((prev) => [activeSymbol.ticker, ...prev]);
    }
  }, [activeSymbol.ticker, watchlistTickers]);

  const placePaperOrder = (side: 'Long' | 'Short') => {
    if (!latestBar) return;
    setPaperPosition({
      ticker: activeSymbol.ticker,
      side,
      entry: latestBar.close,
      qty: activeSymbol.category === 'Crypto' ? 0.5 : 10,
    });
  };

  const paperPnl = useMemo(() => {
    if (!paperPosition || !latestBar || paperPosition.ticker !== activeSymbol.ticker) return null;
    const diff =
      paperPosition.side === 'Long'
        ? latestBar.close - paperPosition.entry
        : paperPosition.entry - latestBar.close;
    return diff * paperPosition.qty;
  }, [paperPosition, latestBar, activeSymbol.ticker]);

  return (
    <div
      className={`flex flex-col h-[calc(100vh-64px)] min-h-[600px] ${
        isDark ? 'bg-[#131722] text-[#d1d4dc]' : 'bg-[#f8fafc] text-[#0f172a]'
      }`}
    >
      {/* Top Chart Toolbar */}
      <div
        className={`h-11 px-2 sm:px-3 border-b flex items-center justify-between gap-2 overflow-x-auto shrink-0 ${
          isDark ? 'bg-[#131722] border-[#2a2e39]' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onBackToPortal}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              isDark
                ? 'text-[#b2b5be] hover:text-white hover:bg-[#2a2e39]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Portal
          </button>

          <div className={`w-px h-5 ${isDark ? 'bg-[#2a2e39]' : 'bg-slate-200'}`} />

          {/* Symbol Trigger */}
          <button
            type="button"
            onClick={onOpenSearch}
            className={`inline-flex items-center gap-2 px-2.5 py-1.5 text-xs font-bold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              isDark ? 'hover:bg-[#2a2e39] text-white' : 'hover:bg-slate-100 text-slate-900'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-[#2962ff]" />
            <span className="font-mono">{activeSymbol.ticker}</span>
            <span className="text-[11px] font-normal text-[#787b86] hidden sm:inline">
              {activeSymbol.exchange}
            </span>
          </button>

          <div className={`w-px h-5 ${isDark ? 'bg-[#2a2e39]' : 'bg-slate-200'}`} />

          {/* Timeframe Switcher */}
          <div className="flex items-center gap-0.5">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-1 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  timeframe === tf
                    ? 'bg-[#2962ff]/15 text-[#2962ff]'
                    : isDark
                    ? 'text-[#b2b5be] hover:text-white hover:bg-[#2a2e39]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          <div className={`w-px h-5 ${isDark ? 'bg-[#2a2e39]' : 'bg-slate-200'}`} />

          {/* Chart Style Switcher */}
          <div className="flex items-center gap-0.5">
            {(
              [
                { id: 'candles', label: 'Candles', icon: CandlestickChart },
                { id: 'hollow', label: 'Hollow', icon: BarChart2 },
                { id: 'line', label: 'Line', icon: LineChart },
                { id: 'area', label: 'Area', icon: Activity },
              ] as const
            ).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                title={label}
                onClick={() => setChartStyle(id)}
                className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  chartStyle === id
                    ? 'bg-[#2962ff]/15 text-[#2962ff]'
                    : isDark
                    ? 'text-[#b2b5be] hover:text-white hover:bg-[#2a2e39]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">{label}</span>
              </button>
            ))}
          </div>

          <div className={`w-px h-5 ${isDark ? 'bg-[#2a2e39]' : 'bg-slate-200'}`} />

          {/* Indicators Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowIndicatorsMenu((p) => !p)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                showIndicatorsMenu
                  ? 'bg-[#2962ff] text-white'
                  : isDark
                  ? 'text-[#d1d4dc] hover:bg-[#2a2e39]'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Indicators
              <ChevronDown className="w-3 h-3" />
            </button>

            {showIndicatorsMenu && (
              <div
                className={`absolute left-0 top-full mt-1 w-56 rounded-lg border shadow-xl p-2 z-30 ${
                  isDark
                    ? 'bg-[#1e222d] border-[#2a2e39] text-[#d1d4dc]'
                    : 'bg-white border-slate-200 text-slate-800'
                }`}
              >
                {[
                  { label: 'SMA (20)', checked: showSMA20, toggle: () => setShowSMA20((v) => !v) },
                  { label: 'EMA (50)', checked: showEMA50, toggle: () => setShowEMA50((v) => !v) },
                  {
                    label: 'Bollinger Bands (20, 2)',
                    checked: showBollinger,
                    toggle: () => setShowBollinger((v) => !v),
                  },
                  { label: 'RSI (14) Sub-pane', checked: showRSI, toggle: () => setShowRSI((v) => !v) },
                  { label: 'Volume Histogram', checked: showVolume, toggle: () => setShowVolume((v) => !v) },
                ].map((item) => (
                  <label
                    key={item.label}
                    className={`flex items-center justify-between px-2.5 py-2 rounded text-xs cursor-pointer ${
                      isDark ? 'hover:bg-[#2a2e39]' : 'hover:bg-slate-100'
                    }`}
                  >
                    <span>{item.label}</span>
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={item.toggle}
                      className="accent-[#2962ff] cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Toolbar Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsLive((p) => !p)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              isLive
                ? 'text-[#089981] bg-[#089981]/15'
                : isDark
                ? 'text-[#787b86] hover:bg-[#2a2e39]'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {isLive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isLive ? 'Live' : 'Paused'}
          </button>

          <button
            type="button"
            onClick={() => {
              setVisibleCount(90);
              setRightOffset(0);
            }}
            title="Reset chart zoom"
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              isDark ? 'text-[#b2b5be] hover:bg-[#2a2e39]' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setChartTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            title="Toggle chart canvas theme"
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              isDark ? 'text-[#b2b5be] hover:bg-[#2a2e39]' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setShowSidebar((p) => !p)}
            title="Toggle watchlist panel"
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              isDark ? 'text-[#b2b5be] hover:bg-[#2a2e39]' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {showSidebar ? (
              <PanelRightClose className="w-4 h-4" />
            ) : (
              <PanelRightOpen className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Main Terminal Body */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left Drawing Toolbar */}
        <aside
          className={`w-12 border-r flex flex-col items-center py-2.5 gap-1.5 shrink-0 ${
            isDark ? 'bg-[#131722] border-[#2a2e39]' : 'bg-white border-slate-200'
          }`}
          aria-label="Chart drawing tools"
        >
          {(
            [
              { id: 'crosshair', label: 'Crosshair & Pan', icon: Crosshair },
              { id: 'trendline', label: 'Trend Line (2 clicks)', icon: TrendingUp },
              { id: 'horizontal', label: 'Horizontal Ray (1 click)', icon: Minus },
              { id: 'fib', label: 'Fib Retracement (2 clicks)', icon: SlidersHorizontal },
              { id: 'measure', label: 'Measure Range (2 clicks)', icon: Ruler },
            ] as const
          ).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              title={label}
              onClick={() => {
                setTool(id);
                setPendingPoint(null);
              }}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                tool === id
                  ? 'bg-[#2962ff] text-white'
                  : isDark
                  ? 'text-[#787b86] hover:text-white hover:bg-[#2a2e39]'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}

          <div className={`w-6 h-px my-1 ${isDark ? 'bg-[#2a2e39]' : 'bg-slate-200'}`} />

          <button
            type="button"
            title="Clear all drawings"
            onClick={() => {
              setDrawings([]);
              setPendingPoint(null);
            }}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
              isDark
                ? 'text-[#787b86] hover:text-[#f23645] hover:bg-[#2a2e39]'
                : 'text-slate-500 hover:text-red-600 hover:bg-slate-100'
            }`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </aside>

        {/* Central Interactive Canvas Area */}
        <div
          ref={viewportRef}
          className="relative flex-1 min-w-0 min-h-0"
          onClick={() => showIndicatorsMenu && setShowIndicatorsMenu(false)}
        >
          {/* Floating OHLCV Legend */}
          {activeHoverBar && (
            <div className="absolute top-2.5 left-3 z-10 pointer-events-none select-none space-y-1">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className={`font-display font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {activeSymbol.name}
                </span>
                <span className="text-[#787b86]">
                  · {timeframe} · {activeSymbol.exchange}
                </span>
                <span
                  className={`font-mono tabular-nums font-semibold ${
                    liveChange >= 0 ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  {liveChange >= 0 ? '+' : ''}
                  {formatPrice(liveChange, activeSymbol.decimals)} ({liveChange >= 0 ? '+' : ''}
                  {liveChangePct.toFixed(2)}%)
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono tabular-nums">
                <span className="text-[#787b86]">
                  O{' '}
                  <span className={activeHoverBar.close >= activeHoverBar.open ? 'text-[#089981]' : 'text-[#f23645]'}>
                    {formatPrice(activeHoverBar.open, activeSymbol.decimals)}
                  </span>
                </span>
                <span className="text-[#787b86]">
                  H{' '}
                  <span className={activeHoverBar.close >= activeHoverBar.open ? 'text-[#089981]' : 'text-[#f23645]'}>
                    {formatPrice(activeHoverBar.high, activeSymbol.decimals)}
                  </span>
                </span>
                <span className="text-[#787b86]">
                  L{' '}
                  <span className={activeHoverBar.close >= activeHoverBar.open ? 'text-[#089981]' : 'text-[#f23645]'}>
                    {formatPrice(activeHoverBar.low, activeSymbol.decimals)}
                  </span>
                </span>
                <span className="text-[#787b86]">
                  C{' '}
                  <span className={activeHoverBar.close >= activeHoverBar.open ? 'text-[#089981]' : 'text-[#f23645]'}>
                    {formatPrice(activeHoverBar.close, activeSymbol.decimals)}
                  </span>
                </span>
                <span className="text-[#787b86]">
                  Vol <span className="text-[#2962ff]">{(activeHoverBar.volume / 1000).toFixed(1)}K</span>
                </span>
              </div>

              {tool !== 'crosshair' && (
                <div className="text-[11px] text-[#2962ff] font-medium">
                  {pendingPoint
                    ? 'Click second point on chart to complete drawing'
                    : `Active tool: ${tool} — click chart to place`}
                </div>
              )}
            </div>
          )}

          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => {
              setHoverPoint(null);
              dragRef.current = null;
            }}
            onWheel={handleWheel}
            className="block w-full h-full cursor-crosshair"
          />
        </div>

        {/* Right Watchlist & Technicals Panel */}
        {showSidebar && (
          <aside
            className={`w-72 lg:w-80 border-l flex flex-col shrink-0 overflow-y-auto ${
              isDark ? 'bg-[#131722] border-[#2a2e39]' : 'bg-white border-slate-200'
            }`}
          >
            {/* Watchlist Header */}
            <div
              className={`px-3.5 py-2.5 border-b flex items-center justify-between ${
                isDark ? 'border-[#2a2e39]' : 'border-slate-200'
              }`}
            >
              <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Watchlist
              </span>
              <button
                type="button"
                onClick={onOpenSearch}
                className="inline-flex items-center gap-1 text-xs text-[#2962ff] hover:underline cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add symbol
              </button>
            </div>

            {/* Watchlist Column Headers */}
            <div
              className={`px-3.5 py-1.5 text-[11px] font-medium text-[#787b86] grid grid-cols-12 border-b ${
                isDark ? 'border-[#1e222d]' : 'border-slate-100'
              }`}
            >
              <span className="col-span-5">Symbol</span>
              <span className="col-span-4 text-right">Last</span>
              <span className="col-span-3 text-right">Chg%</span>
            </div>

            {/* Watchlist Items */}
            <div className={`divide-y ${isDark ? 'divide-[#1e222d]' : 'divide-slate-100'}`}>
              {watchlistSymbols.map((sym) => {
                const isActive = sym.ticker === activeSymbol.ticker;
                const displayPrice =
                  isActive && latestBar ? latestBar.close : sym.price;
                const isUp = sym.change >= 0;
                return (
                  <button
                    key={sym.ticker}
                    type="button"
                    onClick={() => onSelectSymbol(sym)}
                    className={`w-full px-3.5 py-2 grid grid-cols-12 items-center text-left transition-colors cursor-pointer ${
                      isActive
                        ? isDark
                          ? 'bg-[#2962ff]/15'
                          : 'bg-blue-50'
                        : isDark
                        ? 'hover:bg-[#1e222d]'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="col-span-5 flex items-center gap-2 min-w-0">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: sym.monogramBg }}
                      />
                      <span
                        className={`font-mono text-xs font-semibold truncate ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {sym.ticker}
                      </span>
                    </div>
                    <div
                      className={`col-span-4 text-right font-mono tabular-nums text-xs ${
                        isDark ? 'text-[#f0f3fa]' : 'text-slate-800'
                      }`}
                    >
                      {formatPrice(displayPrice, sym.decimals)}
                    </div>
                    <div
                      className={`col-span-3 text-right font-mono tabular-nums text-xs font-semibold ${
                        isUp ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isUp ? '+' : ''}
                      {sym.changePct.toFixed(2)}%
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Technicals Summary Gauge */}
            <div
              className={`p-4 border-t mt-auto ${
                isDark ? 'border-[#2a2e39]' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Technicals ({timeframe})
                </span>
                <span className="font-mono text-xs text-[#787b86]">{activeSymbol.ticker}</span>
              </div>

              {/* Semi-circle SVG Gauge */}
              <div className="flex flex-col items-center py-2">
                <svg viewBox="0 0 180 100" className="w-44 h-24" aria-hidden="true">
                  <path
                    d="M 20 88 A 70 70 0 0 1 160 88"
                    fill="none"
                    stroke={isDark ? '#2a2e39' : '#e2e8f0'}
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  {/* Red / Neutral / Green arc segments */}
                  <path
                    d="M 20 88 A 70 70 0 0 1 62 24"
                    fill="none"
                    stroke="#f23645"
                    strokeWidth="6"
                  />
                  <path
                    d="M 66 22 A 70 70 0 0 1 114 22"
                    fill="none"
                    stroke="#787b86"
                    strokeWidth="6"
                  />
                  <path
                    d="M 118 24 A 70 70 0 0 1 160 88"
                    fill="none"
                    stroke="#089981"
                    strokeWidth="6"
                  />
                  {/* Needle */}
                  {(() => {
                    const angle = Math.PI - gauge.score * Math.PI;
                    const nx = 90 + Math.cos(angle) * 54;
                    const ny = 88 - Math.sin(angle) * 54;
                    return (
                      <g>
                        <line
                          x1="90"
                          y1="88"
                          x2={nx}
                          y2={ny}
                          stroke={isDark ? '#ffffff' : '#0f172a'}
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        <circle cx="90" cy="88" r="5" fill={isDark ? '#ffffff' : '#0f172a'} />
                      </g>
                    );
                  })()}
                </svg>
                <div
                  className={`text-sm font-bold ${
                    gauge.label.includes('Buy')
                      ? 'text-[#089981]'
                      : gauge.label.includes('Sell')
                      ? 'text-[#f23645]'
                      : 'text-[#787b86]'
                  }`}
                >
                  {gauge.label}
                </div>
                <div className="grid grid-cols-3 w-full text-center text-[11px] font-mono tabular-nums mt-2 pt-2 border-t border-[#2a2e39]/60">
                  <div>
                    <div className="text-[#f23645] font-semibold">{gauge.sell}</div>
                    <div className="text-[#787b86]">Sell</div>
                  </div>
                  <div>
                    <div className="text-[#787b86] font-semibold">{gauge.neutral}</div>
                    <div className="text-[#787b86]">Neutral</div>
                  </div>
                  <div>
                    <div className="text-[#089981] font-semibold">{gauge.buy}</div>
                    <div className="text-[#787b86]">Buy</div>
                  </div>
                </div>
              </div>

              {/* Paper Trade Execution Ticket */}
              <div className="mt-3 pt-3 border-t border-[#2a2e39]/60">
                <div className="flex items-center justify-between text-[11px] text-[#787b86] mb-2">
                  <span>Paper order simulation</span>
                  {paperPnl !== null && (
                    <span
                      className={`font-mono tabular-nums font-semibold ${
                        paperPnl >= 0 ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      P&L: {paperPnl >= 0 ? '+' : ''}${paperPnl.toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => placePaperOrder('Short')}
                    className="py-2 px-3 rounded-lg bg-[#f23645] hover:bg-[#d92638] text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Sell MKT
                  </button>
                  <button
                    type="button"
                    onClick={() => placePaperOrder('Long')}
                    className="py-2 px-3 rounded-lg bg-[#2962ff] hover:bg-[#1e53e5] text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Buy MKT
                  </button>
                </div>
                {paperPosition && paperPosition.ticker === activeSymbol.ticker && (
                  <div className="mt-2 flex items-center justify-between text-[11px] font-mono tabular-nums text-[#b2b5be]">
                    <span>
                      {paperPosition.side} {paperPosition.qty} @{' '}
                      {formatPrice(paperPosition.entry, activeSymbol.decimals)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPaperPosition(null)}
                      className="text-[#787b86] hover:text-white underline cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
