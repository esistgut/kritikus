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
        Schema::create('compendium_races', function (Blueprint $table) {
            $table->id();
            $table->foreignId('compendium_entry_id')->constrained()->onDelete('cascade');
            $table->string('size')->nullable(); // creature size
            $table->string('speed')->nullable(); // movement speed
            $table->string('ability')->nullable(); // ability score improvements
            $table->string('proficiency')->nullable(); // skill proficiencies
            $table->string('spellAbility')->nullable(); // spellcasting ability
            $table->json('traits')->nullable(); // racial traits
            $table->json('modifiers')->nullable(); // ability modifiers
            $table->timestamps();

            // Indexes
            $table->index('size');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('compendium_races');
    }
};
