import { useState } from 'react';
import { User } from '../App';
import { Header } from './Header';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Star, CheckCircle2 } from 'lucide-react';
import { feedbackService } from '../services/feedback.service';
import { handleApiError } from '../utils/helpers';

type Page = 'login' | 'dashboard' | 'menu' | 'reservation' | 'wallet' | 'feedback' | 'profile';

interface FeedbackProps {
  language: 'ar' | 'fr';
  onNavigate: (page: Page) => void;
  user: User;
}

const translations = {
  ar: {
    title: 'التقييم والملاحظات',
    rating: 'التقييم',
    selectRating: 'اختر التقييم من 1 إلى 5 نجوم',
    quickTags: 'تقييم سريع',
    comment: 'ملاحظات إضافية',
    commentPlaceholder: 'شاركنا رأيك وملاحظاتك حول الوجبة والخدمة...',
    submit: 'إرسال التقييم',
    success: 'تم إرسال تقييمك بنجاح',
    thankYou: 'شكراً لك على مساهمتك في تحسين الخدمة',
    newFeedback: 'تقييم جديد',
    tags: {
      good: 'جيد',
      excellent: 'ممتاز',
      cold: 'بارد',
      hot: 'ساخن',
      salty: 'مالح',
      sweet: 'حلو',
      late: 'تأخير',
      fast: 'سريع',
      clean: 'نظيف',
      tasty: 'لذيذ'
    }
  },
  fr: {
    title: 'Évaluation et commentaires',
    rating: 'Note',
    selectRating: 'Choisissez une note de 1 à 5 étoiles',
    quickTags: 'Évaluation rapide',
    comment: 'Commentaires supplémentaires',
    commentPlaceholder: 'Partagez votre avis et vos commentaires sur le repas et le service...',
    submit: 'Envoyer l\'évaluation',
    success: 'Votre évaluation a été envoyée avec succès',
    thankYou: 'Merci de contribuer à l\'amélioration du service',
    newFeedback: 'Nouvelle évaluation',
    tags: {
      good: 'Bon',
      excellent: 'Excellent',
      cold: 'Froid',
      hot: 'Chaud',
      salty: 'Salé',
      sweet: 'Sucré',
      late: 'Retard',
      fast: 'Rapide',
      clean: 'Propre',
      tasty: 'Délicieux'
    }
  }
};

const quickTags = [
  'good', 'excellent', 'cold', 'hot', 'salty', 
  'sweet', 'late', 'fast', 'clean', 'tasty'
];

export function Feedback({ language, onNavigate, user }: FeedbackProps) {
  const t = translations[language];
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      setError(language === 'ar' ? 'يرجى اختيار تقييم' : 'Veuillez sélectionner une note');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      await feedbackService.submitFeedback({
        rating,
        comment,
        tags: selectedTags.join(',')
      });
      
      setSubmitted(true);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleNewFeedback = () => {
    setRating(0);
    setSelectedTags([]);
    setComment('');
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 pb-8">
        <Header 
          title={t.title} 
          onBack={() => onNavigate('dashboard')}
          language={language}
        />

        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-green-900 mb-2">{t.success}</h2>
            <p className="text-slate-600 mb-6">{t.thankYou}</p>
            
            <div className="flex gap-3">
              <Button
                onClick={handleNewFeedback}
                variant="outline"
                className="flex-1"
              >
                {t.newFeedback}
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

          <div className="space-y-6">
            {/* Star Rating */}
            <div className="space-y-3">
              <Label className="text-slate-700">{t.rating}</Label>
              <p className="text-slate-500 text-sm">{t.selectRating}</p>
              <div className="flex gap-2 justify-center py-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-10 h-10 ${
                        star <= (hoveredRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-center text-slate-600">
                  {rating === 1 && (language === 'ar' ? 'سيء جداً' : 'Très mauvais')}
                  {rating === 2 && (language === 'ar' ? 'سيء' : 'Mauvais')}
                  {rating === 3 && (language === 'ar' ? 'متوسط' : 'Moyen')}
                  {rating === 4 && (language === 'ar' ? 'جيد' : 'Bon')}
                  {rating === 5 && (language === 'ar' ? 'ممتاز' : 'Excellent')}
                </p>
              )}
            </div>

            {/* Quick Tags */}
            <div className="space-y-3">
              <Label className="text-slate-700">{t.quickTags}</Label>
              <div className="flex flex-wrap gap-2">
                {quickTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className="transition-all"
                  >
                    <Badge
                      variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                      className={`cursor-pointer ${
                        selectedTags.includes(tag)
                          ? 'bg-blue-900 text-white hover:bg-blue-800'
                          : 'hover:border-blue-300'
                      }`}
                    >
                      {t.tags[tag as keyof typeof t.tags]}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div className="space-y-3">
              <Label htmlFor="comment" className="text-slate-700">
                {t.comment}
              </Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t.commentPlaceholder}
                rows={5}
                className="resize-none"
              />
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={rating === 0 || loading}
              className="w-full bg-blue-900 hover:bg-blue-800 disabled:bg-slate-300"
            >
              {loading ? (language === 'ar' ? 'جاري الإرسال...' : 'Envoi...') : t.submit}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
