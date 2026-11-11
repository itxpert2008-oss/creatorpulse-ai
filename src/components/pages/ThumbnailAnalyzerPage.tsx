import React, { useState, useRef } from 'react';
import {
  Image as ImageIcon,
  Sparkles,
  Upload,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Smartphone,
  Monitor,
  Flame,
  ShieldAlert,
  ArrowRight,
  Maximize2,
  RefreshCw,
} from 'lucide-react';
import { ThumbnailAuditResult, ChannelProfile, PageId } from '../../types';

interface ThumbnailAnalyzerPageProps {
  channel: ChannelProfile;
  onNavigate: (page: PageId) => void;
}

export const ThumbnailAnalyzerPage: React.FC<ThumbnailAnalyzerPageProps> = ({
  channel,
  onNavigate,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleThumbnails = [
    {
      id: 'thumb1',
      title: 'Autonomous AI Agent (High CTR Winner)',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      tag: '11.2% Actual CTR',
      overlayText: 'AI BUILT THIS?',
    },
    {
      id: 'thumb2',
      title: 'M4 Mac Mini Review (Hardware)',
      url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
      tag: '10.4% Actual CTR',
      overlayText: 'BRUTAL TRUTH',
    },
    {
      id: 'thumb3',
      title: 'Docker Security Mistakes (Text Heavy)',
      url: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=800&q=80',
      tag: '8.8% CTR (Needs Fix)',
      overlayText: 'DOCKER MISTAKES',
    },
    {
      id: 'thumb4',
      title: 'High Protein Nutrition Test',
      url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80',
      tag: '11.9% Actual CTR',
      overlayText: '200g DAILY?',
    },
  ];

  const [currentImage, setCurrentImage] = useState<string>(sampleThumbnails[0].url);
  const [videoTitle, setVideoTitle] = useState('I Built an Autonomous AI Agent (No Frameworks)');
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop' | 'raw'>('mobile');
  const [showSafeZone, setShowSafeZone] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [audit, setAudit] = useState<ThumbnailAuditResult>({
    overallScore: 88,
    ratings: {
      visualClutter: 8.5,
      contrast: 9.2,
      textReadability: 8.6,
      emotionalHook: 8.4,
      mobileLegibility: 8.9,
    },
    strengths: [
      'High-contrast neon cyan & purple focal point grabs attention against YouTube dark mode background.',
      'Single strong visual anchor prevents viewer cognitive overload in the 1.5-second feed scan.',
      'Text overlay is bold, high-contrast, and limited to under 4 punchy words.',
    ],
    improvements: [
      'The bottom-right corner has minor visual detail that will be obstructed by YouTube’s duration badge (18:42). Keep this area clean.',
      'Slightly increase the drop shadow or dark stroke behind the text to maintain readability on low-brightness mobile screens.',
      'Consider testing an arrow pointing towards the central processor node to drive visual hierarchy.',
    ],
    verdict: 'Excellent thumbnail with estimated 10.5% - 12.2% baseline CTR. High conversion probability on mobile browse and home feeds.',
    timestampSafeZone: true,
    abTestRecommendation: 'Test against a high-contrast face reaction variant with an expression of shock or intense focus.',
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCurrentImage(reader.result);
        runAudit(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const runAudit = async (imgData: string) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/gemini/analyze-thumbnail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imgData,
          videoTitle: videoTitle,
        }),
      });

      const data = await response.json();
      if (data.analysis) {
        setAudit(data.analysis);
      }
    } catch (err) {
      console.error('Audit failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Studio Banner */}
      <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Multi-Modal Vision Inspection</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            AI Thumbnail Vision & CTR Audit
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
            Test your thumbnail against YouTube algorithm heuristics: mobile legibility, 3-second hook conversion, timestamp duration safe zones, and visual contrast.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-purple-950/50 cursor-pointer transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Custom Thumbnail</span>
            </button>

            <button
              onClick={() => runAudit(currentImage)}
              disabled={isAnalyzing}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>Re-Run AI Audit</span>
            </button>

            <span className="text-xs text-slate-400">or test with presets below:</span>
          </div>

          {/* Preset Thumbnails */}
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {sampleThumbnails.map((preset) => (
              <button
                key={preset.id}
                onClick={() => {
                  setCurrentImage(preset.url);
                  setVideoTitle(preset.title);
                  runAudit(preset.url);
                }}
                className={`p-1.5 rounded-xl border text-left transition-all ${
                  currentImage === preset.url
                    ? 'border-purple-500 bg-purple-950/40 ring-2 ring-purple-500/20'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="aspect-video w-full rounded-lg overflow-hidden relative">
                  <img src={preset.url} alt={preset.title} className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-1 px-1 rounded bg-black/80 text-[9px] font-mono text-white">
                    {preset.tag}
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 font-medium truncate mt-1">{preset.title}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Simulator HUD + AI Audit Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: YouTube Simulator Canvas */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel p-5 rounded-2xl">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Feed Simulator & Timestamp Safe Zone
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
                  <button
                    onClick={() => setViewMode('mobile')}
                    className={`px-2.5 py-1 rounded-md flex items-center gap-1 font-medium ${
                      viewMode === 'mobile' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Mobile Feed</span>
                  </button>
                  <button
                    onClick={() => setViewMode('desktop')}
                    className={`px-2.5 py-1 rounded-md flex items-center gap-1 font-medium ${
                      viewMode === 'desktop' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>Desktop</span>
                  </button>
                </div>

                <button
                  onClick={() => setShowSafeZone(!showSafeZone)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                    showSafeZone
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                  title="Toggle YouTube duration timer safe zone badge"
                >
                  Safe Zone: {showSafeZone ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            {/* Mobile YouTube Feed Mockup */}
            {viewMode === 'mobile' && (
              <div className="mt-4 max-w-sm mx-auto bg-[#0f0f0f] rounded-2xl p-3 border border-slate-800 shadow-2xl">
                {/* Simulated YouTube Video Card */}
                <div className="relative aspect-video rounded-xl overflow-hidden group">
                  <img src={currentImage} alt="Thumbnail preview" className="w-full h-full object-cover" />

                  {/* YouTube Duration badge in bottom-right */}
                  <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/90 text-white font-mono text-[10px] font-bold tracking-wider z-10">
                    14:28
                  </span>

                  {/* Safe Zone Overlay alert */}
                  {showSafeZone && (
                    <div className="absolute bottom-0 right-0 w-28 h-14 bg-rose-500/30 border-2 border-dashed border-rose-400 rounded-tl-xl flex items-center justify-center p-1 pointer-events-none z-10">
                      <span className="text-[9px] font-bold text-white bg-rose-600/90 px-1 py-0.5 rounded shadow">
                        Duration Block Zone
                      </span>
                    </div>
                  )}
                </div>

                {/* Video metadata row */}
                <div className="mt-3 flex gap-3">
                  <img src={channel.avatar} alt={channel.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-white line-clamp-2 leading-snug">
                      {videoTitle}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {channel.name} • 184K views • 3 days ago
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Desktop YouTube Search Mockup */}
            {viewMode === 'desktop' && (
              <div className="mt-4 bg-[#0f0f0f] rounded-2xl p-4 border border-slate-800 shadow-2xl">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative aspect-video w-full sm:w-64 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={currentImage} alt="Thumbnail" className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/90 text-white font-mono text-[10px] font-bold">
                      14:28
                    </span>
                    {showSafeZone && (
                      <div className="absolute bottom-0 right-0 w-24 h-12 bg-rose-500/30 border-2 border-dashed border-rose-400 rounded-tl-xl flex items-center justify-center pointer-events-none">
                        <span className="text-[8px] font-bold text-white bg-rose-600 px-1 rounded">
                          Badge Zone
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-white line-clamp-2">{videoTitle}</h4>
                    <p className="text-xs text-slate-400 mt-1">184K views • 3 days ago</p>
                    <div className="flex items-center gap-2 mt-2">
                      <img src={channel.avatar} alt={channel.name} className="w-5 h-5 rounded-full object-cover" />
                      <span className="text-xs text-slate-300 font-medium">{channel.name}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                      In this breakdown, we reveal the exact system architecture and performance tricks...
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-300">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                72% of YouTube impressions occur on mobile feeds under 200px width.
              </span>
              <span className="text-purple-400 font-semibold">Aspect 16:9 • 1280x720</span>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: AI Neural Evaluation Breakdown */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-5 rounded-2xl space-y-4">
            {/* Overall Score Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Algorithmic Click Potential
                </span>
                <h3 className="text-base font-bold text-white">Thumbnail Vision Score</h3>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-300">
                  {audit.overallScore}
                </div>
                <div className="text-xs text-slate-400 leading-tight">
                  / 100<br />
                  <span className="text-emerald-400 font-bold">Grade A</span>
                </div>
              </div>
            </div>

            {/* Verdict summary */}
            <p className="text-xs text-slate-300 leading-relaxed bg-purple-950/20 p-3 rounded-xl border border-purple-500/20">
              {audit.verdict}
            </p>

            {/* 5 Dimension Progress Bars */}
            <div className="space-y-2.5">
              {[
                { label: 'Contrast Separation', score: audit.ratings.contrast },
                { label: 'Mobile Text Legibility', score: audit.ratings.textReadability },
                { label: '3-Second Emotional Hook', score: audit.ratings.emotionalHook },
                { label: 'Low Visual Clutter', score: audit.ratings.visualClutter },
                { label: 'Small-Screen Focal Point', score: audit.ratings.mobileLegibility },
              ].map((bar, i) => (
                <div key={i} className="text-xs">
                  <div className="flex items-center justify-between text-slate-300 mb-1">
                    <span className="font-medium text-[11px]">{bar.label}</span>
                    <span className="font-bold text-purple-400">{bar.score} / 10</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${bar.score * 10}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Strengths */}
            <div className="pt-2 border-t border-slate-800">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Algorithm Strengths
              </span>
              <ul className="space-y-1.5 text-[11px] text-slate-400">
                {audit.strengths.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actionable Improvements */}
            <div className="pt-2 border-t border-slate-800">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-3.5 h-3.5" />
                Recommended CTR Fixes
              </span>
              <ul className="space-y-1.5 text-[11px] text-slate-400">
                {audit.improvements.map((imp, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* A/B Test Recommendation */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block mb-1">
                Suggested A/B Test Variant:
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed italic">
                {audit.abTestRecommendation}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
