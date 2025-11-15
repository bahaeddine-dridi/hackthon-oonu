<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFeedbackRequest;
use App\Http\Resources\FeedbackResource;
use App\Models\Feedback;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/v1/feedback",
     *     tags={"Student - Feedback"},
     *     summary="Get student feedback history",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Success")
     * )
     */
    public function index(Request $request)
    {
        $feedback = $request->user()
            ->feedback()
            ->with(['menu'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

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
     * @OA\Post(
     *     path="/api/v1/feedback",
     *     tags={"Student - Feedback"},
     *     summary="Submit feedback",
     *     description="Submit feedback for a menu and earn 10 points",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"menu_id", "rating", "category"},
     *             @OA\Property(property="menu_id", type="integer", example=1),
     *             @OA\Property(property="rating", type="integer", minimum=1, maximum=5, example=4),
     *             @OA\Property(property="category", type="string", enum={"taste", "quality", "service", "cleanliness"}, example="taste"),
     *             @OA\Property(property="comment", type="string", example="Great meal!")
     *         )
     *     ),
     *     @OA\Response(response=201, description="Feedback submitted")
     * )
     */
    public function store(StoreFeedbackRequest $request)
    {
        $feedback = Feedback::create([
            'student_id' => $request->user()->id,
            'menu_id' => $request->menu_id,
            'rating' => $request->rating,
            'category' => $request->category,
            'comment' => $request->comment,
        ]);

        // Award points for feedback
        $request->user()->increment('points', 10);

        return response()->json([
            'success' => true,
            'message' => 'Feedback submitted successfully. You earned 10 points!',
            'data' => new FeedbackResource($feedback->load('menu')),
        ], 201);
    }

    /**
     * @OA\Get(
     *     path="/api/v1/feedback/{id}",
     *     tags={"Student - Feedback"},
     *     summary="Get specific feedback",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Success")
     * )
     */
    public function show(Request $request, $id)
    {
        $feedback = $request->user()
            ->feedback()
            ->with(['menu'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Feedback retrieved successfully',
            'data' => new FeedbackResource($feedback),
        ], 200);
    }
}
