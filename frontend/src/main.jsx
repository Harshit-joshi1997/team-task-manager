import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import useThemeStore from './store/useThemeStore.js'

// Apply persisted theme to <html> on initial load before React renders
const { theme } = useThemeStore.getState();
document.documentElement.setAttribute('data-theme', theme);

// Keep <html> in sync whenever theme changes
useThemeStore.subscribe((state) => {
  document.documentElement.setAttribute('data-theme', state.theme);
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
