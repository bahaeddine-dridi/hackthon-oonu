<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class WeeklyMenu extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'day',
        'meal_type',
        'title',
        'tags',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'tags' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the reservations for the menu.
     */
    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'menu_id');
    }

    /**
     * Get the feedback for the menu.
     */
    public function feedback()
    {
        return $this->hasMany(Feedback::class, 'menu_id');
    }

    /**
     * Scope a query to only include available menus.
     */
    public function scopeAvailable($query)
    {
        return $query->where('status', 'available');
    }

    /**
     * Scope a query to filter by day.
     */
    public function scopeByDay($query, $day)
    {
        return $query->where('day', $day);
    }

    /**
     * Scope a query to filter by meal type.
     */
    public function scopeByMealType($query, $mealType)
    {
        return $query->where('meal_type', $mealType);
    }
}
