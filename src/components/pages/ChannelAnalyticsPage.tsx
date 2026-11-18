
import React, { useEffect, useState } from 'react';
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
  RefreshCw,
  MapPin,
} from 'lucide-react';
import { ChannelProfile, PageId } from '../../types';

interface ChannelAnalyticsPageProps {
  channel: ChannelProfile;
  onNavigate: (page: PageId) => void;
}

interface AnalyticsRow {
  day?: string;
  country?: string;
  insightTrafficSourceType?: string;
  views: number;
  estimatedMinutesWatched: number;
  averageViewDuration?: number;
  subscribersGained?: number;
  subscribersLost?: number;
}

interface AnalyticsReport {
  available?: boolean;
  columnHeaders?: Array<{
    name: string;
    columnType: string;
    dataType: string;
  }>;
  rows?: Array<Array<string | number>>;
}

interface AnalyticsResponse {
  columnHeaders?: Array<{
    name: string;
    columnType: string;
    dataType: string;
  }>;
  rows?: Array<Array<string | number>>;
  trafficSources?: AnalyticsReport;
  geography?: AnalyticsReport;
  startDate?: string;
  endDate?: string;
  note?: string;
}

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}m ${secs}s`;
};

const formatNumber = (value: number) =>
  value.toLocaleString();

const formatSourceName = (source: string) => {
  const names: Record<string, string> = {
    SHORTS: 'YouTube Shorts',
    YT_SEARCH: 'YouTube Search',
    YT_OTHER_PAGE: 'Other YouTube Pages',
    YT_CHANNEL: 'Channel Pages',
    SUBSCRIBER: 'Subscriber Notifications',
    NOTIFICATION: 'Notifications',
    RELATED_VIDEO: 'Suggested / Related Videos',
    EXT_URL: 'External Websites',
    PLAYLIST: 'Playlists',
    NO_LINK_OTHER: 'Other Sources',
    HASHTAGS: 'Hashtags',
    YT_PLAYLIST: 'Playlists',
    YT_PLAYLIST_PAGE: 'Playlist Pages',
    YT_HOME: 'YouTube Home',
    YT_BROWSE: 'Browse Features',
  };

  return names[source] || source.replace(/_/g, ' ').toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getCountryName = (code: string) => {
  try {
    const displayNames = new Intl.DisplayNames(['en'], {
      type: 'region',
    });

    return displayNames.of(code) || code;
  } catch {
    return code;
  }
};

const getPercentage = (value: number, total: number) => {
  if (!total) return 0;
  return (value / total) * 100;
};

const AnalyticsBar = ({
  label,
  value,
  total,
  color = 'bg-purple-500',
}: {
  label: string;
  value: number;
  total: number;
  color?: string;
}) => {
  const percentage = getPercentage(value, total);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-slate-300 truncate">
          {label}
        </span>

        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-xs font-semibold text-white">
            {formatNumber(value)}
          </span>

          <span className="text-[11px] text-slate-500 w-12 text-right">
            {percentage.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700`}
          style={{
            width: `${Math.min(percentage, 100)}%`,
          }}
        />
      </div>
    </div>
  );
};

export const ChannelAnalyticsPage: React.FC<
  ChannelAnalyticsPageProps
