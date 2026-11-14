import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Video, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import styles from './Header.module.css';

interface HeaderProps {
  children?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.brand} title="BetterSearch">
        <div className={styles.logoIcon}>
          <Video size={20} strokeWidth={2.4} />
        </div>
        <span className={styles.brandTitle}>
          Better<span className={styles.brandHighlight}>Search</span>
        </span>
      </Link>

      <div className={styles.centerSlot}>
        {!isHomePage && children}
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          onClick={toggleTheme}
          className={styles.themeToggle}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
};
