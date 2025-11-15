import { useState, useEffect } from 'react';
import { User } from '../App';
import { Button } from './ui/button';
import { 
  Calendar, 
  Utensils, 
  Wallet, 
  MessageSquare, 
  UserCircle, 
  LogOut,
  Bell,
  CheckCircle2
} from 'lucide-react';
import { profileService } from '../services/profile.service';
import { reservationService } from '../services/reservation.service';
import { handleApiError } from '../utils/helpers';

type Page = 'login' | 'dashboard' | 'menu' | 'reservation' | 'wallet' | 'feedback' | 'profile';

interface DashboardProps {
  user: User;
  language: 'ar' | 'fr';
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

const translations = {
  ar: {
    greeting: 'مرحبا، الطالب(ة)',
    notification: 'لديك حجز لوجبة الغداء غدًا في المطعم الجامعي - الحرم الشمالي',
    menu: 'قائمة الأسبوع',
    reservation: 'حجز الوجبات',
    wallet: 'المحفظة والدفع',
    feedback: 'التقييم والملاحظات',
    profile: 'الملف الشخصي',
    logout: 'تسجيل الخروج',
    balance: 'الرصيد',
    points: 'النقاط',
    activeReservations: 'الحجوزات النشطة'
  },
  fr: {
    greeting: 'Bienvenue, étudiant(e)',
    notification: 'Vous avez une réservation pour le déjeuner demain au restaurant universitaire - Campus Nord',
    menu: 'Menu de la semaine',
    reservation: 'Réservation de repas',
    wallet: 'Portefeuille et paiement',
    feedback: 'Évaluation et commentaires',
    profile: 'Profil',
    logout: 'Déconnexion',
    balance: 'Solde',
    points: 'Points',
    activeReservations: 'Réservations actives'
  }
};

export function Dashboard({ user, language, onNavigate, onLogout }: DashboardProps) {
  const t = translations[language];
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [activeReservationsCount, setActiveReservationsCount] = useState(0);
  const [upcomingReservation, setUpcomingReservation] = useState<any>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch profile data
      const profile = await profileService.getProfile();
      setProfileData(profile);
      
      // Fetch reservations
      const reservations = await reservationService.getReservations({ status: 'pending' });
      setActiveReservationsCount(reservations.length);
      
      // Get next upcoming reservation
      const upcoming = reservations
        .filter((r: any) => new Date(r.reservation_date) > new Date())
        .sort((a: any, b: any) => new Date(a.reservation_date).getTime() - new Date(b.reservation_date).getTime())[0];
      
      setUpcomingReservation(upcoming);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { icon: Calendar, label: t.menu, page: 'menu' as Page, color: 'bg-blue-50 text-blue-900' },
    { icon: Utensils, label: t.reservation, page: 'reservation' as Page, color: 'bg-green-50 text-green-900' },
    { icon: Wallet, label: t.wallet, page: 'wallet' as Page, color: 'bg-slate-50 text-slate-900' },
    { icon: MessageSquare, label: t.feedback, page: 'feedback' as Page, color: 'bg-blue-50 text-blue-900' },
    { icon: UserCircle, label: t.profile, page: 'profile' as Page, color: 'bg-slate-50 text-slate-900' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-blue-900 text-white px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="mb-1">{t.greeting}</h1>
              <p className="text-blue-100">{user.name}</p>
            </div>
            <Button
              onClick={onLogout}
              variant="ghost"
              className="text-white hover:bg-blue-800"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="bg-blue-800 rounded-lg p-3 text-center">
              <p className="text-blue-200 text-sm mb-1">{t.balance}</p>
              <p className="text-white">
                {loading ? '...' : (profileData?.wallet_balance || user.balance).toFixed(2)} TND
              </p>
            </div>
            <div className="bg-blue-800 rounded-lg p-3 text-center">
              <p className="text-blue-200 text-sm mb-1">{t.points}</p>
              <p className="text-white">
                {loading ? '...' : (profileData?.points || user.points)}
              </p>
            </div>
            <div className="bg-blue-800 rounded-lg p-3 text-center">
              <p className="text-blue-200 text-sm mb-1">{t.activeReservations}</p>
              <p className="text-white">{loading ? '...' : activeReservationsCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Banner */}
      {!loading && upcomingReservation && (
        <div className="max-w-4xl mx-auto px-4 -mt-3">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <Bell className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <p className="text-green-900">
                  {language === 'ar' 
                    ? `لديك حجز لوجبة ${upcomingReservation.meal_type === 'lunch' ? 'الغداء' : 'العشاء'} في ${new Date(upcomingReservation.reservation_date).toLocaleDateString('ar')}` 
                    : `Vous avez une réservation pour le ${upcomingReservation.meal_type === 'lunch' ? 'déjeuner' : 'dîner'} le ${new Date(upcomingReservation.reservation_date).toLocaleDateString('fr')}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Menu */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {menuItems.map((item) => (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              className="bg-white rounded-lg p-6 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all text-start flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-lg ${item.color} flex items-center justify-center flex-shrink-0`}>
                <item.icon className="w-6 h-6" />
              </div>
              <p className="text-slate-900">{item.label}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
