
import React, { useState, useEffect } from 'react';
import { PageId, ChannelProfile } from './types';
import { DEMO_CHANNELS } from './data/demoChannels';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardPage } from './components/pages/DashboardPage';
import { VideoResearchPage } from './components/pages/VideoResearchPage';
import { KeywordExplorerPage } from './components/pages/KeywordExplorerPage';
import { TitleGeneratorPage } from './components/pages/TitleGeneratorPage';
import { DescriptionGeneratorPage } from './components/pages/DescriptionGeneratorPage';
import { ThumbnailAnalyzerPage } from './components/pages/ThumbnailAnalyzerPage';
import { CompetitorAnalysisPage } from './components/pages/CompetitorAnalysisPage';
import { ChannelAnalyticsPage } from './components/pages/ChannelAnalyticsPage';
import { SettingsPage } from './components/pages/SettingsPage';

interface YouTubeChannelResponse {
  channel: {
    id: string;
    title: string;
    description?: string;
    customUrl?: string;
    thumbnail?: string;
    subscriberCount?: number;
    viewCount?: number;
    videoCount?: number;
  };
}

interface YouTubeAnalyticsRow {
  day: string;
  views: number;
  estimatedMinutesWatched: number;
  averageViewDuration: number;
  subscribersGained: number;
  subscribersLost: number;
}

interface YouTubeAnalyticsResponse {
  rows?: YouTubeAnalyticsRow[];
  analytics?: YouTubeAnalyticsRow[] | { rows?: YouTubeAnalyticsRow[] };
}

const formatNumber = (value: number) =>
  new Intl.NumberFormat('en-US').format(value);

