import { PageData } from '@/lib/types';
import { themes, THEME_ORDER, PRESET_GRADIENTS, FONT_OPTIONS, BUTTON_STYLES, getTheme } from '@/lib/themes';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { PlatformIcon } from '@/components/PlatformIcon';

interface Props {
  data: PageData;
  onChange: (partial: Partial<PageData>) => void;
}

function ThemeMiniPreview({ theme }: { theme: typeof themes[string] }) {
  const bg = theme.background;
  const isGradient = bg.includes('gradient');

  return (
    <div
      className="w-full aspect-[9/16] rounded-lg overflow-hidden flex flex-col items-center justify-center gap-1 p-2"
      style={{ background: isGradient ? bg : bg }}
    >
      <div
        className="w-6 h-6 shrink-0"
        style={{
          borderRadius: theme.avatarRadius,
          border: theme.avatarBorder,
          background: 'rgba(128,128,128,0.4)',
        }}
      />
      <div className="w-10 h-1.5 rounded-full" style={{ background: theme.textColor, opacity: 0.8 }} />
      <div className="w-8 h-1 rounded-full" style={{ background: theme.textColor, opacity: 0.4 }} />
      <div className="w-full space-y-1 mt-1">
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className="w-full h-3 rounded"
            style={{
              background: theme.linkBg,
              border: theme.linkBorder !== 'none' ? theme.linkBorder : undefined,
              borderRadius: theme.linkRadius,
              boxShadow: theme.linkShadow !== 'none' ? theme.linkShadow : undefined,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function AppearanceSection({ data, onChange }: Props) {
  const updateOption = (key: string, value: string) => {
    onChange({ theme_options: { ...data.theme_options, [key]: value } });
  };

  const currentTheme = getTheme(data.theme);
  const isGradientPop = data.theme === 'gradient-pop';

  return (
    <div className="space-y-6 pb-4">
      {/* Theme Grid */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Theme</Label>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {THEME_ORDER.map(id => {
            const t = themes[id];
            const active = data.theme === id;
            return (
              <button
                key={id}
                onClick={() => onChange({ theme: id })}
                className={`rounded-xl border-2 p-1.5 transition-all cursor-pointer ${
                  active
                    ? 'border-primary ring-2 ring-primary/30 scale-[1.02]'
                    : 'border-border hover:border-muted-foreground/40'
                }`}
              >
                <ThemeMiniPreview theme={t} />
                <p className="text-[11px] font-medium mt-1.5 truncate text-center">{t.name}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Gradient Pop presets */}
      {isGradientPop && (
        <div>
          <Label className="text-sm font-medium mb-2 block">Gradient Preset</Label>
          <div className="grid grid-cols-4 gap-2">
            {PRESET_GRADIENTS.map(g => (
              <button
                key={g.name}
                onClick={() => updateOption('gradientPreset', g.name)}
                className={`h-10 rounded-lg border-2 transition-all ${
                  data.theme_options.gradientPreset === g.name
                    ? 'border-primary scale-105'
                    : 'border-transparent hover:border-muted-foreground/30'
                }`}
                style={{ background: g.value }}
                title={g.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Custom Background */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Custom Background</Label>
          <Switch
            checked={data.theme_options.customBgEnabled === 'true'}
            onCheckedChange={(v) => updateOption('customBgEnabled', v ? 'true' : 'false')}
          />
        </div>
        {data.theme_options.customBgEnabled === 'true' && (
          <div className="flex gap-2">
            <Input
              type="color"
              value={data.theme_options.customBgColor1 || '#1a1a2e'}
              onChange={(e) => {
                const c1 = e.target.value;
                const c2 = data.theme_options.customBgColor2 || '#16213e';
                updateOption('customBgColor1', c1);
                updateOption('customBg', `linear-gradient(135deg, ${c1}, ${c2})`);
              }}
              className="w-12 h-10 p-1 cursor-pointer"
            />
            <Input
              type="color"
              value={data.theme_options.customBgColor2 || '#16213e'}
              onChange={(e) => {
                const c1 = data.theme_options.customBgColor1 || '#1a1a2e';
                const c2 = e.target.value;
                updateOption('customBgColor2', c2);
                updateOption('customBg', `linear-gradient(135deg, ${c1}, ${c2})`);
              }}
              className="w-12 h-10 p-1 cursor-pointer"
            />
            <span className="text-xs text-muted-foreground self-center ml-1">Pick 2 colors for gradient</span>
          </div>
        )}
      </div>

      {/* Button Style */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Button Style</Label>
        <Select
          value={data.theme_options.buttonStyle || 'default'}
          onValueChange={(v) => updateOption('buttonStyle', v)}
        >
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {BUTTON_STYLES.map(s => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Button Radius */}
      <div>
        <Label className="text-sm font-medium mb-2 block">
          Button Radius: {data.theme_options.buttonRadius || 'theme default'}px
        </Label>
        <Slider
          value={[parseInt(data.theme_options.buttonRadius || '0')]}
          onValueChange={([v]) => updateOption('buttonRadius', String(v))}
          min={0}
          max={50}
          step={1}
        />
      </div>

      {/* Font Family */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Font Family</Label>
        <Select
          value={data.theme_options.fontFamily || 'default'}
          onValueChange={(v) => updateOption('fontFamily', v)}
        >
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {FONT_OPTIONS.map(f => (
              <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Hide Footer */}
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-medium">Hide "Made with LinkForge"</Label>
          <p className="text-xs text-muted-foreground">Remove the branding footer</p>
        </div>
        <Switch
          checked={data.theme_options.hideFooter === 'true'}
          onCheckedChange={(v) => updateOption('hideFooter', v ? 'true' : 'false')}
        />
      </div>
    </div>
  );
}
