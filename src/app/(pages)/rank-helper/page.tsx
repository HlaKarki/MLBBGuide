'use client';

import { useQuery } from '@tanstack/react-query';
import { FinalHeroDataType } from '@/lib/types';
import { RankedSidebar } from '@/app/(pages)/rank-helper/Sidebar';
import { getHeroNameURL } from '@/lib/utils';
import { useCallback, useEffect, useState } from 'react';

export default function RankHelper() {
  const [filter, setFilter] = useState<{lane: string} | null>(null);
  const [filteredData, setFilteredData] = useState<FinalHeroDataType[]>([]);

  const { data, isLoading, error, isError } = useQuery<FinalHeroDataType[]>({
    queryKey: [],
    queryFn: async () => {
      const response = await fetch('/api/mlbb/final')
      const heroes = await response.json()
      return heroes.data as FinalHeroDataType[]
    },
  });

  const filterData = useCallback(() => {
      if (!data) return;

      const filtered =  data.filter(hero => {
        return hero.role.includes(filter?.lane || '')
      })
    setFilteredData(filtered);

  }, [filter])

  useEffect(() => {
    filterData()
  }, [filter]);

  return (
    <div className="text-white flex">
      {isLoading && <div>Loading...</div>}
      {isError && <div>{error.message}</div>}
      <RankedSidebar onChange={(obj: {lane: string}) => setFilter(obj)} />
      {
        filteredData && filteredData.length > 0 ? (
          <div className={'flex flex-wrap gap-4'}>
            {filteredData.map((hero, index) => (
              <a
                key={hero.hero_id}
                className={
                  'flex flex-col justify-center items-start truncate w-[80px]'
                }
                href={`/search#${getHeroNameURL(hero.hero_id)}`}
              >
                <img
                  className={'h-20 w-20 rounded-full'}
                  src={hero.images.head}
                />
                <h3 className={'flex mx-auto'}>{hero.name}</h3>
              </a>
            ))}
          </div>
        ) : (
            <div className={'flex flex-wrap gap-4'}>
              {data && data.map((hero, index) => (
                <a
                  key={hero.hero_id}
                  className={
                    'flex flex-col justify-center items-start truncate w-[80px]'
                  }
                  href={`/search#${getHeroNameURL(hero.hero_id)}`}
                >
                  <img
                    className={'h-20 w-20 rounded-full'}
                    src={hero.images.head}
                  />
                  <h3 className={'flex mx-auto'}>{hero.name}</h3>
                </a>
              ))}
            </div>
        )
      }
    </div>
  );
}

/*
 * context: {
 *   allies: {
 *     roam: ""
 *     fighter: "",
 *     mage: "",
 *     marksman: "",
 *     jungle: ""
 *   },
 * enemies: {
 *     roam: ""
 *     fighter: "",
 *     mage: "",
 *     marksman: "",
 *     jungle: ""
 *  }
 * }
 * suggestedHeroes(context)
 *
 *
 *
 */


// const heroesCollectionRef = collection(db, 'heroes');
// const rolesToFind = ['Exp Lane', 'Jungle'];
// const heroesQuery = query(
//   heroesCollectionRef,
//   where('role', 'array-contains-any', rolesToFind)
// );
// const querySnapshot = await getDocs(heroesQuery);
// const heroes = querySnapshot.docs.map(doc => ({
//   ...doc.data(),
// })) as FinalHeroDataType[];