const formatDuration = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds <= 0) return 'Not available';

  if (seconds < 60) return `${Math.round(seconds)} sec`;

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);

  return remainingSeconds > 0
    ? `${minutes} min ${remainingSeconds} sec`
    : `${minutes} min`;
};

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('dashboard');
  const [currentChannelId, setCurrentChannelId] = useState<string>('techcraft');
  const [channelsData, setChannelsData] =
    useState<Record<string, ChannelProfile>>(DEMO_CHANNELS);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hasGeminiKey, setHasGeminiKey] = useState(false);

  const [isYouTubeConnected, setIsYouTubeConnected] = useState(false);
  const [isYouTubeLoading, setIsYouTubeLoading] = useState(true);

  // Cross-page state carry-overs
  const [topicForTitle, setTopicForTitle] = useState('');
  const [titleForDescription, setTitleForDescription] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadAppData = async () => {
      try {
        const healthResponse = await fetch('/api/health');
        const healthData = await healthResponse.json();

        if (isMounted && typeof healthData?.hasGeminiKey === 'boolean') {
          setHasGeminiKey(healthData.hasGeminiKey);
        }
      } catch (error) {
        console.log('Backend health check info:', error);
      }

      try {
        const statusResponse = await fetch('/api/youtube/status', {
          credentials: 'include',
        });

        if (!statusResponse.ok) {
          throw new Error('Could not check YouTube connection status.');
        }

        const statusData = await statusResponse.json();

        if (!isMounted) return;

        if (!statusData?.connected) {
          setIsYouTubeConnected(false);
          return;
        }

        setIsYouTubeConnected(true);

        const [channelResponse, analyticsResponse] = await Promise.all([
          fetch('/api/youtube/channel', {
            credentials: 'include',
          }),
          fetch('/api/youtube/analytics', {
            credentials: 'include',
          }),
        ]);

        if (!channelResponse.ok) {
          throw new Error('Could not load YouTube channel information.');
        }

        const channelData: YouTubeChannelResponse =
          await channelResponse.json();

        let analyticsRows: YouTubeAnalyticsRow[] = [];

        if (analyticsResponse.ok) {
          const analyticsData: YouTubeAnalyticsResponse =
            await analyticsResponse.json();

          const analyticsResult = analyticsData.analytics;

          if (Array.isArray(analyticsData.rows)) {
            analyticsRows = analyticsData.rows;
          } else if (Array.isArray(analyticsResult)) {
            analyticsRows = analyticsResult;
          } else if (
            analyticsResult &&
            !Array.isArray(analyticsResult) &&
            Array.isArray(analyticsResult.rows)
          ) {
            analyticsRows = analyticsResult.rows;
          }
        }

        if (!isMounted || !channelData.channel) return;

        const youtubeChannel = channelData.channel;

        const totalViews = Number(youtubeChannel.viewCount || 0);
        const subscribers = Number(youtubeChannel.subscriberCount || 0);

        const totalAnalyticsViews = analyticsRows.reduce(
          (sum, row) => sum + Number(row.views || 0),
          0
        );

        const totalWatchMinutes = analyticsRows.reduce(
          (sum, row) =>
            sum + Number(row.estimatedMinutesWatched || 0),
          0
        );

        const subscribersGained = analyticsRows.reduce(
          (sum, row) => sum + Number(row.subscribersGained || 0),
          0
        );

        const subscribersLost = analyticsRows.reduce(
          (sum, row) => sum + Number(row.subscribersLost || 0),
          0
        );

        const averageViewDurationSeconds =
          totalAnalyticsViews > 0
            ? (totalWatchMinutes * 60) / totalAnalyticsViews
            : 0;

        const history = analyticsRows.map((row) => ({
          date: row.day,
          views: Number(row.views || 0),
          subscribers:
            Number(row.subscribersGained || 0) -
            Number(row.subscribersLost || 0),
          watchTimeHours:
            Number(row.estimatedMinutesWatched || 0) / 60,
        }));

        const realChannel: ChannelProfile = {
          id: youtubeChannel.id,
          name: youtubeChannel.title,
          handle: youtubeChannel.customUrl || '',
          avatar: youtubeChannel.thumbnail || '',
          niche: 'Technology & How-to',

          subscribers,
          subscribersDisplay: formatNumber(subscribers),

          totalViews,
          totalViewsDisplay: formatNumber(totalViews),

          watchTimeHours: totalWatchMinutes / 60,
          watchTimeDisplay: `${(totalWatchMinutes / 60).toFixed(1)} hours`,

          estimatedRevenue: 'Not available',
          avgCtr: 0,
          avgAvd: formatDuration(averageViewDurationSeconds),
          subscriberGrowthRate: 0,
          performanceScore: 0,

          history,
          trafficSources: [],
          retentionCurve: [],
          recentVideos: [],
          trendingIdeas: [],
          recommendations: [],
          competitors: [],

          dataSource: 'youtube',
          analytics: {
            views: totalAnalyticsViews,
            estimatedMinutesWatched: totalWatchMinutes,
            averageViewDurationSeconds,
            subscribersGained,
            subscribersLost,
          },
        };

        if (isMounted) {
          setChannelsData((previous) => ({
            ...previous,
            [realChannel.id]: realChannel,
          }));

          setCurrentChannelId(realChannel.id);
        }
      } catch (error) {
        console.error('YouTube data loading error:', error);
      } finally {
        if (isMounted) {
          setIsYouTubeLoading(false);
        }
      }
    };

    loadAppData();

    return () => {
      isMounted = false;
    };
  }, []);

  const currentChannel =
    channelsData[currentChannelId] || DEMO_CHANNELS.techcraft;

  const handleSelectChannel = (channelId: string) => {
    if (channelsData[channelId]) {
      setCurrentChannelId(channelId);
    }
  };

  const handleUpdateChannel = (updated: ChannelProfile) => {
    setChannelsData((previous) => ({
      ...previous,
      [updated.id]: updated,
    }));
  };

  const handleSelectTopicForTitle = (topic: string) => {
    setTopicForTitle(topic);
    setActivePage('title-generator');
  };

  const handleSelectTitleForDescription = (title: string) => {
    setTitleForDescription(title);
    setActivePage('description-generator');
  };

  return (
    <div className="min-h-screen flex bg-[#070913] text-slate-100 selection:bg-purple-600 selection:text-white">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-700/10 rounded-full blur-[128px]" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px]" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-indigo-700/10 rounded-full blur-[128px]" />
      </div>

      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        channel={currentChannel}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        hasGeminiKey={hasGeminiKey}
      />

      <div className="flex-1 flex flex-col min-w-0 z-10">
        <Header
          activePage={activePage}
          onNavigate={setActivePage}
          channel={currentChannel}
          onSelectChannel={handleSelectChannel}
          onOpenMobileMenu={() => setIsMobileOpen(true)}
          hasGeminiKey={hasGeminiKey}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activePage === 'dashboard' && (
            <DashboardPage
              channel={currentChannel}
              onNavigate={setActivePage}
            />
          )}

          {activePage === 'video-research' && (
            <VideoResearchPage
              channel={currentChannel}
              onNavigate={setActivePage}
              onSelectTopicForTitle={handleSelectTopicForTitle}
            />
          )}

          {activePage === 'keyword-explorer' && (
            <KeywordExplorerPage
              channel={currentChannel}
              onNavigate={setActivePage}
              onSelectTopicForTitle={handleSelectTopicForTitle}
            />
          )}

          {activePage === 'title-generator' && (
            <TitleGeneratorPage
              channel={currentChannel}
              initialTopic={topicForTitle}
              onNavigate={setActivePage}
              onSelectTitleForDescription={handleSelectTitleForDescription}
            />
          )}

          {activePage === 'description-generator' && (
            <DescriptionGeneratorPage
              channel={currentChannel}
              initialTitle={titleForDescription}
              onNavigate={setActivePage}
            />
          )}

          {activePage === 'thumbnail-analyzer' && (
            <ThumbnailAnalyzerPage
              channel={currentChannel}
              onNavigate={setActivePage}
            />
          )}

          {activePage === 'competitor-analysis' && (
            <CompetitorAnalysisPage
              channel={currentChannel}
              onNavigate={setActivePage}
              onSelectTopicForTitle={handleSelectTopicForTitle}
            />
          )}

          {activePage === 'channel-analytics' && (
            <ChannelAnalyticsPage
              channel={currentChannel}
              onNavigate={setActivePage}
            />
          )}

          {activePage === 'settings' && (
            <SettingsPage
              channel={currentChannel}
              onSelectChannel={handleSelectChannel}
              onUpdateChannel={handleUpdateChannel}
              hasGeminiKey={hasGeminiKey}
              onNavigate={setActivePage}
            />
          )}
        </main>
      </div>
    </div>
  );
}
