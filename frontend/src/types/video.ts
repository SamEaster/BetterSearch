export interface Video {
  id: string;
  title: string;
  channel: string;
  description: string;
  thumbnail: string;
  duration_sec: number;
  view_count: number;
  published_at: string;
  like_count?: number | null;
  comment_count?: number | null;
}

export interface SearchMeta {
  fromCache: boolean;
  count: number;
}

export interface SearchResponse {
  meta: SearchMeta;
  data: Video[];
}

export interface VideoResponse {
  meta: {
    fromCache: boolean;
  };
  data: Video;
}

export type DurationFilter = 'all' | 'short' | 'medium' | 'long';
export type SortOption = 'relevance' | 'date' | 'viewCount' | 'rating';

export interface SearchFilters {
  q: string;
  duration?: 'short' | 'medium' | 'long';
  sort?: SortOption;
  categoryId?: string;
  hideShorts?: boolean;
  publishedAfter?: string;
}
