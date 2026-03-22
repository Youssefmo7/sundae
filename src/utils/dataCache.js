import { Query } from "appwrite";
import { tablesDb } from "../appwrite.js";

const STORAGE_PREFIX = "sundae_";

export const STORAGE_KEYS = {
  products: `${STORAGE_PREFIX}products`,
  categories: `${STORAGE_PREFIX}categories`
};

function safeParseList(value) {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function readCachedList(key) {
  return safeParseList(localStorage.getItem(key));
}

export function writeCachedList(key, list) {
  localStorage.setItem(key, JSON.stringify(list));
  return list;
}

export async function fetchAllRows(tableId, selectFields = []) {
  const limit = 100;
  let offset = 0;
  const rows = [];

  while (true) {
    const queries = [Query.limit(limit), Query.offset(offset)];
    if (selectFields.length) {
      queries.push(Query.select(selectFields));
    }

    const res = await tablesDb.listRows({
      databaseId: import.meta.env.VITE_DATABASE_ID,
      tableId,
      queries
    });

    if (res?.rows?.length) {
      rows.push(...res.rows);
    }

    if (!res?.rows || res.rows.length < limit) {
      break;
    }

    offset += limit;
  }

  return rows;
}

export async function getCachedProducts() {
  const cached = readCachedList(STORAGE_KEYS.products);
  if (cached && cached.length) return cached;

  const rows = await fetchAllRows(import.meta.env.VITE_TABLE_ID_PRODUCTS, ["$id", "name", "image", "slogan", "category"]);
  const slim = rows.map((row) => ({
    $id: row.$id,
    name: row.name,
    image: row.image,
    slogan: row.slogan,
    category: row.category
  }));

  return writeCachedList(STORAGE_KEYS.products, slim);
}

export async function getCachedCategories() {
  const cached = readCachedList(STORAGE_KEYS.categories);
  if (cached && cached.length) return cached;

  const rows = await fetchAllRows(import.meta.env.VITE_TABLE_ID_CATEGORIES);
  return writeCachedList(STORAGE_KEYS.categories, rows);
}

export async function ensureInitialData() {
  await Promise.all([getCachedProducts(), getCachedCategories()]);
}
