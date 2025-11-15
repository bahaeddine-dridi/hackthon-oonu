<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreWeeklyMenuRequest;
use App\Http\Requests\UpdateWeeklyMenuRequest;
use App\Http\Resources\WeeklyMenuResource;
use App\Models\WeeklyMenu;
use Illuminate\Http\Request;

class AdminMenuController extends Controller
{
    /**
     * Display a listing of all menus.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $query = WeeklyMenu::query();

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by day
        if ($request->has('day')) {
            $query->byDay($request->day);
        }

        // Filter by meal type
        if ($request->has('meal_type')) {
            $query->byMealType($request->meal_type);
        }

        $menus = $query->orderBy('day')
            ->orderBy('meal_type')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'message' => 'Menus retrieved successfully',
            'data' => WeeklyMenuResource::collection($menus),
            'meta' => [
                'current_page' => $menus->currentPage(),
                'last_page' => $menus->lastPage(),
                'per_page' => $menus->perPage(),
                'total' => $menus->total(),
            ],
        ], 200);
    }

    /**
     * Store a newly created menu.
     *
     * @param  \App\Http\Requests\StoreWeeklyMenuRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StoreWeeklyMenuRequest $request)
    {
        $menu = WeeklyMenu::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Menu created successfully',
            'data' => new WeeklyMenuResource($menu),
        ], 201);
    }

    /**
     * Display the specified menu.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $menu = WeeklyMenu::with(['feedback', 'reservations'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Menu retrieved successfully',
            'data' => new WeeklyMenuResource($menu),
        ], 200);
    }

    /**
     * Update the specified menu.
     *
     * @param  \App\Http\Requests\UpdateWeeklyMenuRequest  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(UpdateWeeklyMenuRequest $request, $id)
    {
        $menu = WeeklyMenu::findOrFail($id);
        $menu->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Menu updated successfully',
            'data' => new WeeklyMenuResource($menu),
        ], 200);
    }

    /**
     * Remove the specified menu.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $menu = WeeklyMenu::findOrFail($id);
        $menu->delete();

        return response()->json([
            'success' => true,
            'message' => 'Menu deleted successfully',
        ], 200);
    }
}
