'use client';

import { useCallback, useEffect, useState } from 'react';
import { doc, getDoc } from '@firebase/firestore';
import { db } from '@/lib/db/firebase';
import { signIn } from '@/lib/db/sign-in';

export default function RankHelper() {
  const enterRoom = useCallback(async () => {
    try {
      await signIn()
      const roomDocRef = doc(db, 'test', 'xej6GQcXXv2q4KfMXbWj');
      const docSnap = await getDoc(roomDocRef);

      if (docSnap.exists()) {
        console.log("fetched: ", docSnap.data());
      }
    } catch (error) {
      console.error(error);
    }
  }, []);



  useEffect(() => {
    const testFetch = async () => {
      const response =  await fetch('/api/firebase/test/')
      return await response.json()
    }

    testFetch().then((res) => console.log("apiFetched: ", res)).catch(console.error);
    enterRoom().catch(console.error);
  }, []);

  return (
    <div className="text-white">
      <h1>Rank helper</h1>
    </div>
  );
}

// const query = async () => {
//   const response = await fetch('/api/firebase/test')
//   const data = await response.json();
//   console.log("data: ", data);
// }
//
// useEffect(() => {
//   query().catch(console.error);
// }, []);

/*
* context: {
*   allies: {
*     roam: ""
*     fighter: "",
*     mage: "",
*     marksman: "",
*     jungle: ""
*   }
* }
* suggestedHeroes(context)
*
*
*
 */
