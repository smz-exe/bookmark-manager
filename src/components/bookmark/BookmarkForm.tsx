'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import { Bookmark } from '@/lib/supabase';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { fetchUrlMetadata } from '@/lib/urlMetadata';

const formSchema = z.object({
  url: z
    .string()
    .url({ message: 'Please enter a valid URL' })
    .min(1, { message: 'URL is required' }),
  title: z.string().min(1, { message: 'Title is required' }),
  memo: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface BookmarkFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bookmark: Partial<Bookmark>) => void;
  bookmark?: Bookmark;
}

export function BookmarkForm({ isOpen, onClose, onSubmit, bookmark }: BookmarkFormProps) {
  const [tags, setTags] = useState<string[]>(bookmark?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);
  const [faviconUrl, setFaviconUrl] = useState<string | undefined>(bookmark?.favicon_url);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: bookmark?.url || '',
      title: bookmark?.title || '',
      memo: bookmark?.memo || '',
    },
  });

  const url = watch('url');

  // Fetch metadata when URL changes
  useEffect(() => {
    const fetchMetadata = async () => {
      if (!url || url === bookmark?.url) return;

      try {
        setIsFetchingMetadata(true);
        const metadata = await fetchUrlMetadata(url);

        // Only set title if it's empty or matches the URL
        const currentTitle = watch('title');
        if (!currentTitle || currentTitle === bookmark?.title || currentTitle === url) {
          setValue('title', metadata.title || '');
        }

        setFaviconUrl(metadata.faviconUrl);
      } catch (error) {
        console.error('Error fetching metadata:', error);
      } finally {
        setIsFetchingMetadata(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      if (url && url.startsWith('http')) {
        fetchMetadata();
      }
    }, 800);

    return () => clearTimeout(debounceTimer);
  }, [url, setValue, watch, bookmark?.url, bookmark?.title]);

  const handleFormSubmit = (data: FormData) => {
    onSubmit({
      ...data,
      tags,
      favicon_url: faviconUrl,
    });
    reset();
    setTags([]);
    setFaviconUrl(undefined);
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim().toLowerCase())) {
      setTags([...tags, tagInput.trim().toLowerCase()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{bookmark ? 'Edit Bookmark' : 'Add Bookmark'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="url">URL</Label>
              <Input id="url" placeholder="https://example.com" {...register('url')} />
              {errors.url && <p className="text-destructive text-sm mt-1">{errors.url.message}</p>}
            </div>

            <div>
              <Label htmlFor="title" className="flex items-center gap-2">
                Title
                {isFetchingMetadata && <Loader2 className="h-3 w-3 animate-spin" />}
              </Label>
              <Input id="title" placeholder="Bookmark title" {...register('title')} />
              {errors.title && (
                <p className="text-destructive text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="memo">Memo (optional)</Label>
              <Textarea
                id="memo"
                placeholder="Add notes about this bookmark"
                className="resize-y"
                rows={3}
                {...register('memo')}
              />
              {errors.memo && (
                <p className="text-destructive text-sm mt-1">{errors.memo.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="tags">Tags</Label>
              <div className="flex mb-2">
                <Input
                  id="tags"
                  placeholder="Add tags and press Enter"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  className="flex-1"
                />
                <Button type="button" onClick={addTag} disabled={!tagInput.trim()} className="ml-2">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="pl-2">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-destructive focus:outline-none"
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {tag}</span>
                    </button>
                  </Badge>
                ))}
                {tags.length === 0 && (
                  <div className="text-sm text-muted-foreground">No tags added yet</div>
                )}
              </div>
            </div>

            {faviconUrl && (
              <div>
                <div className="mt-1 p-2 border rounded-md flex items-center gap-2">
                  <Image
                    src={faviconUrl}
                    alt="Favicon"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                    onError={() => {
                      setFaviconUrl(undefined);
                    }}
                  />
                  <span className="text-sm text-muted-foreground">Favicon detected</span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setTags([]);
                setFaviconUrl(undefined);
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {bookmark ? 'Update' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
