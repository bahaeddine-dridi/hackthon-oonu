import { useState } from 'react';
import { Admin } from '../../App';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, TrendingUp, DollarSign, Users, Star } from 'lucide-react';

type Page = 'admin-dashboard' | 'admin-menu' | 'admin-students' | 'admin-stats' | 'admin-ai' | 'admin-reviews';

interface AdminStatisticsProps {
  language: 'ar' | 'fr';
  onNavigate: (page: Page) => void;
  admin: Admin;
}

const translations = {
  ar: {
    title: 'الإحصائيات والتقارير',
    dateRange: 'الفترة الزمنية',
    thisWeek: 'هذا الأسبوع',
    thisMonth: 'هذا الشهر',
    custom: 'تخصيص',
    export: 'تصدير التقرير',
    totalRevenue: 'إجمالي الإيرادات',
    mealsServed: 'الوجبات المقدمة',
    avgRating: 'متوسط التقييم',
    activeStudents: 'الطلاب النشطون',
    reservationsOverTime: 'الحجوزات عبر الزمن',
    popularMeals: 'الوجبات الأكثر شعبية',
    mealDistribution: 'توزيع الوجبات',
    revenueByLocation: 'الإيرادات حسب الموقع',
    ratingTrend: 'اتجاه التقييمات',
    breakfast: 'فطور',
    lunch: 'غداء',
    dinner: 'عشاء',
    campusNorth: 'الحرم الشمالي',
    campusSouth: 'الحرم الجنوبي',
    mainRestaurant: 'المطعم الرئيسي'
  },
  fr: {
    title: 'Statistiques et rapports',
    dateRange: 'Période',
    thisWeek: 'Cette semaine',
    thisMonth: 'Ce mois',
    custom: 'Personnalisé',
    export: 'Exporter le rapport',
    totalRevenue: 'Revenu total',
    mealsServed: 'Repas servis',
    avgRating: 'Note moyenne',
    activeStudents: 'Étudiants actifs',
    reservationsOverTime: 'Réservations dans le temps',
    popularMeals: 'Repas populaires',
    mealDistribution: 'Distribution des repas',
    revenueByLocation: 'Revenus par emplacement',
    ratingTrend: 'Tendance des notes',
    breakfast: 'Petit déjeuner',
    lunch: 'Déjeuner',
    dinner: 'Dîner',
    campusNorth: 'Campus Nord',
    campusSouth: 'Campus Sud',
    mainRestaurant: 'Restaurant Principal'
  }
};

// Mock data for charts
const reservationsData = [
  { date: 'Lun', reservations: 320 },
  { date: 'Mar', reservations: 340 },
  { date: 'Mer', reservations: 380 },
  { date: 'Jeu', reservations: 360 },
  { date: 'Ven', reservations: 420 },
  { date: 'Sam', reservations: 180 },
  { date: 'Dim', reservations: 120 }
];

const popularMealsData = [
  { name: 'Couscous', value: 450 },
  { name: 'Poulet rôti', value: 380 },
  { name: 'Poisson grillé', value: 320 },
  { name: 'Pâtes', value: 280 },
  { name: 'Pizza', value: 240 }
];

const mealDistributionData = [
  { name: 'Petit déjeuner', value: 35 },
  { name: 'Déjeuner', value: 45 },
  { name: 'Dîner', value: 20 }
];

const revenueByLocationData = [
  { location: 'Campus Nord', revenue: 8500 },
  { location: 'Campus Sud', revenue: 7200 },
  { location: 'Restaurant Principal', revenue: 6800 }
];

const ratingTrendData = [
  { month: 'Sep', rating: 4.2 },
  { month: 'Oct', rating: 4.4 },
  { month: 'Nov', rating: 4.6 }
];

const COLORS = ['#1e3a8a', '#16a34a', '#0891b2', '#f59e0b', '#ef4444'];

export function AdminStatistics({ language, onNavigate, admin }: AdminStatisticsProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dateRange, setDateRange] = useState('thisWeek');
  const t = translations[language];

  const stats = [
    { icon: DollarSign, label: t.totalRevenue, value: '22,500 TND', color: 'bg-green-100 text-green-900' },
    { icon: TrendingUp, label: t.mealsServed, value: '1,670', color: 'bg-blue-100 text-blue-900' },
    { icon: Star, label: t.avgRating, value: '4.6', color: 'bg-yellow-100 text-yellow-900' },
    { icon: Users, label: t.activeStudents, value: '1,247', color: 'bg-slate-100 text-slate-900' }
  ];

  const handleLogout = () => {
    // This should be passed from parent
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar 
        currentPage="admin-stats" 
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h1 className="text-slate-900">{t.title}</h1>
              
              <div className="flex gap-2">
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-48 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="thisWeek">{t.thisWeek}</SelectItem>
                    <SelectItem value="thisMonth">{t.thisMonth}</SelectItem>
                    <SelectItem value="custom">{t.custom}</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  {t.export}
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Reservations Over Time */}
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h3 className="text-slate-900 mb-4">{t.reservationsOverTime}</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={reservationsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="reservations" stroke="#1e3a8a" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Popular Meals */}
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h3 className="text-slate-900 mb-4">{t.popularMeals}</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={popularMealsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#1e3a8a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Meal Distribution */}
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h3 className="text-slate-900 mb-4">{t.mealDistribution}</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={mealDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {mealDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Revenue by Location */}
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h3 className="text-slate-900 mb-4">{t.revenueByLocation}</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={revenueByLocationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="location" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#16a34a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Rating Trend */}
              <div className="bg-white rounded-lg border border-slate-200 p-6 lg:col-span-2">
                <h3 className="text-slate-900 mb-4">{t.ratingTrend}</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={ratingTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="rating" stroke="#f59e0b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
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
