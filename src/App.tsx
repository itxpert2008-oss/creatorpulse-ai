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

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('dashboard');
  const [currentChannelId, setCurrentChannelId] = useState<string>('techcraft');
  const [channelsData, setChannelsData] = useState<Record<string, ChannelProfile>>(DEMO_CHANNELS);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hasGeminiKey, setHasGeminiKey] = useState(false);

  // Cross-page state carry-overs
  const [topicForTitle, setTopicForTitle] = useState('');
  const [titleForDescription, setTitleForDescription] = useState('');

  // Check backend server health and Gemini API key status
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.hasGeminiKey === 'boolean') {
          setHasGeminiKey(data.hasGeminiKey);
        }
      })
      .catch((err) => {
        console.log('Backend health check info:', err);
      });
  }, []);

  const currentChannel = channelsData[currentChannelId] || DEMO_CHANNELS.techcraft;

  const handleSelectChannel = (channelId: string) => {
    if (channelsData[channelId]) {
      setCurrentChannelId(channelId);
    }
  };

  const handleUpdateChannel = (updated: ChannelProfile) => {
    setChannelsData((prev) => ({
      ...prev,
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

      {/* Modern Sidebar Navigation */}
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        channel={currentChannel}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        hasGeminiKey={hasGeminiKey}
      />

      {/* Main Content Area */}
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
            <DashboardPage channel={currentChannel} onNavigate={setActivePage} />
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
            <ThumbnailAnalyzerPage channel={currentChannel} onNavigate={setActivePage} />
          )}

          {activePage === 'competitor-analysis' && (
            <CompetitorAnalysisPage
              channel={currentChannel}
              onNavigate={setActivePage}
              onSelectTopicForTitle={handleSelectTopicForTitle}
            />
          )}

          {activePage === 'channel-analytics' && (
            <ChannelAnalyticsPage channel={currentChannel} onNavigate={setActivePage} />
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
