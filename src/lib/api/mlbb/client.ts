// API client
import {
  CounterDataAPIResponse,
  GraphDataAPIResponse,
  HeroDataAPIResponse,
  MetaDataAPIResponse,
} from '@/lib/types';
import { API_CONFIG, RequestBody } from '@/config/api';
import { RequestBodyFactory } from '@/lib/api/mlbb/builder';

export class MLBBApiClient {
  private static async fetchData<T>(
    url: string,
    body: RequestBody
  ): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  static async fetchAllData(rank: string = 'All', heroId?: string) {
    try {
      const [heroData, counters, compatibles, meta, graph] = await Promise.all([
        this.fetchData<HeroDataAPIResponse>(
          API_CONFIG.endpoints.heroes,
          RequestBodyFactory.createHeroDataRequest(heroId)
        ),
        this.fetchData<CounterDataAPIResponse>(
          API_CONFIG.endpoints.details,
          RequestBodyFactory.createMatchupRequest('counter', rank, heroId)
        ),
        this.fetchData<CounterDataAPIResponse>(
          API_CONFIG.endpoints.details,
          RequestBodyFactory.createMatchupRequest('compatible', rank, heroId)
        ),
        this.fetchData<MetaDataAPIResponse>(
          API_CONFIG.endpoints.meta,
          RequestBodyFactory.createMetaRequest(rank, heroId)
        ),
        this.fetchData<GraphDataAPIResponse>(
          API_CONFIG.endpoints.graph,
          RequestBodyFactory.createGraphRequest(rank, heroId)
        ),
      ]);

      return {
        heroData,
        counters,
        compatibles,
        meta,
        graph,
      };
    } catch (error) {
      console.error('Error fetching MLBB data:', error);
      throw error;
    }
  }

  static async fetchMicroHeroData() {
    try {
      const response: MetaDataAPIResponse = await this.fetchData(
        API_CONFIG.endpoints.meta,
        RequestBodyFactory.createMetaRequest('Overall', undefined, true)
      );
      return {
        data: response,
      };
    } catch (error) {
      console.error('Error fetching micro hero data:', error);
      throw error;
    }
  }
}
