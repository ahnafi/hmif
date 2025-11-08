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
        Schema::create('achievements', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string("organizer");
            $table->text('description');
            $table->text('images');
            $table->string('proof');
            $table->date('awarded_at');
            $table->boolean('approval')->default(null);
            $table->foreignId('achievement_type_id')->constrained('achievement_types');
            $table->foreignId('achievement_category_id')->constrained('achievement_categories');
            $table->foreignId('achievement_level_id')->constrained('achievement_levels');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('achievements');
    }
};
