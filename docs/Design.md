# Bookmark Manager - Design Document

## 🎨 Design Philosophy

The Bookmark Manager will embrace a minimalist yet luxurious aesthetic with an emphasis on:
- **Elegance**: Clean lines, ample white space, and thoughtful typography
- **Usability**: Intuitive interfaces with smooth interactions
- **Performance**: Fast loading times and responsive interactions
- **Accessibility**: Fully accessible design compliant with WCAG standards

## 🎭 Brand Identity

### Color Palette
- **Primary**: Deep indigo (#4F46E5) - Conveys trust and professionalism
- **Secondary**: Soft teal (#0EA5E9) - Adds a refreshing accent
- **Neutrals**: Slate grays (#F8FAFC to #1E293B) - Provides hierarchical structure
- **Accent**: Amber (#F59E0B) - For call-to-actions and important highlights
- **Success**: Emerald (#10B981) - For positive feedback
- **Error**: Rose (#F43F5E) - For errors and warnings

### Typography
- **Headings**: Inter (Sans-serif) - Clean, modern, highly legible
- **Body**: Inter (Sans-serif) - Consistent with headings for clean design
- **Monospace**: JetBrains Mono - For URL display and technical elements

## 📱 UI Components (using Shadcn UI)

### Layout Components
- **Header**: Navigation, search, user profile
- **Sidebar**: Tag filtering, collections navigation
- **Main Content Area**: Bookmark cards/list
- **Footer**: Links, information

### Core Components
1. **Bookmark Card**
   - Title with truncation for long text
   - URL display with favicon
   - Tag chips
   - Action buttons (edit, delete)
   - Memo preview (collapsed by default)
   - Visual indication of last visited/added date

2. **Add/Edit Bookmark Modal**
   - URL input with validation
   - Title input (auto-filled from OGP when possible)
   - Memo text area with markdown support
   - Tag input with autocomplete
   - Save/Cancel buttons

3. **Tag Component**
   - Visually appealing chips
   - Color coding option based on tag category
   - Click to filter functionality

4. **Search Component**
   - Real-time filtering as user types
   - Search by title, URL, content, or tags
   - Clear button

5. **Authentication Forms**
   - Clean sign up/login forms
   - Social authentication options
   - Password reset functionality

## 📋 Page Designs

### 1. Landing Page (for non-authenticated users)
- Hero section with product screenshots
- Key features highlight
- Call-to-action buttons for sign-up/login
- Footer with links

### 2. Dashboard (for authenticated users)
- Grid/List view toggle for bookmarks
- Sort options (recently added, alphabetical, etc.)
- Quick add bookmark button (fixed position)
- Tag filter sidebar (collapsible on mobile)

### 3. User Settings
- Profile information
- Theme preferences
- Export/Import bookmarks
- Account management

## 📐 Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Mobile Adaptations
- Sidebar collapses to bottom navigation or hamburger menu
- Bookmark cards stack vertically, full width
- Simplified header with essential actions
- Bottom sheet for add/edit forms

## 🖥️ Technical Design

### Component Structure
```
components/
  ├── layout/
  │   ├── Header.tsx
  │   ├── Sidebar.tsx
  │   ├── Footer.tsx
  │   └── Layout.tsx
  ├── bookmark/
  │   ├── BookmarkCard.tsx
  │   ├── BookmarkList.tsx
  │   ├── BookmarkGrid.tsx
  │   ├── BookmarkForm.tsx
  │   └── BookmarkActions.tsx
  ├── tag/
  │   ├── TagChip.tsx
  │   ├── TagSelector.tsx
  │   └── TagFilter.tsx
  ├── search/
  │   └── SearchBar.tsx
  └── auth/
      ├── LoginForm.tsx
      └── SignUpForm.tsx
```

### State Management
- React Context for global state (user, theme preferences)
- TanStack Query for data fetching and caching
- Form state managed with React Hook Form

### API Design
- RESTful endpoints for bookmark CRUD operations
- Real-time updates using Supabase subscriptions
- Authentication handled by Supabase Auth

## 📋 Data Models

### Extended Bookmark Model
```typescript
interface Bookmark {
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
}
```

### User Preferences Model
```typescript
interface UserPreferences {
  id: string;
  user_id: string;
  theme: 'light' | 'dark' | 'system';
  view_mode: 'grid' | 'list';
  default_sort: 'recent' | 'alphabetical' | 'last_visited';
  tags_expanded: boolean;
}
```

## 🚀 Implementation Plan

### Phase 1: Foundation
1. Project setup with Next.js App Router
2. Supabase configuration
3. Authentication implementation
4. Basic layout structure

### Phase 2: Core Functionality
1. Bookmark CRUD operations
2. Tag system implementation
3. Search and filtering

### Phase 3: UI Enhancement
1. Responsive design refinement
2. Animations and transitions
3. Dark/light mode implementation

### Phase 4: Advanced Features
1. OGP scraping for link previews
2. Keyboard shortcuts
3. Export/import functionality
4. Browser extension (if time permits)

## 📏 Design System Integration

Shadcn UI will be used as the foundation for our component library, customized to match our color palette and design philosophy. This ensures consistency across the application while allowing for rapid development.

## 🎬 Interactions & Animations

- Subtle transitions between states (hover, active, focus)
- Loading skeletons for data fetching
- Smooth pagination/infinite scrolling for bookmark lists
- Micro-interactions for user feedback (success animations, etc.)

## 📱 Progressive Enhancement

- Offline support with service workers
- Web app manifest for installable PWA
- Optimistic updates for faster perceived performance

This design document will guide the development of the Bookmark Manager, ensuring a cohesive, elegant, and functional final product.