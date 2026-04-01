import { MapPin } from 'lucide-react';
import { PageData, isLinkVisible, getYouTubeId, getSpotifyEmbedUrl } from '@/lib/types';
import { PlatformIcon } from './PlatformIcon';
import { getTheme, getResolvedBackground, getResolvedLinkRadius, getResolvedFont, getButtonStyleOverrides } from '@/lib/themes';

interface LinkBioContentProps {
  data: PageData;
  isPreview?: boolean;
  onLinkClick?: (index: number, url: string) => void;
}

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return `hsl(${Math.abs(hash % 360)}, 70%, 55%)`;
}

function getBannerStyle(banner: PageData['header_banner']): React.CSSProperties | null {
  if (!banner?.enabled) return null;
  const h = Math.round((banner.height || 150) * 0.5); // Scale down for preview
  if (banner.type === 'image' && banner.imageUrl) {
    return { height: h, backgroundImage: `url(${banner.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' };
  }
  if (banner.type === 'gradient') {
    return { height: h, background: `linear-gradient(${banner.gradientAngle || 135}deg, ${banner.gradientColor1 || '#6366f1'}, ${banner.gradientColor2 || '#ec4899'})` };
  }
  return { height: h, background: banner.color || '#6366f1' };
}

export function LinkBioContent({ data, isPreview = false, onLinkClick }: LinkBioContentProps) {
  const visibleItems = isPreview
    ? data.links.filter(l => l.enabled).sort((a, b) => a.order - b.order)
    : data.links.filter(isLinkVisible).sort((a, b) => a.order - b.order);
  const socialEntries = Object.entries(data.social_icons || {}).filter(([, url]) => url);

  const theme = getTheme(data.theme);
  const bg = getResolvedBackground(theme, data.theme_options);
  const linkRadius = getResolvedLinkRadius(theme, data.theme_options);
  const font = getResolvedFont(theme, data.theme_options);
  const btnOverrides = getButtonStyleOverrides(data.theme_options);
  const hideFooter = data.theme_options.hideFooter === 'true';
  const isAnime = data.theme === 'anime';
  const bannerStyle = getBannerStyle(data.header_banner);
  const hasBanner = !!bannerStyle;

  const handleClick = (index: number, url: string, e: React.MouseEvent) => {
    if (isPreview) { e.preventDefault(); return; }
    onLinkClick?.(index, url);
  };

  return (
    <div className="flex flex-col items-center text-center min-h-full relative" style={{ background: bg, fontFamily: font }}>
      {isAnime && (
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(139,92,246,0.08) 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
      )}

      {/* Banner */}
      {hasBanner && <div className="w-full shrink-0" style={bannerStyle!} />}

      <div className={`relative z-10 flex flex-col items-center text-center gap-3 w-full p-4 ${hasBanner ? '' : 'pt-4'}`}>
        {/* Avatar */}
        <div className={hasBanner ? '-mt-8' : 'mt-2'}>
          {data.avatar_url ? (
            <img src={data.avatar_url} alt={data.display_name} className="w-16 h-16 object-cover"
              style={{ borderRadius: theme.avatarRadius, border: theme.avatarBorder, boxShadow: theme.avatarGlow || '0 4px 15px rgba(0,0,0,0.2)' }} />
          ) : (
            <div className="w-16 h-16 flex items-center justify-center text-lg font-bold"
              style={{ borderRadius: theme.avatarRadius, border: theme.avatarBorder, backgroundColor: getAvatarColor(data.display_name || data.username), color: '#fff', boxShadow: theme.avatarGlow || '0 4px 15px rgba(0,0,0,0.2)' }}>
              {getInitials(data.display_name || data.username || '?')}
            </div>
          )}
        </div>

        {/* Name */}
        <div>
          <h1 className="text-base font-bold font-['Space_Grotesk']" style={{ color: theme.textColor }}>{data.display_name || data.username || 'Your Name'}</h1>
          {data.bio && <p className="text-[10px] mt-0.5 line-clamp-2" style={{ color: theme.secondaryTextColor }}>{data.bio}</p>}
          {data.location && (
            <p className="text-[9px] mt-0.5 flex items-center justify-center gap-0.5" style={{ color: theme.secondaryTextColor, opacity: 0.75 }}>
              <MapPin size={9} /> {data.location}
            </p>
          )}
        </div>

        {/* Social Icons */}
        {socialEntries.length > 0 && (
          <div className="flex gap-2 flex-wrap justify-center">
            {socialEntries.map(([platform, url]) => (
              <a key={platform} href={isPreview ? '#' : url} target="_blank" rel="noopener noreferrer"
                onClick={isPreview ? (e) => e.preventDefault() : undefined}
                className="w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110"
                style={{ color: theme.socialIconColor }}>
                <PlatformIcon platform={platform} size={12} />
              </a>
            ))}
          </div>
        )}

        {/* Links & Separators */}
        <div className="w-full flex flex-col gap-2 mt-1">
          {visibleItems.length === 0 && <p className="text-xs py-6" style={{ color: theme.secondaryTextColor }}>No links yet</p>}
          {visibleItems.map((item, idx) => {
            if (item.type === 'separator') {
              if (item.separatorStyle === 'space') return <div key={idx} className="h-2" />;
              if (item.separatorStyle === 'text') {
                return (
                  <div key={idx} className="flex items-center gap-2 py-1">
                    <div className="flex-1 h-px" style={{ background: theme.textColor, opacity: 0.15 }} />
                    <span className="text-[8px] font-semibold uppercase tracking-wider" style={{ color: theme.textColor, opacity: 0.5 }}>{item.separatorText}</span>
                    <div className="flex-1 h-px" style={{ background: theme.textColor, opacity: 0.15 }} />
                  </div>
                );
              }
              return <div key={idx} className="h-px w-full" style={{ background: theme.textColor, opacity: 0.15 }} />;
            }

            // Embed preview (simplified in phone preview)
            if (item.embed && getYouTubeId(item.url)) {
              return (
                <div key={idx} className="w-full rounded-lg overflow-hidden">
                  <img src={`https://img.youtube.com/vi/${getYouTubeId(item.url)}/hqdefault.jpg`} alt={item.title} className="w-full h-20 object-cover rounded-lg" />
                </div>
              );
            }

            if (item.embed && getSpotifyEmbedUrl(item.url)) {
              const sp = getSpotifyEmbedUrl(item.url)!;
              return (
                <div key={idx} className="w-full">
                  <iframe src={sp.embedUrl} className="w-full rounded-lg" style={{ height: sp.type === 'track' ? 52 : 152 }} allow="encrypted-media" />
                </div>
              );
            }

            const linkStyle: React.CSSProperties = {
              background: theme.linkBg, color: theme.linkText,
              border: theme.linkBorder !== 'none' ? theme.linkBorder : undefined,
              borderRadius: linkRadius, boxShadow: theme.linkShadow !== 'none' ? theme.linkShadow : undefined,
              fontFamily: font, ...btnOverrides,
            };

            return (
              <a key={idx} href={isPreview ? '#' : item.url} target="_blank" rel="noopener noreferrer"
                onClick={(e) => handleClick(item.order, item.url, e)}
                className={`w-full flex items-center gap-2 px-3 py-2 transition-all duration-200 hover:-translate-y-0.5 ${theme.extraLinkClasses || ''}`}
                style={linkStyle}>
                <PlatformIcon platform={item.icon} size={14} className="shrink-0" />
                <span className="flex-1 text-[10px] font-medium text-center truncate">{item.title}</span>
                <div className="w-3" />
              </a>
            );
          })}
        </div>

        {/* Footer */}
        {!hideFooter && <p className="text-[8px] mt-3" style={{ color: theme.textColor, opacity: 0.4 }}>Built with LinkForge</p>}
      </div>
    </div>
  );
}
