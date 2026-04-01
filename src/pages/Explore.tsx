import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Link2, Search, ArrowLeft } from 'lucide-react';
import { THEME_ORDER, themes } from '@/lib/themes';
import { AppThemeSwitcher } from '@/components/AppThemeSwitcher';

interface PageCard {
  id: string;
  username: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  theme: string | null;
  view_count: number | null;
  link_count: number;
}

const PAGE_SIZE = 12;

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return `hsl(${Math.abs(hash % 360)}, 70%, 55%)`;
}

type SortMode = 'views' | 'newest' | 'links';

export default function Explore() {
  const navigate = useNavigate();
  const [pages, setPages] = useState<PageCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortMode>('views');
  const [themeFilter, setThemeFilter] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);

  const loadPages = async (reset = false) => {
    setLoading(true);
    const from = reset ? 0 : offset;

    let query = supabase
      .from('pages')
      .select('id, username, display_name, bio, avatar_url, theme, view_count, links, is_public')
      .eq('is_public', true)
      .range(from, from + PAGE_SIZE - 1);

    if (themeFilter) query = query.eq('theme', themeFilter);
    if (search.trim()) {
      query = query.or(`username.ilike.%${search.trim()}%,display_name.ilike.%${search.trim()}%`);
    }

    if (sort === 'views') query = query.order('view_count', { ascending: false, nullsFirst: false });
    else if (sort === 'newest') query = query.order('created_at', { ascending: false });
    else query = query.order('view_count', { ascending: false, nullsFirst: false }); // fallback, sort by links in JS

    const { data } = await query;

    const mapped: PageCard[] = (data || []).map((p: any) => ({
      id: p.id,
      username: p.username,
      display_name: p.display_name,
      bio: p.bio,
      avatar_url: p.avatar_url,
      theme: p.theme,
      view_count: p.view_count || 0,
      link_count: Array.isArray(p.links) ? (p.links as any[]).filter((l: any) => l.enabled !== false).length : 0,
    }));

    // Sort by links client-side if needed
    if (sort === 'links') {
      mapped.sort((a, b) => b.link_count - a.link_count);
    }

    if (reset) {
      setPages(mapped);
      setOffset(PAGE_SIZE);
    } else {
      setPages(prev => [...prev, ...mapped]);
      setOffset(from + PAGE_SIZE);
    }

    setHasMore((data?.length || 0) === PAGE_SIZE);
    setLoading(false);
  };

  useEffect(() => {
    loadPages(true);
  }, [sort, themeFilter]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => loadPages(true), 400);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <Link2 size={14} className="text-primary-foreground" />
              </div>
              <span className="font-['Space_Grotesk'] font-bold text-lg">LinkForge</span>
            </button>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm font-medium">Explore</span>
          </div>
          <div className="flex items-center gap-2">
            <AppThemeSwitcher />
            <Button variant="outline" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft size={14} className="mr-1" /> Home
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-['Space_Grotesk'] mb-2">Explore Pages</h1>
          <p className="text-muted-foreground">Discover link-in-bio pages created by the community</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or username..."
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            {([
              { value: 'views' as SortMode, label: 'Most Viewed' },
              { value: 'newest' as SortMode, label: 'Newest' },
              { value: 'links' as SortMode, label: 'Most Links' },
            ]).map(s => (
              <Button
                key={s.value}
                variant={sort === s.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSort(s.value)}
              >
                {s.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Theme filters */}
        <div className="flex gap-2 flex-wrap mb-8">
          <button
            onClick={() => setThemeFilter(null)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              !themeFilter ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            All Themes
          </button>
          {THEME_ORDER.map(id => (
            <button
              key={id}
              onClick={() => setThemeFilter(themeFilter === id ? null : id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                themeFilter === id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {themes[id].name}
            </button>
          ))}
        </div>

        {/* Grid */}
        {pages.length === 0 && !loading ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No pages found. Be the first to create one!</p>
            <Button className="mt-4" onClick={() => navigate('/')}>Create your page</Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pages.map(page => (
              <div
                key={page.id}
                className="border rounded-xl bg-card p-5 hover:shadow-md hover:border-primary/30 transition-all group"
              >
                <div className="flex items-start gap-3 mb-3">
                  {page.avatar_url ? (
                    <img src={page.avatar_url} alt={page.display_name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                      style={{ backgroundColor: getAvatarColor(page.display_name) }}
                    >
                      {getInitials(page.display_name)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold font-['Space_Grotesk'] text-sm truncate">{page.display_name}</h3>
                    <p className="text-xs text-muted-foreground font-mono">@{page.username}</p>
                  </div>
                </div>

                {page.bio && (
                  <p className="text-xs text-muted-foreground line-clamp-1 mb-3">{page.bio}</p>
                )}

                <div className="flex items-center gap-2 flex-wrap mb-4">
                  <Badge variant="secondary" className="text-[10px]">
                    {themes[page.theme || 'default']?.name || 'Default'}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Link2 size={10} /> {page.link_count} links
                  </span>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Eye size={10} /> {page.view_count}
                  </span>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  onClick={() => window.open(`/${page.username}`, '_blank')}
                >
                  Visit Page
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {hasMore && pages.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline" onClick={() => loadPages(false)} disabled={loading}>
              {loading ? 'Loading...' : 'Load More'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
