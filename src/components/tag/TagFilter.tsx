'use client';

import { TagChip } from './TagChip';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface Tag {
  name: string;
  count: number;
}

interface TagFilterProps {
  tags: Tag[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  className?: string;
}

export function TagFilter({ tags, selectedTags, onTagSelect, className }: TagFilterProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div>
        <Label className="text-sm font-medium">Filter by Tags</Label>
        <div className="mt-2">
          {tags.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tags found</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <TagChip
                  key={tag.name}
                  tag={tag.name}
                  count={tag.count}
                  onClick={() => onTagSelect(tag.name)}
                  isSelected={selectedTags.includes(tag.name)}
                  showCount={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedTags.length > 0 && (
        <div className="pt-2">
          <button
            onClick={() => selectedTags.forEach(onTagSelect)}
            className="text-xs text-primary hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
