import { Guild, GuildMember } from 'discord.js';

import client from '@app/service/client';

// Fetches the first guild of the bot

export const getGuild = () => {
  const guild = client.guilds.first();
  return guild;
};

// Fetch a guild member with it's discriminator

export const getGuildMemberByDiscriminator = (
  guild: Guild,
  discriminator: string,
) => {
  const currentGuildUser = guild.members.find(
    (member) => member.user.discriminator === discriminator,
  );

  if (currentGuildUser instanceof GuildMember) {
    return currentGuildUser;
  }
  return false;
};