> = ({ channel }) => {
  const analytics = channel.analytics;
  const isYouTubeChannel = channel.dataSource === 'youtube';
  const hasAnalytics = isYouTubeChannel && !!analytics;

  const [report, setReport] = useState<AnalyticsResponse | null>(null);
  const [loadingReports, setLoadingReports] = useState(false);
  const [reportError, setReportError] = useState('');

  const fetchReports = async () => {
    if (!isYouTubeChannel) return;

    setLoadingReports(true);
    setReportError('');

    try {
      const response = await fetch('/api/youtube/analytics', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(
          `Analytics request failed (${response.status})`
        );
      }

      const data: AnalyticsResponse = await response.json();

      setReport(data);
    } catch (error) {
      console.error('Failed to load detailed analytics:', error);

      setReportError(
        error instanceof Error
          ? error.message
          : 'Could not load detailed analytics.'
      );
    } finally {
      setLoadingReports(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [channel.id, isYouTubeChannel]);

  const netSubscribers = analytics
    ? analytics.subscribersGained - analytics.subscribersLost
    : 0;

  const trafficRows: AnalyticsRow[] =
    report?.trafficSources?.rows?.map((row) => ({
      insightTrafficSourceType: String(row[0]),
      views: Number(row[1]) || 0,
      estimatedMinutesWatched: Number(row[2]) || 0,
    })) || [];

  const geographyRows: AnalyticsRow[] =
    report?.geography?.rows?.map((row) => ({
      country: String(row[0]),
      views: Number(row[1]) || 0,
      estimatedMinutesWatched: Number(row[2]) || 0,
    })) || [];

  const totalTrafficViews = trafficRows.reduce(
    (sum, row) => sum + row.views,
    0
  );

  const totalGeographyViews = geographyRows.reduce(
    (sum, row) => sum + row.views,
    0
  );

  const topTrafficSource = [...trafficRows].sort(
    (a, b) => b.views - a.views
  )[0];

  const topCountry = [...geographyRows].sort(
    (a, b) => b.views - a.views
  )[0];

  const cards = [
    {
      label: 'Views',
      value: hasAnalytics
        ? formatNumber(analytics.views)
        : 'Unavailable',
      description: 'Total views in the last 28 days',
      icon: Eye,
    },
    {
      label: 'Watch Time',
      value: hasAnalytics
        ? `${(analytics.estimatedMinutesWatched / 60).toFixed(1)} hrs`
        : 'Unavailable',
      description: 'Estimated hours watched in 28 days',
      icon: Clock,
    },
    {
      label: 'Average View Duration',
      value: hasAnalytics
        ? formatDuration(analytics.averageViewDurationSeconds)
        : 'Unavailable',
      description: 'Average time viewers watched',
      icon: TrendingUp,
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
            <CheckCircle2
              className={`w-4 h-4 ${
                hasAnalytics ? 'text-green-400' : 'text-slate-500'
              }`}
            />

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
            <p className="text-xs text-slate-400">
              Current Subscribers
            </p>

            <p className="text-xl font-bold text-white mt-2">
              {channel.subscribersDisplay}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <p className="text-xs text-slate-400">
              Subscribers Gained
            </p>

            <p className="text-xl font-bold text-green-400 mt-2">
              {hasAnalytics
                ? `+${formatNumber(analytics.subscribersGained)}`
                : 'Unavailable'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <p className="text-xs text-slate-400">
              Net Subscriber Change
            </p>

            <p
              className={`text-xl font-bold mt-2 ${
                netSubscribers >= 0
                  ? 'text-green-400'
                  : 'text-red-400'
              }`}
            >
              {hasAnalytics
                ? `${netSubscribers > 0 ? '+' : ''}${formatNumber(netSubscribers)}`
                : 'Unavailable'}
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Reports Loading */}
      {loadingReports && (
        <div className="glass-panel p-5 rounded-2xl flex items-center gap-3 text-slate-300">
          <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />

          <span className="text-sm">
            Loading your real traffic and audience reports...
          </span>
        </div>
      )}

      {reportError && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />

          <div>
            <p className="text-sm font-semibold text-amber-300">
              Detailed reports could not be loaded
            </p>

            <p className="text-xs text-slate-400 mt-1">
              {reportError}
            </p>

            <button
              onClick={fetchReports}
              className="mt-3 text-xs text-cyan-300 hover:text-cyan-200 font-semibold"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Audience Retention */}
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" />

            <h3 className="text-base font-bold text-white">
              Traffic Sources
            </h3>
          </div>

          <span className="text-[11px] text-slate-500">
            Real YouTube Analytics data
          </span>
        </div>

        {trafficRows.length > 0 ? (
          <div className="mt-5 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <p className="text-xs text-slate-400">
                  Top Traffic Source
                </p>

                <p className="text-lg font-bold text-cyan-300 mt-2">
                  {formatSourceName(
                    topTrafficSource?.insightTrafficSourceType || ''
                  )}
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  {formatNumber(topTrafficSource?.views || 0)} views
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <p className="text-xs text-slate-400">
                  Views from Traffic Reports
                </p>

                <p className="text-lg font-bold text-white mt-2">
                  {formatNumber(totalTrafficViews)}
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  Across returned traffic categories
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {trafficRows
                .slice()
                .sort((a, b) => b.views - a.views)
                .map((row) => (
                  <AnalyticsBar
                    key={row.insightTrafficSourceType}
                    label={formatSourceName(
                      row.insightTrafficSourceType || 'Other'
                    )}
                    value={row.views}
                    total={totalTrafficViews}
                    color={
                      row.insightTrafficSourceType === 'SHORTS'
                        ? 'bg-pink-500'
                        : row.insightTrafficSourceType === 'YT_SEARCH'
                        ? 'bg-cyan-500'
                        : 'bg-purple-500'
                    }
                  />
                ))}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">
            <Info className="w-8 h-8 text-slate-500 mx-auto mb-3" />

            <p className="text-sm font-semibold text-slate-300">
              Traffic report unavailable
            </p>

            <p className="text-xs text-slate-500 mt-2">
              YouTube has not returned traffic-source rows for this report.
            </p>
          </div>
        )}
      </div>

      {/* Audience Geography */}
      <div className="glass-panel p-6 rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />

            <h3 className="text-base font-bold text-white">
              Audience Geography
            </h3>
          </div>

          <span className="text-[11px] text-slate-500">
            Top countries by views
          </span>
        </div>

        {geographyRows.length > 0 ? (
          <div className="mt-5 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <p className="text-xs text-slate-400">
                  Top Audience Country
                </p>

                <p className="text-lg font-bold text-cyan-300 mt-2">
                  {getCountryName(topCountry?.country || '')}
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  {formatNumber(topCountry?.views || 0)} views
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <p className="text-xs text-slate-400">
                  Countries Returned
                </p>

                <p className="text-lg font-bold text-white mt-2">
                  {geographyRows.length}
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  Countries in this report
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {geographyRows
                .slice()
                .sort((a, b) => b.views - a.views)
                .map((row) => (
                  <AnalyticsBar
                    key={row.country}
                    label={getCountryName(row.country || '')}
                    value={row.views}
                    total={totalGeographyViews}
                    color={
                      row.country === 'GH'
                        ? 'bg-green-500'
                        : 'bg-cyan-500'
                    }
                  />
                ))}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">
            <MapPin className="w-8 h-8 text-slate-500 mx-auto mb-3" />

            <p className="text-sm font-semibold text-slate-300">
              Geography report unavailable
            </p>

            <p className="text-xs text-slate-500 mt-2">
              YouTube has not returned country-level rows for this report.
            </p>
          </div>
        )}
      </div>

      {/* Data Transparency */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
        <Info className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />

        <div>
          <p className="text-xs font-semibold text-slate-300">
            About your analytics
          </p>

          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
            Figures come from the connected YouTube channel and its available Analytics API reports. Traffic-source and country percentages are calculated from the rows returned by YouTube. Some views may not be attributed to a listed category or country. CreatorPulse AI does not invent missing performance figures.
          </p>

          {report?.startDate && report?.endDate && (
            <p className="text-[11px] text-slate-500 mt-2">
              Report period: {report.startDate} to {report.endDate}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
