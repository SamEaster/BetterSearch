import { useQuery } from '@tanstack/react-query';
import { fetchSearchResults } from '../api/search';
import type { SearchFilters, SearchResponse } from '../types/video';

export function useSearchVideos(filters: SearchFilters) {
  const isEnabled = Boolean(filters.q && filters.q.trim().length > 0);

  return useQuery<SearchResponse, Error>({
    queryKey: ['search', filters],
    queryFn: () => fetchSearchResults(filters),
    enabled: isEnabled,
    staleTime: 5 * 60 * 1000, // 5 minutes stale time
    gcTime: 15 * 60 * 1000, // Keep inactive cache for 15 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      // Do not retry 429 quota or 404 errors
      if (error?.status === 429 || error?.status === 404) return false;
      return failureCount < 2;
    },
  });
}
