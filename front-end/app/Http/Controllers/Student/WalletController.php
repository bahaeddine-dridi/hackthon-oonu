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
     * Get wallet balance and transactions.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
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
     * Recharge wallet.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
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
