import { Client, TablesDB, Account, Storage } from "appwrite";

const client = new Client();
client.setEndpoint('https://fra.cloud.appwrite.io/v1').setProject('6908d93800363fa1ce56');

export const tablesDb = new TablesDB(client);
export const storage = new Storage(client);
export const account = new Account(client);