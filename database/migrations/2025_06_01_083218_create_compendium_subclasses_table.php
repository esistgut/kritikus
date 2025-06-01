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
        Schema::create('compendium_subclasses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('compendium_entry_id')->constrained()->onDelete('cascade');
            $table->foreignId('parent_class_id')->constrained('compendium_entries')->onDelete('cascade');
            $table->json('features')->nullable();
            $table->json('autolevels')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('compendium_subclasses');
    }
};
