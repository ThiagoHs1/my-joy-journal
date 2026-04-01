import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PageData } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart, CartesianGrid } from 'recharts';
import { Eye, MousePointerClick, TrendingUp, Trophy, Share2 } from 'lucide-react';
import { format, subDays, parseISO } from 'date-fns';

interface Props {
  data: PageData;
}

interface ClicksByLink {
  link_url: string;
  link_index: number;
  clicks: number;
  title: string;
}

interface ClicksByDay {
  day: string;
  clicks: number;
}

interface RecentClick {
  link_url: string;
  link_index: number;
  created_at: string;
  referrer: string | null;
  title: string;
}

export function AnalyticsSection({ data }: Props) {
  const [loading, setLoading] = useState(true);
  const [clicksByLink, setClicksByLink] = useState<ClicksByLink[]>([]);
  const [clicksByDay, setClicksByDay] = useState<ClicksByDay[]>([]);
  const [recentClicks, setRecentClicks] = useState<RecentClick[]>([]);
  const [totalClicks, setTotalClicks] = useState(0);

  useEffect(() => {
    if (data.id) loadAnalytics();
  }, [data.id]);

  const loadAnalytics = async () => {
    if (!data.id) return;
    setLoading(true);

    // Single batch: get all clicks for this page
    const { data: allClicks } = await supabase
      .from('link_clicks')
      .select('link_url, link_index, created_at, referrer')
      .eq('page_id', data.id)
      .order('created_at', { ascending: false })
      .limit(1000);

    if (!allClicks) {
      setLoading(false);
      return;
    }

    setTotalClicks(allClicks.length);

    // Clicks by link (aggregate in JS)
    const linkMap = new Map<string, { link_url: string; link_index: number; clicks: number }>();
    allClicks.forEach(c => {
      const key = `${c.link_index}-${c.link_url}`;
      const existing = linkMap.get(key);
      if (existing) {
        existing.clicks++;
      } else {
        linkMap.set(key, { link_url: c.link_url, link_index: c.link_index, clicks: 1 });
      }
    });

    const byLink = Array.from(linkMap.values())
      .map(item => {
        const linkData = data.links.find(l => l.order === item.link_index || l.url === item.link_url);
        return { ...item, title: linkData?.title || item.link_url };
      })
      .sort((a, b) => b.clicks - a.clicks);
    setClicksByLink(byLink);

    // Clicks by day (last 30 days)
    const dayMap = new Map<string, number>();
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = format(subDays(now, i), 'yyyy-MM-dd');
      dayMap.set(d, 0);
    }
    allClicks.forEach(c => {
      if (!c.created_at) return;
      const day = c.created_at.slice(0, 10);
      if (dayMap.has(day)) {
        dayMap.set(day, (dayMap.get(day) || 0) + 1);
      }
    });
    setClicksByDay(Array.from(dayMap.entries()).map(([day, clicks]) => ({ day, clicks })));

    // Recent clicks (first 20 already sorted desc)
    const recent = allClicks.slice(0, 20).map(c => {
      const linkData = data.links.find(l => l.order === c.link_index || l.url === c.link_url);
      return { ...c, title: linkData?.title || c.link_url };
    });
    setRecentClicks(recent);

    setLoading(false);
  };

  const viewCount = data.view_count || 0;
  const clickRate = viewCount > 0 ? ((totalClicks / viewCount) * 100).toFixed(1) : '0';
  const topLink = clicksByLink[0];

  if (loading) {
    return (
      <div className="space-y-4 pb-4 animate-pulse">
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 rounded-xl bg-muted" />
          ))}
        </div>
        <div className="h-64 rounded-xl bg-muted" />
      </div>
    );
  }

  const isEmpty = totalClicks === 0 && viewCount === 0;

  return (
    <div className="space-y-6 pb-4">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={<Eye size={18} />} label="Total Views" value={viewCount.toLocaleString()} />
        <StatCard icon={<MousePointerClick size={18} />} label="Total Clicks" value={totalClicks.toLocaleString()} />
        <StatCard icon={<TrendingUp size={18} />} label="Click Rate" value={`${clickRate}%`} />
        <StatCard
          icon={<Trophy size={18} />}
          label="Top Link"
          value={topLink ? topLink.title : '—'}
          sub={topLink ? `${topLink.clicks} clicks` : undefined}
        />
      </div>

      {isEmpty ? (
        <div className="text-center py-12 rounded-xl border bg-muted/30">
          <Share2 size={32} className="mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground font-medium">Share your page to start tracking clicks!</p>
          <p className="text-xs text-muted-foreground mt-1">Analytics will appear here once visitors interact with your links.</p>
        </div>
      ) : (
        <>
          {/* Clicks by Link */}
          {clicksByLink.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-3">Clicks by Link</h3>
              <div className="bg-muted/30 rounded-xl p-4 border">
                <ResponsiveContainer width="100%" height={Math.max(clicksByLink.length * 40, 120)}>
                  <BarChart data={clicksByLink} layout="vertical" margin={{ left: 0, right: 20 }}>
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="title"
                      width={140}
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{ borderRadius: 8, border: 'none', fontSize: 12 }}
                      formatter={(value: number) => [`${value} clicks`, 'Clicks']}
                    />
                    <Bar dataKey="clicks" fill="hsl(252, 85%, 60%)" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Clicks Over Time */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Clicks Over Time (30 days)</h3>
            <div className="bg-muted/30 rounded-xl p-4 border">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={clicksByDay} margin={{ left: 0, right: 0, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 10 }}
                    tickFormatter={(v) => format(parseISO(v), 'MMM d')}
                    interval="preserveStartEnd"
                    tickLine={false}
                  />
                  <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: 'none', fontSize: 12 }}
                    labelFormatter={(v) => format(parseISO(v as string), 'MMM d, yyyy')}
                    formatter={(value: number) => [`${value}`, 'Clicks']}
                  />
                  <defs>
                    <linearGradient id="clickGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(252, 85%, 60%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(252, 85%, 60%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="clicks"
                    stroke="hsl(252, 85%, 60%)"
                    strokeWidth={2}
                    fill="url(#clickGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Clicks */}
          {recentClicks.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-3">Recent Clicks</h3>
              <div className="border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-muted/50 border-b">
                        <th className="text-left px-3 py-2 font-medium">Link</th>
                        <th className="text-left px-3 py-2 font-medium">URL</th>
                        <th className="text-left px-3 py-2 font-medium">Date</th>
                        <th className="text-left px-3 py-2 font-medium">Referrer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentClicks.map((click, i) => (
                        <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                          <td className="px-3 py-2 font-medium truncate max-w-[120px]">{click.title}</td>
                          <td className="px-3 py-2 text-muted-foreground truncate max-w-[150px]">{click.link_url}</td>
                          <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">
                            {click.created_at ? format(parseISO(click.created_at), 'MMM d, HH:mm') : '—'}
                          </td>
                          <td className="px-3 py-2 text-muted-foreground truncate max-w-[100px]">
                            {click.referrer || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border bg-card p-4 flex flex-col gap-1">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="text-xl font-bold font-['Space_Grotesk'] truncate">{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}
