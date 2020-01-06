import { Message, GuildMember } from 'discord.js';

import PlayerInQueue from '@app/models/PlayerInQueue';

import client from '@app/service/client';

import lobbyParameters from '@app/config/matchmaking-filters';
import { messageFilterDiscriminator } from '@app/utils/filters';
import { awaitMessage } from '@app/utils/questions';

import { getGuild } from '@app/service/discord/guild';

import {
  ON_PLAYER_JOIN_QUEUE,
  USER_NOT_FOUND_IN_THE_SERVER,
  GUILD_UNAVAILABLE_MESSAGE,
  QUEUE_JOINED_SUCCESSFULLY_MESSAGE,
} from '@app/consts';

import {
  cleanLobbyIfExists,
  cleanPlayerInQueueIfExists,
} from '@app/service/cleaner/player';

/**
 * @description Put the player in the waiting queue
 */
const createQueueRequest = async (msg: Message) => {
  // Only one action is allowed at the time, clean the other if they exists

  await cleanPlayerInQueueIfExists(msg.author.discriminator);
  await cleanLobbyIfExists(msg.author.discriminator);

  // Get the guild

  const guild = getGuild();

  if (!guild) {
    await msg.reply(GUILD_UNAVAILABLE_MESSAGE);
    return;
  }

  // Get GuildMember instance of the user in the guild

  const currentGuildUser = guild.members.find(
    (member) => member.user.discriminator === msg.author.discriminator,
  );

  if (!(currentGuildUser instanceof GuildMember)) {
    await msg.reply(USER_NOT_FOUND_IN_THE_SERVER);
    return;
  }

  const answers = [];

  // Loop through the questions and record the answers in answers[]

  for (let i = 0; i < lobbyParameters.length; i++) {
    const playersMessageContent = await awaitMessage(
      msg,
      lobbyParameters[i].questionJoin,
      messageFilterDiscriminator(msg.author.discriminator),
    );

    const response = {
      name: lobbyParameters[i].name,
      value: playersMessageContent,
    };
    answers.push(response);
  }

  await PlayerInQueue.create({
    playerId: msg.author.discriminator,
    parameters: JSON.stringify(answers),
  });

  try {
    await msg.reply(QUEUE_JOINED_SUCCESSFULLY_MESSAGE);
  } catch (e) {
    console.log(e);
  }

  client.emit(ON_PLAYER_JOIN_QUEUE, msg);
};

export default createQueueRequest;
