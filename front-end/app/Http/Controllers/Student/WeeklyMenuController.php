<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Resources\WeeklyMenuResource;
use App\Models\WeeklyMenu;
use Illuminate\Http\Request;

class WeeklyMenuController extends Controller
{
    /**
     * Get the weekly menu.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
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
     * Get a specific menu item.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
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
