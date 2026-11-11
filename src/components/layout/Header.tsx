import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  Sparkles,
  ChevronDown,
  Plus,
  Zap,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
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
    subtitle: 'Real-time velocity, performance metrics & algorithmic growth signals',
  },
  'video-research': {
    title: 'Video Research & Topic Radar',
    subtitle: 'Discover breakout niche trends and high-opportunity content gaps',
  },
  'keyword-explorer': {
    title: 'YouTube Keyword Explorer',
    subtitle: 'Search volume, competition difficulty & tag optimization matrix',
  },
  'title-generator': {
    title: 'AI Title Studio',
    subtitle: 'Generate high-CTR, psychological hook titles with predicted clickability',
  },
  'description-generator': {
    title: 'SEO Description Generator',
    subtitle: 'Complete chapter timestamps, keyword density & social link templates',
  },
  'thumbnail-analyzer': {
    title: 'Thumbnail Vision Analyzer',
    subtitle: 'Multi-modal AI audit for 3-second hook, contrast & mobile legibility',
  },
  'competitor-analysis': {
    title: 'Competitor Benchmark Hub',
    subtitle: 'Reverse-engineer outlier viral videos and uncover untapped audience demand',
  },
  'channel-analytics': {
    title: 'In-Depth Channel Analytics',
    subtitle: 'Retention curves, traffic attribution, watch time & subscriber velocity',
  },
  settings: {
    title: 'Platform Settings & Integrations',
    subtitle: 'Manage demo channel profiles, Google Gemini AI engine & exports',
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

  const notifications = [
    {
      id: 'n1',
      title: 'Video Outlier Alert',
      text: '"I Built an Autonomous AI Agent" is gaining +48% more hourly views than usual.',
      time: '12m ago',
      type: 'success',
    },
    {
      id: 'n2',
      title: 'Retention Hook Signal',
      text: '30s hook retention hit 76% on recent upload. Top 15% in your niche.',
      time: '2h ago',
      type: 'info',
    },
    {
      id: 'n3',
      title: 'Topic Trend Spike',
      text: '"Local LLMs" search interest climbed +142% this week.',
      time: '5h ago',
      type: 'warning',
    },
  ];

  return (
    <header className="sticky top-0 z-20 bg-[#080b16]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Page Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight truncate">
                {PAGE_TITLES[activePage].title}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
                Demo Channel
              </span>
            </div>
            <p className="hidden sm:block text-xs text-slate-400 truncate mt-0.5">
              {PAGE_TITLES[activePage].subtitle}
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Action: Title Generator shortcut */}
          <button
            onClick={() => onNavigate('title-generator')}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-950/40 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Titles</span>
          </button>

          {/* Channel Selector Dropdown */}
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
                <div className="px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  Switch Demo Channel
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
                          <p className="text-[10px] text-slate-400">{c.subscribersDisplay} subs</p>
                        </div>
                        {isCurrent && (
                          <div className="w-2 h-2 rounded-full bg-purple-400 shadow-sm shadow-purple-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="pt-2 border-t border-slate-800/80 px-2 flex justify-between items-center text-[11px] text-slate-400">
                  <span>Custom channel?</span>
                  <button
                    onClick={() => {
                      onNavigate('settings');
                      setShowChannelDropdown(false);
                    }}
                    className="text-purple-400 hover:underline font-medium"
                  >
                    Edit in Settings
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notifications button */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowChannelDropdown(false);
              }}
              className="p-2 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-slate-600 text-slate-300 hover:text-white transition-colors relative"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl bg-[#0c1024] border border-slate-700 shadow-2xl p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Algorithm Intelligence Alerts
                  </span>
                  <span className="text-[10px] text-purple-400 font-semibold">3 New</span>
                </div>
                <div className="py-2 space-y-2">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-slate-200">{n.title}</span>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{n.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
