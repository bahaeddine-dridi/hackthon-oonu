# OOUN University Restaurant System - Backend API

A comprehensive Laravel 10+ REST API for managing university restaurant operations in Tunisia.

## 🎯 Features

### Student Features
- Authentication (Login/Register with Student ID)
- View weekly menu
- Make meal reservations with QR code generation
- Wallet system (balance, recharge, transactions)
- Points system for rewards
- Submit feedback (rating + comments with auto sentiment detection)
- View profile and reservation history

### Admin Features
- Admin authentication
- Manage weekly meals (CRUD operations)
- Manage students (CRUD operations)
- View reservations dashboard with statistics
- View feedback with analytics
- AI recommendations (placeholder endpoint)

## 🛠️ Tech Stack

- **Framework:** Laravel 10+
- **Database:** PostgreSQL
- **Authentication:** Laravel Sanctum (API tokens)
- **Architecture:** Clean architecture with repositories pattern

## 📁 Project Structure

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Auth/
│   │   │   ├── StudentAuthController.php
│   │   │   └── AdminAuthController.php
│   │   ├── Student/
│   │   │   ├── WeeklyMenuController.php
│   │   │   ├── ReservationController.php
│   │   │   ├── WalletController.php
│   │   │   ├── FeedbackController.php
│   │   │   └── StudentProfileController.php
│   │   └── Admin/
│   │       ├── AdminMenuController.php
│   │       ├── AdminStudentController.php
│   │       ├── AdminReservationController.php
│   │       ├── AdminFeedbackController.php
│   │       └── AIRecommendationController.php
│   ├── Requests/
│   │   ├── StoreWeeklyMenuRequest.php
│   │   ├── UpdateWeeklyMenuRequest.php
│   │   ├── StoreReservationRequest.php
│   │   ├── StoreFeedbackRequest.php
│   │   └── UpdateStudentRequest.php
│   └── Resources/
│       ├── StudentResource.php
│       ├── WeeklyMenuResource.php
│       ├── ReservationResource.php
│       ├── WalletTransactionResource.php
│       ├── FeedbackResource.php
│       └── AIRecommendationResource.php
├── Models/
│   ├── Student.php
│   ├── Admin.php
│   ├── WeeklyMenu.php
│   ├── Reservation.php
│   ├── WalletTransaction.php
│   ├── Feedback.php
│   └── AIRecommendation.php
database/
└── migrations/
    ├── 2024_01_01_000001_create_students_table.php
    ├── 2024_01_01_000002_create_admins_table.php
    ├── 2024_01_01_000003_create_weekly_menus_table.php
    ├── 2024_01_01_000004_create_reservations_table.php
    ├── 2024_01_01_000005_create_wallet_transactions_table.php
    ├── 2024_01_01_000006_create_feedback_table.php
    └── 2024_01_01_000007_create_ai_recommendations_table.php
```

## 🚀 Installation

### Prerequisites
- PHP >= 8.1
- Composer
- PostgreSQL >= 12
- Laravel 10+

### Setup Steps

1. **Clone the repository**
   ```bash
   cd front-end
   ```

2. **Install dependencies**
   ```bash
   composer install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   Update your `.env` file with PostgreSQL credentials:
   ```env
   DB_CONNECTION=pgsql
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_DATABASE=oounDB
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   ```

4. **Generate application key**
   ```bash
   php artisan key:generate
   ```

5. **Run migrations**
   ```bash
   php artisan migrate
   ```

6. **Install Sanctum (if not already installed)**
   ```bash
   composer require laravel/sanctum
   php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
   ```

7. **Create admin user (optional)**
   ```bash
   php artisan tinker
   ```
   Then run:
   ```php
   \App\Models\Admin::create([
       'name' => 'Admin',
       'email' => 'admin@ooun.tn',
       'password' => bcrypt('password123'),
       'role' => 'admin'
   ]);
   ```

8. **Start the development server**
   ```bash
   php artisan serve
   ```

   API will be available at: `http://localhost:8000`

## 📚 API Documentation

### Base URL
```
http://localhost:8000/api/v1
```

### Authentication
All protected routes require the `Authorization` header:
```
Authorization: Bearer {token}
```

---

