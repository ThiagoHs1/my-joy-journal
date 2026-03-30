import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, GripVertical } from 'lucide-react';
import { LinkItem, PLATFORM_ICONS, detectPlatform } from '@/lib/types';
import { PlatformIcon } from '@/components/PlatformIcon';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface LinksSectionProps {
  links: LinkItem[];
  onChange: (links: LinkItem[]) => void;
}

function SortableLinkCard({
  link,
  index,
  onUpdate,
  onRemove,
}: {
  link: LinkItem;
  index: number;
  onUpdate: (index: number, updates: Partial<LinkItem>) => void;
  onRemove: (index: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `link-${index}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleUrlChange = (url: string) => {
    const icon = detectPlatform(url);
    onUpdate(index, { url, icon });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border rounded-lg p-4 bg-card space-y-3 ${!link.enabled ? 'opacity-50' : ''}`}
    >
      <div className="flex items-center gap-2">
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
          <GripVertical size={16} />
        </button>
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <PlatformIcon platform={link.icon} size={16} className="text-primary shrink-0" />
          <span className="text-sm font-medium truncate">{link.title || 'Untitled Link'}</span>
        </div>
        <Switch checked={link.enabled} onCheckedChange={(enabled) => onUpdate(index, { enabled })} />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="text-muted-foreground hover:text-destructive transition-colors">
              <X size={16} />
            </button>
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
        <Input
          placeholder="Link Title"
          value={link.title}
          onChange={(e) => onUpdate(index, { title: e.target.value.slice(0, 60) })}
          maxLength={60}
        />
        <Input
          placeholder="https://example.com"
          value={link.url}
          onChange={(e) => handleUrlChange(e.target.value)}
          type="url"
        />
        <div className="flex gap-2 items-center">
          <Label className="text-xs shrink-0">Icon</Label>
          <Select value={link.icon} onValueChange={(icon) => onUpdate(index, { icon })}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PLATFORM_ICONS.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  <span className="flex items-center gap-2">
                    <PlatformIcon platform={p.value} size={14} />
                    {p.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
    onChange([
      ...links,
      { title: '', url: '', icon: 'link', enabled: true, order: links.length },
    ]);
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
          {links.map((link, index) => (
            <SortableLinkCard
              key={`link-${index}`}
              link={link}
              index={index}
              onUpdate={updateLink}
              onRemove={removeLink}
            />
          ))}
        </SortableContext>
      </DndContext>

      <Button onClick={addLink} variant="outline" className="w-full" disabled={links.length >= 20}>
        <Plus size={16} className="mr-2" />
        Add Link {links.length > 0 && `(${links.length}/20)`}
      </Button>
    </div>
  );
}
