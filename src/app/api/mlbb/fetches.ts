const baseUrl = process.env.MLBB_API_BASE_URL || "";
const firstId = process.env.MLBB_FIRST_ID || "/2669606";
const meta_heroes = process.env.MLBB_SECOND_ID_META_HEROES || "/2756567";

export async function fetchStats(sortField: string, count: number) {
  const url = baseUrl + firstId + meta_heroes;
  const payload = {
    pageSize: count,
    filters: [
      { field: "bigrank", operator: "eq", value: "101" },
      { field: "match_type", operator: "eq", value: "0" }
    ],
    sorts: [
      { data: { field: sortField, order: "desc" }, type: "sequence" },
      { data: { field: "main_heroid", order: "desc" }, type: "sequence" }
    ],
    pageIndex: 1,
    fields: [
      "main_hero",
      "main_hero_ban_rate",
      "main_hero_win_rate",
      "main_heroid",
      "main_hero_appearance_rate"
    ]
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}