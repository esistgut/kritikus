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
        Schema::table('compendium_entries', function (Blueprint $table) {
            $table->string('source_id')->nullable()->after('entry_type'); // Original ID from XML for system entries
            $table->index('source_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('compendium_entries', function (Blueprint $table) {
            $table->dropIndex(['source_id']);
            $table->dropColumn('source_id');
        });
    }
};
