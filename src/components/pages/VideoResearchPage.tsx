import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  Flame,
  Search,
  ArrowUpRight,
  Target,
  BarChart2,
  Bookmark,
  Share2,
  Copy,
  Check,
  TrendingUp,
  HelpCircle,
  Lightbulb,
  Radio,
} from 'lucide-react';
import { ChannelProfile, PageId } from '../../types';

interface VideoResearchPageProps {
  channel: ChannelProfile;
  onNavigate: (page: PageId) => void;
  onSelectTopicForTitle?: (topic: string) => void;
}

export const VideoResearchPage: React.FC<VideoResearchPageProps> = ({
  channel,
  onNavigate,
  onSelectTopicForTitle,
}) => {
  const [searchTopic, setSearchTopic] = useState(channel.niche);
  const [isLoading, setIsLoading] = useState(false);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'breakout' | 'content-gaps' | 'formats'>('breakout');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const initialOpportunities = [
    {
      topic: 'Why 99% of Autonomous AI Agents Fail in Production',
      searchVolume: 'Very High',
      competition: 'Low',
      velocityScore: 96,
      contentGap: 'Most creators show simple toy scripts; nobody explains memory leaks, rate limiting, and vector DB latency.',
      targetFormat: 'Deep Dive Case Study',
      recommendedAngle: 'Show benchmark tests comparing framework overhead vs raw LLM calls.',
    },
    {
      topic: 'The $300 Mini PC Setup That Outperforms a $2,000 Mac Studio for AI',
      searchVolume: 'Very High',
      competition: 'Medium',
      velocityScore: 94,
      contentGap: 'High contrast between cheap hardware and high performance always triggers viral sharing.',
      targetFormat: 'Hardware Comparison & Benchmark',
      recommendedAngle: 'Real-time side-by-side inference speed test running DeepSeek & Llama 3.',
    },
    {
      topic: 'The Clean Architecture Blueprint Every Senior Dev Swears By',
      searchVolume: 'High',
      competition: 'Medium',
      velocityScore: 89,
      contentGap: 'Overwhelming theoretical books; viewers want a 15-minute practical file-tree walkthrough.',
      targetFormat: 'Masterclass Tutorial',
      recommendedAngle: 'Live refactor of a chaotic spaghetti code codebase into clean domain layers.',
    },
    {
      topic: 'Stop Writing API Routes Like This in 2025',
      searchVolume: 'High',
      competition: 'Low',
      velocityScore: 91,
      contentGap: 'Recent shifts in edge runtimes and streaming protocols make old REST patterns obsolete.',
      targetFormat: 'Contrarian Tutorial',
      recommendedAngle: 'Compare latency metrics between old synchronous patterns vs modern streams.',
    },
    {
      topic: 'How I Built a Profitable Micro-SaaS in 7 Days (Full Transparency)',
      searchVolume: 'High',
      competition: 'Medium',
      velocityScore: 88,
      contentGap: 'Audiences love real Stripe dashboards and genuine technical mistakes over vague motivational talks.',
      targetFormat: 'Documentary / Build in Public',
      recommendedAngle: 'Show actual database logs, customer feedback chats, and zero marketing spend tactics.',
    },
  ];

  const currentOpportunities = opportunities.length > 0 ? opportunities : initialOpportunities;

  const handleResearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchTopic.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/gemini/research-topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche: channel.niche, topic: searchTopic }),
      });
      const data = await res.json();
      if (data.opportunities && Array.isArray(data.opportunities)) {
        setOpportunities(data.opportunities);
      }
    } catch (err) {
      console.error('Research error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseInTitle = (topic: string) => {
    if (onSelectTopicForTitle) {
      onSelectTopicForTitle(topic);
    }
    onNavigate('title-generator');
  };

  const copyTopic = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Search Header Banner */}
      <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Compass className="w-4 h-4" />
            <span>AI Predictive Niche Intelligence</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Discover Untapped Breakout Video Opportunities
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
            Our algorithm scans YouTube search velocity, viewer retention dropouts, and competitor supply gaps to surface high-converting video concepts.
          </p>

          {/* Search Bar Form */}
          <form onSubmit={handleResearch} className="mt-5 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTopic}
                onChange={(e) => setSearchTopic(e.target.value)}
                placeholder="Enter niche or topic (e.g., Local AI, Next.js 15, Calisthenics, Cyberpunk)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-purple-500 focus:outline-none text-sm text-white placeholder-slate-500"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-purple-950/50 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 transition-all"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Scanning Trends...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <span>Analyze Topics</span>
                </>
              )}
            </button>
          </form>

          {/* Preset quick pills */}
          <div className="mt-3 flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-400 text-[11px]">Trending in your niche:</span>
            {['Autonomous Agents', 'Apple M4 Studio', 'PostgreSQL Internals', 'Rust vs Go 2025'].map(
              (pill) => (
                <button
                  key={pill}
                  onClick={() => {
                    setSearchTopic(pill);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-300 text-[11px] transition-colors"
                >
                  {pill}
                </button>
              )
            )}
          </div>
        </div>

        <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('breakout')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'breakout'
              ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>Breakout Topics Radar</span>
        </button>

        <button
          onClick={() => setActiveTab('content-gaps')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'content-gaps'
              ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>Content Gap Finder</span>
        </button>

        <button
          onClick={() => setActiveTab('formats')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'formats'
              ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-emerald-400" />
          <span>High-Retention Formats</span>
        </button>
      </div>

      {/* Tab 1: Breakout Topics Radar */}
      {activeTab === 'breakout' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentOpportunities.map((item, idx) => (
              <div
                key={idx}
                className="glass-panel p-5 rounded-2xl flex flex-col justify-between group hover:border-purple-500/50 transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      {item.targetFormat}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
                      <Flame className="w-3.5 h-3.5" />
                      <span>{item.velocityScore}/100</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-base text-white group-hover:text-purple-300 transition-colors leading-snug">
                    {item.topic}
                  </h3>

                  <div className="mt-3 space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300">
                      <strong className="text-cyan-400 font-semibold block text-[11px] mb-1">
                        Untapped Content Gap:
                      </strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {item.contentGap}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/20 text-slate-300">
                      <strong className="text-purple-300 font-semibold block text-[11px] mb-1">
                        Winning Angle:
                      </strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {item.recommendedAngle}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>Vol: <strong className="text-slate-200">{item.searchVolume}</strong></span>
                    <span>•</span>
                    <span>Comp: <strong className="text-slate-200">{item.competition}</strong></span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => copyTopic(item.topic, `opp-${idx}`)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      title="Copy topic title"
                    >
                      {copiedId === `opp-${idx}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleUseInTitle(item.topic)}
                      className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-sm flex items-center gap-1 transition-colors"
                    >
                      <span>Craft Titles</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Content Gap Finder */}
      {activeTab === 'content-gaps' && (
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white">Audience Question Gaps</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              High-intent queries with poor video results on YouTube. Making a focused video here guarantees evergreen search traffic.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                question: 'How do I prevent my AI agent from getting stuck in infinite tool loops?',
                searches: '38K / mo',
                currentQuality: 'Weak (only forum threads & text docs)',
                potentialRank: 'Top 3 guaranteed with practical code sample',
                format: '5-Minute Fix Tutorial',
              },
              {
                question: 'Can you run Llama 3.3 locally on 16GB Unified RAM without stutter?',
                searches: '74K / mo',
                currentQuality: 'Outdated (based on older v1 benchmarks)',
                potentialRank: 'High breakout potential with screen-recorded FPS benchmark',
                format: 'Hardware Stress Test',
              },
              {
                question: 'What is the real difference between Server Actions and API Routes?',
                searches: '92K / mo',
                currentQuality: 'Confusing / over-abstracted official docs',
                potentialRank: 'Huge evergreen demand among modern full-stack web devs',
                format: 'Visual Diagram & Live Code',
              },
            ].map((gap, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {gap.format}
                    </span>
                    <span className="text-xs text-slate-400">Demand: <strong className="text-white">{gap.searches}</strong></span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{gap.question}</h4>
                  <p className="text-xs text-amber-400/90">Competitor Supply: {gap.currentQuality}</p>
                </div>

                <button
                  onClick={() => handleUseInTitle(gap.question)}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold whitespace-nowrap shadow-sm"
                >
                  Generate Video Blueprint
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: High Retention Formats */}
      {activeTab === 'formats' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              format: 'Extreme Contrast Blind Test',
              retention: '68% AVD',
              example: '$50 Microphone vs $2,000 Studio Mic',
              why: 'Viewers stay until the final reveal to test their own ear/judgement.',
            },
            {
              format: 'The 30-Day Immersion Challenge',
              retention: '62% AVD',
              example: 'I Coded 10 Hours a Day for 30 Days',
              why: 'Narrative tension, physical transformation, and relatable struggle.',
            },
            {
              format: 'Reverse-Engineering Masterclass',
              retention: '59% AVD',
              example: 'How Netflix Handles 200M Streams Simultaneously',
              why: 'Prestige topic; appeals to professional career aspirations.',
            },
          ].map((fmt, i) => (
            <div key={i} className="glass-panel p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400">{fmt.retention}</span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                  Top Format
                </span>
              </div>
              <h4 className="text-base font-bold text-white">{fmt.format}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{fmt.why}</p>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                <span className="text-slate-400 text-[10px] block">Template Example:</span>
                "{fmt.example}"
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
