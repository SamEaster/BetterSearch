import { apiClient } from './client';
import type { SearchFilters, SearchResponse } from '../types/video';

export async function fetchSearchResults(filters: SearchFilters): Promise<SearchResponse> {
  const params: Record<string, string | boolean> = {
    q: filters.q,
  };

  if (filters.duration) {
    params.duration = filters.duration;
  }
  if (filters.sort) {
    params.sort = filters.sort;
  }
  if (filters.categoryId) {
    params.categoryId = filters.categoryId;
  }
  if (typeof filters.hideShorts === 'boolean') {
    params.hideShorts = filters.hideShorts;
  }
  if (filters.publishedAfter) {
    params.publishedAfter = filters.publishedAfter;
  }

  const response = await apiClient.get<SearchResponse>('/api/v1/search', { params });
  return response.data;
}
