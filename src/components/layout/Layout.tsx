'use client';

import { ReactNode, useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useAuth } from '../providers/auth-provider';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user } = useAuth();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // This would typically come from a database query
  const mockTags = [
    { name: 'work', count: 5 },
    { name: 'personal', count: 3 },
    { name: 'tutorial', count: 8 },
    { name: 'reference', count: 12 },
  ];

  const handleTagSelect = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {user && (
          <Sidebar tags={mockTags} onTagSelect={handleTagSelect} selectedTags={selectedTags} />
        )}
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
