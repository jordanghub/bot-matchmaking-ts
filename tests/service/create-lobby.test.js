import 'regenerator-runtime';

jest.mock('discord.js');
jest.mock('@app/service/cleaner/player');
jest.mock('@app/service/discord/guild');
jest.mock('@app/utils/questions');
jest.mock('@app/models/Lobby');
jest.mock('@app/service/client');

import { GuildMember } from 'discord.js';
import { awaitMessage } from '@app/utils/questions';

import {
  NOT_ON_SERVER_MESSAGE,
  NOT_ON_VOCAL_CHANNEL_MESSAGE,
  GUILD_UNAVAILABLE_MESSAGE,
} from '@app/consts';

import client from '@app/service/client';

import Lobby from '@app/models/Lobby';

import {
  cleanLobbyIfExists,
  cleanPlayerInQueueIfExists,
} from '@app/service/cleaner/player';

import { getGuild } from '@app/service/discord/guild';

import createLobby from '@app/service/create-lobby';

cleanLobbyIfExists.mockImplementation(() => Promise.resolve());
cleanPlayerInQueueIfExists.mockImplementation(() => Promise.resolve());

client.emit.mockImplementation(() => Promise.resolve());
Lobby.create.mockImplementation((params) => Promise.resolve({ ...params }));

const voiceChannel = {
  id: '234234234243',
};

test('create-lobby - should work', async (done) => {
  const basicGuild = {
    id: '4353453534',
    members: [],
    createChannel: () => Promise.resolve({ ...voiceChannel }),
  };

  awaitMessage
    .mockImplementationOnce(() => Promise.resolve('4'))
    .mockImplementationOnce(() => Promise.resolve('fortnite'))
    .mockImplementationOnce(() => Promise.resolve('18'))
    .mockImplementationOnce(() => Promise.resolve('3250'));

  const discriminator = '3030';

  const answers = [
    { name: 'Jeu', value: 'fortnite' },
    { name: 'Age', value: '18' },
    { name: 'Elo', value: '3250' },
  ];

  const expected = {
    ownerDiscriminator: discriminator,
    parameters: JSON.stringify(answers),
    channelId: '234234234243',
    numberOfPlayers: '4',
  };

  const guildMemberData = {
    user: {
      discriminator,
    },
  };

  const msg = {
    author: {
      discriminator,
    },
    reply: (msg) => Promise.resolve(),
  };

  const newGuild = { ...basicGuild };

  const guildMember = new GuildMember('45675641', guildMemberData);

  newGuild.members.push(guildMember);

  getGuild.mockImplementationOnce(() => newGuild);

  guildMember.setVoiceChannel.mockImplementation(() => {
    return Promise.resolve();
  });

  guildMember.user = guildMemberData.user;

  const result = await createLobby(msg);

  expect(result).toStrictEqual(expected);
  done();
});

test('create-lobby - should return false', async (done) => {
  const basicGuild = {
    id: '4353453534',
    members: [],
    createChannel: () => Promise.resolve({ ...voiceChannel }),
  };

  awaitMessage
    .mockImplementationOnce(() => Promise.resolve('4'))
    .mockImplementationOnce(() => Promise.resolve('fortnite'))
    .mockImplementationOnce(() => Promise.resolve('18'))
    .mockImplementationOnce(() => Promise.resolve('3250'));

  const discriminator = '3030';

  const expected = false;

  let replyMessage = '';

  const msg = {
    author: {
      discriminator,
    },
    reply: (msg) => {
      replyMessage = msg;
      return Promise.resolve();
    },
  };

  getGuild.mockImplementationOnce(() => ({ ...basicGuild }));

  const result = await createLobby(msg);

  expect(result).toBe(expected);
  expect(replyMessage).toBe(NOT_ON_SERVER_MESSAGE);
  done();
});

test('create-lobby - with reply not on voice', async (done) => {
  const basicGuild = {
    id: '4353453534',
    members: [],
    createChannel: () => Promise.resolve({ ...voiceChannel }),
  };

  awaitMessage
    .mockImplementationOnce(() => Promise.resolve('4'))
    .mockImplementationOnce(() => Promise.resolve('fortnite'))
    .mockImplementationOnce(() => Promise.resolve('18'))
    .mockImplementationOnce(() => Promise.resolve('3250'));

  const discriminator = '3030';

  const answers = [
    { name: 'Jeu', value: 'fortnite' },
    { name: 'Age', value: '18' },
    { name: 'Elo', value: '3250' },
  ];

  const expected = {
    ownerDiscriminator: discriminator,
    parameters: JSON.stringify(answers),
    channelId: '234234234243',
    numberOfPlayers: '4',
  };

  const guildMemberData = {
    user: {
      discriminator,
    },
  };
  let replyMessage = '';

  const msg = {
    author: {
      discriminator,
    },
    reply: (msg) => {
      replyMessage = msg;
      return Promise.resolve();
    },
  };

  const newGuild = { ...basicGuild };

  const guildMember = new GuildMember('45675641', guildMemberData);

  newGuild.members.push(guildMember);

  getGuild.mockImplementationOnce(() => newGuild);

  guildMember.setVoiceChannel.mockImplementation(() => {
    throw new Error('Dummy error');
  });

  guildMember.user = guildMemberData.user;

  const result = await createLobby(msg);

  expect(result).toStrictEqual(expected);
  expect(replyMessage).toBe(NOT_ON_VOCAL_CHANNEL_MESSAGE);
  done();
});
test('create-lobby -  no guild', async (done) => {
  awaitMessage
    .mockImplementationOnce(() => Promise.resolve('4'))
    .mockImplementationOnce(() => Promise.resolve('fortnite'))
    .mockImplementationOnce(() => Promise.resolve('18'))
    .mockImplementationOnce(() => Promise.resolve('3250'));

  const discriminator = '3030';

  const answers = [
    { name: 'Jeu', value: 'fortnite' },
    { name: 'Age', value: '18' },
    { name: 'Elo', value: '3250' },
  ];

  const expected = {
    ownerDiscriminator: discriminator,
    parameters: JSON.stringify(answers),
    channelId: '234234234243',
    numberOfPlayers: '4',
  };

  const msg = {
    author: {
      discriminator,
    },
    reply: jest.fn((msg) => Promise.resolve()),
  };

  const newGuild = false;

  getGuild.mockImplementationOnce(() => newGuild);

  await createLobby(msg);

  expect(msg.reply).toBeCalledWith(GUILD_UNAVAILABLE_MESSAGE);
  done();
});
