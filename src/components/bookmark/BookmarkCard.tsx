'use client';

import { Bookmark } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, Star, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Image from 'next/image';

interface BookmarkCardProps {
  bookmark: Bookmark;
  onEdit?: (bookmark: Bookmark) => void;
  onDelete?: (bookmark: Bookmark) => void;
  onToggleFavorite?: (bookmark: Bookmark) => void;
}

export function BookmarkCard({ bookmark, onEdit, onDelete, onToggleFavorite }: BookmarkCardProps) {
  const [showMemo, setShowMemo] = useState(false);

  const timeAgo = formatDistanceToNow(new Date(bookmark.updated_at), {
    addSuffix: true,
  });

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between space-y-0">
        <div className="flex-1 min-w-0">
          {bookmark.favicon_url && (
            <div className="relative w-5 h-5">
              <Image
                src={bookmark.favicon_url}
                alt=""
                fill
                className="rounded-sm"
                onError={(e) => {
                  // Hide the image on error
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
          <h3 className="font-semibold text-lg truncate">{bookmark.title}</h3>
        </div>
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground truncate block hover:text-primary hover:underline mt-1"
        >
          {bookmark.url}
        </a>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => onToggleFavorite?.(bookmark)}>
                <Star
                  className={`h-4 w-4 ${
                    bookmark.is_favorite ? 'fill-amber-500 text-amber-500' : ''
                  }`}
                />
                <span className="sr-only">{bookmark.is_favorite ? 'Unfavorite' : 'Favorite'}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {bookmark.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {bookmark.preview_image && (
          <div className="mb-4 rounded-md overflow-hidden relative h-32">
            <Image
              src={bookmark.preview_image}
              alt={bookmark.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        )}

        {bookmark.memo && (
          <div>
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-auto text-muted-foreground hover:text-foreground mb-2"
              onClick={() => setShowMemo(!showMemo)}
            >
              {showMemo ? 'Hide memo' : 'Show memo'}
            </Button>
            {showMemo && <div className="text-sm rounded-md bg-muted p-3">{bookmark.memo}</div>}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-4">
          {bookmark.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between px-4 py-3 border-t text-xs text-muted-foreground">
        <span>Updated {timeAgo}</span>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => onEdit?.(bookmark)}>
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit bookmark</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => onDelete?.(bookmark)}>
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete bookmark</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" asChild>
                  <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    <span className="sr-only">Open link</span>
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Open link</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardFooter>
    </Card>
  );
}
