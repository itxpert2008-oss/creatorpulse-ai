
import React from 'react';
import {
  BarChart3,
  Clock,
  Eye,
  Users,
  TrendingUp,
  Globe,
  Radio,
  Info,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { ChannelProfile, PageId } from '../../types';

interface ChannelAnalyticsPageProps {
  channel: ChannelProfile;
  onNavigate: (page: PageId) => void;
}

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}m ${secs}s`;
};

const formatNumber = (value: number) => value.toLocaleString();

export const ChannelAnalyticsPage: React.FC<ChannelAnalyticsPageProps> = ({
  channel,
}) => {
  const analytics = channel.analytics;
  const isYouTubeChannel = channel.dataSource === 'youtube';

  const hasAnalytics = isYouTubeChannel && !!analytics;

  const netSubscribers = analytics
    ? analytics.subscribersGained - analytics.subscribersLost
    : 0;

  const cards = [
    {
      label: 'Views',
      value: hasAnalytics ? formatNumber(analytics.views) : 'Unavailable',
      description: 'Total views in the last 28 days',
      icon: Eye,
      color: 'purple',
    },
    {
      label: 'Watch Time',
      value: hasAnalytics
        ? `${(analytics.estimatedMinutesWatched / 60).toFixed(1)} hrs`
        : 'Unavailable',
      description: 'Estimated hours watched in 28 days',
      icon: Clock,
      color: 'blue',
    },
    {
      label: 'Average View Duration',
      value: hasAnalytics
        ? formatDuration(analytics.averageViewDurationSeconds)
        : 'Unavailable',
      description: 'Average time viewers watched',
      icon: TrendingUp,
      color: 'cyan',
    },
    {
      label: 'Subscribers Gained',
      value: hasAnalytics
        ? `+${formatNumber(analytics.subscribersGained)}`
        : 'Unavailable',
      description: hasAnalytics
        ? `${formatNumber(analytics.subscribersLost)} lost during this period`
        : 'Subscriber changes are unavailable',
      icon: Users,
      color: 'emerald',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* Analytics Header */}
      <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <span>Channel Performance Analytics</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Channel Growth & Analytics
            </h2>

            <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
              Genuine YouTube performance data for {channel.name}.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
            <CheckCircle2 className={`w-4 h-4 ${hasAnalytics ? 'text-green-400' : 'text-slate-500'}`} />
            <span className="text-xs font-semibold text-slate-300">
              {hasAnalytics ? 'Last 28 Days' : 'No Live Analytics'}
            </span>
          </div>
        </div>

        {hasAnalytics && (
          <div className="mt-4 flex items-center gap-2 text-[11px] text-green-300">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Connected to YouTube Analytics API</span>
          </div>
        )}
      </div>

      {/* Data Availability Notice */}
      {!hasAnalytics && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-300">
              Live analytics unavailable
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Select your connected YouTube channel or check your connection in Settings.
            </p>
          </div>
        </div>
      )}

      {/* Real Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="p-4 rounded-2xl bg-gradient-to-b from-[#0e1428] to-slate-950 border border-slate-800"
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{card.label}</span>
                <Icon className="w-4 h-4 text-purple-400" />
              </div>

              <div className="text-2xl font-extrabold text-white mt-3">
                {card.value}
              </div>

              <p className="text-[11px] text-slate-400 mt-2">
                {card.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Subscriber Summary */}
      <div className="glass-panel p-6 rounded-2xl">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-purple-400" />
          <h3 className="text-base font-bold text-white">
            Subscriber Performance
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <p className="text-xs text-slate-400">Current Subscribers</p>
            <p className="text-xl font-bold text-white mt-2">
              {channel.subscribersDisplay}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <p className="text-xs text-slate-400">Subscribers Gained</p>
            <p className="text-xl font-bold text-green-400 mt-2">
              {hasAnalytics ? `+${formatNumber(analytics.subscribersGained)}` : 'Unavailable'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <p className="text-xs text-slate-400">Net Subscriber Change</p>
            <p className={`text-xl font-bold mt-2 ${
              netSubscribers >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {hasAnalytics
                ? `${netSubscribers > 0 ? '+' : ''}${formatNumber(netSubscribers)}`
                : 'Unavailable'}
            </p>
          </div>
        </div>
      </div>

      {/* Unsupported Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Retention */}
        <div className="glass-panel p-6 rounded-2xl">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Clock className="w-4 h-4 text-purple-400" />
            <h3 className="text-base font-bold text-white">
              Audience Retention
            </h3>
          </div>

          <div className="py-8 text-center">
            <Info className="w-8 h-8 text-slate-500 mx-auto mb-3" />

            <p className="text-sm font-semibold text-slate-300">
              Detailed retention data unavailable
            </p>

            <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
              This dashboard does not currently retrieve video-level audience retention curves or 30-second hook retention.
            </p>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="glass-panel p-6 rounded-2xl">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Radio className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold text-white">
              Traffic Sources
            </h3>
          </div>

          <div className="py-8 text-center">
            <Info className="w-8 h-8 text-slate-500 mx-auto mb-3" />

            <p className="text-sm font-semibold text-slate-300">
              Traffic breakdown not connected yet
            </p>

            <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
              Search, suggested videos, browse features and external traffic percentages will appear when the backend retrieves those reports.
            </p>
          </div>
        </div>

        {/* Geography */}
        <div className="glass-panel p-6 rounded-2xl lg:col-span-2">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Globe className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold text-white">
              Audience Geography
            </h3>
          </div>

          <div className="py-8 text-center">
            <Info className="w-8 h-8 text-slate-500 mx-auto mb-3" />

            <p className="text-sm font-semibold text-slate-300">
              Geographic audience reports unavailable
            </p>

            <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
              Country breakdowns, returning viewers, new viewers and revenue per mille (RPM) are not currently retrieved by this dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* Data Transparency */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
        <Info className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />

        <div>
          <p className="text-xs font-semibold text-slate-300">
            About your analytics
          </p>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
            Figures shown above come from the connected YouTube channel and its available 28-day Analytics API report. Some YouTube reports require additional API queries and are not yet implemented. CreatorPulse AI does not invent missing performance figures.
          </p>
        </div>
      </div>
    </div>
  );
};
