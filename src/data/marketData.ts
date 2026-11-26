import {
  BrokerPartner,
  ChartTimeframe,
  CommunityIdea,
  EconomicEvent,
  MarketSymbol,
  OHLCBar,
  SummaryRange,
  TopStory,
} from '../types/market';

export const MARKET_SYMBOLS: MarketSymbol[] = [
  // Indices
  {
    ticker: 'SPX',
    name: 'S&P 500 Index',
    exchange: 'SP',
    category: 'Indices',
    price: 5984.72,
    change: 42.18,
    changePct: 0.71,
    currency: 'USD',
    decimals: 2,
    volumeLabel: '3.12B',
    high52w: 6048.2,
    low52w: 4845.1,
    monogramBg: '#ef4444',
    monogramText: '500',
    sparkline: [5860, 5882, 5875, 5910, 5928, 5944, 5938, 5962, 5984.72],
    rating: 'Strong Buy',
  },
  {
    ticker: 'NDX',
    name: 'Nasdaq 100 Index',
    exchange: 'NASDAQ',
    category: 'Indices',
    price: 20892.45,
    change: 198.6,
    changePct: 0.96,
    currency: 'USD',
    decimals: 2,
    volumeLabel: '4.45B',
    high52w: 21180.0,
    low52w: 16240.0,
    monogramBg: '#0ea5e9',
    monogramText: '100',
    sparkline: [20410, 20480, 20550, 20510, 20640, 20715, 20690, 20780, 20892.45],
    rating: 'Strong Buy',
  },
  {
    ticker: 'DJI',
    name: 'Dow Jones Industrial',
    exchange: 'DJ',
    category: 'Indices',
    price: 44296.51,
    change: 184.22,
    changePct: 0.42,
    currency: 'USD',
    decimals: 2,
    volumeLabel: '412M',
    high52w: 44510.0,
    low52w: 36820.0,
    monogramBg: '#2563eb',
    monogramText: '30',
    sparkline: [43820, 43900, 43880, 44010, 44090, 44150, 44110, 44210, 44296.51],
    rating: 'Buy',
  },
  {
    ticker: 'RUT',
    name: 'Russell 2000 Index',
    exchange: 'TVC',
    category: 'Indices',
    price: 2384.19,
    change: -11.4,
    changePct: -0.48,
    currency: 'USD',
    decimals: 2,
    volumeLabel: '1.18B',
    high52w: 2442.0,
    low52w: 1890.0,
    monogramBg: '#8b5cf6',
    monogramText: 'R2K',
    sparkline: [2412, 2408, 2420, 2405, 2398, 2402, 2394, 2390, 2384.19],
    rating: 'Neutral',
  },
  {
    ticker: 'DAX',
    name: 'DAX Performance Index',
    exchange: 'XETR',
    category: 'Indices',
    price: 19412.88,
    change: 112.34,
    changePct: 0.58,
    currency: 'EUR',
    decimals: 2,
    volumeLabel: '86.4M',
    high52w: 19674.0,
    low52w: 16345.0,
    monogramBg: '#1d4ed8',
    monogramText: 'DE',
    sparkline: [19120, 19180, 19150, 19240, 19285, 19310, 19295, 19360, 19412.88],
    rating: 'Buy',
  },
  {
    ticker: 'NI225',
    name: 'Nikkei 225 Index',
    exchange: 'TVC',
    category: 'Indices',
    price: 38642.9,
    change: -148.1,
    changePct: -0.38,
    currency: 'JPY',
    decimals: 2,
    volumeLabel: '1.62B',
    high52w: 42224.0,
    low52w: 31156.0,
    monogramBg: '#dc2626',
    monogramText: 'JP',
    sparkline: [39120, 39040, 38980, 38890, 38940, 38810, 38760, 38710, 38642.9],
    rating: 'Neutral',
  },

  // Stocks
  {
    ticker: 'NVDA',
    name: 'NVIDIA Corporation',
    exchange: 'NASDAQ',
    category: 'Stocks',
    price: 146.82,
    change: 4.38,
    changePct: 3.07,
    currency: 'USD',
    decimals: 2,
    volumeLabel: '248.4M',
    marketCap: '$3.59T',
    peRatio: '54.2',
    high52w: 152.89,
    low52w: 47.32,
    sector: 'Semiconductors',
    monogramBg: '#76b900',
    monogramText: 'NV',
    sparkline: [137.4, 138.9, 140.2, 139.5, 142.1, 143.8, 143.0, 145.1, 146.82],
    rating: 'Strong Buy',
  },
  {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    exchange: 'NASDAQ',
    category: 'Stocks',
    price: 234.15,
    change: 1.92,
    changePct: 0.83,
    currency: 'USD',
    decimals: 2,
    volumeLabel: '46.2M',
    marketCap: '$3.54T',
    peRatio: '36.8',
    high52w: 237.49,
    low52w: 164.08,
    sector: 'Consumer Tech',
    monogramBg: '#334155',
    monogramText: 'AA',
    sparkline: [229.4, 230.1, 229.8, 231.2, 232.0, 231.5, 232.8, 233.4, 234.15],
    rating: 'Buy',
  },
  {
    ticker: 'TSLA',
    name: 'Tesla, Inc.',
    exchange: 'NASDAQ',
    category: 'Stocks',
    price: 348.6,
    change: 12.84,
    changePct: 3.82,
    currency: 'USD',
    decimals: 2,
    volumeLabel: '98.7M',
    marketCap: '$1.12T',
    peRatio: '92.4',
    high52w: 361.9,
    low52w: 138.8,
    sector: 'Automotive & AI',
    monogramBg: '#e11d48',
    monogramText: 'TS',
    sparkline: [322.0, 326.5, 324.0, 331.2, 335.8, 339.0, 342.4, 344.1, 348.6],
    rating: 'Strong Buy',
  },
  {
    ticker: 'MSFT',
    name: 'Microsoft Corporation',
    exchange: 'NASDAQ',
    category: 'Stocks',
    price: 426.9,
    change: 3.15,
    changePct: 0.74,
    currency: 'USD',
    decimals: 2,
    volumeLabel: '21.8M',
    marketCap: '$3.17T',
    peRatio: '34.9',
    high52w: 468.35,
    low52w: 366.5,
    sector: 'Software',
    monogramBg: '#0284c7',
    monogramText: 'MS',
    sparkline: [418.2, 419.5, 421.0, 420.4, 422.8, 424.1, 423.6, 425.2, 426.9],
    rating: 'Buy',
  },
  {
    ticker: 'AMZN',
    name: 'Amazon.com, Inc.',
    exchange: 'NASDAQ',
    category: 'Stocks',
    price: 211.48,
    change: -1.64,
    changePct: -0.77,
    currency: 'USD',
    decimals: 2,
    volumeLabel: '38.4M',
    marketCap: '$2.22T',
    peRatio: '44.1',
    high52w: 218.4,
    low52w: 144.05,
    sector: 'Retail & Cloud',
    monogramBg: '#d97706',
    monogramText: 'AM',
    sparkline: [214.8, 214.2, 213.9, 213.1, 212.8, 213.4, 212.2, 211.9, 211.48],
    rating: 'Neutral',
  },
  {
    ticker: 'META',
    name: 'Meta Platforms, Inc.',
    exchange: 'NASDAQ',
    category: 'Stocks',
    price: 592.3,
    change: 7.45,
    changePct: 1.27,
    currency: 'USD',
    decimals: 2,
    volumeLabel: '14.9M',
    marketCap: '$1.49T',
    peRatio: '27.6',
    high52w: 602.95,
    low52w: 334.0,
    sector: 'Interactive Media',
    monogramBg: '#2563eb',
    monogramText: 'ME',
    sparkline: [576.0, 579.2, 581.0, 580.4, 584.5, 587.1, 586.8, 589.9, 592.3],
    rating: 'Strong Buy',
  },
  {
    ticker: 'AMD',
    name: 'Advanced Micro Devices',
    exchange: 'NASDAQ',
    category: 'Stocks',
    price: 141.22,
    change: -2.86,
    changePct: -1.98,
    currency: 'USD',
    decimals: 2,
    volumeLabel: '41.3M',
    marketCap: '$229B',
    peRatio: '41.0',
    high52w: 227.3,
    low52w: 118.4,
    sector: 'Semiconductors',
    monogramBg: '#0f766e',
    monogramText: 'AMD',
    sparkline: [146.2, 145.4, 144.8, 145.1, 143.9, 143.1, 142.4, 141.8, 141.22],
    rating: 'Sell',
  },
  {
    ticker: 'PLTR',
    name: 'Palantir Technologies',
    exchange: 'NYSE',
    category: 'Stocks',
    price: 64.85,
    change: 3.42,
    changePct: 5.57,
    currency: 'USD',
    decimals: 2,
    volumeLabel: '76.1M',
    marketCap: '$147B',
    peRatio: '164.0',
    high52w: 66.0,
    low52w: 15.66,
    sector: 'Enterprise AI',
    monogramBg: '#1e293b',
    monogramText: 'PL',
    sparkline: [56.2, 57.8, 58.4, 59.9, 61.1, 62.0, 61.6, 63.4, 64.85],
    rating: 'Strong Buy',
  },

  // Crypto
  {
    ticker: 'BTCUSD',
    name: 'Bitcoin / U.S. Dollar',
    exchange: 'BITSTAMP',
    category: 'Crypto',
    price: 96420.0,
    change: 2840.0,
    changePct: 3.03,
    currency: 'USD',
    decimals: 2,
    volumeLabel: '$48.2B',
    high52w: 99588.0,
    low52w: 38505.0,
    monogramBg: '#f7931a',
    monogramText: '₿',
    sparkline: [91200, 92150, 91800, 93400, 94100, 94850, 94600, 95720, 96420],
    rating: 'Strong Buy',
  },
  {
    ticker: 'ETHUSD',
    name: 'Ethereum / U.S. Dollar',
    exchange: 'COINBASE',
    category: 'Crypto',
    price: 3482.5,
    change: 124.8,
    changePct: 3.72,
    currency: 'USD',
    decimals: 2,
    volumeLabel: '$22.6B',
    high52w: 4093.0,
    low52w: 2111.0,
    monogramBg: '#627eea',
    monogramText: 'Ξ',
    sparkline: [3240, 3275, 3290, 3320, 3365, 3390, 3410, 3448, 3482.5],
    rating: 'Strong Buy',
  },
  {
    ticker: 'SOLUSD',
    name: 'Solana / U.S. Dollar',
    exchange: 'BINANCE',
    category: 'Crypto',
    price: 242.18,
    change: 8.64,
    changePct: 3.7,
    currency: 'USD',
    decimals: 2,
    volumeLabel: '$6.8B',
    high52w: 264.4,
    low52w: 79.2,
    monogramBg: '#9945ff',
    monogramText: 'SOL',
    sparkline: [226.4, 228.1, 230.5, 229.8, 233.4, 236.0, 238.1, 240.2, 242.18],
    rating: 'Strong Buy',
  },
  {
    ticker: 'XRPUSD',
    name: 'XRP / U.S. Dollar',
    exchange: 'BITSTAMP',
    category: 'Crypto',
    price: 1.448,
    change: 0.092,
    changePct: 6.78,
    currency: 'USD',
    decimals: 4,
    volumeLabel: '$5.4B',
    high52w: 1.63,
    low52w: 0.382,
    monogramBg: '#23292f',
    monogramText: 'XRP',
    sparkline: [1.26, 1.29, 1.31, 1.34, 1.36, 1.38, 1.4, 1.42, 1.448],
    rating: 'Strong Buy',
  },
  {
    ticker: 'BNBUSD',
    name: 'BNB / U.S. Dollar',
    exchange: 'BINANCE',
    category: 'Crypto',
    price: 654.4,
    change: -7.2,
    changePct: -1.09,
    currency: 'USD',
    decimals: 2,
    volumeLabel: '$2.1B',
    high52w: 721.8,
    low52w: 288.4,
    monogramBg: '#f3ba2f',
    monogramText: 'BNB',
    sparkline: [668, 665, 666, 662, 660, 658, 659, 656, 654.4],
    rating: 'Neutral',
  },
  {
    ticker: 'ADAUSD',
    name: 'Cardano / U.S. Dollar',
    exchange: 'COINBASE',
    category: 'Crypto',
    price: 0.984,
    change: 0.041,
    changePct: 4.35,
    currency: 'USD',
    decimals: 4,
    volumeLabel: '$1.9B',
    high52w: 1.15,
    low52w: 0.278,
    monogramBg: '#0033ad',
    monogramText: 'ADA',
    sparkline: [0.89, 0.91, 0.92, 0.93, 0.94, 0.95, 0.96, 0.97, 0.984],
    rating: 'Buy',
  },

  // Futures
  {
    ticker: 'GC1!',
    name: 'Gold Futures (Continuous)',
    exchange: 'COMEX',
    category: 'Futures',
    price: 2684.6,
    change: 21.4,
    changePct: 0.8,
    currency: 'USD',
    decimals: 2,
    volumeLabel: '184K',
    high52w: 2801.8,
    low52w: 1984.3,
    monogramBg: '#ca8a04',
    monogramText: 'Au',
    sparkline: [2638, 2645, 2652, 2648, 2660, 2668, 2672, 2679, 2684.6],
    rating: 'Buy',
  },
  {
    ticker: 'CL1!',
    name: 'WTI Crude Oil Futures',
    exchange: 'NYMEX',
    category: 'Futures',
    price: 69.84,
    change: -1.18,
    changePct: -1.66,
    currency: 'USD',
    decimals: 2,
    volumeLabel: '312K',
    high52w: 87.67,
    low52w: 65.27,
    monogramBg: '#1e293b',
    monogramText: 'CL',
    sparkline: [72.1, 71.8, 71.4, 71.0, 70.9, 70.5, 70.2, 70.0, 69.84],
    rating: 'Sell',
  },
  {
    ticker: 'ES1!',
    name: 'E-mini S&P 500 Futures',
    exchange: 'CME',
    category: 'Futures',
    price: 6012.25,
    change: 44.5,
    changePct: 0.75,
    currency: 'USD',
    decimals: 2,
    volumeLabel: '1.42M',
    high52w: 6072.0,
    low52w: 4868.0,
    monogramBg: '#2563eb',
    monogramText: 'ES',
    sparkline: [5920, 5935, 5948, 5960, 5972, 5985, 5990, 6002, 6012.25],
    rating: 'Strong Buy',
  },
  {
    ticker: 'SI1!',
    name: 'Silver Futures (Continuous)',
    exchange: 'COMEX',
    category: 'Futures',
    price: 31.18,
    change: 0.42,
    changePct: 1.37,
    currency: 'USD',
    decimals: 3,
    volumeLabel: '74K',
    high52w: 35.07,
    low52w: 21.95,
    monogramBg: '#64748b',
    monogramText: 'Ag',
    sparkline: [30.2, 30.4, 30.5, 30.6, 30.8, 30.9, 31.0, 31.1, 31.18],
    rating: 'Buy',
  },
  {
    ticker: 'NG1!',
    name: 'Natural Gas Futures',
    exchange: 'NYMEX',
    category: 'Futures',
    price: 3.384,
    change: 0.146,
    changePct: 4.51,
    currency: 'USD',
    decimals: 3,
    volumeLabel: '162K',
    high52w: 3.56,
    low52w: 1.48,
    monogramBg: '#0284c7',
    monogramText: 'NG',
    sparkline: [3.08, 3.12, 3.16, 3.21, 3.24, 3.29, 3.32, 3.35, 3.384],
    rating: 'Strong Buy',
  },
  {
    ticker: 'NQ1!',
    name: 'E-mini Nasdaq-100 Futures',
    exchange: 'CME',
    category: 'Futures',
    price: 20968.5,
    change: 204.25,
    changePct: 0.98,
    currency: 'USD',
    decimals: 2,
    volumeLabel: '642K',
    high52w: 21265.0,
    low52w: 16310.0,
    monogramBg: '#0369a1',
    monogramText: 'NQ',
    sparkline: [20520, 20610, 20680, 20710, 20790, 20840, 20890, 20930, 20968.5],
    rating: 'Strong Buy',
  },

  // Forex
  {
    ticker: 'EURUSD',
    name: 'Euro / U.S. Dollar',
    exchange: 'FX_IDC',
    category: 'Forex',
    price: 1.0542,
    change: 0.0028,
    changePct: 0.27,
    currency: 'USD',
    decimals: 4,
    volumeLabel: 'High',
    high52w: 1.1214,
    low52w: 1.0332,
    monogramBg: '#1d4ed8',
    monogramText: '€/$',
    sparkline: [1.048, 1.049, 1.0502, 1.0495, 1.0512, 1.0521, 1.0529, 1.0535, 1.0542],
    rating: 'Neutral',
  },
  {
    ticker: 'GBPUSD',
    name: 'British Pound / U.S. Dollar',
    exchange: 'FX_IDC',
    category: 'Forex',
    price: 1.2614,
    change: 0.0041,
    changePct: 0.33,
    currency: 'USD',
    decimals: 4,
    volumeLabel: 'High',
    high52w: 1.3434,
    low52w: 1.2299,
    monogramBg: '#4338ca',
    monogramText: '£/$',
    sparkline: [1.253, 1.255, 1.256, 1.257, 1.258, 1.259, 1.26, 1.2608, 1.2614],
    rating: 'Buy',
  },
  {
    ticker: 'USDJPY',
    name: 'U.S. Dollar / Japanese Yen',
    exchange: 'FX_IDC',
    category: 'Forex',
    price: 153.48,
    change: -0.92,
    changePct: -0.6,
    currency: 'JPY',
    decimals: 2,
    volumeLabel: 'High',
    high52w: 161.95,
    low52w: 139.58,
    monogramBg: '#be123c',
    monogramText: '$/¥',
    sparkline: [155.2, 154.9, 154.6, 154.4, 154.1, 154.0, 153.8, 153.6, 153.48],
    rating: 'Sell',
  },
  {
    ticker: 'AUDUSD',
    name: 'Australian Dollar / USD',
    exchange: 'FX_IDC',
    category: 'Forex',
    price: 0.6512,
    change: -0.0018,
    changePct: -0.28,
    currency: 'USD',
    decimals: 4,
    volumeLabel: 'Med',
    high52w: 0.6942,
    low52w: 0.6348,
    monogramBg: '#047857',
    monogramText: 'A$',
    sparkline: [0.656, 0.655, 0.654, 0.6545, 0.653, 0.6525, 0.652, 0.6518, 0.6512],
    rating: 'Sell',
  },
  {
    ticker: 'USDCAD',
    name: 'U.S. Dollar / Canadian Dollar',
    exchange: 'FX_IDC',
    category: 'Forex',
    price: 1.3984,
    change: 0.0022,
    changePct: 0.16,
    currency: 'CAD',
    decimals: 4,
    volumeLabel: 'Med',
    high52w: 1.4178,
    low52w: 1.3177,
    monogramBg: '#b91c1c',
    monogramText: 'C$',
    sparkline: [1.392, 1.393, 1.394, 1.395, 1.3955, 1.396, 1.397, 1.3978, 1.3984],
    rating: 'Buy',
  },
  {
    ticker: 'USDCHF',
    name: 'U.S. Dollar / Swiss Franc',
    exchange: 'FX_IDC',
    category: 'Forex',
    price: 0.8842,
    change: -0.0031,
    changePct: -0.35,
    currency: 'CHF',
    decimals: 4,
    volumeLabel: 'Med',
    high52w: 0.9224,
    low52w: 0.8332,
    monogramBg: '#dc2626',
    monogramText: 'CHF',
    sparkline: [0.891, 0.89, 0.889, 0.888, 0.887, 0.886, 0.8855, 0.885, 0.8842],
    rating: 'Neutral',
  },

  // Bonds
  {
    ticker: 'US10Y',
    name: 'U.S. 10-Year Treasury Yield',
    exchange: 'TVC',
    category: 'Bonds',
    price: 4.268,
    change: -0.044,
    changePct: -1.02,
    currency: '%',
    decimals: 3,
    volumeLabel: 'Bench',
    high52w: 4.739,
    low52w: 3.599,
    monogramBg: '#0f172a',
    monogramText: '10Y',
    sparkline: [4.38, 4.36, 4.34, 4.35, 4.32, 4.3, 4.29, 4.28, 4.268],
    rating: 'Sell',
  },
  {
    ticker: 'US02Y',
    name: 'U.S. 2-Year Treasury Yield',
    exchange: 'TVC',
    category: 'Bonds',
    price: 4.212,
    change: -0.032,
    changePct: -0.75,
    currency: '%',
    decimals: 3,
    volumeLabel: 'Bench',
    high52w: 5.046,
    low52w: 3.495,
    monogramBg: '#1e293b',
    monogramText: '2Y',
    sparkline: [4.29, 4.28, 4.27, 4.26, 4.25, 4.24, 4.23, 4.22, 4.212],
    rating: 'Neutral',
  },
  {
    ticker: 'US30Y',
    name: 'U.S. 30-Year Treasury Yield',
    exchange: 'TVC',
    category: 'Bonds',
    price: 4.448,
    change: -0.051,
    changePct: -1.13,
    currency: '%',
    decimals: 3,
    volumeLabel: 'Bench',
    high52w: 4.855,
    low52w: 3.902,
    monogramBg: '#334155',
    monogramText: '30Y',
    sparkline: [4.56, 4.54, 4.52, 4.51, 4.49, 4.48, 4.47, 4.46, 4.448],
    rating: 'Sell',
  },
  {
    ticker: 'DE10Y',
    name: 'Germany 10-Year Bund Yield',
    exchange: 'TVC',
    category: 'Bonds',
    price: 2.214,
    change: -0.028,
    changePct: -1.25,
    currency: '%',
    decimals: 3,
    volumeLabel: 'Bench',
    high52w: 2.707,
    low52w: 1.894,
    monogramBg: '#1d4ed8',
    monogramText: 'DE',
    sparkline: [2.29, 2.28, 2.27, 2.26, 2.25, 2.24, 2.23, 2.22, 2.214],
    rating: 'Sell',
  },
  {
    ticker: 'GB10Y',
    name: 'UK 10-Year Gilt Yield',
    exchange: 'TVC',
    category: 'Bonds',
    price: 4.342,
    change: -0.019,
    changePct: -0.44,
    currency: '%',
    decimals: 3,
    volumeLabel: 'Bench',
    high52w: 4.621,
    low52w: 3.432,
    monogramBg: '#4f46e5',
    monogramText: 'UK',
    sparkline: [4.4, 4.39, 4.38, 4.38, 4.37, 4.36, 4.35, 4.345, 4.342],
    rating: 'Neutral',
  },
  {
    ticker: 'JP10Y',
    name: 'Japan 10-Year JGB Yield',
    exchange: 'TVC',
    category: 'Bonds',
    price: 1.072,
    change: 0.012,
    changePct: 1.13,
    currency: '%',
    decimals: 3,
    volumeLabel: 'Bench',
    high52w: 1.11,
    low52w: 0.556,
    monogramBg: '#dc2626',
    monogramText: 'JP',
    sparkline: [1.03, 1.04, 1.045, 1.05, 1.055, 1.06, 1.065, 1.068, 1.072],
    rating: 'Buy',
  },
];

