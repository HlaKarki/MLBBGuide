'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Minus, TrendingDown, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FinalHeroDataType } from '@/lib/types';

type DataPoint = {
  date: string;
  win_rate?: number;
  ban_rate?: number;
  app_rate?: number;
};

const CustomTooltip = ({ statType, active, payload, label, data }: any) => {
  if (active && payload && payload.length) {
    const currentIndex = data.findIndex(
      (item: DataPoint) => item.date === label
    );
    const previousDayData = currentIndex > 0 ? data[currentIndex - 1] : null;

    const currentStat = payload[0].value;
    const previousStat = previousDayData
      ? previousDayData[`${statType}_rate`]
      : null;

    let changeText = 'N/A';
    let percentageChangeText = '';
    let percentageChangeClass = '';
    let changeClass = '';
    let changeIcon = <Minus className="w-4 h-4 mr-2" />;

    if (previousStat !== null) {
      const absoluteChange = currentStat - previousStat;
      const percentageChange = (absoluteChange / previousStat) * 100;

      changeText = `${absoluteChange > 0 ? '+' : ''}${absoluteChange.toFixed(
        2
      )}%`;
      percentageChangeText = `(${percentageChange.toFixed(2)}%)`;

      changeClass =
        absoluteChange > 0
          ? 'text-green-400'
          : absoluteChange < 0
          ? 'text-red-400'
          : 'text-blue-300';

      percentageChangeClass =
        percentageChange > 0
          ? 'text-green-200'
          : percentageChange < 0
          ? 'text-red-200'
          : 'text-blue-300';

      changeIcon =
        absoluteChange > 0 ? (
          <TrendingUp className="w-4 h-4 mr-2" />
        ) : absoluteChange < 0 ? (
          <TrendingDown className="w-4 h-4 mr-2" />
        ) : (
          <Minus className="w-4 h-4 mr-2" />
        );
    }

    const statLabel =
      statType === 'app'
        ? 'Pick Rate'
        : `${statType[0].toUpperCase()}${statType.slice(1)} Rate`;

    return (
      <div className="bg-gray-900/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-violet-500/20">
        <p className="text-violet-300">{label}</p>
        <p className="font-bold text-violet-100">
          {`${statLabel}: ${currentStat.toFixed(2)}%`}
        </p>
        {previousStat !== null && (
          <>
            <p className="text-violet-300">
              {`Previous ${statLabel}: ${previousStat.toFixed(2)}%`}
            </p>
            <p className={`${changeClass} font-semibold flex items-center`}>
              {changeIcon}
              <div className="flex items-center gap-2">
                <span>{`Change: ${changeText}`}</span>
                <span className={percentageChangeClass}>
                  {percentageChangeText}
                </span>
              </div>
            </p>
          </>
        )}
      </div>
    );
  }
  return null;
};

export default function HeroGraph({
  heroData,
}: {
  heroData: FinalHeroDataType;
}) {
  const [data, setData] = useState<DataPoint[]>([]);
  const [statType, setStatType] = useState<'win' | 'ban' | 'app'>('win');

  const processData = useCallback(() => {
    try {
      if (!heroData.graph?.win_rate) {
        setData([]);
        return;
      }

      let processedData = heroData.graph.win_rate
        .map(item => ({
          date: new Date(item.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          }),
          win_rate: Number((item.win_rate * 100).toFixed(2)),
          ban_rate: Number((item.ban_rate * 100).toFixed(2)),
          app_rate: Number((item.app_rate * 100).toFixed(2)),
        }))
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

      setData(processedData);
    } catch (error) {
      console.error('Error processing data:', error);
      setData([]);
    }
  }, [heroData]);

  useEffect(() => {
    processData();
  }, [heroData, processData]);

  const dataValues = data.map(d => d[`${statType}_rate`] || 0);
  const minDataValue = Math.min(...dataValues);
  const maxDataValue = Math.max(...dataValues);
  const dataRange = maxDataValue - minDataValue;

  const paddingPercentage = 0.1;
  let padding = dataRange * paddingPercentage;

  const minPadding = 0.2;
  if (padding < minPadding) {
    padding = minPadding;
  }

  const minRate = Math.floor(minDataValue - padding);
  const maxRate = Math.ceil(maxDataValue + padding);

  return (
    <Card className="w-full bg-gray-900/80 backdrop-blur-sm border-violet-500/20">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-violet-100">
          <div className="flex justify-between">
            <h2 className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-pink-600">
              {heroData.name}{' '}
              {statType === 'app'
                ? 'Pick'
                : statType[0].toUpperCase() + statType.slice(1)}{' '}
              Rate Trend
            </h2>
            <div className="flex gap-1">
              <Button
                variant={statType === 'win' ? 'default' : 'ghost'}
                onClick={() => setStatType('win')}
                className={
                  statType === 'win'
                    ? 'bg-violet-600 hover:bg-violet-700'
                    : 'text-violet-300 hover:text-violet-100 hover:bg-violet-950/50'
                }
              >
                Win Rate
              </Button>
              <Button
                variant={statType === 'ban' ? 'default' : 'ghost'}
                onClick={() => setStatType('ban')}
                className={
                  statType === 'ban'
                    ? 'bg-violet-600 hover:bg-violet-700'
                    : 'text-violet-300 hover:text-violet-100 hover:bg-violet-950/50'
                }
              >
                Ban Rate
              </Button>
              <Button
                variant={statType === 'app' ? 'default' : 'ghost'}
                onClick={() => setStatType('app')}
                className={
                  statType === 'app'
                    ? 'bg-violet-600 hover:bg-violet-700'
                    : 'text-violet-300 hover:text-violet-100 hover:bg-violet-950/50'
                }
              >
                Pick Rate
              </Button>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#4c3a88" />
              <XAxis
                dataKey="date"
                stroke="#a78bfa"
                tick={{ fill: '#a78bfa' }}
                tickLine={{ stroke: '#a78bfa' }}
              />
              <YAxis
                domain={[minRate, maxRate]}
                stroke="#a78bfa"
                tick={{ fill: '#a78bfa' }}
                tickLine={{ stroke: '#a78bfa' }}
                tickFormatter={value => `${value}%`}
              />
              <Tooltip
                content={<CustomTooltip data={data} statType={statType} />}
              />
              <Line
                type="monotone"
                dataKey={`${statType}_rate`}
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ r: 4, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }}
                activeDot={{
                  r: 6,
                  fill: '#8b5cf6',
                  stroke: '#fff',
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
