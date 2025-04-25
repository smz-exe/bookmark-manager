'use client';

import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TagChipProps {
  tag: string;
  count?: number;
  onRemove?: () => void;
  onClick?: () => void;
  isSelected?: boolean;
  className?: string;
  showCount?: boolean;
}

export function TagChip({
  tag,
  count,
  onRemove,
  onClick,
  isSelected = false,
  className,
  showCount = false,
}: TagChipProps) {
  return (
    <Badge
      variant={isSelected ? 'default' : 'outline'}
      className={cn(
        'mr-2 mb-2 transition-all',
        onClick ? 'cursor-pointer hover:bg-primary/10' : '',
        className,
      )}
      onClick={onClick}
    >
      {tag}
      {showCount && count !== undefined && (
        <span className="ml-1 text-xs opacity-60">({count})</span>
      )}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 hover:text-destructive focus:outline-none"
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Remove {tag}</span>
        </button>
      )}
    </Badge>
  );
}
