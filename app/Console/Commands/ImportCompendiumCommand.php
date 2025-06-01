<?php

namespace App\Console\Commands;

use App\Models\CompendiumEntry;
use App\Models\CompendiumSpell;
use App\Models\CompendiumItem;
use App\Models\CompendiumMonster;
use App\Models\CompendiumRace;
use App\Models\CompendiumDndClass;
use App\Models\CompendiumSubclass;
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
    protected $signature = 'compendium:import {file=database/Complete_Compendium_2024.xml}
                            {--clean : Clean existing system data before import}
                            {--update : Update existing entries by name instead of cleaning all}
                            {--dry-run : Show what would be imported/updated without making changes}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import D&D 5e compendium data from XML file. Use --clean for full refresh, --update for name-based updates, or --dry-run to preview changes.';

    private $importStats = [
        'created' => 0,
        'updated' => 0,
        'skipped' => 0,
        'deleted' => 0
    ];

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

        // Validate options
        if ($this->option('clean') && $this->option('update')) {
            $this->error('Cannot use both --clean and --update options together');
            return 1;
        }

        if ($this->option('dry-run')) {
            $this->info('🔍 DRY RUN MODE - No changes will be made');
        }

        if ($this->option('clean')) {
            $this->info('🧹 Cleaning existing system data...');
            if (!$this->option('dry-run')) {
                $this->cleanSystemData();
            } else {
                $count = CompendiumEntry::where('is_system', true)->count();
                $this->info("Would delete {$count} existing system entries");
            }
        }

        $this->info('📖 Loading XML file...');
        $xml = simplexml_load_file($filePath);

        if (!$xml) {
            $this->error('Failed to parse XML file');
            return 1;
        }

        $this->info('🚀 Starting import...');
        $this->info('Strategy: ' . ($this->option('clean') ? 'Clean and reimport all' :
                                   ($this->option('update') ? 'Update existing by name' : 'Create new entries only')));

        if (!$this->option('dry-run')) {
            DB::transaction(function () use ($xml) {
                $this->importItems($xml);
                $this->importSpells($xml);
                $this->importMonsters($xml);
                $this->importRaces($xml);
                $this->importClasses($xml);
                $this->importBackgrounds($xml);
                $this->importFeats($xml);
            });
        } else {
            $this->previewImport($xml);
        }

        $this->displayImportStats();

        if (!$this->option('dry-run')) {
            $this->info('✅ Import completed successfully!');
        } else {
            $this->info('✅ Dry run completed - no changes were made');
        }

        return 0;
    }

    private function displayImportStats()
    {
        $this->newLine();
        $this->info('📊 Import Statistics:');
        $this->table(
            ['Action', 'Count'],
            [
                ['Created', $this->importStats['created']],
                ['Updated', $this->importStats['updated']],
                ['Skipped', $this->importStats['skipped']],
                ['Deleted', $this->importStats['deleted']]
            ]
        );
    }

    private function previewImport($xml)
    {
        $this->info('📋 Preview of changes:');

        foreach (['item', 'spell', 'monster', 'race', 'class', 'background', 'feat'] as $type) {
            $entries = $xml->xpath("//{$type}");
            $count = count($entries);

            if ($this->option('update')) {
                $existing = CompendiumEntry::where('entry_type', $type)->where('is_system', true)->count();
                $this->info("- {$type}s: {$count} in XML, {$existing} existing system entries");
            } else {
                $this->info("- {$type}s: {$count} would be imported");
            }
        }

        // Count subclasses separately
        $subclassCount = 0;
        foreach ($xml->xpath('//class') as $class) {
            $subclassCount += count($class->xpath('.//subclass'));
        }
        if ($subclassCount > 0) {
            if ($this->option('update')) {
                $existing = CompendiumEntry::where('entry_type', 'subclass')->where('is_system', true)->count();
                $this->info("- subclasses: {$subclassCount} in XML, {$existing} existing system entries");
            } else {
                $this->info("- subclasses: {$subclassCount} would be imported");
            }
        }
    }

    private function cleanSystemData()
    {
        $deleted = CompendiumEntry::where('is_system', true)->count();
        CompendiumEntry::where('is_system', true)->delete();
        $this->importStats['deleted'] = $deleted;
        $this->info("Existing system data cleaned: {$deleted} entries deleted.");
    }

    /**
     * Create or update a compendium entry based on name matching
     *
     * @param string $name Entry name
     * @param string $entryType Entry type (spell, item, etc.)
     * @param array $entryData Base entry data
     * @param callable $specificDataCallback Callback to generate specific data
     * @param string $specificModelClass Model class for specific data
     * @return string Action taken: 'created', 'updated', or 'skipped'
     */
    private function createOrUpdateEntry(string $name, string $entryType, array $entryData, callable $specificDataCallback, string $specificModelClass): string
    {
        if ($this->option('dry-run')) {
            return 'created'; // For dry run, assume creation
        }

        // Check if entry exists with same name and type
        $existingEntry = CompendiumEntry::where('name', $name)
            ->where('entry_type', $entryType)
            ->where('is_system', true)
            ->first();

        if ($existingEntry && $this->option('update')) {
            // Update existing entry
            $existingEntry->update($entryData);

            // Update specific data
            $specificData = $specificDataCallback($existingEntry);
            $existingEntry->{$this->getRelationshipName($entryType)}()->updateOrCreate(
                ['compendium_entry_id' => $existingEntry->id],
                $specificData
            );

            return 'updated';
        } elseif ($existingEntry && !$this->option('clean') && !$this->option('update')) {
            // Skip if exists and not updating
            return 'skipped';
        } else {
            // Create new entry
            $entry = CompendiumEntry::create([
                'name' => $name,
                'entry_type' => $entryType,
                'is_system' => true,
                ...$entryData
            ]);

            // Create specific data
            $specificData = $specificDataCallback($entry);
            $specificModelClass::create($specificData);

            return 'created';
        }
    }

    /**
     * Get the relationship name for a given entry type
     */
    private function getRelationshipName(string $entryType): string
    {
        return match($entryType) {
            'spell' => 'spell',
            'item' => 'item',
            'monster' => 'monster',
            'race' => 'race',
            'class' => 'dndClass',
            'subclass' => 'subclass',
            'background' => 'background',
            'feat' => 'feat',
            default => $entryType,
        };
    }

    /**
     * Update import statistics
     */
    private function updateImportStats(string $action): void
    {
        if (isset($this->importStats[$action])) {
            $this->importStats[$action]++;
        }
    }

    private function importItems($xml)
    {
        $items = $xml->xpath('//item');
        $this->info("Processing " . count($items) . " items...");

        $progressBar = $this->output->createProgressBar(count($items));

        foreach ($items as $item) {
            $name = (string) $item->name;
            $result = $this->createOrUpdateEntry($name, 'item', [
                'text' => (string) $item->text,
                'source' => $this->extractSource((string) $item->text),
            ], function($entry) use ($item) {
                return [
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
                ];
            }, CompendiumItem::class);

            $this->updateImportStats($result);
            $progressBar->advance();
        }

        $progressBar->finish();
        $this->newLine();
    }

    private function importSpells($xml)
    {
        $spells = $xml->xpath('//spell');
        $this->info("Processing " . count($spells) . " spells...");

        $progressBar = $this->output->createProgressBar(count($spells));

        foreach ($spells as $spell) {
            $name = (string) $spell->name;
            $result = $this->createOrUpdateEntry($name, 'spell', [
                'text' => (string) $spell->text,
                'source' => $this->extractSource((string) $spell->text),
            ], function($entry) use ($spell) {
                return [
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
                ];
            }, CompendiumSpell::class);

            $this->updateImportStats($result);
            $progressBar->advance();
        }

        $progressBar->finish();
        $this->newLine();
    }

    private function importMonsters($xml)
    {
        $monsters = $xml->xpath('//monster');
        $this->info("Processing " . count($monsters) . " monsters...");

        $progressBar = $this->output->createProgressBar(count($monsters));

        foreach ($monsters as $monster) {
            $name = (string) $monster->name;
            $result = $this->createOrUpdateEntry($name, 'monster', [
                'text' => (string) $monster->description,
                'source' => $this->extractSource((string) $monster->description),
            ], function($entry) use ($monster) {
                return [
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
                ];
            }, CompendiumMonster::class);

            $this->updateImportStats($result);
            $progressBar->advance();
        }

        $progressBar->finish();
        $this->newLine();
    }

    private function importRaces($xml)
    {
        $races = $xml->xpath('//race');
        $this->info("Processing " . count($races) . " races...");

        $progressBar = $this->output->createProgressBar(count($races));

        foreach ($races as $race) {
            $name = (string) $race->name;
            $result = $this->createOrUpdateEntry($name, 'race', [
                'text' => (string) $race->text,
                'source' => $this->extractSource((string) $race->text),
            ], function($entry) use ($race) {
                return [
                    'compendium_entry_id' => $entry->id,
                    'size' => (string) $race->size ?: null,
                    'speed' => (string) $race->speed ?: null,
                    'ability' => (string) $race->ability ?: null,
                    'proficiency' => (string) $race->proficiency ?: null,
                    'spellAbility' => (string) $race->spellAbility ?: null,
                    'traits' => $this->extractTraits($race),
                    'modifiers' => $this->extractModifiers($race),
                ];
            }, CompendiumRace::class);

            $this->updateImportStats($result);
            $progressBar->advance();
        }

        $progressBar->finish();
        $this->newLine();
    }

    private function importClasses($xml)
    {
        $classes = $xml->xpath('//class');
        $this->info("Processing " . count($classes) . " classes...");

        $progressBar = $this->output->createProgressBar(count($classes));

        foreach ($classes as $class) {
            $name = (string) $class->name;
            $result = $this->createOrUpdateEntry($name, 'class', [
                'text' => (string) $class->text,
                'source' => $this->extractSource((string) $class->text),
            ], function($entry) use ($class) {
                return [
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
                ];
            }, CompendiumDndClass::class);

            $this->updateImportStats($result);

            // Import subclasses for this class
            $this->importSubclassesForClass($class, $name);

            $progressBar->advance();
        }

        $progressBar->finish();
        $this->newLine();
    }

    private function importSubclassesForClass($classElement, $className)
    {
        // Find the parent class entry
        $parentClassEntry = CompendiumEntry::where('name', $className)
            ->where('entry_type', 'class')
            ->where('is_system', true)
            ->first();

        if (!$parentClassEntry) {
            return;
        }

        // In D&D 2024, subclasses are defined as features with specific naming patterns
        // Look for features with names like "Barbarian Subclass: Path of the Wild Heart"
        $subclassFeatures = $classElement->xpath('.//feature[@optional="YES" and contains(name, "Subclass:")]');

        // Also look for features with patterns like "Primal Path: Path of the Giant"
        $pathFeatures = $classElement->xpath('.//feature[@optional="YES" and (contains(name, "Path:") or contains(name, "Circle:") or contains(name, "College:") or contains(name, "Domain:") or contains(name, "School:") or contains(name, "Archetype:") or contains(name, "Tradition:") or contains(name, "Patron:") or contains(name, "Conclave:") or contains(name, "Oath:") or contains(name, "Way:"))]');

        $allSubclassFeatures = array_merge($subclassFeatures, $pathFeatures);

        $processedSubclasses = [];

        foreach ($allSubclassFeatures as $feature) {
            $featureName = (string) $feature->name;

            // Extract subclass name from different patterns
            $subclassName = null;
            if (preg_match('/Subclass:\s*(.+)/', $featureName, $matches)) {
                $subclassName = trim($matches[1]);
            } elseif (preg_match('/(Path|Circle|College|Domain|School|Archetype|Tradition|Patron|Conclave|Oath|Way):\s*(.+)/', $featureName, $matches)) {
                $subclassName = trim($matches[2]);
            }

            if (!$subclassName || in_array($subclassName, $processedSubclasses)) {
                continue;
            }

            $processedSubclasses[] = $subclassName;

            // Collect all features for this subclass
            $subclassFeaturesList = [];
            $subclassAutolevels = [];

            // Find all features that belong to this subclass
            $allFeatures = $classElement->xpath('.//feature[contains(name, "' . $subclassName . '")]');
            foreach ($allFeatures as $subFeature) {
                $subclassFeaturesList[] = [
                    'name' => (string) $subFeature->name,
                    'text' => (string) $subFeature->text,
                ];
            }

            // Find autolevels that belong to this subclass
            $autolevels = $classElement->xpath('.//autolevel[.//feature[contains(name, "' . $subclassName . '")] or .//counter/subclass[text()="' . $subclassName . '"]]');
            foreach ($autolevels as $autolevel) {
                $level = (int) $autolevel->attributes()->level;
                if (!isset($subclassAutolevels[$level])) {
                    $subclassAutolevels[$level] = [
                        'level' => $level,
                        'features' => [],
                    ];
                }

                foreach ($autolevel->xpath('.//feature[contains(name, "' . $subclassName . '")]') as $levelFeature) {
                    $subclassAutolevels[$level]['features'][] = [
                        'name' => (string) $levelFeature->name,
                        'text' => (string) $levelFeature->text,
                    ];
                }
            }

            $fullSubclassName = $subclassName . " (" . $className . ")";

            $result = $this->createOrUpdateEntry($fullSubclassName, 'subclass', [
                'text' => (string) $feature->text,
                'source' => $this->extractSource((string) $feature->text),
            ], function($entry) use ($subclassFeaturesList, $subclassAutolevels, $parentClassEntry) {
                return [
                    'compendium_entry_id' => $entry->id,
                    'parent_class_id' => $parentClassEntry->id,
                    'features' => $subclassFeaturesList,
                    'autolevels' => $subclassAutolevels,
                ];
            }, CompendiumSubclass::class);

            $this->updateImportStats($result);
        }
    }

    private function importBackgrounds($xml)
    {
        $backgrounds = $xml->xpath('//background');
        $this->info("Processing " . count($backgrounds) . " backgrounds...");

        $progressBar = $this->output->createProgressBar(count($backgrounds));

        foreach ($backgrounds as $background) {
            $name = (string) $background->name;
            $result = $this->createOrUpdateEntry($name, 'background', [
                'text' => (string) $background->text,
                'source' => $this->extractSource((string) $background->text),
            ], function($entry) use ($background) {
                return [
                    'compendium_entry_id' => $entry->id,
                    'proficiency' => (string) $background->proficiency ?: null,
                    'languages' => (string) $background->languages ?: null,
                    'equipment' => (string) $background->equipment ?: null,
                    'gold' => (string) $background->gold ?: null,
                    'traits' => $this->extractTraits($background),
                ];
            }, CompendiumBackground::class);

            $this->updateImportStats($result);
            $progressBar->advance();
        }

        $progressBar->finish();
        $this->newLine();
    }

    private function importFeats($xml)
    {
        $feats = $xml->xpath('//feat');
        $this->info("Processing " . count($feats) . " feats...");

        $progressBar = $this->output->createProgressBar(count($feats));

        foreach ($feats as $feat) {
            $name = (string) $feat->name;
            $result = $this->createOrUpdateEntry($name, 'feat', [
                'text' => (string) $feat->text,
                'source' => $this->extractSource((string) $feat->text),
            ], function($entry) use ($feat) {
                return [
                    'compendium_entry_id' => $entry->id,
                    'prerequisite' => (string) $feat->prerequisite ?: null,
                    'modifiers' => $this->extractModifiers($feat),
                    'traits' => $this->extractTraits($feat),
                ];
            }, CompendiumFeat::class);

            $this->updateImportStats($result);
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

    private function extractFeatures($element): ?array
    {
        $features = [];
        foreach ($element->xpath('.//feature') as $feature) {
            $features[] = [
                'name' => (string) $feature->name,
                'text' => (string) $feature->text,
            ];
        }
        return !empty($features) ? $features : null;
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
                'features' => $this->extractFeatures($autolevel),
            ];
        }
        return !empty($autolevels) ? $autolevels : null;
    }
}
