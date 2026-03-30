import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SocialIcons } from '@/lib/types';
import { PlatformIcon } from '@/components/PlatformIcon';

interface SocialIconsSectionProps {
  socialIcons: SocialIcons;
  onChange: (icons: SocialIcons) => void;
}

const SOCIAL_FIELDS: { key: keyof SocialIcons; label: string; placeholder: string }[] = [
  { key: 'github', label: 'GitHub', placeholder: 'https://github.com/username' },
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/username' },
  { key: 'twitter', label: 'Twitter/X', placeholder: 'https://x.com/username' },
  { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/username' },
  { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@channel' },
  { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@username' },
  { key: 'email', label: 'Email', placeholder: 'mailto:you@email.com' },
  { key: 'whatsapp', label: 'WhatsApp', placeholder: 'https://wa.me/5511999999999' },
];

export function SocialIconsSection({ socialIcons, onChange }: SocialIconsSectionProps) {
  const filledCount = Object.values(socialIcons).filter(Boolean).length;

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Small icons shown below your bio. Fill in a URL to show the icon. ({filledCount}/8)
      </p>
      {SOCIAL_FIELDS.map(({ key, label, placeholder }) => (
        <div key={key} className="flex items-center gap-3">
          <PlatformIcon platform={key} size={18} className="text-muted-foreground shrink-0" />
          <div className="flex-1 space-y-1">
            <Label className="text-xs">{label}</Label>
            <Input
              placeholder={placeholder}
              value={socialIcons[key] || ''}
              onChange={(e) => onChange({ ...socialIcons, [key]: e.target.value })}
              className="h-8 text-xs"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
