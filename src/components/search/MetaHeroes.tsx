import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MetaHeroesType } from "@/lib/types";

interface MetaHeroesProps {
  metaHeroes: MetaHeroesType[];
  onHeroSelect: (heroId: number | string) => void;
}

export const MetaHeroes: React.FC<MetaHeroesProps> = ({ metaHeroes, onHeroSelect }) => {
  return (
      <Card>
        <CardHeader>
          <CardTitle>Current Meta Heroes</CardTitle>
          <CardDescription>Top performing heroes in the current meta</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {metaHeroes.map((hero) => (
                <Card key={hero.heroid} className="bg-blue-800 text-white">
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">{hero.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-blue-200">Win Rate: {Number(hero.win_rate).toFixed(2)}%</p>
                    <Button
                        variant="secondary"
                        className="w-full mt-2"
                        onClick={() => onHeroSelect(hero.heroid || "30")}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
            ))}
          </div>
        </CardContent>
      </Card>
  );
};