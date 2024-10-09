'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Search } from 'lucide-react'
import heroData from '@/lib/data/ids.json'

interface Hero {
  id: number
  name: string
}

interface SearchBarProps {
  onHeroSelect: (heroId: number) => void
}

export function SearchBar({ onHeroSelect }: SearchBarProps) {
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const heroes: Hero[] = heroData.heroes
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const filteredHeroes = heroes.filter(hero =>
      hero.name.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (listRef.current && !listRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSelect = (hero: Hero) => {
    onHeroSelect(hero.id)
    setSearch('')
    setIsOpen(false)
    inputRef.current?.blur()
  }

  return (
      <div className="relative w-full max-w-md mx-auto">
        <div className="relative">
          <input
              ref={inputRef}
              type="text"
              placeholder="Search hero..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setIsOpen(true)
              }}
              onFocus={() => setIsOpen(true)}
              className="w-full p-3 pl-10 bg-white bg-opacity-20 border border-blue-300 rounded-md text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <Search className="absolute left-3 top-3 text-blue-200" />
        </div>
        {isOpen && search && (
            <ul
                ref={listRef}
                className="absolute z-10 mt-1 w-full bg-blue-800 border border-blue-600 rounded-md max-h-60 overflow-y-auto"
            >
              {filteredHeroes.map((hero) => (
                  <li
                      key={hero.id}
                      onClick={() => handleSelect(hero)}
                      className="p-2 hover:bg-blue-700 cursor-pointer transition-colors duration-150 ease-in-out"
                  >
                    {hero.name}
                  </li>
              ))}
            </ul>
        )}
      </div>
  )
}