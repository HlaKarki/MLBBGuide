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
  selectedRank: number
  onRankChange: (rankId: number) => void
}

export default function RankSelector({ selectedRank, onRankChange }: RankSelectorProps) {
  return (
      <Select
          defaultValue={selectedRank.toString()}
          onValueChange={(value) => onRankChange(Number(value))}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a rank" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Rank</SelectLabel>
            {ranks.map((rank) => (
                <SelectItem key={rank.id} value={rank.id.toString()}>
                  {rank.name}
                </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
  )
}