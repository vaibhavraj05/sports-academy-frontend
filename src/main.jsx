import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StyleProvider } from '@ant-design/cssinjs';

import App from './App';
import AuthProvider from './context/AuthProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      select: (res) => res.data.data
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ConfigProvider
          theme={{
            token: {
              colorTextHeading: '#1d3557'
            }
          }}
        >
          <QueryClientProvider client={queryClient}>
            <StyleProvider hashPriority='high'>
              <App />
            </StyleProvider>
          </QueryClientProvider>
        </ConfigProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
