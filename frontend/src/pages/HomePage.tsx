import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from '../components/common/SearchBar';
import styles from './HomePage.module.css';

const QUICK_TOPICS = [
  'Distributed Systems',
  'Machine Learning',
  'System Design',
  'Full Lectures',
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleTopicClick = (topic: string) => {
    navigate(`/search?q=${encodeURIComponent(topic)}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.brandCenter}>
      </div>

      <div className={styles.heroText}>
        <h1 className={styles.taglineTitle}>
          First think of a topic to learn, then search
        </h1>
      </div>

      <div className={styles.searchContainer}>
        <SearchBar
          variant="hero"
          autoFocus
          placeholder="Enter the topic you decided to learn today..."
        />
      </div>

      <div className={styles.quickPills}>
        {QUICK_TOPICS.map((topic) => (
          <button
            key={topic}
            type="button"
            className={styles.pill}
            onClick={() => handleTopicClick(topic)}
          >
            {topic}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
