<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\FeedbackResource;
use App\Models\Feedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminFeedbackController extends Controller
{
    /**
     * Display a listing of feedback.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $query = Feedback::with(['student', 'menu']);

        // Filter by rating
        if ($request->has('rating')) {
            $query->byRating($request->rating);
        }

        // Filter by category
        if ($request->has('category')) {
            $query->byCategory($request->category);
        }

        // Filter by sentiment
        if ($request->has('sentiment')) {
            $query->where('sentiment', $request->sentiment);
        }

        // Filter by menu
        if ($request->has('menu_id')) {
            $query->where('menu_id', $request->menu_id);
        }

        // Filter by student
        if ($request->has('student_id')) {
            $query->where('student_id', $request->student_id);
        }

        $feedback = $query->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'message' => 'Feedback retrieved successfully',
            'data' => FeedbackResource::collection($feedback),
            'meta' => [
                'current_page' => $feedback->currentPage(),
                'last_page' => $feedback->lastPage(),
                'per_page' => $feedback->perPage(),
                'total' => $feedback->total(),
            ],
        ], 200);
    }

    /**
     * Display the specified feedback.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $feedback = Feedback::with(['student', 'menu'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Feedback retrieved successfully',
            'data' => new FeedbackResource($feedback),
        ], 200);
    }

    /**
     * Get feedback statistics.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function statistics(Request $request)
    {
        $startDate = $request->input('start_date', now()->startOfMonth());
        $endDate = $request->input('end_date', now()->endOfMonth());

        $stats = [
            'total_feedback' => Feedback::whereBetween('created_at', [$startDate, $endDate])->count(),
            'average_rating' => round(Feedback::whereBetween('created_at', [$startDate, $endDate])->avg('rating'), 2),
            'by_rating' => Feedback::whereBetween('created_at', [$startDate, $endDate])
                ->select('rating', DB::raw('count(*) as count'))
                ->groupBy('rating')
                ->orderBy('rating')
                ->get(),
            'by_category' => Feedback::whereBetween('created_at', [$startDate, $endDate])
                ->whereNotNull('category')
                ->select('category', DB::raw('count(*) as count'), DB::raw('avg(rating) as avg_rating'))
                ->groupBy('category')
                ->get(),
            'by_sentiment' => Feedback::whereBetween('created_at', [$startDate, $endDate])
                ->select('sentiment', DB::raw('count(*) as count'))
                ->groupBy('sentiment')
                ->get(),
        ];

        return response()->json([
            'success' => true,
            'message' => 'Feedback statistics retrieved successfully',
            'data' => $stats,
        ], 200);
    }

    /**
     * Delete feedback.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $feedback = Feedback::findOrFail($id);
        $feedback->delete();

        return response()->json([
            'success' => true,
            'message' => 'Feedback deleted successfully',
        ], 200);
    }
}
