import { useState, useEffect } from 'react';
import { User } from '../App';
import { Header } from './Header';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Wallet as WalletIcon, 
  CreditCard, 
  Smartphone, 
  Award,
  ArrowUpCircle,
  ArrowDownCircle
} from 'lucide-react';
import { walletService, WalletTransaction } from '../services/wallet.service';
import { handleApiError } from '../utils/helpers';

type Page = 'login' | 'dashboard' | 'menu' | 'reservation' | 'wallet' | 'feedback' | 'profile';

interface WalletProps {
  language: 'ar' | 'fr';
  onNavigate: (page: Page) => void;
  user: User;
}

const translations = {
  ar: {
    title: 'المحفظة والدفع',
    balance: 'الرصيد الحالي',
    recharge: 'إعادة الشحن',
    transactions: 'المعاملات الأخيرة',
    paymentMethods: 'طرق الدفع',
    bankCard: 'بطاقة بنكية',
    mobile: 'دفع هاتفي',
    points: 'نقاط جامعية',
    amount: 'المبلغ',
    confirm: 'تأكيد الدفع',
    cancel: 'إلغاء',
    noTransactions: 'لا توجد معاملات',
    reservation: 'حجز وجبة',
    rechargeWallet: 'شحن المحفظة',
    mealReservation: 'حجز وجبة الغداء',
    breakfast: 'فطور',
    lunch: 'غداء',
    dinner: 'عشاء'
  },
  fr: {
    title: 'Portefeuille et paiement',
    balance: 'Solde actuel',
    recharge: 'Recharger',
    transactions: 'Transactions récentes',
    paymentMethods: 'Méthodes de paiement',
    bankCard: 'Carte bancaire',
    mobile: 'Paiement mobile',
    points: 'Points universitaires',
    amount: 'Montant',
    confirm: 'Confirmer le paiement',
    cancel: 'Annuler',
    noTransactions: 'Aucune transaction',
    reservation: 'Réservation repas',
    rechargeWallet: 'Recharge portefeuille',
    mealReservation: 'Réservation déjeuner',
    breakfast: 'Petit déjeuner',
    lunch: 'Déjeuner',
    dinner: 'Dîner'
  }
};

export function Wallet({ language, onNavigate, user }: WalletProps) {
  const t = translations[language];
  const [showRecharge, setShowRecharge] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [balance, setBalance] = useState(user.balance);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('bank_card');

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const walletData = await walletService.getBalance();
      setBalance(walletData.balance);
      
      const transactionData = await walletService.getTransactions();
      setTransactions(transactionData);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleRecharge = async () => {
    if (!rechargeAmount || parseFloat(rechargeAmount) <= 0) {
      setError(language === 'ar' ? 'يرجى إدخال مبلغ صحيح' : 'Veuillez entrer un montant valide');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await walletService.rechargeWallet({
        amount: parseFloat(rechargeAmount),
        payment_method: selectedPaymentMethod
      });
      
      // Refresh wallet data
      await fetchWalletData();
      
      setShowRecharge(false);
      setRechargeAmount('');
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      <Header 
        title={t.title} 
        onBack={() => onNavigate('dashboard')}
        language={language}
      />

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-6 text-white mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <WalletIcon className="w-6 h-6" />
              <p className="text-blue-100">{t.balance}</p>
            </div>
            <Award className="w-6 h-6 text-blue-200" />
          </div>
          <h2 className="text-white mb-4">{loading ? '...' : balance.toFixed(2)} TND</h2>
          <Button
            onClick={() => setShowRecharge(!showRecharge)}
            className="w-full bg-white text-blue-900 hover:bg-blue-50"
            disabled={loading}
          >
            {t.recharge}
          </Button>
        </div>

        {/* Recharge Form */}
        {showRecharge && (
          <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
            <h3 className="text-slate-900 mb-4">{t.recharge}</h3>
            
            {error && (
              <div className="bg-red-50 text-red-700 px-4 py-3 rounded-md border border-red-200 mb-4">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-slate-700">{t.amount} (TND)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(e.target.value)}
                  placeholder="10.00"
                  min="1"
                  step="0.01"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700">{t.paymentMethods}</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button 
                    onClick={() => setSelectedPaymentMethod('bank_card')}
                    className={`flex items-center gap-3 p-4 border-2 rounded-lg transition-colors ${
                      selectedPaymentMethod === 'bank_card' 
                        ? 'border-blue-600 bg-blue-50' 
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <CreditCard className={`w-5 h-5 ${selectedPaymentMethod === 'bank_card' ? 'text-blue-600' : 'text-slate-600'}`} />
                    <span className="text-slate-900">{t.bankCard}</span>
                  </button>
                  <button 
                    onClick={() => setSelectedPaymentMethod('mobile_money')}
                    className={`flex items-center gap-3 p-4 border-2 rounded-lg transition-colors ${
                      selectedPaymentMethod === 'mobile_money' 
                        ? 'border-blue-600 bg-blue-50' 
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <Smartphone className={`w-5 h-5 ${selectedPaymentMethod === 'mobile_money' ? 'text-blue-600' : 'text-slate-600'}`} />
                    <span className="text-slate-900">{t.mobile}</span>
                  </button>
                  <button 
                    onClick={() => setSelectedPaymentMethod('points')}
                    className={`flex items-center gap-3 p-4 border-2 rounded-lg transition-colors ${
                      selectedPaymentMethod === 'points' 
                        ? 'border-blue-600 bg-blue-50' 
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <Award className={`w-5 h-5 ${selectedPaymentMethod === 'points' ? 'text-blue-600' : 'text-slate-600'}`} />
                    <span className="text-slate-900">{t.points}</span>
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => setShowRecharge(false)}
                  variant="outline"
                  className="flex-1"
                  disabled={loading}
                >
                  {t.cancel}
                </Button>
                <Button
                  onClick={handleRecharge}
                  disabled={!rechargeAmount || parseFloat(rechargeAmount) <= 0 || loading}
                  className="flex-1 bg-blue-900 hover:bg-blue-800"
                >
                  {loading ? (language === 'ar' ? 'جاري المعالجة...' : 'Traitement...') : t.confirm}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Transactions */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-slate-900 mb-4">{t.transactions}</h3>
          
          {loading ? (
            <p className="text-slate-500 text-center py-8">{language === 'ar' ? 'جاري التحميل...' : 'Chargement...'}</p>
          ) : transactions.length === 0 ? (
            <p className="text-slate-500 text-center py-8">{t.noTransactions}</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div 
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.transaction_type === 'credit' 
                        ? 'bg-green-100' 
                        : 'bg-red-100'
                    }`}>
                      {transaction.transaction_type === 'credit' ? (
                        <ArrowUpCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <ArrowDownCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-slate-900">{transaction.description}</p>
                      <p className="text-slate-500 text-sm">
                        {new Date(transaction.created_at).toLocaleDateString(language === 'ar' ? 'ar' : 'fr')}
                      </p>
                    </div>
                  </div>
                  <div className="text-end">
                    <p className={`${
                      transaction.transaction_type === 'credit' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {transaction.transaction_type === 'credit' ? '+' : '-'}{Math.abs(transaction.amount).toFixed(2)} TND
                    </p>
                    <p className="text-slate-500 text-sm capitalize">{transaction.payment_method || 'wallet'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
