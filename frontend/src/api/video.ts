import { apiClient } from './client';
import type { VideoResponse } from '../types/video';

export async function fetchVideoById(videoId: string): Promise<VideoResponse> {
  const response = await apiClient.get<VideoResponse>(`/api/v1/videos/${videoId}`);
  return response.data;
}
