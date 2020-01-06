import { Message, MessageReaction, User } from 'discord.js';

export type TDiscordEmojiFilter = (
  reaction: MessageReaction,
  user: User,
) => boolean;

export type TEmojiFilter = (
  authorId: string,
  emoijiList: Array<string>,
) => TDiscordEmojiFilter;

export type TDiscordMessageFilter = (message: Message) => boolean;

export type TMessageFilterDiscriminator = (
  discriminator: string,
) => TDiscordMessageFilter;

export type TMatchmakingFilterParam = {
  name: string;
  type: any;
  questionCreate: string;
  questionJoin: string;
  matchFilter: (param1: any, param2: any) => boolean;
};

export type TPlayerParam = {
  name: string;
  value: any;
};
