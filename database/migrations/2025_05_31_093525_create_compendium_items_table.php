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
            $table->foreignId('compendium_entry_id')->constrained()->onDelete('cascade');
            $table->string('type'); // G=gear, M=weapon/melee, A=ammunition, S=shield, W=wondrous, P=potion, R=ring, etc.
            $table->decimal('weight', 8, 2)->nullable();
            $table->integer('value')->nullable(); // in copper pieces
            $table->string('property')->nullable(); // weapon properties
            $table->string('dmg1')->nullable(); // damage dice
            $table->string('dmg2')->nullable(); // versatile damage
            $table->string('dmgType')->nullable(); // damage type
            $table->string('range')->nullable(); // weapon range
            $table->integer('ac')->nullable(); // armor class bonus
            $table->boolean('magic')->default(false);
            $table->string('detail')->nullable(); // rarity, requirements, etc.
            $table->json('modifiers')->nullable(); // for storing modifier arrays
            $table->json('rolls')->nullable(); // for storing dice roll arrays
            $table->timestamps();

            // Indexes
            $table->index('type');
            $table->index('magic');
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
