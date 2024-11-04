'use client';

import { useQuery } from '@tanstack/react-query';
import { useUser } from '@clerk/nextjs';
import { checkUser } from '@/app/(pages)/rank-helper/helpers';

export default function RankHelper() {
  const {user, isSignedIn} = useUser();

  const { data: userData, isLoading, error, isError } = useQuery({
    queryKey: ['username', user?.username],
    queryFn: async () => {
      return await checkUser(user).catch(console.error);
    },
    enabled: !!isSignedIn,
  });

  return (
    <div>
      <h1>Rank Helper</h1>
      { isSignedIn ? (
        <div>
          {userData && userData.user?.username}
        </div>
      ) : (
        <div>
          Not Signed In
        </div>
      )
      }
    </div>
  )
}
