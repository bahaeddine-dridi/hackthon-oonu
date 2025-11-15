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
     * Get all feedback submitted by the student.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
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
     * Submit new feedback.
     *
     * @param  \App\Http\Requests\StoreFeedbackRequest  $request
     * @return \Illuminate\Http\JsonResponse
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
     * Show specific feedback.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
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
