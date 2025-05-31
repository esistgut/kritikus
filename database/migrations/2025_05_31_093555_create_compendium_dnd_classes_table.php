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
        Schema::create('compendium_dnd_classes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('compendium_entry_id')->constrained()->onDelete('cascade');
            $table->integer('hd')->nullable(); // hit die
            $table->string('proficiency')->nullable(); // proficiency bonus progression
            $table->integer('numSkills')->nullable(); // number of skill choices
            $table->string('armor')->nullable(); // armor proficiencies
            $table->string('weapons')->nullable(); // weapon proficiencies
            $table->string('tools')->nullable(); // tool proficiencies
            $table->string('wealth')->nullable(); // starting wealth
            $table->string('spellAbility')->nullable(); // spellcasting ability
            $table->json('autolevels')->nullable(); // class level progression
            $table->json('traits')->nullable(); // class features
            $table->timestamps();

            // Indexes
            $table->index('hd');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('compendium_dnd_classes');
    }
};
