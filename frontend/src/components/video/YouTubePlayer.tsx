import React from 'react';
import styles from './YouTubePlayer.module.css';

interface YouTubePlayerProps {
  videoId: string;
  title?: string;
  autoPlay?: boolean;
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  videoId,
  title = 'BetterSearch Video Player',
  autoPlay = true,
}) => {
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=${
    autoPlay ? 1 : 0
  }&rel=0&modestbranding=1&color=white`;

  return (
    <div className={styles.playerContainer}>
      <iframe
        className={styles.iframe}
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="eager"
      />
    </div>
  );
};
