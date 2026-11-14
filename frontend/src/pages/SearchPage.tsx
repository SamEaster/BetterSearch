import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlertTriangle, SearchX, RefreshCw } from 'lucide-react';
import { useSearchVideos } from '../hooks/useSearchVideos';
import { FilterBar } from '../components/common/FilterBar';
import { VideoGrid } from '../components/video/VideoGrid';
import { VideoGridSkeleton } from '../components/common/Skeleton';
import type { DurationFilter, SortOption, SearchFilters } from '../types/video';
import styles from './SearchPage.module.css';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get('q') || '';
  const durationParam = (searchParams.get('duration') || 'all') as DurationFilter;
  const sortParam = (searchParams.get('sort') || 'relevance') as SortOption;
  const hideShortsParam = searchParams.get('hideShorts') !== 'false';

  const filters: SearchFilters = useMemo(() => {
    const f: SearchFilters = {
      q: query,
      sort: sortParam,
      hideShorts: hideShortsParam,
    };
    if (durationParam !== 'all') {
      f.duration = durationParam;
    }
    return f;
  }, [query, durationParam, sortParam, hideShortsParam]);

  const { data, isLoading, isError, error, refetch } = useSearchVideos(filters);

  // Filter update helper that updates URL params
  const updateFilters = (newParams: Partial<{ duration: DurationFilter; sort: SortOption; hideShorts: boolean }>) => {
    const next = new URLSearchParams(searchParams);
    if (newParams.duration !== undefined) {
      if (newParams.duration === 'all') next.delete('duration');
      else next.set('duration', newParams.duration);
    }
    if (newParams.sort !== undefined) {
      if (newParams.sort === 'relevance') next.delete('sort');
      else next.set('sort', newParams.sort);
    }
    if (newParams.hideShorts !== undefined) {
      if (newParams.hideShorts) next.delete('hideShorts'); // default is true
      else next.set('hideShorts', 'false');
    }
    setSearchParams(next);
  };

  const handleResetFilters = () => {
    const next = new URLSearchParams();
    if (query) next.set('q', query);
    setSearchParams(next);
  };

  const isQuotaExceeded = (error as any)?.code === 'QUOTA_EXCEEDED' || (error as any)?.status === 429;

  return (
    <div className={styles.container}>
      {query && (
        <div className={styles.resultsHeader}>
          {/* <div>
            <h1 className={styles.queryTitle}>
              Intentional Search: <span className={styles.queryHighlight}>"{query}"</span>
            </h1>
          </div> */}

          {/* <div >
            {data?.data && (
              <span >
                {data.data.length} curated result{data.data.length === 1 ? '' : 's'}
              </span>
            )}
          </div> */}
        </div>
      )}

      {/* Filter Toolbar */}
      <FilterBar
        duration={durationParam}
        sort={sortParam}
        hideShorts={hideShortsParam}
        onDurationChange={(d) => updateFilters({ duration: d })}
        onSortChange={(s) => updateFilters({ sort: s })}
        onHideShortsChange={(h) => updateFilters({ hideShorts: h })}
        onResetFilters={handleResetFilters}
      />

      {/* Loading Skeletons */}
      {isLoading && (
        <div className={styles.skeletonList}>
          <VideoGridSkeleton count={6} />
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className={styles.errorBox}>
          <div className={styles.errorIcon}>
            <AlertTriangle size={26} />
          </div>
          <h2 className={styles.errorTitle}>
            {isQuotaExceeded ? 'YouTube Daily Quota Limit Reached' : 'Unable to Retrieve Videos'}
          </h2>
          <p className={styles.errorDesc}>
            {isQuotaExceeded
              ? 'The YouTube API daily quota limit has been exceeded. If Redis cached results exist for this query, they will still load immediately. Please try a cached query or check back tomorrow.'
              : (error as any)?.message || 'An unexpected error occurred while communicating with the backend.'}
          </p>
          <button type="button" onClick={() => refetch()} className={styles.retryBtn}>
            <RefreshCw size={16} />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && data?.data && data.data.length === 0 && (
        <div className={styles.emptyBox}>
          <div className={styles.emptyIcon}>
            <SearchX size={28} />
          </div>
          <h2 className={styles.emptyTitle}>No Matching Videos Found</h2>
          <p className={styles.emptyDesc}>
            No videos matched your criteria for "{query}". Try loosening your duration filter or searching with alternative keywords.
          </p>
          <button type="button" onClick={handleResetFilters} className={styles.retryBtn}>
            <span>Reset All Filters</span>
          </button>
        </div>
      )}

      {/* Results Video Grid */}
      {!isLoading && !isError && data?.data && data.data.length > 0 && (
        <VideoGrid videos={data.data} />
      )}
    </div>
  );
};
export default SearchPage;
