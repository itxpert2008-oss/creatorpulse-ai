import React from 'react';
import {
  LayoutDashboard,
  Compass,
  Search,
  Type,
  FileText,
  Image as ImageIcon,
  Users,
  BarChart3,
  Settings,
  Sparkles,
  Zap,
  ChevronRight,
  Tv,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';
import { PageId, ChannelProfile } from '../../types';

interface SidebarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  channel: ChannelProfile;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  hasGeminiKey: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  channel,
  isMobileOpen,
  setIsMobileOpen,
  hasGeminiKey,
}) => {
  const navItems = [
    {
      id: 'dashboard' as PageId,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: 'Live',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    },
    {
      id: 'video-research' as PageId,
      label: 'Video Research',
      icon: Compass,
      badge: 'Hot',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    },
    {
      id: 'keyword-explorer' as PageId,
      label: 'Keyword Explorer',
      icon: Search,
    },
    {
      id: 'title-generator' as PageId,
      label: 'AI Title Generator',
      icon: Type,
      ai: true,
    },
    {
      id: 'description-generator' as PageId,
      label: 'Description Generator',
      icon: FileText,
      ai: true,
    },
    {
      id: 'thumbnail-analyzer' as PageId,
      label: 'Thumbnail Analyzer',
      icon: ImageIcon,
      ai: true,
      badge: 'Vision',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    },
    {
      id: 'competitor-analysis' as PageId,
      label: 'Competitor Analysis',
      icon: Users,
    },
    {
      id: 'channel-analytics' as PageId,
      label: 'Channel Analytics',
      icon: BarChart3,
    },
    {
      id: 'settings' as PageId,
      label: 'Settings',
      icon: Settings,
    },
  ];

  const handleItemClick = (pageId: PageId) => {
    onNavigate(pageId);
    setIsMobileOpen(false);
  };

  const content = (
    <div className="flex flex-col h-full bg-[#080b16] border-r border-slate-800/80 text-slate-300 w-72 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/70 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 shadow-lg shadow-purple-950/50">
            <Zap className="w-5 h-5 text-white animate-pulse" />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#080b16]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-white">
                Creator<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Pulse</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                AI
              </span>
            </div>
            <p className="text-xs text-slate-400">YouTube Growth Engine</p>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Connected Channel Card (Demo Banner) */}
      <div className="px-4 py-3 border-b border-slate-800/60 bg-gradient-to-b from-[#0c1022] to-transparent">
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
          <img
            src={channel.avatar}
            alt={channel.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500/40"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <p className="text-xs font-semibold text-white truncate">{channel.name}</p>
            </div>
            <p className="text-[11px] text-slate-400 truncate">{channel.subscribersDisplay} subs</p>
          </div>
          <button
            onClick={() => handleItemClick('settings')}
            title="Switch demo channel"
            className="text-[10px] font-medium px-2 py-1 rounded bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 border border-purple-500/20 transition-colors"
          >
            Demo
          </button>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Platform Suite
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`w-full group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-purple-950/80 to-indigo-950/40 text-white border border-purple-500/30 shadow-md shadow-purple-950/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-1.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/50'
                      : 'text-slate-400 group-hover:text-purple-400 group-hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span>{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {item.ai && !item.badge && (
                  <span className="flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 border border-purple-500/20">
                    <Sparkles className="w-2.5 h-2.5 text-purple-400" />
                    AI
                  </span>
                )}
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-purple-400" />}
              </div>
            </button>
          );
        })}
      </nav>

      {/* AI Intelligence Engine Status */}
      <div className="p-4 border-t border-slate-800/80 bg-[#090d1e]">
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-semibold text-slate-200">Gemini 3.8 Flash</span>
            </div>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                hasGeminiKey
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
              }`}
            >
              {hasGeminiKey ? 'Active' : 'Optimized'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Multi-modal vision & predictive CTR neural scoring ready.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-shrink-0 h-screen sticky top-0 z-30">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#080b16] z-50">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
