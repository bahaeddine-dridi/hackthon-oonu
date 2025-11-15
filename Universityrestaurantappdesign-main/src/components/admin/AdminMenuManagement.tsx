import { useState } from 'react';
import { Admin } from '../../App';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Save, RotateCcw, Upload } from 'lucide-react';

type Page = 'admin-dashboard' | 'admin-menu' | 'admin-students' | 'admin-stats' | 'admin-ai' | 'admin-reviews';

interface AdminMenuManagementProps {
  language: 'ar' | 'fr';
  onNavigate: (page: Page) => void;
  admin: Admin;
}

const translations = {
  ar: {
    title: 'إدارة القائمة الأسبوعية',
    day: 'اليوم',
    breakfast: 'فطور',
    lunch: 'غداء',
    dinner: 'عشاء',
    mealName: 'اسم الوجبة',
    price: 'السعر (TND)',
    tags: 'العلامات',
    vegetarian: 'نباتي',
    allergens: 'مسببات حساسية',
    protein: 'غني بالبروتين',
    new: 'جديد',
    unavailable: 'غير متوفر',
    save: 'حفظ التغييرات',
    publish: 'نشر القائمة',
    reset: 'إعادة تعيين',
    import: 'استيراد من الأسبوع السابق',
    saved: 'تم الحفظ بنجاح!',
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
    title: 'Gestion du menu hebdomadaire',
    day: 'Jour',
    breakfast: 'Petit déjeuner',
    lunch: 'Déjeuner',
    dinner: 'Dîner',
    mealName: 'Nom du repas',
    price: 'Prix (TND)',
    tags: 'Tags',
    vegetarian: 'Végétarien',
    allergens: 'Allergènes',
    protein: 'Riche en protéines',
    new: 'Nouveau',
    unavailable: 'Indisponible',
    save: 'Enregistrer les modifications',
    publish: 'Publier le menu',
    reset: 'Réinitialiser',
    import: 'Importer de la semaine dernière',
    saved: 'Enregistré avec succès!',
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

interface MealData {
  name: string;
  price: string;
  tags: string[];
}

interface DayMenuData {
  breakfast: MealData;
  lunch: MealData;
  dinner: MealData;
}

const initialMenuData: Record<string, DayMenuData> = {
  monday: {
    breakfast: { name: 'خبز + مربى + حليب / Pain + confiture + lait', price: '0.50', tags: [] },
    lunch: { name: 'كسكسي بالخضار واللحم / Couscous légumes et viande', price: '1.20', tags: ['protein'] },
    dinner: { name: 'حساء + عجة / Soupe + omelette', price: '1.00', tags: ['vegetarian'] }
  },
  tuesday: {
    breakfast: { name: 'خبز + زبدة + قهوة / Pain + beurre + café', price: '0.50', tags: [] },
    lunch: { name: 'مكرونة بالصلصة الحمراء / Pâtes sauce tomate', price: '1.20', tags: ['vegetarian'] },
    dinner: { name: 'سلطة + جبن / Salade + fromage', price: '1.00', tags: ['vegetarian', 'allergens'] }
  },
  wednesday: {
    breakfast: { name: 'خبز + عسل + شاي / Pain + miel + thé', price: '0.50', tags: ['new'] },
    lunch: { name: 'دجاج بالفرن + أرز / Poulet rôti + riz', price: '1.20', tags: ['protein'] },
    dinner: { name: 'حساء العدس / Soupe de lentilles', price: '1.00', tags: ['vegetarian', 'protein'] }
  },
  thursday: {
    breakfast: { name: 'خبز + زيتون + حليب / Pain + olives + lait', price: '0.50', tags: [] },
    lunch: { name: 'سمك مشوي + بطاطا / Poisson grillé + pommes de terre', price: '1.20', tags: ['protein', 'allergens'] },
    dinner: { name: 'طاجين بالخضار / Tajine légumes', price: '1.00', tags: ['vegetarian'] }
  },
  friday: {
    breakfast: { name: 'كرواسون + عصير / Croissant + jus', price: '0.50', tags: ['new'] },
    lunch: { name: 'لحم بالبرقوق / Viande aux pruneaux', price: '1.20', tags: ['protein'] },
    dinner: { name: 'بيتزا مارغريتا / Pizza margherita', price: '1.00', tags: ['vegetarian', 'allergens'] }
  },
  saturday: {
    breakfast: { name: 'خبز + جبن + قهوة / Pain + fromage + café', price: '0.50', tags: ['allergens'] },
    lunch: { name: 'برانية + سلطة / Brik + salade', price: '1.20', tags: [] },
    dinner: { name: 'غير متوفر / Non disponible', price: '0.00', tags: ['unavailable'] }
  },
  sunday: {
    breakfast: { name: 'غير متوفر / Non disponible', price: '0.00', tags: ['unavailable'] },
    lunch: { name: 'غير متوفر / Non disponible', price: '0.00', tags: ['unavailable'] },
    dinner: { name: 'غير متوفر / Non disponible', price: '0.00', tags: ['unavailable'] }
  }
};

export function AdminMenuManagement({ language, onNavigate, admin }: AdminMenuManagementProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuData, setMenuData] = useState(initialMenuData);
  const [showSaved, setShowSaved] = useState(false);
  const t = translations[language];

  const handleMealChange = (day: string, mealType: 'breakfast' | 'lunch' | 'dinner', field: 'name' | 'price', value: string) => {
    setMenuData(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: {
          ...prev[day][mealType],
          [field]: value
        }
      }
    }));
  };

  const handleTagToggle = (day: string, mealType: 'breakfast' | 'lunch' | 'dinner', tag: string) => {
    setMenuData(prev => {
      const currentTags = prev[day][mealType].tags;
      const newTags = currentTags.includes(tag)
        ? currentTags.filter(t => t !== tag)
        : [...currentTags, tag];
      
      return {
        ...prev,
        [day]: {
          ...prev[day],
          [mealType]: {
            ...prev[day][mealType],
            tags: newTags
          }
        }
      };
    });
  };

  const handleSave = () => {
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  const handleReset = () => {
    setMenuData(initialMenuData);
  };

  const renderMealEditor = (day: string, mealType: 'breakfast' | 'lunch' | 'dinner', mealLabel: string) => {
    const meal = menuData[day][mealType];
    
    return (
      <div className="border border-slate-200 rounded-lg p-4 bg-white">
        <h4 className="text-slate-900 mb-3">{mealLabel}</h4>
        <div className="space-y-3">
          <div>
            <Label className="text-slate-700 text-sm">{t.mealName}</Label>
            <Input
              value={meal.name}
              onChange={(e) => handleMealChange(day, mealType, 'name', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-slate-700 text-sm">{t.price}</Label>
            <Input
              type="number"
              step="0.01"
              value={meal.price}
              onChange={(e) => handleMealChange(day, mealType, 'price', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-slate-700 text-sm mb-2 block">{t.tags}</Label>
            <div className="space-y-2">
              {['vegetarian', 'allergens', 'protein', 'new', 'unavailable'].map((tag) => (
                <div key={tag} className="flex items-center gap-2">
                  <Checkbox
                    checked={meal.tags.includes(tag)}
                    onCheckedChange={() => handleTagToggle(day, mealType, tag)}
                  />
                  <span className="text-slate-700 text-sm">{t[tag as keyof typeof t]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleLogout = () => {
    // This should be passed from parent
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar 
        currentPage="admin-menu" 
        onNavigate={onNavigate}
        language={language}
        isOpen={sidebarOpen}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader 
          admin={admin}
          language={language}
          onLogout={handleLogout}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-slate-900">{t.title}</h1>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  {t.reset}
                </Button>
                <Button
                  onClick={handleSave}
                  className="gap-2 bg-blue-900 hover:bg-blue-800"
                >
                  <Save className="w-4 h-4" />
                  {t.publish}
                </Button>
              </div>
            </div>

            {showSaved && (
              <div className="bg-green-50 border border-green-200 text-green-900 px-4 py-3 rounded-lg mb-4">
                {t.saved}
              </div>
            )}

            {/* Menu Editor */}
            <div className="space-y-6">
              {Object.keys(initialMenuData).map((day) => (
                <div key={day} className="bg-slate-100 rounded-lg p-6">
                  <h3 className="text-slate-900 mb-4">
                    {t.days[day as keyof typeof t.days]}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {renderMealEditor(day, 'breakfast', t.breakfast)}
                    {renderMealEditor(day, 'lunch', t.lunch)}
                    {renderMealEditor(day, 'dinner', t.dinner)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
