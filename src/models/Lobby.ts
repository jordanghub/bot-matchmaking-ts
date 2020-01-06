import Sequelize, { Model } from 'sequelize';

import db from '@app/service/db';

class Lobby extends Model {
  public id!: number;
  public numberOfPlayers!: number;
  public isActive!: boolean;
  public parameters!: string;
  public channelId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Lobby.init(
  {
    ownerDiscriminator: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    numberOfPlayers: {
      type: Sequelize.INTEGER,
    },
    isActive: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    parameters: {
      type: Sequelize.JSON,
      allowNull: false,
    },
    channelId: {
      type: Sequelize.STRING,
    },
  },
  {
    sequelize: db,
    modelName: 'lobbies',
  },
);
export default Lobby;
