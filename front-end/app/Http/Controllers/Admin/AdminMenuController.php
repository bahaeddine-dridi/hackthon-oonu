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
     * @OA\Get(
     *     path="/admin/menus",
     *     tags={"Admin - Menu Management"},
     *     summary="Get all menus",
     *     description="Retrieve paginated list of all weekly menus with optional filters",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="status",
     *         in="query",
     *         description="Filter by status",
     *         required=false,
     *         @OA\Schema(type="string", enum={"available", "unavailable"})
     *     ),
     *     @OA\Parameter(
     *         name="day",
     *         in="query",
     *         description="Filter by day",
     *         required=false,
     *         @OA\Schema(type="string", enum={"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"})
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
     *         description="Menus retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="data", type="array", @OA\Items(type="object")),
     *             @OA\Property(property="meta", type="object")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthorized")
     * )
     *
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
     * @OA\Post(
     *     path="/admin/menus",
     *     tags={"Admin - Menu Management"},
     *     summary="Create new menu",
     *     description="Create a new weekly menu item",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"day", "meal_type", "title"},
     *             @OA\Property(property="day", type="string", enum={"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"}, example="Mon"),
     *             @OA\Property(property="meal_type", type="string", enum={"breakfast", "lunch", "dinner"}, example="lunch"),
     *             @OA\Property(property="title", type="string", example="Couscous"),
     *             @OA\Property(property="description", type="string", example="Traditional couscous with vegetables"),
     *             @OA\Property(property="tags", type="array", @OA\Items(type="string"), example={"vegetarian", "halal"}),
     *             @OA\Property(property="status", type="string", enum={"available", "unavailable"}, example="available")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Menu created successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(response=422, description="Validation error")
     * )
     *
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
     * @OA\Get(
     *     path="/admin/menus/{id}",
     *     tags={"Admin - Menu Management"},
     *     summary="Get specific menu",
     *     description="Retrieve detailed information about a specific menu including feedback and reservations",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Menu retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(response=404, description="Menu not found")
     * )
     *
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
     * @OA\Put(
     *     path="/admin/menus/{id}",
     *     tags={"Admin - Menu Management"},
     *     summary="Update menu",
     *     description="Update an existing menu item",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="day", type="string", enum={"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"}),
     *             @OA\Property(property="meal_type", type="string", enum={"breakfast", "lunch", "dinner"}),
     *             @OA\Property(property="title", type="string"),
     *             @OA\Property(property="description", type="string"),
     *             @OA\Property(property="tags", type="array", @OA\Items(type="string")),
     *             @OA\Property(property="status", type="string", enum={"available", "unavailable"})
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Menu updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(response=404, description="Menu not found"),
     *     @OA\Response(response=422, description="Validation error")
     * )
     *
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
     * @OA\Delete(
     *     path="/admin/menus/{id}",
     *     tags={"Admin - Menu Management"},
     *     summary="Delete menu",
     *     description="Remove a menu item from the system",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Menu deleted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string")
     *         )
     *     ),
     *     @OA\Response(response=404, description="Menu not found")
     * )
     *
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
