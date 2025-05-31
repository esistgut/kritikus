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
        Schema::table('characters', function (Blueprint $table) {
            // Remove the old string columns that are now replaced by foreign keys
            $table->dropColumn(['class', 'race', 'background']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('characters', function (Blueprint $table) {
            // Add back the old string columns if needed to rollback
            $table->string('class')->after('name');
            $table->string('race')->after('class');
            $table->string('background')->after('race');
        });
    }
};
