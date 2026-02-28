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

console.log(
  "%c🚀 Engineered by Poojan 😎\n%cWelcome to ProductNexus Enterprise OS",
  "color: #10b981; font-size: 20px; font-weight: bold; font-family: 'JetBrains Mono', monospace; text-shadow: 0 0 10px rgba(16,185,129,0.5);",
  "color: #a1a1aa; font-size: 14px; font-family: 'Outfit', sans-serif;"
);

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
