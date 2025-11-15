<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->foreignId('menu_id')->constrained('weekly_menus')->onDelete('cascade');
            $table->date('date');
            $table->string('qr_code')->unique()->nullable();
            $table->string('status')->default('pending'); // pending, confirmed, cancelled, no_show
            $table->string('payment_method')->nullable(); // wallet, points, cash
            $table->decimal('price', 10, 2)->default(0.00);
            $table->timestamps();
            $table->softDeletes();

            $table->index('student_id');
            $table->index('menu_id');
            $table->index('date');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
