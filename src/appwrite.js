import { Client, TablesDB, Account, Storage } from "appwrite";

const client = new Client();
client.setEndpoint(import.meta.env.VITE_CLIENT_END_POINT).setProject(import.meta.env.VITE_PROJECT_ID);

export const tablesDb = new TablesDB(client);
export const storage = new Storage(client);
export const account = new Account(client);

