<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Reservation extends Model
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
        'date',
        'qr_code',
        'status',
        'payment_method',
        'price',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date' => 'date',
        'price' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($reservation) {
            if (empty($reservation->qr_code)) {
                $reservation->qr_code = self::generateQrCode();
            }
        });
    }

    /**
     * Generate a unique QR code.
     */
    public static function generateQrCode(): string
    {
        do {
            $qrCode = 'RES-' . strtoupper(Str::random(10));
        } while (self::where('qr_code', $qrCode)->exists());

        return $qrCode;
    }

    /**
     * Get the student that owns the reservation.
     */
    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    /**
     * Get the menu associated with the reservation.
     */
    public function menu()
    {
        return $this->belongsTo(WeeklyMenu::class, 'menu_id');
    }

    /**
     * Scope a query to only include pending reservations.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope a query to only include confirmed reservations.
     */
    public function scopeConfirmed($query)
    {
        return $query->where('status', 'confirmed');
    }

    /**
     * Scope a query to filter by date.
     */
    public function scopeByDate($query, $date)
    {
        return $query->whereDate('date', $date);
    }
}
