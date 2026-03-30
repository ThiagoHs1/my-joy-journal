export interface LinkItem {
  title: string;
  url: string;
  icon: string;
  enabled: boolean;
  order: number;
}

export interface SocialIcons {
  github?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  email?: string;
  whatsapp?: string;
}

export interface PageData {
  id?: string;
  username: string;
  display_name: string;
  bio: string;
  location: string;
  avatar_url: string;
  links: LinkItem[];
  social_icons: SocialIcons;
  theme: string;
  theme_options: Record<string, string>;
  edit_token?: string;
  view_count?: number;
}

export const PLATFORM_ICONS = [
  { value: 'github', label: 'GitHub' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitter', label: 'Twitter/X' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'twitch', label: 'Twitch' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'discord', label: 'Discord' },
  { value: 'spotify', label: 'Spotify' },
  { value: 'website', label: 'Website' },
  { value: 'email', label: 'Email' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'medium', label: 'Medium' },
  { value: 'devto', label: 'Dev.to' },
  { value: 'dribbble', label: 'Dribbble' },
  { value: 'behance', label: 'Behance' },
  { value: 'figma', label: 'Figma' },
  { value: 'notion', label: 'Notion' },
  { value: 'link', label: 'Custom Link' },
] as const;

export function detectPlatform(url: string): string {
  const lower = url.toLowerCase();
  if (lower.includes('github.com')) return 'github';
  if (lower.includes('linkedin.com')) return 'linkedin';
  if (lower.includes('twitter.com') || lower.includes('x.com')) return 'twitter';
  if (lower.includes('instagram.com')) return 'instagram';
  if (lower.includes('youtube.com')) return 'youtube';
  if (lower.includes('twitch.tv')) return 'twitch';
  if (lower.includes('tiktok.com')) return 'tiktok';
  if (lower.includes('discord.gg') || lower.includes('discord.com')) return 'discord';
  if (lower.includes('spotify.com')) return 'spotify';
  if (lower.includes('wa.me') || lower.includes('whatsapp')) return 'whatsapp';
  if (lower.includes('t.me') || lower.includes('telegram')) return 'telegram';
  if (lower.includes('medium.com')) return 'medium';
  if (lower.includes('dev.to')) return 'devto';
  if (lower.includes('dribbble.com')) return 'dribbble';
  if (lower.includes('behance.net')) return 'behance';
  if (lower.includes('figma.com')) return 'figma';
  if (lower.includes('notion.so') || lower.includes('notion.site')) return 'notion';
  return 'link';
}

export function generateToken(): string {
  return crypto.randomUUID();
}

export const DEFAULT_PAGE_DATA: PageData = {
  username: '',
  display_name: '',
  bio: '',
  location: '',
  avatar_url: '',
  links: [],
  social_icons: {},
  theme: 'default',
  theme_options: {},
};
