import { useState } from 'react';
import { User } from '../App';
import { Header } from './Header';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { UserCircle, Mail, Building2, Award, History, Edit2 } from 'lucide-react';

type Page = 'login' | 'dashboard' | 'menu' | 'reservation' | 'wallet' | 'feedback' | 'profile';

interface ProfileProps {
  language: 'ar' | 'fr';
  onNavigate: (page: Page) => void;
  user: User;
  onUpdateUser: (user: User) => void;
}

const translations = {
  ar: {
    title: 'الملف الشخصي',
    name: 'الاسم الكامل',
    email: 'البريد الإلكتروني',
    university: 'الجامعة',
    studentId: 'رقم الطالب',
    points: 'النقاط المكتسبة',
    edit: 'تعديل الملف الشخصي',
    save: 'حفظ التغييرات',
    cancel: 'إلغاء',
    reservationHistory: 'سجل الحجوزات',
    paymentHistory: 'سجل المدفوعات',
    totalReservations: 'إجمالي الحجوزات',
    lastReservation: 'آخر حجز',
    memberSince: 'عضو منذ',
    accountInfo: 'معلومات الحساب',
    statistics: 'الإحصائيات'
  },
  fr: {
    title: 'Profil',
    name: 'Nom complet',
    email: 'Email',
    university: 'Université',
    studentId: 'Numéro étudiant',
    points: 'Points gagnés',
    edit: 'Modifier le profil',
    save: 'Enregistrer les modifications',
    cancel: 'Annuler',
    reservationHistory: 'Historique des réservations',
    paymentHistory: 'Historique des paiements',
    totalReservations: 'Total réservations',
    lastReservation: 'Dernière réservation',
    memberSince: 'Membre depuis',
    accountInfo: 'Informations du compte',
    statistics: 'Statistiques'
  }
};

const mockReservationHistory = [
  { id: '1', date: '2024-11-13', meal: 'غداء / Déjeuner', restaurant: 'الحرم الشمالي / Campus Nord', status: 'confirmed' },
  { id: '2', date: '2024-11-12', meal: 'فطور / Petit déjeuner', restaurant: 'الحرم الجنوبي / Campus Sud', status: 'completed' },
  { id: '3', date: '2024-11-11', meal: 'غداء / Déjeuner', restaurant: 'الحرم الشمالي / Campus Nord', status: 'completed' },
  { id: '4', date: '2024-11-10', meal: 'عشاء / Dîner', restaurant: 'المطعم الرئيسي / Restaurant Principal', status: 'completed' }
];

export function Profile({ language, onNavigate, user, onUpdateUser }: ProfileProps) {
  const t = translations[language];
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    university: user.university
  });

  const handleSave = () => {
    onUpdateUser({
      ...user,
      name: formData.name,
      email: formData.email,
      university: formData.university
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      university: user.university
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      <Header 
        title={t.title} 
        onBack={() => onNavigate('dashboard')}
        language={language}
      />

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Header */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <UserCircle className="w-12 h-12 text-blue-900" />
              </div>
              <div>
                <h2 className="text-slate-900 mb-1">{user.name}</h2>
                <p className="text-slate-600">{user.university}</p>
              </div>
            </div>
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="gap-2"
              >
                <Edit2 className="w-4 h-4" />
                {t.edit}
              </Button>
            )}
          </div>

          {/* Account Info */}
          <div className="space-y-4">
            <h3 className="text-slate-900">{t.accountInfo}</h3>
            
            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-700">{t.name}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700">{t.email}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="university" className="text-slate-700">{t.university}</Label>
                  <Input
                    id="university"
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="flex-1"
                  >
                    {t.cancel}
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="flex-1 bg-blue-900 hover:bg-blue-800"
                  >
                    {t.save}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <UserCircle className="w-5 h-5 text-slate-600" />
                  <div>
                    <p className="text-slate-500 text-sm">{t.studentId}</p>
                    <p className="text-slate-900">{user.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Mail className="w-5 h-5 text-slate-600" />
                  <div>
                    <p className="text-slate-500 text-sm">{t.email}</p>
                    <p className="text-slate-900">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Building2 className="w-5 h-5 text-slate-600" />
                  <div>
                    <p className="text-slate-500 text-sm">{t.university}</p>
                    <p className="text-slate-900">{user.university}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <Award className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-green-600 text-sm">{t.points}</p>
                    <p className="text-green-900">{user.points}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-slate-900 mb-4">{t.statistics}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <p className="text-blue-600 text-sm mb-1">{t.totalReservations}</p>
              <p className="text-blue-900">24</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg text-center">
              <p className="text-slate-600 text-sm mb-1">{t.lastReservation}</p>
              <p className="text-slate-900">13/11/2024</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg text-center">
              <p className="text-slate-600 text-sm mb-1">{t.memberSince}</p>
              <p className="text-slate-900">09/2024</p>
            </div>
          </div>
        </div>

        {/* Reservation History */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-5 h-5 text-slate-600" />
            <h3 className="text-slate-900">{t.reservationHistory}</h3>
          </div>
          <div className="space-y-3">
            {mockReservationHistory.map((reservation) => (
              <div 
                key={reservation.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
              >
                <div>
                  <p className="text-slate-900">{reservation.meal}</p>
                  <p className="text-slate-500 text-sm">{reservation.restaurant}</p>
                </div>
                <div className="text-end">
                  <p className="text-slate-600">{reservation.date}</p>
                  <p className={`text-sm ${
                    reservation.status === 'confirmed' 
                      ? 'text-green-600' 
                      : 'text-slate-500'
                  }`}>
                    {reservation.status === 'confirmed' 
                      ? (language === 'ar' ? 'مؤكد' : 'Confirmé')
                      : (language === 'ar' ? 'مكتمل' : 'Complété')
                    }
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
