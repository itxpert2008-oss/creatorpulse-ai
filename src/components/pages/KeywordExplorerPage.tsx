import React, { useState } from 'react';
import {
  Search,
  Tag,
  Copy,
  Check,
  TrendingUp,
  BarChart3,
  HelpCircle,
  ExternalLink,
  Flame,
  Filter,
  Sparkles,
} from 'lucide-react';
import { KeywordMetric, ChannelProfile, PageId } from '../../types';
import { INITIAL_KEYWORDS } from '../../data/demoChannels';

interface KeywordExplorerPageProps {
  channel: ChannelProfile;
  onNavigate: (page: PageId) => void;
  onSelectTopicForTitle?: (topic: string) => void;
}

export const KeywordExplorerPage: React.FC<KeywordExplorerPageProps> = ({
  channel,
  onNavigate,
  onSelectTopicForTitle,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKeyword, setSelectedKeyword] = useState<KeywordMetric>(INITIAL_KEYWORDS[0]);
  const [filterDifficulty, setFilterDifficulty] = useState<'all' | 'low' | 'high'>('all');
  const [isCopied, setIsCopied] = useState(false);
  const [customKeywords, setCustomKeywords] = useState<KeywordMetric[]>(INITIAL_KEYWORDS);

  const filteredKeywords = customKeywords.filter((k) => {
    const matchesSearch = k.keyword.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterDifficulty === 'low') return matchesSearch && k.competitionScore < 45;
    if (filterDifficulty === 'high') return matchesSearch && k.competitionScore >= 70;
    return matchesSearch;
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    // Check if exists
    const existing = customKeywords.find(
      (k) => k.keyword.toLowerCase() === searchTerm.trim().toLowerCase()
    );
    if (existing) {
      setSelectedKeyword(existing);
      return;
    }

    // Add generated realistic metric for user's query
    const newMetric: KeywordMetric = {
      keyword: searchTerm.trim().toLowerCase(),
      searchVolume: Math.floor(Math.random() * 180000) + 25000,
      searchVolumeDisplay: `${(Math.floor(Math.random() * 180) + 25)}K/mo`,
      competitionScore: Math.floor(Math.random() * 55) + 25,
      competitionLabel: Math.random() > 0.5 ? 'Medium' : 'Low',
      difficulty: Math.floor(Math.random() * 50) + 25,
      trend: '+34%',
      opportunityScore: Math.floor(Math.random() * 25) + 75,
      cpcEstimate: `$${(Math.random() * 4 + 2).toFixed(2)}`,
      topVideoTitle: `The Ultimate Guide to ${searchTerm.trim()}`,
      topVideoViews: `${(Math.floor(Math.random() * 400) + 120)}K views`,
    };

    setCustomKeywords([newMetric, ...customKeywords]);
    setSelectedKeyword(newMetric);
  };

  const relatedTags = [
    selectedKeyword.keyword,
    `${selectedKeyword.keyword} tutorial`,
    `${selectedKeyword.keyword} 2025`,
    `how to learn ${selectedKeyword.keyword}`,
    `best ${selectedKeyword.keyword} tips`,
    `${selectedKeyword.keyword} beginners guide`,
    `${selectedKeyword.keyword} mistakes`,
    `${selectedKeyword.keyword} roadmap`,
    `${selectedKeyword.keyword} vs`,
    `${selectedKeyword.keyword} project`,
  ];

  const copyAllTags = () => {
    navigator.clipboard.writeText(relatedTags.join(', '));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Search Banner */}
      <div className="glass-panel p-6 rounded-2xl">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Tag className="w-4 h-4" />
            <span>Search Volume & Algorithm Indexing</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            YouTube Keyword & Tag Matrix
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Search for any keyword to inspect search velocity, competition score, and copy high-traffic tags directly to your YouTube studio upload.
          </p>

          <form onSubmit={handleSearchSubmit} className="mt-5 flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search keywords (e.g., ai agents, system design, python fast api)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-purple-500 focus:outline-none text-sm text-white placeholder-slate-500"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-purple-950/50"
            >
              <span>Inspect</span>
            </button>
          </form>
        </div>
      </div>

      {/* Selected Keyword Breakdown HUD */}
      <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
        <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Inspecting Target Keyword:
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {selectedKeyword.trend} Trend
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1 capitalize">
              "{selectedKeyword.keyword}"
            </h3>
          </div>

          <button
            onClick={() => {
              if (onSelectTopicForTitle) onSelectTopicForTitle(selectedKeyword.keyword);
              onNavigate('title-generator');
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>Generate Titles for this Keyword</span>
          </button>
        </div>

        {/* 4 Quick Metric Gauges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Monthly Search Volume
            </span>
            <div className="text-2xl font-extrabold text-white mt-1">
              {selectedKeyword.searchVolumeDisplay}
            </div>
            <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">
              High Traffic Velocity
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Competition Difficulty
            </span>
            <div className="text-2xl font-extrabold text-slate-100 mt-1 flex items-baseline gap-1">
              {selectedKeyword.competitionScore}
              <span className="text-xs text-slate-400 font-normal">/ 100</span>
            </div>
            <span
              className={`text-[11px] font-semibold mt-1 block ${
                selectedKeyword.competitionScore < 40
                  ? 'text-emerald-400'
                  : selectedKeyword.competitionScore < 70
                  ? 'text-blue-400'
                  : 'text-amber-400'
              }`}
            >
              {selectedKeyword.competitionLabel} Saturation
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Opportunity Score
            </span>
            <div className="text-2xl font-extrabold text-purple-300 mt-1">
              {selectedKeyword.opportunityScore}
              <span className="text-xs text-slate-400 font-normal">/ 100</span>
            </div>
            <span className="text-[11px] text-purple-400 font-semibold mt-1 block">
              Algorithmic Goldmine
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Est. Monetization CPM
            </span>
            <div className="text-2xl font-extrabold text-cyan-300 mt-1">
              {selectedKeyword.cpcEstimate}
            </div>
            <span className="text-[11px] text-slate-400 font-medium mt-1 block">
              High commercial intent
            </span>
          </div>
        </div>

        {/* Tags Section & 1-Click Copy */}
        <div className="mt-6 p-4 rounded-xl bg-[#0a0e20] border border-slate-800">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Recommended YouTube Video Tags ({relatedTags.length})
              </span>
            </div>

            <button
              onClick={copyAllTags}
              className="px-3 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied All Tags!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy All Tags</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {relatedTags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Keywords Table with Filters */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl">
        <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Keyword Opportunity Radar</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any keyword to calculate its search ranking, tags, and competition.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 text-[11px] font-semibold">Filter:</span>
            <button
              onClick={() => setFilterDifficulty('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterDifficulty === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterDifficulty('low')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterDifficulty === 'low'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Low Competition
            </button>
            <button
              onClick={() => setFilterDifficulty('high')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterDifficulty === 'high'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              High Traffic
            </button>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <th className="pb-3 font-semibold">Keyword</th>
                <th className="pb-3 font-semibold">Search Volume</th>
                <th className="pb-3 font-semibold">Competition</th>
                <th className="pb-3 font-semibold">Trend</th>
                <th className="pb-3 font-semibold">Opportunity</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredKeywords.map((k, i) => {
                const isSelected = selectedKeyword.keyword === k.keyword;
                return (
                  <tr
                    key={i}
                    onClick={() => setSelectedKeyword(k)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-purple-950/30 text-white'
                        : 'hover:bg-slate-800/40 text-slate-300'
                    }`}
                  >
                    <td className="py-3 font-semibold flex items-center gap-2">
                      <span className="capitalize">{k.keyword}</span>
                      {k.opportunityScore >= 90 && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Breakout
                        </span>
                      )}
                    </td>
                    <td className="py-3 font-medium text-white">{k.searchVolumeDisplay}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          k.competitionScore < 40
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : k.competitionScore < 70
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {k.competitionLabel} ({k.competitionScore})
                      </span>
                    </td>
                    <td className="py-3 font-bold text-emerald-400">{k.trend}</td>
                    <td className="py-3 font-bold text-purple-300">{k.opportunityScore}/100</td>
                    <td className="py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedKeyword(k);
                        }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-purple-600 text-slate-200 hover:text-white transition-colors text-[11px]"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
