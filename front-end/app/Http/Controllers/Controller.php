<?php

namespace App\Http\Controllers;

/**
 * @OA\Info(
 *     version="1.0.0",
 *     title="OOUN Restaurant API Documentation",
 *     description="University Restaurant Management System API - OOUN Tunisia",
 *     @OA\Contact(
 *         name="OOUN Restaurant System",
 *         email="admin@ooun.tn"
 *     )
 * )
 * 
 * @OA\Server(
 *     url="http://localhost:8000/api/v1",
 *     description="Development Server"
 * )
 * 
 * @OA\SecurityScheme(
 *     securityScheme="bearerAuth",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT",
 *     description="Enter your Bearer token in the format: Bearer {token}"
 * )
 * 
 * @OA\Tag(
 *     name="Authentication",
 *     description="Student and Admin authentication endpoints"
 * )
 * 
 * @OA\Tag(
 *     name="Student - Menu",
 *     description="Weekly menu operations for students"
 * )
 * 
 * @OA\Tag(
 *     name="Student - Reservations",
 *     description="Meal reservation management"
 * )
 * 
 * @OA\Tag(
 *     name="Student - Wallet",
 *     description="Wallet and payment operations"
 * )
 * 
 * @OA\Tag(
 *     name="Student - Feedback",
 *     description="Feedback and rating system"
 * )
 * 
 * @OA\Tag(
 *     name="Student - Profile",
 *     description="Student profile management"
 * )
 * 
 * @OA\Tag(
 *     name="Admin - Menu Management",
 *     description="Admin menu CRUD operations"
 * )
 * 
 * @OA\Tag(
 *     name="Admin - Student Management",
 *     description="Admin student management"
 * )
 * 
 * @OA\Tag(
 *     name="Admin - Statistics",
 *     description="System statistics and analytics"
 * )
 */
abstract class Controller
{
    //
}
