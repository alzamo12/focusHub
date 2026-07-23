import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import router from './router/router.jsx'
import AuthProvider from './providers/AuthProvider/AuthProvider.jsx'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ThemeProvider from './providers/themeProvider/ThemeProvider.jsx'

const queryClient = new QueryClient();
// window.auth = auth;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
)
