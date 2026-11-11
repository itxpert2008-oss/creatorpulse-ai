import React, { useState } from 'react';
import {
  Type,
  Sparkles,
  Copy,
  Check,
  TrendingUp,
  Bookmark,
  Share2,
  ArrowRight,
  Flame,
  Layers,
  HelpCircle,
  Zap,
} from 'lucide-react';
import { TitleOption, ChannelProfile, PageId } from '../../types';

interface TitleGeneratorPageProps {
  channel: ChannelProfile;
  initialTopic?: string;
  onNavigate: (page: PageId) => void;
  onSelectTitleForDescription?: (title: string) => void;
}

export const TitleGeneratorPage: React.FC<TitleGeneratorPageProps> = ({
  channel,
  initialTopic = '',
  onNavigate,
  onSelectTitleForDescription,
}) => {
  const [topic, setTopic] = useState(
    initialTopic || 'How to Build an Autonomous AI Coding Agent'
  );
  const [niche, setNiche] = useState(channel.niche);
  const [style, setStyle] = useState('Curiosity Gap');
  const [audience, setAudience] = useState('Software engineers & tech enthusiasts');
  const [isLoading, setIsLoading] = useState(false);
  const [titles, setTitles] = useState<TitleOption[]>([
    {
      title: 'Why Nobody Talks About Local AI Agents (Until Now)',
      predictedCtr: 12.8,
      hookType: 'Curiosity Gap',
      reasoning: 'Creates immediate information asymmetry making viewers feel they are missing out on hidden knowledge.',
      abTestVariation: 'The Untold Truth About Local AI Agents',
    },
    {
      title: 'I Built a Full Autonomous Agent in 15 Minutes. Here’s How.',
      predictedCtr: 13.4,
      hookType: 'Story & Speed Promise',
      reasoning: 'Low friction time commitment (15 mins) coupled with high perceived payoff drives rapid clicks.',
      abTestVariation: 'How to Build an AI Agent in 15 Minutes (Step-by-Step)',
    },
    {
      title: 'STOP Building AI Agents Like This! (5 Costly Architecture Flaws)',
      predictedCtr: 14.1,
      hookType: 'Negativity Bias',
      reasoning: 'Loss aversion is psychologically 2.5x more powerful than potential gains for technical audiences.',
      abTestVariation: 'The 5 Architecture Mistakes Ruining Your AI Agents',
    },
    {
      title: 'The AI Agent Architecture Powering Billion-Dollar Startups',
      predictedCtr: 11.6,
      hookType: 'Authority & Scale',
      reasoning: 'Prestige framing connects the tutorial directly to high financial and career stakes.',
      abTestVariation: 'Inside the Production AI Architecture of Silicon Valley',
    },
    {
      title: 'How Top 1% Engineers Actually Use AI Agents in 2025',
      predictedCtr: 12.2,
      hookType: 'Status & Elitism',
      reasoning: 'Viewers want to know what the top 1% are doing to stay ahead of the replacement curve.',
      abTestVariation: 'The 1% AI Workflow Nobody is Talking About',
    },
  ]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [savedTitles, setSavedTitles] = useState<string[]>([]);

  const hookStyles = [
    { id: 'Curiosity Gap', label: 'Curiosity Gap', desc: 'MrBeast / Veritasium intrigue' },
    { id: 'Negativity Bias', label: 'Urgent Warning', desc: 'Stop doing this / Costly mistake' },
    { id: 'Story & Proof', label: 'Story & Transformation', desc: 'I tried X for 30 days' },
    { id: 'Authority & Scale', label: 'High Authority', desc: 'Top 1% / Production secrets' },
    { id: 'Ultimate Guide', label: 'Dense Value', desc: 'Zero to mastery in 10 minutes' },
  ];

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/gemini/generate-titles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          niche,
          style,
          audience,
        }),
      });

      const data = await response.json();
      if (data.titles && Array.isArray(data.titles)) {
        setTitles(data.titles);
      }
    } catch (err) {
      console.error('Error generating titles:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyTitle = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const toggleSaveTitle = (text: string) => {
    if (savedTitles.includes(text)) {
      setSavedTitles(savedTitles.filter((t) => t !== text));
    } else {
      setSavedTitles([...savedTitles, text]);
    }
  };

  const handleSendToDescription = (titleText: string) => {
    if (onSelectTitleForDescription) {
      onSelectTitleForDescription(titleText);
    }
    onNavigate('description-generator');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Studio Header */}
      <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>Algorithmic Click-Through Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            High-CTR YouTube Title Studio
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
            Generate titles engineered with proven psychological triggers, character-length optimization, and simulated click-through rates.
          </p>

          <form onSubmit={handleGenerate} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Video Topic or Raw Idea:
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. How to use Docker in 2025, M4 Mac Mini review, Leg workout routine..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-purple-500 focus:outline-none text-sm text-white placeholder-slate-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Target Niche:
                </label>
                <input
                  type="text"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 focus:border-purple-500 focus:outline-none text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Target Audience Persona:
                </label>
                <input
                  type="text"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 focus:border-purple-500 focus:outline-none text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Psychological Hook Strategy:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {hookStyles.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setStyle(item.id)}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      style === item.id
                        ? 'bg-purple-600/30 border-purple-500 text-white shadow-sm'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-xs text-slate-100">{item.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 truncate">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-950/50 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 transition-all"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Neural Model Calculating High-CTR Titles...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-cyan-300" />
                    <span>Generate High-CTR Titles</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Generated Titles Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">Generated Viral Title Concepts</h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {titles.length} Formats
            </span>
          </div>

          <span className="text-xs text-slate-400 hidden sm:inline">
            Optimal YouTube Title length: <strong>50 - 65 characters</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {titles.map((item, idx) => {
            const charCount = item.title.length;
            const isOptimalLength = charCount >= 45 && charCount <= 70;
            const isSaved = savedTitles.includes(item.title);

            return (
              <div
                key={idx}
                className="glass-panel p-5 rounded-2xl flex flex-col justify-between group hover:border-purple-500/50 transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {item.hookType}
                    </span>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          isOptimalLength
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                        title="Character count. 50-65 chars ensures titles don't get truncated on mobile."
                      >
                        {charCount} chars
                      </span>

                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-extrabold">
                        <Flame className="w-3 h-3 text-amber-400" />
                        {item.predictedCtr}% CTR
                      </div>
                    </div>
                  </div>

                  <h4 className="font-extrabold text-base text-white group-hover:text-purple-300 transition-colors leading-snug">
                    {item.title}
                  </h4>

                  <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                    <strong className="text-slate-300 font-semibold">Why this converts:</strong> {item.reasoning}
                  </p>

                  <div className="mt-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                    <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wide block mb-0.5">
                      Recommended A/B Thumbnail Test Variant:
                    </span>
                    <span className="text-slate-300 italic font-medium">"{item.abTestVariation}"</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => copyTitle(item.title, idx)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => toggleSaveTitle(item.title)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        isSaved
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                      title={isSaved ? 'Saved to favorites' : 'Save title'}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleSendToDescription(item.title)}
                    className="px-3 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/40 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <span>Build Description</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
