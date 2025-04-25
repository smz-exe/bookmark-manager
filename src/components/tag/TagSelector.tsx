'use client';

import { useState, KeyboardEvent } from 'react';
import { TagChip } from './TagChip';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  className?: string;
  placeholder?: string;
  suggestedTags?: string[];
}

export function TagSelector({
  selectedTags = [],
  onTagsChange,
  className,
  placeholder = 'Add tags...',
  suggestedTags = [],
}: TagSelectorProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = suggestedTags.filter(
    (tag) => !selectedTags.includes(tag) && tag.toLowerCase().includes(inputValue.toLowerCase()),
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const newTag = inputValue.trim();

      if (!selectedTags.includes(newTag)) {
        onTagsChange([...selectedTags, newTag]);
      }

      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && selectedTags.length > 0) {
      onTagsChange(selectedTags.slice(0, -1));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const handleAddSuggestion = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      onTagsChange([...selectedTags, tag]);
    }
    setInputValue('');
    setShowSuggestions(false);
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map((tag) => (
          <TagChip key={tag} tag={tag} onRemove={() => handleRemoveTag(tag)} />
        ))}
      </div>

      <div className="relative">
        <Input
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={selectedTags.length > 0 ? 'Add another tag...' : placeholder}
          className="w-full"
        />

        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-card border rounded-md shadow-md max-h-48 overflow-auto">
            {filteredSuggestions.map((tag) => (
              <div
                key={tag}
                className="px-3 py-2 cursor-pointer hover:bg-muted"
                onClick={() => handleAddSuggestion(tag)}
              >
                {tag}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
