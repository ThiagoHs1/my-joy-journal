import { useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { PageData } from '@/lib/types';
import { toast } from 'sonner';

interface ProfileSectionProps {
  data: PageData;
  onChange: (data: Partial<PageData>) => void;
}

export function ProfileSection({ data, onChange }: ProfileSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      toast.error('Please upload a PNG or JPG image.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      onChange({ avatar_url: event.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      {/* Avatar */}
      <div className="space-y-2">
        <Label>Avatar</Label>
        <div className="flex items-center gap-4">
          {data.avatar_url ? (
            <div className="relative">
              <img src={data.avatar_url} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-2 border-border" />
              <button
                onClick={() => onChange({ avatar_url: '' })}
                className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-20 h-20 rounded-full border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary transition-colors"
            >
              <Upload size={20} className="text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 space-y-2">
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
              Upload Image
            </Button>
            <input ref={fileInputRef} type="file" accept="image/png,image/jpeg" className="hidden" onChange={handleFileUpload} />
            <Input
              placeholder="Or paste an image URL"
              value={data.avatar_url?.startsWith('data:') ? '' : data.avatar_url}
              onChange={(e) => onChange({ avatar_url: e.target.value })}
              className="text-xs"
            />
          </div>
        </div>
      </div>

      {/* Display Name */}
      <div className="space-y-2">
        <Label>Display Name *</Label>
        <Input
          value={data.display_name}
          onChange={(e) => onChange({ display_name: e.target.value.slice(0, 50) })}
          placeholder="Thiago Sanchez"
          maxLength={50}
        />
        <p className="text-xs text-muted-foreground text-right">{data.display_name.length}/50</p>
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <Label>Bio</Label>
        <Textarea
          value={data.bio}
          onChange={(e) => onChange({ bio: e.target.value.slice(0, 160) })}
          placeholder="Full Stack Dev | IT Support | Anime lover 🎌"
          maxLength={160}
          rows={2}
        />
        <p className="text-xs text-muted-foreground text-right">{data.bio.length}/160</p>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label>Location</Label>
        <Input
          value={data.location}
          onChange={(e) => onChange({ location: e.target.value })}
          placeholder="Santo Ângelo, RS — Brazil"
        />
      </div>
    </div>
  );
}
