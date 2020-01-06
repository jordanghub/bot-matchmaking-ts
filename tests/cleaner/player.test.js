import 'regenerator-runtime';

import {
  cleanLobbyIfExists,
  cleanPlayerInQueueIfExists,
  cleanAllEmptyLobbies,
} from '@app/service/cleaner/player';

jest.mock('@app/service/discord/guild');
jest.mock('@app/models/Lobby');
jest.mock('@app/service/discord/channel');
jest.mock('@app/models/PlayerInQueue');
jest.mock('discord.js');

import Lobby from '@app/models/Lobby';
import PlayerInQueue from '@app/models/PlayerInQueue';

import { deleteChannel } from '@app/service/discord/channel';
import { VoiceChannel } from 'discord.js';
import { getGuild } from '@app/service/discord/guild';

beforeEach(() => {
  PlayerInQueue.findOne.mockClear();
  Lobby.findAll.mockClear();
  Lobby.findOne.mockClear();
  getGuild.mockClear();
});

describe('cleanLobbyIfExists', () => {
  test('cleanLobbyIfExists - should work', async (done) => {
    const deleteCallback = jest.fn(() => Promise.resolve());

    deleteChannel.mockImplementation(deleteCallback);
    const lobby = {
      channelId: '23423423',
      destroy: jest.fn(() => Promise.resolve()),
    };

    Lobby.findOne.mockImplementation(() => Promise.resolve(lobby));

    await cleanLobbyIfExists();
    expect(lobby.destroy).toBeCalled();
    expect(deleteCallback).toBeCalled();
    done();
  });

  test('cleanLobbyIfExists - shoulnt work', async (done) => {
    const deleteCallback = jest.fn(() => Promise.resolve());

    const lobby = {
      channelId: '23423423',
      destroy: jest.fn(() => Promise.resolve()),
    };
    deleteChannel.mockImplementation(deleteCallback);
    Lobby.findOne.mockImplementation(() => Promise.resolve(false));

    await cleanLobbyIfExists();

    expect(deleteCallback).not.toHaveBeenCalled();
    done();
  });
});

describe('cleanPlayerInQueueIfExists', () => {
  test('should work', async (done) => {
    const playerInQueue = {
      playerId: '453453',
      destroy: jest.fn(() => Promise.resolve()),
    };

    PlayerInQueue.findOne.mockImplementation(() =>
      Promise.resolve(playerInQueue),
    );
    await cleanPlayerInQueueIfExists(playerInQueue.playerId);
    expect(PlayerInQueue.findOne).toBeCalledTimes(1);
    expect(playerInQueue.destroy).toHaveBeenCalled();
    done();
  });
  test('no', async (done) => {
    PlayerInQueue.findOne.mockImplementation(() => Promise.resolve(false));
    await cleanPlayerInQueueIfExists('23423432');
    expect(PlayerInQueue.findOne).toBeCalledTimes(1);
    done();
  });
});

describe('cleanAllEmptyLobbies', () => {
  test('should work', async (done) => {
    const guild = {
      channels: [],
    };

    const lobbies = [
      {
        channelId: '2342342',
        destroy: jest.fn(() => Promise.resolve()),
      },
      {
        channelId: '2342343',
        destroy: jest.fn(() => Promise.resolve()),
      },
    ];

    const chan1 = new VoiceChannel('4323423', {});
    const chan2 = new VoiceChannel('4323423', {});

    chan1.id = '2342342';
    chan2.id = '2342343';

    chan1.delete = jest.fn(() => Promise.resolve());
    chan2.delete = jest.fn(() => Promise.resolve());

    chan1.members = {
      array: jest.fn(() => ['1']),
    };
    chan2.members = {
      array: jest.fn(() => []),
    };

    getGuild.mockImplementation(() => guild);

    Lobby.findAll.mockImplementation(() => Promise.resolve(lobbies));

    guild.channels.push(chan1);
    guild.channels.push(chan2);

    await cleanAllEmptyLobbies();

    expect(getGuild).toBeCalledTimes(1);
    expect(Lobby.findAll).toBeCalledTimes(1);

    expect(chan1.members.array).toBeCalledTimes(1);
    expect(chan2.members.array).toBeCalledTimes(1);

    expect(lobbies[0].destroy).not.toBeCalled();
    expect(lobbies[1].destroy).toBeCalledTimes(1);

    expect(chan1.delete).not.toBeCalled();
    expect(chan2.delete).toBeCalled();

    done();
  });
  test('no guild', async (done) => {
    const guild = {
      channels: [],
    };

    const lobbies = [
      {
        channelId: '2342342',
        destroy: jest.fn(() => Promise.resolve()),
      },
      {
        channelId: '2342343',
        destroy: jest.fn(() => Promise.resolve()),
      },
    ];

    const chan1 = new VoiceChannel('4323423', {});
    const chan2 = new VoiceChannel('4323423', {});

    chan1.id = '2342342';
    chan2.id = '2342343';

    chan1.delete = jest.fn(() => Promise.resolve());
    chan2.delete = jest.fn(() => Promise.resolve());

    chan1.members = {
      array: jest.fn(() => ['1']),
    };
    chan2.members = {
      array: jest.fn(() => []),
    };

    getGuild.mockImplementation(() => false);

    Lobby.findAll.mockImplementation(() => Promise.resolve(lobbies));

    guild.channels.push(chan1);
    guild.channels.push(chan2);

    // Mock de lobby

    // Mock de find

    await cleanAllEmptyLobbies();

    expect(getGuild).toBeCalledTimes(1);
    expect(Lobby.findAll).not.toBeCalled();

    expect(chan1.members.array).not.toBeCalled();
    expect(chan2.members.array).not.toBeCalled();

    expect(lobbies[0].destroy).not.toBeCalled();
    expect(lobbies[1].destroy).not.toBeCalled();

    expect(chan1.delete).not.toBeCalled();
    expect(chan2.delete).not.toBeCalled();

    done();
  });
  test('channel is missing', async (done) => {
    const guild = {
      channels: [],
    };

    const lobbies = [
      {
        channelId: '2342342',
        destroy: jest.fn(() => Promise.resolve()),
      },
      {
        channelId: '2342343',
        destroy: jest.fn(() => Promise.resolve()),
      },
    ];

    const chan1 = new VoiceChannel('4323423', {});

    chan1.id = '2342342';

    chan1.delete = jest.fn(() => Promise.resolve());

    chan1.members = {
      array: jest.fn(() => ['1']),
    };

    getGuild.mockImplementation(() => guild);

    Lobby.findAll.mockImplementation(() => Promise.resolve(lobbies));

    guild.channels.push(chan1);

    // Mock de lobby

    // Mock de find

    await cleanAllEmptyLobbies();

    expect(getGuild).toBeCalledTimes(1);
    expect(Lobby.findAll).toBeCalled();

    expect(chan1.members.array).toBeCalled();

    expect(lobbies[0].destroy).not.toBeCalled();
    expect(lobbies[1].destroy).toBeCalled();

    expect(chan1.delete).not.toBeCalled();

    done();
  });
});
