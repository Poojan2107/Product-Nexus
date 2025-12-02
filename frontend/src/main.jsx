import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { AuthProvider } from "./providers/AuthProvider.jsx";
import { NotificationProvider } from "./contexts/NotificationContext.jsx";
import { Provider } from 'react-redux';
import { store } from './store/store';


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <HashRouter>
        <AuthProvider>
          <NotificationProvider>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </NotificationProvider>
        </AuthProvider>
      </HashRouter>
    </Provider>
  </StrictMode>,
);
