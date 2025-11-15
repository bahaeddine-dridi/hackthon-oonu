import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api';
import { StudentData } from './auth.service';

export interface CreateStudentData {
  student_id: string;
  name: string;
  email: string;
  university: string;
  password: string;
  wallet_balance?: number;
  points?: number;
}

export interface UpdateStudentData {
  student_id?: string;
  name?: string;
  email?: string;
  university?: string;
  password?: string;
  points?: number;
  wallet_balance?: number;
  active?: boolean;
}

class AdminStudentService {
  /**
   * Get all students
   */
  async getStudents(page: number = 1, filters?: any): Promise<{ data: StudentData[]; meta: any }> {
    const response = await apiService.get<StudentData[]>(
      API_ENDPOINTS.ADMIN_STUDENTS,
      { page, ...filters }
    );
    return {
      data: response.data || [],
      meta: response.meta,
    };
  }

  /**
   * Create student
   */
  async createStudent(data: CreateStudentData): Promise<StudentData> {
    const response = await apiService.post<StudentData>(
      API_ENDPOINTS.ADMIN_STUDENTS,
      data
    );
    return response.data!;
  }

  /**
   * Get student by ID
   */
  async getStudent(id: number): Promise<StudentData> {
    const response = await apiService.get<StudentData>(
      API_ENDPOINTS.ADMIN_STUDENT_DETAIL(id)
    );
    return response.data!;
  }

  /**
   * Update student
   */
  async updateStudent(id: number, data: UpdateStudentData): Promise<StudentData> {
    const response = await apiService.put<StudentData>(
      API_ENDPOINTS.ADMIN_STUDENT_DETAIL(id),
      data
    );
    return response.data!;
  }

  /**
   * Delete student
   */
  async deleteStudent(id: number): Promise<void> {
    await apiService.delete(API_ENDPOINTS.ADMIN_STUDENT_DETAIL(id));
  }

  /**
   * Restore student
   */
  async restoreStudent(id: number): Promise<StudentData> {
    const response = await apiService.post<StudentData>(
      API_ENDPOINTS.ADMIN_STUDENT_RESTORE(id)
    );
    return response.data!;
  }
}

export const adminStudentService = new AdminStudentService();
