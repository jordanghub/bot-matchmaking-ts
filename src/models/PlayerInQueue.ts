import Sequelize, { Model } from 'sequelize';

import db from '@app/service/db';

class PlayerInQueue extends Model {
  public id!: number;
  public playerId!: string;
  public parameters!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PlayerInQueue.init(
  {
    playerId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    parameters: {
      type: Sequelize.JSON,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: 'players-in-queue',
  },
);
export default PlayerInQueue;
