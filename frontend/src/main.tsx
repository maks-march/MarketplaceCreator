import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import { AppProvider } from './context/AppContext.tsx';
import App from './App.tsx';
import './index.css';
import { FavoritesProvider } from './contexts/FavoritesContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <AppProvider>
      <FavoritesProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </FavoritesProvider>
    </AppProvider>
  </AuthProvider>
);
