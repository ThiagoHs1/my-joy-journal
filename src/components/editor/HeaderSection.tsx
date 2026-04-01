import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HeaderBanner } from '@/lib/types';

interface Props {
  banner: HeaderBanner | undefined;
  onChange: (banner: HeaderBanner) => void;
}

const defaults: HeaderBanner = {
  enabled: false,
  type: 'color',
  color: '#6366f1',
  gradientColor1: '#6366f1',
  gradientColor2: '#ec4899',
  gradientAngle: 135,
  height: 150,
};

export function HeaderSection({ banner, onChange }: Props) {
  const b = { ...defaults, ...banner };

  const update = (partial: Partial<HeaderBanner>) => {
    onChange({ ...b, ...partial });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      alert('Max 3MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => update({ imageUrl: reader.result as string, type: 'image' });
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4 pb-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Show Header Banner</Label>
        <Switch checked={b.enabled} onCheckedChange={(v) => update({ enabled: v })} />
      </div>

      {b.enabled && (
        <>
          <div>
            <Label className="text-sm font-medium mb-2 block">Banner Type</Label>
            <Select value={b.type} onValueChange={(v: any) => update({ type: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="color">Solid Color</SelectItem>
                <SelectItem value="gradient">Gradient</SelectItem>
                <SelectItem value="image">Image</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {b.type === 'color' && (
            <div className="flex items-center gap-3">
              <Label className="text-sm">Color</Label>
              <Input type="color" value={b.color || '#6366f1'} onChange={(e) => update({ color: e.target.value })} className="w-12 h-10 p-1 cursor-pointer" />
            </div>
          )}

          {b.type === 'gradient' && (
            <div className="space-y-3">
              <div className="flex gap-3 items-center">
                <div>
                  <Label className="text-xs">Color 1</Label>
                  <Input type="color" value={b.gradientColor1 || '#6366f1'} onChange={(e) => update({ gradientColor1: e.target.value })} className="w-12 h-10 p-1 cursor-pointer" />
                </div>
                <div>
                  <Label className="text-xs">Color 2</Label>
                  <Input type="color" value={b.gradientColor2 || '#ec4899'} onChange={(e) => update({ gradientColor2: e.target.value })} className="w-12 h-10 p-1 cursor-pointer" />
                </div>
              </div>
              <div>
                <Label className="text-xs">Angle: {b.gradientAngle || 135}°</Label>
                <Slider value={[b.gradientAngle || 135]} onValueChange={([v]) => update({ gradientAngle: v })} min={0} max={360} step={5} />
              </div>
              <div className="h-12 rounded-lg" style={{ background: `linear-gradient(${b.gradientAngle}deg, ${b.gradientColor1}, ${b.gradientColor2})` }} />
            </div>
          )}

          {b.type === 'image' && (
            <div className="space-y-2">
              <Input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImageUpload} />
              {b.imageUrl && (
                <div className="h-20 rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${b.imageUrl})` }} />
              )}
            </div>
          )}

          <div>
            <Label className="text-sm">Height: {b.height || 150}px</Label>
            <Slider value={[b.height || 150]} onValueChange={([v]) => update({ height: v })} min={80} max={250} step={10} />
          </div>
        </>
      )}
    </div>
  );
}
