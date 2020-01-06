import 'regenerator-runtime';

import { awaitEmojis, awaitMessage } from '@app/utils/questions';

describe('awaitEmojis', () => {
  test('should return the emoji', async (done) => {
    const fakeEmoji = ':one:';
    const response = {
      first: () => fakeEmoji,
    };

    const msg = {
      awaitReactions: jest.fn(() => {
        return Promise.resolve(response);
      }),
    };
    const result = await awaitEmojis(msg, () => {});

    expect(msg.awaitReactions).toBeCalled();
    expect(result).toBe(fakeEmoji);

    done();
  });
});
describe('awaitMessage', () => {
  test('should return the emoji', async (done) => {
    const question = 'My question to the user';

    const fakeMessage = 'A test message';

    let receivedReply = '';

    const replyMessageContent = {
      first: jest.fn(() => ({
        content: fakeMessage,
      })),
    };

    const replyMessage = {
      channel: {
        awaitMessages: jest.fn(() => Promise.resolve(replyMessageContent)),
      },
    };
    const msg = {
      reply: jest.fn((reply) => {
        receivedReply = reply;
        return Promise.resolve(replyMessage);
      }),
    };

    const result = await awaitMessage(msg, question, () => {});

    expect(msg.reply).toBeCalled();
    expect(replyMessage.channel.awaitMessages).toBeCalled();
    expect(replyMessageContent.first).toBeCalled();
    expect(receivedReply).toBe(question);
    expect(result).toBe(fakeMessage);

    done();
  });
});
