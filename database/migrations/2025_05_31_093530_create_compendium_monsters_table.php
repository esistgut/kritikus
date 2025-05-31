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
        Schema::create('compendium_monsters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('compendium_entry_id')->constrained()->onDelete('cascade');
            $table->string('type'); // creature type (aberration, beast, etc.)
            $table->string('size'); // T, S, M, L, H, G
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
            $table->json('traits')->nullable(); // for storing trait arrays
            $table->json('actions')->nullable(); // for storing action arrays
            $table->json('attacks')->nullable(); // for storing attack arrays
            $table->timestamps();

            // Indexes
            $table->index('type');
            $table->index('size');
            $table->index('cr');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('compendium_monsters');
    }
};
