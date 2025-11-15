import { useState } from 'react';
import { Admin } from '../../App';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  MessageSquare, 
  Star,
  TrendingUp
} from 'lucide-react';

type Page = 'admin-dashboard' | 'admin-menu' | 'admin-students' | 'admin-stats' | 'admin-ai' | 'admin-reviews';

interface AdminDashboardProps {
  admin: Admin;
  language: 'ar' | 'fr';
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

const translations = {
  ar: {
    title: 'لوحة التحكم',
    totalStudents: 'إجمالي الطلاب',
    todayReservations: 'حجوزات اليوم',
    weeklyRevenue: 'الإيرادات الأسبوعية',
    activeFeedback: 'التقييمات النشطة',
    averageRating: 'متوسط التقييم',
    popularMeal: 'الوجبة الأكثر شعبية',
    quickActions: 'إجراءات سريعة',
    manageMenu: 'إدارة القائمة الأسبوعية',
    viewStudents: 'عرض الطلاب',
    viewStats: 'عرض الإحصائيات',
    viewAI: 'التوصيات الذكية',
    recentActivity: 'النشاط الأخير',
    newReservation: 'حجز جديد',
    newFeedback: 'تقييم جديد',
    menuUpdate: 'تحديث القائمة',
    couscous: 'كسكسي بالخضار واللحم'
  },
  fr: {
    title: 'Tableau de bord',
    totalStudents: 'Total étudiants',
    todayReservations: 'Réservations aujourd\'hui',
    weeklyRevenue: 'Revenus hebdomadaires',
    activeFeedback: 'Évaluations actives',
    averageRating: 'Note moyenne',
    popularMeal: 'Repas populaire',
    quickActions: 'Actions rapides',
    manageMenu: 'Gérer le menu hebdomadaire',
    viewStudents: 'Voir les étudiants',
    viewStats: 'Voir les statistiques',
    viewAI: 'Recommandations IA',
    recentActivity: 'Activité récente',
    newReservation: 'Nouvelle réservation',
    newFeedback: 'Nouvelle évaluation',
    menuUpdate: 'Mise à jour du menu',
    couscous: 'Couscous légumes et viande'
  }
};

export function AdminDashboard({ admin, language, onNavigate, onLogout }: AdminDashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const t = translations[language];

  const stats = [
    { icon: Users, label: t.totalStudents, value: '1,247', color: 'bg-blue-100 text-blue-900' },
    { icon: Calendar, label: t.todayReservations, value: '342', color: 'bg-green-100 text-green-900' },
    { icon: DollarSign, label: t.weeklyRevenue, value: '2,456 TND', color: 'bg-slate-100 text-slate-900' },
    { icon: MessageSquare, label: t.activeFeedback, value: '67', color: 'bg-orange-100 text-orange-900' },
    { icon: Star, label: t.averageRating, value: '4.6', color: 'bg-yellow-100 text-yellow-900' },
    { icon: TrendingUp, label: t.popularMeal, value: t.couscous, color: 'bg-green-100 text-green-900' },
  ];

  const quickActions = [
    { label: t.manageMenu, page: 'admin-menu' as Page, color: 'bg-blue-900' },
    { label: t.viewStudents, page: 'admin-students' as Page, color: 'bg-green-600' },
    { label: t.viewStats, page: 'admin-stats' as Page, color: 'bg-slate-700' },
    { label: t.viewAI, page: 'admin-ai' as Page, color: 'bg-blue-600' },
  ];

  const recentActivities = [
    { type: t.newReservation, user: 'أحمد محمد / Ahmed Mohamed', time: '5 min', icon: Calendar },
    { type: t.newFeedback, user: 'فاطمة علي / Fatima Ali', time: '12 min', icon: MessageSquare },
    { type: t.newReservation, user: 'محمد حسن / Mohamed Hassan', time: '18 min', icon: Calendar },
    { type: t.menuUpdate, user: 'Admin', time: '1 hr', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar 
        currentPage="admin-dashboard" 
        onNavigate={onNavigate}
        language={language}
        isOpen={sidebarOpen}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader 
          admin={admin}
          language={language}
          onLogout={onLogout}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-slate-900 mb-6">{t.title}</h1>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg border border-slate-200 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-slate-600 text-sm mb-2">{stat.label}</p>
                      <p className="text-slate-900">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mb-6">
              <h3 className="text-slate-900 mb-4">{t.quickActions}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => onNavigate(action.page)}
                    className={`${action.color} text-white rounded-lg p-6 hover:opacity-90 transition-opacity text-start`}
                  >
                    <p>{action.label}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="text-slate-900 mb-4">{t.recentActivity}</h3>
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <activity.icon className="w-5 h-5 text-blue-900" />
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-900">{activity.type}</p>
                      <p className="text-slate-500 text-sm">{activity.user}</p>
                    </div>
                    <p className="text-slate-500 text-sm">{activity.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
