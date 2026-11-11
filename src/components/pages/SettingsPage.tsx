import React, { useState } from 'react';
import {
  Settings,
  Sparkles,
  Server,
  ShieldCheck,
  Download,
  CheckCircle2,
  Tv,
  RefreshCw,
  Database,
  Sliders,
  ExternalLink,
  Code,
  Flame,
} from 'lucide-react';
import { ChannelProfile, PageId } from '../../types';
import { DEMO_CHANNELS } from '../../data/demoChannels';

interface SettingsPageProps {
  channel: ChannelProfile;
  onSelectChannel: (channelId: string) => void;
  onUpdateChannel: (updated: ChannelProfile) => void;
  hasGeminiKey: boolean;
  onNavigate: (page: PageId) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  channel,
  onSelectChannel,
  onUpdateChannel,
  hasGeminiKey,
  onNavigate,
}) => {
  // Custom simulator state
  const [customName, setCustomName] = useState(channel.name);
  const [customHandle, setCustomHandle] = useState(channel.handle);
  const [customNiche, setCustomNiche] = useState(channel.niche);
  const [customSubs, setCustomSubs] = useState(channel.subscribers.toString());
  const [customCtr, setCustomCtr] = useState(channel.avgCtr.toString());
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Health check test
  const [pingStatus, setPingStatus] = useState<string | null>(null);
  const [isPinging, setIsPinging] = useState(false);

  const handleSaveCustomProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const subsNum = parseInt(customSubs, 10) || channel.subscribers;
    const ctrNum = parseFloat(customCtr) || channel.avgCtr;

    const updated: ChannelProfile = {
      ...channel,
      name: customName,
      handle: customHandle,
      niche: customNiche,
      subscribers: subsNum,
      subscribersDisplay: `${(subsNum / 1000).toFixed(1)}K`,
      avgCtr: ctrNum,
    };

    onUpdateChannel(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const testServerPing = async () => {
    setIsPinging(true);
    const start = performance.now();
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      const latency = Math.round(performance.now() - start);
      setPingStatus(`Online (${latency}ms) - Model: ${data.model} - Status: ${data.status}`);
    } catch (err) {
      setPingStatus('Server connection failed');
    } finally {
      setIsPinging(false);
    }
  };

  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(channel, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${channel.id}-creatorpulse-analytics.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportCSV = () => {
    const headers = ['Video ID', 'Title', 'Views', 'CTR (%)', 'Retention (%)', 'Duration', 'Rank'];
    const rows = channel.recentVideos.map((v) => [
      v.id,
      `"${v.title.replace(/"/g, '""')}"`,
      v.views,
      v.ctr,
      v.retentionRate,
      v.duration,
      v.rank,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${channel.id}-videos-performance.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Settings className="w-4 h-4 text-cyan-300" />
            <span>Configuration & Simulation Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Channel Profile & AI Architecture Settings
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
            Switch between demo creator channels, simulate your own channel metrics, verify backend Google Gemini AI connectivity, or export analytics reports.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Preset Channel Switcher */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Tv className="w-4 h-4 text-purple-400" />
              Preset Creator Channels
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select a pre-configured channel to inspect different niche algorithm dynamics.
            </p>
          </div>

          <div className="space-y-3">
            {Object.values(DEMO_CHANNELS).map((c) => {
              const isSelected = c.id === channel.id;
              return (
                <div
                  key={c.id}
                  onClick={() => onSelectChannel(c.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-purple-950/40 border-purple-500 ring-1 ring-purple-500/30'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500/20"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-white">{c.name}</h4>
                        {isSelected && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{c.niche}</p>
                    </div>
                  </div>

                  <div className="text-right text-xs">
                    <div className="font-extrabold text-white">{c.subscribersDisplay} subs</div>
                    <div className="text-[11px] text-purple-400">{c.avgCtr}% avg CTR</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom Simulator Form */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Simulate Your Own Channel
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Customize name, niche, and subscriber scale to model your real-world channel.
            </p>
          </div>

          <form onSubmit={handleSaveCustomProfile} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Channel Name</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Handle</label>
                <input
                  type="text"
                  value={customHandle}
                  onChange={(e) => setCustomHandle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Niche Category</label>
              <input
                type="text"
                value={customNiche}
                onChange={(e) => setCustomNiche(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Subscriber Count</label>
                <input
                  type="number"
                  value={customSubs}
                  onChange={(e) => setCustomSubs(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Average CTR (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={customCtr}
                  onChange={(e) => setCustomCtr(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-all cursor-pointer shadow-md shadow-purple-950/40"
              >
                Apply Custom Channel
              </button>

              {saveSuccess && (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Channel Updated!
                </span>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Backend & Gemini AI Status */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              Full-Stack Backend & Google Gemini AI Engine
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Secure Node.js Express server architecture. API keys are strictly kept server-side and never exposed to client browsers.
            </p>
          </div>

          <button
            onClick={testServerPing}
            disabled={isPinging}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
            <span>Test Server Health</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
              Active Gemini Model
            </span>
            <div className="text-base font-extrabold text-white mt-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>gemini-3.8-flash</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-medium mt-1 block">
              Multi-modal Vision & Text Generation
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
              API Proxy Security
            </span>
            <div className="text-base font-extrabold text-white mt-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Server-Authoritative</span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium mt-1 block">
              Zero client bundle leakage
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
              Gemini Secret Status
            </span>
            <div className="text-base font-extrabold text-white mt-1 flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  hasGeminiKey ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-purple-400'
                }`}
              />
              <span>{hasGeminiKey ? 'Secret Connected' : 'Auto Fallback Active'}</span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium mt-1 block">
              {hasGeminiKey ? 'Live AI generation active' : 'Intelligent realistic generator active'}
            </span>
          </div>
        </div>

        {pingStatus && (
          <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs font-mono text-emerald-300">
            ✓ Backend Ping Response: {pingStatus}
          </div>
        )}
      </div>

      {/* Export & Data Report */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Download className="w-4 h-4 text-purple-400" />
            Export Channel Growth Audit
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Download your retention curves, outlier radar metrics, and recent video statistics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </button>
          <button
            onClick={exportJSON}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-purple-950/50 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download JSON</span>
          </button>
        </div>
      </div>
    </div>
  );
};
