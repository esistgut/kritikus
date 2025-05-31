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
        Schema::create('compendium_backgrounds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('compendium_entry_id')->constrained()->onDelete('cascade');
            $table->string('proficiency')->nullable(); // skill proficiencies
            $table->string('languages')->nullable(); // language proficiencies
            $table->string('equipment')->nullable(); // starting equipment
            $table->string('gold')->nullable(); // starting gold
            $table->json('traits')->nullable(); // background features
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('compendium_backgrounds');
    }
};
