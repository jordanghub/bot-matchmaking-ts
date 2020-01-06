import 'regenerator-runtime';

import { Message, DMChannel } from 'discord.js';

import client from '@app/service/client';
import db from '@app/service/db';

import dmStart from '@app/service/dm-start';
import matchmaking from '@app/service/matchmaking';

import { ON_PLAYER_JOIN_QUEUE, ON_LOBBY_IS_CREATED } from '@app/consts';

import config from '@app/config';

db.authenticate()
  .then(() => {
    client.on('ready', () => {
      console.log('Bot lancé');

      // THE REAPER
      /*
      setInterval(async () => {
        console.log('Clean in progress');
        await cleanAllEmptyLobbies();
        console.log('Done');
      }, 30000);
      */
    });

    client.on('message', async (msg: Message) => {
      if (msg.author.bot) {
        return;
      }

      if (msg.channel instanceof DMChannel) {
        console.log('Message privé');
        await dmStart(msg);
      }
    });

    client.on(ON_PLAYER_JOIN_QUEUE, async (msg: Message) => {
      console.log('Player joined  queue');
      await matchmaking();
    });
    client.on(ON_LOBBY_IS_CREATED, async (msg: Message) => {
      console.log('Lobby created');
      await matchmaking();
    });

    client.login(config.token);
  })
  .catch((err: any) => console.log(err));
