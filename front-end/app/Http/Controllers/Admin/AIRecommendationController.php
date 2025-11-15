<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AIRecommendationResource;
use App\Models\AIRecommendation;
use Illuminate\Http\Request;

class AIRecommendationController extends Controller
{
    /**
     * @OA\Get(
     *     path="/admin/ai/recommendations",
     *     tags={"Admin - AI Recommendations"},
     *     summary="Get AI recommendations",
     *     description="Retrieve AI-generated recommendations based on feedback analysis (placeholder implementation)",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Recommendations retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="data", type="array", @OA\Items(
     *                 @OA\Property(property="id", type="integer"),
     *                 @OA\Property(property="title", type="string"),
     *                 @OA\Property(property="content", type="string"),
     *                 @OA\Property(property="confidence", type="number", format="float"),
     *                 @OA\Property(property="category", type="string")
     *             )),
     *             @OA\Property(property="note", type="string")
     *         )
     *     )
     * )
     *
     * Display a listing of AI recommendations (placeholder).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        // Placeholder: Generate static recommendations
        $recommendations = $this->generatePlaceholderRecommendations();

        return response()->json([
            'success' => true,
            'message' => 'AI recommendations retrieved successfully',
            'data' => $recommendations,
            'note' => 'This is a placeholder endpoint. Integrate with actual AI service for real recommendations.',
        ], 200);
    }

    /**
     * Generate placeholder AI recommendations.
     *
     * @return array
     */
    private function generatePlaceholderRecommendations()
    {
        return [
            [
                'id' => 1,
                'title' => 'Increase Vegetarian Options',
                'content' => 'Based on feedback analysis, 35% of students requested more vegetarian meal options. Consider adding 2-3 vegetarian dishes per week.',
                'confidence' => 0.85,
                'category' => 'menu_optimization',
            ],
            [
                'id' => 2,
                'title' => 'Improve Lunch Service Speed',
                'content' => 'Lunch service feedback shows timing issues with an average rating of 2.8. Consider adding more service counters during peak hours.',
                'confidence' => 0.78,
                'category' => 'service_improvement',
            ],
            [
                'id' => 3,
                'title' => 'Popular Menu Items',
                'content' => 'The following dishes have the highest reservation rates: Couscous (45%), Grilled Chicken (38%), and Pasta (32%). Consider featuring these more often.',
                'confidence' => 0.92,
                'category' => 'menu_popularity',
            ],
            [
                'id' => 4,
                'title' => 'Reduce Food Waste',
                'content' => 'Thursday dinners have a 25% no-show rate. Consider implementing a reminder system or adjusting portion preparation.',
                'confidence' => 0.71,
                'category' => 'operational_efficiency',
            ],
            [
                'id' => 5,
                'title' => 'Hygiene Improvement Needed',
                'content' => 'Recent feedback indicates hygiene ratings dropped to 3.2 stars. Immediate attention required in dining area cleanliness.',
                'confidence' => 0.89,
                'category' => 'hygiene',
            ],
        ];
    }

    /**
     * @OA\Post(
     *     path="/admin/ai/recommendations",
     *     tags={"Admin - AI Recommendations"},
     *     summary="Save AI recommendation",
     *     description="Store an AI recommendation in the database",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"title", "content"},
     *             @OA\Property(property="title", type="string", example="Improve Service Speed"),
     *             @OA\Property(property="content", type="string", example="Based on analysis, consider adding more service counters")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Recommendation saved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(response=422, description="Validation error")
     * )
     *
     * Store AI recommendations in database (optional).
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $recommendation = AIRecommendation::create($request->only(['title', 'content']));

        return response()->json([
            'success' => true,
            'message' => 'Recommendation saved successfully',
            'data' => new AIRecommendationResource($recommendation),
        ], 201);
    }

    /**
     * @OA\Get(
     *     path="/admin/ai/recommendations/saved",
     *     tags={"Admin - AI Recommendations"},
     *     summary="Get saved recommendations",
     *     description="Retrieve previously saved AI recommendations from database",
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
     *         description="Saved recommendations retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="data", type="array", @OA\Items(type="object")),
     *             @OA\Property(property="meta", type="object")
     *         )
     *     )
     * )
     *
     * Get saved recommendations from database.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function saved()
    {
        $recommendations = AIRecommendation::orderBy('created_at', 'desc')->paginate(10);

        return response()->json([
            'success' => true,
            'message' => 'Saved recommendations retrieved successfully',
            'data' => AIRecommendationResource::collection($recommendations),
            'meta' => [
                'current_page' => $recommendations->currentPage(),
                'last_page' => $recommendations->lastPage(),
                'per_page' => $recommendations->perPage(),
                'total' => $recommendations->total(),
            ],
        ], 200);
    }
}
