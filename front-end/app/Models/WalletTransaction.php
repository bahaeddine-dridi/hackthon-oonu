<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WalletTransaction extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'student_id',
        'amount',
        'type',
        'description',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'amount' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the student that owns the transaction.
     */
    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    /**
     * Scope a query to only include credit transactions.
     */
    public function scopeCredit($query)
    {
        return $query->where('type', 'credit');
    }

    /**
     * Scope a query to only include debit transactions.
     */
    public function scopeDebit($query)
    {
        return $query->where('type', 'debit');
    }
}
