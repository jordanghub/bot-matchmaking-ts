jest.mock('sequelize');

import Sequelize from 'sequelize';

import { getDb } from '@app/service/db';

beforeAll(() => {
  Sequelize.mockImplementation(() => {
    return function() {
      console.log('constructor');
    };
  });
});

describe('getDb', () => {
  test('should be called one time only', () => {
    getDb();
    getDb();
    getDb();
    getDb();

    expect(Sequelize).toHaveBeenCalledTimes(1);
  });
});
