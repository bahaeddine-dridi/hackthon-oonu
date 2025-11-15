import { useState } from 'react';
import { Admin } from '../../App';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { 
  Search, 
  Eye, 
  Edit, 
  Ban, 
  CheckCircle, 
  Download,
  UserPlus
} from 'lucide-react';

type Page = 'admin-dashboard' | 'admin-menu' | 'admin-students' | 'admin-stats' | 'admin-ai' | 'admin-reviews';

interface AdminStudentManagementProps {
  language: 'ar' | 'fr';
  onNavigate: (page: Page) => void;
  admin: Admin;
}

const translations = {
  ar: {
    title: 'إدارة الطلاب',
    search: 'بحث عن طالب...',
    addStudent: 'إضافة طالب جديد',
    exportData: 'تصدير البيانات',
    studentId: 'رقم الطالب',
    name: 'الاسم',
    university: 'الجامعة',
    email: 'البريد الإلكتروني',
    reservations: 'الحجوزات',
    balance: 'الرصيد',
    points: 'النقاط',
    status: 'الحالة',
    actions: 'الإجراءات',
    active: 'نشط',
    suspended: 'موقوف',
    view: 'عرض',
    edit: 'تعديل',
    suspend: 'إيقاف',
    activate: 'تفعيل',
    totalStudents: 'إجمالي الطلاب'
  },
  fr: {
    title: 'Gestion des étudiants',
    search: 'Rechercher un étudiant...',
    addStudent: 'Ajouter un étudiant',
    exportData: 'Exporter les données',
    studentId: 'ID Étudiant',
    name: 'Nom',
    university: 'Université',
    email: 'Email',
    reservations: 'Réservations',
    balance: 'Solde',
    points: 'Points',
    status: 'Statut',
    actions: 'Actions',
    active: 'Actif',
    suspended: 'Suspendu',
    view: 'Voir',
    edit: 'Modifier',
    suspend: 'Suspendre',
    activate: 'Activer',
    totalStudents: 'Total étudiants'
  }
};

interface Student {
  id: string;
  name: string;
  university: string;
  email: string;
  totalReservations: number;
  balance: number;
  points: number;
  status: 'active' | 'suspended';
}

const mockStudents: Student[] = [
  {
    id: '12345678',
    name: 'أحمد بن محمد / Ahmed Ben Mohamed',
    university: 'جامعة تونس المنار',
    email: 'ahmed.mohamed@university.tn',
    totalReservations: 24,
    balance: 45.50,
    points: 150,
    status: 'active'
  },
  {
    id: '87654321',
    name: 'فاطمة علي / Fatima Ali',
    university: 'جامعة قرطاج',
    email: 'fatima.ali@university.tn',
    totalReservations: 18,
    balance: 32.00,
    points: 120,
    status: 'active'
  },
  {
    id: '11223344',
    name: 'محمد حسن / Mohamed Hassan',
    university: 'جامعة صفاقس',
    email: 'mohamed.hassan@university.tn',
    totalReservations: 31,
    balance: 0.50,
    points: 200,
    status: 'active'
  },
  {
    id: '55667788',
    name: 'سارة خالد / Sara Khaled',
    university: 'جامعة تونس المنار',
    email: 'sara.khaled@university.tn',
    totalReservations: 12,
    balance: 15.00,
    points: 80,
    status: 'suspended'
  },
  {
    id: '99887766',
    name: 'يوسف عمر / Youssef Omar',
    university: 'جامعة المنستير',
    email: 'youssef.omar@university.tn',
    totalReservations: 27,
    balance: 58.20,
    points: 175,
    status: 'active'
  }
];

export function AdminStudentManagement({ language, onNavigate, admin }: AdminStudentManagementProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState(mockStudents);
  const t = translations[language];

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.includes(searchTerm) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleStudentStatus = (id: string) => {
    setStudents(prev =>
      prev.map(student =>
        student.id === id
          ? { ...student, status: student.status === 'active' ? 'suspended' : 'active' }
          : student
      )
    );
  };

  const handleLogout = () => {
    // This should be passed from parent
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar 
        currentPage="admin-students" 
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
                <p className="text-slate-600">{t.totalStudents}: {students.length}</p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  {t.exportData}
                </Button>
                <Button
                  className="gap-2 bg-blue-900 hover:bg-blue-800"
                >
                  <UserPlus className="w-4 h-4" />
                  {t.addStudent}
                </Button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t.search}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Students Table - Desktop */}
            <div className="hidden lg:block bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-100 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-start text-slate-700">{t.studentId}</th>
                      <th className="px-4 py-3 text-start text-slate-700">{t.name}</th>
                      <th className="px-4 py-3 text-start text-slate-700">{t.university}</th>
                      <th className="px-4 py-3 text-start text-slate-700">{t.reservations}</th>
                      <th className="px-4 py-3 text-start text-slate-700">{t.balance}</th>
                      <th className="px-4 py-3 text-start text-slate-700">{t.points}</th>
                      <th className="px-4 py-3 text-start text-slate-700">{t.status}</th>
                      <th className="px-4 py-3 text-start text-slate-700">{t.actions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="border-b border-slate-200 hover:bg-slate-50">
                        <td className="px-4 py-3 text-slate-900">{student.id}</td>
                        <td className="px-4 py-3">
                          <p className="text-slate-900">{student.name}</p>
                          <p className="text-slate-500 text-sm">{student.email}</p>
                        </td>
                        <td className="px-4 py-3 text-slate-700">{student.university}</td>
                        <td className="px-4 py-3 text-slate-700">{student.totalReservations}</td>
                        <td className="px-4 py-3 text-slate-700">{student.balance.toFixed(2)} TND</td>
                        <td className="px-4 py-3 text-slate-700">{student.points}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                            student.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {student.status === 'active' ? (
                              <>
                                <CheckCircle className="w-3 h-3" />
                                {t.active}
                              </>
                            ) : (
                              <>
                                <Ban className="w-3 h-3" />
                                {t.suspended}
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={() => toggleStudentStatus(student.id)}
                            >
                              {student.status === 'active' ? (
                                <Ban className="w-4 h-4 text-red-600" />
                              ) : (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Students Cards - Mobile */}
            <div className="lg:hidden space-y-4">
              {filteredStudents.map((student) => (
                <div key={student.id} className="bg-white rounded-lg border border-slate-200 p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-slate-900">{student.name}</p>
                      <p className="text-slate-500 text-sm">{student.id}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                      student.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {student.status === 'active' ? t.active : t.suspended}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div>
                      <p className="text-slate-500">{t.reservations}</p>
                      <p className="text-slate-900">{student.totalReservations}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">{t.balance}</p>
                      <p className="text-slate-900">{student.balance.toFixed(2)} TND</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      {t.view}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleStudentStatus(student.id)}
                      className="flex-1"
                    >
                      {student.status === 'active' ? t.suspend : t.activate}
                    </Button>
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
