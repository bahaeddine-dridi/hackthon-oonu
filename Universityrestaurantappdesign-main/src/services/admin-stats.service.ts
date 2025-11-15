import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api';
import { Reservation } from './reservation.service';
import { Feedback } from './feedback.service';

export interface ReservationStats {
  total_reservations: number;
  confirmed: number;
  pending: number;
  cancelled: number;
  no_show: number;
  revenue: number;
  by_payment_method: Array<{ payment_method: string; count: number }>;
}

export interface FeedbackStats {
  total_feedback: number;
  average_rating: number;
  by_rating: Array<{ rating: number; count: number }>;
  by_category: Array<{ category: string; count: number; avg_rating: number }>;
  by_sentiment: Array<{ sentiment: string; count: number }>;
}

export interface AIRecommendation {
  id: number;
  title: string;
  content: string;
  confidence?: number;
  category?: string;
  created_at?: string;
}

class AdminStatsService {
  /**
   * Get all reservations
   */
  async getReservations(page: number = 1, filters?: any): Promise<{ data: Reservation[]; meta: any }> {
    const response = await apiService.get<Reservation[]>(
      API_ENDPOINTS.ADMIN_RESERVATIONS,
      { page, ...filters }
    );
    return {
      data: response.data || [],
      meta: response.meta,
    };
  }

  /**
   * Get reservation statistics
   */
  async getReservationStats(startDate?: string, endDate?: string): Promise<ReservationStats> {
    const response = await apiService.get<ReservationStats>(
      API_ENDPOINTS.ADMIN_RESERVATIONS_STATS,
      { start_date: startDate, end_date: endDate }
    );
    return response.data!;
  }

  /**
   * Update reservation status
   */
  async updateReservationStatus(id: number, status: string): Promise<Reservation> {
    const response = await apiService.put<Reservation>(
      API_ENDPOINTS.ADMIN_RESERVATION_STATUS(id),
      { status }
    );
    return response.data!;
  }

  /**
   * Get all feedback
   */
  async getFeedback(page: number = 1, filters?: any): Promise<{ data: Feedback[]; meta: any }> {
    const response = await apiService.get<Feedback[]>(
      API_ENDPOINTS.ADMIN_FEEDBACK,
      { page, ...filters }
    );
    return {
      data: response.data || [],
      meta: response.meta,
    };
  }

  /**
   * Get feedback statistics
   */
  async getFeedbackStats(startDate?: string, endDate?: string): Promise<FeedbackStats> {
    const response = await apiService.get<FeedbackStats>(
      API_ENDPOINTS.ADMIN_FEEDBACK_STATS,
      { start_date: startDate, end_date: endDate }
    );
    return response.data!;
  }

  /**
   * Delete feedback
   */
  async deleteFeedback(id: number): Promise<void> {
    await apiService.delete(API_ENDPOINTS.ADMIN_FEEDBACK_DETAIL(id));
  }

  /**
   * Get AI recommendations
   */
  async getAIRecommendations(): Promise<AIRecommendation[]> {
    const response = await apiService.get<AIRecommendation[]>(
      API_ENDPOINTS.ADMIN_AI_RECOMMENDATIONS
    );
    return response.data || [];
  }

  /**
   * Get saved AI recommendations
   */
  async getSavedRecommendations(page: number = 1): Promise<{ data: AIRecommendation[]; meta: any }> {
    const response = await apiService.get<AIRecommendation[]>(
      API_ENDPOINTS.ADMIN_AI_SAVED,
      { page }
    );
    return {
      data: response.data || [],
      meta: response.meta,
    };
  }

  /**
   * Save AI recommendation
   */
  async saveRecommendation(data: { title: string; content: string }): Promise<AIRecommendation> {
    const response = await apiService.post<AIRecommendation>(
      API_ENDPOINTS.ADMIN_AI_RECOMMENDATIONS,
      data
    );
    return response.data!;
  }
}

export const adminStatsService = new AdminStatsService();
