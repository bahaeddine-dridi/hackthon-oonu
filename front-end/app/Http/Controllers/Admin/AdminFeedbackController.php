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
     * @OA\Get(
     *     path="/admin/feedback",
     *     tags={"Admin - Feedback Management"},
     *     summary="Get all feedback",
     *     description="Retrieve paginated list of feedback with filtering options",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="rating",
     *         in="query",
     *         description="Filter by rating (1-5)",
     *         required=false,
     *         @OA\Schema(type="integer", minimum=1, maximum=5)
     *     ),
     *     @OA\Parameter(
     *         name="category",
     *         in="query",
     *         description="Filter by category",
     *         required=false,
     *         @OA\Schema(type="string", enum={"taste", "quality", "service", "cleanliness"})
     *     ),
     *     @OA\Parameter(
     *         name="sentiment",
     *         in="query",
     *         description="Filter by sentiment",
     *         required=false,
     *         @OA\Schema(type="string", enum={"positive", "neutral", "negative"})
     *     ),
     *     @OA\Parameter(
     *         name="menu_id",
     *         in="query",
     *         description="Filter by menu ID",
     *         required=false,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Parameter(
     *         name="student_id",
     *         in="query",
     *         description="Filter by student ID",
     *         required=false,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Feedback retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="data", type="array", @OA\Items(type="object")),
     *             @OA\Property(property="meta", type="object")
     *         )
     *     )
     * )
     *
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
     * @OA\Get(
     *     path="/admin/feedback/{id}",
     *     tags={"Admin - Feedback Management"},
     *     summary="Get specific feedback",
     *     description="Retrieve detailed information about a feedback entry",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Feedback retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(response=404, description="Feedback not found")
     * )
     *
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
     * @OA\Get(
     *     path="/admin/feedback/statistics",
     *     tags={"Admin - Statistics"},
     *     summary="Get feedback statistics",
     *     description="Retrieve comprehensive feedback statistics including averages and distribution",
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
     *                 @OA\Property(property="total_feedback", type="integer"),
     *                 @OA\Property(property="average_rating", type="number", format="float"),
     *                 @OA\Property(property="by_rating", type="array", @OA\Items(type="object")),
     *                 @OA\Property(property="by_category", type="array", @OA\Items(type="object")),
     *                 @OA\Property(property="by_sentiment", type="array", @OA\Items(type="object"))
     *             )
     *         )
     *     )
     * )
     *
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
     * @OA\Delete(
     *     path="/admin/feedback/{id}",
     *     tags={"Admin - Feedback Management"},
     *     summary="Delete feedback",
     *     description="Remove a feedback entry from the system",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Feedback deleted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="message", type="string")
     *         )
     *     ),
     *     @OA\Response(response=404, description="Feedback not found")
     * )
     *
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
