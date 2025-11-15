import { useState, useEffect } from 'react';
import { User } from '../App';
import { Header } from './Header';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Leaf, AlertTriangle, Sparkles, X } from 'lucide-react';
import { menuService, WeeklyMenu as ApiWeeklyMenu } from '../services/menu.service';
import { handleApiError } from '../utils/helpers';

type Page = 'login' | 'dashboard' | 'menu' | 'reservation' | 'wallet' | 'feedback' | 'profile';

interface WeeklyMenuProps {
  language: 'ar' | 'fr';
  onNavigate: (page: Page) => void;
  user: User;
}

const translations = {
  ar: {
    title: 'قائمة الأسبوع',
    day: 'اليوم',
    breakfast: 'فطور',
    lunch: 'غداء',
    dinner: 'عشاء',
    notes: 'ملاحظات',
    vegetarian: 'نباتي',
    allergens: 'مسببات حساسية',
    new: 'جديد',
    unavailable: 'غير متوفر',
    filters: 'التصفية',
    restaurant: 'المطعم',
    allRestaurants: 'جميع المطاعم',
    campusNorth: 'الحرم الشمالي',
    campusSouth: 'الحرم الجنوبي',
    highProtein: 'غني بالبروتين',
    days: {
      monday: 'الإثنين',
      tuesday: 'الثلاثاء',
      wednesday: 'الأربعاء',
      thursday: 'الخميس',
      friday: 'الجمعة',
      saturday: 'السبت',
      sunday: 'الأحد'
    }
  },
  fr: {
    title: 'Menu de la semaine',
    day: 'Jour',
    breakfast: 'Petit déjeuner',
    lunch: 'Déjeuner',
    dinner: 'Dîner',
    notes: 'Notes',
    vegetarian: 'Végétarien',
    allergens: 'Allergènes',
    new: 'Nouveau',
    unavailable: 'Indisponible',
    filters: 'Filtres',
    restaurant: 'Restaurant',
    allRestaurants: 'Tous les restaurants',
    campusNorth: 'Campus Nord',
    campusSouth: 'Campus Sud',
    highProtein: 'Riche en protéines',
    days: {
      monday: 'Lundi',
      tuesday: 'Mardi',
      wednesday: 'Mercredi',
      thursday: 'Jeudi',
      friday: 'Vendredi',
      saturday: 'Samedi',
      sunday: 'Dimanche'
    }
  }
};

