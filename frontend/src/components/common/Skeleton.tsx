import React from 'react';
import styles from './Skeleton.module.css';

export const VideoCardSkeleton: React.FC = () => {
  return (
    <div className={styles.skeletonCard}>
      <div className={`${styles.thumbSkeleton} shimmer`} />
      <div className={styles.metaSkeleton}>
        <div className={`${styles.lineTitle} shimmer`} />
        <div className={styles.channelSkeletonRow}>
          <div className={`${styles.avatarSkeleton} shimmer`} />
          <div className={`${styles.lineSubtitle} shimmer`} />
        </div>
        <div className={`${styles.lineMeta} shimmer`} />
      </div>
    </div>
  );
};

export const VideoGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <VideoCardSkeleton key={idx} />
      ))}
    </>
  );
};
