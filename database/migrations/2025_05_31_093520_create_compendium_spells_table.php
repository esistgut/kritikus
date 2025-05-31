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
        Schema::create('compendium_spells', function (Blueprint $table) {
            $table->id();
            $table->foreignId('compendium_entry_id')->constrained()->onDelete('cascade');
            $table->integer('level'); // spell level
            $table->string('school'); // spell school (A=abjuration, etc.)
            $table->boolean('ritual')->default(false);
            $table->string('time')->nullable(); // casting time
            $table->string('range')->nullable(); // spell range
            $table->string('components')->nullable(); // V, S, M components
            $table->string('duration')->nullable(); // spell duration
            $table->string('classes')->nullable(); // classes that can use this
            $table->json('rolls')->nullable(); // for storing dice roll arrays
            $table->timestamps();

            // Indexes
            $table->index(['level', 'school']);
            $table->index('ritual');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('compendium_spells');
    }
};
