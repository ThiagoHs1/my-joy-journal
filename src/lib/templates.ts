import { PageData, LinkItem } from '@/lib/types';

export interface Template {
  id: string;
  name: string;
  avatar_emoji: string;
  bio: string;
  links: LinkItem[];
  social_icons: Record<string, string>;
  theme: string;
  theme_options: Record<string, string>;
}

export const PAGE_TEMPLATES: Template[] = [
  {
    id: 'developer',
    name: 'Developer',
    avatar_emoji: '👨‍💻',
    bio: 'Full Stack Developer | Open Source Enthusiast',
    links: [
      { title: 'GitHub', url: 'https://github.com/username', icon: 'github', enabled: true, order: 0 },
      { title: 'My Portfolio', url: 'https://myportfolio.dev', icon: 'website', enabled: true, order: 1 },
      { title: 'LinkedIn', url: 'https://linkedin.com/in/username', icon: 'linkedin', enabled: true, order: 2 },
      { title: 'Dev.to Blog', url: 'https://dev.to/username', icon: 'devto', enabled: true, order: 3 },
      { title: 'Twitter / X', url: 'https://x.com/username', icon: 'twitter', enabled: true, order: 4 },
    ],
    social_icons: { github: 'https://github.com/username', linkedin: 'https://linkedin.com/in/username', twitter: 'https://x.com/username' },
    theme: 'default',
    theme_options: {},
  },
  {
    id: 'creator',
    name: 'Content Creator',
    avatar_emoji: '🎬',
    bio: 'Creator | YouTuber | Streamer',
    links: [
      { title: 'YouTube Channel', url: 'https://youtube.com/@username', icon: 'youtube', enabled: true, order: 0 },
      { title: 'Twitch Stream', url: 'https://twitch.tv/username', icon: 'twitch', enabled: true, order: 1 },
      { title: 'Instagram', url: 'https://instagram.com/username', icon: 'instagram', enabled: true, order: 2 },
      { title: 'TikTok', url: 'https://tiktok.com/@username', icon: 'tiktok', enabled: true, order: 3 },
      { title: 'Discord Server', url: 'https://discord.gg/invite', icon: 'discord', enabled: true, order: 4 },
      { title: 'Merch Store', url: 'https://merch.example.com', icon: 'link', enabled: true, order: 5 },
    ],
    social_icons: { youtube: 'https://youtube.com/@username', instagram: 'https://instagram.com/username', tiktok: 'https://tiktok.com/@username' },
    theme: 'neon',
    theme_options: {},
  },
  {
    id: 'designer',
    name: 'Designer',
    avatar_emoji: '🎨',
    bio: 'UI/UX Designer | Visual Storyteller',
    links: [
      { title: 'Dribbble', url: 'https://dribbble.com/username', icon: 'dribbble', enabled: true, order: 0 },
      { title: 'Behance', url: 'https://behance.net/username', icon: 'behance', enabled: true, order: 1 },
      { title: 'Figma Community', url: 'https://figma.com/@username', icon: 'figma', enabled: true, order: 2 },
      { title: 'Portfolio', url: 'https://portfolio.design', icon: 'website', enabled: true, order: 3 },
      { title: 'Instagram', url: 'https://instagram.com/username', icon: 'instagram', enabled: true, order: 4 },
    ],
    social_icons: { instagram: 'https://instagram.com/username', twitter: 'https://x.com/username' },
    theme: 'minimal-light',
    theme_options: {},
  },
  {
    id: 'musician',
    name: 'Musician',
    avatar_emoji: '🎵',
    bio: 'Artist | Songwriter | Producer',
    links: [
      { title: 'Spotify', url: 'https://open.spotify.com/artist/id', icon: 'spotify', enabled: true, order: 0 },
      { title: 'Apple Music', url: 'https://music.apple.com/artist', icon: 'link', enabled: true, order: 1 },
      { title: 'YouTube Music', url: 'https://youtube.com/@username', icon: 'youtube', enabled: true, order: 2 },
      { title: 'SoundCloud', url: 'https://soundcloud.com/username', icon: 'link', enabled: true, order: 3 },
      { title: 'Instagram', url: 'https://instagram.com/username', icon: 'instagram', enabled: true, order: 4 },
      { title: 'Merch Store', url: 'https://merch.example.com', icon: 'link', enabled: true, order: 5 },
    ],
    social_icons: { instagram: 'https://instagram.com/username', youtube: 'https://youtube.com/@username' },
    theme: 'gradient-pop',
    theme_options: { gradientPreset: 'Sunset' },
  },
  {
    id: 'business',
    name: 'Business',
    avatar_emoji: '💼',
    bio: 'CEO | Entrepreneur | Speaker',
    links: [
      { title: 'Company Website', url: 'https://company.com', icon: 'website', enabled: true, order: 0 },
      { title: 'LinkedIn', url: 'https://linkedin.com/in/username', icon: 'linkedin', enabled: true, order: 1 },
      { title: 'Twitter / X', url: 'https://x.com/username', icon: 'twitter', enabled: true, order: 2 },
      { title: 'Podcast', url: 'https://podcast.example.com', icon: 'link', enabled: true, order: 3 },
      { title: 'My Book', url: 'https://amazon.com/book', icon: 'link', enabled: true, order: 4 },
      { title: 'Contact Me', url: 'mailto:hello@company.com', icon: 'email', enabled: true, order: 5 },
    ],
    social_icons: { linkedin: 'https://linkedin.com/in/username', twitter: 'https://x.com/username', email: 'mailto:hello@company.com' },
    theme: 'corporate',
    theme_options: {},
  },
  {
    id: 'anime',
    name: 'Anime Fan',
    avatar_emoji: '🎌',
    bio: 'Otaku | Gamer | Writer',
    links: [
      { title: 'MyAnimeList', url: 'https://myanimelist.net/profile/username', icon: 'link', enabled: true, order: 0 },
      { title: 'Crunchyroll', url: 'https://crunchyroll.com', icon: 'link', enabled: true, order: 1 },
      { title: 'Twitter / X', url: 'https://x.com/username', icon: 'twitter', enabled: true, order: 2 },
      { title: 'Discord Server', url: 'https://discord.gg/invite', icon: 'discord', enabled: true, order: 3 },
      { title: 'Fanfiction', url: 'https://archiveofourown.org/users/username', icon: 'link', enabled: true, order: 4 },
      { title: 'AniList', url: 'https://anilist.co/user/username', icon: 'link', enabled: true, order: 5 },
    ],
    social_icons: { twitter: 'https://x.com/username' },
    theme: 'anime',
    theme_options: {},
  },
];
