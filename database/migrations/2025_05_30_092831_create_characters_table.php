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
        Schema::create('characters', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('class');
            $table->string('race');
            $table->string('background');
            $table->integer('level')->default(1);
            $table->integer('experience')->default(0);

            // Ability Scores
            $table->integer('strength')->default(10);
            $table->integer('dexterity')->default(10);
            $table->integer('constitution')->default(10);
            $table->integer('intelligence')->default(10);
            $table->integer('wisdom')->default(10);
            $table->integer('charisma')->default(10);

            // Combat Stats
            $table->integer('armor_class')->default(10);
            $table->integer('initiative')->default(0);
            $table->integer('speed')->default(30);
            $table->integer('hit_point_maximum')->default(8);
            $table->integer('current_hit_points')->default(8);
            $table->integer('temporary_hit_points')->default(0);
            $table->integer('hit_dice')->default(1);
            $table->integer('hit_dice_total')->default(1);

            // Saving Throws (proficiency)
            $table->boolean('strength_save_proficiency')->default(false);
            $table->boolean('dexterity_save_proficiency')->default(false);
            $table->boolean('constitution_save_proficiency')->default(false);
            $table->boolean('intelligence_save_proficiency')->default(false);
            $table->boolean('wisdom_save_proficiency')->default(false);
            $table->boolean('charisma_save_proficiency')->default(false);

            // Skills (proficiency)
            $table->json('skill_proficiencies')->default('[]');
            $table->json('skill_expertises')->default('[]');

            // Other proficiencies
            $table->json('languages')->default('[]');
            $table->json('armor_proficiencies')->default('[]');
            $table->json('weapon_proficiencies')->default('[]');
            $table->json('tool_proficiencies')->default('[]');

            // Features and traits
            $table->json('features_and_traits')->default('[]');
            $table->json('attacks_and_spells')->default('[]');
            $table->json('equipment')->default('[]');

            // Character Details
            $table->text('personality_traits')->nullable();
            $table->text('ideals')->nullable();
            $table->text('bonds')->nullable();
            $table->text('flaws')->nullable();
            $table->text('backstory')->nullable();

            // Spellcasting
            $table->string('spellcasting_class')->nullable();
            $table->integer('spell_attack_bonus')->default(0);
            $table->integer('spell_save_dc')->default(8);
            $table->json('spell_slots')->default('{}');
            $table->json('spells_known')->default('[]');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('characters');
    }
};
