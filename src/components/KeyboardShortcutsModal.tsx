import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Props {
  open: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { keys: ['Ctrl', 'S'], desc: 'Save & Publish' },
  { keys: ['Ctrl', 'Shift', 'N'], desc: 'Add new link' },
  { keys: ['Ctrl', 'Shift', 'P'], desc: 'Open preview in new tab' },
  { keys: ['Ctrl', 'Shift', 'C'], desc: 'Copy page URL' },
  { keys: ['?'], desc: 'Show keyboard shortcuts' },
];

export function KeyboardShortcutsModal({ open, onClose }: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-['Space_Grotesk']">Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-2">
          {SHORTCUTS.map(s => (
            <div key={s.desc} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{s.desc}</span>
              <div className="flex gap-1">
                {s.keys.map(k => (
                  <kbd key={k} className="px-2 py-1 text-[11px] font-mono bg-muted border rounded">{k}</kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
