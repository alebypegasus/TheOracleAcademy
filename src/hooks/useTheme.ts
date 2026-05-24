import { useState, useEffect } from 'react';

export function useTheme(initialThemePreference = 'dark', initialColorTheme = 'oracle') {
  const [themePreference, setThemePreference] = useState(() => {
    return localStorage.getItem('oracle_theme_pref') || initialThemePreference;
  });
  
  const [colorTheme, setColorTheme] = useState(() => {
    return localStorage.getItem('oracle_color_theme') || initialColorTheme;
  });

  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    localStorage.setItem('oracle_theme_pref', themePreference);
    localStorage.setItem('oracle_color_theme', colorTheme);
  }, [themePreference, colorTheme]);

  // Hook color theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-color-theme', colorTheme);
  }, [colorTheme]);

  // Hook theme preference to document element class list
  useEffect(() => {
    if (themePreference === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setIsDarkMode(mediaQuery.matches);
      
      const listener = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    } else {
      setIsDarkMode(themePreference === 'dark');
    }
  }, [themePreference]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.body.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.body.classList.add('light');
    }
  }, [isDarkMode]);

  return {
    isDarkMode,
    themePreference,
    setThemePreference,
    colorTheme,
    setColorTheme
  };
}
