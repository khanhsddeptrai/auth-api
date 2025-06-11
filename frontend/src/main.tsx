// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import theme from './theme.ts'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>

  // </StrictMode>,
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
      <ToastContainer position="bottom-left" theme="colored" />
    </ThemeProvider>
  </BrowserRouter>
)
