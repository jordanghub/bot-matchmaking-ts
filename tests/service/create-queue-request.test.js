import 'regenerator-runtime';

jest.mock('@app/service/discord/guild');
jest.mock('@app/models/PlayerInQueue');
jest.mock('@app/utils/questions');
jest.mock('@app/service/cleaner/player');
jest.mock('discord.js');
jest.mock('@app/service/client');

import {
  cleanLobbyIfExists,
  cleanPlayerInQueueIfExists,
} from '@app/service/cleaner/player';

import {
  ON_PLAYER_JOIN_QUEUE,
  USER_NOT_FOUND_IN_THE_SERVER,
  GUILD_UNAVAILABLE_MESSAGE,
  QUEUE_JOINED_SUCCESSFULLY_MESSAGE,
  USER_NOT_FOUND,
} from '@app/consts';
import { awaitMessage } from '@app/utils/questions';

import PlayerInQueue from '@app/models/PlayerInQueue';
import client from '@app/service/client';

import createQueueRequest from '@app/service/create-queue-request';
import { GuildMember } from 'discord.js';
import { getGuild } from '@app/service/discord/guild';

cleanLobbyIfExists.mockImplementation(() => Promise.resolve());
cleanPlayerInQueueIfExists.mockImplementation(() => Promise.resolve());

beforeEach(() => {
  PlayerInQueue.create.mockClear();
  client.emit.mockClear();

  PlayerInQueue.create.mockImplementation(() => Promise.resolve());
  client.emit.mockImplementation((params) => {});
});
describe('createQueueRequest', () => {
  test('Everything filled correctly', async (done) => {
    const guild = {
      id: '435345433',
      members: [],
    };

    const msg = {
      author: {
        discriminator: '3030',
      },
      reply: jest.fn((message) => Promise.resolve()),
    };

    const guildMember = new GuildMember();
    guildMember.user = {
      discriminator: '3030',
    };

    awaitMessage.mockImplementationOnce(() => 'JE');
    awaitMessage.mockImplementationOnce(() => 'Suis');
    awaitMessage.mockImplementationOnce(() => 'Un');

    guild.members.push(guildMember);
    getGuild.mockImplementation(() => guild);

    await createQueueRequest(msg);

    expect(PlayerInQueue.create).toBeCalledTimes(1);
    expect(client.emit).toBeCalledWith(ON_PLAYER_JOIN_QUEUE, msg);
    expect(msg.reply).toBeCalledWith(QUEUE_JOINED_SUCCESSFULLY_MESSAGE);
    done();
  });

  test('No guild', async (done) => {
    const msg = {
      author: {
        discriminator: '3030',
      },
      reply: jest.fn((message) => Promise.resolve()),
    };

    getGuild.mockImplementation(() => false);

    await createQueueRequest(msg);

    expect(PlayerInQueue.create).not.toBeCalled();
    expect(client.emit).not.toBeCalled();

    expect(msg.reply).toBeCalledWith(GUILD_UNAVAILABLE_MESSAGE);
    done();
  });
  test('No member found', async (done) => {
    const guild = {
      id: '435345433',
      members: [],
    };

    const msg = {
      author: {
        discriminator: '3030',
      },
      reply: jest.fn((message) => Promise.resolve()),
    };

    const guildMember = new GuildMember();
    guildMember.user = {
      discriminator: '3030',
    };

    getGuild.mockImplementation(() => guild);

    await createQueueRequest(msg);

    expect(PlayerInQueue.create).not.toBeCalled();
    expect(msg.reply).toBeCalledWith(USER_NOT_FOUND_IN_THE_SERVER);
    expect(client.emit).not.toBeCalled();

    done();
  });
  test('msg reply failed', async (done) => {
    const guild = {
      id: '435345433',
      members: [],
    };

    const msg = {
      author: {
        discriminator: '3030',
      },
      reply: jest.fn((message) => {
        throw new Error('fake error');
      }),
    };

    const guildMember = new GuildMember();
    guildMember.user = {
      discriminator: '3030',
    };

    awaitMessage.mockImplementationOnce(() => 'JE');
    awaitMessage.mockImplementationOnce(() => 'Suis');
    awaitMessage.mockImplementationOnce(() => 'Un');

    guild.members.push(guildMember);
    getGuild.mockImplementation(() => guild);

    await createQueueRequest(msg);

    expect(PlayerInQueue.create).toBeCalledTimes(1);
    expect(msg.reply).toBeCalledWith(QUEUE_JOINED_SUCCESSFULLY_MESSAGE);
    expect(client.emit).toBeCalledWith(ON_PLAYER_JOIN_QUEUE, msg);
    done();
  });
});
