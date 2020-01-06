import { VoiceChannel, GuildMember } from 'discord.js';

import Lobby from '@app/models/Lobby';

import PlayerInQueue from '@app/models/PlayerInQueue';

import { getGuild } from '@app/service/discord/guild';

import matchmakingFilters from '@app/config/matchmaking-filters';
import { TPlayerParam, TMatchmakingFilterParam } from '@app/types';

const matchmaking = async () => {
  // Fetch lobbies
  const lobbies = await Lobby.findAll();

  // Fetch players in queue

  const playersInQueue = await PlayerInQueue.findAll();

  const guild = getGuild();
  if (!guild) {
    return;
  }

  const { channels, members } = guild;

  playersInQueue.forEach(async (player) => {
    const playerParams = JSON.parse(player.parameters);

    const lobby = lobbies.find((lobby) => {
      // Return false if the lobby is not active

      if (!lobby.isActive) {
        return false;
      }

      // Get the channel from the build
      const channel = channels.find((chan) => chan.id === lobby.channelId);

      // Exit the current iteration ifthe channel doesn't exist or is not a voice channel
      if (!channel || !(channel instanceof VoiceChannel)) {
        return false;
      }
      // Compare the parameters of the lobby with the parameters of the player

      const lobbyParams = JSON.parse(lobby.parameters);

      const lobbyFound = matchmakingFilters.reduce(
        (acc, parameter: TMatchmakingFilterParam) => {
          const result = parameter.matchFilter(
            playerParams.find(
              (pParam: TPlayerParam) => pParam.name === parameter.name,
            ).value,
            lobbyParams.find(
              (lParam: TPlayerParam) => lParam.name === parameter.name,
            ).value,
          );

          if (result) {
            return acc + 1;
          }
          return acc + 0;
        },
        0,
      );

      if (lobbyFound !== matchmakingFilters.length) {
        return false;
      }

      // If the lobby is already full break
      const voiceChannelMembers = channel.members.array().length;

      if (voiceChannelMembers >= lobby.numberOfPlayers) {
        return false;
      }

      // A lobby has been found

      return true;
    });
    if (lobby) {
      // Get the lobby's channel
      const lobbyChannel = channels.find((chan) => chan.id === lobby.channelId);

      // Return if there is no channel or if the channel is not a Voice Channel
      if (!lobbyChannel || !(lobbyChannel instanceof VoiceChannel)) {
        return false;
      }

      // Get the guild member with the discriminator inside of PlayerInQueue

      const guildMember = members.find(
        (member) => member.user.discriminator === player.playerId,
      );

      // Return if the user is not found or if for some reason it is not a GuildMember

      if (!guildMember || !(guildMember instanceof GuildMember)) {
        return false;
      }

      // Move the player to the lobby

      try {
        await guildMember.setVoiceChannel(lobbyChannel.id);
        // The user has been moved without any issue, remove the user from the queue
        await player.destroy();
      } catch (e) {
        //
        console.log(e);
      }
    }
  });
};

export default matchmaking;
