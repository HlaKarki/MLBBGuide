'use client'

import {useState, useEffect, useCallback} from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import dataJSON from "@/lib/data/ids.json"
import {Minus, TrendingDown, TrendingUp} from "lucide-react";
import {DataPoint, HeroGraphData} from "@/lib/types";


const heroes = dataJSON.heroes

const CustomTooltip = ({ active, payload, label, data }: any) => {
  if (active && payload && payload.length) {
    const currentIndex = data.findIndex((item: DataPoint) => item.date === label);
    const previousDayData = currentIndex > 0 ? data[currentIndex - 1] : null;

    const currentWinRate = payload[0].value;
    const previousWinRate = previousDayData ? previousDayData.win_rate : null;

    let changeText = "N/A";
    let changeClass = "";

    let change = 0
    if (previousWinRate !== null) {
      change = currentWinRate - previousWinRate;
      changeText = `${change > 0 ? '+' : ''}${change.toFixed(2)}%`;
      changeClass = change > 0 ? "text-green-400" : change < 0 ? "text-red-400" : "text-blue-300";
    }

    return (
        <div className="bg-blue-900 p-4 rounded shadow-lg border border-blue-500">
          <p className="text-blue-200">{`${label}`}</p>
          <p className="font-bold text-blue-100">{`Win Rate: ${currentWinRate.toFixed(2)}%`}</p>
          <p className={`${changeClass} font-semibold flex items-center`}>
            {
              change > 0 ? <TrendingUp className="w-4 h-4 mr-2"/> :
              change < 0 ? <TrendingDown className="w-4 h-4 mr-2"/> : <Minus className="w-4 h-4 mr-2"/>
            }
            <span>{changeText}</span>
          </p>
        </div>
    );
  }
  return null;
};

export default function HeroWinRateChart({graphData} : {graphData: HeroGraphData}) {
  const [data, setData] = useState<Partial<DataPoint>[]>([])
  const [heroName, setHeroName] = useState<string>('')

    const processData =  useCallback(() => {
      try {
        const processedData = graphData.data.win_rate
            .map(item => ({
              date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              win_rate: Number((item.win_rate * 100).toFixed(2))
            }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

        setData(processedData)

        const hero = heroes.find(h => h.id === graphData.data.main_heroid)
        setHeroName(hero ? hero.name : `Hero ${graphData.data.main_heroid}`)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
  }, [graphData])

  useEffect(() => {
    processData()
  }, [graphData, processData])

  const minRate = Math.floor(Math.min(...data.map(d => d.win_rate || 0)) - 0.01)
  const maxRate = Math.ceil(Math.max(...data.map(d => d.win_rate || 0)) + 0.01)

  return (
      <Card className="w-full bg-gradient-to-br from-blue-900 to-blue-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-100">{heroName} Win Rate Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                <XAxis
                    dataKey="date"
                    stroke="#a0aec0"
                    tick={{ fill: '#a0aec0' }}
                    tickLine={{ stroke: '#a0aec0' }}
                />
                <YAxis
                    domain={[minRate, maxRate]}
                    stroke="#a0aec0"
                    tick={{ fill: '#a0aec0' }}
                    tickLine={{ stroke: '#a0aec0' }}
                    tickFormatter={(value) => `${value}%`}
                />
                <Tooltip content={<CustomTooltip data={data}/>} />
                <Line
                    type="monotone"
                    dataKey="win_rate"
                    stroke="#48bb78"
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#48bb78', stroke: '#fff', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#48bb78', stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
  )
}