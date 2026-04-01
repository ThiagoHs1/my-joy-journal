import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export const APP_THEMES = {
  purple: { name: 'Purple', primary: '252 85% 60%', accent: '167 72% 60%', ring: '252 85% 60%' },
  blue: { name: 'Blue', primary: '217 91% 60%', accent: '199 89% 48%', ring: '217 91% 60%' },
  green: { name: 'Green', primary: '142 71% 45%', accent: '172 66% 50%', ring: '142 71% 45%' },
  amber: { name: 'Amber', primary: '38 92% 50%', accent: '25 95% 53%', ring: '38 92% 50%' },
  cyan: { name: 'Cyan', primary: '188 85% 45%', accent: '199 89% 48%', ring: '188 85% 45%' },
  pink: { name: 'Pink', primary: '330 81% 60%', accent: '292 84% 61%', ring: '330 81% 60%' },
  mono: { name: 'Mono', primary: '0 0% 45%', accent: '0 0% 60%', ring: '0 0% 45%' },
} as const;

export type AppThemeId = keyof typeof APP_THEMES;

interface AppThemeContextType {
  appTheme: AppThemeId;
  setAppTheme: (theme: AppThemeId) => void;
}

const AppThemeContext = createContext<AppThemeContextType>({
  appTheme: 'purple',
  setAppTheme: () => {},
});

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [appTheme, setAppThemeState] = useState<AppThemeId>(() => {
    return (localStorage.getItem('linkforge_app_theme') as AppThemeId) || 'purple';
  });

  const setAppTheme = (theme: AppThemeId) => {
    setAppThemeState(theme);
    localStorage.setItem('linkforge_app_theme', theme);
  };

  useEffect(() => {
    const t = APP_THEMES[appTheme];
    const root = document.documentElement;
    root.style.setProperty('--primary', t.primary);
    root.style.setProperty('--ring', t.ring);
    root.style.setProperty('--accent', t.accent);
    // Dark mode variants
    root.style.setProperty('--sidebar-primary', t.primary);
    root.style.setProperty('--sidebar-ring', t.ring);
  }, [appTheme]);

  return (
    <AppThemeContext.Provider value={{ appTheme, setAppTheme }}>
      {children}
    </AppThemeContext.Provider>
  );
}

export const useAppTheme = () => useContext(AppThemeContext);
