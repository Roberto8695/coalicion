"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService, User, AuthState } from '@/api/auth';

interface AuthContextType extends AuthState {
  login: (correo: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: User) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null
  });
  const [isLoading, setIsLoading] = useState(true);

  // Inicializar estado de autenticación
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = authService.getToken();
        const user = authService.getUser();

        if (token && user) {
          // Verificar que el token siga siendo válido
          try {
            const currentUser = await authService.getProfile();
            setAuthState({
              isAuthenticated: true,
              user: currentUser,
              token
            });
          } catch {
            // Token inválido, limpiar estado
            authService.logout();
            setAuthState({
              isAuthenticated: false,
              user: null,
              token: null
            });
          }
        }
      } catch (error) {
        console.error('Error inicializando autenticación:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (correo: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authService.login({ correo, password });
      
      if (response.success) {
        setAuthState({
          isAuthenticated: true,
          user: response.data.usuario,
          token: response.data.token
        });
        
        // Establecer cookie para el middleware
        document.cookie = `authToken=${response.data.token}; path=/; max-age=86400; SameSite=strict`;
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error en login:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Limpiar el estado de autenticación primero
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null
    });
    
    // Limpiar datos del authService
    authService.logout();
    
    // Limpiar cookie de manera más robusta
    if (typeof document !== 'undefined') {
      document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=strict';
    }
  };

  const updateUser = (user: User) => {
    authService.setUser(user);
    setAuthState(prev => ({
      ...prev,
      user
    }));
  };

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    updateUser,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}

// Hooks adicionales para verificación de permisos
export function usePermissions() {
  const { user } = useAuth();
  
  return {
    // Roles básicos
    isAdmin: user?.rol === 'administrador',
    isEditor: user?.rol === 'editor',
    isReader: user?.rol === 'lector',
    
    // Permisos de contenido
    canCreateContent: user?.rol === 'administrador' || user?.rol === 'editor',
    canEditContent: user?.rol === 'administrador' || user?.rol === 'editor',
    canDeleteContent: user?.rol === 'administrador' || user?.rol === 'editor',
    canViewContent: true, // Todos pueden ver (admin, editor, lector)
    
    // Permisos de publicaciones específicas
    canCreatePublicaciones: user?.rol === 'administrador' || user?.rol === 'editor',
    canEditPublicaciones: user?.rol === 'administrador' || user?.rol === 'editor',
    canDeletePublicaciones: user?.rol === 'administrador' || user?.rol === 'editor',
    
    // Permisos de administración (solo admin)
    canManageUsers: user?.rol === 'administrador',
    canManageCategories: user?.rol === 'administrador',
    canManageSystem: user?.rol === 'administrador',
    
    // Acceso al dashboard (admin, editor y lector)
    canAccessDashboard: user?.rol === 'administrador' || user?.rol === 'editor' || user?.rol === 'lector',
    
    // Función helper
    hasRole: (role: string) => user?.rol === role,
    hasAnyRole: (roles: string[]) => roles.includes(user?.rol || '')
  };
}