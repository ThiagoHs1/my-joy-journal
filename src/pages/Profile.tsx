import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { PageData, LinkItem, SocialIcons } from '@/lib/types';
import { Json } from '@/integrations/supabase/types';
import { ProfileSkeleton } from '@/components/profile/ProfileSkeleton';
import { ProfileContent } from '@/components/profile/ProfileContent';
import { ProfileNotFound } from '@/components/profile/ProfileNotFound';

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function parseLinks(json: Json | null): LinkItem[] {
  if (!json || !Array.isArray(json)) return [];
  return (json as unknown as LinkItem[]).map((l, i) => ({
    title: l.title || '',
    url: l.url || '',
    icon: l.icon || 'link',
    enabled: l.enabled !== false,
    order: l.order ?? i,
  }));
}

function parseSocialIcons(json: Json | null): SocialIcons {
  if (!json || typeof json !== 'object' || Array.isArray(json)) return {};
  return json as unknown as SocialIcons;
}

function getCached(username: string): PageData | null {
  try {
    const raw = localStorage.getItem(`lf_page_${username}`);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) {
      localStorage.removeItem(`lf_page_${username}`);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function setCache(username: string, data: PageData) {
  try {
    localStorage.setItem(`lf_page_${username}`, JSON.stringify({ data, ts: Date.now() }));
  } catch { /* quota exceeded */ }
}

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const [data, setData] = useState<PageData | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pageId, setPageId] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;

    // Update document title
    document.title = `@${username} | LinkForge`;

    // Check cache first
    const cached = getCached(username);
    if (cached) {
      setData(cached);
      setPageId(cached.id || null);
      setLoading(false);
      // Still increment view in background
      if (cached.id) {
        supabase.from('pages').update({ view_count: ((cached as any).view_count || 0) + 1 }).eq('id', cached.id).then(() => {});
      }
      return;
    }

    loadPage(username);
  }, [username]);

  const loadPage = async (uname: string) => {
    setLoading(true);
    const { data: page } = await supabase
      .from('pages')
      .select('*')
      .eq('username', uname)
      .maybeSingle();

    if (!page) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setPageId(page.id);

    // Non-blocking view count increment
    supabase.from('pages').update({ view_count: (page.view_count || 0) + 1 }).eq('id', page.id).then(() => {});

    const pageData: PageData = {
      id: page.id,
      username: page.username,
      display_name: page.display_name,
      bio: page.bio || '',
      location: page.location || '',
      avatar_url: page.avatar_url || '',
      links: parseLinks(page.links),
      social_icons: parseSocialIcons(page.social_icons),
      theme: page.theme || 'default',
      theme_options: (page.theme_options as Record<string, string>) || {},
    };

    // Update meta tags dynamically
    updateMetaTags(pageData);

    setData(pageData);
    setCache(uname, pageData);
    setLoading(false);
  };

  const updateMetaTags = (pd: PageData) => {
    const setMeta = (prop: string, content: string) => {
      let el = document.querySelector(`meta[property="${prop}"]`) || document.querySelector(`meta[name="${prop}"]`);
      if (el) el.setAttribute('content', content);
    };
    setMeta('og:title', pd.display_name || pd.username);
    setMeta('og:description', pd.bio || `Check out ${pd.display_name || pd.username}'s links`);
    if (pd.avatar_url) setMeta('og:image', pd.avatar_url);
  };

  const handleLinkClick = (linkIndex: number, linkUrl: string) => {
    if (!pageId) return;
    // Non-blocking tracking
    const payload = JSON.stringify({
      page_id: pageId,
      link_index: linkIndex,
      link_url: linkUrl,
      referrer: document.referrer || null,
    });

    const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/link_clicks`;
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' });
      // sendBeacon doesn't support custom headers easily, fall back to fetch
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    } else {
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }

    window.open(linkUrl, '_blank');
  };

  if (notFound) return <ProfileNotFound />;
  if (loading || !data) return <ProfileSkeleton />;

  return <ProfileContent data={data} onLinkClick={handleLinkClick} />;
}
