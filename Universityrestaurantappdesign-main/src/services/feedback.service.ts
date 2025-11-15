import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api';
import { WeeklyMenu } from './menu.service';
import { StudentData } from './auth.service';

export interface Feedback {
  id: number;
  student_id: number;
  menu_id: number;
  rating: number;
  category: string;
  comment: string;
  sentiment: string;
  student?: StudentData;
  menu?: WeeklyMenu;
  created_at: string;
  updated_at: string;
}

export interface CreateFeedbackData {
  menu_id: number;
  rating: number;
  category?: 'taste' | 'timing' | 'service' | 'hygiene';
  comment?: string;
}

class FeedbackService {
  /**
   * Get all feedback
   */
  async getFeedback(page: number = 1): Promise<{ data: Feedback[]; meta: any }> {
    const response = await apiService.get<Feedback[]>(
      API_ENDPOINTS.FEEDBACK,
      { page }
    );
    return {
      data: response.data || [],
      meta: response.meta,
    };
  }

  /**
   * Submit feedback
   */
  async submitFeedback(data: CreateFeedbackData): Promise<Feedback> {
    const response = await apiService.post<Feedback>(
      API_ENDPOINTS.FEEDBACK,
      data
    );
    return response.data!;
  }

  /**
   * Get feedback by ID
   */
  async getFeedbackById(id: number): Promise<Feedback> {
    const response = await apiService.get<Feedback>(
      API_ENDPOINTS.FEEDBACK_DETAIL(id)
    );
    return response.data!;
  }
}

export const feedbackService = new FeedbackService();
