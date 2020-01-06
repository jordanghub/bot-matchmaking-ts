import { ChannelData } from 'discord.js';

export const getVoiceChannelOptions = (guildId: string) => {
  const channelOptions: ChannelData = {
    type: 'voice',
    permissionOverwrites: [
      {
        id: guildId,
        deny: ['VIEW_CHANNEL'],
      },
    ],
  };

  return channelOptions;
};
