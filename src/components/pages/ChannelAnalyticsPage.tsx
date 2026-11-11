import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Users,
  Clock,
  Eye,
  Award,
  ArrowUpRight,
  Flame,
  CheckCircle2,
  Calendar,
  Globe,
  Radio,
  Zap,
} from 'lucide-react';
import { ChannelProfile, PageId } from '../../types';

interface ChannelAnalyticsPageProps {
  channel: ChannelProfile;
  onNavigate: (page: PageId) => void;
}

export const ChannelAnalyticsPage: React.FC<ChannelAnalyticsPageProps> = ({
  channel,
  onNavigate,
}) => {
  const [timeframe, setTimeframe] = useState<'7d' | '28d' | '90d' | '365d'>('28d');
  const [activeMetricTab, setActiveMetricTab] = useState<'views' | 'subs' | 'watchtime'>('views');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Analytics Header */}
      <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <span>Full Spectrum Algorithmic Audits</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Channel Growth & Retention Intelligence
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
              Audience retention curves, traffic origin attribution, and algorithmic velocity benchmarks.
            </p>
          </div>

          {/* Timeframe pill switcher */}
          <div className="flex items-center bg-slate-900 p-1.5 rounded-xl border border-slate-800 text-xs font-semibold">
            {[
              { id: '7d', label: '7 Days' },
              { id: '28d', label: '28 Days' },
              { id: '90d', label: '90 Days' },
              { id: '365d', label: '1 Year' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTimeframe(t.id as any)}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  timeframe === t.id
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4 Scorecard Badges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-gradient-to-b from-[#0e1428] to-slate-950 border border-purple-500/30">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Thumbnail CTR</span>
            <span className="text-emerald-400 font-bold">Grade A</span>
          </div>
          <div className="text-2xl font-extrabold text-white mt-1">{channel.avgCtr}%</div>
          <span className="text-[11px] text-purple-300 font-semibold mt-1 block">
            +1.8% above niche median (7.6%)
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-b from-[#0e1428] to-slate-950 border border-blue-500/30">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>30s Hook Retention</span>
            <span className="text-emerald-400 font-bold">Grade A+</span>
          </div>
          <div className="text-2xl font-extrabold text-white mt-1">76%</div>
          <span className="text-[11px] text-blue-300 font-semibold mt-1 block">
            Top 10% in YouTube Studio
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-b from-[#0e1428] to-slate-950 border border-cyan-500/30">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Search SEO Index</span>
            <span className="text-cyan-400 font-bold">Grade A-</span>
          </div>
          <div className="text-2xl font-extrabold text-white mt-1">41% Search</div>
          <span className="text-[11px] text-cyan-300 font-semibold mt-1 block">
            Strong evergreen long-tail
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-b from-[#0e1428] to-slate-950 border border-emerald-500/30">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Algorithm Health Score</span>
            <span className="text-emerald-400 font-bold">92 / 100</span>
          </div>
          <div className="text-2xl font-extrabold text-white mt-1">Surging</div>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">
            High recommendation velocity
          </span>
        </div>
      </div>

      {/* Retention Curve Section */}
      <div className="glass-panel p-6 rounded-2xl">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <h3 className="text-base font-bold text-white">Audience Retention Curve (Avg. Video)</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Identifies exact timestamp drop-offs, replay spikes, and engagement dropouts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              Avg View Duration: {channel.avgAvd}
            </span>
          </div>
        </div>

        {/* Visual Retention Curve Graph */}
        <div className="mt-6">
          <div className="relative h-60 w-full flex items-end justify-between px-2 pt-6">
            {/* Horizontal guideline markers */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-slate-400 font-mono">
              <div className="border-b border-slate-800/80 w-full pb-0.5">100%</div>
              <div className="border-b border-slate-800/80 w-full pb-0.5">75%</div>
              <div className="border-b border-slate-800/80 w-full pb-0.5">50%</div>
              <div className="border-b border-slate-800/80 w-full pb-0.5">25%</div>
              <div className="border-b border-slate-800/80 w-full pb-0.5">0%</div>
            </div>

            {/* Retention curve steps */}
            {channel.retentionCurve.map((pt, i) => (
              <div
                key={i}
                className="relative flex flex-col items-center justify-end z-10 group cursor-pointer flex-1"
              >
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mb-2 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white whitespace-nowrap shadow-xl pointer-events-none absolute bottom-full">
                  <div className="font-bold text-purple-400">{pt.percentRemaining}% remaining</div>
                  <div className="text-[10px] text-slate-400">{pt.note}</div>
                </div>

                {/* Point Node */}
                <div
                  style={{ bottom: `${pt.percentRemaining}%` }}
                  className="absolute w-3.5 h-3.5 -mb-1.5 rounded-full bg-cyan-400 border-2 border-slate-950 shadow-md shadow-cyan-400/50 group-hover:scale-125 transition-transform"
                />

                <span className="text-[10px] font-mono text-slate-400 mt-2 block font-medium">
                  {pt.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Retention Key Insights */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-slate-800">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
              1. Strong 30s Hook (76%)
            </span>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Your opening proposition hooks 76% of viewers, outperforming the YouTube tech average of 64%.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block">
              2. Mid-Video Re-watch Spike
            </span>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Minute 5:30 exhibits replay scrubbing where users rewind to examine the architectural diagram.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
              3. Outro Drop-Off
            </span>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Retention dips 12% at the verbal outro cues. Insert YouTube End Screens 10 seconds earlier.
            </p>
          </div>
        </div>
      </div>

      {/* Traffic Attribution & Audience Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Sources */}
        <div className="glass-panel p-6 rounded-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Traffic Source Attribution</h3>
              <p className="text-xs text-slate-400 mt-0.5">Where your viewers discover your videos.</p>
            </div>
            <span className="text-xs text-purple-400 font-bold">28 Days Total</span>
          </div>

          <div className="mt-4 space-y-3.5">
            {channel.trafficSources.map((src, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-semibold flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: src.color }}
                    />
                    {src.source}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">{src.views.toLocaleString()} views</span>
                    <strong className="text-white font-bold">{src.percentage}%</strong>
                  </div>
                </div>

                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${src.percentage}%`,
                      backgroundColor: src.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audience Geography & Viewer Breakdown */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">Audience Geographies</h3>
                <p className="text-xs text-slate-400 mt-0.5">Top viewer markets driving high CPM.</p>
              </div>
              <span className="text-xs text-cyan-400 font-bold">Global Viewers</span>
            </div>

            <div className="mt-4 space-y-3">
              {[
                { country: 'United States', flag: '🇺🇸', share: 42, rpm: '$7.80' },
                { country: 'United Kingdom', flag: '🇬🇧', share: 14, rpm: '$6.40' },
                { country: 'Germany', flag: '🇩🇪', share: 11, rpm: '$6.10' },
                { country: 'India', flag: '🇮🇳', share: 18, rpm: '$2.10' },
                { country: 'Canada', flag: '🇨🇦', share: 8, rpm: '$6.90' },
              ].map((geo, i) => (
                <div key={i} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <div className="flex items-center gap-2 font-medium text-slate-200">
                    <span className="text-base">{geo.flag}</span>
                    <span>{geo.country}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">RPM: <strong className="text-emerald-400">{geo.rpm}</strong></span>
                    <span className="font-bold text-white">{geo.share}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Returning Viewers: <strong className="text-purple-400">44%</strong></span>
            <span>New Viewers: <strong className="text-cyan-400">56%</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
