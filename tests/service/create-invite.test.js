import 'regenerator-runtime';

jest.mock('@app/models/Lobby');

jest.mock('@app/service/discord/guild');

jest.mock('@app/utils/questions');

jest.mock('discord.js');

import createInvite, { choiceEmojis } from '@app/service/create-invite';
import Lobby from '@app/models/Lobby';
import { GuildMember, DMChannel } from 'discord.js';
import { awaitEmojis, awaitMessage } from '@app/utils/questions';
import { getGuild } from '@app/service/discord/guild';

import {
  USER_NOT_FOUND_IN_THE_SERVER,
  NO_LOBBY_FOUND,
  CANNOT_CONTACT_USER_MESSAGE,
  USER_REFUSED_INVITE_MESSAGE,
  USER_ACCEPTED_INVITE_MESSAGE,
} from '@app/consts';
beforeEach(() => {
  Lobby.findOne.mockClear();
  awaitEmojis.mockClear();
  awaitMessage.mockClear();
  getGuild.mockClear();
});

describe('createInvite', () => {
  test('Should work', async (done) => {
    const discriminatorMessage = '3030';

    const guild = {
      members: [],
    };

    const guildMemberUser = {
      discriminator: discriminatorMessage,
    };

    const msg = {
      reply: jest.fn((param) => Promise.resolve()),
      author: {
        username: 'Jordan',
      },
    };

    const emojiChoice = {
      emoji: {
        name: choiceEmojis[0],
      },
    };

    const lobby = {
      channelId: '2423423242',
    };

    const dmChannelMessage = {
      react: jest.fn(() => Promise.resolve()),
    };

    const dmChannel = new DMChannel({}, {});

    dmChannel.send = jest.fn(() => {
      return Promise.resolve(dmChannelMessage);
    });

    const guildMember = new GuildMember('234234', {});

    Lobby.findOne.mockImplementation(() => Promise.resolve(lobby));

    awaitMessage.mockImplementation(() =>
      Promise.resolve(discriminatorMessage),
    );
    awaitEmojis.mockImplementation(() => Promise.resolve(emojiChoice));
    guildMember.setVoiceChannel.mockImplementation(() => Promise.resolve());

    guildMember.createDM.mockImplementation(() => Promise.resolve(dmChannel));

    guildMember.user = guildMemberUser;

    guild.members.push(guildMember);

    getGuild.mockImplementation(() => guild);

    await createInvite(msg);

    expect(getGuild).toBeCalledTimes(1);
    expect(Lobby.findOne).toBeCalledTimes(1);
    expect(awaitMessage).toBeCalledTimes(1);
    expect(guildMember.createDM).toBeCalledTimes(1);
    expect(dmChannel.send).toBeCalledTimes(1);
    expect(awaitEmojis).toBeCalledTimes(1);
    expect(dmChannelMessage.react).toBeCalledTimes(2);
    expect(guildMember.setVoiceChannel).toBeCalledTimes(1);

    expect(msg.reply).toHaveBeenCalledWith(USER_ACCEPTED_INVITE_MESSAGE);
    done();
  });
  test('guild not found', async (done) => {
    const discriminatorMessage = '3030';

    const guild = {
      members: [],
    };

    const guildMemberUser = {
      discriminator: discriminatorMessage,
    };

    const msg = {
      reply: jest.fn((content) => Promise.resolve()),
      author: {
        username: 'Jordan',
      },
    };

    const emojiChoice = {
      emoji: {
        name: choiceEmojis[0],
      },
    };

    const lobby = {
      channelId: '2423423242',
    };

    const dmChannelMessage = {
      react: jest.fn(() => Promise.resolve()),
    };

    const dmChannel = new DMChannel({}, {});

    dmChannel.send = jest.fn(() => {
      console.log('second test');
      return Promise.resolve(dmChannelMessage);
    });

    const guildMember = new GuildMember('234234', {});

    Lobby.findOne.mockImplementation(() => Promise.resolve(lobby));

    awaitMessage.mockImplementation(() =>
      Promise.resolve(discriminatorMessage),
    );
    awaitEmojis.mockImplementation(() => Promise.resolve(emojiChoice));
    guildMember.setVoiceChannel.mockImplementation(() => Promise.resolve());

    guildMember.createDM.mockImplementation(() => Promise.resolve(dmChannel));

    guildMember.user = guildMemberUser;

    guild.members.push(guildMember);

    getGuild.mockImplementation(() => false);

    await createInvite(msg);

    expect(getGuild).toBeCalledTimes(1);
    expect(Lobby.findOne).not.toBeCalled();
    expect(awaitMessage).not.toBeCalled();
    expect(guildMember.createDM).not.toBeCalled();
    expect(dmChannel.send).not.toBeCalled();
    expect(awaitEmojis).not.toBeCalled();
    expect(dmChannelMessage.react).not.toBeCalled();
    expect(guildMember.setVoiceChannel).not.toBeCalled();
    expect(msg.reply).toBeCalledTimes(1);
    expect(msg.reply.mock.calls[0][0]).toBe(NO_LOBBY_FOUND);
    done();
  });
  test('lobby not found', async (done) => {
    const discriminatorMessage = '3030';

    const guild = {
      members: [],
    };

    const guildMemberUser = {
      discriminator: discriminatorMessage,
    };

    const msg = {
      reply: jest.fn(() => Promise.resolve()),
      author: {
        username: 'Jordan',
      },
    };

    const emojiChoice = {
      emoji: {
        name: choiceEmojis[0],
      },
    };

    const lobby = false;

    const dmChannelMessage = {
      react: jest.fn((content) => Promise.resolve()),
    };

    const dmChannel = new DMChannel({}, {});

    dmChannel.send = jest.fn(() => {
      console.log('second test');
      return Promise.resolve(dmChannelMessage);
    });

    const guildMember = new GuildMember('234234', {});

    Lobby.findOne.mockImplementation(() => Promise.resolve(lobby));

    awaitMessage.mockImplementation(() =>
      Promise.resolve(discriminatorMessage),
    );
    awaitEmojis.mockImplementation(() => Promise.resolve(emojiChoice));
    guildMember.setVoiceChannel.mockImplementation(() => Promise.resolve());

    guildMember.createDM.mockImplementation(() => Promise.resolve(dmChannel));

    guildMember.user = guildMemberUser;

    guild.members.push(guildMember);

    getGuild.mockImplementation(() => guild);

    await createInvite(msg);

    expect(getGuild).toBeCalledTimes(1);
    expect(Lobby.findOne).toBeCalledTimes(1);
    expect(awaitMessage).not.toBeCalled();
    expect(guildMember.createDM).not.toBeCalled();
    expect(dmChannel.send).not.toBeCalled();
    expect(awaitEmojis).not.toBeCalled();
    expect(dmChannelMessage.react).not.toBeCalled();
    expect(guildMember.setVoiceChannel).not.toBeCalled();
    expect(msg.reply).toBeCalledTimes(1);
    expect(msg.reply.mock.calls[0][0]).toBe(NO_LOBBY_FOUND);

    done();
  });
  test('user to invite not found', async (done) => {
    const discriminatorMessage = '3030';

    const guild = {
      members: [],
    };

    const guildMemberUser = {
      discriminator: discriminatorMessage,
    };

    const msg = {
      reply: jest.fn(() => Promise.resolve()),
      author: {
        username: 'Jordan',
      },
    };

    const emojiChoice = {
      emoji: {
        name: choiceEmojis[0],
      },
    };

    const lobby = {
      channelId: '2423423242',
    };

    const dmChannelMessage = {
      react: jest.fn((content) => Promise.resolve()),
    };

    const dmChannel = new DMChannel({}, {});

    dmChannel.send = jest.fn(() => {
      return Promise.resolve(dmChannelMessage);
    });

    const guildMember = new GuildMember('234234', {});

    Lobby.findOne.mockImplementation(() => Promise.resolve(lobby));

    awaitMessage.mockImplementation(() =>
      Promise.resolve(discriminatorMessage),
    );
    awaitEmojis.mockImplementation(() => Promise.resolve(emojiChoice));
    guildMember.setVoiceChannel.mockImplementation(() => Promise.resolve());

    guildMember.createDM.mockImplementation(() => Promise.resolve(dmChannel));

    guildMember.user = guildMemberUser;

    getGuild.mockImplementation(() => guild);

    await createInvite(msg);

    expect(getGuild).toBeCalledTimes(1);
    expect(Lobby.findOne).toBeCalledTimes(1);
    expect(awaitMessage).toBeCalledTimes(1);
    expect(guildMember.createDM).not.toBeCalled();
    expect(dmChannel.send).not.toBeCalled();
    expect(awaitEmojis).not.toBeCalled();
    expect(dmChannelMessage.react).not.toBeCalled();
    expect(guildMember.setVoiceChannel).not.toBeCalled();
    expect(msg.reply).toBeCalledTimes(1);
    expect(msg.reply.mock.calls[0][0]).toBe(USER_NOT_FOUND_IN_THE_SERVER);

    done();
  });
  test('no dm channel', async (done) => {
    const discriminatorMessage = '3030';

    const guild = {
      members: [],
    };

    const guildMemberUser = {
      discriminator: discriminatorMessage,
    };

    const msg = {
      reply: jest.fn(() => Promise.resolve()),
      author: {
        username: 'Jordan',
      },
    };

    const emojiChoice = {
      emoji: {
        name: choiceEmojis[0],
      },
    };

    const lobby = {
      channelId: '2423423242',
    };

    const dmChannelMessage = {
      react: jest.fn((content) => Promise.resolve()),
    };

    const dmChannel = new DMChannel({}, {});

    dmChannel.send = jest.fn(() => {
      return Promise.resolve('');
    });

    const guildMember = new GuildMember('234234', {});

    Lobby.findOne.mockImplementation(() => Promise.resolve(lobby));

    awaitMessage.mockImplementation(() =>
      Promise.resolve(discriminatorMessage),
    );
    awaitEmojis.mockImplementation(() => Promise.resolve(emojiChoice));
    guildMember.setVoiceChannel.mockImplementation(() => Promise.resolve());

    guildMember.createDM.mockImplementation(() => Promise.resolve('dmChannel'));

    guildMember.user = guildMemberUser;

    guild.members.push(guildMember);

    getGuild.mockImplementation(() => guild);

    await createInvite(msg);

    expect(getGuild).toBeCalledTimes(1);
    expect(Lobby.findOne).toBeCalledTimes(1);
    expect(awaitMessage).toBeCalledTimes(1);
    expect(guildMember.createDM).toBeCalled();
    expect(dmChannel.send).not.toBeCalled();
    expect(awaitEmojis).not.toBeCalled();
    expect(dmChannelMessage.react).not.toBeCalled();
    expect(guildMember.setVoiceChannel).not.toBeCalled();
    expect(msg.reply).toBeCalledTimes(1);
    expect(msg.reply.mock.calls[0][0]).toBe(CANNOT_CONTACT_USER_MESSAGE);

    done();
  });

  test('user refused invite', async (done) => {
    const discriminatorMessage = '3030';

    const guild = {
      members: [],
    };

    const guildMemberUser = {
      discriminator: discriminatorMessage,
    };

    const msg = {
      reply: jest.fn((param) => Promise.resolve()),
      author: {
        username: 'Jordan',
      },
    };

    const emojiChoice = {
      emoji: {
        name: choiceEmojis[1],
      },
    };

    const lobby = {
      channelId: '2423423242',
    };

    const dmChannelMessage = {
      react: jest.fn(() => Promise.resolve()),
    };

    const dmChannel = new DMChannel({}, {});

    dmChannel.send = jest.fn(() => {
      return Promise.resolve(dmChannelMessage);
    });

    const guildMember = new GuildMember('234234', {});

    Lobby.findOne.mockImplementation(() => Promise.resolve(lobby));

    awaitMessage.mockImplementation(() =>
      Promise.resolve(discriminatorMessage),
    );
    awaitEmojis.mockImplementation(() => Promise.resolve(emojiChoice));
    guildMember.setVoiceChannel.mockImplementation(() => Promise.resolve());

    guildMember.createDM.mockImplementation(() => Promise.resolve(dmChannel));

    guildMember.user = guildMemberUser;

    guild.members.push(guildMember);

    getGuild.mockImplementation(() => guild);

    await createInvite(msg);

    expect(getGuild).toBeCalledTimes(1);
    expect(Lobby.findOne).toBeCalledTimes(1);
    expect(awaitMessage).toBeCalledTimes(1);
    expect(guildMember.createDM).toBeCalledTimes(1);
    expect(dmChannel.send).toBeCalledTimes(1);
    expect(awaitEmojis).toBeCalledTimes(1);
    expect(dmChannelMessage.react).toBeCalledTimes(2);
    expect(guildMember.setVoiceChannel).not.toBeCalled();
    expect(msg.reply).toHaveBeenCalledWith(USER_REFUSED_INVITE_MESSAGE);

    done();
  });
});
