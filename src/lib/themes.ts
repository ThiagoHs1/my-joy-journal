export interface ThemeConfig {
  id: string;
  name: string;
  background: string;
  textColor: string;
  secondaryTextColor: string;
  socialIconColor: string;
  avatarBorder: string;
  avatarRadius: string;
  linkBg: string;
  linkText: string;
  linkBorder: string;
  linkRadius: string;
  linkHover: string;
  linkShadow: string;
  fontFamily: string;
  // Extra CSS classes/styles
  extraLinkClasses?: string;
  avatarGlow?: string;
}

export const PRESET_GRADIENTS = [
  { name: 'Sunset', value: 'linear-gradient(135deg, #FF512F, #DD2476)' },
  { name: 'Ocean', value: 'linear-gradient(135deg, #2193b0, #6dd5ed)' },
  { name: 'Purple Rain', value: 'linear-gradient(135deg, #7F00FF, #E100FF)' },
  { name: 'Forest', value: 'linear-gradient(135deg, #11998e, #38ef7d)' },
  { name: 'Peach', value: 'linear-gradient(135deg, #ee9ca7, #ffdde1)' },
  { name: 'Midnight', value: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' },
  { name: 'Candy', value: 'linear-gradient(135deg, #fc5c7d, #6a82fb)' },
  { name: 'Fire', value: 'linear-gradient(135deg, #f12711, #f5af19)' },
] as const;

export const FONT_OPTIONS = [
  { value: 'default', label: 'Default (theme)' },
  { value: "'Inter', sans-serif", label: 'Inter' },
  { value: "'Poppins', sans-serif", label: 'Poppins' },
  { value: "'Roboto Mono', monospace", label: 'Roboto Mono' },
  { value: "'Playfair Display', serif", label: 'Playfair Display' },
  { value: "'Space Grotesk', sans-serif", label: 'Space Grotesk' },
] as const;

export const BUTTON_STYLES = [
  { value: 'default', label: 'Filled (theme default)' },
  { value: 'outline', label: 'Outline' },
  { value: 'soft', label: 'Soft' },
  { value: 'pill', label: 'Pill' },
] as const;

export const themes: Record<string, ThemeConfig> = {
  default: {
    id: 'default',
    name: 'Default',
    background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
    textColor: '#FFFFFF',
    secondaryTextColor: 'rgba(255,255,255,0.8)',
    socialIconColor: 'rgba(255,255,255,0.8)',
    avatarBorder: '3px solid rgba(255,255,255,0.9)',
    avatarRadius: '50%',
    linkBg: '#FFFFFF',
    linkText: '#1a1a2e',
    linkBorder: 'none',
    linkRadius: '12px',
    linkHover: 'box-shadow: 0 8px 25px rgba(0,0,0,0.3)',
    linkShadow: '0 2px 8px rgba(0,0,0,0.15)',
    fontFamily: "'Inter', sans-serif",
  },
  'minimal-light': {
    id: 'minimal-light',
    name: 'Minimal Light',
    background: '#FFFFFF',
    textColor: '#000000',
    secondaryTextColor: 'rgba(0,0,0,0.6)',
    socialIconColor: '#000000',
    avatarBorder: '3px solid #E5E7EB',
    avatarRadius: '50%',
    linkBg: 'transparent',
    linkText: '#000000',
    linkBorder: '1px solid #E5E7EB',
    linkRadius: '8px',
    linkHover: 'border-color: #000000',
    linkShadow: 'none',
    fontFamily: "'Inter', sans-serif",
  },
  'minimal-dark': {
    id: 'minimal-dark',
    name: 'Minimal Dark',
    background: '#000000',
    textColor: '#FFFFFF',
    secondaryTextColor: 'rgba(255,255,255,0.7)',
    socialIconColor: '#FFFFFF',
    avatarBorder: '3px solid #333',
    avatarRadius: '50%',
    linkBg: 'transparent',
    linkText: '#FFFFFF',
    linkBorder: '1px solid #333',
    linkRadius: '8px',
    linkHover: 'border-color: #FFFFFF',
    linkShadow: 'none',
    fontFamily: "'Inter', sans-serif",
  },
  neon: {
    id: 'neon',
    name: 'Neon',
    background: '#0A0A0A',
    textColor: '#FFFFFF',
    secondaryTextColor: 'rgba(255,255,255,0.7)',
    socialIconColor: '#06B6D4',
    avatarBorder: '3px solid #06B6D4',
    avatarRadius: '50%',
    avatarGlow: '0 0 20px rgba(6,182,212,0.4)',
    linkBg: 'transparent',
    linkText: '#06B6D4',
    linkBorder: '1px solid #06B6D4',
    linkRadius: '8px',
    linkHover: 'box-shadow: 0 0 25px rgba(6,182,212,0.5)',
    linkShadow: '0 0 15px rgba(6,182,212,0.3)',
    fontFamily: "'Inter', sans-serif",
  },
  'gradient-pop': {
    id: 'gradient-pop',
    name: 'Gradient Pop',
    background: 'linear-gradient(135deg, #FF512F, #DD2476)',
    textColor: '#FFFFFF',
    secondaryTextColor: 'rgba(255,255,255,0.85)',
    socialIconColor: 'rgba(255,255,255,0.9)',
    avatarBorder: '3px solid rgba(255,255,255,0.9)',
    avatarRadius: '50%',
    linkBg: 'rgba(255,255,255,0.2)',
    linkText: '#FFFFFF',
    linkBorder: '1px solid rgba(255,255,255,0.3)',
    linkRadius: '16px',
    linkHover: 'background: rgba(255,255,255,0.3)',
    linkShadow: 'none',
    fontFamily: "'Inter', sans-serif",
    extraLinkClasses: 'backdrop-blur-sm',
  },
  brutalist: {
    id: 'brutalist',
    name: 'Brutalist',
    background: '#FFFFFF',
    textColor: '#000000',
    secondaryTextColor: 'rgba(0,0,0,0.7)',
    socialIconColor: '#000000',
    avatarBorder: '3px solid #000000',
    avatarRadius: '0',
    linkBg: '#000000',
    linkText: '#FFFFFF',
    linkBorder: '3px solid #000000',
    linkRadius: '0px',
    linkHover: 'background: #FFFFFF; color: #000000',
    linkShadow: '4px 4px 0px #000',
    fontFamily: "'Roboto Mono', monospace",
  },
  glassmorphism: {
    id: 'glassmorphism',
    name: 'Glassmorphism',
    background: 'linear-gradient(135deg, #667eea, #764ba2, #f093fb)',
    textColor: '#FFFFFF',
    secondaryTextColor: 'rgba(255,255,255,0.85)',
    socialIconColor: 'rgba(255,255,255,0.9)',
    avatarBorder: '3px solid rgba(255,255,255,0.4)',
    avatarRadius: '50%',
    linkBg: 'rgba(255,255,255,0.15)',
    linkText: '#FFFFFF',
    linkBorder: '1px solid rgba(255,255,255,0.2)',
    linkRadius: '16px',
    linkHover: 'background: rgba(255,255,255,0.25)',
    linkShadow: 'none',
    fontFamily: "'Inter', sans-serif",
    extraLinkClasses: 'backdrop-blur-xl',
  },
  retro: {
    id: 'retro',
    name: 'Retro',
    background: '#FDF6E3',
    textColor: '#2E2E2E',
    secondaryTextColor: 'rgba(46,46,46,0.7)',
    socialIconColor: '#2E2E2E',
    avatarBorder: '3px solid #2E2E2E',
    avatarRadius: '50%',
    linkBg: '#2E2E2E',
    linkText: '#FDF6E3',
    linkBorder: 'none',
    linkRadius: '4px',
    linkHover: 'background: #4A4A4A',
    linkShadow: '3px 3px 0 #1A1A1A',
    fontFamily: "'Roboto Mono', monospace",
  },
  pastel: {
    id: 'pastel',
    name: 'Pastel',
    background: '#FFF0F5',
    textColor: '#4A3568',
    secondaryTextColor: 'rgba(74,53,104,0.7)',
    socialIconColor: '#7C3AED',
    avatarBorder: '3px solid #E8E0F0',
    avatarRadius: '50%',
    linkBg: '#E8E0F0',
    linkText: '#4A3568',
    linkBorder: 'none',
    linkRadius: '24px',
    linkHover: 'background: #DDD0E8',
    linkShadow: 'none',
    fontFamily: "'Inter', sans-serif",
  },
  corporate: {
    id: 'corporate',
    name: 'Corporate',
    background: '#F3F4F6',
    textColor: '#1E3A5F',
    secondaryTextColor: 'rgba(30,58,95,0.7)',
    socialIconColor: '#1E3A5F',
    avatarBorder: '3px solid #1E3A5F',
    avatarRadius: '50%',
    linkBg: '#1E3A5F',
    linkText: '#FFFFFF',
    linkBorder: 'none',
    linkRadius: '8px',
    linkHover: 'background: #2A4F7A',
    linkShadow: 'none',
    fontFamily: "'Inter', sans-serif",
  },
  anime: {
    id: 'anime',
    name: 'Anime',
    background: 'linear-gradient(135deg, #1a0533, #2d1b69)',
    textColor: '#FFFFFF',
    secondaryTextColor: 'rgba(255,255,255,0.8)',
    socialIconColor: '#C4B5FD',
    avatarBorder: '3px solid #8B5CF6',
    avatarRadius: '50%',
    avatarGlow: '0 0 20px rgba(139,92,246,0.4)',
    linkBg: 'rgba(139,92,246,0.3)',
    linkText: '#FFFFFF',
    linkBorder: '1px solid #8B5CF6',
    linkRadius: '12px',
    linkHover: 'background: rgba(139,92,246,0.5); box-shadow: 0 0 15px rgba(139,92,246,0.3)',
    linkShadow: 'none',
    fontFamily: "'Inter', sans-serif",
  },
  tropical: {
    id: 'tropical',
    name: 'Tropical',
    background: 'linear-gradient(135deg, #134E5E, #71B280)',
    textColor: '#FFFFFF',
    secondaryTextColor: 'rgba(255,255,255,0.85)',
    socialIconColor: 'rgba(255,255,255,0.9)',
    avatarBorder: '3px solid rgba(255,255,255,0.9)',
    avatarRadius: '50%',
    linkBg: '#FFFFFF',
    linkText: '#134E5E',
    linkBorder: 'none',
    linkRadius: '50px',
    linkHover: 'background: #FEF9C3',
    linkShadow: '0 2px 8px rgba(0,0,0,0.1)',
    fontFamily: "'Inter', sans-serif",
  },
};

export function getTheme(id: string): ThemeConfig {
  return themes[id] || themes.default;
}

export function getResolvedBackground(theme: ThemeConfig, themeOptions: Record<string, string>): string {
  if (themeOptions.customBgEnabled === 'true' && themeOptions.customBg) {
    return themeOptions.customBg;
  }
  if (theme.id === 'gradient-pop' && themeOptions.gradientPreset) {
    const preset = PRESET_GRADIENTS.find(g => g.name === themeOptions.gradientPreset);
    if (preset) return preset.value;
  }
  return theme.background;
}

export function getResolvedLinkRadius(theme: ThemeConfig, themeOptions: Record<string, string>): string {
  if (themeOptions.buttonRadius) return `${themeOptions.buttonRadius}px`;
  return theme.linkRadius;
}

export function getResolvedFont(theme: ThemeConfig, themeOptions: Record<string, string>): string {
  if (themeOptions.fontFamily && themeOptions.fontFamily !== 'default') return themeOptions.fontFamily;
  return theme.fontFamily;
}

export function getButtonStyleOverrides(themeOptions: Record<string, string>): React.CSSProperties | null {
  const style = themeOptions.buttonStyle;
  if (!style || style === 'default') return null;
  switch (style) {
    case 'outline': return { background: 'transparent', border: '2px solid currentColor' };
    case 'soft': return { opacity: 0.85 };
    case 'pill': return { borderRadius: '50px' };
    default: return null;
  }
}

export const THEME_ORDER = [
  'default', 'minimal-light', 'minimal-dark', 'neon', 'gradient-pop', 'brutalist',
  'glassmorphism', 'retro', 'pastel', 'corporate', 'anime', 'tropical',
];
