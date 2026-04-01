import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PAGE_TEMPLATES, Template } from '@/lib/templates';
import { themes } from '@/lib/themes';
import { Wand2 } from 'lucide-react';
import { useState } from 'react';

interface Props {
  onSelect: (template: Template) => void;
}

export function TemplateSelector({ onSelect }: Props) {
  const [open, setOpen] = useState(false);

  const handleSelect = (t: Template) => {
    onSelect(t);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Wand2 size={14} /> Start from Template
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-['Space_Grotesk']">Choose a Template</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
          {PAGE_TEMPLATES.map(t => {
            const theme = themes[t.theme] || themes.default;
            return (
              <button
                key={t.id}
                onClick={() => handleSelect(t)}
                className="border rounded-xl p-4 hover:border-primary/50 hover:shadow-md transition-all text-left cursor-pointer group"
              >
                {/* Mini preview */}
                <div
                  className="w-full aspect-[9/14] rounded-lg mb-3 flex flex-col items-center justify-center gap-1 p-3"
                  style={{ background: theme.background }}
                >
                  <span className="text-2xl">{t.avatar_emoji}</span>
                  <div className="w-12 h-1.5 rounded-full mt-1" style={{ background: theme.textColor, opacity: 0.7 }} />
                  <div className="w-10 h-1 rounded-full" style={{ background: theme.textColor, opacity: 0.4 }} />
                  <div className="w-full space-y-1 mt-2">
                    {t.links.slice(0, 3).map((_, i) => (
                      <div
                        key={i}
                        className="w-full h-2.5 rounded"
                        style={{
                          background: theme.linkBg,
                          border: theme.linkBorder !== 'none' ? theme.linkBorder : undefined,
                          borderRadius: theme.linkRadius,
                        }}
                      />
                    ))}
                  </div>
                </div>
                <h3 className="font-semibold text-sm font-['Space_Grotesk'] group-hover:text-primary transition-colors">
                  {t.name}
                </h3>
                <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{t.bio}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{t.links.length} links · {theme.name}</p>
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
