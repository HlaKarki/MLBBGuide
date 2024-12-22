import { FinalHeroDataType, MetaStatsType } from '@/lib/types';
import { MLBBApiClient } from '@/lib/api/mlbb/client';
import { DataProcessor } from '@/lib/api/mlbb/processors';
import { db } from '@/lib/db/firebase-admin';

export async function fetchMLBBData(
  hero_id: string | undefined,
  rank: string | undefined
): Promise<FinalHeroDataType[]> {
  const rawData = await MLBBApiClient.fetchAllData(rank, hero_id);

  const processedData = {
    heroData: DataProcessor.processHeroData(rawData.heroData),
    counters: DataProcessor.processMatchupData(rawData.counters, 'counter'),
    compatibles: DataProcessor.processMatchupData(
      rawData.compatibles,
      'compatible'
    ),
    meta: DataProcessor.processMeta(rawData.meta),
    graph: DataProcessor.processGraph(rawData.graph),
  };

  return DataProcessor.combineData(
    processedData.heroData,
    processedData.counters,
    processedData.compatibles,
    processedData.meta,
    processedData.graph
  );
}

export async function fetchMicroHeroData(
  rank?: string,
  stat_type?: MetaStatsType,
  hero_count?: number
) {
  const rawData = await MLBBApiClient.fetchMicroHeroData(
    rank,
    stat_type,
    hero_count
  );
  return DataProcessor.processSearchMeta(rawData.data);
}

export async function fetchLore(hero_id: number) {
  const docRef = db.collection('lores').doc(hero_id.toString());
  const docSnap = await docRef.get();
  if (docSnap.exists) {
    const data = docSnap.data();
    return { success: true, data: data };
  } else {
    return { success: false, data: null, message: 'Document not found' };
  }
}
