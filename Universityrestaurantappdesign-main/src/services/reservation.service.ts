import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api';
import { WeeklyMenu } from './menu.service';
import { StudentData } from './auth.service';

export interface Reservation {
  id: number;
  student_id: number;
  menu_id: number;
  date: string;
  qr_code: string;
  status: string;
  payment_method: string;
  price: number;
  student?: StudentData;
  menu?: WeeklyMenu;
  created_at: string;
  updated_at: string;
}

export interface CreateReservationData {
  menu_id: number;
  date: string;
  payment_method: 'wallet' | 'points' | 'cash';
}

class ReservationService {
  /**
   * Get all reservations
   */
  async getReservations(page: number = 1): Promise<{ data: Reservation[]; meta: any }> {
    const response = await apiService.get<Reservation[]>(
      API_ENDPOINTS.RESERVATIONS,
      { page }
    );
    return {
      data: response.data || [],
      meta: response.meta,
    };
  }

  /**
   * Create new reservation
   */
  async createReservation(data: CreateReservationData): Promise<Reservation> {
    const response = await apiService.post<Reservation>(
      API_ENDPOINTS.RESERVATIONS,
      data
    );
    return response.data!;
  }

  /**
   * Get reservation by ID
   */
  async getReservation(id: number): Promise<Reservation> {
    const response = await apiService.get<Reservation>(
      API_ENDPOINTS.RESERVATION_DETAIL(id)
    );
    return response.data!;
  }

  /**
   * Cancel reservation
   */
  async cancelReservation(id: number): Promise<Reservation> {
    const response = await apiService.post<Reservation>(
      API_ENDPOINTS.CANCEL_RESERVATION(id)
    );
    return response.data!;
  }
}

export const reservationService = new ReservationService();
