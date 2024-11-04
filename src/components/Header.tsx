'use client'

import Link from 'next/link';
import React from 'react';
import { Logo } from '@/components/Logo';
import { SignedIn, SignedOut, SignInButton, useClerk, useUser } from '@clerk/nextjs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const pathname = usePathname();

  return (
    <header className="text-white p-4">
      <div className="flex justify-start items-center gap-8">
        <div className="flex items-center space-x-4">
          <Logo className={'h-auto w-20'} />
          <h1 className="absolute invisible">
            Mobile Legends: Bang Bang Rank Helper Tool
          </h1>
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/stats" className={''}>
                Statistics
              </Link>
            </li>
            <li>
              <Link href="/search" className={''}>
                Search
              </Link>
            </li>
            <li>
              <Link href="/rank-helper" className={''}>
                Rank Helper
              </Link>
            </li>
          </ul>
        </nav>
        <span className={'flex-grow flex justify-end'}>
          <SignedOut>
            <SignInButton mode={"modal"} forceRedirectUrl={pathname} />
          </SignedOut>
          <SignedIn>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="p-0 rounded-full">
                  <img src={user?.imageUrl} alt="Avatar" className="w-8 h-8 rounded-full" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className={"max-w-[200px] flex flex-col gap-2"}>
                <Button>Logged Matches</Button>
                <Button onClick={() => signOut({redirectUrl: pathname})}>Log Out</Button>
              </PopoverContent>
            </Popover>
          </SignedIn>
        </span>
      </div>
    </header>
  );
}
