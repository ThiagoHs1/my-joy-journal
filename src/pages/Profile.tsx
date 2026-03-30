import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { PageData, LinkItem, SocialIcons } from '@/lib/types';
import { LinkBioContent } from '@/components/LinkBioContent';
import { Json } from '@/integrations/supabase/types';

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

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const [data, setData] = useState<PageData | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [pageId, setPageId] = useState<string | null>(null);

  useEffect(() => {
    loadPage();
  }, [username]);

  const loadPage = async () => {
    if (!username) return;

    const { data: page } = await supabase
      .from('pages')
      .select('*')
      .eq('username', username)
      .maybeSingle();

    if (!page) {
      setNotFound(true);
      return;
    }

    setPageId(page.id);

    // Increment view count
    supabase.from('pages').update({ view_count: (page.view_count || 0) + 1 }).eq('id', page.id).then(() => {});

    setData({
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
    });
  };

  const handleLinkClick = async (linkIndex: number, linkUrl: string) => {
    if (!pageId) return;
    await supabase.from('link_clicks').insert({
      page_id: pageId,
      link_index: linkIndex,
      link_url: linkUrl,
      referrer: document.referrer || null,
    });
  };

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-4xl font-bold font-['Space_Grotesk']">404</h1>
        <p className="text-muted-foreground">This page doesn't exist yet.</p>
        <a href="/" className="text-primary underline text-sm">Create yours →</a>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-md px-4 py-6">
        <LinkBioContent data={data} onLinkClick={handleLinkClick} />
      </div>
    </div>
  );
}
