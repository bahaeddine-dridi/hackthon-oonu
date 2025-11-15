import { useState } from 'react';
import { Admin } from '../../App';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { 
  Star, 
  Search, 
  Filter,
  Download,
  Eye,
  MessageSquare,
  Calendar
} from 'lucide-react';

type Page = 'admin-dashboard' | 'admin-menu' | 'admin-students' | 'admin-stats' | 'admin-ai' | 'admin-reviews';

interface AdminReviewsProps {
  language: 'ar' | 'fr';
  onNavigate: (page: Page) => void;
  admin: Admin;
}

const translations = {
  ar: {
    title: 'تقييمات الطلاب',
    search: 'بحث في التقييمات...',
    filterByRating: 'تصفية حسب التقييم',
    filterByStatus: 'تصفية حسب الحالة',
    allRatings: 'جميع التقييمات',
    allStatuses: 'جميع الحالات',
    export: 'تصدير التقييمات',
    totalReviews: 'إجمالي التقييمات',
    avgRating: 'متوسط التقييم',
    new: 'جديد',
    read: 'مقروء',
    responded: 'تم الرد',
    markAsRead: 'تعيين كمقروء',
    addNote: 'إضافة ملاحظة',
    student: 'الطالب',
    rating: 'التقييم',
    date: 'التاريخ',
    meal: 'الوجبة',
    restaurant: 'المطعم',
    comment: 'التعليق',
    tags: 'العلامات',
    status: 'الحالة',
    anonymous: 'مجهول',
    stars: 'نجوم'
  },
  fr: {
    title: 'Évaluations étudiants',
    search: 'Rechercher dans les évaluations...',
    filterByRating: 'Filtrer par note',
    filterByStatus: 'Filtrer par statut',
    allRatings: 'Toutes les notes',
    allStatuses: 'Tous les statuts',
    export: 'Exporter les évaluations',
    totalReviews: 'Total évaluations',
    avgRating: 'Note moyenne',
    new: 'Nouveau',
    read: 'Lu',
    responded: 'Répondu',
    markAsRead: 'Marquer comme lu',
    addNote: 'Ajouter une note',
    student: 'Étudiant',
    rating: 'Note',
    date: 'Date',
    meal: 'Repas',
    restaurant: 'Restaurant',
    comment: 'Commentaire',
    tags: 'Tags',
    status: 'Statut',
    anonymous: 'Anonyme',
    stars: 'étoiles'
  }
};

interface Review {
  id: string;
  studentName: string;
  rating: number;
  date: string;
  meal: string;
  restaurant: string;
  comment: string;
  tags: string[];
  status: 'new' | 'read' | 'responded';
  anonymous?: boolean;
}

const mockReviews: Review[] = [
  {
    id: '1',
    studentName: 'أحمد محمد / Ahmed Mohamed',
    rating: 5,
    date: '2024-11-14',
    meal: 'غداء / Déjeuner',
    restaurant: 'الحرم الشمالي / Campus Nord',
    comment: 'الكسكسي كان ممتازاً، لذيذ جداً والخدمة سريعة / Le couscous était excellent, très délicieux et le service était rapide',
    tags: ['excellent', 'tasty', 'fast'],
    status: 'new'
  },
  {
    id: '2',
    studentName: 'فاطمة علي / Fatima Ali',
    rating: 3,
    date: '2024-11-13',
    meal: 'عشاء / Dîner',
    restaurant: 'المطعم الرئيسي / Restaurant Principal',
    comment: 'الوجبة كانت باردة قليلاً / Le repas était un peu froid',
    tags: ['cold'],
    status: 'read'
  },
  {
    id: '3',
    studentName: 'محمد حسن / Mohamed Hassan',
    rating: 4,
    date: '2024-11-13',
    meal: 'غداء / Déjeuner',
    restaurant: 'الحرم الجنوبي / Campus Sud',
    comment: 'جيد بشكل عام، لكن كان هناك تأخير بسيط / Bon dans l\'ensemble, mais il y avait un léger retard',
    tags: ['good', 'late'],
    status: 'responded'
  },
  {
    id: '4',
    studentName: 'سارة خالد / Sara Khaled',
    rating: 5,
    date: '2024-11-12',
    meal: 'فطور / Petit déjeuner',
    restaurant: 'الحرم الشمالي / Campus Nord',
    comment: 'كل شيء كان مثالياً! نظيف وسريع / Tout était parfait! Propre et rapide',
    tags: ['excellent', 'clean', 'fast'],
    status: 'read'
  },
  {
    id: '5',
    studentName: 'Anonyme / مجهول',
    rating: 2,
    date: '2024-11-12',
    meal: 'غداء / Déjeuner',
    restaurant: 'المطعم الرئيسي / Restaurant Principal',
    comment: 'الطعام كان مالحاً جداً / La nourriture était trop salée',
    tags: ['salty'],
    status: 'new',
    anonymous: true
  },
  {
    id: '6',
    studentName: 'يوسف عمر / Youssef Omar',
    rating: 4,
    date: '2024-11-11',
    meal: 'عشاء / Dîner',
    restaurant: 'الحرم الجنوبي / Campus Sud',
    comment: 'وجبة لذيذة وساخنة / Repas délicieux et chaud',
    tags: ['good', 'hot', 'tasty'],
    status: 'read'
  }
];

