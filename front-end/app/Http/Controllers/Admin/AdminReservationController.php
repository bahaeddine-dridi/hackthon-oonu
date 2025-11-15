<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReservationResource;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminReservationController extends Controller
{
    /**
     * Display a listing of reservations.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $query = Reservation::with(['student', 'menu']);

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by date
        if ($request->has('date')) {
            $query->byDate($request->date);
        }

        // Filter by student
        if ($request->has('student_id')) {
            $query->where('student_id', $request->student_id);
        }

        // Filter by menu
        if ($request->has('menu_id')) {
            $query->where('menu_id', $request->menu_id);
        }

        $reservations = $query->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'message' => 'Reservations retrieved successfully',
            'data' => ReservationResource::collection($reservations),
            'meta' => [
                'current_page' => $reservations->currentPage(),
                'last_page' => $reservations->lastPage(),
                'per_page' => $reservations->perPage(),
                'total' => $reservations->total(),
            ],
        ], 200);
    }

    /**
     * Display the specified reservation.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $reservation = Reservation::with(['student', 'menu'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Reservation retrieved successfully',
            'data' => new ReservationResource($reservation),
        ], 200);
    }

    /**
     * Update reservation status.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|string|in:pending,confirmed,cancelled,no_show',
        ]);

        $reservation = Reservation::findOrFail($id);
        $reservation->update(['status' => $request->status]);

        return response()->json([
            'success' => true,
            'message' => 'Reservation status updated successfully',
            'data' => new ReservationResource($reservation->load(['student', 'menu'])),
        ], 200);
    }

    /**
     * Get reservation statistics.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function statistics(Request $request)
    {
        $startDate = $request->input('start_date', now()->startOfMonth());
        $endDate = $request->input('end_date', now()->endOfMonth());

        $stats = [
            'total_reservations' => Reservation::whereBetween('date', [$startDate, $endDate])->count(),
            'confirmed' => Reservation::whereBetween('date', [$startDate, $endDate])->confirmed()->count(),
            'pending' => Reservation::whereBetween('date', [$startDate, $endDate])->pending()->count(),
            'cancelled' => Reservation::whereBetween('date', [$startDate, $endDate])->where('status', 'cancelled')->count(),
            'no_show' => Reservation::whereBetween('date', [$startDate, $endDate])->where('status', 'no_show')->count(),
            'revenue' => Reservation::whereBetween('date', [$startDate, $endDate])
                ->where('status', 'confirmed')
                ->sum('price'),
            'by_payment_method' => Reservation::whereBetween('date', [$startDate, $endDate])
                ->select('payment_method', DB::raw('count(*) as count'))
                ->groupBy('payment_method')
                ->get(),
        ];

        return response()->json([
            'success' => true,
            'message' => 'Reservation statistics retrieved successfully',
            'data' => $stats,
        ], 200);
    }
}
