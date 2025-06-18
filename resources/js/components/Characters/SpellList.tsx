import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SpellData {
  id?: number;
  compendium_entry_id: number;
  level: number;
  school: string;
  casting_time?: string;
  range?: string;
  components?: string;
  duration?: string;
  ritual?: boolean;
  concentration?: boolean;
  compendium_entry?: {
    name: string;
    text?: string;
  };
}

interface SpellListProps {
  title: string;
  spells: SpellData[];
  showRemoveButton?: boolean;
  onRemoveSpell?: (spellId: number) => void;
  emptyMessage?: string;
}

const getSchoolDisplayName = (school: string): string => {
  const schoolMap: { [key: string]: string } = {
    EV: "Evocation",
    AB: "Abjuration",
    CO: "Conjuration",
    DI: "Divination",
    EN: "Enchantment",
    IL: "Illusion",
    NE: "Necromancy",
    TR: "Transmutation",
    abjuration: "Abjuration",
    conjuration: "Conjuration",
    divination: "Divination",
    enchantment: "Enchantment",
    evocation: "Evocation",
    illusion: "Illusion",
    necromancy: "Necromancy",
    transmutation: "Transmutation",
  };
  return schoolMap[school] || school || "Unknown";
};

export default function SpellList({
  title,
  spells,
  showRemoveButton = false,
  onRemoveSpell,
  emptyMessage = "No spells available.",
}: SpellListProps) {
  if (spells.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title} (0)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            {emptyMessage}
          </p>
        </CardContent>
      </Card>
    );
  }

  // Group spells by level
  const spellsByLevel = Array.from(new Set(spells.map((spell) => spell.level)))
    .sort((a, b) => a - b)
    .map((level) => ({
      level,
      spells: spells.filter((spell) => spell.level === level),
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {title} ({spells.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {spellsByLevel.map(({ level, spells: levelSpells }) => (
            <div key={level}>
              <h4 className="font-semibold mb-3">
                {level === 0 ? "Cantrips" : `Level ${level} Spells`}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {levelSpells.map((spell, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-semibold">
                        {spell.compendium_entry?.name}
                      </h5>
                      <div className="flex gap-1">
                        <Badge variant="secondary" className="text-xs">
                          {getSchoolDisplayName(spell.school)}
                        </Badge>
                        {spell.ritual && (
                          <Badge variant="outline" className="text-xs">
                            Ritual
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>
                        <strong>Casting Time:</strong>{" "}
                        {spell.casting_time || "1 action"}
                      </div>
                      <div>
                        <strong>Range:</strong> {spell.range || "Unknown"}
                      </div>
                      <div>
                        <strong>Components:</strong>{" "}
                        {spell.components || "Unknown"}
                      </div>
                      <div>
                        <strong>Duration:</strong> {spell.duration || "Unknown"}
                      </div>
                    </div>
                    <div className="mt-3 text-sm">
                      <strong>Description:</strong>{" "}
                      <div className="mt-1 leading-relaxed">
                        {spell.compendium_entry?.text || "No description available."}
                      </div>
                    </div>
                    {showRemoveButton && onRemoveSpell && (
                      <div className="mt-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            onRemoveSpell(spell.compendium_entry_id)
                          }
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
