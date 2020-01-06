import { Guild, GuildMember } from 'discord.js';

import client from '@app/service/client';

/**
 * @description Fetch the first guild of the bot
 */

export const getGuild = () => {
  const guild = client.guilds.first();

  if (guild && guild.available) {
    return guild;
  }
  return false;
};

/**
 * @description Find a member in a guild with it's discord id (#3030)
 */

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
