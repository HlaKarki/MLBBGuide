import React from 'react'

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

export const RankSelector: React.FC<RankSelectorProps> = ({ selectedRank, onRankChange }) => {
  return (
      <select
          value={selectedRank}
          onChange={(e) => onRankChange(Number(e.target.value))}
          className="bg-blue-800 text-white border border-blue-600 rounded-md p-2"
      >
        {ranks.map((rank) => (
            <option key={rank.id} value={rank.id}>
              {rank.name}
            </option>
        ))}
      </select>
  )
}