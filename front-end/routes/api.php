<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\StudentAuthController;
use App\Http\Controllers\Auth\AdminAuthController;
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
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::prefix('v1')->group(function () {
    
    // --- Public Routes ---
    
    // Student Authentication
    Route::prefix('student')->group(function () {
        Route::post('/register', [StudentAuthController::class, 'register']);
        Route::post('/login', [StudentAuthController::class, 'login']);
    });

    // Admin Authentication
    Route::prefix('admin')->group(function () {
        Route::post('/login', [AdminAuthController::class, 'login']);
    });

    // --- Student Protected Routes ---
    Route::middleware(['auth:sanctum'])->group(function () {
        
        // Student Logout
        Route::post('/student/logout', [StudentAuthController::class, 'logout']);

        // Weekly Menu
        Route::prefix('menu')->group(function () {
            Route::get('/week', [WeeklyMenuController::class, 'index']);
            Route::get('/{id}', [WeeklyMenuController::class, 'show']);
        });

        // Reservations
        Route::prefix('reservations')->group(function () {
            Route::get('/', [ReservationController::class, 'index']);
            Route::post('/', [ReservationController::class, 'store']);
            Route::get('/{id}', [ReservationController::class, 'show']);
            Route::post('/{id}/cancel', [ReservationController::class, 'cancel']);
        });

        // Wallet
        Route::prefix('wallet')->group(function () {
            Route::get('/', [WalletController::class, 'index']);
            Route::post('/recharge', [WalletController::class, 'recharge']);
        });

        // Feedback
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

    // --- Admin Protected Routes ---
    Route::middleware(['auth:sanctum'])->prefix('admin')->group(function () {
        
        // Admin Logout
        Route::post('/logout', [AdminAuthController::class, 'logout']);

        // Menu Management (CRUD)
        Route::apiResource('menus', AdminMenuController::class);

        // Student Management (CRUD)
        Route::apiResource('students', AdminStudentController::class);
        Route::post('students/{id}/restore', [AdminStudentController::class, 'restore']);

        // Reservations Dashboard
        Route::prefix('reservations')->group(function () {
            Route::get('/', [AdminReservationController::class, 'index']);
            Route::get('/statistics', [AdminReservationController::class, 'statistics']);
            Route::get('/{id}', [AdminReservationController::class, 'show']);
            Route::put('/{id}/status', [AdminReservationController::class, 'updateStatus']);
        });

        // Feedback Management
        Route::prefix('feedback')->group(function () {
            Route::get('/', [AdminFeedbackController::class, 'index']);
            Route::get('/statistics', [AdminFeedbackController::class, 'statistics']);
            Route::get('/{id}', [AdminFeedbackController::class, 'show']);
            Route::delete('/{id}', [AdminFeedbackController::class, 'destroy']);
        });

        // AI Recommendations
        Route::prefix('ai')->group(function () {
            Route::get('/recommendations', [AIRecommendationController::class, 'index']);
            Route::get('/recommendations/saved', [AIRecommendationController::class, 'saved']);
            Route::post('/recommendations', [AIRecommendationController::class, 'store']);
        });
    });
});

// Health check route
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'timestamp' => now()->toISOString(),
    ]);
});
