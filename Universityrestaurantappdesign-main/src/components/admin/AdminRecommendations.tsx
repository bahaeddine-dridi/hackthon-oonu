import { useState } from 'react';
import { Admin } from '../../App';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Sparkles, 
  TrendingUp, 
  Users, 
  AlertCircle,
  CheckCircle2,
  ThumbsUp,
  Clock,
  Flame
} from 'lucide-react';

type Page = 'admin-dashboard' | 'admin-menu' | 'admin-students' | 'admin-stats' | 'admin-ai' | 'admin-reviews';

interface AdminRecommendationsProps {
  language: 'ar' | 'fr';
  onNavigate: (page: Page) => void;
  admin: Admin;
}

const translations = {
  ar: {
    title: 'توصيات الذكاء الاصطناعي',
    menuRecommendations: 'توصيات القائمة',
    behaviorInsights: 'رؤى سلوك الطلاب',
    operationalImprovements: 'تحسينات تشغيلية',
    priority: 'الأولوية',
    high: 'عالية',
    medium: 'متوسطة',
    low: 'منخفضة',
    applysuggestion: 'تطبيق الاقتراح',
    basedOnData: 'بناءً على تحليل البيانات',
    recommendation: 'توصية',
    insight: 'رؤية',
    action: 'إجراء مطلوب'
  },
  fr: {
    title: 'Recommandations IA',
    menuRecommendations: 'Recommandations du menu',
    behaviorInsights: 'Aperçu comportement étudiants',
    operationalImprovements: 'Améliorations opérationnelles',
    priority: 'Priorité',
    high: 'Haute',
    medium: 'Moyenne',
    low: 'Basse',
    applySuggestion: 'Appliquer la suggestion',
    basedOnData: 'Basé sur l\'analyse des données',
    recommendation: 'Recommandation',
    insight: 'Aperçu',
    action: 'Action requise'
  }
};

interface Recommendation {
  id: string;
  category: 'menu' | 'behavior' | 'operational';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  icon: any;
  data?: string;
}

const mockRecommendations: Recommendation[] = [
  {
    id: '1',
    category: 'menu',
    title: 'Couscous très apprécié / كسكسي يحظى بتقدير كبير',
    description: 'Les étudiants ont donné une note de 4.8/5 au couscous. Considérez de le servir plus fréquemment. / الطلاب أعطوا تقييم 4.8/5 للكسكسي. فكر في تقديمه بشكل أكثر تكرارًا.',
    priority: 'high',
    icon: ThumbsUp,
    data: '4.8/5 ★ • 450 réservations'
  },
  {
    id: '2',
    category: 'menu',
    title: 'Réduire le sel / تقليل الملح',
    description: '20% des avis mentionnent "trop salé". Réduire le sel dans les recettes. / 20٪ من التقييمات تذكر "مالح جداً". قلل الملح في الوصفات.',
    priority: 'high',
    icon: AlertCircle,
    data: '67 mentions dans les avis'
  },
  {
    id: '3',
    category: 'menu',
    title: 'Plus d\'options végétariennes / المزيد من الخيارات النباتية',
    description: 'Les options végétariennes sont demandées dans 35% des retours. Ajoutez plus de variété. / الخيارات النباتية مطلوبة في 35٪ من الملاحظات. أضف المزيد من التنوع.',
    priority: 'medium',
    icon: Sparkles,
    data: '35% des demandes'
  },
  {
    id: '4',
    category: 'behavior',
    title: 'Heures de pointe / ساعات الذروة',
    description: 'Les réservations pour le déjeuner sont les plus élevées entre 12h00 et 13h30. / حجوزات الغداء هي الأعلى بين 12:00 و 13:30.',
    priority: 'medium',
    icon: Clock,
    data: '420 réservations/jour'
  },
  {
    id: '5',
    category: 'behavior',
    title: 'Campus Nord populaire / الحرم الشمالي شعبي',
    description: 'Le Campus Nord reçoit 45% de toutes les réservations. Considérez d\'augmenter la capacité. / الحرم الشمالي يحصل على 45٪ من جميع الحجوزات. فكر في زيادة السعة.',
    priority: 'high',
    icon: TrendingUp,
    data: '45% du total'
  },
  {
    id: '6',
    category: 'behavior',
    title: 'Préférences par université / التفضيلات حسب الجامعة',
    description: 'Les étudiants de l\'Université de Tunis El Manar préfèrent les plats traditionnels (70%). / طلاب جامعة تونس المنار يفضلون الأطباق التقليدية (70٪).',
    priority: 'low',
    icon: Users,
    data: '70% préférence'
  },
  {
    id: '7',
    category: 'operational',
    title: 'Améliorer la rapidité du service / تحسين سرعة الخدمة',
    description: 'Basé sur les avis "en retard", améliorez la vitesse du service au restaurant Campus Nord. / بناءً على التعليقات "متأخر"، حسّن سرعة الخدمة في مطعم الحرم الشمالي.',
    priority: 'high',
    icon: Flame,
    data: '24 mentions "retard"'
  },
  {
    id: '8',
    category: 'operational',
    title: 'Vérifier le chauffage / فحص التدفئة',
    description: 'Basé sur les retours "froid", vérifiez l\'équipement de chauffage au Restaurant Principal. / بناءً على الملاحظات "بارد"، افحص معدات التدفئة في المطعم الرئيسي.',
    priority: 'high',
    icon: AlertCircle,
    data: '18 mentions "froid"'
  },
  {
    id: '9',
    category: 'operational',
    title: 'Formation du personnel / تدريب الموظفين',
    description: 'La satisfaction globale a augmenté de 15% après la formation du personnel en octobre. Continuez les formations régulières. / زادت الرضا العام بنسبة 15٪ بعد تدريب الموظفين في أكتوبر. استمر في التدريب المنتظم.',
    priority: 'medium',
    icon: CheckCircle2,
    data: '+15% satisfaction'
  }
];

