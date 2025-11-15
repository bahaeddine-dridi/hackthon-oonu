// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8000/api/v1',
  TIMEOUT: 10000,
};

// API Endpoints
export const API_ENDPOINTS = {
  // Student Auth
  STUDENT_LOGIN: '/student/login',
  STUDENT_REGISTER: '/student/register',
  STUDENT_LOGOUT: '/student/logout',
  
  // Admin Auth
  ADMIN_LOGIN: '/admin/login',
  ADMIN_LOGOUT: '/admin/logout',
  
  // Menu
  WEEKLY_MENU: '/menu/week',
  MENU_ITEM: (id: number) => `/menu/${id}`,
  
  // Reservations
  RESERVATIONS: '/reservations',
  RESERVATION_DETAIL: (id: number) => `/reservations/${id}`,
  CANCEL_RESERVATION: (id: number) => `/reservations/${id}/cancel`,
  
  // Wallet
  WALLET: '/wallet',
  WALLET_RECHARGE: '/wallet/recharge',
  
  // Feedback
  FEEDBACK: '/feedback',
  FEEDBACK_DETAIL: (id: number) => `/feedback/${id}`,
  
  // Profile
  PROFILE: '/profile',
  PROFILE_HISTORY: '/profile/history',
  
  // Admin - Menus
  ADMIN_MENUS: '/admin/menus',
  ADMIN_MENU_DETAIL: (id: number) => `/admin/menus/${id}`,
  
  // Admin - Students
  ADMIN_STUDENTS: '/admin/students',
  ADMIN_STUDENT_DETAIL: (id: number) => `/admin/students/${id}`,
  ADMIN_STUDENT_RESTORE: (id: number) => `/admin/students/${id}/restore`,
  
  // Admin - Reservations
  ADMIN_RESERVATIONS: '/admin/reservations',
  ADMIN_RESERVATIONS_STATS: '/admin/reservations/statistics',
  ADMIN_RESERVATION_DETAIL: (id: number) => `/admin/reservations/${id}`,
  ADMIN_RESERVATION_STATUS: (id: number) => `/admin/reservations/${id}/status`,
  
  // Admin - Feedback
  ADMIN_FEEDBACK: '/admin/feedback',
  ADMIN_FEEDBACK_STATS: '/admin/feedback/statistics',
  ADMIN_FEEDBACK_DETAIL: (id: number) => `/admin/feedback/${id}`,
  
  // Admin - AI
  ADMIN_AI_RECOMMENDATIONS: '/admin/ai/recommendations',
  ADMIN_AI_SAVED: '/admin/ai/recommendations/saved',
};

// Storage Keys
export const STORAGE_KEYS = {
  STUDENT_TOKEN: 'student_token',
  ADMIN_TOKEN: 'admin_token',
  USER_DATA: 'user_data',
  ADMIN_DATA: 'admin_data',
  LANGUAGE: 'language',
};