## 🔐 Authentication Endpoints

### Student Auth

#### Register Student
```http
POST /api/v1/student/register
Content-Type: application/json

{
  "student_id": "STU001",
  "name": "John Doe",
  "email": "john@student.tn",
  "university": "OOUN Tunisia",
  "password": "password123",
  "password_confirmation": "password123"
}
```

#### Student Login
```http
POST /api/v1/student/login
Content-Type: application/json

{
  "student_id": "STU001",
  "password": "password123"
}
```

#### Student Logout
```http
POST /api/v1/student/logout
Authorization: Bearer {token}
```

### Admin Auth

#### Admin Login
```http
POST /api/v1/admin/login
Content-Type: application/json

{
  "email": "admin@ooun.tn",
  "password": "password123"
}
```

#### Admin Logout
```http
POST /api/v1/admin/logout
Authorization: Bearer {token}
```

---

## 👨‍🎓 Student Endpoints

### Menu

#### Get Weekly Menu
```http
GET /api/v1/menu/week
Authorization: Bearer {token}

Query params:
- day (optional): Mon, Tue, Wed, Thu, Fri, Sat, Sun
- meal_type (optional): breakfast, lunch, dinner
```

#### Get Single Menu Item
```http
GET /api/v1/menu/{id}
Authorization: Bearer {token}
```

### Reservations

#### Get All Reservations
```http
GET /api/v1/reservations
Authorization: Bearer {token}
```

#### Create Reservation
```http
POST /api/v1/reservations
Authorization: Bearer {token}
Content-Type: application/json

{
  "menu_id": 1,
  "date": "2024-01-15",
  "payment_method": "wallet"
}
```

#### Get Single Reservation
```http
GET /api/v1/reservations/{id}
Authorization: Bearer {token}
```

#### Cancel Reservation
```http
POST /api/v1/reservations/{id}/cancel
Authorization: Bearer {token}
```

### Wallet

#### Get Wallet Balance & Transactions
```http
GET /api/v1/wallet
Authorization: Bearer {token}
```

#### Recharge Wallet
```http
POST /api/v1/wallet/recharge
Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": 50.00,
  "payment_reference": "REF123456"
}
```

### Feedback

#### Get All Feedback
```http
GET /api/v1/feedback
Authorization: Bearer {token}
```

#### Submit Feedback
```http
POST /api/v1/feedback
Authorization: Bearer {token}
Content-Type: application/json

{
  "menu_id": 1,
  "rating": 5,
  "category": "taste",
  "comment": "Excellent meal!"
}
```

### Profile

#### Get Profile
```http
GET /api/v1/profile
Authorization: Bearer {token}
```

#### Update Profile
```http
PUT /api/v1/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Updated",
  "email": "newemail@student.tn"
}
```

#### Get Reservation History
```http
GET /api/v1/profile/history
Authorization: Bearer {token}
```

---

## 👨‍💼 Admin Endpoints

### Menu Management

#### List All Menus
```http
GET /api/v1/admin/menus
Authorization: Bearer {token}

Query params:
- status: available, unavailable
- day: Mon, Tue, etc.
- meal_type: breakfast, lunch, dinner
```

#### Create Menu
```http
POST /api/v1/admin/menus
Authorization: Bearer {token}
Content-Type: application/json

{
  "day": "Mon",
  "meal_type": "lunch",
  "title": "Couscous",
  "tags": ["vegetarian", "halal"],
  "status": "available"
}
```

#### Update Menu
```http
PUT /api/v1/admin/menus/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Couscous",
  "status": "unavailable"
}
```

#### Delete Menu
```http
DELETE /api/v1/admin/menus/{id}
Authorization: Bearer {token}
```

### Student Management

#### List All Students
```http
GET /api/v1/admin/students
Authorization: Bearer {token}

Query params:
- search: search by name, email, or student_id
- active: true/false
- university: filter by university
```

#### Create Student
```http
POST /api/v1/admin/students
Authorization: Bearer {token}
Content-Type: application/json

{
  "student_id": "STU002",
  "name": "Jane Doe",
  "email": "jane@student.tn",
  "university": "OOUN Tunisia",
  "password": "password123"
}
```

