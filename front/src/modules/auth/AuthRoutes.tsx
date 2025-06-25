// src/context/AuthRoutes.tsx
import React from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { Navigate } from 'react-router-dom';

interface AuthRoutesProps {
  children: ReactNode;
}

export default function AuthRoutes({ children }: AuthRoutesProps) {
  const { token } = useAuth();

  // Si hay token, renderizamos el contenido protegido
  if (token) {
    return <>{children}</>;
  }
  
  // Si no, redirigimos al login
  return <Navigate to="/login" replace />;
}
