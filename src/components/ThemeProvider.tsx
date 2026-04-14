'use client';

import { useLayoutEffect, useState, ReactNode } from 'react';
import { useThemeStore } from '@/store/themeStore';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const { theme } = useThemeStore();

  useLayoutEffect(() => {
    // Hydrate theme from localStorage
    const savedTheme = localStorage.getItem('theme-storage');
    if (savedTheme) {
      try {
        const parsed = JSON.parse(savedTheme);
        if (parsed.state?.theme) {
          useThemeStore.setState({ theme: parsed.state.theme });
        }
      } catch (e) {
        // Silently fail
      }
    }
    setHydrated(true);
  }, []);

  useLayoutEffect(() => {
    if (!hydrated) return;
    
    const htmlElement = document.documentElement;
    htmlElement.setAttribute('data-theme', theme);
    htmlElement.className = theme;
  }, [theme, hydrated]);

  if (!hydrated) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
