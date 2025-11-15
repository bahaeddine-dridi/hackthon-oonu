<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateStudentRequest;
use App\Http\Resources\StudentResource;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminStudentController extends Controller
{
    /**
     * Display a listing of students.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $query = Student::query();

        // Search by name, email, or student_id
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('student_id', 'like', "%{$search}%");
            });
        }

        // Filter by active status
        if ($request->has('active')) {
            $query->where('active', $request->active);
        }

        // Filter by university
        if ($request->has('university')) {
            $query->where('university', $request->university);
        }

        $students = $query->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'message' => 'Students retrieved successfully',
            'data' => StudentResource::collection($students),
            'meta' => [
                'current_page' => $students->currentPage(),
                'last_page' => $students->lastPage(),
                'per_page' => $students->perPage(),
                'total' => $students->total(),
            ],
        ], 200);
    }

    /**
     * Store a newly created student.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'student_id' => 'required|string|unique:students,student_id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:students,email',
            'university' => 'required|string|max:255',
            'password' => 'required|string|min:8',
            'wallet_balance' => 'nullable|numeric|min:0',
            'points' => 'nullable|integer|min:0',
        ]);

        $student = Student::create([
            'student_id' => $request->student_id,
            'name' => $request->name,
            'email' => $request->email,
            'university' => $request->university,
            'password' => Hash::make($request->password),
            'wallet_balance' => $request->wallet_balance ?? 0,
            'points' => $request->points ?? 0,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Student created successfully',
            'data' => new StudentResource($student),
        ], 201);
    }

    /**
     * Display the specified student.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $student = Student::with(['reservations', 'feedback', 'walletTransactions'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Student retrieved successfully',
            'data' => new StudentResource($student),
        ], 200);
    }

    /**
     * Update the specified student.
     *
     * @param  \App\Http\Requests\UpdateStudentRequest  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(UpdateStudentRequest $request, $id)
    {
        $student = Student::findOrFail($id);
        $data = $request->validated();

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $student->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Student updated successfully',
            'data' => new StudentResource($student),
        ], 200);
    }

    /**
     * Remove the specified student.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $student = Student::findOrFail($id);
        $student->delete();

        return response()->json([
            'success' => true,
            'message' => 'Student deleted successfully',
        ], 200);
    }

    /**
     * Restore a soft-deleted student.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function restore($id)
    {
        $student = Student::withTrashed()->findOrFail($id);
        $student->restore();

        return response()->json([
            'success' => true,
            'message' => 'Student restored successfully',
            'data' => new StudentResource($student),
        ], 200);
    }
}
