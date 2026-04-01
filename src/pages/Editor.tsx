import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Save, Eye, Share2, FileText, AlertTriangle, Copy, Check, Globe, Plus, Smartphone, Keyboard, ChevronDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PageData, DEFAULT_PAGE_DATA, generateToken, LinkItem, SocialIcons, HeaderBanner } from '@/lib/types';
import { ProfileSection } from '@/components/editor/ProfileSection';
import { LinksSection } from '@/components/editor/LinksSection';
import { SocialIconsSection } from '@/components/editor/SocialIconsSection';
import { AppearanceSection } from '@/components/editor/AppearanceSection';
import { AnalyticsSection } from '@/components/editor/AnalyticsSection';
import { TemplateSelector } from '@/components/editor/TemplateSelector';
import { HeaderSection } from '@/components/editor/HeaderSection';
import { ShareSection } from '@/components/editor/ShareSection';
import { PhonePreview } from '@/components/PhonePreview';
import { AppThemeSwitcher } from '@/components/AppThemeSwitcher';
import { KeyboardShortcutsModal } from '@/components/KeyboardShortcutsModal';
import { useMyPages } from '@/hooks/useMyPages';
import { useIsMobile } from '@/hooks/use-mobile';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

function parseLinks(json: Json | null): LinkItem[] {
  if (!json || !Array.isArray(json)) return [];
  return (json as unknown as LinkItem[]).map((l, i) => ({
    title: l.title || '', url: l.url || '', icon: l.icon || 'link',
    enabled: l.enabled !== false, order: l.order ?? i,
    type: l.type || 'link', separatorStyle: l.separatorStyle, separatorText: l.separatorText,
    embed: l.embed, showFrom: l.showFrom, showUntil: l.showUntil,
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
  const isMobile = useIsMobile();

  const [data, setData] = useState<PageData>({ ...DEFAULT_PAGE_DATA, username: username || '' });
  const [isNew, setIsNew] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [authorized, setAuthorized] = useState(false);
  const [showTokenDialog, setShowTokenDialog] = useState(false);
  const [editToken, setEditToken] = useState('');
  const [copied, setCopied] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const { pages: myPages } = useMyPages();

  useEffect(() => { loadPage(); }, [username]);

  const loadPage = async () => {
    if (!username) return;
    const { data: page } = await supabase.from('pages').select('*').eq('username', username).maybeSingle();

    if (page) {
      const urlToken = searchParams.get('token');
      const storedToken = localStorage.getItem(`linkforge_token_${username}`);
      const token = urlToken || storedToken;

      if (token === page.edit_token) {
        setAuthorized(true);
        if (urlToken && !storedToken) localStorage.setItem(`linkforge_token_${username}`, urlToken);
      } else {
        setAuthorized(false); setLoading(false); return;
      }

      const themeOpts = (page.theme_options as any) || {};
      setData({
        id: page.id, username: page.username, display_name: page.display_name,
        bio: page.bio || '', location: page.location || '', avatar_url: page.avatar_url || '',
        links: parseLinks(page.links), social_icons: parseSocialIcons(page.social_icons),
        theme: page.theme || 'default', theme_options: themeOpts,
        header_banner: themeOpts.header_banner || undefined,
        edit_token: page.edit_token, view_count: page.view_count || 0,
      });
      setEditToken(page.edit_token);
      setIsNew(false);
    } else {
      const token = generateToken();
      setEditToken(token);
      setData(d => ({ ...d, username: username || '' }));
      setAuthorized(true); setIsNew(true);
    }
    setLoading(false);
  };

  const update = (partial: Partial<PageData>) => setData(prev => ({ ...prev, ...partial }));

  const saveAndPublish = useCallback(async () => {
    if (!data.display_name.trim()) { toast.error('Display name is required.'); return; }
    setSaving(true); setSaveState('saving');

    const payload = {
      username: data.username, display_name: data.display_name,
      bio: data.bio || null, location: data.location || null, avatar_url: data.avatar_url || null,
      links: data.links as unknown as Json, social_icons: data.social_icons as unknown as Json,
      theme: data.theme,
      theme_options: { ...data.theme_options, header_banner: data.header_banner } as unknown as Json,
      edit_token: editToken, is_public: data.is_public !== false,
    };

    let error;
    if (isNew) { error = (await supabase.from('pages').insert(payload)).error; }
    else { error = (await supabase.from('pages').update(payload).eq('username', data.username)).error; }

    setSaving(false);
    if (error) { toast.error('Failed to save: ' + error.message); setSaveState('idle'); return; }

    localStorage.setItem(`linkforge_token_${data.username}`, editToken);
    setSaveState('saved');
    setTimeout(() => setSaveState('idle'), 2000);

    if (isNew) { setIsNew(false); setShowTokenDialog(true); }
    else { toast.success('Page saved and published!'); }
  }, [data, editToken, isNew]);

  const addNewLink = useCallback(() => {
    if (data.links.length >= 20) return;
    update({ links: [...data.links, { title: '', url: '', icon: 'link', enabled: true, order: data.links.length, type: 'link' }] });
  }, [data.links]);

  const copyShareLink = useCallback(() => {
    navigator.clipboard.writeText(`${window.location.origin}/${data.username}`);
    toast.success('Link copied!');
  }, [data.username]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !(e.target as HTMLElement)?.closest('input, textarea, select, [contenteditable]')) {
        e.preventDefault(); setShowShortcuts(true); return;
      }
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key === 's') { e.preventDefault(); saveAndPublish(); }
      if (mod && e.shiftKey && e.key === 'N') { e.preventDefault(); addNewLink(); }
      if (mod && e.shiftKey && e.key === 'P') { e.preventDefault(); if (!isNew) window.open(`/${data.username}`, '_blank'); }
      if (mod && e.shiftKey && e.key === 'C') { e.preventDefault(); copyShareLink(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [saveAndPublish, addNewLink, copyShareLink, isNew, data.username]);

  const copyEditLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/edit/${data.username}?token=${editToken}`);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><div className="animate-pulse text-muted-foreground">Loading...</div></div>;
  }

  if (!authorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-6">
        <AlertTriangle size={48} className="text-destructive" />
        <h1 className="text-2xl font-bold font-['Space_Grotesk']">Access Denied</h1>
        <p className="text-muted-foreground text-center max-w-md">You don't have permission to edit this page.</p>
        <Button variant="outline" onClick={() => navigate('/')}>Go Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="font-['Space_Grotesk'] font-bold text-lg">LinkForge</button>
            <span className="text-muted-foreground hidden sm:inline">/</span>
            <span className="font-mono text-sm hidden sm:inline">{data.username}</span>
          </div>
          <div className="flex items-center gap-2">
            {/* My Pages Dropdown */}
            {myPages.length > 1 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hidden sm:flex gap-1 text-xs">
                    My Pages <ChevronDown size={12} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {myPages.map(p => (
                    <DropdownMenuItem key={p.username} onClick={() => navigate(`/edit/${p.username}?token=${p.token}`)}>
                      @{p.username}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/')}>
                    <Plus size={12} className="mr-1" /> Create Another
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <AppThemeSwitcher />
            <Button variant="ghost" size="icon" className="w-8 h-8 hidden sm:flex" onClick={() => setShowShortcuts(true)}>
              <Keyboard size={16} />
            </Button>
            <Button variant="outline" size="sm" className="hidden sm:flex" onClick={() => {
              localStorage.setItem(`linkforge_draft_${data.username}`, JSON.stringify(data));
              toast.success('Draft saved locally.');
            }}>
              <FileText size={14} className="mr-1" /> Draft
            </Button>
            <Button variant="outline" size="sm" className="hidden sm:flex" onClick={() => window.open(`/${data.username}`, '_blank')} disabled={isNew}>
              <Eye size={14} className="mr-1" /> Preview
            </Button>
            <Button variant="outline" size="sm" className="hidden sm:flex" onClick={copyShareLink} disabled={isNew}>
              <Share2 size={14} className="mr-1" /> Share
            </Button>
            <Button size="sm" onClick={saveAndPublish} disabled={saving} className="min-w-[120px]">
              {saveState === 'saving' ? (
                <><span className="animate-spin mr-1">⏳</span> Saving...</>
              ) : saveState === 'saved' ? (
                <><Check size={14} className="mr-1 text-green-400" /> Saved!</>
              ) : (
                <><Save size={14} className="mr-1" /> Save & Publish</>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          {/* Editor */}
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              {isNew && (
                <TemplateSelector onSelect={(t) => update({
                  display_name: t.name, bio: t.bio, links: t.links,
                  social_icons: t.social_icons, theme: t.theme, theme_options: t.theme_options,
                })} />
              )}
              <div className="flex items-center gap-2 ml-auto">
                <Globe size={14} className="text-muted-foreground" />
                <Label className="text-sm">Public</Label>
                <Switch checked={data.is_public !== false} onCheckedChange={(v) => update({ is_public: v })} />
              </div>
            </div>

            <Accordion type="multiple" defaultValue={['profile', 'links', 'appearance']} className="space-y-3">
              <AccordionItem value="header" className="border rounded-xl bg-card px-6">
                <AccordionTrigger className="font-['Space_Grotesk'] font-semibold text-lg">🖼️ Header Banner</AccordionTrigger>
                <AccordionContent><HeaderSection banner={data.header_banner} onChange={(header_banner) => update({ header_banner })} /></AccordionContent>
              </AccordionItem>

              <AccordionItem value="profile" className="border rounded-xl bg-card px-6">
                <AccordionTrigger className="font-['Space_Grotesk'] font-semibold text-lg">Profile</AccordionTrigger>
                <AccordionContent><ProfileSection data={data} onChange={update} /></AccordionContent>
              </AccordionItem>

              <AccordionItem value="links" className="border rounded-xl bg-card px-6">
                <AccordionTrigger className="font-['Space_Grotesk'] font-semibold text-lg">Links</AccordionTrigger>
                <AccordionContent><LinksSection links={data.links} onChange={(links) => update({ links })} /></AccordionContent>
              </AccordionItem>

              <AccordionItem value="social" className="border rounded-xl bg-card px-6">
                <AccordionTrigger className="font-['Space_Grotesk'] font-semibold text-lg">Social Icons</AccordionTrigger>
                <AccordionContent><SocialIconsSection socialIcons={data.social_icons} onChange={(social_icons) => update({ social_icons })} /></AccordionContent>
              </AccordionItem>

              <AccordionItem value="appearance" className="border rounded-xl bg-card px-6">
                <AccordionTrigger className="font-['Space_Grotesk'] font-semibold text-lg">Appearance</AccordionTrigger>
                <AccordionContent><AppearanceSection data={data} onChange={update} /></AccordionContent>
              </AccordionItem>

              {!isNew && (
                <AccordionItem value="share" className="border rounded-xl bg-card px-6">
                  <AccordionTrigger className="font-['Space_Grotesk'] font-semibold text-lg">🔗 Share & QR Code</AccordionTrigger>
                  <AccordionContent><ShareSection username={data.username} theme={data.theme} /></AccordionContent>
                </AccordionItem>
              )}

              {!isNew && (
                <AccordionItem value="analytics" className="border rounded-xl bg-card px-6">
                  <AccordionTrigger className="font-['Space_Grotesk'] font-semibold text-lg">📊 Analytics</AccordionTrigger>
                  <AccordionContent><AnalyticsSection data={data} /></AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </div>

          {/* Desktop Preview */}
          <div className="hidden lg:block">
            <PhonePreview data={data} />
          </div>
        </div>
      </div>

      {/* Mobile Preview FAB */}
      {isMobile && (
        <button
          onClick={() => setShowPreviewModal(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center z-50 hover:scale-105 transition-transform"
        >
          <Smartphone size={24} />
        </button>
      )}

      {/* Mobile Preview Modal */}
      <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
        <DialogContent className="max-w-full h-[100dvh] p-0 border-0 bg-transparent [&>button]:text-white [&>button]:z-50">
          <div className="h-full overflow-y-auto">
            <PhonePreview data={data} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Keyboard Shortcuts */}
      <KeyboardShortcutsModal open={showShortcuts} onClose={() => setShowShortcuts(false)} />

      {/* Token Dialog */}
      <AlertDialog open={showTokenDialog} onOpenChange={setShowTokenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-['Space_Grotesk'] flex items-center gap-2">
              <AlertTriangle size={20} className="text-destructive" /> Save your edit link!
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>This is the <strong>only way</strong> to edit your page later. Bookmark or save this link:</p>
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
            <AlertDialogAction onClick={() => setShowTokenDialog(false)}>I've saved it!</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
