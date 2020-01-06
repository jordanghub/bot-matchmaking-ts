import { VoiceChannel, Channel } from 'discord.js';

import Lobby from '@app/models/Lobby';
import PlayerInQueue from '@app/models/PlayerInQueue';

import { getGuild } from '@app/service/discord/guild';

import { deleteChannel } from '@app/service/discord/channel';

/**
 * @description Remove discord channel and lobby if the user createdOne
 */

export const cleanLobbyIfExists = async (playerId: string) => {
  const lobby = await Lobby.findOne({
    where: {
      ownerDiscriminator: playerId,
    },
  });

  if (lobby) {
    await deleteChannel(lobby.channelId);
    await lobby.destroy();
  }
};

/**
 * @description Remove the user from the queue if he is already in
 */

export const cleanPlayerInQueueIfExists = async (playerId: string) => {
  const playerInQueue = await PlayerInQueue.findOne({
    where: {
      playerId,
    },
  });
  if (playerInQueue) {
    await playerInQueue.destroy();
  }
};

/**
 * @description Check is the lobbies's channels are empty and delete them if they are
 */

export const cleanAllEmptyLobbies = async () => {
  const guild = getGuild();

  if (!guild) {
    return;
  }
  const { channels } = guild;

  const lobbies = await Lobby.findAll();
  lobbies.forEach(async (lobby) => {
    const lobbyChannel = channels.find(
      (channel: Channel) => channel.id === lobby.channelId,
    );

    if (!lobbyChannel || !(lobbyChannel instanceof VoiceChannel)) {
      await lobby.destroy();
      return;
    }

    const channelMembersList = lobbyChannel.members.array();

    if (channelMembersList.length === 0) {
      await lobbyChannel.delete();
      await lobby.destroy();
    }
  });
};
