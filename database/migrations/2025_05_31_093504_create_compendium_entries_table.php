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
        Schema::create('compendium_entries', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('entry_type'); // spell, item, monster, race, class, background, feat
            $table->boolean('is_system')->default(true); // true for imported data, false for user-created
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade'); // null for system items
            $table->longText('text')->nullable(); // description/rules text
            $table->string('source')->nullable(); // source book reference
            $table->timestamps();

            // Indexes
            $table->index(['entry_type', 'is_system']);
            $table->index('user_id');
            $table->index('name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('compendium_entries');
    }
};
