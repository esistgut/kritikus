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
        Schema::create('compendium_items', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('entry_type'); // item, spell, monster, race, class, background, feat
            $table->string('type')->nullable(); // G=gear, M=weapon/melee, A=ammunition, S=shield, W=wondrous, P=potion, R=ring, etc. for items; creature types for monsters
            $table->string('subtype')->nullable(); // more specific type classification
            $table->boolean('is_system')->default(true); // true for imported data, false for user-created
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade'); // null for system items

            // Spell-specific fields
            $table->integer('level')->nullable(); // spell level
            $table->string('school')->nullable(); // spell school (A=abjuration, etc.)
            $table->boolean('ritual')->default(false);
            $table->string('time')->nullable(); // casting time
            $table->string('range')->nullable(); // spell range
            $table->string('components')->nullable(); // V, S, M components
            $table->string('duration')->nullable(); // spell duration
            $table->string('classes')->nullable(); // classes that can use this

            // Item-specific fields
            $table->decimal('weight', 8, 2)->nullable();
            $table->integer('value')->nullable(); // in copper pieces
            $table->string('property')->nullable(); // weapon properties
            $table->string('dmg1')->nullable(); // damage dice
            $table->string('dmg2')->nullable(); // versatile damage
            $table->string('dmgType')->nullable(); // damage type
            $table->integer('ac')->nullable(); // armor class bonus
            $table->boolean('magic')->default(false);
            $table->string('detail')->nullable(); // rarity, requirements, etc.

            // Monster-specific fields
            $table->string('size')->nullable(); // T, S, M, L, H, G
            $table->string('alignment')->nullable();
            $table->string('hp')->nullable(); // hit points
            $table->string('speed')->nullable(); // movement speeds
            $table->integer('str')->nullable(); // ability scores
            $table->integer('dex')->nullable();
            $table->integer('con')->nullable();
            $table->integer('int')->nullable();
            $table->integer('wis')->nullable();
            $table->integer('cha')->nullable();
            $table->string('save')->nullable(); // saving throw bonuses
            $table->string('skill')->nullable(); // skill bonuses
            $table->string('resist')->nullable(); // damage resistances
            $table->string('immune')->nullable(); // damage immunities
            $table->string('vulnerable')->nullable(); // damage vulnerabilities
            $table->string('conditionImmune')->nullable(); // condition immunities
            $table->string('senses')->nullable(); // senses
            $table->string('passive')->nullable(); // passive perception
            $table->string('languages')->nullable();
            $table->string('cr')->nullable(); // challenge rating
            $table->string('environment')->nullable(); // environments

            // Class-specific fields
            $table->integer('hd')->nullable(); // hit die
            $table->integer('numSkills')->nullable(); // number of skill choices
            $table->string('armor')->nullable(); // armor proficiencies
            $table->string('weapons')->nullable(); // weapon proficiencies
            $table->string('tools')->nullable(); // tool proficiencies

            // Race/Background-specific fields
            $table->string('proficiency')->nullable(); // skill proficiencies
            $table->string('spellAbility')->nullable(); // spellcasting ability

            // General fields
            $table->longText('text'); // description/rules text
            $table->json('traits')->nullable(); // for storing trait arrays
            $table->json('actions')->nullable(); // for storing action arrays
            $table->json('attacks')->nullable(); // for storing attack arrays
            $table->json('modifiers')->nullable(); // for storing modifier arrays
            $table->json('autolevels')->nullable(); // for storing class level progression
            $table->json('rolls')->nullable(); // for storing dice roll arrays
            $table->string('source')->nullable(); // source book reference

            $table->timestamps();

            // Indexes for better performance
            $table->index(['entry_type', 'is_system']);
            $table->index(['type', 'is_system']);
            $table->index(['level', 'school']); // for spells
            $table->index(['cr']); // for monsters
            $table->index(['size']); // for creatures
            $table->index('user_id');
            $table->index('name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('compendium_items');
    }
};
