import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState('dark');

  // The CSS in styles.css picks its colours from the data-theme attribute on <html>.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  return (
    <button type="button" className="theme-toggle" onClick={() => setTheme(nextTheme)}>
      Switch to {nextTheme} mode
    </button>
  );
}
