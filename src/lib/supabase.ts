import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database schema
export type Bookmark = {
  id: string;
  user_id: string;
  title: string;
  url: string;
  memo?: string;
  tags: string[];
  favicon_url?: string;
  preview_image?: string;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
  last_visited?: string;
};

export type UserPreferences = {
  id: string;
  user_id: string;
  theme: 'light' | 'dark' | 'system';
  view_mode: 'grid' | 'list';
  default_sort: 'recent' | 'alphabetical' | 'last_visited';
  tags_expanded: boolean;
};
