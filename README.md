# Bookmark Manager

A modern, elegant bookmark management application built with Next.js, Supabase, and Shadcn UI.

![Bookmark Manager](https://via.placeholder.com/1200x600?text=Bookmark+Manager)

## Features

- ✨ Clean, luxurious UI with dark and light mode
- 📚 Save, organize, and filter your bookmarks
- 🔍 Advanced search capabilities
- 🔒 Secure user authentication
- 🏷️ Tag-based organization
- 📝 Add notes to your bookmarks
- 📱 Fully responsive design for all devices

## Tech Stack

- **Frontend**: Next.js 15 (App Router) with TypeScript
- **Backend**: Supabase (Database, Auth)
- **Styling**: Tailwind CSS with Shadcn UI components
- **State Management**: TanStack Query + React Context
- **Form Handling**: React Hook Form + Zod

## Getting Started

### Prerequisites

- Node.js 18+ or higher
- PNPM package manager
- Supabase account

### Setting Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Execute the SQL script in `/supabase/schema.sql` in your Supabase SQL editor
3. In your project settings, get your API keys

### Local Development

1. Clone the repository
```bash
git clone https://github.com/yourusername/bookmark-manager.git
cd bookmark-manager
```

2. Install dependencies
```bash
pnpm install
```

3. Create an `.env.local` file at the root of your project with the following:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Start the development server
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) to see the app

## Deployment

The app can be easily deployed to Vercel:

1. Push your repository to GitHub
2. Import the project in Vercel
3. Add the environment variables
4. Deploy!

## Project Structure

```
bookmark-manager/
├── docs/                # Documentation
├── public/              # Static assets
├── src/
│   ├── app/            # App Router pages
│   ├── components/      # React components
│   │   ├── bookmark/   # Bookmark-related components
│   │   ├── layout/     # Layout components
│   │   ├── providers/  # Context providers
│   │   └── ui/         # UI components (Shadcn)
│   └── lib/            # Utilities and helpers
└── supabase/           # Supabase configuration
```

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Created with ❤️ as an example of a modern web application with Next.js and Supabase.