export function WeeklyMenu({ language, onNavigate, user }: WeeklyMenuProps) {
  const t = translations[language];
  const [selectedRestaurant, setSelectedRestaurant] = useState('all');
  const [filters, setFilters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuData, setMenuData] = useState<ApiWeeklyMenu[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWeeklyMenu();
  }, [selectedRestaurant, filters]);

  const fetchWeeklyMenu = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params: any = {};
      
      if (selectedRestaurant !== 'all') {
        params.restaurant_location = selectedRestaurant === 'north' ? 'Campus Nord' : 'Campus Sud';
      }
      
      if (filters.length > 0) {
        params.tags = filters.join(',');
      }
      
      const data = await menuService.getWeeklyMenu(params);
      setMenuData(data);
    } catch (err) {
      setError(handleApiError(err));
      console.error('Failed to fetch menu:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFilter = (filter: string) => {
    setFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const getDayName = (dateString: string): string => {
    const date = new Date(dateString);
    const dayIndex = date.getDay();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return dayNames[dayIndex];
  };

  const groupMenusByDay = () => {
    const grouped: { [key: string]: { breakfast?: ApiWeeklyMenu; lunch?: ApiWeeklyMenu; dinner?: ApiWeeklyMenu } } = {};
    
    menuData.forEach(menu => {
      const dayKey = menu.day_of_week.toLowerCase();
      if (!grouped[dayKey]) {
        grouped[dayKey] = {};
      }
      grouped[dayKey][menu.meal_type as 'breakfast' | 'lunch' | 'dinner'] = menu;
    });
    
    return grouped;
  };

  const renderMealTags = (tags: string[]) => {
    return (
      <div className="flex flex-wrap gap-1.5 mt-2">
        {tags.includes('vegetarian') && (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
            <Leaf className="w-3 h-3 mr-1" />
            V
          </Badge>
        )}
        {tags.includes('allergens') && (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs">
            <AlertTriangle className="w-3 h-3 mr-1" />
            {language === 'ar' ? 'حساسية' : 'Allergie'}
          </Badge>
        )}
        {tags.includes('new') && (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
            <Sparkles className="w-3 h-3 mr-1" />
            {language === 'ar' ? 'جديد' : 'Nouveau'}
          </Badge>
        )}
        {tags.includes('protein') && (
          <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 text-xs">
            {language === 'ar' ? 'بروتين' : 'Protéine'}
          </Badge>
        )}
        {tags.includes('unavailable') && (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
            <X className="w-3 h-3 mr-1" />
            {language === 'ar' ? 'غير متوفر' : 'Indisponible'}
          </Badge>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      <Header 
        title={t.title} 
        onBack={() => onNavigate('dashboard')}
        language={language}
      />

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
          <p className="text-slate-900 mb-3">{t.filters}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Select value={selectedRestaurant} onValueChange={setSelectedRestaurant}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder={t.restaurant} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allRestaurants}</SelectItem>
                  <SelectItem value="north">{t.campusNorth}</SelectItem>
                  <SelectItem value="south">{t.campusSouth}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => toggleFilter('vegetarian')}
                className={`px-3 py-2 rounded-md text-sm border transition-colors ${
                  filters.includes('vegetarian')
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-green-300'
                }`}
              >
                <Leaf className="w-4 h-4 inline mr-1" />
                {t.vegetarian}
              </button>
              <button
                onClick={() => toggleFilter('protein')}
                className={`px-3 py-2 rounded-md text-sm border transition-colors ${
                  filters.includes('protein')
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                }`}
              >
                {t.highProtein}
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block bg-white rounded-lg border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="text-center py-12 text-slate-500">Loading menu...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-900 text-white">
                  <tr>
                    <th className="px-4 py-3 text-start">{t.day}</th>
                    <th className="px-4 py-3 text-start">{t.breakfast}</th>
                    <th className="px-4 py-3 text-start">{t.lunch}</th>
                    <th className="px-4 py-3 text-start">{t.dinner}</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(groupMenusByDay()).map(([day, meals], index) => (
                    <tr 
                      key={day}
                      className={`border-b border-slate-200 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
                    >
                      <td className="px-4 py-4 text-slate-900">
                        {t.days[day as keyof typeof t.days]}
                      </td>
                      <td className="px-4 py-4">
                        {meals.breakfast ? (
                          <>
                            <p className="text-slate-700">{meals.breakfast.dish_name}</p>
                            {renderMealTags(meals.breakfast.tags || [])}
                          </>
                        ) : (
                          <p className="text-slate-400">{t.unavailable}</p>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {meals.lunch ? (
                          <>
                            <p className="text-slate-700">{meals.lunch.dish_name}</p>
                            {renderMealTags(meals.lunch.tags || [])}
                          </>
                        ) : (
                          <p className="text-slate-400">{t.unavailable}</p>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {meals.dinner ? (
                          <>
                            <p className="text-slate-700">{meals.dinner.dish_name}</p>
                            {renderMealTags(meals.dinner.tags || [])}
                          </>
                        ) : (
                          <p className="text-slate-400">{t.unavailable}</p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {loading ? (
            <div className="text-center py-12 text-slate-500">Loading menu...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">{error}</div>
          ) : (
            Object.entries(groupMenusByDay()).map(([day, meals]) => (
              <div key={day} className="bg-white rounded-lg border border-slate-200 p-4">
                <h3 className="text-blue-900 mb-4">
                  {t.days[day as keyof typeof t.days]}
                </h3>
                
                <div className="space-y-3">
                  <div className="border-b border-slate-100 pb-3">
                    <p className="text-slate-500 text-sm mb-1">{t.breakfast}</p>
                    {meals.breakfast ? (
                      <>
                        <p className="text-slate-900">{meals.breakfast.dish_name}</p>
                        {renderMealTags(meals.breakfast.tags || [])}
                      </>
                    ) : (
                      <p className="text-slate-400">{t.unavailable}</p>
                    )}
                  </div>
                  
                  <div className="border-b border-slate-100 pb-3">
                    <p className="text-slate-500 text-sm mb-1">{t.lunch}</p>
                    {meals.lunch ? (
                      <>
                        <p className="text-slate-900">{meals.lunch.dish_name}</p>
                        {renderMealTags(meals.lunch.tags || [])}
                      </>
                    ) : (
                      <p className="text-slate-400">{t.unavailable}</p>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-slate-500 text-sm mb-1">{t.dinner}</p>
                    {meals.dinner ? (
                      <>
                        <p className="text-slate-900">{meals.dinner.dish_name}</p>
                        {renderMealTags(meals.dinner.tags || [])}
                      </>
                    ) : (
                      <p className="text-slate-400">{t.unavailable}</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