export const COMMUNITY_IDEAS: CommunityIdea[] = [
  {
    id: 'idea-btc',
    title: 'BTCUSD Bull Flag Compression Above $94K Support',
    symbol: 'BTCUSD',
    exchange: 'BITSTAMP',
    category: 'Crypto',
    timeframe: '4H',
    direction: 'Long',
    author: 'QuantHorizon',
    authorBadge: 'Editor Pick',
    publishedAgo: '2h ago',
    summary:
      'Price is coiling inside a tight descending channel above the 50 EMA with declining sell-side volume. Clean breakout above $96,800 opens path toward psychological $100K liquidity.',
    likes: 842,
    comments: 94,
    chartPattern: 'breakout',
    entryPrice: '96,400',
    targetPrice: '102,500',
  },
  {
    id: 'idea-nvda',
    title: 'NVDA Ascending Channel — Post-Earnings Accumulation',
    symbol: 'NVDA',
    exchange: 'NASDAQ',
    category: 'Stocks',
    timeframe: '1D',
    direction: 'Long',
    author: 'ElenaMacro',
    publishedAgo: '4h ago',
    summary:
      'Institutional bids defended the $138 volume shelf twice this week. Watching for momentum expansion above $148.50 toward the upper channel boundary.',
    likes: 615,
    comments: 58,
    chartPattern: 'channel',
    entryPrice: '146.80',
    targetPrice: '162.00',
  },
  {
    id: 'idea-eurusd',
    title: 'EURUSD Reversal Structure Off Multi-Month Demand Zone',
    symbol: 'EURUSD',
    exchange: 'FX_IDC',
    category: 'Forex',
    timeframe: '1H',
    direction: 'Long',
    author: 'FX_DeskLondon',
    authorBadge: 'Top Author',
    publishedAgo: '6h ago',
    summary:
      'Bullish RSI divergence formed on the 1H and 4H charts near 1.0460. A sustained close above 1.0560 confirms shift in short-term market structure.',
    likes: 419,
    comments: 41,
    chartPattern: 'reversal',
    entryPrice: '1.0540',
    targetPrice: '1.0680',
  },
  {
    id: 'idea-spx',
    title: 'SPX Pullback Re-Test Into 5,950 Breakout Shelf',
    symbol: 'SPX',
    exchange: 'SP',
    category: 'Indices',
    timeframe: '1D',
    direction: 'Long',
    author: 'DeltaFlow',
    publishedAgo: '9h ago',
    summary:
      'Breadth thrust remains constructive with 72% of S&P 500 constituents holding above their 50-day moving average. Dip buyers remain active near 5,940.',
    likes: 538,
    comments: 67,
    chartPattern: 'pullback',
    entryPrice: '5,980',
    targetPrice: '6,120',
  },
];

