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
        Schema::create('class_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->time('start_time');
            $table->integer('duration'); // in minutes (30, 60, 90, 120)
            $table->enum('status', ['upcoming', 'completed', 'cancelled'])->default('upcoming');
            $table->text('notes')->nullable();
            $table->timestamps();
            
            // Prevent double-booking same time slot
            $table->unique(['date', 'start_time']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('class_schedules');
    }
};
