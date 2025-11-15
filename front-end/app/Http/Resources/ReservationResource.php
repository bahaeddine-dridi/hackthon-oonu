<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReservationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'student_id' => $this->student_id,
            'menu_id' => $this->menu_id,
            'date' => $this->date?->toDateString(),
            'qr_code' => $this->qr_code,
            'status' => $this->status,
            'payment_method' => $this->payment_method,
            'price' => (float) $this->price,
            'student' => new StudentResource($this->whenLoaded('student')),
            'menu' => new WeeklyMenuResource($this->whenLoaded('menu')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