export const TOP_STORIES: TopStory[] = [
  {
    id: 'news-1',
    headline: 'S&P 500 and Nasdaq notch fresh intraday highs as Treasury yields ease ahead of PCE data',
    source: 'MarketWire',
    publishedAgo: '14m ago',
    relatedTicker: 'SPX',
    category: 'Equities',
    summary: 'Large-cap technology and semiconductor leaders paced broad gains after the 10-year Treasury yield slipped below 4.27%.',
  },
  {
    id: 'news-2',
    headline: 'Bitcoin holds $96,000 handle as spot ETF net inflows record fifth consecutive positive session',
    source: 'CryptoBrief',
    publishedAgo: '38m ago',
    relatedTicker: 'BTCUSD',
    category: 'Crypto',
    summary: 'Institutional desk volume remained elevated through the New York open while realized volatility compressed.',
  },
  {
    id: 'news-3',
    headline: 'Nvidia accelerates data center rack shipments as hyperscalers expand 2027 capex guidance',
    source: 'TechLedger',
    publishedAgo: '1h ago',
    relatedTicker: 'NVDA',
    category: 'Technology',
    summary: 'Supply chain checks point to sustained Blackwell demand outstripping initial quarterly estimates.',
  },
  {
    id: 'news-4',
    headline: 'Gold climbs above $2,680/oz on softer US dollar and steady central bank reserve accumulation',
    source: 'CommoditiesDesk',
    publishedAgo: '2h ago',
    relatedTicker: 'GC1!',
    category: 'Commodities',
    summary: 'Bullion recovered early week losses alongside a 0.3% pullback in the US Dollar Index.',
  },
  {
    id: 'news-5',
    headline: 'Euro firms toward 1.0550 ahead of Eurozone flash inflation print and ECB policy commentary',
    source: 'FXGlobal',
    publishedAgo: '3h ago',
    relatedTicker: 'EURUSD',
    category: 'Currencies',
    summary: 'Rate differentials narrowed marginally in early European trading as bund yields stabilized.',
  },
];

