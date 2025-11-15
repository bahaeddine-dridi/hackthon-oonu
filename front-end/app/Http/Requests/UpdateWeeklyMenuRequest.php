<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateWeeklyMenuRequest extends FormRequest
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
        return [
            'day' => 'sometimes|string|in:Mon,Tue,Wed,Thu,Fri,Sat,Sun',
            'meal_type' => 'sometimes|string|in:breakfast,lunch,dinner',
            'title' => 'sometimes|string|max:255',
            'tags' => 'nullable|array',
            'tags.*' => 'string',
            'status' => 'sometimes|string|in:available,unavailable',
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
            'day.in' => 'The day must be one of: Mon, Tue, Wed, Thu, Fri, Sat, Sun.',
            'meal_type.in' => 'The meal type must be one of: breakfast, lunch, dinner.',
        ];
    }
}
