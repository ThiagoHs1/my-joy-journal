import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Share2 } from 'lucide-react';
import { PageData, LinkItem, isLinkVisible, getYouTubeId, getSpotifyEmbedUrl } from '@/lib/types';
import { PlatformIcon } from '@/components/PlatformIcon';
import { getTheme, getResolvedBackground, getResolvedLinkRadius, getResolvedFont, getButtonStyleOverrides } from '@/lib/themes';
import { toast } from 'sonner';

interface Props {
  data: PageData;
  onLinkClick: (index: number, url: string) => void;
}

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return `hsl(${Math.abs(hash % 360)}, 70%, 55%)`;
}

function parseHoverStyles(hoverStr: string): Record<string, string> {
  const result: Record<string, string> = {};
  hoverStr.split(';').forEach(part => {
    const [key, val] = part.split(':').map(s => s.trim());
    if (key && val) result[key.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = val;
  });
  return result;
}

function getBannerStyle(banner: PageData['header_banner']): React.CSSProperties | null {
  if (!banner?.enabled) return null;
  const h = banner.height || 150;
  if (banner.type === 'image' && banner.imageUrl) return { height: h, backgroundImage: `url(${banner.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' };
  if (banner.type === 'gradient') return { height: h, background: `linear-gradient(${banner.gradientAngle || 135}deg, ${banner.gradientColor1 || '#6366f1'}, ${banner.gradientColor2 || '#ec4899'})` };
  return { height: h, background: banner.color || '#6366f1' };
}

function getEntranceVariant(style: string) {
  switch (style) {
    case 'fade-in': return { hidden: { opacity: 0 }, visible: { opacity: 1 } };
    case 'scale-up': return { hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } };
    case 'slide-left': return { hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0 } };
    case 'slide-right': return { hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0 } };
    default: return { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }; // fade-up
  }
}

function EmbedContent({ link }: { link: LinkItem }) {
  const [expanded, setExpanded] = useState(false);
  const ytId = getYouTubeId(link.url);
  const spotify = getSpotifyEmbedUrl(link.url);

  if (ytId) {
    return (
      <div className="w-full rounded-xl overflow-hidden">
        {!expanded ? (
          <button onClick={() => setExpanded(true)} className="w-full relative cursor-pointer group">
            <img src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`} alt={link.title} className="w-full h-44 object-cover rounded-xl" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors rounded-xl">
              <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6 ml-1"><polygon points="5,3 19,12 5,21" /></svg>
              </div>
            </div>
            <p className="absolute bottom-2 left-3 text-white text-xs font-medium drop-shadow">{link.title}</p>
          </button>
        ) : (
          <iframe src={`https://www.youtube.com/embed/${ytId}?autoplay=1`} className="w-full h-52 rounded-xl" allow="autoplay; encrypted-media" allowFullScreen />
        )}
      </div>
    );
  }

  if (spotify) {
    const h = spotify.type === 'track' ? 80 : 380;
    return (
      <div className="w-full">
        <p className="text-xs font-medium mb-1 opacity-80">{link.title}</p>
        <iframe src={spotify.embedUrl} className="w-full rounded-xl" style={{ height: h }} allow="encrypted-media" />
      </div>
    );
  }
  return null;
}

function SeparatorElement({ link, theme }: { link: LinkItem; theme: ReturnType<typeof getTheme> }) {
  if (link.separatorStyle === 'space') return <div className="h-4" />;
  if (link.separatorStyle === 'text') {
    return (
      <div className="flex items-center gap-3 py-2">
        <div className="flex-1 h-px" style={{ background: theme.textColor, opacity: 0.15 }} />
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.textColor, opacity: 0.6 }}>{link.separatorText || ''}</span>
        <div className="flex-1 h-px" style={{ background: theme.textColor, opacity: 0.15 }} />
      </div>
    );
  }
  return <div className="h-px w-full my-1" style={{ background: theme.textColor, opacity: 0.15 }} />;
}

