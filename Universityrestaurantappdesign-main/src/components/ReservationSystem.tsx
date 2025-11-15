import { useState, useEffect } from 'react';
import { User } from '../App';
import { Header } from './Header';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle2, Calendar, MapPin, Utensils, Hash, X } from 'lucide-react';
import { reservationService, Reservation } from '../services/reservation.service';
import { menuService } from '../services/menu.service';
import { handleApiError } from '../utils/helpers';

type Page = 'login' | 'dashboard' | 'menu' | 'reservation' | 'wallet' | 'feedback' | 'profile';

interface ReservationSystemProps {
  language: 'ar' | 'fr';
  onNavigate: (page: Page) => void;
  user: User;
}

const translations = {
  ar: {
    title: 'حجز الوجبات',
    selectRestaurant: 'اختر المطعم',
    selectMeal: 'نوع الوجبة',
    selectDay: 'اختر اليوم',
    breakfast: 'فطور',
    lunch: 'غداء',
    dinner: 'عشاء',
    confirm: 'تأكيد الحجز',
    cancel: 'إلغاء',
    newReservation: 'حجز جديد',
    confirmationTitle: 'تم تأكيد الحجز',
    reservationCode: 'رمز الحجز',
    status: 'الحالة',
    confirmed: 'مؤكد',
    mealType: 'نوع الوجبة',
    date: 'التاريخ',
    restaurant: 'المطعم',
    price: 'السعر',
    showQR: 'اعرض هذا الرمز عند الدخول',
    campusNorth: 'المطعم الجامعي - الحرم الشمالي',
    campusSouth: 'المطعم الجامعي - الحرم الجنوبي',
    mainRestaurant: 'المطعم الرئيسي',
    days: {
      monday: 'الإثنين',
      tuesday: 'الثلاثاء',
      wednesday: 'الأربعاء',
      thursday: 'الخميس',
      friday: 'الجمعة',
      saturday: 'السبت'
    }
  },
  fr: {
    title: 'Réservation de repas',
    selectRestaurant: 'Choisir le restaurant',
    selectMeal: 'Type de repas',
    selectDay: 'Choisir le jour',
    breakfast: 'Petit déjeuner',
    lunch: 'Déjeuner',
    dinner: 'Dîner',
    confirm: 'Confirmer la réservation',
    cancel: 'Annuler',
    newReservation: 'Nouvelle réservation',
    confirmationTitle: 'Réservation confirmée',
    reservationCode: 'Code de réservation',
    status: 'Statut',
    confirmed: 'Confirmé',
    mealType: 'Type de repas',
    date: 'Date',
    restaurant: 'Restaurant',
    price: 'Prix',
    showQR: 'Montrez ce code à l\'entrée',
    campusNorth: 'Restaurant Universitaire - Campus Nord',
    campusSouth: 'Restaurant Universitaire - Campus Sud',
    mainRestaurant: 'Restaurant Principal',
    days: {
      monday: 'Lundi',
      tuesday: 'Mardi',
      wednesday: 'Mercredi',
      thursday: 'Jeudi',
      friday: 'Vendredi',
      saturday: 'Samedi'
    }
  }
};

