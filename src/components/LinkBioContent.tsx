import { MapPin } from 'lucide-react';
import { PageData } from '@/lib/types';
import { PlatformIcon } from './PlatformIcon';

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
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 55%)`;
}

export function LinkBioContent({ data, isPreview = false, onLinkClick }: LinkBioContentProps) {
  const activeLinks = data.links.filter(l => l.enabled).sort((a, b) => a.order - b.order);
  const socialEntries = Object.entries(data.social_icons || {}).filter(([, url]) => url);

  const handleClick = (index: number, url: string, e: React.MouseEvent) => {
    if (isPreview) {
      e.preventDefault();
      return;
    }
    onLinkClick?.(index, url);
  };

  return (
    <div className="flex flex-col items-center text-center gap-4">
      {/* Avatar */}
      <div className="mt-4">
        {data.avatar_url ? (
          <img
            src={data.avatar_url}
            alt={data.display_name}
            className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
          />
        ) : (
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold text-primary-foreground border-4 border-primary/20"
            style={{ backgroundColor: getAvatarColor(data.display_name || data.username) }}
          >
            {getInitials(data.display_name || data.username || '?')}
          </div>
        )}
      </div>

      {/* Name */}
      <div>
        <h1 className="text-xl font-bold font-['Space_Grotesk']">
          {data.display_name || data.username || 'Your Name'}
        </h1>
        {data.bio && <p className="text-sm text-muted-foreground mt-1">{data.bio}</p>}
        {data.location && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
            <MapPin size={12} /> {data.location}
          </p>
        )}
      </div>

      {/* Social Icons */}
      {socialEntries.length > 0 && (
        <div className="flex gap-3 flex-wrap justify-center">
          {socialEntries.map(([platform, url]) => (
            <a
              key={platform}
              href={isPreview ? '#' : url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={isPreview ? (e) => e.preventDefault() : undefined}
              className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <PlatformIcon platform={platform} size={16} />
            </a>
          ))}
        </div>
      )}

      {/* Links */}
      <div className="w-full flex flex-col gap-3 mt-2">
        {activeLinks.length === 0 && (
          <p className="text-sm text-muted-foreground py-8">No links yet</p>
        )}
        {activeLinks.map((link, idx) => (
          <a
            key={idx}
            href={isPreview ? '#' : link.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => handleClick(link.order, link.url, e)}
            className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-md transition-all"
          >
            <PlatformIcon platform={link.icon} size={18} className="text-primary shrink-0" />
            <span className="flex-1 text-sm font-medium text-left truncate">{link.title}</span>
            <svg className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </a>
        ))}
      </div>

      {/* Footer */}
      <p className="text-[10px] text-muted-foreground mt-6 opacity-60">
        Built with LinkForge
      </p>
    </div>
  );
}
