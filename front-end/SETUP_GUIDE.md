# 🚀 Quick Setup Guide - OOUN Restaurant API

## Prerequisites Checklist
- [ ] PHP 8.1 or higher installed
- [ ] Composer installed
- [ ] PostgreSQL installed and running
- [ ] Database created (oounDB)

## Setup Steps (Windows PowerShell)

### 1. Navigate to project directory
```powershell
cd "C:\Users\bahad\OneDrive\Bureau\New folder\front-end"
```

### 2. Install Composer dependencies
```powershell
composer install
```

### 3. Copy environment file
```powershell
Copy-Item .env.example .env
```

### 4. Generate application key
```powershell
php artisan key:generate
```

### 5. Update .env file
Open `.env` and verify PostgreSQL settings:
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=oounDB
DB_USERNAME=postgres
DB_PASSWORD=123456baha
```

### 6. Install Laravel Sanctum (if needed)
```powershell
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

### 7. Run migrations
```powershell
php artisan migrate
```

### 8. Seed database with sample data
```powershell
php artisan db:seed
```

### 9. Clear config cache
```powershell
php artisan config:clear
php artisan route:clear
php artisan cache:clear
```

### 10. Start development server
```powershell
php artisan serve
```

API will be available at: **http://localhost:8000/api/v1**

---

## 🎯 Test Credentials

### Admin Account
- **Email:** admin@ooun.tn
- **Password:** admin123

### Student Accounts
1. **Student ID:** STU001 | **Password:** password123
2. **Student ID:** STU002 | **Password:** password123
3. **Student ID:** STU003 | **Password:** password123

---

## 🧪 Testing the API

### Option 1: Using cURL (PowerShell)

**Student Login:**
```powershell
$body = @{
    student_id = "STU001"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/api/v1/student/login" -Method POST -Body $body -ContentType "application/json"
```

**Admin Login:**
```powershell
$body = @{
    email = "admin@ooun.tn"
    password = "admin123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/api/v1/admin/login" -Method POST -Body $body -ContentType "application/json"
```

### Option 2: Using Postman
1. Import `OOUN_Restaurant_API.postman_collection.json`
2. Set base_url variable to: `http://localhost:8000/api/v1`
3. Run "Login Student" or "Login Admin" to get token
4. Token is automatically saved to environment variables

---

## 📊 Database Tables Created

✅ **students** - Student accounts with wallet & points
✅ **admins** - Admin accounts
✅ **weekly_menus** - Weekly meal plans
✅ **reservations** - Meal reservations with QR codes
✅ **wallet_transactions** - Transaction history
✅ **feedback** - Student feedback with sentiment
✅ **ai_recommendations** - AI recommendations storage

---

## 🔧 Common Issues & Solutions

### Issue: Migration fails
**Solution:**
```powershell
php artisan migrate:fresh
php artisan db:seed
```

### Issue: "Class not found"
**Solution:**
```powershell
composer dump-autoload
php artisan optimize:clear
```

### Issue: Database connection error
**Solution:**
1. Verify PostgreSQL is running
2. Check .env credentials
3. Ensure database exists:
```sql
CREATE DATABASE oounDB;
```

### Issue: Route not found
**Solution:**
```powershell
php artisan route:clear
php artisan route:cache
```

---

## 📝 Next Steps

1. **Test all endpoints** using Postman collection
2. **Review API documentation** in `README_API.md`
3. **Customize** business logic as needed
4. **Add tests** in `tests/` directory
5. **Deploy** to production server

---

## 🔒 Security Notes

- Change default passwords before production
- Update APP_KEY in .env
- Configure CORS in `config/cors.php`
- Enable rate limiting for production
- Use HTTPS in production

---

## 📚 Additional Resources

- Laravel Documentation: https://laravel.com/docs
- Laravel Sanctum: https://laravel.com/docs/sanctum
- PostgreSQL Docs: https://www.postgresql.org/docs/

---

## ✅ Verification Checklist

After setup, verify:
- [ ] Server runs without errors
- [ ] Can login as student
- [ ] Can login as admin
- [ ] Can view weekly menu
- [ ] Can create reservation
- [ ] Can recharge wallet
- [ ] Can submit feedback
- [ ] Admin can view statistics

---

**Need help?** Check `README_API.md` for detailed API documentation.

🎉 **Happy Coding!**
