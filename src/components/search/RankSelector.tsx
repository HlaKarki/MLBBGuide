import React from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getRanks } from '@/lib/utils'
import { RanksType } from '@/lib/types';

const ranks = [
  { id: 1, name: "Warrior" },
  { id: 2, name: "Elite" },
  { id: 3, name: "Master" },
  { id: 4, name: "Grandmaster" },
  { id: 5, name: "Epic" },
  { id: 6, name: "Legend" },
  { id: 7, name: "Mythic" },
  { id: 8, name: "Mythical Honor" },
  { id: 9, name: "Mythical Glory" },
  { id: 101, name: "All" }
]

interface RankSelectorProps {
  selectedRank: string
  onRankChange: (rank: RanksType) => void
}

export default function RankSelector({ selectedRank, onRankChange }: RankSelectorProps) {
  return (
      <Select
          defaultValue={selectedRank}
          onValueChange={(value: RanksType) => onRankChange(value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a rank" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Rank</SelectLabel>
            {getRanks().map((rank, idx) => (
                <SelectItem key={idx} value={rank}>
                  {rank}
                </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
  )
}