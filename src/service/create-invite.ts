import { Message, DMChannel } from 'discord.js';

import Lobby from '@app/models/Lobby';

import {
  USER_NOT_FOUND_IN_THE_SERVER,
  PROMPT_USER_DISCRIMINATOR,
  NO_LOBBY_FOUND,
  CANNOT_CONTACT_USER_MESSAGE,
  USER_ACCEPTED_INVITE_MESSAGE,
  USER_REFUSED_INVITE_MESSAGE,
} from '@app/consts';

import { getGuild } from '@app/service/discord/guild';
import { awaitMessage, awaitEmojis } from '@app/utils/questions';
import { messageFilterDiscriminator, emojiFilter } from '@app/utils/filters';

export const choiceEmojis = ['1⃣', '2⃣'];

/**
 * @description Allow a user to invite someone to join his lobby
 */

const createInvite = async (msg: Message) => {
  const guild = getGuild();

  if (!guild) {
    await msg.reply(NO_LOBBY_FOUND);
    return false;
  }

  const lobby = await Lobby.findOne({
    where: {
      ownerDiscriminator: msg.author.discriminator,
    },
  });

  if (!lobby) {
    await msg.reply(NO_LOBBY_FOUND);
    return;
  }

  const discriminator = await awaitMessage(
    msg,
    PROMPT_USER_DISCRIMINATOR,
    messageFilterDiscriminator(msg.author.discriminator),
  );

  const memberToInvite = guild.members.find(
    (member) => member.user.discriminator === discriminator,
  );

  if (!memberToInvite) {
    await msg.reply(USER_NOT_FOUND_IN_THE_SERVER);
    return;
  }

  const dmChannelInviteUser = await memberToInvite.createDM();

  if (!(dmChannelInviteUser instanceof DMChannel)) {
    await msg.reply(CANNOT_CONTACT_USER_MESSAGE);
    return;
  }
  let choiceMessage = await dmChannelInviteUser.send(`
    Le joueur ${msg.author.username} vous invite à le rejoindre
    :one: Pour accepter
    :two: Pour refuser  
  `);

  if (Array.isArray(choiceMessage)) {
    choiceMessage = choiceMessage[0];
  }

  await choiceMessage.react(choiceEmojis[0]);
  await choiceMessage.react(choiceEmojis[1]);

  const reaction = await awaitEmojis(
    msg,
    emojiFilter(discriminator, choiceEmojis),
  );

  if (reaction.emoji.name === choiceEmojis[0]) {
    await msg.reply(USER_ACCEPTED_INVITE_MESSAGE);
    await memberToInvite.setVoiceChannel(lobby.channelId);
  } else {
    await msg.reply(USER_REFUSED_INVITE_MESSAGE);
  }
};

export default createInvite;