export function AdminRecommendations({ language, onNavigate, admin }: AdminRecommendationsProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [appliedSuggestions, setAppliedSuggestions] = useState<string[]>([]);
  const t = translations[language];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'low':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'menu':
        return { label: t.menuRecommendations, color: 'text-green-600' };
      case 'behavior':
        return { label: t.behaviorInsights, color: 'text-blue-600' };
      case 'operational':
        return { label: t.operationalImprovements, color: 'text-orange-600' };
      default:
        return { label: '', color: '' };
    }
  };

  const handleApplySuggestion = (id: string) => {
    setAppliedSuggestions(prev => [...prev, id]);
  };

  const handleLogout = () => {
    // This should be passed from parent
  };

  const groupedRecommendations = {
    menu: mockRecommendations.filter(r => r.category === 'menu'),
    behavior: mockRecommendations.filter(r => r.category === 'behavior'),
    operational: mockRecommendations.filter(r => r.category === 'operational')
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar 
        currentPage="admin-ai" 
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
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-slate-900">{t.title}</h1>
                <p className="text-slate-600 text-sm">{t.basedOnData}</p>
              </div>
            </div>

            {/* Menu Recommendations */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <ThumbsUp className="w-5 h-5 text-green-600" />
                <h2 className="text-slate-900">{t.menuRecommendations}</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {groupedRecommendations.menu.map((rec) => (
                  <div key={rec.id} className="bg-white rounded-lg border border-slate-200 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <rec.icon className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-slate-900 mb-1">{rec.title}</h3>
                          <p className="text-slate-600 text-sm mb-2">{rec.description}</p>
                          {rec.data && (
                            <p className="text-blue-600 text-sm">{rec.data}</p>
                          )}
                        </div>
                      </div>
                      <Badge className={`${getPriorityColor(rec.priority)} text-xs`}>
                        {t[rec.priority as keyof typeof t]}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleApplySuggestion(rec.id)}
                      disabled={appliedSuggestions.includes(rec.id)}
                      className={`w-full ${appliedSuggestions.includes(rec.id) ? 'bg-green-600' : 'bg-blue-900 hover:bg-blue-800'}`}
                    >
                      {appliedSuggestions.includes(rec.id) ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          {language === 'ar' ? 'تم التطبيق' : 'Appliqué'}
                        </>
                      ) : (
                        t.applySuggestion || t.applysuggestion
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Behavior Insights */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-blue-600" />
                <h2 className="text-slate-900">{t.behaviorInsights}</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {groupedRecommendations.behavior.map((rec) => (
                  <div key={rec.id} className="bg-white rounded-lg border border-slate-200 p-6">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <rec.icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="text-slate-900">{rec.title}</h3>
                          <Badge className={`${getPriorityColor(rec.priority)} text-xs ml-2`}>
                            {t[rec.priority as keyof typeof t]}
                          </Badge>
                        </div>
                        <p className="text-slate-600 text-sm mb-2">{rec.description}</p>
                        {rec.data && (
                          <p className="text-blue-600 text-sm">{rec.data}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Operational Improvements */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <h2 className="text-slate-900">{t.operationalImprovements}</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {groupedRecommendations.operational.map((rec) => (
                  <div key={rec.id} className="bg-white rounded-lg border border-slate-200 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <rec.icon className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-slate-900 mb-1">{rec.title}</h3>
                          <p className="text-slate-600 text-sm mb-2">{rec.description}</p>
                          {rec.data && (
                            <p className="text-orange-600 text-sm">{rec.data}</p>
                          )}
                        </div>
                      </div>
                      <Badge className={`${getPriorityColor(rec.priority)} text-xs`}>
                        {t[rec.priority as keyof typeof t]}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleApplySuggestion(rec.id)}
                      disabled={appliedSuggestions.includes(rec.id)}
                      className={`w-full ${appliedSuggestions.includes(rec.id) ? 'bg-green-600' : 'bg-blue-900 hover:bg-blue-800'}`}
                    >
                      {appliedSuggestions.includes(rec.id) ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          {language === 'ar' ? 'تم التطبيق' : 'Appliqué'}
                        </>
                      ) : (
                        t.applySuggestion || t.applysuggestion
                      )}
                    </Button>
                  </div>
                ))}
              </div>
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
