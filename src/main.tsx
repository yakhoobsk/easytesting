import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import "antd/dist/reset.css";
import "./index.css";
import "./App.css";
import { store } from "./redux/store.ts";
import { ConfigProvider } from "antd";
import { Provider } from "react-redux";
import { lightTheme } from "./theme";
import ErrorBoundary from './components/ErrorBoundary.tsx';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ConfigProvider theme={{ ...(lightTheme) }}>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </ConfigProvider>
    </Provider>
  </StrictMode>,
)
