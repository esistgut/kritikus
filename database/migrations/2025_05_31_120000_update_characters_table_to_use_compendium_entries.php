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
        Schema::table('characters', function (Blueprint $table) {
            // Change free text fields to reference compendium entries
            $table->foreignId('race_id')->nullable()->after('background')->constrained('compendium_entries')->onDelete('set null');
            $table->foreignId('class_id')->nullable()->after('race_id')->constrained('compendium_entries')->onDelete('set null');
            $table->foreignId('background_id')->nullable()->after('class_id')->constrained('compendium_entries')->onDelete('set null');

            // Add selected spells as a relationship to compendium entries
            $table->json('selected_spell_ids')->default('[]')->after('spells_known');

            // Add selected feats as a relationship to compendium entries
            $table->json('selected_feat_ids')->default('[]')->after('selected_spell_ids');

            // Add selected equipment/items as a relationship to compendium entries
            $table->json('selected_item_ids')->default('[]')->after('selected_feat_ids');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('characters', function (Blueprint $table) {
            $table->dropForeign(['race_id']);
            $table->dropForeign(['class_id']);
            $table->dropForeign(['background_id']);
            $table->dropColumn(['race_id', 'class_id', 'background_id', 'selected_spell_ids', 'selected_feat_ids', 'selected_item_ids']);
        });
    }
};
