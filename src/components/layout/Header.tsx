
import React, { useState } from 'react';
import {
  Menu,
  Bell,
  Sparkles,
  ChevronDown,
  CheckCircle,
  Info,
} from 'lucide-react';
import { PageId, ChannelProfile } from '../../types';
import { DEMO_CHANNELS } from '../../data/demoChannels';

interface HeaderProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  channel: ChannelProfile;
  onSelectChannel: (channelId: string) => void;
  onOpenMobileMenu: () => void;
  hasGeminiKey: boolean;
}

const PAGE_TITLES: Record<PageId, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Creator Overview',
    subtitle: 'Your channel performance and growth analytics',
  },
  'video-research': {
    title: 'Video Research & Topic Radar',
    subtitle: 'Discover video ideas and content opportunities',
  },
  'keyword-explorer': {
    title: 'YouTube Keyword Explorer',
    subtitle: 'Explore keywords and optimize your videos',
  },
  'title-generator': {
    title: 'AI Title Studio',
    subtitle: 'Create engaging titles for your YouTube videos',
  },
  'description-generator': {
    title: 'SEO Description Generator',
    subtitle: 'Generate descriptions for your YouTube uploads',
  },
  'thumbnail-analyzer': {
    title: 'Thumbnail Vision Analyzer',
    subtitle: 'Analyze thumbnail design and visual appeal',
  },
  'competitor-analysis': {
    title: 'Competitor Benchmark Hub',
    subtitle: 'Research other channels and their content',
  },
  'channel-analytics': {
    title: 'In-Depth Channel Analytics',
    subtitle: 'Explore your channel performance data',
  },
  settings: {
    title: 'Platform Settings & Integrations',
    subtitle: 'Manage your channel, Gemini AI and integrations',
  },
};

export const Header: React.FC<HeaderProps> = ({
  activePage,
  onNavigate,
  channel,
  onSelectChannel,
  onOpenMobileMenu,
  hasGeminiKey,
}) => {
  const [showChannelDropdown, setShowChannelDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const isYouTubeChannel = channel.dataSource === 'youtube';

  return (
    <header className="sticky top-0 z-20 bg-[#080b16]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3.5">
      <div className="flex items-center justify-between gap-4">

        {/* Left: Mobile Menu and Page Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight truncate">
                {PAGE_TITLES[activePage].title}
              </h1>

              <span
                className={`hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                  isYouTubeChannel
                    ? 'bg-red-500/10 text-red-300 border-red-500/20'
                    : 'bg-purple-500/10 text-purple-300 border-purple-500/20'
                }`}
              >
                {isYouTubeChannel ? (
                  <>
                    <CheckCircle className="w-3 h-3" />
                    YouTube Connected
                  </>
                ) : (
                  <>
                    <Info className="w-3 h-3" />
                    Demo Profile
                  </>
                )}
              </span>
            </div>

            <p className="hidden sm:block text-xs text-slate-400 truncate mt-0.5">
              {PAGE_TITLES[activePage].subtitle}
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Gemini Title Generator */}
          <button
            onClick={() => onNavigate('title-generator')}
            disabled={!hasGeminiKey}
            title={hasGeminiKey ? 'Generate video titles' : 'Gemini API key not configured'}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-md shadow-purple-950/40 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Titles</span>
          </button>

          {/* Channel Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setShowChannelDropdown(!showChannelDropdown);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-slate-600 text-xs text-slate-200 transition-colors"
            >
              <img
                src={channel.avatar}
                alt={channel.name}
                className="w-5 h-5 rounded-full object-cover"
              />

              <span className="font-medium hidden sm:inline max-w-[110px] truncate">
                {channel.name}
              </span>

              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showChannelDropdown && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#0c1024] border border-slate-700 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">

                {isYouTubeChannel && (
                  <>
                    <div className="px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-red-300 border-b border-slate-800">
                      Connected YouTube Channel
                    </div>

                    <div className="flex items-center gap-2.5 px-2.5 py-3">
                      <img
                        src={channel.avatar}
                        alt={channel.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />

                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white font-semibold truncate">
                          {channel.name}
                        </p>
                        <p className="text-[10px] text-green-400">
                          Connected account
                        </p>
                      </div>

                      <CheckCircle className="w-4 h-4 text-green-400" />
                    </div>
                  </>
                )}

                <div className="px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  Demo Profiles
                </div>

                <div className="py-1 space-y-1">
                  {Object.values(DEMO_CHANNELS).map((c) => {
                    const isCurrent = c.id === channel.id;

                    return (
                      <button
                        key={c.id}
                        onClick={() => {
                          onSelectChannel(c.id);
                          setShowChannelDropdown(false);
                        }}
                        className={`w-full text-left flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-colors ${
                          isCurrent
                            ? 'bg-purple-600/20 text-white border border-purple-500/30 font-semibold'
                            : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                        }`}
                      >
                        <img
                          src={c.avatar}
                          alt={c.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />

                        <div className="flex-1 min-w-0">
                          <p className="truncate font-medium">{c.name}</p>
                          <p className="text-[10px] text-slate-400">
                            {c.subscribersDisplay} subs · Demo
                          </p>
                        </div>

                        {isCurrent && (
                          <div className="w-2 h-2 rounded-full bg-purple-400" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-slate-800/80 px-2 flex justify-between items-center text-[11px] text-slate-400">
                  <span>Manage channel</span>
                  <button
                    onClick={() => {
                      onNavigate('settings');
                      setShowChannelDropdown(false);
                    }}
                    className="text-purple-400 hover:underline font-medium"
                  >
                    Settings
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowChannelDropdown(false);
              }}
              className="p-2 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-slate-600 text-slate-300 hover:text-white transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl bg-[#0c1024] border border-slate-700 shadow-2xl p-4 z-50">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                  <Bell className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Notifications
                  </span>
                </div>

                <div className="py-5 text-center">
                  <Info className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                  <p className="text-xs text-slate-300 font-medium">
                    No live alerts yet
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Channel alerts will appear here when notification monitoring is available.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
