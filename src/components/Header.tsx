import Link from "next/link";
import React from "react";
import {Logo} from "@/components/Logo";

export default function Header() {
  return (
      <header className="text-white p-4">
        <div className="flex justify-start items-center gap-8">
          <div className="flex items-center space-x-4">
            <Logo className={"h-auto w-20"} />
            <h1 className="absolute invisible">Mobile Legends: Bang Bang Rank Helper Tool</h1>
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li><Link href="/search" className={""}>Search</Link></li>
              <li><Link href="/rank-helper" className={""}>Rank Helper</Link></li>
            </ul>
          </nav>
        </div>
      </header>
  )
}