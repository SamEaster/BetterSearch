import React from 'react';
import { Eye, Calendar, ThumbsUp, MessageSquare, ExternalLink } from 'lucide-react';
import type { Video } from '../../types/video';
import {
  formatDuration,
  formatViews,
  timeAgo,
  decodeHtmlEntities,
  formatYear,
  formatCompact,
} from '../../utils/format';
import { useIntersection } from '../../hooks/useIntersection';
import { VideoCardSkeleton } from '../common/Skeleton';
import styles from './VideoCard.module.css';

interface VideoCardProps {
  video: Video;
  lazyLoad?: boolean;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, lazyLoad = true }) => {
  const { ref, isIntersecting } = useIntersection<HTMLDivElement>({
    rootMargin: '200px',
    freezeOnceVisible: true,
  });

  if (lazyLoad && !isIntersecting) {
    return (
      <div ref={ref} className={styles.lazyContainer}>
        <VideoCardSkeleton />
      </div>
    );
  }

  const cleanTitle = decodeHtmlEntities(video.title);
  const cleanChannel = decodeHtmlEntities(video.channel);
  const cleanDescription = decodeHtmlEntities(video.description);
  const initial = cleanChannel ? cleanChannel.charAt(0).toUpperCase() : 'Y';
  const publishedYear = formatYear(video.published_at);
  const relativeTime = timeAgo(video.published_at);
  const youtubeUrl = `https://www.youtube.com/watch?v=${video.id}`;

  return (
    <div ref={ref} className={styles.cardContainer}>
      <a
        href={youtubeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.card}
        id={`video-card-${video.id}`}
        title={`Watch "${cleanTitle}" on YouTube`}
      >
        {/* Left: Video Thumbnail */}
        <div className={styles.thumbWrapper}>
          <img
            src={video.thumbnail}
            alt={cleanTitle}
            className={styles.thumbnail}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;
            }}
          />
          {video.duration_sec > 0 && (
            <span className={styles.durationBadge}>
              {formatDuration(video.duration_sec)}
            </span>
          )}
          {/* <div className={styles.playOverlay}>
          <span className={styles.playButtonText}>
            <ExternalLink size={13} />
          </span>
        </div> */}
        </div>

        {/* Right: Metadata Details */}
        <div className={styles.details}>
          <div className={styles.titleRow}>
            <h3 className={styles.title} title={cleanTitle}>
              {cleanTitle}
            </h3>
            <span className={styles.externalHint} title="Opens in YouTube app / full screen">
              <ExternalLink size={16} />
            </span>
          </div>

          <div className={styles.channelRow}>
            <div className={styles.channelAvatar} title={cleanChannel}>
              {initial}
            </div>
            <span className={styles.channelTitle} title={cleanChannel}>
              {cleanChannel}
            </span>
          </div>

          {/* Stats & Meta Row: Views, Year Published, Likes, Comments */}
          <div className={styles.statsRow}>
            <div className={styles.statItem} title={formatViews(video.view_count)}>
              <Eye size={14} className={styles.statIcon} />
              <span>{formatViews(video.view_count)}</span>
            </div>

            {publishedYear && (
              <div
                className={styles.statItem}
                title={`Published in ${publishedYear}${relativeTime ? ` (${relativeTime})` : ''}`}
              >
                <Calendar size={14} className={styles.statIcon} />
                <span>{publishedYear}</span>
                {relativeTime && (
                  <span className={styles.subtleTime}>({relativeTime})</span>
                )}
              </div>
            )}

            {video.like_count !== null && video.like_count !== undefined && (
              <div
                className={styles.statItem}
                title={`${video.like_count.toLocaleString()} likes`}
              >
                <ThumbsUp size={13} className={styles.statIcon} />
                <span>{formatCompact(video.like_count)} likes</span>
              </div>
            )}

            {video.comment_count !== null && video.comment_count !== undefined && (
              <div
                className={styles.statItem}
                title={`${video.comment_count.toLocaleString()} comments`}
              >
                <MessageSquare size={13} className={styles.statIcon} />
                <span>{formatCompact(video.comment_count)} comments</span>
              </div>
            )}
          </div>

          {cleanDescription && (
            <p className={styles.descriptionSnippet}>
              {cleanDescription}
            </p>
          )}
        </div>
      </a>
    </div>
  );
};
