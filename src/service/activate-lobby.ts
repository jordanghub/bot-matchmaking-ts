import Lobby from '@app/models/Lobby';

import {
  NO_LOBBY_FOUND,
  LOBBY_ALREADY_ACTIVE,
  LOBBY_ACTIVATED,
} from '@app/consts';
import { Message } from 'discord.js';

/**
 * Change the isActive value of the user's lobby to true
 */
const activateLobby = async (msg: Message) => {
  const userId = msg.author.discriminator;

  const userLobby = await Lobby.findOne({
    where: {
      ownerDiscriminator: userId,
    },
  });

  if (!userLobby) {
    await msg.reply(NO_LOBBY_FOUND);
    return false;
  }

  if (userLobby.isActive) {
    await msg.reply(LOBBY_ALREADY_ACTIVE);
    return false;
  }

  userLobby.isActive = true;
  await userLobby.save();
  await msg.reply(LOBBY_ACTIVATED);

  return userLobby;
};

export default activateLobby;
