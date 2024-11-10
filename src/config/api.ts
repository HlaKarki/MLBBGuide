export const API_CONFIG = {
  baseUrl: process.env.MLBB_API_BASE_URL || '',
  endpoints: {
    heroes: `${process.env.MLBB_API_BASE_URL}${process.env.MLBB_FIRST_ID}${process.env.MLBB_SECOND_ID_HEROES}`,
    details: `${process.env.MLBB_API_BASE_URL}${process.env.MLBB_FIRST_ID}${process.env.MLBB_SECOND_ID_DETAILS}`,
    meta: `${process.env.MLBB_API_BASE_URL}${process.env.MLBB_FIRST_ID}${process.env.MLBB_SECOND_ID_META_HEROES}`,
    graph: `${process.env.MLBB_API_BASE_URL}${process.env.MLBB_FIRST_ID}${process.env.MLBB_SECOND_ID_GRAPH_30}`,
  },
} as const;

// Types for request bodies
export interface RequestBody {
  pageSize: number;
  pageIndex: number;
  filters?: Array<{
    field: string;
    operator: string;
    value: string | number;
  }>;
  sorts: Array<{
    data: {
      field: string;
      order: string;
    };
    type: string;
  }>;
  fields: string[];
  object?: any[];
}