import React from 'react'

export function Footer() {
  return (
      <footer className="bg-neutral-800 py-4 text-center text-blue-200">
        <p>© {new Date().getFullYear()} Mobile Legends: Bang Bang Guide</p>
        <p className="text-sm mt-1">
          This site is not affiliated with or endorsed by Moonton.
        </p>
      </footer>
  )
}