import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import { App } from './components/app'
import { RootRedirect } from './components/root-redirect'
import './styles/app.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/:mode/:slideNum?" element={<App />} />
        <Route path="*" element={<Navigate to="/advanced/1" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
