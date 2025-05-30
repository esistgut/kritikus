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
        Schema::table('sounds', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
        });

        // Assign existing sounds to the first user (or delete them if no users exist)
        $firstUser = \App\Models\User::first();
        if ($firstUser) {
            \App\Models\Sound::whereNull('user_id')->update(['user_id' => $firstUser->id]);
        } else {
            // If no users exist, delete orphaned sounds
            \App\Models\Sound::whereNull('user_id')->delete();
        }

        // Now make user_id non-nullable
        Schema::table('sounds', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sounds', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });
    }
};
