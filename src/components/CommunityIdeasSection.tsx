import React, { useMemo, useState } from 'react';
import { ArrowUpRight, Bookmark, MessageSquare, ThumbsUp } from 'lucide-react';
import { CommunityIdea } from '../types/market';

interface CommunityIdeasSectionProps {
  ideas: CommunityIdea[];
  onOpenIdeaSymbol: (ticker: string) => void;
}

type IdeaFilter = 'All' | 'Crypto' | 'Stocks' | 'Forex' | 'Indices';

const IdeaChartPreview: React.FC<{ pattern: CommunityIdea['chartPattern']; direction: string }> = ({
  pattern,
  direction,
}) => {
  const accent = direction === 'Short' ? '#f23645' : '#089981';

  const candleSets: Record<CommunityIdea['chartPattern'], { o: number; c: number; h: number; l: number }[]> = {
    breakout: [
      { o: 68, c: 58, h: 72, l: 54 },
      { o: 58, c: 63, h: 66, l: 55 },
      { o: 63, c: 54, h: 65, l: 50 },
      { o: 54, c: 57, h: 60, l: 51 },
      { o: 57, c: 49, h: 59, l: 47 },
      { o: 49, c: 52, h: 55, l: 46 },
      { o: 52, c: 44, h: 53, l: 42 },
      { o: 44, c: 34, h: 45, l: 30 },
      { o: 34, c: 22, h: 36, l: 19 },
    ],
    channel: [
      { o: 76, c: 68, h: 79, l: 65 },
      { o: 68, c: 60, h: 70, l: 58 },
      { o: 60, c: 64, h: 67, l: 57 },
      { o: 64, c: 52, h: 66, l: 49 },
      { o: 52, c: 45, h: 54, l: 43 },
      { o: 45, c: 49, h: 52, l: 42 },
      { o: 49, c: 36, h: 50, l: 34 },
      { o: 36, c: 29, h: 38, l: 27 },
      { o: 29, c: 21, h: 31, l: 18 },
    ],
    reversal: [
      { o: 28, c: 42, h: 45, l: 25 },
      { o: 42, c: 56, h: 58, l: 39 },
      { o: 56, c: 68, h: 72, l: 54 },
      { o: 68, c: 62, h: 71, l: 60 },
      { o: 62, c: 71, h: 75, l: 60 },
      { o: 71, c: 58, h: 73, l: 55 },
      { o: 58, c: 46, h: 60, l: 44 },
      { o: 46, c: 35, h: 48, l: 33 },
      { o: 35, c: 24, h: 37, l: 21 },
    ],
    pullback: [
      { o: 74, c: 62, h: 76, l: 60 },
      { o: 62, c: 48, h: 64, l: 45 },
      { o: 48, c: 38, h: 50, l: 35 },
      { o: 38, c: 46, h: 48, l: 36 },
      { o: 46, c: 53, h: 56, l: 44 },
      { o: 53, c: 44, h: 55, l: 42 },
      { o: 44, c: 33, h: 46, l: 31 },
      { o: 33, c: 25, h: 35, l: 23 },
      { o: 25, c: 17, h: 27, l: 15 },
    ],
  };

  const candles = candleSets[pattern];

  return (
    <svg
      viewBox="0 0 280 96"
      className="w-full h-36 bg-[#0d1017] border-b border-[#2a2e39]"
      aria-hidden="true"
    >
      {/* Grid */}
      <line x1="0" y1="24" x2="280" y2="24" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      <line x1="0" y1="48" x2="280" y2="48" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      <line x1="0" y1="72" x2="280" y2="72" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

      {/* Target Zone Box */}
      <rect x="195" y="10" width="76" height="22" fill="rgba(8, 153, 129, 0.14)" stroke="rgba(8, 153, 129, 0.4)" strokeWidth="0.75" />

      {/* Trendline */}
      <line
        x1="22"
        y1="72"
        x2="258"
        y2="20"
        stroke="#2962ff"
        strokeWidth="1.5"
        strokeDasharray="4 3"
      />

      {/* Candlesticks */}
      {candles.map((c, idx) => {
        const x = 24 + idx * 28;
        const up = c.c < c.o; // lower y is higher price
        const color = up ? '#089981' : '#f23645';
        const top = Math.min(c.o, c.c);
        const h = Math.max(3, Math.abs(c.c - c.o));
        return (
          <g key={idx}>
            <line x1={x} y1={c.h} x2={x} y2={c.l} stroke={color} strokeWidth="1.2" />
            <rect x={x - 5} y={top} width="10" height={h} fill={color} rx="1" />
          </g>
        );
      })}

      {/* Projection Arrow */}
      <path
        d="M 248 22 L 266 15"
        stroke={accent}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const CommunityIdeasSection: React.FC<CommunityIdeasSectionProps> = ({
  ideas,
  onOpenIdeaSymbol,
}) => {
  const [filter, setFilter] = useState<IdeaFilter>('All');
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});

  const visibleIdeas = useMemo(() => {
    if (filter === 'All') return ideas;
    return ideas.filter((i) => i.category === filter);
  }, [ideas, filter]);

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section
      id="community-section"
      className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-white/10"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Community ideas
          </h2>
          <p className="text-sm text-[#787b86] mt-1">
            Technical setups, chart scripts, and market research published by active traders.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-[#131722] border border-[#2a2e39] rounded-lg overflow-x-auto">
          {(['All', 'Crypto', 'Stocks', 'Forex', 'Indices'] as IdeaFilter[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                filter === tab
                  ? 'bg-[#2962ff] text-white'
                  : 'text-[#b2b5be] hover:text-white hover:bg-[#1e222d]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {visibleIdeas.map((idea) => {
          const isLiked = !!likedIds[idea.id];
          const isSaved = !!savedIds[idea.id];
          const likeCount = idea.likes + (isLiked ? 1 : 0);

          return (
            <article
              key={idea.id}
              onClick={() => onOpenIdeaSymbol(idea.symbol)}
              className="bg-[#131722] border border-[#2a2e39] hover:border-[#434651] rounded-xl overflow-hidden flex flex-col justify-between transition-colors cursor-pointer group"
            >
              <div>
                <IdeaChartPreview pattern={idea.chartPattern} direction={idea.direction} />

                <div className="p-4">
                  {/* Unboxed quiet metadata */}
                  <div className="flex items-center gap-1.5 text-xs text-[#787b86]">
                    <span className="font-mono font-semibold text-[#d1d4dc]">{idea.symbol}</span>
                    <span aria-hidden="true">·</span>
                    <span>{idea.timeframe}</span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={
                        idea.direction === 'Long' ? 'text-[#089981] font-medium' : 'text-[#f23645] font-medium'
                      }
                    >
                      {idea.direction}
                    </span>
                  </div>

                  <h3 className="font-display text-base font-bold text-white mt-2 group-hover:text-[#2962ff] transition-colors line-clamp-2">
                    {idea.title}
                  </h3>

                  <p className="text-xs text-[#b2b5be] leading-relaxed mt-2 line-clamp-3">
                    {idea.summary}
                  </p>

                  <div className="mt-3 pt-3 border-t border-[#1e222d] flex items-center justify-between text-xs font-mono tabular-nums text-[#787b86]">
                    <span>Entry {idea.entryPrice}</span>
                    <span className="text-[#089981]">Target {idea.targetPrice}</span>
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 bg-[#0e1118] border-t border-[#2a2e39] flex items-center justify-between gap-2">
                <div className="text-xs text-[#787b86] truncate">
                  <span className="text-[#d1d4dc] font-medium">@{idea.author}</span>
                  <span aria-hidden="true"> · </span>
                  <span>{idea.publishedAgo}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => toggleLike(idea.id, e)}
                    aria-label="Like idea"
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
                      isLiked ? 'text-[#2962ff] bg-[#2962ff]/15' : 'text-[#787b86] hover:text-white'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span className="font-mono tabular-nums">{likeCount}</span>
                  </button>

                  <span className="inline-flex items-center gap-1 text-xs text-[#787b86] font-mono tabular-nums">
                    <MessageSquare className="w-3.5 h-3.5" />
                    {idea.comments}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => toggleSave(idea.id, e)}
                    aria-label="Bookmark idea"
                    className={`p-1 rounded transition-colors cursor-pointer ${
                      isSaved ? 'text-[#f59e0b]' : 'text-[#787b86] hover:text-white'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                  </button>

                  <ArrowUpRight className="w-3.5 h-3.5 text-[#787b86] group-hover:text-white transition-colors" />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
