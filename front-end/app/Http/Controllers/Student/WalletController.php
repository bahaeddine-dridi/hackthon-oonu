<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Resources\WalletTransactionResource;
use App\Models\WalletTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WalletController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/v1/wallet",
     *     tags={"Student - Wallet"},
     *     summary="Get wallet balance and transactions",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="page", in="query", required=false, @OA\Schema(type="integer")),
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="data", type="object",
     *                 @OA\Property(property="balance", type="number", format="float", example=50.00),
     *                 @OA\Property(property="transactions", type="array", @OA\Items(type="object"))
     *             )
     *         )
     *     )
     * )
     */
    public function index(Request $request)
    {
        $student = $request->user();
        $transactions = $student->walletTransactions()
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'message' => 'Wallet data retrieved successfully',
            'data' => [
                'balance' => (float) $student->wallet_balance,
                'transactions' => WalletTransactionResource::collection($transactions),
            ],
            'meta' => [
                'current_page' => $transactions->currentPage(),
                'last_page' => $transactions->lastPage(),
                'per_page' => $transactions->perPage(),
                'total' => $transactions->total(),
            ],
        ], 200);
    }

    /**
     * @OA\Post(
     *     path="/api/v1/wallet/recharge",
     *     tags={"Student - Wallet"},
     *     summary="Recharge wallet",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"amount"},
     *             @OA\Property(property="amount", type="number", format="float", example=25.00, minimum=1, maximum=1000),
     *             @OA\Property(property="payment_reference", type="string", example="REF123456")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Recharged successfully"),
     *     @OA\Response(response=422, description="Validation error")
     * )
     */
    public function recharge(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1|max:1000',
            'payment_reference' => 'nullable|string',
        ]);

        $student = $request->user();

        DB::beginTransaction();
        try {
            // Increment wallet balance
            $student->increment('wallet_balance', $request->amount);

            // Create transaction record
            $transaction = WalletTransaction::create([
                'student_id' => $student->id,
                'amount' => $request->amount,
                'type' => 'credit',
                'description' => 'Wallet recharge' . ($request->payment_reference ? ' - Ref: ' . $request->payment_reference : ''),
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Wallet recharged successfully',
                'data' => [
                    'new_balance' => (float) $student->fresh()->wallet_balance,
                    'transaction' => new WalletTransactionResource($transaction),
                ],
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to recharge wallet',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