export function ReservationSystem({ language, onNavigate, user }: ReservationSystemProps) {
  const t = translations[language];
  const [step, setStep] = useState<'form' | 'confirmation'>('form');
  const [restaurant, setRestaurant] = useState('');
  const [mealType, setMealType] = useState('');
  const [day, setDay] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [reservationData, setReservationData] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [availableMenus, setAvailableMenus] = useState<any[]>([]);

  useEffect(() => {
    fetchAvailableMenus();
  }, []);

  const fetchAvailableMenus = async () => {
    try {
      const menus = await menuService.getWeeklyMenu({ available: true });
      setAvailableMenus(menus);
    } catch (err) {
      console.error('Failed to fetch menus:', handleApiError(err));
    }
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      setError('');

      // Calculate the actual date based on selected day
      const today = new Date();
      const dayIndex = Object.keys(t.days).indexOf(day);
      const daysUntilTarget = (dayIndex - today.getDay() + 7) % 7 || 7;
      const reservationDate = new Date(today);
      reservationDate.setDate(today.getDate() + daysUntilTarget);

      const reservation = await reservationService.createReservation({
        meal_type: mealType,
        reservation_date: reservationDate.toISOString().split('T')[0],
        restaurant_location: restaurant === 'north' ? t.campusNorth : restaurant === 'south' ? t.campusSouth : t.mainRestaurant
      });

      setReservationData(reservation);
      setStep('confirmation');
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleNewReservation = () => {
    setStep('form');
    setRestaurant('');
    setMealType('');
    setDay('');
    setSelectedDate('');
    setReservationData(null);
    setError('');
  };

  const handleCancelReservation = async () => {
    if (!reservationData) return;
    
    try {
      setLoading(true);
      await reservationService.cancelReservation(reservationData.id);
      handleNewReservation();
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const getMealPrice = () => {
    if (mealType === 'breakfast') return '0.50';
    if (mealType === 'lunch') return '1.20';
    if (mealType === 'dinner') return '1.00';
    return '0.00';
  };

  if (step === 'confirmation') {
    return (
      <div className="min-h-screen bg-slate-50 pb-8">
        <Header 
          title={t.title} 
          onBack={() => onNavigate('dashboard')}
          language={language}
        />

        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            {/* Success Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-green-900 mb-2">{t.confirmationTitle}</h2>
              <p className="text-slate-600">{t.showQR}</p>
            </div>

            {/* QR Code */}
            <div className="flex justify-center mb-6 p-6 bg-slate-50 rounded-lg">
              {reservationData?.qr_code && (
                <QRCodeSVG 
                  value={reservationData.qr_code} 
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              )}
            </div>

            {/* Reservation Details */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Hash className="w-5 h-5 text-slate-600" />
                <div className="flex-1">
                  <p className="text-slate-500 text-sm">{t.reservationCode}</p>
                  <p className="text-slate-900">{reservationData?.qr_code}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <div className="flex-1">
                  <p className="text-slate-500 text-sm">{t.status}</p>
                  <p className="text-green-900">{reservationData?.status === 'pending' ? t.confirmed : reservationData?.status}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Utensils className="w-5 h-5 text-slate-600" />
                <div className="flex-1">
                  <p className="text-slate-500 text-sm">{t.mealType}</p>
                  <p className="text-slate-900">
                    {reservationData?.meal_type === 'breakfast' && t.breakfast}
                    {reservationData?.meal_type === 'lunch' && t.lunch}
                    {reservationData?.meal_type === 'dinner' && t.dinner}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Calendar className="w-5 h-5 text-slate-600" />
                <div className="flex-1">
                  <p className="text-slate-500 text-sm">{t.date}</p>
                  <p className="text-slate-900">
                    {reservationData?.reservation_date && new Date(reservationData.reservation_date).toLocaleDateString(language === 'ar' ? 'ar' : 'fr')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <MapPin className="w-5 h-5 text-slate-600" />
                <div className="flex-1">
                  <p className="text-slate-500 text-sm">{t.restaurant}</p>
                  <p className="text-slate-900">
                    {reservationData?.restaurant_location}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex-1">
                  <p className="text-blue-600 text-sm">{t.price}</p>
                  <p className="text-blue-900">{reservationData?.price} TND</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleCancelReservation}
                variant="outline"
                className="flex-1"
                disabled={loading}
              >
                <X className="w-4 h-4 mr-2" />
                {t.cancel}
              </Button>
              <Button
                onClick={handleNewReservation}
                variant="outline"
                className="flex-1"
              >
                {t.newReservation}
              </Button>
              <Button
                onClick={() => onNavigate('dashboard')}
                className="flex-1 bg-blue-900 hover:bg-blue-800"
              >
                {language === 'ar' ? 'العودة للرئيسية' : 'Retour'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      <Header 
        title={t.title} 
        onBack={() => onNavigate('dashboard')}
        language={language}
      />

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-md border border-red-200 mb-4">
              {error}
            </div>
          )}

          <div className="space-y-5">
            {/* Restaurant Selection */}
            <div className="space-y-2">
              <Label className="text-slate-700">{t.selectRestaurant}</Label>
              <Select value={restaurant} onValueChange={setRestaurant}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder={t.selectRestaurant} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="north">{t.campusNorth}</SelectItem>
                  <SelectItem value="south">{t.campusSouth}</SelectItem>
                  <SelectItem value="main">{t.mainRestaurant}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Meal Type Selection */}
            <div className="space-y-2">
              <Label className="text-slate-700">{t.selectMeal}</Label>
              <Select value={mealType} onValueChange={setMealType}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder={t.selectMeal} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">{t.breakfast} - 0.50 TND</SelectItem>
                  <SelectItem value="lunch">{t.lunch} - 1.20 TND</SelectItem>
                  <SelectItem value="dinner">{t.dinner} - 1.00 TND</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Day Selection */}
            <div className="space-y-2">
              <Label className="text-slate-700">{t.selectDay}</Label>
              <Select value={day} onValueChange={setDay}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder={t.selectDay} />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(t.days).map(([key, value]) => (
                    <SelectItem key={key} value={key}>{value}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Confirm Button */}
            <Button
              onClick={handleConfirm}
              disabled={!restaurant || !mealType || !day || loading}
              className="w-full bg-blue-900 hover:bg-blue-800 disabled:bg-slate-300"
            >
              {loading ? (language === 'ar' ? 'جاري الحجز...' : 'Réservation...') : t.confirm}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
