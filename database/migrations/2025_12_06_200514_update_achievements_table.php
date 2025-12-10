<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('achievements', function (Blueprint $table) {
            $table->dropColumn('image');

            $table->text('images')->after('description');
            $table->boolean('approval')->nullable(false)->default(false)->change();
            $table->string('proof')->nullable(false)->change();
            $table->date('awarded_at')->nullable(false)->change();
        });
    }

    public function down(): void
    {
        Schema::table('achievements', function (Blueprint $table) {
            $table->string('image');
            $table->dropColumn('images');
            $table->boolean('approval')->nullable()->default(null)->change();
            $table->string('proof')->nullable()->change();
            $table->date('awarded_at')->nullable()->change();
        });
    }
};
