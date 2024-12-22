import React from 'react';
import Image from 'next/image';
import {
  Sword,
  Shield,
  Users,
  TrendingUp,
  TrendingDown,
  MapPin,
  Tag,
  Info,
  Ban,
} from 'lucide-react';
import { FinalHeroDataType } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AbilityBar } from '@/components/AbilityBar';
import { cn, getHeroName } from '@/lib/utils';

export default function HeroData({ data }: { data: FinalHeroDataType }) {
  const BriefStats = () => (
    <Card className="bg-gray-900/80 backdrop-blur-sm border-violet-500/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-pink-600">
          {data.name}
        </CardTitle>
        <Image
          src={data.images.head}
          alt={data.name}
          width={60}
          height={60}
          className="rounded-full border-2 border-violet-400/50"
        />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <Stat
            label="Rank"
            value={'Rank'}
            icon={<Info className="h-4 w-4" />}
          />
          <Stat
            label="Appearance"
            value={`${(Number(data.pick_rate) * 100).toFixed(2)}%`}
            icon={<Users className="h-4 w-4" />}
          />
          <Stat
            label="Win Rate"
            value={`${(Number(data.win_rate) * 100).toFixed(2)}%`}
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <Stat
            label="Ban Rate"
            value={`${(Number(data.ban_rate) * 100).toFixed(2)}%`}
            icon={<Ban className="h-4 w-4" />}
          />
        </div>
      </CardContent>
    </Card>
  );

  const Stat = ({
    label,
    value,
    icon,
  }: {
    label: string;
    value: string | number;
    icon: React.ReactNode;
  }) => (
    <div className="flex flex-col">
      <div className="text-sm font-medium text-violet-400/80 flex items-center">
        {icon}
        <span className="ml-1">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  );

  const HeroList = ({ heroes }: { heroes: FinalHeroDataType['effective'] }) => (
    <ul className="space-y-2">
      {heroes?.map((hero, index) => (
        <li
          key={index}
          className="flex items-center justify-between bg-violet-950/30 backdrop-blur-sm p-2 rounded-lg border border-violet-500/20 hover:border-violet-500/40 transition-all"
        >
          <div className="flex items-center">
            <Image
              src={hero.image}
              alt={`Hero ${hero.hero_id}`}
              width={40}
              height={40}
              className="rounded-full border border-violet-400/50 mr-2"
            />
            <span className="text-violet-100">
              {getHeroName(parseInt(hero.hero_id))}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-xs text-violet-400/80">Win rate</h3>
            <span
              className={cn('flex items-center', {
                'text-green-400': Number(hero.increase_win_rate) > 0,
                'text-red-400': Number(hero.increase_win_rate) <= 0,
              })}
            >
              {Number(hero.increase_win_rate) > 0 ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              {`${Number(hero.increase_win_rate) > 0 ? '+' : ''} ${(
                Number(hero.increase_win_rate) * 100
              ).toFixed(1)}%`}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="relative backdrop-blur-sm rounded-lg p-6 mt-8 ">
      <div className="flex flex-col lg:flex-row items-start gap-6 mb-8">
        <Image
          src={data.images.head_big}
          alt={data.name}
          width={300}
          height={300}
          className="rounded-lg shadow-lg border-2 border-violet-400/50"
        />
        <div className="flex-grow">
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-pink-600">
            {data.tagline}
          </h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {data.speciality
              .concat(data.role)
              .filter(Boolean)
              .map((type, index) => (
                <span
                  key={index}
                  className="bg-violet-500/20 backdrop-blur-sm text-violet-200 px-3 py-1 rounded-full text-sm flex items-center border border-violet-500/40"
                >
                  {type.includes('Lane') ? (
                    <MapPin className="w-4 h-4 mr-1" />
                  ) : (
                    <Tag className="w-4 h-4 mr-1" />
                  )}
                  {type}
                </span>
              ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
            {Object.entries(data.abilities).map(([stat, value]) => (
              <div key={stat} className="text-center">
                <div className="text-lg font-semibold text-violet-400">
                  {stat}
                </div>
                <AbilityBar value={Number(value)} label={stat} />
                <div className="text-2xl font-bold text-white">{value}</div>
              </div>
            ))}
          </div>
          <BriefStats />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="bg-gray-900/80 backdrop-blur-sm border-violet-500/20">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl text-violet-200">
              <Sword className="mr-2" /> Counters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="best-against" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4 bg-violet-950/50">
                <TabsTrigger value="best-against">Best Against</TabsTrigger>
                <TabsTrigger value="worst-against">Worst Against</TabsTrigger>
              </TabsList>
              <TabsContent value="best-against">
                <h3 className="text-lg font-semibold mb-2 flex items-center text-violet-200">
                  <TrendingUp className="mr-2" /> {data.name} counters these
                  heroes
                </h3>
                <HeroList heroes={data.effective} />
              </TabsContent>
              <TabsContent value="worst-against">
                <h3 className="text-lg font-semibold mb-2 flex items-center text-violet-200">
                  <TrendingDown className="mr-2" /> {data.name} is countered by
                  these heroes
                </h3>
                <HeroList heroes={data.ineffective} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/80 backdrop-blur-sm border-violet-500/20">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl text-violet-200">
              <Users className="mr-2" /> Compatibilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="best-with" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4 bg-violet-950/50">
                <TabsTrigger value="best-with">Best With</TabsTrigger>
                <TabsTrigger value="worst-with">Worst With</TabsTrigger>
              </TabsList>
              <TabsContent value="best-with">
                <h3 className="text-lg font-semibold mb-2 flex items-center text-violet-200">
                  <TrendingUp className="mr-2" /> {data.name} works best with
                  these heroes
                </h3>
                <HeroList heroes={data.compatible} />
              </TabsContent>
              <TabsContent value="worst-with">
                <h3 className="text-lg font-semibold mb-2 flex items-center text-violet-200">
                  <TrendingDown className="mr-2" /> {data.name} works poorly
                  with these heroes
                </h3>
                <HeroList heroes={data.incompatible} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-900/80 backdrop-blur-sm border-violet-500/20">
        <CardHeader>
          <CardTitle className="text-2xl text-violet-200">
            Hero Relationships
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['works_well_with', 'strong_against', 'weak_against'].map(
              relationKey => {
                const relationData =
                  data.relation?.[relationKey as keyof typeof data.relation];
                const uniqueHeads = Array.from(
                  new Set(relationData?.heads || [])
                );

                return (
                  <div
                    key={relationKey}
                    className="bg-violet-950/30 backdrop-blur-sm p-4 rounded-lg border border-violet-500/20"
                  >
                    <h3 className="text-lg font-semibold mb-2 flex items-center text-violet-200">
                      {relationKey === 'works_well_with' && (
                        <Users className="mr-2" />
                      )}
                      {relationKey === 'strong_against' && (
                        <Sword className="mr-2" />
                      )}
                      {relationKey === 'weak_against' && (
                        <Shield className="mr-2" />
                      )}
                      {relationKey
                        .split('_')
                        .map(
                          word => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(' ')}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {uniqueHeads.map(head => (
                        <Image
                          key={`${relationKey}-${head}`}
                          src={head}
                          alt={`Hero ${head}`}
                          width={40}
                          height={40}
                          className="rounded-full border border-violet-400/50"
                        />
                      ))}
                    </div>
                    <p className="text-sm text-violet-200/80">
                      {relationData?.description || 'No description available'}
                    </p>
                  </div>
                );
              }
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
