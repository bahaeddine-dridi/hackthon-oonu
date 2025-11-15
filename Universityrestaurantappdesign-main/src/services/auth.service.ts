import { apiService } from './api.service';
import { API_ENDPOINTS, STORAGE_KEYS } from '../config/api';

export interface StudentLoginData {
  student_id: string;
  password: string;
}

export interface StudentRegisterData {
  student_id: string;
  name: string;
  email: string;
  university: string;
  password: string;
  password_confirmation: string;
}

export interface AdminLoginData {
  email: string;
  password: string;
}

export interface StudentData {
  id: number;
  student_id: string;
  name: string;
  email: string;
  university: string;
  points: number;
  wallet_balance: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminData {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  student?: StudentData;
  admin?: AdminData;
  token: string;
}

class AuthService {
  /**
   * Student login
   */
  async studentLogin(credentials: StudentLoginData): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>(
      API_ENDPOINTS.STUDENT_LOGIN,
      credentials
    );

    if (response.data?.token) {
      apiService.setToken(response.data.token, false);
      if (response.data.student) {
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.student));
      }
    }

    return response.data!;
  }

  /**
   * Student register
   */
  async studentRegister(data: StudentRegisterData): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>(
      API_ENDPOINTS.STUDENT_REGISTER,
      data
    );

    if (response.data?.token) {
      apiService.setToken(response.data.token, false);
      if (response.data.student) {
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.student));
      }
    }

    return response.data!;
  }

  /**
   * Admin login
   */
  async adminLogin(credentials: AdminLoginData): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>(
      API_ENDPOINTS.ADMIN_LOGIN,
      credentials
    );

    if (response.data?.token) {
      apiService.setToken(response.data.token, true);
      if (response.data.admin) {
        localStorage.setItem(STORAGE_KEYS.ADMIN_DATA, JSON.stringify(response.data.admin));
      }
    }

    return response.data!;
  }

  /**
   * Student logout
   */
  async studentLogout(): Promise<void> {
    try {
      await apiService.post(API_ENDPOINTS.STUDENT_LOGOUT);
    } finally {
      apiService.removeToken();
    }
  }

  /**
   * Admin logout
   */
  async adminLogout(): Promise<void> {
    try {
      await apiService.post(API_ENDPOINTS.ADMIN_LOGOUT);
    } finally {
      apiService.removeToken();
    }
  }

  /**
   * Get stored student data
   */
  getStoredStudent(): StudentData | null {
    const data = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  }

  /**
   * Get stored admin data
   */
  getStoredAdmin(): AdminData | null {
    const data = localStorage.getItem(STORAGE_KEYS.ADMIN_DATA);
    return data ? JSON.parse(data) : null;
  }

  /**
   * Check if authenticated
   */
  isAuthenticated(): boolean {
    return apiService.isAuthenticated();
  }
}

export const authService = new AuthService();
