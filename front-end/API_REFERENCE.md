# 🗺️ API Endpoints Quick Reference

Base URL: `http://localhost:8000/api/v1`

---

## 🔐 Authentication

### Student
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/student/register` | Register new student | No |
| POST | `/student/login` | Student login | No |
| POST | `/student/logout` | Student logout | Yes |

### Admin
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/admin/login` | Admin login | No |
| POST | `/admin/logout` | Admin logout | Yes |

---

## 👨‍🎓 Student Endpoints

### Menu
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/menu/week` | Get weekly menu | Yes |
| GET | `/menu/{id}` | Get menu item | Yes |

### Reservations
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/reservations` | List reservations | Yes |
| POST | `/reservations` | Create reservation | Yes |
| GET | `/reservations/{id}` | Get reservation | Yes |
| POST | `/reservations/{id}/cancel` | Cancel reservation | Yes |

### Wallet
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/wallet` | Get balance & transactions | Yes |
| POST | `/wallet/recharge` | Recharge wallet | Yes |

### Feedback
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/feedback` | List feedback | Yes |
| POST | `/feedback` | Submit feedback | Yes |
| GET | `/feedback/{id}` | Get feedback | Yes |

### Profile
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/profile` | Get profile | Yes |
| PUT | `/profile` | Update profile | Yes |
| GET | `/profile/history` | Reservation history | Yes |

---

## 👨‍💼 Admin Endpoints

### Menu Management
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/admin/menus` | List all menus | Yes |
| POST | `/admin/menus` | Create menu | Yes |
| GET | `/admin/menus/{id}` | Get menu | Yes |
| PUT | `/admin/menus/{id}` | Update menu | Yes |
| DELETE | `/admin/menus/{id}` | Delete menu | Yes |

### Student Management
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/admin/students` | List students | Yes |
| POST | `/admin/students` | Create student | Yes |
| GET | `/admin/students/{id}` | Get student | Yes |
| PUT | `/admin/students/{id}` | Update student | Yes |
| DELETE | `/admin/students/{id}` | Delete student | Yes |
| POST | `/admin/students/{id}/restore` | Restore student | Yes |

### Reservation Management
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/admin/reservations` | List reservations | Yes |
| GET | `/admin/reservations/statistics` | Get statistics | Yes |
| GET | `/admin/reservations/{id}` | Get reservation | Yes |
| PUT | `/admin/reservations/{id}/status` | Update status | Yes |

### Feedback Management
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/admin/feedback` | List feedback | Yes |
| GET | `/admin/feedback/statistics` | Get statistics | Yes |
| GET | `/admin/feedback/{id}` | Get feedback | Yes |
| DELETE | `/admin/feedback/{id}` | Delete feedback | Yes |

### AI Recommendations
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/admin/ai/recommendations` | Get AI recommendations | Yes |
| GET | `/admin/ai/recommendations/saved` | Get saved recommendations | Yes |
| POST | `/admin/ai/recommendations` | Save recommendation | Yes |

---

## 📊 Query Parameters

### Menu Filters
- `day` - Mon, Tue, Wed, Thu, Fri, Sat, Sun
- `meal_type` - breakfast, lunch, dinner
- `status` - available, unavailable

### Reservation Filters
- `status` - pending, confirmed, cancelled, no_show
- `date` - YYYY-MM-DD
- `student_id` - Filter by student
- `menu_id` - Filter by menu

### Feedback Filters
- `rating` - 1-5
- `category` - taste, timing, service, hygiene
- `sentiment` - positive, neutral, negative
- `menu_id` - Filter by menu
- `student_id` - Filter by student

### Student Filters
- `search` - Search name, email, student_id
- `active` - true/false
- `university` - Filter by university

### Statistics Date Range
- `start_date` - YYYY-MM-DD
- `end_date` - YYYY-MM-DD

---

## 📝 Request Body Examples

### Student Login
```json
{
  "student_id": "STU001",
  "password": "password123"
}
```

### Create Reservation
```json
{
  "menu_id": 1,
  "date": "2024-01-15",
  "payment_method": "wallet"
}
```

### Recharge Wallet
```json
{
  "amount": 50.00,
  "payment_reference": "REF123456"
}
```

### Submit Feedback
```json
{
  "menu_id": 1,
  "rating": 5,
  "category": "taste",
  "comment": "Excellent meal!"
}
```

### Create Menu
```json
{
  "day": "Mon",
  "meal_type": "lunch",
  "title": "Couscous",
  "tags": ["vegetarian", "halal"],
  "status": "available"
}
```

### Update Reservation Status
```json
{
  "status": "confirmed"
}
```

---

## 🔑 Authentication Header

All protected endpoints require:
```
Authorization: Bearer {token}
```

Get token from login response:
```json
{
  "success": true,
  "data": {
    "token": "1|abc123def456...",
    ...
  }
}
```

---

## ✅ Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "message": "Error description",
  "errors": { ... }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 20,
    "total": 100
  }
}
```

---

## 🎯 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Server Error

---

## 🧪 Testing with cURL

### Login
```bash
curl -X POST http://localhost:8000/api/v1/student/login \
  -H "Content-Type: application/json" \
  -d '{"student_id":"STU001","password":"password123"}'
```

### Get Menu (with auth)
```bash
curl -X GET http://localhost:8000/api/v1/menu/week \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📦 Test Credentials

**Admin:**
- Email: `admin@ooun.tn`
- Password: `admin123`

**Students:**
- Student ID: `STU001` / Password: `password123`
- Student ID: `STU002` / Password: `password123`
- Student ID: `STU003` / Password: `password123`

---

**Print this for quick reference! 📄**
