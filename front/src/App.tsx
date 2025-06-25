// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './modules/auth/Login';
import AuthRoutes from './modules/auth/AuthRoutes';
import Dashboard from './modules/dashboard/Dashboard';
import routes from './core/menuRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública de login */}
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas */}
        <Route
          path="/"
          element={
            <AuthRoutes>
              <Dashboard />
            </AuthRoutes>
          }
        >
          {routes
            .filter(route => !route.hidden) // opcional: ocultar rutas marked hidden
            .map(route => {
              // la ruta raíz "/" la montamos como index
              if (route.path === '/') {
                return <Route index key="index" element={route.element} />;
              }
              // el resto, sin la "/" inicial
              const childPath = route.path.replace(/^\//, '');
              return (
                <Route
                  key={route.path}
                  path={childPath}
                  element={route.element}
                />
              );
            })}
        </Route>

        {/* Cualquier otra URL va a "/" (y luego AuthRoutes redirige a /login si no hay token) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
