import { TMatchmakingFilterParam } from '@app/types';

const filters: Array<TMatchmakingFilterParam> = [
  // Call to the function filter to check if there is a match or not

  {
    name: 'Jeu',
    type: String,
    questionCreate: 'Quel est le jeu sur lequel vous souhaitez ?',
    questionJoin: 'Quel est le jeu sur lequel vous souhaitez jouer ?',
    matchFilter: (game: string, playerGame: string) => {
      return game === playerGame;
    },
  },
  {
    name: 'Age',
    type: Number,
    questionCreate: "Quel est l 'age minimum des joueurs ?",
    questionJoin: 'Quel est votre âge ?',
    matchFilter: (minAge: number, playerAge: number) => {
      return minAge >= playerAge;
    },
  },
  {
    name: 'Elo',
    type: Number,
    questionCreate: "Quel est l'élo minimum souhaité",
    questionJoin: 'Quel est votre élo ?',
    matchFilter: (minRank: number, playerRank: number) => {
      return minRank >= playerRank;
    },
  },
];

export default filters;
