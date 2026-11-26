export type AssetCategory = 'Indices' | 'Stocks' | 'Crypto' | 'Futures' | 'Forex' | 'Bonds';

export type SummaryRange = '1D' | '1M' | '3M' | '1Y' | '5Y' | 'All';

export type ChartTimeframe = '1m' | '5m' | '15m' | '1H' | '4H' | '1D' | '1W';

export type ChartStyle = 'candles' | 'hollow' | 'line' | 'area';

export type DrawingTool = 'crosshair' | 'trendline' | 'horizontal' | 'fib' | 'measure';

export interface OHLCBar {
  time: number; // unix seconds
  label: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketSymbol {
  ticker: string;
  name: string;
  exchange: string;
  category: AssetCategory;
  price: number;
  change: number;
  changePct: number;
  currency: string;
  decimals: number;
  volumeLabel: string;
  marketCap?: string;
  peRatio?: string;
  high52w?: number;
  low52w?: number;
  sector?: string;
  monogramBg: string;
  monogramText: string;
  sparkline: number[];
  rating: 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';
}

export interface CommunityIdea {
  id: string;
  title: string;
  symbol: string;
  exchange: string;
  category: Exclude<AssetCategory, 'Futures' | 'Bonds'>;
  timeframe: string;
  direction: 'Long' | 'Short' | 'Neutral';
  author: string;
  authorBadge?: string;
  publishedAgo: string;
  summary: string;
  likes: number;
  comments: number;
  chartPattern: 'breakout' | 'channel' | 'reversal' | 'pullback';
  entryPrice: string;
  targetPrice: string;
}

export interface TopStory {
  id: string;
  headline: string;
  source: string;
  publishedAgo: string;
  relatedTicker: string;
  category: string;
  summary: string;
}

export interface EconomicEvent {
  id: string;
  time: string;
  country: string;
  currency: string;
  event: string;
  impact: 'High' | 'Medium' | 'Low';
  actual: string;
  forecast: string;
  previous: string;
}

export interface BrokerPartner {
  id: string;
  name: string;
  rating: string;
  reviews: string;
  assets: string;
  badge: string;
}

export interface ChartDrawing {
  id: string;
  type: 'trendline' | 'horizontal' | 'fib' | 'measure';
  p1: { index: number; price: number };
  p2?: { index: number; price: number };
}
