import 'regenerator-runtime';

jest.mock('@app/service/client');
jest.mock('discord.js');

import { GuildMember } from 'discord.js';

import {
  getGuildMemberByDiscriminator,
  getGuild,
} from '@app/service/discord/guild';

import client from '@app/service/client';

describe('getGuild', () => {
  test('should return the guild', async (done) => {
    const guild = {
      available: true,
    };

    const guilds = {
      first: () => guild,
    };

    const expected = guild;

    client.guilds = guilds;

    const result = await getGuild();
    expect(result).toBe(expected);

    done();
  });
  test('should return false', async (done) => {
    const guild = {
      available: false,
    };

    const guilds = {
      first: () => guild,
    };

    const expected = false;

    client.guilds = guilds;

    const result = await getGuild();
    expect(result).toBe(expected);

    done();
  });
  test('should return false', async (done) => {
    const guild = {
      available: false,
    };

    const guilds = {
      first: () => undefined,
    };

    const expected = false;

    client.guilds = guilds;

    const result = await getGuild();
    expect(result).toBe(expected);

    done();
  });
});

describe('getGuildMemberByDiscriminator', () => {
  test('user in guild members', () => {
    const guild = {
      id: '34345334',
      members: [],
    };

    const guildMember = new GuildMember(guild.id, {});

    guildMember.user = {
      discriminator: '3030',
    };

    guild.members.push(guildMember);

    const result = getGuildMemberByDiscriminator(guild, '3030');

    expect(result).toBe(guildMember);
  });
  test('different discriminator', () => {
    const guild = {
      id: '34345334',
      members: [],
    };

    const result = getGuildMemberByDiscriminator(guild, '3030');

    expect(result).toBe(false);
  });
  test('no guild members', () => {
    const guild = {
      id: '34345334',
      members: [],
    };

    const result = getGuildMemberByDiscriminator(guild, '3030');

    expect(result).toBe(false);
  });
});
