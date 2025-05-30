
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initStorage } from './utils/storage';

// Initialize local storage with default data if needed
initStorage();

createRoot(document.getElementById("root")!).render(<App />);
