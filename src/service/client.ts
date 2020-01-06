import { Client } from 'discord.js';

let client: Client | null = null;

/**
 * @description return the current client or create it if it doesn't exist
 */
export const getClient = () => {
  if (!client) {
    client = new Client();
  }
  return client;
};

export default getClient();