export function AdminReviews({ language, onNavigate, admin }: AdminReviewsProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [reviews, setReviews] = useState(mockReviews);
  const t = translations[language];

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRating = filterRating === 'all' || review.rating === parseInt(filterRating);
    const matchesStatus = filterStatus === 'all' || review.status === filterStatus;

    return matchesSearch && matchesRating && matchesStatus;
  });

  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  const markAsRead = (id: string) => {
    setReviews(prev =>
      prev.map(review =>
        review.id === id && review.status === 'new'
          ? { ...review, status: 'read' as const }
          : review
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'read':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'responded':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-slate-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const handleLogout = () => {
    // This should be passed from parent
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar 
        currentPage="admin-reviews" 
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
              <div>
                <h1 className="text-slate-900 mb-1">{t.title}</h1>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-slate-600">{t.totalReviews}: {reviews.length}</span>
                  <span className="text-slate-600">{t.avgRating}: {avgRating} ★</span>
                </div>
              </div>
              
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                {t.export}
              </Button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t.search}
                    className="pl-10"
                  />
                </div>
                <Select value={filterRating} onValueChange={setFilterRating}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder={t.filterByRating} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.allRatings}</SelectItem>
                    <SelectItem value="5">5 {t.stars}</SelectItem>
                    <SelectItem value="4">4 {t.stars}</SelectItem>
                    <SelectItem value="3">3 {t.stars}</SelectItem>
                    <SelectItem value="2">2 {t.stars}</SelectItem>
                    <SelectItem value="1">1 {t.stars}</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder={t.filterByStatus} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.allStatuses}</SelectItem>
                    <SelectItem value="new">{t.new}</SelectItem>
                    <SelectItem value="read">{t.read}</SelectItem>
                    <SelectItem value="responded">{t.responded}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <div key={review.id} className="bg-white rounded-lg border border-slate-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-6 h-6 text-blue-900" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="text-slate-900">{review.studentName}</p>
                          {renderStars(review.rating)}
                          <Badge className={`${getStatusColor(review.status)} text-xs`}>
                            {t[review.status]}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {review.date}
                          </span>
                          <span>{review.meal}</span>
                          <span>{review.restaurant}</span>
                        </div>
                        <p className="text-slate-700 mb-3">{review.comment}</p>
                        <div className="flex flex-wrap gap-2">
                          {review.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  {review.status === 'new' && (
                    <div className="flex gap-2 pt-4 border-t border-slate-200">
                      <Button
                        size="sm"
                        onClick={() => markAsRead(review.id)}
                        className="bg-blue-900 hover:bg-blue-800"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        {t.markAsRead}
                      </Button>
                      <Button size="sm" variant="outline">
                        {t.addNote}
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredReviews.length === 0 && (
              <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
                <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">
                  {language === 'ar' ? 'لا توجد تقييمات مطابقة' : 'Aucune évaluation correspondante'}
                </p>
              </div>
            )}
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
