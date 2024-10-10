'use client'

import React, { useState, useEffect, useRef, KeyboardEvent } from 'react'
import { Search, X, Clock } from 'lucide-react'
import heroData from '@/lib/data/ids.json'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Hero {
  id: number
  name: string
}

interface SearchBarProps {
  onHeroSelect: (heroId: number) => void
  selectedHero: Hero | null
}

export function SearchBar({ onHeroSelect, selectedHero }: SearchBarProps) {
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [isLoading, setIsLoading] = useState(false)
  const [recentlySelected, setRecentlySelected] = useState<Hero[]>([])
  const heroes: Hero[] = heroData.heroes
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (selectedHero) {
      setSearch(selectedHero.name)
      updateRecentlySelected(selectedHero)
    }
  }, [selectedHero])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const filteredHeroes = heroes.filter(hero =>
      hero.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelect = (hero: Hero) => {
    setIsLoading(true)
    setTimeout(() => {
      onHeroSelect(hero.id)
      setSearch(hero.name)
      setIsOpen(false)
      setIsLoading(false)
      inputRef.current?.blur()
      updateRecentlySelected(hero)
    }, 500) // Simulate loading
  }

  const updateRecentlySelected = (hero: Hero) => {
    setRecentlySelected(prev => {
      const filtered = prev.filter(h => h.id !== hero.id)
      return [hero, ...filtered].slice(0, 3)
    })
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      setActiveIndex(prev => (prev < filteredHeroes.length - 1 ? prev + 1 : prev))
    } else if (e.key === 'ArrowUp') {
      setActiveIndex(prev => (prev > 0 ? prev - 1 : prev))
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      handleSelect(filteredHeroes[activeIndex])
    }
  }

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text
    const parts = text.split(new RegExp(`(${query})`, 'gi'))
    return parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? <mark key={index} className="bg-yellow-200 text-black">{part}</mark> : part
    )
  }

  return (
      <div className="relative w-full">
        <div className="relative">
          <Input
              ref={inputRef}
              type="text"
              placeholder="Search hero..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setIsOpen(true)
                setActiveIndex(-1)
              }}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleKeyDown}
              className="w-full pl-10 pr-10"
              disabled={isLoading}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          {search && (
              <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => {
                    setSearch('')
                    setIsOpen(false)
                    inputRef.current?.focus()
                  }}
              >
                <X className="h-4 w-4" />
              </Button>
          )}
        </div>
        {isOpen && (
            <div
                ref={dropdownRef}
                className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
            >
              {recentlySelected.length > 0 && search === '' && (
                  <div className="p-2 text-sm text-gray-500">
                    <div className="flex items-center gap-1 mb-2">
                      <Clock className="h-4 w-4" />
                      <span>Recently selected</span>
                    </div>
                    {recentlySelected.map((hero) => (
                        <Button
                            key={hero.id}
                            variant="ghost"
                            className="w-full justify-start text-black"
                            onClick={() => handleSelect(hero)}
                        >
                          {hero.name}
                        </Button>
                    ))}
                    <hr className="my-2" />
                  </div>
              )}
              {filteredHeroes.length > 0 ? (
                  filteredHeroes.map((hero, index) => (
                      <Button
                          key={hero.id}
                          variant="ghost"
                          className={`w-full justify-start text-black ${index === activeIndex ? 'bg-gray-100' : ''}`}
                          onClick={() => handleSelect(hero)}
                      >
                        {highlightMatch(hero.name, search)}
                      </Button>
                  ))
              ) : (
                  <div className="p-2 text-sm text-gray-500">No results found</div>
              )}
            </div>
        )}
        {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        )}
      </div>
  )
}