import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api';
import { StudentData } from './auth.service';
import { Reservation } from './reservation.service';

export interface UpdateProfileData {
  name?: string;
  email?: string;
  university?: string;
  password?: string;
  password_confirmation?: string;
}

class ProfileService {
  /**
   * Get profile
   */
  async getProfile(): Promise<StudentData> {
    const response = await apiService.get<StudentData>(API_ENDPOINTS.PROFILE);
    return response.data!;
  }

  /**
   * Update profile
   */
  async updateProfile(data: UpdateProfileData): Promise<StudentData> {
    const response = await apiService.put<StudentData>(
      API_ENDPOINTS.PROFILE,
      data
    );
    return response.data!;
  }

  /**
   * Get reservation history
   */
  async getReservationHistory(page: number = 1): Promise<{ data: Reservation[]; meta: any }> {
    const response = await apiService.get<Reservation[]>(
      API_ENDPOINTS.PROFILE_HISTORY,
      { page }
    );
    return {
      data: response.data || [],
      meta: response.meta,
    };
  }
}

export const profileService = new ProfileService();
