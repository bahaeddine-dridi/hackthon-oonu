<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AdminAuthController;
use App\Http\Controllers\Auth\StudentAuthController;
use App\Http\Controllers\Student\WeeklyMenuController;
use App\Http\Controllers\Student\ReservationController;
use App\Http\Controllers\Student\WalletController;
use App\Http\Controllers\Student\FeedbackController;
use App\Http\Controllers\Student\StudentProfileController;
use App\Http\Controllers\Admin\AdminMenuController;
use App\Http\Controllers\Admin\AdminStudentController;
use App\Http\Controllers\Admin\AdminReservationController;
use App\Http\Controllers\Admin\AdminFeedbackController;
use App\Http\Controllers\Admin\AIRecommendationController;

/*
|--------------------------------------------------------------------------
| API Routes - Version 1
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    
    // ========================================
    // Public Authentication Routes
    // ========================================
    
    // Admin Authentication
    Route::prefix('admin')->group(function () {
        Route::post('/login', [AdminAuthController::class, 'login']);
    });
    
    // Student Authentication
    Route::prefix('student')->group(function () {
        Route::post('/login', [StudentAuthController::class, 'login']);
        Route::post('/register', [StudentAuthController::class, 'register']);
    });
    
    // ========================================
    // Student Protected Routes
    // ========================================
    
    Route::middleware(['auth:sanctum'])->group(function () {
        
        // Student Logout
        Route::prefix('student')->group(function () {
            Route::post('/logout', [StudentAuthController::class, 'logout']);
        });
        
        // Weekly Menu (Student)
        Route::prefix('menu')->group(function () {
            Route::get('/week', [WeeklyMenuController::class, 'index']);
            Route::get('/{id}', [WeeklyMenuController::class, 'show']);
        });
        
        // Reservations (Student)
        Route::prefix('reservations')->group(function () {
            Route::get('/', [ReservationController::class, 'index']);
            Route::post('/', [ReservationController::class, 'store']);
            Route::get('/{id}', [ReservationController::class, 'show']);
            Route::post('/{id}/cancel', [ReservationController::class, 'cancel']);
        });
        
        // Wallet (Student)
        Route::prefix('wallet')->group(function () {
            Route::get('/', [WalletController::class, 'index']);
            Route::post('/recharge', [WalletController::class, 'recharge']);
        });
        
        // Feedback (Student)
        Route::prefix('feedback')->group(function () {
            Route::get('/', [FeedbackController::class, 'index']);
            Route::post('/', [FeedbackController::class, 'store']);
            Route::get('/{id}', [FeedbackController::class, 'show']);
        });
        
        // Student Profile
        Route::prefix('profile')->group(function () {
            Route::get('/', [StudentProfileController::class, 'show']);
            Route::put('/', [StudentProfileController::class, 'update']);
            Route::get('/history', [StudentProfileController::class, 'reservationHistory']);
        });
        
    });
    
    // ========================================
    // Admin Protected Routes
    // ========================================
    
    Route::middleware(['auth:sanctum'])->prefix('admin')->group(function () {
        
        // Admin Logout
        Route::post('/logout', [AdminAuthController::class, 'logout']);
        
        // Menu Management (Admin)
        Route::prefix('menus')->group(function () {
            Route::get('/', [AdminMenuController::class, 'index']);
            Route::post('/', [AdminMenuController::class, 'store']);
            Route::get('/{id}', [AdminMenuController::class, 'show']);
            Route::put('/{id}', [AdminMenuController::class, 'update']);
            Route::delete('/{id}', [AdminMenuController::class, 'destroy']);
        });
        
        // Student Management (Admin)
        Route::prefix('students')->group(function () {
            Route::get('/', [AdminStudentController::class, 'index']);
            Route::post('/', [AdminStudentController::class, 'store']);
            Route::get('/{id}', [AdminStudentController::class, 'show']);
            Route::put('/{id}', [AdminStudentController::class, 'update']);
            Route::delete('/{id}', [AdminStudentController::class, 'destroy']);
        });
        
        // Reservation Management (Admin)
        Route::prefix('reservations')->group(function () {
            Route::get('/', [AdminReservationController::class, 'index']);
            Route::get('/statistics', [AdminReservationController::class, 'statistics']);
            Route::get('/{id}', [AdminReservationController::class, 'show']);
            Route::put('/{id}/status', [AdminReservationController::class, 'updateStatus']);
        });
        
        // Feedback Management (Admin)
        Route::prefix('feedback')->group(function () {
            Route::get('/', [AdminFeedbackController::class, 'index']);
            Route::get('/statistics', [AdminFeedbackController::class, 'statistics']);
            Route::get('/{id}', [AdminFeedbackController::class, 'show']);
            Route::delete('/{id}', [AdminFeedbackController::class, 'destroy']);
        });
        
        // AI Recommendations (Admin)
        Route::prefix('ai')->group(function () {
            Route::get('/recommendations', [AIRecommendationController::class, 'index']);
            Route::post('/recommendations', [AIRecommendationController::class, 'store']);
            Route::get('/recommendations/saved', [AIRecommendationController::class, 'saved']);
        });
        
    });
    
});

// Legacy route (kept for backward compatibility)
Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});
