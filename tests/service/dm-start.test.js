import 'regenerator-runtime';

jest.mock('@app/utils/questions');
jest.mock('@app/service/create-lobby');
jest.mock('@app/service/create-invite');
jest.mock('@app/service/create-queue-request');
jest.mock('@app/service/activate-lobby');

import createLobby from '@app/service/create-lobby';
import activateLobby from '@app/service/activate-lobby';
import createInvite from '@app/service/create-invite';
import createQueueRequest from '@app/service/create-queue-request';

import { INTRO_MESSAGE, INTRO_EMOJIS_LIST } from '@app/consts';

import { awaitEmojis } from '@app/utils/questions';

import dmStart from '@app/service/dm-start';

beforeEach(() => {
  awaitEmojis.mockClear();

  createLobby.mockClear();
  activateLobby.mockClear();
  createInvite.mockClear();
  createQueueRequest.mockClear();

  createLobby.mockImplementationOnce(jest.fn(() => Promise.resolve()));
  activateLobby.mockImplementationOnce(jest.fn(() => Promise.resolve()));
  createInvite.mockImplementationOnce(jest.fn(() => Promise.resolve()));
  createQueueRequest.mockImplementationOnce(jest.fn(() => Promise.resolve()));
});

describe('dmStart', () => {
  test('should call createLobby() only', async (done) => {
    const emoji = INTRO_EMOJIS_LIST[0];

    const reaction = {
      emoji: {
        name: emoji,
      },
    };

    const replyMessage = {
      react: jest.fn(() => Promise.resolve()),
    };

    const msg = {
      content: {
        startsWith: () => true,
      },
      author: {
        discriminator: '3030',
      },
      reply: jest.fn(() => Promise.resolve(replyMessage)),
    };

    awaitEmojis.mockImplementation(jest.fn(() => Promise.resolve(reaction)));

    await dmStart(msg);

    expect(msg.reply).toBeCalledTimes(1);

    expect(replyMessage.react).toBeCalledTimes(INTRO_EMOJIS_LIST.length);

    expect(awaitEmojis).toBeCalledTimes(1);

    expect(createLobby).toBeCalledTimes(1);
    expect(createInvite).not.toBeCalled();
    expect(activateLobby).not.toBeCalled();
    expect(createQueueRequest).not.toBeCalled();

    done();
  });
  test('should call createInvite()', async (done) => {
    const emoji = INTRO_EMOJIS_LIST[1];

    const reaction = {
      emoji: {
        name: emoji,
      },
    };

    const replyMessage = {
      react: jest.fn(() => Promise.resolve()),
    };

    const msg = {
      content: {
        startsWith: () => true,
      },
      author: {
        discriminator: '3030',
      },
      reply: jest.fn(() => Promise.resolve(replyMessage)),
    };

    awaitEmojis.mockImplementation(jest.fn(() => Promise.resolve(reaction)));

    await dmStart(msg);

    expect(msg.reply).toBeCalledTimes(1);

    expect(replyMessage.react).toBeCalledTimes(INTRO_EMOJIS_LIST.length);

    expect(awaitEmojis).toBeCalledTimes(1);

    expect(createLobby).not.toBeCalled();
    expect(createInvite).toBeCalled();
    expect(activateLobby).not.toBeCalled();
    expect(createQueueRequest).not.toBeCalled();

    done();
  });
  test('should call activateLobby()', async (done) => {
    const emoji = INTRO_EMOJIS_LIST[2];

    const reaction = {
      emoji: {
        name: emoji,
      },
    };

    const replyMessage = {
      react: jest.fn(() => Promise.resolve()),
    };

    const msg = {
      content: {
        startsWith: () => true,
      },
      author: {
        discriminator: '3030',
      },
      reply: jest.fn(() => Promise.resolve(replyMessage)),
    };

    awaitEmojis.mockImplementation(jest.fn(() => Promise.resolve(reaction)));

    await dmStart(msg);

    expect(msg.reply).toBeCalledTimes(1);

    expect(replyMessage.react).toBeCalledTimes(INTRO_EMOJIS_LIST.length);

    expect(awaitEmojis).toBeCalledTimes(1);

    expect(createLobby).not.toBeCalled();
    expect(createInvite).not.toBeCalled();
    expect(activateLobby).toBeCalled();
    expect(createQueueRequest).not.toBeCalled();

    done();
  });
  test('should call activateLobby()', async (done) => {
    const emoji = INTRO_EMOJIS_LIST[3];

    const reaction = {
      emoji: {
        name: emoji,
      },
    };

    const replyMessage = {
      react: jest.fn(() => Promise.resolve()),
    };

    const msg = {
      content: {
        startsWith: () => true,
      },
      author: {
        discriminator: '3030',
      },
      reply: jest.fn(() => Promise.resolve(replyMessage)),
    };

    awaitEmojis.mockImplementation(jest.fn(() => Promise.resolve(reaction)));

    await dmStart(msg);

    expect(msg.reply).toBeCalledTimes(1);

    expect(replyMessage.react).toBeCalledTimes(INTRO_EMOJIS_LIST.length);

    expect(awaitEmojis).toBeCalledTimes(1);

    expect(createLobby).not.toBeCalled();
    expect(createInvite).not.toBeCalled();
    expect(activateLobby).not.toBeCalled();
    expect(createQueueRequest).toBeCalledTimes(1);

    done();
  });
  test('shoulnt call anything', async (done) => {
    const emoji = 'sdjhfkqsdhfd';

    const reaction = {
      emoji: {
        name: emoji,
      },
    };

    const replyMessage = {
      react: jest.fn(() => Promise.resolve()),
    };

    const msg = {
      content: {
        startsWith: () => true,
      },
      author: {
        discriminator: '3030',
      },
      reply: jest.fn(() => Promise.resolve(replyMessage)),
    };

    awaitEmojis.mockImplementation(jest.fn(() => Promise.resolve(reaction)));

    await dmStart(msg);

    expect(msg.reply).toBeCalledTimes(1);

    expect(replyMessage.react).toBeCalledTimes(INTRO_EMOJIS_LIST.length);

    expect(awaitEmojis).toBeCalledTimes(1);

    expect(createLobby).not.toBeCalled();
    expect(createInvite).not.toBeCalled();
    expect(activateLobby).not.toBeCalled();
    expect(createQueueRequest).not.toBeCalledTimes(1);

    done();
  });
});
