'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import dataJSON from "@/lib/data/ids.json"

// Define the structure of our data
interface DataPoint {
  date: string
  win_rate: number
  ban_rate: number
  app_rate: number
}

interface HeroData {
  _createdAt: number
  _updatedAt: number
  data: {
    bigrank: string
    main_heroid: number
    win_rate: DataPoint[]
  }
}

interface Hero {
  id: number
  name: string
}

const heroes: Hero[] = dataJSON["heroes"]

export default function HeroGraph() {
  const [data, setData] = useState<DataPoint[]>([])
  const [heroName, setHeroName] = useState<string>('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/mlbb/graph?id=30&period=30')
        const heroData: HeroData = await response.json()

        // Process and sort the data
        const processedData = heroData.data.win_rate
            .map(item => ({
              date: item.date,
              win_rate: Number((item.win_rate * 100).toFixed(2)),
              ban_rate: Number((item.ban_rate * 100).toFixed(2)),
              app_rate: Number((item.app_rate * 100).toFixed(2))
            }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

        setData(processedData)

        // Find hero name
        const hero = heroes.find(h => h.id === heroData.data.main_heroid)
        setHeroName(hero ? hero.name : `Hero ${heroData.data.main_heroid}`)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{heroName} Statistics Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="win_rate" stroke="#8884d8" name="Win Rate (%)" />
                <Line type="monotone" dataKey="ban_rate" stroke="#82ca9d" name="Ban Rate (%)" />
                <Line type="monotone" dataKey="app_rate" stroke="#ffc658" name="Appearance Rate (%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
  )
}