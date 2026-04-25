import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './hooks/useTheme'

// Apply theme immediately before React renders to prevent flash
const saved = localStorage.getItem('lituk_settings');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
let theme: string = 'system';
try { if (saved) theme = JSON.parse(saved).theme; } catch {}
if (theme === 'dark' || (theme === 'system' && prefersDark)) {
  document.documentElement.classList.add('dark');
}

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
)