export function ProfileContent({ data, onLinkClick }: Props) {
  const visibleItems = data.links.filter(isLinkVisible).sort((a, b) => a.order - b.order);
  const socialEntries = Object.entries(data.social_icons || {}).filter(([, url]) => url);

  const theme = getTheme(data.theme);
  const bg = getResolvedBackground(theme, data.theme_options);
  const linkRadius = getResolvedLinkRadius(theme, data.theme_options);
  const font = getResolvedFont(theme, data.theme_options);
  const btnOverrides = getButtonStyleOverrides(data.theme_options);
  const hideFooter = data.theme_options.hideFooter === 'true';
  const isAnime = data.theme === 'anime';
  const banner = data.header_banner;
  const bannerStyle = getBannerStyle(banner);
  const hasBanner = !!bannerStyle;

  // Animation options
  const entranceEnabled = data.theme_options.entranceAnimation !== 'false';
  const hoverEnabled = data.theme_options.hoverAnimation !== 'false';
  const entranceStyle = data.theme_options.entranceStyle || 'fade-up';
  const entranceSpeed = parseInt(data.theme_options.entranceSpeed || '80');
  const variants = getEntranceVariant(entranceStyle);
  const customCSS = data.theme_options.customCSS || '';

  // Easter egg: Rickroll
  const isRickroll = data.username === 'rick' || data.username === 'rickroll';

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: data.display_name, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied!');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center relative" style={{ background: bg, fontFamily: font }}>
      {/* Custom CSS injection */}
      {customCSS && <style dangerouslySetInnerHTML={{ __html: customCSS }} />}

      {isAnime && (
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(139,92,246,0.08) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      )}

      {hasBanner && <div className="w-full shrink-0" style={bannerStyle!} />}

      <div className={`w-full max-w-[480px] flex flex-col items-center text-center gap-4 flex-1 relative z-10 px-5 ${hasBanner ? '' : 'py-12'}`}>
        {/* Rickroll Easter Egg */}
        {isRickroll && (
          <div className="w-full rounded-xl overflow-hidden mb-2">
            <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" className="w-full h-52 rounded-xl" allow="autoplay; encrypted-media" allowFullScreen />
          </div>
        )}

        {/* Avatar */}
        <motion.div
          initial={entranceEnabled ? { opacity: 0, scale: 0.8 } : false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className={hasBanner ? '-mt-12' : 'mt-6'}
        >
          {data.avatar_url ? (
            <img src={data.avatar_url} alt={data.display_name} className="w-24 h-24 object-cover shadow-lg"
              style={{ borderRadius: theme.avatarRadius, border: theme.avatarBorder, boxShadow: theme.avatarGlow || '0 4px 20px rgba(0,0,0,0.3)' }} />
          ) : (
            <div className="w-24 h-24 flex items-center justify-center text-2xl font-bold shadow-lg"
              style={{ borderRadius: theme.avatarRadius, border: theme.avatarBorder, backgroundColor: getAvatarColor(data.display_name || data.username), color: '#fff', boxShadow: theme.avatarGlow || '0 4px 20px rgba(0,0,0,0.3)' }}>
              {getInitials(data.display_name || data.username || '?')}
            </div>
          )}
        </motion.div>

        {/* Name & Bio */}
        <motion.div initial={entranceEnabled ? { opacity: 0, y: 10 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
          <h1 className="text-2xl font-bold font-['Space_Grotesk']" style={{ color: theme.textColor, fontFamily: font }}>
            {data.display_name || data.username || 'Your Name'}
          </h1>
          {data.bio && <p className="text-sm mt-1.5 line-clamp-2 max-w-xs mx-auto" style={{ color: theme.secondaryTextColor }}>{data.bio}</p>}
          {data.location && (
            <p className="text-[13px] mt-1.5 flex items-center justify-center gap-1" style={{ color: theme.secondaryTextColor, opacity: 0.75 }}>
              <MapPin size={13} /> {data.location}
            </p>
          )}
        </motion.div>

        {/* Social Icons */}
        {socialEntries.length > 0 && (
          <motion.div initial={entranceEnabled ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.3 }} className="flex gap-3 flex-wrap justify-center">
            {socialEntries.map(([platform, url]) => (
              <a key={platform} href={url} target="_blank" rel="noopener noreferrer"
                className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{ color: theme.socialIconColor }}>
                <PlatformIcon platform={platform} size={16} />
              </a>
            ))}
          </motion.div>
        )}

        {/* Links & Separators */}
        <div className="w-full flex flex-col gap-3 mt-3">
          {visibleItems.map((item, idx) => {
            if (item.type === 'separator') {
              return (
                <motion.div key={idx}
                  initial={entranceEnabled ? variants.hidden : false}
                  animate={variants.visible || { opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 + idx * (entranceSpeed / 1000) }}
                >
                  <SeparatorElement link={item} theme={theme} />
                </motion.div>
              );
            }

            if (item.embed && (getYouTubeId(item.url) || getSpotifyEmbedUrl(item.url))) {
              return (
                <motion.div key={idx}
                  initial={entranceEnabled ? variants.hidden : false}
                  animate={variants.visible || { opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + idx * (entranceSpeed / 1000) }}
                >
                  <EmbedContent link={item} />
                </motion.div>
              );
            }

            const baseLinkStyle: React.CSSProperties = {
              background: theme.linkBg, color: theme.linkText,
              border: theme.linkBorder !== 'none' ? theme.linkBorder : undefined,
              borderRadius: linkRadius,
              boxShadow: theme.linkShadow !== 'none' ? theme.linkShadow : undefined,
              fontFamily: font, ...btnOverrides,
            };

            return (
              <motion.button
                key={idx}
                initial={entranceEnabled ? variants.hidden : false}
                animate={variants.visible || { opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + idx * (entranceSpeed / 1000) }}
                onClick={() => onLinkClick(item.order, item.url)}
                className={`w-full h-14 flex items-center px-5 gap-3 cursor-pointer transition-all duration-200 ${hoverEnabled ? 'hover:-translate-y-0.5' : ''} ${theme.extraLinkClasses || ''}`}
                style={baseLinkStyle}
                onMouseEnter={hoverEnabled ? (e) => { Object.assign(e.currentTarget.style, parseHoverStyles(theme.linkHover)); } : undefined}
                onMouseLeave={hoverEnabled ? (e) => { Object.assign(e.currentTarget.style, { background: baseLinkStyle.background, boxShadow: baseLinkStyle.boxShadow || '', color: baseLinkStyle.color }); } : undefined}
              >
                <PlatformIcon platform={item.icon} size={20} className="shrink-0" />
                <span className="flex-1 text-sm font-medium truncate text-center">{item.title}</span>
                <div className="w-5" />
              </motion.button>
            );
          })}
        </div>
      </div>

      {!hideFooter && (
        <a href="/" className="mt-8 mb-16 text-xs transition-colors hover:opacity-80" style={{ color: theme.textColor, opacity: 0.4 }}>
          Made with <span className="font-semibold">LinkForge</span>
        </a>
      )}

      <button onClick={handleShare}
        className="fixed bottom-6 right-6 w-11 h-11 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 z-50"
        style={{ background: theme.linkBg === 'transparent' ? 'rgba(255,255,255,0.2)' : theme.linkBg, color: theme.linkText }}>
        <Share2 size={18} />
      </button>
    </div>
  );
}
