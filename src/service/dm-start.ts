import { Message } from 'discord.js';
import createLobby from '@app/service/create-lobby';
import createInvite from '@app/service/create-invite';
import joinQueue from '@app/service/create-queue-request';
import activateLobby from '@app/service/activate-lobby';

import { INTRO_MESSAGE, INTRO_EMOJIS_LIST } from '@app/consts';

import { awaitEmojis } from '@app/utils/questions';
import { emojiFilter } from '@app/utils/filters';

const dmStart = async (msg: Message) => {
  if (msg.content.startsWith('!start')) {
    let sentMessage = await msg.reply(INTRO_MESSAGE);

    if (Array.isArray(sentMessage)) {
      sentMessage = sentMessage[0];
    }

    for (
      let emojiIndex = 0;
      emojiIndex < INTRO_EMOJIS_LIST.length;
      emojiIndex++
    ) {
      await sentMessage.react(INTRO_EMOJIS_LIST[emojiIndex]);
    }

    const reaction = await awaitEmojis(
      sentMessage,
      emojiFilter(msg.author.discriminator, INTRO_EMOJIS_LIST),
    );

    switch (reaction.emoji.name) {
      case INTRO_EMOJIS_LIST[0]: {
        await createLobby(msg);
        break;
      }

      case INTRO_EMOJIS_LIST[1]: {
        await createInvite(msg);
        break;
      }

      case INTRO_EMOJIS_LIST[2]: {
        await activateLobby(msg);
        break;
      }

      case INTRO_EMOJIS_LIST[3]: {
        await joinQueue(msg);
        break;
      }

      default:
        break;
    }
  }
};

export default dmStart;
