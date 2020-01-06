import 'regenerator-runtime';

jest.mock('@app/models/Lobby');

import Lobby from '@app/models/Lobby';

import {
  NO_LOBBY_FOUND,
  LOBBY_ALREADY_ACTIVE,
  LOBBY_ACTIVATED,
} from '@app/consts';

import activateLobby from '@app/service/activate-lobby';

test('activateLobby - isActive to false', async (done) => {
  const expected = {
    isActive: false,
    save: () => Promise.resolve(),
  };

  Lobby.findOne.mockImplementationOnce(() => {
    return Promise.resolve(expected);
  });

  let replyMessage = '';

  const message = {
    author: {
      discriminator: '3242',
    },
    reply: (msg) => {
      replyMessage = msg;
      return Promise.resolve();
    },
  };

  const result = await activateLobby(message);

  expect(result).toBe(expected);
  expect(replyMessage).toBe(LOBBY_ACTIVATED);

  done();
});

test('activateLobby - isActive to true', async (done) => {
  const expected = false;

  const dummyData = {
    isActive: true,
    save: () => Promise.resolve(),
  };

  Lobby.findOne.mockImplementationOnce(() => {
    return Promise.resolve(dummyData);
  });

  let replyMessage = '';

  const message = {
    author: {
      discriminator: '3242',
    },
    reply: (msg) => {
      replyMessage = msg;
      return Promise.resolve();
    },
  };

  const result = await activateLobby(message);

  expect(result).toBe(expected);
  expect(replyMessage).toBe(LOBBY_ALREADY_ACTIVE);

  done();
});
test('activateLobby - No lobby found', async (done) => {
  const expected = false;

  const dummyData = false;

  Lobby.findOne.mockImplementationOnce(() => {
    return Promise.resolve(dummyData);
  });

  let replyMessage = '';

  const message = {
    author: {
      discriminator: '3242',
    },
    reply: (msg) => {
      replyMessage = msg;
      return Promise.resolve();
    },
  };

  const result = await activateLobby(message);

  expect(result).toBe(expected);
  expect(replyMessage).toBe(NO_LOBBY_FOUND);

  done();
});
