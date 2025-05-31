<?php

namespace App\Console\Commands;

use App\Models\CompendiumEntry;
use App\Models\CompendiumSpell;
use App\Models\CompendiumItem;
use App\Models\CompendiumMonster;
use App\Models\CompendiumRace;
use App\Models\CompendiumDndClass;
use App\Models\CompendiumBackground;
use App\Models\CompendiumFeat;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ImportCompendiumCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'compendium:import {file=database/Complete_Compendium_2024.xml} {--clean : Clean existing system data before import}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import D&D 5e compendium data from XML file';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $filePath = $this->argument('file');

        if (!file_exists($filePath)) {
            $this->error("File not found: {$filePath}");
            return 1;
        }

        if ($this->option('clean')) {
            $this->info('Cleaning existing system data...');
            $this->cleanSystemData();
        }

        $this->info('Loading XML file...');
        $xml = simplexml_load_file($filePath);

        if (!$xml) {
            $this->error('Failed to parse XML file');
            return 1;
        }

        $this->info('Starting import...');

        DB::transaction(function () use ($xml) {
            $this->importItems($xml);
            $this->importSpells($xml);
            $this->importMonsters($xml);
            $this->importRaces($xml);
            $this->importClasses($xml);
            $this->importBackgrounds($xml);
            $this->importFeats($xml);
        });

        $this->info('Import completed successfully!');
        return 0;
    }

    private function cleanSystemData()
    {
        CompendiumEntry::where('is_system', true)->delete();
        $this->info('Existing system data cleaned.');
    }

    private function importItems($xml)
    {
        $items = $xml->xpath('//item');
        $this->info("Importing " . count($items) . " items...");

        $progressBar = $this->output->createProgressBar(count($items));

        foreach ($items as $item) {
            $entry = CompendiumEntry::create([
                'name' => (string) $item->name,
                'entry_type' => 'item',
                'is_system' => true,
                'text' => (string) $item->text,
                'source' => $this->extractSource((string) $item->text),
            ]);

            CompendiumItem::create([
                'compendium_entry_id' => $entry->id,
                'type' => (string) $item->type,
                'weight' => !empty($item->weight) ? (float) $item->weight : null,
                'value' => !empty($item->value) ? (int) $item->value : null,
                'property' => (string) $item->property ?: null,
                'dmg1' => (string) $item->dmg1 ?: null,
                'dmg2' => (string) $item->dmg2 ?: null,
                'dmgType' => (string) $item->dmgType ?: null,
                'range' => (string) $item->range ?: null,
                'ac' => !empty($item->ac) ? (int) $item->ac : null,
                'magic' => isset($item->magic) && (string) $item->magic === 'YES',
                'detail' => (string) $item->detail ?: null,
                'modifiers' => $this->extractModifiers($item),
                'rolls' => $this->extractRolls($item),
            ]);

            $progressBar->advance();
        }

        $progressBar->finish();
        $this->newLine();
    }

    private function importSpells($xml)
    {
        $spells = $xml->xpath('//spell');
        $this->info("Importing " . count($spells) . " spells...");

        $progressBar = $this->output->createProgressBar(count($spells));

        foreach ($spells as $spell) {
            $entry = CompendiumEntry::create([
                'name' => (string) $spell->name,
                'entry_type' => 'spell',
                'is_system' => true,
                'text' => (string) $spell->text,
                'source' => $this->extractSource((string) $spell->text),
            ]);

            CompendiumSpell::create([
                'compendium_entry_id' => $entry->id,
                'level' => (int) $spell->level,
                'school' => (string) $spell->school,
                'ritual' => isset($spell->ritual) && (string) $spell->ritual === 'YES',
                'time' => (string) $spell->time ?: null,
                'range' => (string) $spell->range ?: null,
                'components' => (string) $spell->components ?: null,
                'duration' => (string) $spell->duration ?: null,
                'classes' => (string) $spell->classes ?: null,
                'rolls' => $this->extractRolls($spell),
            ]);

            $progressBar->advance();
        }

        $progressBar->finish();
        $this->newLine();
    }

    private function importMonsters($xml)
    {
        $monsters = $xml->xpath('//monster');
        $this->info("Importing " . count($monsters) . " monsters...");

        $progressBar = $this->output->createProgressBar(count($monsters));

        foreach ($monsters as $monster) {
            $entry = CompendiumEntry::create([
                'name' => (string) $monster->name,
                'entry_type' => 'monster',
                'is_system' => true,
                'text' => (string) $monster->description,
                'source' => $this->extractSource((string) $monster->description),
            ]);

            CompendiumMonster::create([
                'compendium_entry_id' => $entry->id,
                'type' => (string) $monster->type,
                'size' => (string) $monster->size,
                'alignment' => (string) $monster->alignment ?: null,
                'hp' => (string) $monster->hp ?: null,
                'speed' => (string) $monster->speed ?: null,
                'str' => !empty($monster->str) ? (int) $monster->str : null,
                'dex' => !empty($monster->dex) ? (int) $monster->dex : null,
                'con' => !empty($monster->con) ? (int) $monster->con : null,
                'int' => !empty($monster->int) ? (int) $monster->int : null,
                'wis' => !empty($monster->wis) ? (int) $monster->wis : null,
                'cha' => !empty($monster->cha) ? (int) $monster->cha : null,
                'save' => (string) $monster->save ?: null,
                'skill' => (string) $monster->skill ?: null,
                'resist' => (string) $monster->resist ?: null,
                'immune' => (string) $monster->immune ?: null,
                'vulnerable' => (string) $monster->vulnerable ?: null,
                'conditionImmune' => (string) $monster->conditionImmune ?: null,
                'senses' => (string) $monster->senses ?: null,
                'passive' => (string) $monster->passive ?: null,
                'languages' => (string) $monster->languages ?: null,
                'cr' => (string) $monster->cr ?: null,
                'environment' => (string) $monster->environment ?: null,
                'traits' => $this->extractTraits($monster),
                'actions' => $this->extractActions($monster),
                'attacks' => $this->extractAttacks($monster),
            ]);

            $progressBar->advance();
        }

        $progressBar->finish();
        $this->newLine();
    }

    private function importRaces($xml)
    {
        $races = $xml->xpath('//race');
        $this->info("Importing " . count($races) . " races...");

        $progressBar = $this->output->createProgressBar(count($races));

        foreach ($races as $race) {
            $entry = CompendiumEntry::create([
                'name' => (string) $race->name,
                'entry_type' => 'race',
                'is_system' => true,
                'text' => (string) $race->text,
                'source' => $this->extractSource((string) $race->text),
            ]);

            CompendiumRace::create([
                'compendium_entry_id' => $entry->id,
                'size' => (string) $race->size ?: null,
                'speed' => (string) $race->speed ?: null,
                'ability' => (string) $race->ability ?: null,
                'proficiency' => (string) $race->proficiency ?: null,
                'spellAbility' => (string) $race->spellAbility ?: null,
                'traits' => $this->extractTraits($race),
                'modifiers' => $this->extractModifiers($race),
            ]);

            $progressBar->advance();
        }

        $progressBar->finish();
        $this->newLine();
    }

    private function importClasses($xml)
    {
        $classes = $xml->xpath('//class');
        $this->info("Importing " . count($classes) . " classes...");

        $progressBar = $this->output->createProgressBar(count($classes));

        foreach ($classes as $class) {
            $entry = CompendiumEntry::create([
                'name' => (string) $class->name,
                'entry_type' => 'class',
                'is_system' => true,
                'text' => (string) $class->text,
                'source' => $this->extractSource((string) $class->text),
            ]);

            CompendiumDndClass::create([
                'compendium_entry_id' => $entry->id,
                'hd' => !empty($class->hd) ? (int) $class->hd : null,
                'proficiency' => (string) $class->proficiency ?: null,
                'numSkills' => !empty($class->numSkills) ? (int) $class->numSkills : null,
                'armor' => (string) $class->armor ?: null,
                'weapons' => (string) $class->weapons ?: null,
                'tools' => (string) $class->tools ?: null,
                'wealth' => (string) $class->wealth ?: null,
                'spellAbility' => (string) $class->spellAbility ?: null,
                'autolevels' => $this->extractAutolevels($class),
                'traits' => $this->extractTraits($class),
            ]);

            $progressBar->advance();
        }

        $progressBar->finish();
        $this->newLine();
    }

    private function importBackgrounds($xml)
    {
        $backgrounds = $xml->xpath('//background');
        $this->info("Importing " . count($backgrounds) . " backgrounds...");

        $progressBar = $this->output->createProgressBar(count($backgrounds));

        foreach ($backgrounds as $background) {
            $entry = CompendiumEntry::create([
                'name' => (string) $background->name,
                'entry_type' => 'background',
                'is_system' => true,
                'text' => (string) $background->text,
                'source' => $this->extractSource((string) $background->text),
            ]);

            CompendiumBackground::create([
                'compendium_entry_id' => $entry->id,
                'proficiency' => (string) $background->proficiency ?: null,
                'languages' => (string) $background->languages ?: null,
                'equipment' => (string) $background->equipment ?: null,
                'gold' => (string) $background->gold ?: null,
                'traits' => $this->extractTraits($background),
            ]);

            $progressBar->advance();
        }

        $progressBar->finish();
        $this->newLine();
    }

    private function importFeats($xml)
    {
        $feats = $xml->xpath('//feat');
        $this->info("Importing " . count($feats) . " feats...");

        $progressBar = $this->output->createProgressBar(count($feats));

        foreach ($feats as $feat) {
            $entry = CompendiumEntry::create([
                'name' => (string) $feat->name,
                'entry_type' => 'feat',
                'is_system' => true,
                'text' => (string) $feat->text,
                'source' => $this->extractSource((string) $feat->text),
            ]);

            CompendiumFeat::create([
                'compendium_entry_id' => $entry->id,
                'prerequisite' => (string) $feat->prerequisite ?: null,
                'modifiers' => $this->extractModifiers($feat),
                'traits' => $this->extractTraits($feat),
            ]);

            $progressBar->advance();
        }

        $progressBar->finish();
        $this->newLine();
    }

    private function extractSource(string $text): ?string
    {
        if (preg_match('/Source:\s*(.+?)(?:\n|$)/i', $text, $matches)) {
            return trim($matches[1]);
        }
        return null;
    }

    private function extractModifiers($element): ?array
    {
        $modifiers = [];
        foreach ($element->xpath('.//modifier') as $modifier) {
            $modifiers[] = [
                'category' => (string) $modifier->attributes()->category,
                'type' => (string) $modifier->attributes()->type,
                'value' => (string) $modifier,
            ];
        }
        return !empty($modifiers) ? $modifiers : null;
    }

    private function extractTraits($element): ?array
    {
        $traits = [];
        foreach ($element->xpath('.//trait') as $trait) {
            $traits[] = [
                'name' => (string) $trait->name,
                'text' => (string) $trait->text,
            ];
        }
        return !empty($traits) ? $traits : null;
    }

    private function extractActions($element): ?array
    {
        $actions = [];
        foreach ($element->xpath('.//action') as $action) {
            $actions[] = [
                'name' => (string) $action->name,
                'text' => (string) $action->text,
            ];
        }
        return !empty($actions) ? $actions : null;
    }

    private function extractAttacks($element): ?array
    {
        $attacks = [];
        foreach ($element->xpath('.//attack') as $attack) {
            $attacks[] = [
                'name' => (string) $attack->attributes()->name,
                'bonus' => (string) $attack->attributes()->bonus,
                'damage' => (string) $attack->attributes()->damage,
            ];
        }
        return !empty($attacks) ? $attacks : null;
    }

    private function extractRolls($element): ?array
    {
        $rolls = [];
        foreach ($element->xpath('.//roll') as $roll) {
            $rolls[] = [
                'description' => (string) $roll->attributes()->description,
                'value' => (string) $roll,
            ];
        }
        return !empty($rolls) ? $rolls : null;
    }

    private function extractAutolevels($element): ?array
    {
        $autolevels = [];
        foreach ($element->xpath('.//autolevel') as $autolevel) {
            $level = (int) $autolevel->attributes()->level;
            $autolevels[$level] = [
                'level' => $level,
                'features' => $this->extractTraits($autolevel),
            ];
        }
        return !empty($autolevels) ? $autolevels : null;
    }
}
