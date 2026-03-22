import { getCachedProducts } from "./dataCache.js";

export default async function getProducts(limit, offset = 0) {
    const all = await getCachedProducts();
    const start = Math.max(0, offset);
    const end = Math.max(start, start + (limit || 0));
    const rows = limit ? all.slice(start, end) : all.slice(start);

    return {
        rows,
        total: all.length
    };
}