export const ECONOMIC_EVENTS: EconomicEvent[] = [
  {
    id: 'eco-1',
    time: '08:30 EST',
    country: 'US',
    currency: 'USD',
    event: 'Core PCE Price Index (MoM)',
    impact: 'High',
    actual: '0.3%',
    forecast: '0.3%',
    previous: '0.2%',
  },
  {
    id: 'eco-2',
    time: '08:30 EST',
    country: 'US',
    currency: 'USD',
    event: 'Initial Jobless Claims',
    impact: 'High',
    actual: '213K',
    forecast: '216K',
    previous: '215K',
  },
  {
    id: 'eco-3',
    time: '10:00 EST',
    country: 'US',
    currency: 'USD',
    event: 'Pending Home Sales (MoM)',
    impact: 'Medium',
    actual: '2.0%',
    forecast: '-0.7%',
    previous: '7.5%',
  },
  {
    id: 'eco-4',
    time: '14:00 EST',
    country: 'US',
    currency: 'USD',
    event: 'FOMC Meeting Minutes',
    impact: 'High',
    actual: '—',
    forecast: '—',
    previous: '—',
  },
  {
    id: 'eco-5',
    time: '05:00 EST',
    country: 'EU',
    currency: 'EUR',
    event: 'Eurozone CPI Flash Estimate (YoY)',
    impact: 'High',
    actual: '—',
    forecast: '2.3%',
    previous: '2.0%',
  },
];

