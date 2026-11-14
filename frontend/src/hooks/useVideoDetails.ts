import { useQuery } from '@tanstack/react-query';
import { fetchVideoById } from '../api/video';
import type { VideoResponse } from '../types/video';

export function useVideoDetails(videoId: string | undefined) {
  return useQuery<VideoResponse, Error>({
    queryKey: ['video', videoId],
    queryFn: () => {
      if (!videoId) throw new Error('Video ID is required');
      return fetchVideoById(videoId);
    },
    enabled: Boolean(videoId),
    staleTime: 30 * 60 * 1000, // Video details are stable, 30 min cache
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      if (error?.status === 404 || error?.status === 429) return false;
      return failureCount < 2;
    },
  });
}
