import React from 'react';
import {
  Eye,
  Users,
  Clock,
  DollarSign,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  AlertCircle,
  Play,
  Flame,
  Zap,
  Target,
  BarChart2,
  Calendar,
  Layers,
} from 'lucide-react';
import { ChannelProfile, PageId } from '../../types';

interface DashboardPageProps {
  channel: ChannelProfile;
  onNavigate: (page: PageId) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ channel, onNavigate }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Demo Mode Notice Banner */}
      <div className="rounded-2xl p-4 bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-blue-950/40 border border-purple-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                Connected Channel:
              </span>
              <span className="text-sm font-semibold text-white">{channel.name}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                DEMO DATA
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live algorithmic simulation active. All metrics, retention curves, and AI models are functional.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={() => onNavigate('settings')}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-purple-500 text-slate-300 hover:text-white transition-colors"
          >
            Switch Channel
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
        {/* Total Views */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-purple-500/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Views (28d)
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-colors">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {channel.totalViewsDisplay}
            </span>
            <span className="flex items-center text-xs font-bold text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              +24.8%
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2.5">
            <span>Avg CTR: <strong className="text-slate-200">{channel.avgCtr}%</strong></span>
            <span className="text-purple-400 font-medium">Top 8% in niche</span>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Subscribers */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-blue-500/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Subscribers
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {channel.subscribersDisplay}
            </span>
            <span className="flex items-center text-xs font-bold text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              +{channel.subscriberGrowthRate}%
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2.5">
            <span>Velocity: <strong className="text-slate-200">+3,400 / mo</strong></span>
            <span className="text-blue-400 font-medium">High momentum</span>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Watch Time */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-cyan-500/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Watch Time
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {channel.watchTimeDisplay}
            </span>
            <span className="flex items-center text-xs font-bold text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              +19.2%
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2.5">
            <span>Avg Duration: <strong className="text-slate-200">{channel.avgAvd}</strong></span>
            <span className="text-cyan-400 font-medium">Top Tier</span>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Channel Health / Est Revenue */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-emerald-500/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Est. Monthly Revenue
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {channel.estimatedRevenue}
            </span>
            <span className="flex items-center text-xs font-bold text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              +31.4%
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2.5">
            <span>RPM: <strong className="text-slate-200">$5.95</strong></span>
            <span className="text-emerald-400 font-medium">Score: {channel.performanceScore}/100</span>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        </div>
      </div>

      {/* Main Grid: Performance Velocity Chart & AI Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: 30-Day Views & Retention Velocity */}
        <div className="lg:col-span-2 glass-panel p-5 sm:p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">Daily View Velocity & Surge Points</h3>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Last 28 Days
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Algorithmic momentum tracked across YouTube Search, Suggested, and Browse Feeds.
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

            {/* Custom SVG Velocity Chart */}
            <div className="mt-6 relative">
              <div className="h-56 w-full flex items-end gap-2 sm:gap-4 pt-6 pb-2">
                {channel.history.map((pt, idx) => {
                  const maxViews = Math.max(...channel.history.map((h) => h.views));
                  const heightPercent = Math.round((pt.views / maxViews) * 80) + 15;
                  const isPeak = pt.views === maxViews;

                  return (
                    <div
                      key={pt.date}
                      className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                    >
                      {/* Tooltip on hover */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mb-2 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-[11px] text-white whitespace-nowrap shadow-xl pointer-events-none z-10">
                        <span className="font-semibold">{pt.views.toLocaleString()}</span> views
                        <div className="text-[10px] text-purple-400">{pt.subscribers.toLocaleString()} subs</div>
                      </div>

                      {/* Bar with gradient */}
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

                      {/* Date label */}
                      <span className="text-[11px] text-slate-400 mt-2 font-medium">
                        {pt.date}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 border-t border-slate-800/80 pt-4 mt-2">
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Top Source</span>
              <p className="text-xs sm:text-sm font-bold text-slate-200 mt-0.5">
                {channel.trafficSources[0]?.source} ({channel.trafficSources[0]?.percentage}%)
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">30s Hook Retention</span>
              <p className="text-xs sm:text-sm font-bold text-emerald-400 mt-0.5">
                76% (High Grade)
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Algorithmic Reach</span>
              <p className="text-xs sm:text-sm font-bold text-purple-400 mt-0.5">
                Surging (+34%)
              </p>
            </div>
          </div>
        </div>

        {/* Right: AI Growth Recommendations Ticker */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-500 text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">AI Recommendations</h3>
              </div>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                4 High Impact
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {channel.recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-bold text-slate-100 group-hover:text-purple-300 transition-colors">
                      {rec.title}
                    </span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/20 whitespace-nowrap">
                      {rec.metricChangeEstimate}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {rec.description}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-800/60">
                    <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                      <Target className="w-3 h-3 text-cyan-400" />
                      {rec.impact}
                    </span>
                    <button
                      onClick={() => rec.targetPage && onNavigate(rec.targetPage)}
                      className="text-[11px] font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
                    >
                      <span>{rec.actionLabel}</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Videos Performance Section */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-slate-800/80">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Play className="w-4 h-4 text-purple-400 fill-purple-400" />
              Recent Video Performance & Ranking
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparative analysis of your last uploads vs channel 10-video baseline.
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
              Full Video Library
            </button>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <th className="pb-3 font-semibold">Video Details</th>
                <th className="pb-3 font-semibold text-center">Rank</th>
                <th className="pb-3 font-semibold">Views (Delta)</th>
                <th className="pb-3 font-semibold">Impressions CTR</th>
                <th className="pb-3 font-semibold">Retention</th>
                <th className="pb-3 font-semibold">Engagement</th>
                <th className="pb-3 font-semibold text-right">Optimization</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {channel.recentVideos.map((video) => (
                <tr
                  key={video.id}
                  className="hover:bg-slate-800/30 transition-colors group"
                >
                  {/* Thumbnail & Title */}
                  <td className="py-3.5 pr-4 max-w-xs sm:max-w-md">
                    <div className="flex items-center gap-3">
                      <div className="relative w-20 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-slate-700 group-hover:border-purple-500 transition-colors">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-1 right-1 text-[9px] font-mono px-1 rounded bg-black/80 text-white font-medium">
                          {video.duration}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-200 group-hover:text-purple-300 transition-colors line-clamp-2 leading-snug">
                          {video.title}
                        </p>
                        <span className="text-[10px] text-slate-400 mt-0.5 block">
                          Published {video.publishedDaysAgo} days ago
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Rank */}
                  <td className="py-3.5 px-2 text-center">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-lg font-bold text-xs ${
                        video.rank === 1
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : video.rank <= 3
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      #{video.rank}
                    </span>
                  </td>

                  {/* Views & Delta */}
                  <td className="py-3.5 px-2">
                    <span className="font-bold text-white block text-sm">
                      {video.views.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-400 flex items-center">
                      <ArrowUpRight className="w-3 h-3" />
                      +{video.viewsDeltaPercent}%
                    </span>
                  </td>

                  {/* Impressions CTR */}
                  <td className="py-3.5 px-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200">{video.ctr}%</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                          video.ctr >= 11
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : video.ctr >= 9
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {video.ctr >= 11 ? 'Great' : video.ctr >= 9 ? 'Good' : 'Avg'}
                      </span>
                    </div>
                  </td>

                  {/* Retention Rate */}
                  <td className="py-3.5 px-2">
                    <div className="w-24">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-semibold text-slate-300">{video.retentionRate}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full rounded-full"
                          style={{ width: `${video.retentionRate}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Engagement */}
                  <td className="py-3.5 px-2 text-slate-400">
                    <div>{video.likes.toLocaleString()} likes</div>
                    <div className="text-[10px] text-slate-400">{video.comments.toLocaleString()} comments</div>
                  </td>

                  {/* Action */}
                  <td className="py-3.5 pl-2 text-right">
                    <button
                      onClick={() => onNavigate('title-generator')}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-purple-600 text-slate-300 hover:text-white transition-colors text-[11px] font-semibold"
                    >
                      Optimize
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trending Video Ideas Radar */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">Trending Video Ideas For Your Niche</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              High search demand with low competitor saturation detected in the algorithm this week.
            </p>
          </div>

          <button
            onClick={() => onNavigate('video-research')}
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
          >
            <span>Explore All Topics</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {channel.trendingIdeas.map((idea) => (
            <div
              key={idea.id}
              className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/90 hover:border-purple-500/40 transition-all duration-200 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
                    {idea.niche}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-emerald-400">
                      Velocity {idea.velocityScore}/100
                    </span>
                  </div>
                </div>

                <h4 className="font-bold text-sm text-slate-100 group-hover:text-purple-300 transition-colors leading-snug">
                  {idea.title}
                </h4>

                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  <strong className="text-slate-300">Hook Angle:</strong> {idea.hookAngle}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div className="text-[11px] text-slate-400">
                  Est. Reach: <strong className="text-slate-200">{idea.potentialViews}</strong>
                </div>

                <button
                  onClick={() => onNavigate('title-generator')}
                  className="px-3 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-sm transition-all"
                >
                  Generate Script & Titles
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
