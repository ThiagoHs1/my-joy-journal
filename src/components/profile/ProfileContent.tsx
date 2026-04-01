import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { PageData } from '@/lib/types';
import { PlatformIcon } from '@/components/PlatformIcon';
import { getTheme, getResolvedBackground, getResolvedLinkRadius, getResolvedFont, getButtonStyleOverrides } from '@/lib/themes';

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
    if (key && val) {
      const camelKey = key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      result[camelKey] = val;
    }
  });
  return result;
}

export function ProfileContent({ data, onLinkClick }: Props) {
  const activeLinks = data.links.filter(l => l.enabled).sort((a, b) => a.order - b.order);
  const socialEntries = Object.entries(data.social_icons || {}).filter(([, url]) => url);

  const theme = getTheme(data.theme);
  const bg = getResolvedBackground(theme, data.theme_options);
  const linkRadius = getResolvedLinkRadius(theme, data.theme_options);
  const font = getResolvedFont(theme, data.theme_options);
  const btnOverrides = getButtonStyleOverrides(data.theme_options);
  const hideFooter = data.theme_options.hideFooter === 'true';

  const isAnime = data.theme === 'anime';

  return (
    <div
      className="min-h-screen flex flex-col items-center px-5 py-12 relative"
      style={{ background: bg, fontFamily: font }}
    >
      {/* Anime grid pattern */}
      {isAnime && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(139,92,246,0.08) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
      )}

      <div className="w-full max-w-[480px] flex flex-col items-center text-center gap-4 flex-1 relative z-10">
        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-6"
        >
          {data.avatar_url ? (
            <img
              src={data.avatar_url}
              alt={data.display_name}
              className="w-24 h-24 object-cover shadow-lg"
              style={{
                borderRadius: theme.avatarRadius,
                border: theme.avatarBorder,
                boxShadow: theme.avatarGlow || '0 4px 20px rgba(0,0,0,0.3)',
              }}
            />
          ) : (
            <div
              className="w-24 h-24 flex items-center justify-center text-2xl font-bold shadow-lg"
              style={{
                borderRadius: theme.avatarRadius,
                border: theme.avatarBorder,
                backgroundColor: getAvatarColor(data.display_name || data.username),
                color: '#fff',
                boxShadow: theme.avatarGlow || '0 4px 20px rgba(0,0,0,0.3)',
              }}
            >
              {getInitials(data.display_name || data.username || '?')}
            </div>
          )}
        </motion.div>

        {/* Name & Bio */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h1
            className="text-2xl font-bold font-['Space_Grotesk']"
            style={{ color: theme.textColor, fontFamily: font }}
          >
            {data.display_name || data.username || 'Your Name'}
          </h1>
          {data.bio && (
            <p className="text-sm mt-1.5 line-clamp-2 max-w-xs mx-auto" style={{ color: theme.secondaryTextColor }}>
              {data.bio}
            </p>
          )}
          {data.location && (
            <p className="text-[13px] mt-1.5 flex items-center justify-center gap-1" style={{ color: theme.secondaryTextColor, opacity: 0.75 }}>
              <MapPin size={13} /> {data.location}
            </p>
          )}
        </motion.div>

        {/* Social Icons */}
        {socialEntries.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="flex gap-3 flex-wrap justify-center"
          >
            {socialEntries.map(([platform, url]) => (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{ color: theme.socialIconColor }}
              >
                <PlatformIcon platform={platform} size={16} />
              </a>
            ))}
          </motion.div>
        )}

        {/* Links */}
        <div className="w-full flex flex-col gap-3 mt-3">
          {activeLinks.map((link, idx) => {
            const baseLinkStyle: React.CSSProperties = {
              background: theme.linkBg,
              color: theme.linkText,
              border: theme.linkBorder !== 'none' ? theme.linkBorder : undefined,
              borderRadius: linkRadius,
              boxShadow: theme.linkShadow !== 'none' ? theme.linkShadow : undefined,
              fontFamily: font,
              ...btnOverrides,
            };

            return (
              <motion.button
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + idx * 0.08 }}
                onClick={() => onLinkClick(link.order, link.url)}
                className={`w-full h-14 flex items-center px-5 gap-3 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${theme.extraLinkClasses || ''}`}
                style={baseLinkStyle}
                onMouseEnter={(e) => {
                  const hover = parseHoverStyles(theme.linkHover);
                  Object.assign(e.currentTarget.style, hover);
                }}
                onMouseLeave={(e) => {
                  Object.assign(e.currentTarget.style, {
                    background: baseLinkStyle.background,
                    borderColor: baseLinkStyle.border ? '' : undefined,
                    boxShadow: baseLinkStyle.boxShadow || '',
                    color: baseLinkStyle.color,
                  });
                }}
              >
                <PlatformIcon platform={link.icon} size={20} className="shrink-0" style={{ color: 'inherit' }} />
                <span className="flex-1 text-sm font-medium truncate text-center">{link.title}</span>
                <div className="w-5" />
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      {!hideFooter && (
        <a
          href="/"
          className="mt-8 text-xs transition-colors hover:opacity-80"
          style={{ color: theme.textColor, opacity: 0.4 }}
        >
          Made with <span className="font-semibold">LinkForge</span>
        </a>
      )}
    </div>
  );
}
