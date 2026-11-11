export type PageId =
  | 'dashboard'
  | 'video-research'
  | 'keyword-explorer'
  | 'title-generator'
  | 'description-generator'
  | 'thumbnail-analyzer'
  | 'competitor-analysis'
  | 'channel-analytics'
  | 'settings';

export interface VideoPerformance {
  id: string;
  title: string;
  thumbnail: string;
  views: number;
  viewsDeltaPercent: number;
  publishedDaysAgo: number;
  duration: string;
  ctr: number; // e.g. 9.4%
  retentionRate: number; // e.g. 54%
  likes: number;
  comments: number;
  rank: number; // e.g. 1 out of 10
  tags: string[];
  status: 'breakout' | 'steady' | 'underperforming';
}

export interface ChannelMetricHistory {
  date: string;
  views: number;
  subscribers: number;
  watchTimeHours: number;
}

export interface TrafficSource {
  source: string;
  percentage: number;
  views: number;
  color: string;
}

export interface RetentionPoint {
  timestamp: string;
  percentRemaining: number;
  note?: string;
}

export interface TrendingIdea {
  id: string;
  title: string;
  niche: string;
  potentialViews: string;
  velocityScore: number; // 0-100
  competitionLevel: 'Low' | 'Medium' | 'High';
  hookAngle: string;
  recommendedDuration: string;
}

export interface AIRecommendation {
  id: string;
  type: 'ctr' | 'retention' | 'seo' | 'timing' | 'topic';
  title: string;
  description: string;
  impact: 'High Impact' | 'Quick Win' | 'Algorithm Boost';
  actionLabel: string;
  targetPage?: PageId;
  metricChangeEstimate: string;
}

export interface CompetitorChannel {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  subscribers: string;
  subscribersCount: number;
  uploadFrequency: string;
  outlierVideo: {
    title: string;
    views: string;
    multiplier: string;
    thumbnail: string;
  };
  overlapScore: number; // 0-100
  recentStrategy: string;
  contentGaps: string[];
}

export interface ChannelProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  coverImage?: string;
  niche: string;
  subscribers: number;
  subscribersDisplay: string;
  totalViews: number;
  totalViewsDisplay: string;
  watchTimeHours: number;
  watchTimeDisplay: string;
  estimatedRevenue: string;
  avgCtr: number;
  avgAvd: string;
  subscriberGrowthRate: number; // e.g. +14.2%
  performanceScore: number; // 0-100
  history: ChannelMetricHistory[];
  trafficSources: TrafficSource[];
  retentionCurve: RetentionPoint[];
  recentVideos: VideoPerformance[];
  trendingIdeas: TrendingIdea[];
  recommendations: AIRecommendation[];
  competitors: CompetitorChannel[];
}

export interface TitleOption {
  title: string;
  predictedCtr: number;
  hookType: string;
  reasoning: string;
  abTestVariation: string;
}

export interface DescriptionResult {
  hook: string;
  summary: string;
  chapters: Array<{ time: string; title: string }>;
  keyTakeaways: string[];
  hashtags: string[];
  seoTags: string[];
  resourcesTemplate: string;
  fullFormattedText: string;
}

export interface ThumbnailAuditResult {
  overallScore: number;
  ratings: {
    visualClutter: number;
    contrast: number;
    textReadability: number;
    emotionalHook: number;
    mobileLegibility: number;
  };
  strengths: string[];
  improvements: string[];
  verdict: string;
  timestampSafeZone: boolean;
  abTestRecommendation: string;
}

export interface KeywordMetric {
  keyword: string;
  searchVolume: number;
  searchVolumeDisplay: string;
  competitionScore: number; // 0 - 100
  competitionLabel: 'Low' | 'Medium' | 'High';
  difficulty: number;
  trend: '+18%' | '+34%' | '+5%' | '-2%' | '+88%';
  opportunityScore: number; // 0 - 100
  cpcEstimate: string;
  topVideoTitle: string;
  topVideoViews: string;
}
