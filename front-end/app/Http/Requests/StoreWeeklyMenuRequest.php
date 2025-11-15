<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreWeeklyMenuRequest extends FormRequest
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
            'day' => 'required|string|in:Mon,Tue,Wed,Thu,Fri,Sat,Sun',
            'meal_type' => 'required|string|in:breakfast,lunch,dinner',
            'title' => 'required|string|max:255',
            'tags' => 'nullable|array',
            'tags.*' => 'string',
            'status' => 'nullable|string|in:available,unavailable',
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
            'day.required' => 'The day field is required.',
            'day.in' => 'The day must be one of: Mon, Tue, Wed, Thu, Fri, Sat, Sun.',
            'meal_type.required' => 'The meal type field is required.',
            'meal_type.in' => 'The meal type must be one of: breakfast, lunch, dinner.',
            'title.required' => 'The meal title is required.',
        ];
    }
}
