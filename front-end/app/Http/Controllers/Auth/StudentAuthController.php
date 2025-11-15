<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\StudentResource;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class StudentAuthController extends Controller
{
    /**
     * Handle student login request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $request->validate([
            'student_id' => 'required|string',
            'password' => 'required|string',
        ]);

        $student = Student::where('student_id', $request->student_id)
            ->where('active', true)
            ->first();

        if (!$student || !Hash::check($request->password, $student->password)) {
            throw ValidationException::withMessages([
                'student_id' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Revoke previous tokens
        $student->tokens()->delete();

        // Create new token
        $token = $student->createToken('student-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'student' => new StudentResource($student),
                'token' => $token,
            ],
        ], 200);
    }

    /**
     * Handle student logout request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout successful',
        ], 200);
    }

    /**
     * Handle student registration request (optional OTP placeholder).
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        $request->validate([
            'student_id' => 'required|string|unique:students,student_id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:students,email',
            'university' => 'required|string|max:255',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $student = Student::create([
            'student_id' => $request->student_id,
            'name' => $request->name,
            'email' => $request->email,
            'university' => $request->university,
            'password' => Hash::make($request->password),
        ]);

        $token = $student->createToken('student-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Registration successful',
            'data' => [
                'student' => new StudentResource($student),
                'token' => $token,
            ],
        ], 201);
    }
}
