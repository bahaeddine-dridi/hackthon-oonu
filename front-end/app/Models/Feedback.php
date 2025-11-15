<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Feedback extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'student_id',
        'menu_id',
        'rating',
        'category',
        'comment',
        'sentiment',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'rating' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($feedback) {
            if (empty($feedback->sentiment)) {
                $feedback->sentiment = self::detectSentiment($feedback->rating, $feedback->comment);
            }
        });
    }

    /**
     * Detect sentiment based on rating and comment (placeholder implementation).
     */
    public static function detectSentiment($rating, $comment): string
    {
        // Simple rule-based sentiment detection
        if ($rating >= 4) {
            return 'positive';
        } elseif ($rating <= 2) {
            return 'negative';
        }

        // Check comment for negative keywords
        if ($comment) {
            $negativeWords = ['bad', 'poor', 'terrible', 'awful', 'disappointing'];
            foreach ($negativeWords as $word) {
                if (stripos($comment, $word) !== false) {
                    return 'negative';
                }
            }

            $positiveWords = ['good', 'great', 'excellent', 'amazing', 'delicious'];
            foreach ($positiveWords as $word) {
                if (stripos($comment, $word) !== false) {
                    return 'positive';
                }
            }
        }

        return 'neutral';
    }

    /**
     * Get the student that submitted the feedback.
     */
    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    /**
     * Get the menu associated with the feedback.
     */
    public function menu()
    {
        return $this->belongsTo(WeeklyMenu::class, 'menu_id');
    }

    /**
     * Scope a query to filter by category.
     */
    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope a query to filter by rating.
     */
    public function scopeByRating($query, $rating)
    {
        return $query->where('rating', $rating);
    }
}
