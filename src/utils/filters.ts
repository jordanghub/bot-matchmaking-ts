import { Message, User, MessageReaction } from 'discord.js';
import { TMessageFilterDiscriminator, TEmojiFilter } from '@app/types';

export const messageFilterDiscriminator: TMessageFilterDiscriminator = (
  discriminator,
) => {
  return (message) => message.author.discriminator === discriminator;
};

export const emojiFilter: TEmojiFilter = (authorId, emoijiList) => {
  return (reaction, user) =>
    emoijiList.includes(reaction.emoji.name) && user.discriminator === authorId;
};
