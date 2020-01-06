import { Message } from 'discord.js';

import { TDiscordEmojiFilter, TDiscordMessageFilter } from '@app/types/index';

export const awaitMessage = async (
  msg: Message,
  question: string,
  messageFilter: TDiscordMessageFilter,
) => {
  let questionMessage = await msg.reply(question);

  if (Array.isArray(questionMessage)) {
    questionMessage = questionMessage[0];
  }

  const collectedPlayerResponse = await questionMessage.channel.awaitMessages(
    messageFilter,
    { max: 1, time: 60000, errors: ['time'] },
  );

  const playersMessageContent = collectedPlayerResponse.first().content;

  return playersMessageContent;
};

export const awaitEmojis = async (
  msg: Message,
  emojiFilter: TDiscordEmojiFilter,
) => {
  const choiceMessageReactions = await msg.awaitReactions(emojiFilter, {
    max: 1,
    time: 60000,
    errors: ['time'],
  });

  const reaction = choiceMessageReactions.first();

  return reaction;
};
