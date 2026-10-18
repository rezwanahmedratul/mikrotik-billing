import { useState, useEffect } from 'react';

export interface ThemePalette {
  cardBg: string;
  cardBorder: string;
  cardBorderHover: string;
  surfaceElevated: string;
  surfaceElevatedBorder: string;
  surfaceSubtle: string;
  modalBg: string;
  modalHeaderBg: string;
  modalBorder: string;
  inputBg: string;
  inputBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  hairline: string;
  chartGrid: string;
  chartText: string;
  chartCurrBar: string;
  chartCurrBarHover: string;
  chartPrevBar: string;
  chartPrevBarHover: string;
  chartDonutBg: string;
  chartDonutCenter: string;
  trafficGraphBg: string;
  buttonPrimaryBg: string;
  buttonPrimaryText: string;
  buttonSecondaryBg: string;
  buttonSecondaryBorder: string;
  buttonSecondaryText: string;
}

export interface UseThemeReturn {
  theme: 'dark' | 'light';
  isDark: boolean;
  palette: ThemePalette;
}

export function useTheme(): UseThemeReturn {
  const getTheme = (): 'dark' | 'light' => {
    if (typeof document === 'undefined') return 'dark';
    const attr = document.documentElement.getAttribute('data-bs-theme');
    return attr === 'light' ? 'light' : 'dark';
  };

  const [theme, setTheme] = useState<'dark' | 'light'>(getTheme);

  useEffect(() => {
    // 1. Observer for attribute changes on <html>
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'attributes' && m.attributeName === 'data-bs-theme') {
          setTheme(getTheme());
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-bs-theme'],
    });

    // 2. Custom event listener from Alpine / Blade themeToggle
    const handleCustomEvent = (e: any) => {
      if (e.detail?.theme) {
        setTheme(e.detail.theme === 'light' ? 'light' : 'dark');
      }
    };
    window.addEventListener('smartIspThemeChanged', handleCustomEvent);

    return () => {
      observer.disconnect();
      window.removeEventListener('smartIspThemeChanged', handleCustomEvent);
    };
  }, []);

  const isDark = theme === 'dark';

  const palette: ThemePalette = isDark
    ? {
        cardBg: '#111115',
        cardBorder: 'rgba(255, 255, 255, 0.08)',
        cardBorderHover: 'rgba(255, 255, 255, 0.16)',
        surfaceElevated: '#16161c',
        surfaceElevatedBorder: 'rgba(255, 255, 255, 0.08)',
        surfaceSubtle: '#18181f',
        modalBg: '#101014',
        modalHeaderBg: '#141419',
        modalBorder: 'rgba(255, 255, 255, 0.12)',
        inputBg: '#16161c',
        inputBorder: 'rgba(255, 255, 255, 0.12)',
        textPrimary: '#ffffff',
        textSecondary: '#a1a1aa',
        textMuted: '#71717a',
        badgeBg: '#18181f',
        badgeBorder: 'rgba(255, 255, 255, 0.1)',
        badgeText: '#a1a1aa',
        hairline: 'rgba(255, 255, 255, 0.06)',
        chartGrid: 'rgba(255, 255, 255, 0.05)',
        chartText: '#71717a',
        chartCurrBar: '#ffffff',
        chartCurrBarHover: '#ffffff',
        chartPrevBar: '#3a3a3c',
        chartPrevBarHover: '#636366',
        chartDonutBg: '#222228',
        chartDonutCenter: '#ffffff',
        trafficGraphBg: '#0e0e12',
        buttonPrimaryBg: '#ffffff',
        buttonPrimaryText: '#09090b',
        buttonSecondaryBg: '#16161b',
        buttonSecondaryBorder: 'rgba(255, 255, 255, 0.1)',
        buttonSecondaryText: '#e4e4e7',
      }
    : {
        cardBg: '#ffffff',
        cardBorder: 'rgba(0, 0, 0, 0.08)',
        cardBorderHover: 'rgba(0, 0, 0, 0.16)',
        surfaceElevated: '#f8fafc',
        surfaceElevatedBorder: 'rgba(0, 0, 0, 0.08)',
        surfaceSubtle: '#f1f5f9',
        modalBg: '#ffffff',
        modalHeaderBg: '#f8fafc',
        modalBorder: 'rgba(0, 0, 0, 0.1)',
        inputBg: '#f8fafc',
        inputBorder: 'rgba(0, 0, 0, 0.15)',
        textPrimary: '#09090b',
        textSecondary: '#52525b',
        textMuted: '#71717a',
        badgeBg: '#f1f5f9',
        badgeBorder: 'rgba(0, 0, 0, 0.08)',
        badgeText: '#334155',
        hairline: 'rgba(0, 0, 0, 0.06)',
        chartGrid: 'rgba(0, 0, 0, 0.06)',
        chartText: '#64748b',
        chartCurrBar: '#09090b',
        chartCurrBarHover: '#18181b',
        chartPrevBar: '#cbd5e1',
        chartPrevBarHover: '#94a3b8',
        chartDonutBg: '#e2e8f0',
        chartDonutCenter: '#09090b',
        trafficGraphBg: '#f8fafc',
        buttonPrimaryBg: '#09090b',
        buttonPrimaryText: '#ffffff',
        buttonSecondaryBg: '#f1f5f9',
        buttonSecondaryBorder: 'rgba(0, 0, 0, 0.1)',
        buttonSecondaryText: '#18181b',
      };

  return { theme, isDark, palette };
}
