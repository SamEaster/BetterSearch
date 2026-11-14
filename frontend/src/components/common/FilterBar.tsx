import React from 'react';
import { Clock, ChevronDown, RotateCcw } from 'lucide-react';
import type { DurationFilter, SortOption } from '../../types/video';
import styles from './FilterBar.module.css';

interface FilterBarProps {
  duration: DurationFilter;
  sort: SortOption;
  hideShorts: boolean;
  onDurationChange: (duration: DurationFilter) => void;
  onSortChange: (sort: SortOption) => void;
  onHideShortsChange: (hideShorts: boolean) => void;
  onResetFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  duration,
  sort,
  hideShorts,
  onDurationChange,
  onSortChange,
  onHideShortsChange,
  onResetFilters,
}) => {
  const durationOptions: { label: string; value: DurationFilter }[] = [
    { label: 'All Lengths', value: 'all' },
    { label: 'Short (<4m)', value: 'short' },
    { label: 'Medium (4-20m)', value: 'medium' },
    { label: 'Deep Dive (>20m)', value: 'long' },
  ];

  const hasActiveCustomFilters =
    duration !== 'all' || sort !== 'relevance' || !hideShorts;

  return (
    <div className={styles.container}>
      <div className={styles.leftGroup}>
        <span className={styles.filterLabel}>
          <Clock size={16} />
          <span>Duration:</span>
        </span>
        <div className={styles.pillsGroup}>
          {durationOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`${styles.pillButton} ${
                duration === opt.value ? styles.pillActive : ''
              }`}
              onClick={() => onDurationChange(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.rightGroup}>
        {/* Hide Shorts Switch */}
        <label className={styles.toggleWrapper} title="Exclude fast shorts under 3 minutes">
          <input
            type="checkbox"
            className={styles.toggleInput}
            checked={hideShorts}
            onChange={(e) => onHideShortsChange(e.target.checked)}
          />
          <div
            className={`${styles.toggleTrack} ${
              hideShorts ? styles.toggleTrackActive : ''
            }`}
          >
            <div
              className={`${styles.toggleThumb} ${
                hideShorts ? styles.toggleThumbActive : ''
              }`}
            />
          </div>
          <span className={styles.toggleText}>Hide Shorts</span>
        </label>

        {/* Sort Select */}
        <div className={styles.selectWrapper}>
          <select
            className={styles.select}
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            aria-label="Sort videos by"
          >
            <option value="relevance">Sort: Relevance</option>
            <option value="date">Sort: Upload Date</option>
            <option value="viewCount">Sort: Most Viewed</option>
            <option value="rating">Sort: Top Rated</option>
          </select>
          <ChevronDown size={14} className={styles.selectIcon} />
        </div>

        {/* Reset filter button if any custom filters applied */}
        {hasActiveCustomFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className={styles.resetBtn}
            title="Reset filters to default"
          >
            <RotateCcw size={14} />
          </button>
        )}
      </div>
    </div>
  );
};