export const BROKER_PARTNERS: BrokerPartner[] = [
  {
    id: 'br-1',
    name: 'Interactive Brokers',
    rating: '4.9',
    reviews: '18.4K reviews',
    assets: 'Stocks · Options · Futures · Forex',
    badge: 'Platinum Partner',
  },
  {
    id: 'br-2',
    name: 'PEPPERSTONE',
    rating: '4.8',
    reviews: '12.1K reviews',
    assets: 'Forex · Indices · Commodities',
    badge: 'Best Execution',
  },
  {
    id: 'br-3',
    name: 'OANDA',
    rating: '4.7',
    reviews: '9.8K reviews',
    assets: 'Forex · CFDs · Metals',
    badge: 'Trusted Global',
  },
  {
    id: 'br-4',
    name: 'TradeStation',
    rating: '4.7',
    reviews: '7.2K reviews',
    assets: 'Equities · Futures · Crypto',
    badge: 'Pro Desktop',
  },
];

// Deterministic seeded PRNG so every symbol+timeframe renders consistent realistic candles
function hashString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function createRng(seed: number) {
  let s = seed || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function generateSummarySeries(
  symbol: MarketSymbol,
  range: SummaryRange
): OHLCBar[] {
  const counts: Record<SummaryRange, number> = {
    '1D': 78,
    '1M': 60,
    '3M': 90,
    '1Y': 120,
    '5Y': 140,
    All: 160,
  };
  const stepSeconds: Record<SummaryRange, number> = {
    '1D': 300,
    '1M': 14400,
    '3M': 86400,
    '1Y': 259200,
    '5Y': 1123200,
    All: 2592000,
  };
  const volatilityMap: Record<SummaryRange, number> = {
    '1D': 0.0022,
    '1M': 0.0065,
    '3M': 0.011,
    '1Y': 0.017,
    '5Y': 0.024,
    All: 0.032,
  };

  return buildSeries(
    symbol,
    `${symbol.ticker}-${range}`,
    counts[range],
    stepSeconds[range],
    volatilityMap[range],
    range === '1D'
  );
}

export function generateChartBars(
  symbol: MarketSymbol,
  timeframe: ChartTimeframe,
  count = 140
): OHLCBar[] {
  const stepMap: Record<ChartTimeframe, number> = {
    '1m': 60,
    '5m': 300,
    '15m': 900,
    '1H': 3600,
    '4H': 14400,
    '1D': 86400,
    '1W': 604800,
  };
  const volMap: Record<ChartTimeframe, number> = {
    '1m': 0.0014,
    '5m': 0.0025,
    '15m': 0.004,
    '1H': 0.007,
    '4H': 0.012,
    '1D': 0.018,
    '1W': 0.031,
  };
  return buildSeries(
    symbol,
    `${symbol.ticker}-tf-${timeframe}`,
    count,
    stepMap[timeframe],
    volMap[timeframe],
    timeframe === '1m' || timeframe === '5m' || timeframe === '15m' || timeframe === '1H'
  );
}

function buildSeries(
  symbol: MarketSymbol,
  seedKey: string,
  count: number,
  stepSec: number,
  vol: number,
  intradayLabel: boolean
): OHLCBar[] {
  const rng = createRng(hashString(seedKey));
  const targetClose = symbol.price;
  const trendSign = symbol.change >= 0 ? 1 : -1;

  // Walk backwards from current price so final bar always matches symbol.price cleanly
  const closes: number[] = new Array(count);
  closes[count - 1] = targetClose;
  for (let i = count - 2; i >= 0; i--) {
    const noise = (rng() - 0.5) * 2 * vol;
    const drift = trendSign * vol * 0.14;
    const wave = Math.sin(i * 0.22) * vol * 0.32;
    const factor = 1 + noise + drift + wave;
    closes[i] = Math.max(symbol.price * 0.25, closes[i + 1] / Math.max(0.85, factor));
  }

  const nowSec = Math.floor(new Date('2026-11-25T16:00:00Z').getTime() / 1000);
  const bars: OHLCBar[] = [];
  for (let i = 0; i < count; i++) {
    const close = closes[i];
    const open = i === 0 ? close * (1 + (rng() - 0.5) * vol * 0.7) : closes[i - 1];
    const wickUp = Math.abs(rng() * vol * 0.85) * Math.max(open, close);
    const wickDown = Math.abs(rng() * vol * 0.85) * Math.max(open, close);
    const high = Math.max(open, close) + wickUp;
    const low = Math.max(0.0001, Math.min(open, close) - wickDown);
    const volume = Math.round((0.4 + rng() * 1.6) * 100000 * (1 + Math.abs(close - open) / close * 28));
    const time = nowSec - (count - 1 - i) * stepSec;
    const d = new Date(time * 1000);
    const label = intradayLabel
      ? d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
      : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    bars.push({ time, label, open, high, low, close, volume });
  }
  return bars;
}

export function calculateSMA(bars: OHLCBar[], period: number): (number | null)[] {
  return bars.map((_, i) => {
    if (i < period - 1) return null;
    let sum = 0;
    for (let j = i - period + 1; j <= i; j++) sum += bars[j].close;
    return sum / period;
  });
}

export function calculateEMA(bars: OHLCBar[], period: number): (number | null)[] {
  const k = 2 / (period + 1);
  const result: (number | null)[] = new Array(bars.length).fill(null);
  if (bars.length < period) return result;
  let sum = 0;
  for (let i = 0; i < period; i++) sum += bars[i].close;
  let ema = sum / period;
  result[period - 1] = ema;
  for (let i = period; i < bars.length; i++) {
    ema = bars[i].close * k + ema * (1 - k);
    result[i] = ema;
  }
  return result;
}

export function calculateBollinger(bars: OHLCBar[], period = 20, mult = 2) {
  const upper: (number | null)[] = [];
  const lower: (number | null)[] = [];
  const mid = calculateSMA(bars, period);

  for (let i = 0; i < bars.length; i++) {
    const m = mid[i];
    if (m === null) {
      upper.push(null);
      lower.push(null);
      continue;
    }
    let variance = 0;
    for (let j = i - period + 1; j <= i; j++) {
      const diff = bars[j].close - m;
      variance += diff * diff;
    }
    const std = Math.sqrt(variance / period);
    upper.push(m + mult * std);
    lower.push(m - mult * std);
  }
  return { upper, mid, lower };
}

export function calculateRSI(bars: OHLCBar[], period = 14): (number | null)[] {
  const result: (number | null)[] = new Array(bars.length).fill(null);
  if (bars.length <= period) return result;

  let gains = 0;
  let losses = 0;
  for (let i = 1; i <= period; i++) {
    const diff = bars[i].close - bars[i - 1].close;
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }
  let avgGain = gains / period;
  let avgLoss = losses / period;
  result[period] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);

  for (let i = period + 1; i < bars.length; i++) {
    const diff = bars[i].close - bars[i - 1].close;
    const gain = diff > 0 ? diff : 0;
    const loss = diff < 0 ? -diff : 0;
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
    result[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
  }
  return result;
}

export function computeTechnicalGauge(bars: OHLCBar[]) {
  if (bars.length < 55) {
    return { buy: 9, neutral: 6, sell: 3, label: 'Buy' as const, score: 0.68 };
  }
  const last = bars[bars.length - 1].close;
  const sma20 = calculateSMA(bars, 20)[bars.length - 1] ?? last;
  const ema50 = calculateEMA(bars, 50)[bars.length - 1] ?? last;
  const sma10 = calculateSMA(bars, 10)[bars.length - 1] ?? last;
  const rsiArr = calculateRSI(bars, 14);
  const rsi = rsiArr[rsiArr.length - 1] ?? 50;

  let buy = 0;
  let sell = 0;
  let neutral = 0;

  const checks = [
    last > sma10 ? 1 : -1,
    last > sma20 ? 1 : -1,
    last > ema50 ? 1 : -1,
    sma10 > sma20 ? 1 : -1,
    sma20 > ema50 ? 1 : -1,
    rsi > 55 && rsi < 75 ? 1 : rsi < 45 && rsi > 25 ? -1 : 0,
    bars[bars.length - 1].close > bars[bars.length - 1].open ? 1 : -1,
    bars[bars.length - 1].close > bars[bars.length - 5].close ? 1 : -1,
    bars[bars.length - 1].close > bars[bars.length - 12].close ? 1 : -1,
  ];

  checks.forEach((v) => {
    if (v > 0) buy += 2;
    else if (v < 0) sell += 2;
    else neutral += 2;
  });
  neutral += 4;

  const total = buy + sell + neutral;
  const ratio = (buy - sell) / total;
  let label: 'Strong Sell' | 'Sell' | 'Neutral' | 'Buy' | 'Strong Buy' = 'Neutral';
  if (ratio > 0.35) label = 'Strong Buy';
  else if (ratio > 0.1) label = 'Buy';
  else if (ratio < -0.35) label = 'Strong Sell';
  else if (ratio < -0.1) label = 'Sell';

  const score = Math.max(0.08, Math.min(0.92, 0.5 + ratio * 0.6));
  return { buy, neutral, sell, label, score };
}

export function formatPrice(price: number, decimals = 2): string {
  return price.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
