<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReservationRequest extends FormRequest
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
            'date' => 'required|date|after_or_equal:today',
            'payment_method' => 'required|string|in:wallet,points,cash',
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
            'date.required' => 'The reservation date is required.',
            'date.after_or_equal' => 'The reservation date must be today or a future date.',
            'payment_method.required' => 'The payment method is required.',
            'payment_method.in' => 'The payment method must be one of: wallet, points, cash.',
        ];
    }
}
