<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReservationRequest;
use App\Http\Resources\ReservationResource;
use App\Models\Reservation;
use App\Models\Student;
use App\Models\WalletTransaction;
use App\Models\WeeklyMenu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReservationController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/v1/reservations",
     *     tags={"Student - Reservations"},
     *     summary="Get all student reservations",
     *     description="Retrieve paginated list of authenticated student's reservations",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="page",
     *         in="query",
     *         description="Page number",
     *         required=false,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="data", type="array", @OA\Items(type="object"))
     *         )
     *     )
     * )
     */
    public function index(Request $request)
    {
        $reservations = $request->user()
            ->reservations()
            ->with(['menu'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

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
     * @OA\Post(
     *     path="/api/v1/reservations",
     *     tags={"Student - Reservations"},
     *     summary="Create new reservation",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"menu_id", "date", "payment_method"},
     *             @OA\Property(property="menu_id", type="integer", example=1),
     *             @OA\Property(property="date", type="string", format="date", example="2024-01-15"),
     *             @OA\Property(property="payment_method", type="string", enum={"wallet", "points", "cash"}, example="wallet")
     *         )
     *     ),
     *     @OA\Response(response=201, description="Reservation created"),
     *     @OA\Response(response=400, description="Insufficient balance or unavailable menu")
     * )
     */
    public function store(StoreReservationRequest $request)
    {
        $student = $request->user();
        $menu = WeeklyMenu::findOrFail($request->menu_id);

        // Check if menu is available
        if ($menu->status !== 'available') {
            return response()->json([
                'success' => false,
                'message' => 'This menu is not available for reservation',
            ], 400);
        }

        // Default price (can be customized)
        $price = 3.50;

        // Check payment method
        if ($request->payment_method === 'wallet') {
            if ($student->wallet_balance < $price) {
                return response()->json([
                    'success' => false,
                    'message' => 'Insufficient wallet balance',
                ], 400);
            }
        } elseif ($request->payment_method === 'points') {
            $requiredPoints = 100; // Example: 100 points = 1 meal
            if ($student->points < $requiredPoints) {
                return response()->json([
                    'success' => false,
                    'message' => 'Insufficient points',
                ], 400);
            }
        }

        DB::beginTransaction();
        try {
            // Create reservation
            $reservation = Reservation::create([
                'student_id' => $student->id,
                'menu_id' => $request->menu_id,
                'date' => $request->date,
                'status' => 'confirmed',
                'payment_method' => $request->payment_method,
                'price' => $price,
            ]);

            // Process payment
            if ($request->payment_method === 'wallet') {
                $student->decrement('wallet_balance', $price);
                
                WalletTransaction::create([
                    'student_id' => $student->id,
                    'amount' => $price,
                    'type' => 'debit',
                    'description' => 'Reservation payment for ' . $menu->title,
                ]);
            } elseif ($request->payment_method === 'points') {
                $student->decrement('points', 100);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Reservation created successfully',
                'data' => new ReservationResource($reservation->load('menu')),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to create reservation',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/api/v1/reservations/{id}",
     *     tags={"Student - Reservations"},
     *     summary="Get specific reservation",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Success"),
     *     @OA\Response(response=404, description="Not found")
     * )
     */
    public function show(Request $request, $id)
    {
        $reservation = $request->user()
            ->reservations()
            ->with(['menu'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Reservation retrieved successfully',
            'data' => new ReservationResource($reservation),
        ], 200);
    }

    /**
     * @OA\Post(
     *     path="/api/v1/reservations/{id}/cancel",
     *     tags={"Student - Reservations"},
     *     summary="Cancel reservation",
     *     description="Cancel a reservation and process refund if applicable",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Cancelled successfully"),
     *     @OA\Response(response=400, description="Already cancelled")
     * )
     */
    public function cancel(Request $request, $id)
    {
        $reservation = $request->user()
            ->reservations()
            ->findOrFail($id);

        if ($reservation->status === 'cancelled') {
            return response()->json([
                'success' => false,
                'message' => 'Reservation is already cancelled',
            ], 400);
        }

        DB::beginTransaction();
        try {
            $reservation->update(['status' => 'cancelled']);

            // Refund if paid with wallet
            if ($reservation->payment_method === 'wallet') {
                $student = $request->user();
                $student->increment('wallet_balance', $reservation->price);

                WalletTransaction::create([
                    'student_id' => $student->id,
                    'amount' => $reservation->price,
                    'type' => 'credit',
                    'description' => 'Refund for cancelled reservation',
                ]);
            } elseif ($reservation->payment_method === 'points') {
                $request->user()->increment('points', 100);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Reservation cancelled successfully',
                'data' => new ReservationResource($reservation),
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to cancel reservation',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
