import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
  options: Record<string, string>;
  onChange: (key: string, value: string) => void;
}

const ENTRANCE_STYLES = [
  { value: 'fade-up', label: 'Fade Up' },
  { value: 'fade-in', label: 'Fade In' },
  { value: 'scale-up', label: 'Scale Up' },
  { value: 'slide-left', label: 'Slide Left' },
  { value: 'slide-right', label: 'Slide Right' },
] as const;

const SPEED_OPTIONS = [
  { value: '50', label: 'Fast (50ms)' },
  { value: '80', label: 'Normal (80ms)' },
  { value: '120', label: 'Slow (120ms)' },
] as const;

export function AnimationsSection({ options, onChange }: Props) {
  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-medium">Entrance Animation</Label>
          <p className="text-xs text-muted-foreground">Stagger fade-in on load</p>
        </div>
        <Switch
          checked={options.entranceAnimation !== 'false'}
          onCheckedChange={(v) => onChange('entranceAnimation', v ? 'true' : 'false')}
        />
      </div>

      {options.entranceAnimation !== 'false' && (
        <>
          <div>
            <Label className="text-xs mb-1 block">Entrance Style</Label>
            <Select value={options.entranceStyle || 'fade-up'} onValueChange={(v) => onChange('entranceStyle', v)}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {ENTRANCE_STYLES.map(s => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs mb-1 block">Speed</Label>
            <Select value={options.entranceSpeed || '80'} onValueChange={(v) => onChange('entranceSpeed', v)}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {SPEED_OPTIONS.map(s => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-medium">Hover Animation</Label>
          <p className="text-xs text-muted-foreground">Lift + shadow on hover</p>
        </div>
        <Switch
          checked={options.hoverAnimation !== 'false'}
          onCheckedChange={(v) => onChange('hoverAnimation', v ? 'true' : 'false')}
        />
      </div>
    </div>
  );
}
