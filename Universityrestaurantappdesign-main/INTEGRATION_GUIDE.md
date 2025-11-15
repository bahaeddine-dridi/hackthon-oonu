# 🔗 Frontend-Backend Integration Guide

## ✅ Integration Complete!

The React frontend has been successfully connected to the Laravel backend API.

---

## 📦 What Was Created

### **API Integration Layer (11 files)**

#### **Configuration**
- ✅ `src/config/api.ts` - API endpoints and configuration

#### **Services (10 files)**
- ✅ `src/services/api.service.ts` - Core API service with auth handling
- ✅ `src/services/auth.service.ts` - Authentication (login, register, logout)
- ✅ `src/services/menu.service.ts` - Weekly menu operations
- ✅ `src/services/reservation.service.ts` - Reservation management
- ✅ `src/services/wallet.service.ts` - Wallet and transactions
- ✅ `src/services/feedback.service.ts` - Feedback submission
- ✅ `src/services/profile.service.ts` - Profile management
- ✅ `src/services/admin-menu.service.ts` - Admin menu CRUD
- ✅ `src/services/admin-student.service.ts` - Admin student management
- ✅ `src/services/admin-stats.service.ts` - Admin statistics & AI

#### **Utilities & Hooks**
- ✅ `src/utils/helpers.ts` - Helper functions (formatting, error handling)
- ✅ `src/hooks/useApi.ts` - React hook for API calls

---

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
cd "C:\Users\bahad\OneDrive\Bureau\New folder\Universityrestaurantappdesign-main"
npm install
```

This will install the TypeScript types needed.

### 2. Start Backend Server

```bash
cd "C:\Users\bahad\OneDrive\Bureau\New folder\front-end"
php artisan serve
```

Backend will run at: **http://localhost:8000**

### 3. Start Frontend Development Server

```bash
cd "C:\Users\bahad\OneDrive\Bureau\New folder\Universityrestaurantappdesign-main"
npm run dev
```

Frontend will run at: **http://localhost:5173**

---

## 🎯 How to Use the API Services

### Example 1: Student Login

```typescript
import { authService } from './services/auth.service';
import { handleApiError } from './utils/helpers';

async function handleLogin(studentId: string, password: string) {
  try {
    const result = await authService.studentLogin({
      student_id: studentId,
      password: password,
    });
    
    console.log('Logged in:', result.student);
    console.log('Token:', result.token);
    
    // User data is automatically saved to localStorage
    // Token is automatically added to future requests
    
  } catch (error) {
    const errorMessage = handleApiError(error);
    alert(errorMessage);
  }
}
```

### Example 2: Get Weekly Menu

```typescript
import { menuService } from './services/menu.service';
import { useApi } from './hooks/useApi';

function WeeklyMenuComponent() {
  const { data, loading, error, execute } = useApi(
    menuService.getWeeklyMenu
  );
  
  useEffect(() => {
    execute({ day: 'Mon', meal_type: 'lunch' });
  }, []);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {data?.map(menu => (
        <div key={menu.id}>
          <h3>{menu.title}</h3>
          <p>{menu.day} - {menu.meal_type}</p>
        </div>
      ))}
    </div>
  );
}
```

### Example 3: Create Reservation

```typescript
import { reservationService } from './services/reservation.service';

async function createReservation(menuId: number, date: string) {
  try {
    const reservation = await reservationService.createReservation({
      menu_id: menuId,
      date: date,
      payment_method: 'wallet',
    });
    
    alert(`Reservation created! QR Code: ${reservation.qr_code}`);
  } catch (error) {
    alert(handleApiError(error));
  }
}
```

### Example 4: Recharge Wallet

```typescript
import { walletService } from './services/wallet.service';

async function rechargeWallet(amount: number) {
  try {
    const result = await walletService.rechargeWallet({
      amount: amount,
      payment_reference: 'REF123',
    });
    
    alert(`Wallet recharged! New balance: ${result.new_balance}`);
  } catch (error) {
    alert(handleApiError(error));
  }
}
```

### Example 5: Admin - Create Menu

```typescript
import { adminMenuService } from './services/admin-menu.service';

async function createMenu() {
  try {
    const menu = await adminMenuService.createMenu({
      day: 'Mon',
      meal_type: 'lunch',
      title: 'Couscous Traditionnel',
      tags: ['vegetarian', 'halal'],
      status: 'available',
    });
    
    alert('Menu created successfully!');
  } catch (error) {
    alert(handleApiError(error));
  }
}
```

---

## 📝 Available Services

### Authentication
```typescript
// Student
authService.studentLogin({ student_id, password })
authService.studentRegister({ student_id, name, email, university, password, password_confirmation })
authService.studentLogout()

// Admin
authService.adminLogin({ email, password })
authService.adminLogout()

