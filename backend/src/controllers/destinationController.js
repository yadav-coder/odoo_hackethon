const crypto = require("crypto");

const CACHE_TTL_MS = 60 * 60 * 1000;
const cache = new Map();

const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

const hashToInt = (input) => {
  const h = crypto.createHash("sha256").update(String(input)).digest("hex").slice(0, 8);
  return parseInt(h, 16);
};

const getCached = (key) => {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.at > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.value;
};

const setCached = (key, value) => {
  cache.set(key, { at: Date.now(), value });
};

const wikiSearch = async (query, limit) => {
  const url = new URL("https://en.wikipedia.org/w/api.php");
  url.searchParams.set("action", "query");
  url.searchParams.set("list", "search");
  url.searchParams.set("format", "json");
  url.searchParams.set("origin", "*");
  url.searchParams.set("srlimit", String(limit));
  url.searchParams.set("srsearch", query);

  const resp = await fetch(url.toString(), {
    headers: { "user-agent": "traveloop-dashboard/1.0" }
  });
  if (!resp.ok) throw new Error(`Wikipedia search failed: ${resp.status}`);
  const data = await resp.json();
  return (data?.query?.search || []).map((s) => s.title).filter(Boolean);
};

const wikiSummary = async (title) => {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const resp = await fetch(url, { headers: { "user-agent": "traveloop-dashboard/1.0" } });
  if (!resp.ok) return null;
  return resp.json();
};

const buildDestination = ({ title, country, summary }) => {
  const seed = hashToInt(`${country}:${title}`);
  const rating = Math.round((3.6 + (seed % 130) / 100) * 10) / 10; // 3.6 - 4.9
  const budget = 250 + (seed % 2750); // USD-ish estimate 250 - 3000
  const description = (summary?.extract || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 140);

  const imageUrl =
    summary?.thumbnail?.source ||
    `https://source.unsplash.com/featured/?${encodeURIComponent(`${title},${country}`)}`;

  return {
    id: `${country}_${title}`.toLowerCase().replace(/[^a-z0-9_]+/g, "_"),
    name: title,
    country,
    rating,
    description: description || `A popular destination in ${country}.`,
    estimatedBudget: budget,
    imageUrl
  };
};

const applyFilterSort = ({ items, minRating, maxBudget, sortBy, sortDir }) => {
  let out = items;

  if (Number.isFinite(minRating)) {
    out = out.filter((d) => d.rating >= minRating);
  }
  if (Number.isFinite(maxBudget)) {
    out = out.filter((d) => d.estimatedBudget <= maxBudget);
  }

  const dir = sortDir === "desc" ? -1 : 1;
  out = [...out].sort((a, b) => {
    if (sortBy === "rating") return (a.rating - b.rating) * dir;
    if (sortBy === "budget") return (a.estimatedBudget - b.estimatedBudget) * dir;
    return a.name.localeCompare(b.name) * dir;
  });

  return out;
};

const groupItems = (items, groupBy) => {
  if (!groupBy || groupBy === "none") return { groups: null, items };
  if (groupBy !== "country") return { groups: null, items };

  const map = new Map();
  for (const item of items) {
    const key = item.country || "Unknown";
    map.set(key, [...(map.get(key) || []), item]);
  }

  return {
    groups: Array.from(map.entries()).map(([key, values]) => ({ key, items: values })),
    items: null
  };
};

const getDestinations = async (req, res) => {
  const country = String(req.query.country || "").trim();
  if (!country) {
    return res.status(400).json({ success: false, message: "country is required" });
  }

  const page = clamp(Number(req.query.page) || 1, 1, 9999);
  const limit = clamp(Number(req.query.limit) || 8, 1, 24);
  const minRating = req.query.minRating !== undefined ? Number(req.query.minRating) : undefined;
  const maxBudget = req.query.maxBudget !== undefined ? Number(req.query.maxBudget) : undefined;
  const sortBy = ["name", "rating", "budget"].includes(String(req.query.sortBy))
    ? String(req.query.sortBy)
    : "rating";
  const sortDir = String(req.query.sortDir) === "asc" ? "asc" : "desc";
  const groupBy = ["none", "country"].includes(String(req.query.groupBy))
    ? String(req.query.groupBy)
    : "none";

  const cacheKey = `destinations:${country.toLowerCase()}`;
  let base = getCached(cacheKey);

  try {
    if (!base) {
      const titles = await wikiSearch(`tourist attractions in ${country}`, 18);
      const uniqueTitles = Array.from(new Set(titles)).slice(0, 18);

      const summaries = await Promise.all(uniqueTitles.map((t) => wikiSummary(t)));
      base = uniqueTitles.map((title, idx) =>
        buildDestination({ title, country, summary: summaries[idx] })
      );
      setCached(cacheKey, base);
    }

    const filtered = applyFilterSort({
      items: base,
      minRating: Number.isFinite(minRating) ? minRating : undefined,
      maxBudget: Number.isFinite(maxBudget) ? maxBudget : undefined,
      sortBy,
      sortDir
    });

    const start = (page - 1) * limit;
    const pageItems = filtered.slice(start, start + limit);
    const total = filtered.length;

    const grouped = groupItems(pageItems, groupBy);

    return res.status(200).json({
      success: true,
      meta: {
        country,
        page,
        limit,
        total,
        hasMore: start + limit < total,
        sortBy,
        sortDir,
        minRating: Number.isFinite(minRating) ? minRating : null,
        maxBudget: Number.isFinite(maxBudget) ? maxBudget : null,
        groupBy
      },
      data: grouped.groups ? { groups: grouped.groups } : { items: pageItems }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch destinations"
    });
  }
};

module.exports = {
  getDestinations
};

