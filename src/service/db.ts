import { Sequelize } from 'sequelize';
import config from '@app/config';

let db: Sequelize | null = null;

export const getDb = (): Sequelize => {
  if (!db) {
    db = new Sequelize({
      dialect: 'sqlite',
      storage: config.dbPath,
    });
  }
  return db;
};

export default getDb();