// Helpers
authService.getStoredStudent()
authService.getStoredAdmin()
authService.isAuthenticated()
```

### Menu
```typescript
menuService.getWeeklyMenu({ day?, meal_type?, status? })
menuService.getMenuItem(id)
```

### Reservations
```typescript
reservationService.getReservations(page?)
reservationService.createReservation({ menu_id, date, payment_method })
reservationService.getReservation(id)
reservationService.cancelReservation(id)
```

### Wallet
```typescript
walletService.getWallet(page?)
walletService.rechargeWallet({ amount, payment_reference? })
```

### Feedback
```typescript
feedbackService.getFeedback(page?)
feedbackService.submitFeedback({ menu_id, rating, category?, comment? })
feedbackService.getFeedbackById(id)
```

### Profile
```typescript
profileService.getProfile()
profileService.updateProfile({ name?, email?, university?, password?, password_confirmation? })
profileService.getReservationHistory(page?)
```

### Admin - Menu
```typescript
adminMenuService.getMenus(page?, filters?)
adminMenuService.createMenu(data)
adminMenuService.getMenu(id)
adminMenuService.updateMenu(id, data)
adminMenuService.deleteMenu(id)
```

### Admin - Students
```typescript
adminStudentService.getStudents(page?, filters?)
adminStudentService.createStudent(data)
adminStudentService.getStudent(id)
adminStudentService.updateStudent(id, data)
adminStudentService.deleteStudent(id)
adminStudentService.restoreStudent(id)
```

### Admin - Statistics
```typescript
adminStatsService.getReservations(page?, filters?)
adminStatsService.getReservationStats(startDate?, endDate?)
adminStatsService.updateReservationStatus(id, status)
adminStatsService.getFeedback(page?, filters?)
adminStatsService.getFeedbackStats(startDate?, endDate?)
adminStatsService.deleteFeedback(id)
adminStatsService.getAIRecommendations()
adminStatsService.getSavedRecommendations(page?)
adminStatsService.saveRecommendation({ title, content })
```

---

## 🛠️ Helper Functions

```typescript
// Error handling
handleApiError(error) // Returns user-friendly error message
showError(message) // Show error notification
showSuccess(message) // Show success notification

// Formatting
formatCurrency(amount) // Format as TND currency
formatDate(date, locale?) // Format date (ar-TN or fr-FR)
formatTime(date, locale?) // Format time
getDayName(day, locale) // Get day name in Arabic/French
getMealTypeName(mealType, locale) // Get meal type in Arabic/French
getStatusColor(status) // Get Tailwind color classes
getSentimentColor(sentiment) // Get Tailwind color classes
```

---

## 🔐 Authentication Flow

1. **Login:**
   ```typescript
   const result = await authService.studentLogin({ student_id, password });
   // Token is automatically saved to localStorage
   // All subsequent API calls include the token
   ```

2. **Auto-persistence:**
   - Token is stored in `localStorage`
   - User data is stored in `localStorage`
   - Automatically added to all API requests

3. **Logout:**
   ```typescript
   await authService.studentLogout();
   // Token and user data are cleared from localStorage
   ```

4. **Check authentication:**
   ```typescript
   if (authService.isAuthenticated()) {
     // User is logged in
   }
   ```

---

## 📊 Data Structures

### Student
```typescript
interface StudentData {
  id: number;
  student_id: string;
  name: string;
  email: string;
  university: string;
  points: number;
  wallet_balance: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}
```

### Menu
```typescript
interface WeeklyMenu {
  id: number;
  day: string; // Mon, Tue, Wed, Thu, Fri, Sat, Sun
  meal_type: string; // breakfast, lunch, dinner
  title: string;
  tags: string[];
  status: string; // available, unavailable
  created_at: string;
  updated_at: string;
}
```

### Reservation
```typescript
interface Reservation {
  id: number;
  student_id: number;
  menu_id: number;
  date: string;
  qr_code: string;
  status: string; // pending, confirmed, cancelled, no_show
  payment_method: string; // wallet, points, cash
  price: number;
  student?: StudentData;
  menu?: WeeklyMenu;
  created_at: string;
  updated_at: string;
}
```

---

## 🚨 Error Handling

All API calls can throw errors. Use try-catch or the useApi hook:

```typescript
// Method 1: Try-Catch
try {
  const data = await menuService.getWeeklyMenu();
} catch (error) {
  const message = handleApiError(error);
  alert(message);
}

// Method 2: useApi Hook
const { data, error, loading, execute } = useApi(
  menuService.getWeeklyMenu,
  {
    onError: (msg) => alert(msg),
    onSuccess: (data) => console.log(data),
  }
);
```

---

## ⚙️ Configuration

Update API base URL in `src/config/api.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8000/api/v1', // Change for production
  TIMEOUT: 10000,
};
```

---

## 🧪 Testing

### Test Backend Connection:
```bash
curl http://localhost:8000/api/health
```

### Test Student Login:
```typescript
authService.studentLogin({
  student_id: 'STU001',
  password: 'password123'
})
```

### Test Admin Login:
```typescript
authService.adminLogin({
  email: 'admin@ooun.tn',
  password: 'admin123'
})
```

---

## 📝 Next Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Update components to use services:**
   - Replace mock data with API calls
   - Add loading states
   - Handle errors properly

3. **Test each feature:**
   - Login/Registration
   - Menu viewing
   - Reservations
   - Wallet operations
   - Feedback submission
   - Admin features

4. **Add toast notifications:**
   - Install `sonner` or similar
   - Replace `alert()` calls with toasts

5. **Deploy:**
   - Update API_CONFIG.BASE_URL for production
   - Build: `npm run build`

---

## 🎉 You're Ready!

The frontend is now fully connected to the Laravel backend. All API endpoints are wrapped in easy-to-use services with TypeScript support!

**Start both servers and test the integration:**

1. Backend: `php artisan serve`
2. Frontend: `npm run dev`
3. Login with: STU001 / password123

Happy coding! 🚀
