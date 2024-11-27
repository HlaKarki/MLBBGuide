import React from 'react'
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-24 text-center">
      <p className="text-gray-400">&copy; {new Date().getFullYear()} MLBB Analytics & Rank Helper. All rights reserved.</p>
      <p className="text-sm text-gray-400">
        This site is not affiliated with or endorsed by Moonton.
      </p>
      <div className="my-4">
        <Link href="https://discord.gg/xDcdyPdGEw" className="text-violet-400 hover:text-violet-300 hover:underline">
          Join our Discord
        </Link>
      </div>
    </footer>
  )
}