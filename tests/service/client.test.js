import { Client } from 'discord.js';

import { getClient } from '@app/service/client';

describe('client', () => {
  test('clients should be the same', () => {
    const expected = getClient();

    const client1 = getClient();
    const client2 = getClient();

    expect(client1).toStrictEqual(expected);
    expect(client2).toStrictEqual(expected);
  });
});
