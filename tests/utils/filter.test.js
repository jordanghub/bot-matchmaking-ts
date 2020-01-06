import { messageFilterDiscriminator, emojiFilter } from '@app/utils/filters';
import { INTRO_EMOJIS_LIST } from '@app/consts';

/* eslint-disable */

test('messageFilterDiscriminator - Different discriminator', () => {
  const fakeDiscriminator = '32424362';

  const fakeMessage = {
    author: {
      discriminator: '4434566',
    },
  };

  const result = messageFilterDiscriminator(fakeDiscriminator)(fakeMessage);
  expect(result).toBe(false);
});
test('messageFilterDiscriminator - Same descriminator', () => {
  const fakeDiscriminator = '46556456';

  const fakeMessage = {
    author: {
      discriminator: '46556456',
    },
  };
  const result = messageFilterDiscriminator(fakeDiscriminator)(fakeMessage);

  expect(result).toBe(true);
});

test('emojiFilter - Same author and emoji in list', () => {
  const reaction = { emoji: { name: INTRO_EMOJIS_LIST[0] } };
  const fakeUser = { discriminator: '4567686' };

  const fakeAuthorId = '4567686';

  const result = emojiFilter(fakeAuthorId, INTRO_EMOJIS_LIST)(
    reaction,
    fakeUser,
  );

  expect(result).toBe(true);
});
test('emojiFilter - Wrong author and emoji in list', () => {
  const reaction = { emoji: { name: INTRO_EMOJIS_LIST[0] } };
  const fakeUser = { discriminator: '456687' };

  const fakeAuthorId = '4567686';

  const result = emojiFilter(fakeAuthorId, INTRO_EMOJIS_LIST)(
    reaction,
    fakeUser,
  );

  expect(result).toBe(false);
});
test('emojiFilter - Not the same author and emoji not in list', () => {
  const reaction = { emoji: { name: INTRO_EMOJIS_LIST[2] } };
  const fakeUser = { discriminator: '4567687' };

  const fakeAuthorId = '4567686';

  const result = emojiFilter(fakeAuthorId, ['11', , '22', '33'])(
    reaction,
    fakeUser,
  );

  expect(result).toBe(false);
});
test('emojiFilter - Same author emoji not in list', () => {
  const reaction = { emoji: { name: INTRO_EMOJIS_LIST[1] } };
  const fakeUser = { discriminator: '456687' };

  const fakeAuthorId = '456687';

  const result = emojiFilter(fakeAuthorId, ['123', '456', '464'])(
    reaction,
    fakeUser,
  );

  expect(result).toBe(false);
});
