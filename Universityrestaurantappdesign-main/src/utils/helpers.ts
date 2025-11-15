import { ApiError } from '../services/api.service';

/**
 * Handle API errors and return user-friendly messages
 */
export function handleApiError(error: any): string {
  if (error && typeof error === 'object') {
    const apiError = error as ApiError;
    
    // Handle validation errors
    if (apiError.errors) {
      const firstError = Object.values(apiError.errors)[0];
      return Array.isArray(firstError) ? firstError[0] : String(firstError);
    }
    
    // Handle general error messages
    if (apiError.message) {
      return apiError.message;
    }
  }
  
  // Handle network errors
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return 'Unable to connect to server. Please check your internet connection.';
  }
  
  // Default error message
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Show error notification
 */
export function showError(message: string) {
  // You can integrate with a toast library here
  console.error('Error:', message);
  alert(message); // Replace with toast notification
}

/**
 * Show success notification
 */
export function showSuccess(message: string) {
  // You can integrate with a toast library here
  console.log('Success:', message);
  // Replace with toast notification if needed
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-TN', {
    style: 'currency',
    currency: 'TND',
  }).format(amount);
}

/**
 * Format date
 */
export function formatDate(date: string | Date, locale: string = 'ar-TN'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

/**
 * Format time
 */
export function formatTime(date: string | Date, locale: string = 'ar-TN'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}

/**
 * Get day name
 */
export function getDayName(day: string, locale: string = 'ar'): string {
  const days: Record<string, { ar: string; fr: string }> = {
    Mon: { ar: 'الإثنين', fr: 'Lundi' },
    Tue: { ar: 'الثلاثاء', fr: 'Mardi' },
    Wed: { ar: 'الأربعاء', fr: 'Mercredi' },
    Thu: { ar: 'الخميس', fr: 'Jeudi' },
    Fri: { ar: 'الجمعة', fr: 'Vendredi' },
    Sat: { ar: 'السبت', fr: 'Samedi' },
    Sun: { ar: 'الأحد', fr: 'Dimanche' },
  };
  
  return days[day]?.[locale as 'ar' | 'fr'] || day;
}

/**
 * Get meal type name
 */
export function getMealTypeName(mealType: string, locale: string = 'ar'): string {
  const types: Record<string, { ar: string; fr: string }> = {
    breakfast: { ar: 'فطور', fr: 'Petit-déjeuner' },
    lunch: { ar: 'غداء', fr: 'Déjeuner' },
    dinner: { ar: 'عشاء', fr: 'Dîner' },
  };
  
  return types[mealType]?.[locale as 'ar' | 'fr'] || mealType;
}

/**
 * Get status badge color
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    no_show: 'bg-gray-100 text-gray-800',
    available: 'bg-green-100 text-green-800',
    unavailable: 'bg-red-100 text-red-800',
  };
  
  return colors[status] || 'bg-gray-100 text-gray-800';
}

/**
 * Get sentiment badge color
 */
export function getSentimentColor(sentiment: string): string {
  const colors: Record<string, string> = {
    positive: 'bg-green-100 text-green-800',
    neutral: 'bg-yellow-100 text-yellow-800',
    negative: 'bg-red-100 text-red-800',
  };
  
  return colors[sentiment] || 'bg-gray-100 text-gray-800';
}
