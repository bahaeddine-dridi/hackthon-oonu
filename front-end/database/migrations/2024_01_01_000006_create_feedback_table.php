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
        Schema::create('feedback', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->foreignId('menu_id')->constrained('weekly_menus')->onDelete('cascade');
            $table->integer('rating')->unsigned(); // 1-5
            $table->string('category')->nullable(); // taste, timing, service, hygiene
            $table->text('comment')->nullable();
            $table->string('sentiment')->nullable(); // positive, neutral, negative
            $table->timestamps();
            $table->softDeletes();

            $table->index('student_id');
            $table->index('menu_id');
            $table->index('rating');
            $table->index('category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('feedback');
    }
};
