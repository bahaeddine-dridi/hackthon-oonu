import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api';

export interface WeeklyMenu {
  id: number;
  day: string;
  meal_type: string;
  title: string;
  tags: string[];
  status: string;
  created_at: string;
  updated_at: string;
}

export interface MenuFilters {
  day?: string;
  meal_type?: string;
  status?: string;
}

class MenuService {
  /**
   * Get weekly menu
   */
  async getWeeklyMenu(filters?: MenuFilters): Promise<WeeklyMenu[]> {
    const response = await apiService.get<WeeklyMenu[]>(
      API_ENDPOINTS.WEEKLY_MENU,
      filters
    );
    return response.data || [];
  }

  /**
   * Get menu item by ID
   */
  async getMenuItem(id: number): Promise<WeeklyMenu> {
    const response = await apiService.get<WeeklyMenu>(
      API_ENDPOINTS.MENU_ITEM(id)
    );
    return response.data!;
  }
}

export const menuService = new MenuService();
