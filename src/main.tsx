import {createRoot} from 'react-dom/client';
import {HeroUIProvider} from '@heroui/system';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <HeroUIProvider>
    <App />
  </HeroUIProvider>,
);
