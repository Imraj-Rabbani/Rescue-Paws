import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AppContextProvider } from './context/AppContext.jsx';
import { SearchProvider } from './context/SearchContext.jsx';
import { DarkmodeProvider } from './context/DarkmodeContext.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppContextProvider>
      <SearchProvider>
        <DarkmodeProvider>
          <App />
        </DarkmodeProvider>
      </SearchProvider>
    </AppContextProvider>
  </BrowserRouter>
);
