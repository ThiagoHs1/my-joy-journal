import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { PageData } from '@/lib/types';
import { PlatformIcon } from '@/components/PlatformIcon';

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

export function ProfileContent({ data, onLinkClick }: Props) {
  const activeLinks = data.links.filter(l => l.enabled).sort((a, b) => a.order - b.order);
  const socialEntries = Object.entries(data.social_icons || {}).filter(([, url]) => url);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(252,85%,18%)] via-[hsl(240,30%,12%)] to-[hsl(224,30%,8%)] flex flex-col items-center px-5 py-12 relative">
      <div className="w-full max-w-[480px] flex flex-col items-center text-center gap-4 flex-1">
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
              className="w-24 h-24 rounded-full object-cover border-[3px] border-white/90 shadow-lg shadow-black/30"
            />
          ) : (
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold text-white border-[3px] border-white/90 shadow-lg shadow-black/30"
              style={{ backgroundColor: getAvatarColor(data.display_name || data.username) }}
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
          <h1 className="text-2xl font-bold font-['Space_Grotesk'] text-white">
            {data.display_name || data.username || 'Your Name'}
          </h1>
          {data.bio && (
            <p className="text-sm text-white/80 mt-1.5 line-clamp-2 max-w-xs mx-auto">{data.bio}</p>
          )}
          {data.location && (
            <p className="text-[13px] text-white/60 mt-1.5 flex items-center justify-center gap-1">
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
                className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/25 hover:scale-110 transition-all duration-200"
              >
                <PlatformIcon platform={platform} size={15} />
              </a>
            ))}
          </motion.div>
        )}

        {/* Links */}
        <div className="w-full flex flex-col gap-3 mt-3">
          {activeLinks.map((link, idx) => (
            <motion.button
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + idx * 0.08 }}
              onClick={() => onLinkClick(link.order, link.url)}
              className="w-full h-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center px-5 gap-3 text-white hover:-translate-y-0.5 hover:bg-white/15 hover:shadow-lg hover:shadow-black/20 transition-all duration-200 cursor-pointer"
            >
              <PlatformIcon platform={link.icon} size={20} className="shrink-0 text-white/70" />
              <span className="flex-1 text-sm font-medium truncate text-center">{link.title}</span>
              <div className="w-5" /> {/* spacer for centering */}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <a
        href="/"
        className="mt-8 text-xs text-white/40 hover:text-white/60 transition-colors"
      >
        Made with <span className="font-semibold">LinkForge</span>
      </a>
    </div>
  );
}
