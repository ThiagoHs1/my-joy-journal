import { LucideProps } from 'lucide-react';
import {
  Github, Linkedin, Twitter, Instagram, Youtube, Twitch,
  Music2, Globe, Mail, MessageCircle, Send, BookOpen,
  Code2, Dribbble, Figma, BookMarked, Link2, Disc3,
  MessageSquare
} from 'lucide-react';
import React from 'react';

type IconComponent = React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>>;

const iconMap: Record<string, IconComponent> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
  twitch: Twitch,
  tiktok: Music2,
  discord: MessageSquare,
  spotify: Disc3,
  website: Globe,
  email: Mail,
  whatsapp: MessageCircle,
  telegram: Send,
  medium: BookOpen,
  devto: Code2,
  dribbble: Dribbble,
  behance: BookMarked,
  figma: Figma,
  notion: BookMarked,
  link: Link2,
};

interface PlatformIconProps {
  platform: string;
  className?: string;
  size?: number;
}

export function PlatformIcon({ platform, className, size = 20 }: PlatformIconProps) {
  const Icon = iconMap[platform] || Link2;
  return <Icon className={className} size={size} />;
}
