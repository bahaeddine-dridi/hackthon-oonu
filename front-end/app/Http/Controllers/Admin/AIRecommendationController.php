<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AIRecommendationResource;
use App\Models\AIRecommendation;
use Illuminate\Http\Request;

class AIRecommendationController extends Controller
{
    /**
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
