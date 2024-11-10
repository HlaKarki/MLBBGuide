// Request body factory
import { RequestBody } from '@/config/api';
import { getRankId } from '@/lib/utils';

export class RequestBodyFactory {
  static createHeroDataRequest(heroId?: string): RequestBody {
    const request: RequestBody = {
      pageSize: 200,
      pageIndex: 1,
      sorts: [
        {
          data: { field: 'hero_id', order: 'desc' },
          type: 'sequence',
        },
      ],
      fields: [
        'data.hero.data.name',
        'data.head',
        'data.head_big',
        'data.hero.data.story',
        'data.hero.data.squarehead',
        'data.hero.data.squareheadbig',
        'data.hero.data.roadsortlabel',
        'data.hero.data.speciality',
        'data.hero.data.abilityshow',
      ],
      object: [],
    };

    if (heroId) {
      request.filters = [
        { field: 'hero_id', operator: 'eq', value: heroId },
      ];
    }

    return request;
  }

  static createMatchupRequest(type: 'counter' | 'compatible', rank: string, heroId?: string): RequestBody {
    const matchType = type === 'counter' ? 0 : 1;
    const filters = [
      { field: 'match_type', operator: 'eq', value: matchType },
      { field: 'bigrank', operator: 'eq', value: getRankId(rank || 'All') },
    ];

    if (heroId) {
      filters.push({ field: 'main_heroid', operator: 'eq', value: Number(heroId) });
    }

    return {
      pageSize: 200,
      pageIndex: 1,
      filters,
      sorts: [
        {
          data: { field: 'main_heroid', order: 'desc' },
          type: 'sequence',
        },
      ],
      fields: [
        'data.main_hero_appearance_rate',
        'data.main_hero_ban_rate',
        'data.main_hero_win_rate',
        'data.main_heroid',
        'data.sub_hero.hero',
        'data.sub_hero.heroid',
        'data.sub_hero.hero_win_rate',
        'data.sub_hero.hero_appearance_rate',
        'data.sub_hero.increase_win_rate',
        'data.sub_hero_last.hero',
        'data.sub_hero_last.heroid',
        'data.sub_hero_last.hero_appearance_rate',
        'data.sub_hero_last.hero_win_rate',
        'data.sub_hero_last.increase_win_rate',
      ],
    };
  }

  static createMetaRequest(rank: string, heroId?: string): RequestBody {
    const filters = [
      { field: 'match_type', operator: 'eq', value: '0' },
      { field: 'bigrank', operator: 'eq', value: getRankId(rank || 'All') },
    ];

    if (heroId) {
      filters.push({ field: 'main_heroid', operator: 'eq', value: heroId });
    }

    return {
      pageSize: 200,
      pageIndex: 1,
      filters,
      sorts: [
        { data: { field: 'main_heroid', order: 'desc' }, type: 'sequence' },
      ],
      fields: [
        'main_hero_ban_rate',
        'main_hero_win_rate',
        'main_hero_appearance_rate',
        'main_heroid',
      ],
    };
  }

  static createGraphRequest(rank: string, heroId?: string): RequestBody {
    const filters = [
      { field: 'match_type', operator: 'eq', value: '1' },
      { field: 'bigrank', operator: 'eq', value: getRankId(rank || 'All') },
    ];

    if (heroId) {
      filters.push({ field: 'main_heroid', operator: 'eq', value: heroId });
    }

    return {
      pageSize: 200,
      pageIndex: 1,
      filters,
      sorts: [
        { data: { field: 'main_heroid', order: 'desc' }, type: 'sequence' },
      ],
      fields: [
        '_createdAt',
        '_updatedAt',
        'data.bigrank',
        'data.main_heroid',
        'data.win_rate',
      ],
    };
  }
}