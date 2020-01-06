import { getGuild } from '@app/service/discord/guild';
import { Channel } from 'discord.js';

/**
 * Delete a given channel with it's id
 */
export const deleteChannel = async (channelId: string) => {
  const guild = getGuild();

  if (!guild) {
    return false;
  }

  const channel = guild.channels.find(
    (channel: Channel) => channelId === channel.id,
  );

  if (!channel) {
    return false;
  }

  await channel.delete();
};
