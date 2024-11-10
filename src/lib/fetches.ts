import {
  FinalHeroDataType,
} from '@/lib/types';
import { MLBBApiClient } from '@/lib/api/mlbb/client';
import { DataProcessor } from '@/lib/api/mlbb/processors';

export async function fetchMLBBData(hero_id: string | undefined, rank: string | undefined): Promise<FinalHeroDataType[]> {
  const rawData = await MLBBApiClient.fetchAllData(rank, hero_id);

  const processedData = {
    heroData: DataProcessor.processHeroData(rawData.heroData),
    counters: DataProcessor.processMatchupData(rawData.counters, 'counter'),
    compatibles: DataProcessor.processMatchupData(rawData.compatibles, 'compatible'),
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