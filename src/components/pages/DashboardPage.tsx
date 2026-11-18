
import React from 'react';
import {
  Eye,
  Users,
  Clock,
  DollarSign,
  Sparkles,
  ArrowUpRight,
  Play,
  Flame,
  Target,
} from 'lucide-react';
import { ChannelProfile, PageId } from '../../types';

interface DashboardPageProps {
  channel: ChannelProfile;
  onNavigate: (page: PageId) => void;
}

const formatNumber = (value: number) =>
  new Intl.NumberFormat('en-US').format(value || 0);

const formatDate = (date: string) => {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

export const DashboardPage: React.FC<DashboardPageProps> = ({
  channel,
  onNavigate,
}) => {
  const isYouTube = channel.dataSource === 'youtube';

  const analyticsViews = channel.analytics?.views ?? 0;
  const watchMinutes = channel.analytics?.estimatedMinutesWatched ?? 0;
  const subscribersGained = channel.analytics?.subscribersGained ?? 0;
  const subscribersLost = channel.analytics?.subscribersLost ?? 0;

  const averageDuration =
    channel.analytics?.averageViewDurationSeconds ?? 0;

  const maxViews = Math.max(
    1,
    ...channel.history.map((point) => point.views)
  );

  const availableRecommendations = channel.recommendations || [];
  const availableIdeas = channel.trendingIdeas || [];
  const availableVideos = channel.recentVideos || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* Channel Connection Banner */}
      <div className="rounded-2xl p-4 bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-blue-950/40 border border-purple-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Sparkles className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                {isYouTube ? 'Connected YouTube Channel:' : 'Demo Channel:'}
              </span>

              <span className="text-sm font-semibold text-white">
                {channel.name}
              </span>

              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                isYouTube
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
              }`}>
                {isYouTube ? 'LIVE DATA' : 'DEMO DATA'}
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-0.5">
              {isYouTube
                ? 'Showing information retrieved from your connected YouTube channel.'
                : 'Demonstration data is being displayed. Connect YouTube to see your actual channel analytics.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={() => onNavigate('settings')}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-purple-500 text-slate-300 hover:text-white transition-colors"
          >
            Settings
          </button>

          <button
            onClick={() => onNavigate('title-generator')}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-900/40 transition-colors"
          >
            Launch AI Studio
          </button>
        </div>
      </div>

      {/* Top Core Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Views */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-purple-500/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {isYouTube ? 'Views (28 Days)' : 'Total Views'}
            </span>

            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Eye className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {isYouTube
                ? formatNumber(analyticsViews)
                : channel.totalViewsDisplay}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2.5">
            <span>
              {isYouTube ? 'YouTube Analytics report' : 'Channel views'}
            </span>

            <span className="text-purple-400 font-medium">
              {isYouTube ? '28-day period' : 'Demo metric'}
            </span>
          </div>

          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Subscribers */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-blue-500/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Subscribers
            </span>

            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {channel.subscribersDisplay}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2.5">
            <span>
              {isYouTube ? 'Net subscribers (28d)' : 'Monthly velocity'}
            </span>

            <strong className="text-blue-400 font-medium">
              {isYouTube
                ? `${subscribersGained - subscribersLost >= 0 ? '+' : ''}${formatNumber(subscribersGained - subscribersLost)}`
                : `+${channel.subscriberGrowthRate}%`}
            </strong>
          </div>

          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Watch Time */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-cyan-500/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Watch Time
            </span>

            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {isYouTube
                ? `${formatNumber(watchMinutes)} min`
                : channel.watchTimeDisplay}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2.5">
            <span>Avg. View Duration</span>

            <strong className="text-cyan-400 font-medium">
              {isYouTube
                ? `${averageDuration.toFixed(1)} sec`
                : channel.avgAvd}
            </strong>
          </div>

          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Revenue */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-emerald-500/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {isYouTube ? 'Estimated Revenue' : 'Demo Revenue'}
            </span>

            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {isYouTube ? 'Not available' : channel.estimatedRevenue}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2.5">
            <span>
              {isYouTube ? 'Revenue data not connected' : 'Demo performance score'}
            </span>

            <span className="text-emerald-400 font-medium">
              {isYouTube ? 'Unavailable' : `${channel.performanceScore}/100`}
            </span>
          </div>

          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Views Chart */}
        <div className="lg:col-span-2 glass-panel p-5 sm:p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">
                    Daily View Performance
                  </h3>

                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Last 28 Days
                  </span>
                </div>

                <p className="text-xs text-slate-400 mt-1">
                  {isYouTube
                    ? 'Daily views recorded by YouTube Analytics.'
                    : 'Demonstration view performance chart.'}
                </p>
              </div>

              <button
                onClick={() => onNavigate('channel-analytics')}
                className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
              >
                <span>Deep Dive</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-6 relative">
              {channel.history.length > 0 ? (
                <div className="h-56 w-full flex items-end gap-1 sm:gap-2 pt-6 pb-2">
                  {channel.history.map((point) => {
                    const heightPercent = Math.max(
                      3,
                      (point.views / maxViews) * 85
                    );

                    const isPeak =
                      point.views === maxViews && point.views > 0;

                    return (
                      <div
                        key={point.date}
                        className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer min-w-0"
                      >
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mb-2 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-[10px] text-white whitespace-nowrap shadow-xl pointer-events-none z-10">
                          <span className="font-semibold">
                            {formatNumber(point.views)}
                          </span>{' '}
                          views
                          <div className="text-purple-400">
                            {formatDate(point.date)}
                          </div>
                        </div>

                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full max-w-[42px] rounded-t-xl transition-all duration-300 relative ${
                            isPeak
                              ? 'bg-gradient-to-t from-purple-600 via-indigo-600 to-cyan-400 shadow-lg shadow-purple-900/60'
                              : 'bg-gradient-to-t from-slate-800 to-indigo-950/80 group-hover:from-purple-900 group-hover:to-indigo-600'
                          }`}
                        >
                          {isPeak && (
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 text-[9px] font-bold">
                              <Flame className="w-2.5 h-2.5" />
                              Peak
                            </div>
                          )}
                        </div>

                        <span className="text-[9px] sm:text-[10px] text-slate-400 mt-2 font-medium whitespace-nowrap">
                          {formatDate(point.date)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-56 flex flex-col items-center justify-center text-center border border-dashed border-slate-800 rounded-xl">
                  <Eye className="w-8 h-8 text-slate-600 mb-2" />
                  <p className="text-sm font-semibold text-slate-300">
                    No chart data available
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    YouTube Analytics data will appear here when available.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-800/80 pt-4 mt-2">
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">
                Top Traffic Source
              </span>

              <p className="text-xs sm:text-sm font-bold text-slate-200 mt-1">
                {channel.trafficSources[0]
                  ? `${channel.trafficSources[0].source} (${channel.trafficSources[0].percentage}%)`
                  : 'Not available'}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">
                Subscribers Gained
              </span>

              <p className="text-xs sm:text-sm font-bold text-emerald-400 mt-1">
                {isYouTube
                  ? `+${formatNumber(subscribersGained)}`
                  : 'Demo metric'}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">
                30s Hook Retention
              </span>

              <p className="text-xs sm:text-sm font-bold text-purple-400 mt-1">
                Not available
              </p>
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-500 text-white">
                <Sparkles className="w-4 h-4" />
              </div>

              <h3 className="text-base font-bold text-white">
                AI Recommendations
              </h3>
            </div>

            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {availableRecommendations.length} Suggestions
            </span>
          </div>

          <p className="text-[11px] text-slate-500 mt-2">
            AI-generated suggestions, not guaranteed performance results.
          </p>

          <div className="mt-4 space-y-3">
            {availableRecommendations.length > 0 ? (
              availableRecommendations.map((recommendation) => (
                <div
                  key={recommendation.id}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-bold text-slate-100 group-hover:text-purple-300 transition-colors">
                      {recommendation.title}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {recommendation.description}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-800/60">
                    <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                      <Target className="w-3 h-3 text-cyan-400" />
                      {recommendation.impact}
                    </span>

                    <button
                      onClick={() =>
                        recommendation.targetPage &&
                        onNavigate(recommendation.targetPage)
                      }
                      className="text-[11px] font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
                    >
                      <span>{recommendation.actionLabel}</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-5 text-center border border-dashed border-slate-800 rounded-xl">
                <Sparkles className="w-7 h-7 text-purple-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-300">
                  No recommendations yet
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Your AI suggestions will appear here when generated.
                </p>
                <button
                  onClick={() => onNavigate('title-generator')}
                  className="mt-3 text-xs font-semibold text-purple-400 hover:text-purple-300"
                >
                  Open AI Studio
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Video Performance */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-slate-800/80">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Play className="w-4 h-4 text-purple-400 fill-purple-400" />
              Recent Video Performance
            </h3>

            <p className="text-xs text-slate-400 mt-0.5">
              {isYouTube
                ? 'Per-video analytics are not yet connected.'
                : 'Demonstration video performance data.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('thumbnail-analyzer')}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white transition-colors"
            >
              Audit Thumbnails
            </button>

            <button
              onClick={() => onNavigate('channel-analytics')}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-purple-600/30 text-purple-300 border border-purple-500/40 hover:bg-purple-600/40 transition-colors"
            >
              Full Analytics
            </button>
          </div>
        </div>

        {availableVideos.length > 0 && !isYouTube ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                  <th className="pb-3 font-semibold">Video</th>
                  <th className="pb-3 font-semibold">Views</th>
                  <th className="pb-3 font-semibold">CTR</th>
                  <th className="pb-3 font-semibold">Retention</th>
                  <th className="pb-3 font-semibold">Engagement</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800/60">
                {availableVideos.map((video) => (
                  <tr key={video.id} className="hover:bg-slate-800/30">
                    <td className="py-3 pr-4 max-w-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-20 h-12 rounded-lg object-cover border border-slate-700"
                        />

                        <span className="font-semibold text-slate-200 line-clamp-2">
                          {video.title}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 font-bold text-white">
                      {formatNumber(video.views)}
                    </td>

                    <td className="py-3 text-slate-300">
                      {video.ctr}%
                    </td>

                    <td className="py-3 text-slate-300">
                      {video.retentionRate}%
                    </td>

                    <td className="py-3 text-slate-400">
                      {formatNumber(video.likes)} likes
                      <br />
                      {formatNumber(video.comments)} comments
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-4 p-8 text-center border border-dashed border-slate-800 rounded-xl">
            <Play className="w-8 h-8 text-slate-600 mx-auto mb-2" />

            <p className="text-sm font-semibold text-slate-300">
              {isYouTube
                ? 'Your video analytics are not connected yet'
                : 'No video data available'}
            </p>

            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              {isYouTube
                ? 'We will add a dedicated YouTube videos endpoint to retrieve views, likes, comments, CTR and retention where available.'
                : 'Video performance examples will appear here when available.'}
            </p>
          </div>
        )}
      </div>

      {/* Trending Video Ideas */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />

              <h3 className="text-base font-bold text-white">
                Video Ideas For Your Channel
              </h3>
            </div>

            <p className="text-xs text-slate-400 mt-0.5">
              AI-generated content ideas. Search demand and competition are not verified here.
            </p>
          </div>

          <button
            onClick={() => onNavigate('video-research')}
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
          >
            <span>Explore Topics</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableIdeas.length > 0 ? (
            availableIdeas.map((idea) => (
              <div
                key={idea.id}
                className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/90 hover:border-purple-500/40 transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
                      {idea.niche}
                    </span>

                    {!isYouTube && (
                      <span className="text-[11px] font-bold text-emerald-400">
                        Velocity {idea.velocityScore}/100
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-sm text-slate-100 group-hover:text-purple-300 transition-colors leading-snug">
                    {idea.title}
                  </h4>

                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    <strong className="text-slate-300">Hook Angle:</strong>{' '}
                    {idea.hookAngle}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="text-[11px] text-slate-400">
                    {isYouTube
                      ? 'AI suggestion'
                      : `Est. Reach: ${idea.potentialViews}`}
                  </div>

                  <button
                    onClick={() => onNavigate('title-generator')}
                    className="px-3 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-sm transition-all"
                  >
                    Generate Titles
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="md:col-span-2 p-8 text-center border border-dashed border-slate-800 rounded-xl">
              <Flame className="w-8 h-8 text-amber-400 mx-auto mb-2" />

              <p className="text-sm font-semibold text-slate-300">
                No video ideas yet
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Explore topics to discover ideas for your next upload.
              </p>

              <button
                onClick={() => onNavigate('video-research')}
                className="mt-3 text-xs font-semibold text-purple-400 hover:text-purple-300"
              >
                Explore Video Topics
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
