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
        Schema::create('weekly_menus', function (Blueprint $table) {
            $table->id();
            $table->string('day'); // Mon, Tue, Wed, etc.
            $table->string('meal_type'); // breakfast, lunch, dinner
            $table->string('title');
            $table->json('tags')->nullable(); // vegetarian, allergens, etc.
            $table->string('status')->default('available'); // available/unavailable
            $table->timestamps();
            $table->softDeletes();

            $table->index(['day', 'meal_type']);
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('weekly_menus');
    }
};
