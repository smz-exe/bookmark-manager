'use client';

import { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Layout } from '@/components/layout/Layout';
import { BookmarkList } from '@/components/bookmark/BookmarkList';
import { BookmarkForm } from '@/components/bookmark/BookmarkForm';
import { Button } from '@/components/ui/button';
import { Plus, Search, Star, Link2, Tag as TagIcon, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Bookmark, supabase } from '@/lib/supabase';
import { useAuth } from '@/components/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { StatCard } from '@/components/ui/stat-card';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const queryClient = useQueryClient();

  // Use useEffect for client-side navigation instead of server redirect
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

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

  // Stats calculations
  const stats = useMemo(() => {
    if (!bookmarks.length)
      return {
        total: 0,
        favorites: 0,
        tags: 0,
        recent: 0,
      };

    // Get unique tags from all bookmarks
    const uniqueTags = new Set<string>();
    bookmarks.forEach((bookmark) => {
      bookmark.tags.forEach((tag) => uniqueTags.add(tag));
    });

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return {
      total: bookmarks.length,
      favorites: bookmarks.filter((b) => b.is_favorite).length,
      tags: uniqueTags.size,
      recent: bookmarks.filter((b) => new Date(b.created_at) > oneWeekAgo).length,
    };
  }, [bookmarks]);

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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-2"
        >
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Manage your bookmarks and discover new content</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Bookmarks"
            value={stats.total}
            subtitle="All your saved links"
            icon={<Link2 className="h-4 w-4" />}
            colors={['#3B82F6', '#60A5FA', '#93C5FD']}
            delay={0.1}
          />
          <StatCard
            title="Favorite Links"
            value={stats.favorites}
            subtitle="Your starred content"
            icon={<Star className="h-4 w-4" />}
            colors={['#F59E0B', '#FBBF24', '#FCD34D']}
            delay={0.2}
          />
          <StatCard
            title="Unique Tags"
            value={stats.tags}
            subtitle="Categories you've created"
            icon={<TagIcon className="h-4 w-4" />}
            colors={['#10B981', '#34D399', '#6EE7B7']}
            delay={0.3}
          />
          <StatCard
            title="Recent Additions"
            value={stats.recent}
            subtitle="Added in the last 7 days"
            icon={<Clock className="h-4 w-4" />}
            colors={['#8B5CF6', '#A78BFA', '#C4B5FD']}
            delay={0.4}
          />
        </div>

        {/* Search and Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-4 rounded-lg border"
        >
          <div className="relative w-full sm:w-64 sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bookmarks..."
              className="pl-9 bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="w-full sm:w-auto" onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Bookmark
          </Button>
        </motion.div>

        {/* Bookmark List */}
        <div className="bg-card rounded-lg border p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-pulse">Loading bookmarks...</div>
            </div>
          ) : filteredBookmarks.length > 0 ? (
            <BookmarkList
              bookmarks={filteredBookmarks}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleFavorite={handleToggleFavorite}
            />
          ) : searchQuery ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground mb-2">No bookmarks match your search</p>
              <p className="text-sm text-muted-foreground">
                Try a different search term or clear the search
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground mb-2">You don&apos;t have any bookmarks yet</p>
              <Button variant="outline" onClick={() => setIsFormOpen(true)} className="mt-4">
                <Plus className="mr-2 h-4 w-4" /> Add your first bookmark
              </Button>
            </div>
          )}
        </div>

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
