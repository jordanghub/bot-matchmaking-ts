import client from '@app/service/client';

import {
  ON_LOBBY_IS_CREATED,
  NOT_ON_SERVER_MESSAGE,
  NOT_ON_VOCAL_CHANNEL_MESSAGE,
  GUILD_UNAVAILABLE_MESSAGE,
} from '@app/consts';

import {
  cleanLobbyIfExists,
  cleanPlayerInQueueIfExists,
} from '@app/service/cleaner/player';

import { awaitMessage } from '@app/utils/questions';
import { messageFilterDiscriminator } from '@app/utils/filters';
import { getVoiceChannelOptions } from '@app/utils/channel';

import { getGuild } from '@app/service/discord/guild';
import lobbyParameters from '@app/config/matchmaking-filters';

import Lobby from '@app/models/Lobby';
import { GuildMember, Message } from 'discord.js';

/**
 * @description Create a lobby
 */
const createLobby = async (msg: Message) => {
  // Check if the user is in queue or already created a lobby
  // Only one action is allowed at the time, clean the other if they exists

  await cleanPlayerInQueueIfExists(msg.author.discriminator);
  await cleanLobbyIfExists(msg.author.discriminator);

  const guild = getGuild();

  if (!guild) {
    await msg.reply(GUILD_UNAVAILABLE_MESSAGE);
    return;
  }

  // Get Guild Member

  const currentGuildUser: GuildMember | undefined = guild.members.find(
    (member) => member.user.discriminator === msg.author.discriminator,
  );

  if (!currentGuildUser || !(currentGuildUser instanceof GuildMember)) {
    msg.reply(NOT_ON_SERVER_MESSAGE);
    return false;
  }

  const answers = [];

  const playersMessageContent = await awaitMessage(
    msg,
    'Combien de joueurs ?',
    messageFilterDiscriminator(msg.author.discriminator),
  );
  for (let i = 0; i < lobbyParameters.length; i++) {
    const playersMessageContent = await awaitMessage(
      msg,
      lobbyParameters[i].questionCreate,
      messageFilterDiscriminator(msg.author.discriminator),
    );

    answers.push({
      name: lobbyParameters[i].name,
      value: playersMessageContent,
    });
  }
  const channelOptions = getVoiceChannelOptions(guild.id);

  const voiceChannel = await guild.createChannel(
    'Lobby de ' + msg.author.username,
    channelOptions,
  );

  const newLobby = await Lobby.create({
    ownerDiscriminator: msg.author.discriminator,
    parameters: JSON.stringify(answers),
    channelId: voiceChannel.id,
    numberOfPlayers: playersMessageContent,
  });

  try {
    await currentGuildUser.setVoiceChannel(voiceChannel.id);
  } catch (e) {
    await msg.reply(NOT_ON_VOCAL_CHANNEL_MESSAGE);
  }

  client.emit(ON_LOBBY_IS_CREATED, msg);
  return newLobby;
};

export default createLobby;