#### Update Student
```http
PUT /api/v1/admin/students/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Jane Updated",
  "wallet_balance": 100.00,
  "points": 500
}
```

#### Delete Student
```http
DELETE /api/v1/admin/students/{id}
Authorization: Bearer {token}
```

### Reservations Dashboard

#### Get All Reservations
```http
GET /api/v1/admin/reservations
Authorization: Bearer {token}

Query params:
- status: pending, confirmed, cancelled, no_show
- date: YYYY-MM-DD
- student_id: filter by student
- menu_id: filter by menu
```

#### Get Reservation Statistics
```http
GET /api/v1/admin/reservations/statistics
Authorization: Bearer {token}

Query params:
- start_date: YYYY-MM-DD
- end_date: YYYY-MM-DD
```

#### Update Reservation Status
```http
PUT /api/v1/admin/reservations/{id}/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "confirmed"
}
```

### Feedback Management

#### Get All Feedback
```http
GET /api/v1/admin/feedback
Authorization: Bearer {token}

Query params:
- rating: 1-5
- category: taste, timing, service, hygiene
- sentiment: positive, neutral, negative
- menu_id: filter by menu
- student_id: filter by student
```

#### Get Feedback Statistics
```http
GET /api/v1/admin/feedback/statistics
Authorization: Bearer {token}

Query params:
- start_date: YYYY-MM-DD
- end_date: YYYY-MM-DD
```

### AI Recommendations

#### Get AI Recommendations
```http
GET /api/v1/admin/ai/recommendations
Authorization: Bearer {token}
```

#### Get Saved Recommendations
```http
GET /api/v1/admin/ai/recommendations/saved
Authorization: Bearer {token}
```

#### Save Recommendation
```http
POST /api/v1/admin/ai/recommendations
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Increase Service Speed",
  "content": "Based on analysis, lunch service needs improvement..."
}
```

---

## 🗃️ Database Schema

### Tables

1. **students** - Student accounts
2. **admins** - Admin accounts
3. **weekly_menus** - Weekly meal plans
4. **reservations** - Meal reservations with QR codes
5. **wallet_transactions** - Student wallet history
6. **feedback** - Student feedback with sentiment analysis
7. **ai_recommendations** - AI-generated recommendations

### Key Relationships
- Student → Reservations (one-to-many)
- Student → Feedback (one-to-many)
- Student → WalletTransactions (one-to-many)
- WeeklyMenu → Reservations (one-to-many)
- WeeklyMenu → Feedback (one-to-many)

---

## ✨ Features Implemented

### Authentication & Authorization
- ✅ Multi-guard authentication (Student & Admin)
- ✅ Laravel Sanctum for API tokens
- ✅ Secure password hashing

### Business Logic
- ✅ Automatic QR code generation for reservations
- ✅ Wallet balance management with transactions
- ✅ Points reward system
- ✅ Auto sentiment detection for feedback
- ✅ Payment methods (wallet, points, cash)

### Data Validation
- ✅ Form Request validation classes
- ✅ Database constraints and indexes
- ✅ Soft deletes where appropriate

### API Best Practices
- ✅ Structured JSON responses
- ✅ Resource classes for clean output
- ✅ Pagination for list endpoints
- ✅ Query filters and search
- ✅ Proper HTTP status codes

---

## 🧪 Testing

To run tests (after creating test cases):
```bash
php artisan test
```

---

## 📝 Notes

- **QR Code Generation:** Currently uses a simple string generator. Integrate a QR code library like `simple-qrcode` for actual QR images.
- **Sentiment Detection:** Basic rule-based implementation. Consider integrating a real AI service for production.
- **AI Recommendations:** Returns placeholder data. Integrate with actual AI/ML models for real recommendations.
- **Payment Integration:** Payment methods are placeholder. Integrate with actual payment gateways as needed.

---

## 🔒 Security

- All passwords are hashed using bcrypt
- API routes are protected with Sanctum middleware
- Input validation on all requests
- SQL injection protection via Eloquent ORM
- CORS configuration in `config/cors.php`

---

## 📄 License

This project is open-source and available under the MIT License.

---

## 👥 Support

For issues or questions, please contact the development team.

**Happy Coding! 🚀**
