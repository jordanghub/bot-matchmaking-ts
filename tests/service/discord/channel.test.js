import 'regenerator-runtime';

jest.mock('@app/service/discord/guild');

import { getGuild } from '@app/service/discord/guild';

import { deleteChannel } from '@app/service/discord/channel';

describe('deleteChannel', () => {
  test('Should call channel.delete()', async (done) => {
    const channelId = '2234234234';

    const channel = {
      id: channelId,
      delete: jest.fn(() => Promise.resolve()),
    };

    const guild = {
      channels: [],
    };

    guild.channels.push(channel);

    getGuild.mockImplementation(() => guild);

    await deleteChannel(channelId);

    expect(channel.delete).toBeCalled();

    done();
  });
  test("Shouldn't call channel.delete()", async (done) => {
    const channelId = '234234234';

    const channel = {
      id: '234284234',
      delete: jest.fn(() => Promise.resolve()),
    };

    const guild = {
      channels: [],
    };

    guild.channels.push(channel);

    getGuild.mockImplementation(() => guild);

    await deleteChannel(channelId);

    expect(channel.delete).not.toBeCalled();

    done();
  });

  test("Shouldn't return false", async (done) => {
    const expected = false;

    const channelId = '2343252';

    getGuild.mockImplementation(() => false);

    const result = await deleteChannel(channelId);

    expect(result).toBe(expected);

    done();
  });
});
