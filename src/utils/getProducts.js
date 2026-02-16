import { Query } from "appwrite"
import { tablesDb } from "../appwrite.js"

export default async function getProducts(limit, offset = 0) {
    const res = tablesDb.listRows({
        databaseId: import.meta.env.VITE_DATABASE_ID,
        tableId: import.meta.env.VITE_TABLE_ID_PRODUCTS,
        queries: [
            Query.limit(limit),
            Query.offset(offset)
        ]
    }).then(ret => ret);

    return res;
}