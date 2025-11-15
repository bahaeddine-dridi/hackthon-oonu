import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api';
import { WeeklyMenu } from './menu.service';

export interface CreateMenuData {
  day: string;
  meal_type: string;
  title: string;
  tags?: string[];
  status?: string;
}

export interface UpdateMenuData {
  day?: string;
  meal_type?: string;
  title?: string;
  tags?: string[];
  status?: string;
}

class AdminMenuService {
  /**
   * Get all menus
   */
  async getMenus(page: number = 1, filters?: any): Promise<{ data: WeeklyMenu[]; meta: any }> {
    const response = await apiService.get<WeeklyMenu[]>(
      API_ENDPOINTS.ADMIN_MENUS,
      { page, ...filters }
    );
    return {
      data: response.data || [],
      meta: response.meta,
    };
  }

  /**
   * Create menu
   */
  async createMenu(data: CreateMenuData): Promise<WeeklyMenu> {
    const response = await apiService.post<WeeklyMenu>(
      API_ENDPOINTS.ADMIN_MENUS,
      data
    );
    return response.data!;
  }

  /**
   * Get menu by ID
   */
  async getMenu(id: number): Promise<WeeklyMenu> {
    const response = await apiService.get<WeeklyMenu>(
      API_ENDPOINTS.ADMIN_MENU_DETAIL(id)
    );
    return response.data!;
  }

  /**
   * Update menu
   */
  async updateMenu(id: number, data: UpdateMenuData): Promise<WeeklyMenu> {
    const response = await apiService.put<WeeklyMenu>(
      API_ENDPOINTS.ADMIN_MENU_DETAIL(id),
      data
    );
    return response.data!;
  }

  /**
   * Delete menu
   */
  async deleteMenu(id: number): Promise<void> {
    await apiService.delete(API_ENDPOINTS.ADMIN_MENU_DETAIL(id));
  }
}

export const adminMenuService = new AdminMenuService();
