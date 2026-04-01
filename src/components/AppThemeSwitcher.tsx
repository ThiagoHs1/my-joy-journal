import { Settings } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { APP_THEMES, AppThemeId, useAppTheme } from '@/contexts/AppThemeContext';

const THEME_COLORS: Record<AppThemeId, string> = {
  purple: '#8B5CF6',
  blue: '#3B82F6',
  green: '#22C55E',
  amber: '#F59E0B',
  cyan: '#06B6D4',
  pink: '#EC4899',
  mono: '#737373',
};

export function AppThemeSwitcher() {
  const { appTheme, setAppTheme } = useAppTheme();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="w-8 h-8">
          <Settings size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-3" align="end">
        <p className="text-xs font-semibold mb-2">App Theme</p>
        <div className="grid grid-cols-4 gap-2">
          {(Object.keys(APP_THEMES) as AppThemeId[]).map((id) => (
            <button
              key={id}
              onClick={() => setAppTheme(id)}
              className={`w-8 h-8 rounded-full transition-all ${
                appTheme === id ? 'ring-2 ring-offset-2 ring-foreground scale-110' : 'hover:scale-110'
              }`}
              style={{ backgroundColor: THEME_COLORS[id] }}
              title={APP_THEMES[id].name}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
