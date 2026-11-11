import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Copy,
  Check,
  Clock,
  Tag,
  Link,
  ChevronDown,
  Layers,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { DescriptionResult, ChannelProfile, PageId } from '../../types';

interface DescriptionGeneratorPageProps {
  channel: ChannelProfile;
  initialTitle?: string;
  onNavigate: (page: PageId) => void;
}

export const DescriptionGeneratorPage: React.FC<DescriptionGeneratorPageProps> = ({
  channel,
  initialTitle = '',
  onNavigate,
}) => {
  const [videoTitle, setVideoTitle] = useState(
    initialTitle || 'I Built an Autonomous AI Coding Agent (Full Step-by-Step Architecture)'
  );
  const [keyPoints, setKeyPoints] = useState(
    'Architecture overview, prompt engineering secrets, memory persistence, tool execution sandbox, common failure traps, GitHub repo walkthrough'
  );
  const [cta, setCta] = useState('Subscribe and star the open-source repository');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const [descriptionData, setDescriptionData] = useState<DescriptionResult>({
    hook: `In this deep dive, we build a production-ready autonomous AI agent from scratch without relying on bloated frameworks. If you want to understand how autonomous systems actually plan, self-correct, and execute code in real time, this walkthrough is for you.`,
    summary: `Welcome back to the channel! Today we're peeling back the layers on autonomous AI engineering.\n\nMost tutorials only show surface-level API wrappers that break as soon as edge cases emerge. In this video, we build a real multi-step execution loop, design a bulletproof sandbox, and solve the memory persistence bottleneck that plagues 90% of open-source agent projects.`,
    chapters: [
      { time: '0:00', title: 'Why Framework Agents Fail in Production' },
      { time: '01:45', title: 'The Core Autonomous Loop Architecture' },
      { time: '04:20', title: 'Tool Execution & Sandbox Isolation' },
      { time: '08:15', title: 'Solving Long-Term Memory & Context Windows' },
      { time: '12:40', title: 'Live Code Execution & Stress Test' },
      { time: '16:10', title: '3 Security Traps to Avoid in 2025' },
      { time: '18:30', title: 'Next Steps & Open Source Repo' },
    ],
    keyTakeaways: [
      'Why stateful memory outperforms stateless chain prompts.',
      'How to isolate code execution environments safely.',
      'Optimizing token consumption to reduce API costs by 60%.',
      'Production failure traps and fallback safeguards.',
    ],
    hashtags: ['#AIAgents', '#SoftwareEngineering', '#MachineLearning', '#PythonCoding', '#FullStack'],
    seoTags: [
      'autonomous ai agent tutorial',
      'how to build an ai agent',
      'ai agents from scratch',
      'python ai agent',
      'llm memory architecture',
      'local ai agent development',
      'langchain alternative',
      'ai coding assistant',
      'machine learning tutorial 2025',
      'software engineering architecture',
    ],
    resourcesTemplate: `🔗 RESOURCES & CODE REPOSITORY:\n• GitHub Repo: https://github.com/techcraft/autonomous-agent\n• Architecture Diagram PDF: https://creatorpulse.ai/diagram\n• Discord Developer Community: https://discord.gg/techcraft\n\n📱 FOLLOW TECHCRAFT:\n• Twitter / X: https://x.com/techcraft\n• Newsletter: https://techcraft.beehiiv.com\n\n⚖️ AFFILIATE DISCLAIMER:\nSome links above may be affiliate links. If you purchase through them, we may receive a small commission at no extra cost to you. Thank you for supporting independent developer education!`,
    fullFormattedText: '',
  });

  const getFullText = () => {
    return `${descriptionData.hook}\n\n${descriptionData.summary}\n\n⏱️ TIMESTAMPS & CHAPTERS:\n${descriptionData.chapters
      .map((c) => `${c.time} - ${c.title}`)
      .join('\n')}\n\n💡 KEY TAKEAWAYS:\n${descriptionData.keyTakeaways
      .map((t) => `• ${t}`)
      .join('\n')}\n\n${descriptionData.resourcesTemplate}\n\n${descriptionData.hashtags.join(' ')}`;
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!videoTitle.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/gemini/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: videoTitle,
          keyPoints,
          cta,
        }),
      });

      const data = await response.json();
      if (data.data) {
        setDescriptionData(data.data);
      }
    } catch (err) {
      console.error('Error generating description:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Studio Banner */}
      <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">
            <FileText className="w-4 h-4 text-cyan-300" />
            <span>YouTube SEO & Metadata Architect</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            SEO Description & Chapter Generator
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
            Format descriptions that rank in YouTube and Google Search Key Moments with optimized hooks, timestamps, affiliate disclaimers, and tags.
          </p>

          <form onSubmit={handleGenerate} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Video Title:
              </label>
              <input
                type="text"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="Enter your video title..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-purple-500 focus:outline-none text-sm text-white placeholder-slate-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Key Video Highlights / Topics Covered:
                </label>
                <textarea
                  rows={2}
                  value={keyPoints}
                  onChange={(e) => setKeyPoints(e.target.value)}
                  placeholder="Outline topics covered in the video..."
                  className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 focus:border-purple-500 focus:outline-none text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Primary Call To Action (CTA):
                </label>
                <textarea
                  rows={2}
                  value={cta}
                  onChange={(e) => setCta(e.target.value)}
                  placeholder="e.g. Download the free checklist, join discord..."
                  className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 focus:border-purple-500 focus:outline-none text-xs text-white"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-950/50 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 transition-all"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Formatting SEO Metadata...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-cyan-300" />
                    <span>Generate Full Description</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Main Results HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Structured Sections */}
        <div className="lg:col-span-2 space-y-4">
          {/* Section 1: Above the fold hook */}
          <div className="glass-panel p-5 rounded-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                  Above-the-Fold Hook (Visible Before 'Show More')
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Critical for search snippet CTR and retaining viewer curiosity.
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(descriptionData.hook, 'hook')}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === 'hook' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="mt-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
              {descriptionData.hook}
            </div>
          </div>

          {/* Section 2: Timestamps / Chapters */}
          <div className="glass-panel p-5 rounded-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Video Chapters & Key Moments ({descriptionData.chapters.length})
                </span>
              </div>
              <button
                onClick={() =>
                  copyToClipboard(
                    descriptionData.chapters.map((c) => `${c.time} - ${c.title}`).join('\n'),
                    'chapters'
                  )
                }
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === 'chapters' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>Copy Chapters</span>
              </button>
            </div>

            <div className="mt-3 divide-y divide-slate-800/80 bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden">
              {descriptionData.chapters.map((chap, i) => (
                <div key={i} className="px-3.5 py-2 flex items-center justify-between text-xs hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-purple-400 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-500/20">
                      {chap.time}
                    </span>
                    <span className="font-medium text-slate-200">{chap.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Targeted Tags & Hashtags */}
          <div className="glass-panel p-5 rounded-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Optimized Tags & Hashtags
                </span>
              </div>
              <button
                onClick={() =>
                  copyToClipboard(
                    `${descriptionData.hashtags.join(' ')}\n\nTags:\n${descriptionData.seoTags.join(', ')}`,
                    'tags'
                  )
                }
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === 'tags' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="mt-3 space-y-3">
              <div>
                <span className="text-[11px] text-slate-400 font-semibold block mb-1.5">
                  Top Video Hashtags (For Video Title Header):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {descriptionData.hashtags.map((h, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs font-mono font-medium"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 font-semibold block mb-1.5">
                  Backend Studio Tags (Comma Separated):
                </span>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 leading-relaxed font-mono">
                  {descriptionData.seoTags.join(', ')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Ready-to-Paste Preview & Copy All */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-purple-400" />
                Full Description Preview
              </span>
              <button
                onClick={() => copyToClipboard(getFullText(), 'full')}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-purple-950/50 cursor-pointer transition-all"
              >
                {copiedSection === 'full' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Copied All!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Full Description</span>
                  </>
                )}
              </button>
            </div>

            <div className="mt-4 p-3.5 rounded-xl bg-[#070914] border border-slate-800 text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed h-[480px] overflow-y-auto selection:bg-purple-600">
              {getFullText()}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Character count: ~{getFullText().length} / 5,000</span>
            <span className="text-emerald-400 font-semibold">Ready for YouTube</span>
          </div>
        </div>
      </div>
    </div>
  );
};
