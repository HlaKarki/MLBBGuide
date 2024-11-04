'use client';

import { useQuery } from '@tanstack/react-query';

export default function RankHelper() {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: [''],
    queryFn: async () => {
      // fetch all the game sessions
    },
  });

  return <div>Rank Helper</div>;
}
