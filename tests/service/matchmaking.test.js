import 'regenerator-runtime';

jest.mock('discord.js');

jest.mock('@app/models/Lobby');
jest.mock('@app/models/PlayerInQueue');
jest.mock('@app/service/discord/guild');

import matchmaking from '@app/service/matchmaking';

import Lobby from '@app/models/Lobby';

import PlayerInQueue from '@app/models/PlayerInQueue';

import { getGuild } from '@app/service/discord/guild';

import matchmakingFilters from '@app/config/matchmaking-filters';

import { VoiceChannel, GuildMember } from 'discord.js';

const generateConfigTest = (userAnswers) => {
  const answers = [];

  matchmakingFilters.forEach((param, index) => {
    const answer = {
      name: param.name,
      value: userAnswers[index],
    };
    answers.push(answer);
  });
  return answers;
};

beforeEach(() => {
  Lobby.findAll.mockClear();
  PlayerInQueue.findAll.mockClear();
  getGuild.mockClear();
});

describe('', () => {
  test('working test', async (done) => {
    /**
     * Datas
     */

    const configLobby1 = generateConfigTest(['fortnite', 18, 4555]);

    const configLobby2 = generateConfigTest(['call of duty', 16, 2760]);

    const configPlayer1 = generateConfigTest(['fortnite', 27, 5000]);

    const configPlayer2 = generateConfigTest(['call of duty', 19, 2850]);

    const guild = {
      members: [],
      channels: [],
    };

    const lobbies = [];
    const playersInQueue = [];

    const channel1 = new VoiceChannel('2323432', {});
    const channel2 = new VoiceChannel('2323432', {});

    channel1.id = '2551';
    channel2.id = '2552';

    channel1.members = {
      array: jest.fn(() => []),
    };
    channel2.members = {
      array: jest.fn(() => []),
    };

    guild.channels.push(channel1, channel2);

    const lobby1 = {
      channelId: '2551',
      parameters: JSON.stringify(configLobby1),
      isActive: true,
      numberOfPlayers: 4,
    };
    const lobby2 = {
      channelId: '2552',
      parameters: JSON.stringify(configLobby2),
      isActive: true,
      numberOfPlayers: 4,
    };

    lobbies.push(lobby1, lobby2);

    const player1 = {
      playerId: '3030',
      parameters: JSON.stringify(configPlayer1),
      destroy: jest.fn(() => Promise.resolve()),
    };
    const player2 = {
      playerId: '4040',
      parameters: JSON.stringify(configPlayer2),
      destroy: jest.fn(() => Promise.resolve()),
    };

    playersInQueue.push(player1, player2);

    const guildMember1 = new GuildMember('43242', {});
    guildMember1.user = { discriminator: '3030' };

    const guildMember2 = new GuildMember('43242', {});
    guildMember2.user = { discriminator: '4040' };

    guildMember1.setVoiceChannel = jest.fn((chan) => Promise.resolve());
    guildMember2.setVoiceChannel = jest.fn((chan) => Promise.resolve());

    guildMember1.lobbyParams = configPlayer1;
    guildMember2.lobbyParams = configPlayer2;

    guild.members.push(guildMember1, guildMember2);

    /**
     * Mocks
     */

    Lobby.findAll.mockImplementation(() => Promise.resolve(lobbies));
    PlayerInQueue.findAll.mockImplementation(() =>
      Promise.resolve(playersInQueue),
    );
    getGuild.mockImplementation(() => guild);

    await matchmaking();

    expect(guildMember1.setVoiceChannel).toBeCalledWith(lobby1.channelId);
    expect(guildMember2.setVoiceChannel).toBeCalledWith(lobby2.channelId);

    done();
  });
});
