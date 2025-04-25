'use client';

import { Bookmark } from '@/lib/supabase';
import { BookmarkCard } from './BookmarkCard';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Grid3X3, List } from 'lucide-react';

interface BookmarkListProps {
  bookmarks: Bookmark[];
  onEdit?: (bookmark: Bookmark) => void;
  onDelete?: (bookmark: Bookmark) => void;
  onToggleFavorite?: (bookmark: Bookmark) => void;
}

export function BookmarkList({ bookmarks, onEdit, onDelete, onToggleFavorite }: BookmarkListProps) {
  const [view, setView] = useState<'grid' | 'list'>('grid');

  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-2xl font-semibold mb-2">No bookmarks found</h3>
        <p className="text-muted-foreground mb-6">
          Your bookmarks will appear here once you add them
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <div className="flex items-center border rounded-md overflow-hidden">
          <Button
            variant={view === 'grid' ? 'default' : 'ghost'}
            size="sm"
            className="rounded-none"
            onClick={() => setView('grid')}
          >
            <Grid3X3 className="h-4 w-4 mr-2" />
            Grid
          </Button>
          <Button
            variant={view === 'list' ? 'default' : 'ghost'}
            size="sm"
            className="rounded-none"
            onClick={() => setView('list')}
          >
            <List className="h-4 w-4 mr-2" />
            List
          </Button>
        </div>
      </div>

      <div
        className={`grid gap-6 ${
          view === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
        }`}
      >
        {bookmarks.map((bookmark) => (
          <BookmarkCard
            key={bookmark.id}
            bookmark={bookmark}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
}
