"use client";

import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function AdminPage() {
  const [signedIn, setSignedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const updateDatabase = async () => {
    try {
      const response = await fetch('/api/firebase/update_db')
      const data = await response.json()
      if (data.success) {
        alert("Updated database")
      }
    } catch(error) {
      console.error(error)
      alert("Failed to update database")
    }
  }
  const checkUserCredentials = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const response = await fetch(`/api/firebase/admin_login?email=${username}&password=${password}`)
    const data = await response.json()

    if (data.success) {
      console.log("signed in!");
      setSignedIn(true)
    } else {
      alert("Wrong credentials!")
    }
  }

  if (!signedIn) {
    return (
      <div>
        <Popover>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent>
            <form onSubmit={checkUserCredentials}>
              <div className={"flex gap-4"}>
                <label>Username</label>
                <input
                  type={"text"} value={username} placeholder={"Username"}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className={"flex gap-4"}>
                <label>Password</label>
                <input type={"password"} value={password} placeholder={"Password"}
                onChange={(e) => setPassword(e.target.value)}/>
              </div>
              <Button type={"submit"}>
                Sign In
              </Button>
            </form>
          </PopoverContent>
        </Popover>

      </div>
    )
  }

  return (
    <div>
      <Card className={"p-4"}>
        <CardTitle>
          Update Database
        </CardTitle>
        <CardContent className={"mt-5"}>
          <Button onClick={updateDatabase}>
            Update Database
          </Button>
        </CardContent>
        <CardFooter>

        </CardFooter>
      </Card>

    </div>
  )
}