import React, { useState } from 'react';
import { ArrowUpRight, Calendar, Newspaper, ShieldCheck, Star } from 'lucide-react';
import { BrokerPartner, EconomicEvent, TopStory } from '../types/market';

interface NewsAndCalendarSectionProps {
  stories: TopStory[];
  events: EconomicEvent[];
  brokers: BrokerPartner[];
  onOpenTicker: (ticker: string) => void;
  onLaunchSupercharts: () => void;
}

export const NewsAndCalendarSection: React.FC<NewsAndCalendarSectionProps> = ({
  stories,
  events,
  brokers,
  onOpenTicker,
  onLaunchSupercharts,
}) => {
  const [selectedStoryId, setSelectedStoryId] = useState<string>(stories[0]?.id ?? '');
  const [imgFallback, setImgFallback] = useState(false);

  return (
    <>
      {/* Products & Global Community Proof Horizon Banner */}
      <section id="products-section" className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-white/10">
        <div className="relative rounded-2xl overflow-hidden border border-[#2a2e39] bg-[#0c0f17]">
          {!imgFallback ? (
            <img
              src="/src/assets/images/feature_horizon_summit_1795659005237.jpg"
              alt="Alpine twilight horizon representing global market foresight"
              referrerPolicy="no-referrer"
              onError={() => setImgFallback(true)}
              className="absolute inset-0 w-full h-full object-cover opacity-55"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#0d1526] via-[#0b0e14] to-[#131722]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#000000]/90 via-[#000000]/75 to-[#000000]/45" />

          <div className="relative z-10 p-8 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight text-balance">
                Where the world charts, chats and trades markets
              </h2>
              <p className="text-base text-[#d1d4dc] mt-4 max-w-2xl leading-relaxed">
                Analyze global equities, crypto pairs, futures, and FX on institutional-grade HTML5 Supercharts, test strategies in Pine Script, and route orders directly through verified brokers.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={onLaunchSupercharts}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#2962ff] hover:bg-[#1e53e5] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Launch Supercharts
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Adjacent Proof Metrics */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-[#0e1118]/85 border border-white/10 backdrop-blur-sm">
                <div className="font-mono tabular-nums text-2xl sm:text-3xl font-bold text-white">
                  90M+
                </div>
                <div className="text-xs text-[#b2b5be] mt-1">
                  Traders and investors worldwide
                </div>
              </div>
              <div className="p-5 rounded-xl bg-[#0e1118]/85 border border-white/10 backdrop-blur-sm">
                <div className="font-mono tabular-nums text-2xl sm:text-3xl font-bold text-white">
                  150+
                </div>
                <div className="text-xs text-[#b2b5be] mt-1">
                  Global exchanges connected
                </div>
              </div>
              <div className="p-5 rounded-xl bg-[#0e1118]/85 border border-white/10 backdrop-blur-sm">
                <div className="font-mono tabular-nums text-2xl sm:text-3xl font-bold text-white">
                  100K+
                </div>
                <div className="text-xs text-[#b2b5be] mt-1">
                  Community-built indicators
                </div>
              </div>
              <div className="p-5 rounded-xl bg-[#0e1118]/85 border border-white/10 backdrop-blur-sm">
                <div className="font-mono tabular-nums text-2xl sm:text-3xl font-bold text-white">
                  4.9 / 5
                </div>
                <div className="text-xs text-[#b2b5be] mt-1">
                  Mobile & desktop app rating
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Stories & Economic Calendar */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Top Stories */}
          <div className="lg:col-span-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-[#2962ff]" />
                <h2 className="font-display text-2xl font-bold text-white tracking-tight">
                  Top stories
                </h2>
              </div>
              <span className="text-xs text-[#787b86]">Global market brief</span>
            </div>

            <div className="bg-[#131722] border border-[#2a2e39] rounded-xl divide-y divide-[#1e222d]">
              {stories.map((story) => {
                const expanded = selectedStoryId === story.id;
                return (
                  <div
                    key={story.id}
                    onClick={() => setSelectedStoryId(story.id)}
                    className={`p-4 transition-colors cursor-pointer ${
                      expanded ? 'bg-[#1e222d]/70' : 'hover:bg-[#1e222d]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-xs text-[#787b86]">
                      <div>
                        <span>{story.source}</span>
                        <span aria-hidden="true"> · </span>
                        <span>{story.publishedAgo}</span>
                        <span aria-hidden="true"> · </span>
                        <span>{story.category}</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenTicker(story.relatedTicker);
                        }}
                        className="font-mono font-semibold text-[#2962ff] hover:underline cursor-pointer"
                      >
                        {story.relatedTicker}
                      </button>
                    </div>
                    <h3 className="text-sm font-semibold text-white mt-1.5 leading-snug">
                      {story.headline}
                    </h3>
                    {expanded && (
                      <p className="text-xs text-[#b2b5be] mt-2 leading-relaxed">
                        {story.summary}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Economic Calendar */}
          <div className="lg:col-span-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#2962ff]" />
                <h2 className="font-display text-2xl font-bold text-white tracking-tight">
                  Economic calendar
                </h2>
              </div>
              <span className="text-xs text-[#787b86]">Key macro releases</span>
            </div>

            <div className="bg-[#131722] border border-[#2a2e39] rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#2a2e39] text-xs font-medium text-[#787b86] bg-[#0e1118]">
                      <th className="py-3 px-4 whitespace-nowrap">Time</th>
                      <th className="py-3 px-4 whitespace-nowrap">Event</th>
                      <th className="py-3 px-4 whitespace-nowrap">Impact</th>
                      <th className="py-3 px-4 text-right whitespace-nowrap">Actual</th>
                      <th className="py-3 px-4 text-right whitespace-nowrap">Forecast</th>
                      <th className="py-3 px-4 text-right whitespace-nowrap">Prior</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e222d] text-xs">
                    {events.map((ev) => (
                      <tr key={ev.id} className="hover:bg-[#1e222d]/50 transition-colors">
                        <td className="py-3 px-4 font-mono tabular-nums text-[#787b86] whitespace-nowrap">
                          {ev.time}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-white">{ev.event}</div>
                          <div className="text-[11px] text-[#787b86]">
                            {ev.country} · {ev.currency}
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`font-semibold ${
                              ev.impact === 'High'
                                ? 'text-[#f23645]'
                                : ev.impact === 'Medium'
                                ? 'text-[#f59e0b]'
                                : 'text-[#787b86]'
                            }`}
                          >
                            {ev.impact}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-white whitespace-nowrap">
                          {ev.actual}
                        </td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums text-[#b2b5be] whitespace-nowrap">
                          {ev.forecast}
                        </td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums text-[#787b86] whitespace-nowrap">
                          {ev.previous}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Brokers Strip */}
      <section id="brokers-section" className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Trade directly on Supercharts
            </h2>
            <p className="text-sm text-[#787b86] mt-1">
              Verified multi-asset brokers integrated for direct chart execution and paper trading.
            </p>
          </div>
          <button
            type="button"
            onClick={onLaunchSupercharts}
            className="text-sm font-semibold text-[#2962ff] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
          >
            Try paper trading in Supercharts →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {brokers.map((broker) => (
            <div
              key={broker.id}
              onClick={onLaunchSupercharts}
              className="p-5 bg-[#131722] border border-[#2a2e39] hover:border-[#2962ff] rounded-xl transition-colors cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-[#2962ff]">{broker.badge}</span>
                  <ShieldCheck className="w-4 h-4 text-[#089981]" />
                </div>
                <h3 className="font-display text-lg font-bold text-white mt-2">
                  {broker.name}
                </h3>
                <p className="text-xs text-[#787b86] mt-1">{broker.assets}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#1e222d] flex items-center justify-between text-xs font-mono tabular-nums">
                <span className="inline-flex items-center gap-1 text-white font-semibold">
                  <Star className="w-3.5 h-3.5 text-[#f59e0b] fill-[#f59e0b]" />
                  {broker.rating}
                </span>
                <span className="text-[#787b86]">{broker.reviews}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};
