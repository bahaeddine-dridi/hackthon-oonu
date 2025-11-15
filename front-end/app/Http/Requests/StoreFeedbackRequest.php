<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFeedbackRequest extends FormRequest
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
            'menu_id' => 'required|exists:weekly_menus,id',
            'rating' => 'required|integer|min:1|max:5',
            'category' => 'nullable|string|in:taste,timing,service,hygiene',
            'comment' => 'nullable|string|max:1000',
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
            'menu_id.required' => 'The menu selection is required.',
            'menu_id.exists' => 'The selected menu does not exist.',
            'rating.required' => 'The rating is required.',
            'rating.min' => 'The rating must be between 1 and 5.',
            'rating.max' => 'The rating must be between 1 and 5.',
            'category.in' => 'The category must be one of: taste, timing, service, hygiene.',
        ];
    }
}
