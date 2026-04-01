import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Save, Eye, Share2, FileText, AlertTriangle, Copy, Check, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PageData, DEFAULT_PAGE_DATA, generateToken, LinkItem, SocialIcons } from '@/lib/types';
import { ProfileSection } from '@/components/editor/ProfileSection';
import { LinksSection } from '@/components/editor/LinksSection';
import { SocialIconsSection } from '@/components/editor/SocialIconsSection';
import { AppearanceSection } from '@/components/editor/AppearanceSection';
import { AnalyticsSection } from '@/components/editor/AnalyticsSection';
import { PhonePreview } from '@/components/PhonePreview';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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

export default function Editor() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [data, setData] = useState<PageData>({ ...DEFAULT_PAGE_DATA, username: username || '' });
  const [isNew, setIsNew] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [showTokenDialog, setShowTokenDialog] = useState(false);
  const [editToken, setEditToken] = useState('');
  const [copied, setCopied] = useState(false);

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

    if (page) {
      // Existing page — check token
      const urlToken = searchParams.get('token');
      const storedToken = localStorage.getItem(`linkforge_token_${username}`);
      const token = urlToken || storedToken;

      if (token === page.edit_token) {
        setAuthorized(true);
        if (urlToken && !storedToken) {
          localStorage.setItem(`linkforge_token_${username}`, urlToken);
        }
      } else {
        setAuthorized(false);
        setLoading(false);
        return;
      }

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
        edit_token: page.edit_token,
        view_count: page.view_count || 0,
      });
      setEditToken(page.edit_token);
      setIsNew(false);
    } else {
      // New page
      const token = generateToken();
      setEditToken(token);
      setData((d) => ({ ...d, username: username || '' }));
      setAuthorized(true);
      setIsNew(true);
    }

    setLoading(false);
  };

  const update = (partial: Partial<PageData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  };

  const saveAndPublish = async () => {
    if (!data.display_name.trim()) {
      toast.error('Display name is required.');
      return;
    }

    setSaving(true);

    const payload = {
      username: data.username,
      display_name: data.display_name,
      bio: data.bio || null,
      location: data.location || null,
      avatar_url: data.avatar_url || null,
      links: data.links as unknown as Json,
      social_icons: data.social_icons as unknown as Json,
      theme: data.theme,
      theme_options: data.theme_options as unknown as Json,
      edit_token: editToken,
    };

    let error;
    if (isNew) {
      const res = await supabase.from('pages').insert(payload);
      error = res.error;
    } else {
      const res = await supabase.from('pages').update(payload).eq('username', data.username);
      error = res.error;
    }

    setSaving(false);

    if (error) {
      toast.error('Failed to save: ' + error.message);
      return;
    }

    localStorage.setItem(`linkforge_token_${data.username}`, editToken);

    if (isNew) {
      setIsNew(false);
      setShowTokenDialog(true);
    } else {
      toast.success('Page saved and published!');
    }
  };

  const saveDraft = () => {
    localStorage.setItem(`linkforge_draft_${data.username}`, JSON.stringify(data));
    toast.success('Draft saved locally.');
  };

  const copyEditLink = () => {
    const url = `${window.location.origin}/edit/${data.username}?token=${editToken}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/${data.username}`);
    toast.success('Link copied!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-6">
        <AlertTriangle size={48} className="text-destructive" />
        <h1 className="text-2xl font-bold font-['Space_Grotesk']">Access Denied</h1>
        <p className="text-muted-foreground text-center max-w-md">
          You don't have permission to edit this page. If you're the owner, use your edit link with the token.
        </p>
        <Button variant="outline" onClick={() => navigate('/')}>
          Go Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="font-['Space_Grotesk'] font-bold text-lg">
              LinkForge
            </button>
            <span className="text-muted-foreground">/</span>
            <span className="font-mono text-sm">{data.username}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={saveDraft}>
              <FileText size={14} className="mr-1" /> Draft
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.open(`/${data.username}`, '_blank')} disabled={isNew}>
              <Eye size={14} className="mr-1" /> Preview
            </Button>
            <Button variant="outline" size="sm" onClick={copyShareLink} disabled={isNew}>
              <Share2 size={14} className="mr-1" /> Share
            </Button>
            <Button size="sm" onClick={saveAndPublish} disabled={saving}>
              <Save size={14} className="mr-1" /> {saving ? 'Saving...' : 'Save & Publish'}
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          {/* Editor */}
          <div className="space-y-4">
            <Accordion type="multiple" defaultValue={['profile', 'links', 'social', 'appearance']} className="space-y-3">
              <AccordionItem value="profile" className="border rounded-xl bg-card px-6">
                <AccordionTrigger className="font-['Space_Grotesk'] font-semibold text-lg">
                  Profile
                </AccordionTrigger>
                <AccordionContent>
                  <ProfileSection data={data} onChange={update} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="links" className="border rounded-xl bg-card px-6">
                <AccordionTrigger className="font-['Space_Grotesk'] font-semibold text-lg">
                  Links
                </AccordionTrigger>
                <AccordionContent>
                  <LinksSection links={data.links} onChange={(links) => update({ links })} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="social" className="border rounded-xl bg-card px-6">
                <AccordionTrigger className="font-['Space_Grotesk'] font-semibold text-lg">
                  Social Icons
                </AccordionTrigger>
                <AccordionContent>
                  <SocialIconsSection socialIcons={data.social_icons} onChange={(social_icons) => update({ social_icons })} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="appearance" className="border rounded-xl bg-card px-6">
                <AccordionTrigger className="font-['Space_Grotesk'] font-semibold text-lg">
                  Appearance
                </AccordionTrigger>
                <AccordionContent>
                  <AppearanceSection data={data} onChange={update} />
                </AccordionContent>
              </AccordionItem>

              {!isNew && (
                <AccordionItem value="analytics" className="border rounded-xl bg-card px-6">
                  <AccordionTrigger className="font-['Space_Grotesk'] font-semibold text-lg">
                    📊 Analytics
                  </AccordionTrigger>
                  <AccordionContent>
                    <AnalyticsSection data={data} />
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </div>

          {/* Preview */}
          <div className="hidden lg:block">
            <PhonePreview data={data} />
          </div>
        </div>
      </div>

      {/* Token Dialog */}
      <AlertDialog open={showTokenDialog} onOpenChange={setShowTokenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-['Space_Grotesk'] flex items-center gap-2">
              <AlertTriangle size={20} className="text-destructive" />
              Save your edit link!
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>
                This is the <strong>only way</strong> to edit your page later. No account is required — just bookmark or save this link:
              </p>
              <div className="flex gap-2">
                <code className="flex-1 bg-secondary rounded-lg px-3 py-2 text-xs break-all font-mono">
                  {`${window.location.origin}/edit/${data.username}?token=${editToken}`}
                </code>
                <Button size="sm" variant="outline" onClick={copyEditLink}>
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </Button>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowTokenDialog(false)}>
              I've saved it!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
