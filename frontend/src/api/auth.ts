import api from './config';

export interface User {
  id: number;
  nombre: string;
  correo: string;
  rol: 'administrador' | 'editor' | 'lector';
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  correo: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    usuario: User;
    token: string;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

class AuthService {
  private tokenKey = 'authToken';
  private userKey = 'authUser';

  // Login del usuario
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await api.post('/usuarios/login', credentials) as LoginResponse;
      
      if (response.success && response.data) {
        // Guardar token y usuario en localStorage
        this.setToken(response.data.token);
        this.setUser(response.data.usuario);
      }
      
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error en el login';
      throw new Error(errorMessage);
    }
  }

  // Logout del usuario
  logout(): void {
    this.removeToken();
    this.removeUser();
    
    // Limpiar TODAS las cookies relacionadas con autenticación
    if (typeof document !== 'undefined') {
      // Lista de cookies a limpiar
      const cookiesToClear = [
        'authToken',
        'isLoggedIn', 
        'coalicion_session_token',
        'userEmail'
      ];
      
      cookiesToClear.forEach(cookieName => {
        // Limpiar con diferentes configuraciones para asegurar que se eliminen
        document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=strict`;
        document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=lax`;
        document.cookie = `${cookieName}=; path=/; domain=${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      });
    }
    
    // Limpiar también cualquier resto en localStorage
    if (typeof localStorage !== 'undefined') {
      const keysToRemove = ['authToken', 'authUser', 'isLoggedIn', 'userEmail'];
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });
    }
  }

  // Obtener perfil del usuario autenticado
  async getProfile(): Promise<User> {
    try {
      const response = await api.get('/usuarios/profile') as { success: boolean; data: User };
      
      if (response.success && response.data) {
        this.setUser(response.data);
        return response.data;
      }
      
      throw new Error('No se pudo obtener el perfil');
    } catch (error: unknown) {
      // Si hay error (ej: token expirado), hacer logout
      this.logout();
      const errorMessage = error instanceof Error ? error.message : 'Error al obtener perfil';
      throw new Error(errorMessage);
    }
  }

  // Cambiar contraseña
  async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<void> {
    try {
      await api.put(`/usuarios/change-password/${userId}`, {
        currentPassword,
        newPassword
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cambiar contraseña';
      throw new Error(errorMessage);
    }
  }

  // Gestión de token
  private setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  private removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
    }
  }

  // Gestión de usuario
  setUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.userKey, JSON.stringify(user));
    }
  }

  getUser(): User | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem(this.userKey);
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  private removeUser(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.userKey);
    }
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!(this.getToken() && this.getUser());
  }

  // Obtener estado de autenticación completo
  getAuthState(): AuthState {
    return {
      isAuthenticated: this.isAuthenticated(),
      user: this.getUser(),
      token: this.getToken()
    };
  }

  // Verificar si el usuario tiene un rol específico
  hasRole(role: string): boolean {
    const user = this.getUser();
    return user?.rol === role;
  }

  // Verificar si el usuario es administrador
  isAdmin(): boolean {
    return this.hasRole('administrador');
  }

  // Verificar si el usuario es editor o administrador
  isEditor(): boolean {
    return this.hasRole('editor') || this.isAdmin();
  }

  // Verificar si el usuario puede hacer operaciones CRUD
  canManageContent(): boolean {
    return this.isAdmin(); // Solo administradores pueden crear/editar/eliminar
  }

  // Verificar si el usuario puede gestionar otros usuarios
  canManageUsers(): boolean {
    return this.isAdmin(); // Solo administradores pueden gestionar usuarios
  }
}

// Exportar instancia singleton
export const authService = new AuthService();
export default authService;