import React, { useEffect, useRef, useState } from 'react';
import type { SortOption } from '../types';
import './SortMenu.scss';

interface SortMenuProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const sortOptions: { value: SortOption; label: string; icon: string }[] = [
  { value: 'newest', label: 'Newest First', icon: '🕐' },
  { value: 'mostLiked', label: 'Most Liked', icon: '👍' },
  { value: 'mostDisliked', label: 'Most Disliked', icon: '👎' },
];

const SortMenu: React.FC<SortMenuProps> = ({ currentSort, onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const currentOption = sortOptions.find((opt) => opt.value === currentSort);

  return (
    <div className="sort-menu" ref={menuRef}>
      <button className="sort-button" onClick={() => setIsOpen(!isOpen)}>
        <span className="sort-icon">{currentOption?.icon}</span>
        <span className="sort-label">Sort: {currentOption?.label}</span>
        <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="sort-dropdown">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              className={`sort-option ${currentSort === option.value ? 'active' : ''}`}
              onClick={() => {
                onSortChange(option.value);
                setIsOpen(false);
              }}
            >
              <span className="option-icon">{option.icon}</span>
              <span className="option-label">{option.label}</span>
              {currentSort === option.value && <span className="check-mark">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortMenu;
