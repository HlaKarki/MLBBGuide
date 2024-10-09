import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Sword, Shield } from 'lucide-react';
import { StatsType } from "@/lib/types";

interface StatsProps {
  stats: StatsType | null;
}

export const Stats: React.FC<StatsProps> = ({ stats }) => {
  if (!stats) return null;

  return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-blue-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Heroes</CardTitle>
            <Users className="h-4 w-4 text-blue-200"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHeroes}</div>
            <p className="text-xs text-blue-200">+2 since last update</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Banned</CardTitle>
            <Shield className="h-4 w-4 text-blue-200"/>
          </CardHeader>
          <CardContent>
            <Image
                src={stats.mostBannedHead}
                alt={stats.mostBanned}
                width={60}
                height={60}
                className="rounded-full"
            />
            <div className="text-2xl font-bold">{stats.mostBanned}</div>
            <p className="text-xs text-blue-200">{Number(stats.banRate).toFixed(2)}% ban rate across all ranks</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Highest Win Rate</CardTitle>
            <Sword className="h-4 w-4 text-blue-200"/>
          </CardHeader>
          <CardContent>
            <Image
                src={stats.mostWinHead}
                alt={stats.mostWin}
                width={60}
                height={60}
                className="rounded-full"
            />
            <div className="text-2xl font-bold">{stats.mostWin}</div>
            <p className="text-xs text-blue-200">{Number(stats.winRate).toFixed(2)}% win rate across all ranks</p>
          </CardContent>
        </Card>
      </div>
  );
};