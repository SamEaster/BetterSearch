import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Eye, Calendar, ChevronDown, ChevronUp, Brain, ExternalLink, Zap } from 'lucide-react';
import { useVideoDetails } from '../hooks/useVideoDetails';
import { YouTubePlayer } from '../components/video/YouTubePlayer';
import { formatDuration, formatViews, timeAgo, decodeHtmlEntities } from '../utils/format';
import styles from './WatchPage.module.css';

export const WatchPage: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const [descExpanded, setDescExpanded] = useState(false);

  const { data, isLoading, isError, error } = useVideoDetails(videoId);
  const video = data?.data;

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  if (!videoId) {
    return (
      <div className={styles.container}>
        <p>Invalid video identifier.</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.container}>
        <div className={styles.backBar}>
          <button type="button" onClick={handleBack} className={styles.backBtn} id="watch-back-btn">
            <ArrowLeft size={16} />
            <span>Back to Discovery</span>
          </button>
        </div>
        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <h2>Failed to load video details</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            {(error as any)?.message || 'Video not found or YouTube API quota exceeded.'}
          </p>
        </div>
      </div>
    );
  }

  const cleanTitle = video
    ? decodeHtmlEntities(video.title)
    : isLoading
    ? 'Loading Video Details...'
    : 'YouTube Video';
  const cleanChannel = video ? decodeHtmlEntities(video.channel) : '';
  const initial = cleanChannel ? cleanChannel.charAt(0).toUpperCase() : 'V';

  return (
    <div className={styles.container}>
      <div className={styles.backBar}>
        <button type="button" onClick={handleBack} className={styles.backBtn} id="watch-back-btn">
          <ArrowLeft size={16} />
          <span>Back to Discovery</span>
        </button>
      </div>

      <div className={styles.watchLayout}>
        {/* Main Left Column: Player & Metadata */}
        <div className={styles.mainColumn}>
          <YouTubePlayer videoId={videoId} title={cleanTitle} autoPlay={true} />

          <div className={styles.videoHeader}>
            <h1 className={styles.videoTitle}>{cleanTitle}</h1>

            <div className={styles.metaRow}>
              <div className={styles.channelInfo}>
                <div className={styles.channelAvatar}>{initial}</div>
                <div>
                  <h3 className={styles.channelName}>{cleanChannel}</h3>
                  <span className={styles.verifiedBadge}>Structured Knowledge</span>
                </div>
              </div>

              {video && (
                <div className={styles.statsRow}>
                  <div className={styles.statItem} title="Total Views">
                    <Eye size={16} />
                    <span>{formatViews(video.view_count)}</span>
                  </div>

                  <div className={styles.statItem} title="Duration">
                    <Clock size={16} />
                    <span>{formatDuration(video.duration_sec)}</span>
                  </div>

                  <div className={styles.statItem} title="Published Date">
                    <Calendar size={16} />
                    <span>{timeAgo(video.published_at)}</span>
                  </div>

                  {data?.meta?.fromCache && (
                    <div className={styles.statItem} style={{ color: 'var(--accent-emerald)' }} title="Fast Cache">
                      <Zap size={14} />
                      <span>Cached</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Description Section */}
          {video && video.description && (
            <div className={styles.descCard}>
              <div className={styles.descHeader}>
                <span>Video Description</span>
                <span>Published on {new Date(video.published_at).toLocaleDateString()}</span>
              </div>

              <div
                className={`${styles.descContent} ${
                  !descExpanded ? styles.descCollapsed : ''
                }`}
              >
                {video.description}
              </div>

              <button
                type="button"
                className={styles.toggleDescBtn}
                onClick={() => setDescExpanded(!descExpanded)}
              >
                <span>{descExpanded ? 'Show less' : 'Show full description'}</span>
                {descExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
          )}
        </div>

        {/* Right Sidebar: Mindful Watch Guidelines */}
        <div className={styles.sideColumn}>
          <div className={styles.focusCard}>
            <h3 className={styles.focusTitle}>
              <Brain size={18} color="var(--accent-cyan)" />
              <span>Mindful Watch Mode</span>
            </h3>

            <ul className={styles.focusList}>
              <li className={styles.focusItem}>
                <span className={styles.bullet}>•</span>
                <span><strong>No Infinite Feed</strong>: We do not serve auto-play next videos or recommended rabbit holes.</span>
              </li>
              <li className={styles.focusItem}>
                <span className={styles.bullet}>•</span>
                <span><strong>Active Learning</strong>: Pause when needed and take key takeaways.</span>
              </li>
              <li className={styles.focusItem}>
                <span className={styles.bullet}>•</span>
                <span><strong>Privacy Shield</strong>: Rendered via YouTube NoCookie privacy-enhanced mode.</span>
              </li>
            </ul>
          </div>

          <a
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.externalLink}
          >
            <span>Open on YouTube directly</span>
            <ExternalLink size={15} />
          </a>
        </div>
      </div>
    </div>
  );
};
export default WatchPage;
