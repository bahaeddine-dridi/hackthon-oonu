<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReservationResource;
use App\Http\Resources\StudentResource;
use Illuminate\Http\Request;

class StudentProfileController extends Controller
{
    /**
     * Get the authenticated student's profile.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Request $request)
    {
        $student = $request->user();

        return response()->json([
            'success' => true,
            'message' => 'Profile retrieved successfully',
            'data' => new StudentResource($student),
        ], 200);
    }

    /**
     * Update the authenticated student's profile.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request)
    {
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:students,email,' . $request->user()->id,
            'university' => 'sometimes|string|max:255',
            'password' => 'sometimes|string|min:8|confirmed',
        ]);

        $student = $request->user();
        $data = $request->only(['name', 'email', 'university']);

        if ($request->has('password')) {
            $data['password'] = bcrypt($request->password);
        }

        $student->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data' => new StudentResource($student),
        ], 200);
    }

    /**
     * Get student's reservation history.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function reservationHistory(Request $request)
    {
        $reservations = $request->user()
            ->reservations()
            ->with(['menu'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'message' => 'Reservation history retrieved successfully',
            'data' => ReservationResource::collection($reservations),
            'meta' => [
                'current_page' => $reservations->currentPage(),
                'last_page' => $reservations->lastPage(),
                'per_page' => $reservations->perPage(),
                'total' => $reservations->total(),
            ],
        ], 200);
    }
}
