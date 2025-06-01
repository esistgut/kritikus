import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Star } from 'lucide-react';

interface Feature {
  name: string;
  text: string;
  level?: number;
}

interface AutoLevel {
  level: number;
  features?: Array<{
    name: string;
    text: string;
  }>;
}

interface CompendiumFeatureDisplayProps {
  entry: {
    name: string;
    entry_type: string;
    specific_data: {
      traits?: any[];
      autolevels?: AutoLevel[] | Record<string, AutoLevel>; // Can be array or object
      features?: any[]; // For subclasses
    };
  };
  maxLevel?: number; // For filtering features by level, defaults to 20 for compendium
}

export default function CompendiumFeatureDisplay({ entry, maxLevel = 20 }: CompendiumFeatureDisplayProps) {
  // Extract features from autolevels and traits
  const getFeatures = (): Feature[] => {
    const features: Feature[] = [];
    const data = entry.specific_data;

    if (!data) return features;

    // Add traits (general features)
    if (data.traits && Array.isArray(data.traits)) {
      data.traits.forEach((trait: any) => {
        if (trait.name && trait.text) {
          features.push({
            name: trait.name,
            text: Array.isArray(trait.text) ? trait.text.join(' ') : trait.text
          });
        }
      });
    }

    // Add features from features array (for subclasses)
    if (data.features && Array.isArray(data.features)) {
      data.features.forEach((feature: any) => {
        if (feature.name && feature.text) {
          features.push({
            name: feature.name,
            text: Array.isArray(feature.text) ? feature.text.join(' ') : feature.text,
            level: feature.level
          });
        }
      });
    }

    // Add autolevels features for specified level and below
    if (data.autolevels) {
      // Handle both array and object formats for autolevels
      const autolevelsArray = Array.isArray(data.autolevels)
        ? data.autolevels
        : Object.values(data.autolevels);

      autolevelsArray
        .filter((autolevel: any) => autolevel.level <= maxLevel)
        .forEach((autolevel: any) => {
          // Each autolevel contains a features array
          if (autolevel.features && Array.isArray(autolevel.features)) {
            autolevel.features.forEach((feature: any) => {
              if (feature.name && feature.text) {
                features.push({
                  name: feature.name,
                  text: Array.isArray(feature.text) ? feature.text.join(' ') : feature.text,
                  level: autolevel.level
                });
              }
            });
          }
        });
    }

    return features;
  };

  const features = getFeatures();

  if (features.length === 0) {
    return null;
  }

  const isSubclass = entry.entry_type === 'subclass';
  const icon = isSubclass ? Star : BookOpen;
  const iconColor = isSubclass ? 'text-purple-500' : 'text-blue-500';
  const borderColor = isSubclass ? 'border-purple-500' : 'border-blue-500';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          {React.createElement(icon, { className: `h-5 w-5 mr-2 ${iconColor}` })}
          {entry.name} Features
        </CardTitle>
        <CardDescription>
          {isSubclass ? 'Subclass' : 'Class'} abilities and features
          {maxLevel < 20 && ` (up to level ${maxLevel})`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {features.map((feature, index) => (
          <div key={index} className={`border-l-4 ${borderColor} pl-4`}>
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold text-lg">{feature.name}</h4>
              {feature.level && (
                <Badge variant="outline" className="text-xs">
                  Level {feature.level}
                </Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground leading-relaxed">
              {feature.text}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
