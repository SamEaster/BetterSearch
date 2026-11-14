import React, { useState, useEffect } from 'react';
import type { Video } from '../../types/video';
import { VideoCard } from './VideoCard';
import { useIntersection } from '../../hooks/useIntersection';
import styles from './VideoGrid.module.css';

interface VideoGridProps {
  videos: Video[];
  chunkSize?: number;
}

export const VideoGrid: React.FC<VideoGridProps> = ({ videos, chunkSize = 9 }) => {
  const [visibleCount, setVisibleCount] = useState<number>(chunkSize);

  // Reset visible count if the video collection changes (e.g. new search query)
  useEffect(() => {
    setVisibleCount(chunkSize);
  }, [videos, chunkSize]);

  // Sentinel for infinite progressive chunking
  const { ref: sentinelRef, isIntersecting } = useIntersection<HTMLDivElement>({
    rootMargin: '350px',
    freezeOnceVisible: false,
  });

  useEffect(() => {
    if (isIntersecting && visibleCount < videos.length) {
      setVisibleCount((prev) => Math.min(prev + chunkSize, videos.length));
    }
  }, [isIntersecting, visibleCount, videos.length, chunkSize]);

  const visibleVideos = videos.slice(0, visibleCount);
  const hasMore = visibleCount < videos.length;

  return (
    <div className={styles.wrapper}>
      <div className={styles.list}>
        {visibleVideos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>

      {hasMore && (
        <div ref={sentinelRef} className={styles.sentinel}>
          <div className={styles.loadMoreIndicator}>
            <div className={styles.spinner} />
            <span>Revealing more mindful results...</span>
          </div>
        </div>
      )}

      {!hasMore && videos.length > 0 && (
        <div className={styles.endMessage}>
          <span>✓ You've seen all {videos.length} matched videos. </span>
        </div>
      )}
    </div>
  );
};
