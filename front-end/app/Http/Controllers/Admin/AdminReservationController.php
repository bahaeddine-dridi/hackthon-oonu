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
     * @OA\Get(
     *     path="/admin/reservations",
     *     tags={"Admin - Reservation Management"},
     *     summary="Get all reservations",
     *     description="Retrieve paginated list of all reservations with filter options",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="status",
     *         in="query",
     *         description="Filter by status",
     *         required=false,
     *         @OA\Schema(type="string", enum={"pending", "confirmed", "cancelled", "no_show"})
     *     ),
     *     @OA\Parameter(
     *         name="date",
     *         in="query",
     *         description="Filter by date (YYYY-MM-DD)",
     *         required=false,
     *         @OA\Schema(type="string", format="date")
     *     ),
     *     @OA\Parameter(
     *         name="student_id",
     *         in="query",
     *         description="Filter by student ID",
     *         required=false,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Parameter(
     *         name="menu_id",
     *         in="query",
     *         description="Filter by menu ID",
     *         required=false,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Reservations retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="data", type="array", @OA\Items(type="object")),
     *             @OA\Property(property="meta", type="object")
     *         )
     *     )
     * )
     *
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
     * @OA\Get(
     *     path="/admin/reservations/{id}",
     *     tags={"Admin - Reservation Management"},
     *     summary="Get specific reservation",
     *     description="Retrieve detailed information about a reservation",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Reservation retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(response=404, description="Reservation not found")
     * )
     *
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
     * @OA\Put(
     *     path="/admin/reservations/{id}/status",
     *     tags={"Admin - Reservation Management"},
     *     summary="Update reservation status",
     *     description="Change the status of a reservation",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"status"},
     *             @OA\Property(property="status", type="string", enum={"pending", "confirmed", "cancelled", "no_show"}, example="confirmed")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Status updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(response=404, description="Reservation not found"),
     *     @OA\Response(response=422, description="Validation error")
     * )
     *
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
     * @OA\Get(
     *     path="/admin/reservations/statistics",
     *     tags={"Admin - Statistics"},
     *     summary="Get reservation statistics",
     *     description="Retrieve comprehensive reservation statistics including counts by status and revenue",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="start_date",
     *         in="query",
     *         description="Start date for statistics (YYYY-MM-DD)",
     *         required=false,
     *         @OA\Schema(type="string", format="date")
     *     ),
     *     @OA\Parameter(
     *         name="end_date",
     *         in="query",
     *         description="End date for statistics (YYYY-MM-DD)",
     *         required=false,
     *         @OA\Schema(type="string", format="date")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Statistics retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="data", type="object",
     *                 @OA\Property(property="total_reservations", type="integer"),
     *                 @OA\Property(property="confirmed", type="integer"),
     *                 @OA\Property(property="pending", type="integer"),
     *                 @OA\Property(property="cancelled", type="integer"),
     *                 @OA\Property(property="no_show", type="integer"),
     *                 @OA\Property(property="revenue", type="number", format="float"),
     *                 @OA\Property(property="by_payment_method", type="array", @OA\Items(type="object"))
     *             )
     *         )
     *     )
     * )
     *
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
