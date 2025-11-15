<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStudentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $studentId = $this->route('student');

        return [
            'student_id' => 'sometimes|string|unique:students,student_id,' . $studentId,
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:students,email,' . $studentId,
            'university' => 'sometimes|string|max:255',
            'password' => 'sometimes|string|min:8',
            'points' => 'sometimes|integer|min:0',
            'wallet_balance' => 'sometimes|numeric|min:0',
            'active' => 'sometimes|boolean',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'student_id.unique' => 'This student ID is already taken.',
            'email.unique' => 'This email is already registered.',
            'email.email' => 'Please provide a valid email address.',
            'password.min' => 'Password must be at least 8 characters long.',
        ];
    }
}
