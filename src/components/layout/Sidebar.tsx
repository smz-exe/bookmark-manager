'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  className?: string;
  tags?: { name: string; count: number }[];
  onTagSelect?: (tag: string) => void;
  selectedTags?: string[];
}

export function Sidebar({ className, tags = [], onTagSelect, selectedTags = [] }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={cn(
        'flex flex-col h-full border-r bg-background transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64',
        className,
      )}
    >
      <div className="flex items-center justify-between p-4">
        {!isCollapsed && <h2 className="font-semibold">Tags</h2>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          <span className="sr-only">{isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}</span>
        </Button>
      </div>
      <Separator />
      <div className="flex-1 overflow-auto p-4">
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-4">
            <Tag className="h-5 w-5" />
          </div>
        ) : (
          <div className="space-y-2">
            {tags.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tags yet</p>
            ) : (
              tags.map((tag) => (
                <Badge
                  key={tag.name}
                  variant={selectedTags.includes(tag.name) ? 'default' : 'outline'}
                  className="mr-2 mb-2 cursor-pointer text-sm"
                  onClick={() => onTagSelect?.(tag.name)}
                >
                  {tag.name}
                  <span className="ml-1 text-xs opacity-60">({tag.count})</span>
                </Badge>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
