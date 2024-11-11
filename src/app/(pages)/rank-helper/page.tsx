'use client';

import { useQuery } from '@tanstack/react-query';
import { useUser } from '@clerk/nextjs';
import { checkUser } from '@/app/(pages)/rank-helper/helpers';
import { Games } from '@/app/(pages)/rank-helper/games'

export default function RankHelper() {
  const {user, isSignedIn} = useUser();

  const { data: userData } = useQuery({
    queryKey: ['username', user?.username],
    queryFn: async () => {
      return await checkUser(user).catch(console.error);
    },
    enabled: !!isSignedIn,
  });

  return (
    <div className={"min-h-[80vh] flex justify-center items-center"}>
      <Games userData={userData?.user}/>
    </div>
  )
}
