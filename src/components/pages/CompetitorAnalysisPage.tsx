import React, { useState } from 'react';
import {
  Users,
  Flame,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  ExternalLink,
  Plus,
  Play,
  CheckCircle2,
  AlertCircle,
  Eye,
  BarChart2,
  Calendar,
} from 'lucide-react';
import { CompetitorChannel, ChannelProfile, PageId } from '../../types';

interface CompetitorAnalysisPageProps {
  channel: ChannelProfile;
  onNavigate: (page: PageId) => void;
  onSelectTopicForTitle?: (topic: string) => void;
}

export const CompetitorAnalysisPage: React.FC<CompetitorAnalysisPageProps> = ({
  channel,
  onNavigate,
  onSelectTopicForTitle,
}) => {
  const [competitors, setCompetitors] = useState<CompetitorChannel[]>(channel.competitors);
  const [newCompetitorName, setNewCompetitorName] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddCompetitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompetitorName.trim()) return;

    const newComp: CompetitorChannel = {
      id: `comp-${Date.now()}`,
      name: newCompetitorName.trim(),
      handle: `@${newCompetitorName.trim().replace(/\s+/g, '').toLowerCase()}`,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
      subscribers: '480K',
      subscribersCount: 480000,
      uploadFrequency: '2 videos / week',
      outlierVideo: {
        title: `The Ultimate ${newCompetitorName} Secret Nobody Tells You`,
        views: '1.4M views',
        multiplier: '3.6x channel avg',
        thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80',
      },
      overlapScore: 74,
      recentStrategy: 'High-contrast typography with fast-paced storytelling.',
      contentGaps: ['Deep technical code repos', 'Real benchmark comparisons', 'Community Q&A'],
    };

    setCompetitors([...competitors, newComp]);
    setNewCompetitorName('');
    setShowAddModal(false);
  };

  const handleReverseEngineer = (title: string) => {
    if (onSelectTopicForTitle) {
      onSelectTopicForTitle(title);
    }
    onNavigate('title-generator');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Users className="w-4 h-4 text-cyan-300" />
              <span>Niche Intelligence & Audience Overlap</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Competitor Benchmark & Outlier Radar
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
              Track how rival channels perform, uncover which outlier videos earned 3x - 5x their baseline views, and spot content whitespace they haven’t covered.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-purple-950/50 transition-all cursor-pointer whitespace-nowrap self-stretch sm:self-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            <span>Track New Competitor</span>
          </button>
        </div>
      </div>

      {/* Add Competitor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0b0f20] border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Track Competitor Channel</h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Add a YouTube creator to benchmark their upload cadence, average views multiplier, and outlier topics.
            </p>

            <form onSubmit={handleAddCompetitor} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Channel Name or Handle:
                </label>
                <input
                  type="text"
                  value={newCompetitorName}
                  onChange={(e) => setNewCompetitorName(e.target.value)}
                  placeholder="e.g. Theo - t3․gg, Fireship, MKBHD..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
                >
                  Start Tracking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Competitors List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {competitors.map((comp) => (
          <div
            key={comp.id}
            className="glass-panel p-5 rounded-2xl flex flex-col justify-between group hover:border-purple-500/50 transition-all duration-200"
          >
            <div>
              {/* Channel Profile Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <img
                    src={comp.avatar}
                    alt={comp.name}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-purple-500/30"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-white group-hover:text-purple-300 transition-colors">
                      {comp.name}
                    </h4>
                    <p className="text-xs text-slate-400">{comp.handle}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-extrabold text-white block">{comp.subscribers}</span>
                  <span className="text-[10px] text-slate-400">Subscribers</span>
                </div>
              </div>

              {/* Upload Frequency & Overlap */}
              <div className="grid grid-cols-2 gap-2 my-3 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">Upload Cadence</span>
                  <span className="font-bold text-slate-200">{comp.uploadFrequency}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">Audience Overlap</span>
                  <span className="font-bold text-cyan-400">{comp.overlapScore}% Match</span>
                </div>
              </div>

              {/* Outlier Viral Video Card */}
              <div className="mt-4 p-3 rounded-xl bg-[#090d1e] border border-purple-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" />
                    Top Outlier Video
                  </span>
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {comp.outlierVideo.multiplier}
                  </span>
                </div>

                <div className="flex gap-2.5">
                  <img
                    src={comp.outlierVideo.thumbnail}
                    alt={comp.outlierVideo.title}
                    className="w-16 h-10 rounded-lg object-cover flex-shrink-0 border border-slate-800"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-200 line-clamp-2 leading-snug">
                      {comp.outlierVideo.title}
                    </p>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {comp.outlierVideo.views}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleReverseEngineer(comp.outlierVideo.title)}
                  className="mt-3 w-full py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-cyan-300" />
                  <span>Reverse Engineer This Format</span>
                </button>
              </div>

              {/* Content Whitespace Gaps */}
              <div className="mt-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Untapped Content Gaps:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {comp.contentGaps.map((gap, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300"
                    >
                      {gap}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="truncate max-w-[190px]">Strategy: {comp.recentStrategy}</span>
              <span className="text-emerald-400 font-semibold">Active</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
