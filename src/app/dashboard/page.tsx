'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Layout } from '@/components/layout/Layout';
import { BookmarkList } from '@/components/bookmark/BookmarkList';
import { BookmarkForm } from '@/components/bookmark/BookmarkForm';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Bookmark, supabase } from '@/lib/supabase';
import { useAuth } from '@/components/providers/auth-provider';
import { redirect } from 'next/navigation';

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  const queryClient = useQueryClient();

  // Redirect if not authenticated
  if (!authLoading && !user) {
    redirect('/login');
  }

  // Fetch bookmarks
  const { data: bookmarks = [], isLoading } = useQuery({
    queryKey: ['bookmarks', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase.from('bookmarks').select('*').eq('user_id', user.id);

      if (error) throw error;
      return data as Bookmark[];
    },
    enabled: !!user,
  });

  // Add bookmark mutation
  const addBookmarkMutation = useMutation({
    mutationFn: async (bookmark: Partial<Bookmark>) => {
      if (!user) throw new Error('User not authenticated');

      const newBookmark = {
        ...bookmark,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_favorite: false,
      };

      const { data, error } = await supabase.from('bookmarks').insert([newBookmark]).select();

      if (error) throw error;
      return data[0] as Bookmark;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks', user?.id] });
    },
  });

  // Update bookmark mutation
  const updateBookmarkMutation = useMutation({
    mutationFn: async (bookmark: Partial<Bookmark>) => {
      if (!bookmark.id) throw new Error('Bookmark ID is required');

      const { data, error } = await supabase
        .from('bookmarks')
        .update({
          ...bookmark,
          updated_at: new Date().toISOString(),
        })
        .eq('id', bookmark.id)
        .select();

      if (error) throw error;
      return data[0] as Bookmark;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks', user?.id] });
    },
  });

  // Delete bookmark mutation
  const deleteBookmarkMutation = useMutation({
    mutationFn: async (bookmarkId: string) => {
      const { error } = await supabase.from('bookmarks').delete().eq('id', bookmarkId);

      if (error) throw error;
      return bookmarkId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks', user?.id] });
    },
  });

  // Toggle favorite mutation
  const toggleFavoriteMutation = useMutation({
    mutationFn: async (bookmark: Bookmark) => {
      const { data, error } = await supabase
        .from('bookmarks')
        .update({
          is_favorite: !bookmark.is_favorite,
          updated_at: new Date().toISOString(),
        })
        .eq('id', bookmark.id)
        .select();

      if (error) throw error;
      return data[0] as Bookmark;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks', user?.id] });
    },
  });

  const handleSubmit = (bookmark: Partial<Bookmark>) => {
    if (editingBookmark) {
      updateBookmarkMutation.mutate({ ...bookmark, id: editingBookmark.id });
    } else {
      addBookmarkMutation.mutate(bookmark);
    }
    setIsFormOpen(false);
    setEditingBookmark(undefined);
  };

  const handleEdit = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark);
    setIsFormOpen(true);
  };

  const handleDelete = (bookmark: Bookmark) => {
    if (confirm('Are you sure you want to delete this bookmark?')) {
      deleteBookmarkMutation.mutate(bookmark.id);
    }
  };

  const handleToggleFavorite = (bookmark: Bookmark) => {
    toggleFavoriteMutation.mutate(bookmark);
  };

  const filteredBookmarks = bookmarks.filter((bookmark) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    return (
      bookmark.title.toLowerCase().includes(query) ||
      bookmark.url.toLowerCase().includes(query) ||
      (bookmark.memo && bookmark.memo.toLowerCase().includes(query)) ||
      bookmark.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  if (authLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">My Bookmarks</h1>
          <div className="flex gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bookmarks..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Bookmark
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-pulse">Loading bookmarks...</div>
          </div>
        ) : (
          <BookmarkList
            bookmarks={filteredBookmarks}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        <BookmarkForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingBookmark(undefined);
          }}
          onSubmit={handleSubmit}
          bookmark={editingBookmark}
        />
      </div>
    </Layout>
  );
}
