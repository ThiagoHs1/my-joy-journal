import { MapPin } from 'lucide-react';
import { PageData } from '@/lib/types';
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

export function LinkBioContent({ data, isPreview = false, onLinkClick }: LinkBioContentProps) {
  const activeLinks = data.links.filter(l => l.enabled).sort((a, b) => a.order - b.order);
  const socialEntries = Object.entries(data.social_icons || {}).filter(([, url]) => url);

  const theme = getTheme(data.theme);
  const bg = getResolvedBackground(theme, data.theme_options);
  const linkRadius = getResolvedLinkRadius(theme, data.theme_options);
  const font = getResolvedFont(theme, data.theme_options);
  const btnOverrides = getButtonStyleOverrides(data.theme_options);
  const hideFooter = data.theme_options.hideFooter === 'true';
  const isAnime = data.theme === 'anime';

  const handleClick = (index: number, url: string, e: React.MouseEvent) => {
    if (isPreview) { e.preventDefault(); return; }
    onLinkClick?.(index, url);
  };

  return (
    <div
      className="flex flex-col items-center text-center gap-4 min-h-full p-4 relative"
      style={{ background: bg, fontFamily: font }}
    >
      {isAnime && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(139,92,246,0.08) 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }}
        />
      )}

      <div className="relative z-10 flex flex-col items-center text-center gap-4 w-full">
        {/* Avatar */}
        <div className="mt-4">
          {data.avatar_url ? (
            <img
              src={data.avatar_url}
              alt={data.display_name}
              className="w-20 h-20 object-cover"
              style={{
                borderRadius: theme.avatarRadius,
                border: theme.avatarBorder,
                boxShadow: theme.avatarGlow || '0 4px 15px rgba(0,0,0,0.2)',
              }}
            />
          ) : (
            <div
              className="w-20 h-20 flex items-center justify-center text-xl font-bold"
              style={{
                borderRadius: theme.avatarRadius,
                border: theme.avatarBorder,
                backgroundColor: getAvatarColor(data.display_name || data.username),
                color: '#fff',
                boxShadow: theme.avatarGlow || '0 4px 15px rgba(0,0,0,0.2)',
              }}
            >
              {getInitials(data.display_name || data.username || '?')}
            </div>
          )}
        </div>

        {/* Name */}
        <div>
          <h1 className="text-lg font-bold font-['Space_Grotesk']" style={{ color: theme.textColor }}>
            {data.display_name || data.username || 'Your Name'}
          </h1>
          {data.bio && (
            <p className="text-xs mt-1 line-clamp-2" style={{ color: theme.secondaryTextColor }}>{data.bio}</p>
          )}
          {data.location && (
            <p className="text-[11px] mt-1 flex items-center justify-center gap-1" style={{ color: theme.secondaryTextColor, opacity: 0.75 }}>
              <MapPin size={11} /> {data.location}
            </p>
          )}
        </div>

        {/* Social Icons */}
        {socialEntries.length > 0 && (
          <div className="flex gap-2 flex-wrap justify-center">
            {socialEntries.map(([platform, url]) => (
              <a
                key={platform}
                href={isPreview ? '#' : url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={isPreview ? (e) => e.preventDefault() : undefined}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110"
                style={{ color: theme.socialIconColor }}
              >
                <PlatformIcon platform={platform} size={14} />
              </a>
            ))}
          </div>
        )}

        {/* Links */}
        <div className="w-full flex flex-col gap-2 mt-1">
          {activeLinks.length === 0 && (
            <p className="text-xs py-6" style={{ color: theme.secondaryTextColor }}>No links yet</p>
          )}
          {activeLinks.map((link, idx) => {
            const linkStyle: React.CSSProperties = {
              background: theme.linkBg,
              color: theme.linkText,
              border: theme.linkBorder !== 'none' ? theme.linkBorder : undefined,
              borderRadius: linkRadius,
              boxShadow: theme.linkShadow !== 'none' ? theme.linkShadow : undefined,
              fontFamily: font,
              ...btnOverrides,
            };

            return (
              <a
                key={idx}
                href={isPreview ? '#' : link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => handleClick(link.order, link.url, e)}
                className={`w-full flex items-center gap-2 px-3 py-2.5 transition-all duration-200 hover:-translate-y-0.5 ${theme.extraLinkClasses || ''}`}
                style={linkStyle}
              >
                <PlatformIcon platform={link.icon} size={16} className="shrink-0" />
                <span className="flex-1 text-xs font-medium text-center truncate">{link.title}</span>
                <div className="w-4" />
              </a>
            );
          })}
        </div>

        {/* Footer */}
        {!hideFooter && (
          <p className="text-[9px] mt-4" style={{ color: theme.textColor, opacity: 0.4 }}>
            Built with LinkForge
          </p>
        )}
      </div>
    </div>
  );
}
