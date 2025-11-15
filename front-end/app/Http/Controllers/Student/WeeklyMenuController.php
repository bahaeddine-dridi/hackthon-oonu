<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Resources\WeeklyMenuResource;
use App\Models\WeeklyMenu;
use Illuminate\Http\Request;

class WeeklyMenuController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/v1/menu/week",
     *     tags={"Student - Menu"},
     *     summary="Get weekly menu",
     *     description="Retrieve the weekly menu with optional filters",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="day",
     *         in="query",
     *         description="Filter by day (monday, tuesday, etc.)",
     *         required=false,
     *         @OA\Schema(type="string", enum={"monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"})
     *     ),
     *     @OA\Parameter(
     *         name="meal_type",
     *         in="query",
     *         description="Filter by meal type",
     *         required=false,
     *         @OA\Schema(type="string", enum={"breakfast", "lunch", "dinner"})
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Weekly menu retrieved successfully"),
     *             @OA\Property(property="data", type="array", @OA\Items(type="object"))
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthorized")
     * )
     */
    public function index(Request $request)
    {
        $query = WeeklyMenu::query()->available();

        // Filter by day if provided
        if ($request->has('day')) {
            $query->byDay($request->day);
        }

        // Filter by meal type if provided
        if ($request->has('meal_type')) {
            $query->byMealType($request->meal_type);
        }

        $menus = $query->orderBy('day')
            ->orderBy('meal_type')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Weekly menu retrieved successfully',
            'data' => WeeklyMenuResource::collection($menus),
        ], 200);
    }

    /**
     * @OA\Get(
     *     path="/api/v1/menu/{id}",
     *     tags={"Student - Menu"},
     *     summary="Get specific menu item",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="Success"),
     *     @OA\Response(response=404, description="Menu not found")
     * )
     */
    public function show($id)
    {
        $menu = WeeklyMenu::findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Menu item retrieved successfully',
            'data' => new WeeklyMenuResource($menu),
        ], 200);
    }
}
