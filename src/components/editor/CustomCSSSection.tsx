import { Label } from '@/components/ui/label';
import { AlertTriangle } from 'lucide-react';

interface Props {
  css: string;
  onChange: (css: string) => void;
}

export function CustomCSSSection({ css, onChange }: Props) {
  return (
    <div className="space-y-3 pb-4">
      <div className="flex items-center gap-2 text-amber-600 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400 p-2 rounded-lg">
        <AlertTriangle size={14} className="shrink-0" />
        <p className="text-[11px]">Custom CSS is for advanced users. Incorrect CSS may break your page.</p>
      </div>
      <textarea
        value={css}
        onChange={(e) => onChange(e.target.value.slice(0, 2000))}
        maxLength={2000}
        placeholder={`/* Custom CSS for your public page */\n.my-class {\n  color: red;\n}`}
        className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-mono"
      />
      <p className="text-[10px] text-muted-foreground text-right">{(css || '').length}/2000</p>
    </div>
  );
}
