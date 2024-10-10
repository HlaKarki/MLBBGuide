import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RecentSearchProps {
  recentSearches: Array<{id: string | number, name: string}>;
  onHeroSelect: (heroId: number | string, rank?: number) => void;
}

export const RecentSearch: React.FC<RecentSearchProps> = ({ recentSearches, onHeroSelect }) => {
  return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Searches</CardTitle>
          <CardDescription>Your last 5 hero searches</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {recentSearches.map((hero) => (
                <Button
                    key={hero.id}
                    variant="outline"
                    onClick={() => onHeroSelect(hero.id)}
                    className="w-full"
                >
                  {hero.name}
                </Button>
            ))}
          </div>
        </CardContent>
      </Card>
  );
};