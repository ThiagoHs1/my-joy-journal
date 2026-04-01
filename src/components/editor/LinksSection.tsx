import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Plus, X, GripVertical, Minus, Calendar, ChevronDown, Video, Music } from 'lucide-react';
import { LinkItem, PLATFORM_ICONS, detectPlatform, getYouTubeId, getSpotifyEmbedUrl } from '@/lib/types';
import { PlatformIcon } from '@/components/PlatformIcon';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface LinksSectionProps {
  links: LinkItem[];
  onChange: (links: LinkItem[]) => void;
}

function SortableSeparatorCard({
  link, index, onUpdate, onRemove,
}: { link: LinkItem; index: number; onUpdate: (i: number, u: Partial<LinkItem>) => void; onRemove: (i: number) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: `link-${index}` });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style} className="border rounded-lg p-3 bg-muted/50 space-y-2">
      <div className="flex items-center gap-2">
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
          <GripVertical size={16} />
        </button>
        <Minus size={14} className="text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground flex-1">Separator</span>
        <Select value={link.separatorStyle || 'line'} onValueChange={(v: any) => onUpdate(index, { separatorStyle: v })}>
          <SelectTrigger className="h-7 text-xs w-24"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="line">Line</SelectItem>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="space">Space</SelectItem>
          </SelectContent>
        </Select>
        <button onClick={() => onRemove(index)} className="text-muted-foreground hover:text-destructive"><X size={14} /></button>
      </div>
      {link.separatorStyle === 'text' && (
        <Input placeholder="Category label" value={link.separatorText || ''} onChange={(e) => onUpdate(index, { separatorText: e.target.value })} className="h-8 text-sm ml-6" />
      )}
    </div>
  );
}

function SortableLinkCard({
  link, index, onUpdate, onRemove,
}: { link: LinkItem; index: number; onUpdate: (i: number, u: Partial<LinkItem>) => void; onRemove: (i: number) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: `link-${index}` });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const handleUrlChange = (url: string) => {
    const icon = detectPlatform(url);
    onUpdate(index, { url, icon });
  };

  const canEmbed = getYouTubeId(link.url) || getSpotifyEmbedUrl(link.url);
  const isScheduled = link.showFrom || link.showUntil;

  return (
    <div ref={setNodeRef} style={style} className={`border rounded-lg p-4 bg-card space-y-3 ${!link.enabled ? 'opacity-50' : ''}`}>
      <div className="flex items-center gap-2">
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
          <GripVertical size={16} />
        </button>
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <PlatformIcon platform={link.icon} size={16} className="text-primary shrink-0" />
          <span className="text-sm font-medium truncate">{link.title || 'Untitled Link'}</span>
          {isScheduled && <Badge variant="secondary" className="text-[10px] shrink-0"><Calendar size={10} className="mr-1" />Scheduled</Badge>}
          {link.embed && canEmbed && <Badge variant="secondary" className="text-[10px] shrink-0">{getYouTubeId(link.url) ? <Video size={10} className="mr-1" /> : <Music size={10} className="mr-1" />}Embed</Badge>}
        </div>
        <Switch checked={link.enabled} onCheckedChange={(enabled) => onUpdate(index, { enabled })} />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="text-muted-foreground hover:text-destructive transition-colors"><X size={16} /></button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove link?</AlertDialogTitle>
              <AlertDialogDescription>This will permanently delete "{link.title || 'this link'}".</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onRemove(index)}>Remove</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="space-y-2 pl-6">
        <Input placeholder="Link Title" value={link.title} onChange={(e) => onUpdate(index, { title: e.target.value.slice(0, 60) })} maxLength={60} />
        <Input placeholder="https://example.com" value={link.url} onChange={(e) => handleUrlChange(e.target.value)} type="url" />
        <div className="flex gap-2 items-center">
          <Label className="text-xs shrink-0">Icon</Label>
          <Select value={link.icon} onValueChange={(icon) => onUpdate(index, { icon })}>
            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {PLATFORM_ICONS.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  <span className="flex items-center gap-2"><PlatformIcon platform={p.value} size={14} />{p.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Embed toggle */}
        {canEmbed && (
          <div className="flex items-center justify-between pt-1">
            <Label className="text-xs text-muted-foreground">Show as embed</Label>
            <Switch checked={link.embed || false} onCheckedChange={(v) => onUpdate(index, { embed: v })} />
          </div>
        )}

        {/* Schedule */}
        <Collapsible open={scheduleOpen} onOpenChange={setScheduleOpen}>
          <CollapsibleTrigger className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors pt-1 cursor-pointer">
            <ChevronDown size={12} className={`transition-transform ${scheduleOpen ? 'rotate-180' : ''}`} />
            <Calendar size={12} /> Schedule
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pt-2">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label className="text-[10px]">Show from</Label>
                <Input type="datetime-local" value={link.showFrom || ''} onChange={(e) => onUpdate(index, { showFrom: e.target.value || undefined })} className="h-8 text-xs" />
              </div>
              <div className="flex-1">
                <Label className="text-[10px]">Show until</Label>
                <Input type="datetime-local" value={link.showUntil || ''} onChange={(e) => onUpdate(index, { showUntil: e.target.value || undefined })} className="h-8 text-xs" />
              </div>
            </div>
            {(link.showFrom || link.showUntil) && (
              <Button variant="ghost" size="sm" className="text-xs h-6" onClick={() => onUpdate(index, { showFrom: undefined, showUntil: undefined })}>
                Clear schedule
              </Button>
            )}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}

export function LinksSection({ links, onChange }: LinksSectionProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const addLink = () => {
    if (links.length >= 20) return;
    onChange([...links, { title: '', url: '', icon: 'link', enabled: true, order: links.length, type: 'link' }]);
  };

  const addSeparator = () => {
    if (links.length >= 20) return;
    onChange([...links, { title: '', url: '', icon: 'link', enabled: true, order: links.length, type: 'separator', separatorStyle: 'line' }]);
  };

  const updateLink = (index: number, updates: Partial<LinkItem>) => {
    const updated = links.map((l, i) => (i === index ? { ...l, ...updates } : l));
    onChange(updated);
  };

  const removeLink = (index: number) => {
    onChange(links.filter((_, i) => i !== index).map((l, i) => ({ ...l, order: i })));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = parseInt(String(active.id).replace('link-', ''));
    const newIndex = parseInt(String(over.id).replace('link-', ''));
    const reordered = arrayMove(links, oldIndex, newIndex).map((l, i) => ({ ...l, order: i }));
    onChange(reordered);
  };

  return (
    <div className="space-y-3">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={links.map((_, i) => `link-${i}`)} strategy={verticalListSortingStrategy}>
          {links.map((link, index) =>
            link.type === 'separator' ? (
              <SortableSeparatorCard key={`link-${index}`} link={link} index={index} onUpdate={updateLink} onRemove={removeLink} />
            ) : (
              <SortableLinkCard key={`link-${index}`} link={link} index={index} onUpdate={updateLink} onRemove={removeLink} />
            )
          )}
        </SortableContext>
      </DndContext>

      <div className="flex gap-2">
        <Button onClick={addLink} variant="outline" className="flex-1" disabled={links.length >= 20}>
          <Plus size={16} className="mr-2" /> Add Link {links.length > 0 && `(${links.length}/20)`}
        </Button>
        <Button onClick={addSeparator} variant="outline" disabled={links.length >= 20}>
          <Minus size={16} className="mr-1" /> Separator
        </Button>
      </div>
    </div>
  );
}
