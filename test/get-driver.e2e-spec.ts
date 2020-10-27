import * as request from 'supertest';
import initDBAndFeelByFixtures from '../src/db/ss';
import * as knex from '../src/db/knex';

const APP_URL = 'http://localhost:3000';

describe('Driver get (e2e)', () => {
  beforeAll(async () => {
    await initDBAndFeelByFixtures();
  });

  afterAll(async done => {
    knex.default.destroy();
    done();
  });

  describe('Simple', () => {
    it('/order (Post)', () => {
      return request(APP_URL)
        .post('/order')
        .send({ clientId: 5, fromId: 2, toId: 7 })
        .expect({ orderId: 1, driverId: 1 });
    });
    it('/order (Post)', () => {
      return request(APP_URL)
        .post('/order')
        .send({ clientId: 7, fromId: 1, toId: 4 })
        .expect({ orderId: 2, driverId: 2 });
    });
  });

  describe('Unknown departure point', () => {
    it('/order (Post)', () => {
      return request(APP_URL)
        .post('/order')
        .send({ clientId: 3, fromId: 200, toId: 7 })
        .expect({
          error: true,
          reason: 'departure point not found',
          code: 1,
          description:
            'Departure point 200 not found in DB. Please add it before use',
        });
    });
  });

  describe('Unknown destination point', () => {
    it('/order (Post)', () => {
      return request(APP_URL)
        .post('/order')
        .send({ clientId: 3, fromId: 2, toId: 400 })
        .expect({
          error: true,
          reason: 'destination point not found',
          code: 2,
          description:
            'Destination point 400 not found in DB. Please add it before use',
        });
    });
  });

  describe('Unknown client', () => {
    it('/order (Post)', () => {
      return request(APP_URL)
        .post('/order')
        .send({ clientId: 300, fromId: 2, toId: 4 })
        .expect({
          error: true,
          reason: 'client not found',
          code: 3,
          description: 'Client 300 not found in DB. Please add it before use',
        });
    });
  });

  describe('Client already have active order', () => {
    it('/order (Post)', () => {
      return request(APP_URL)
        .post('/order')
        .send({ clientId: 4, fromId: 2, toId: 7 })
        .then(() =>
          request(APP_URL)
            .post('/order')
            .send({ clientId: 4, fromId: 1, toId: 4 })
            .expect({
              error: true,
              reason: 'client already have active order',
              code: 4,
              description: `Client 4 already have an active order.
      A client cannot have several active orders at the same time.
      Complete or cancel an existing order to place a new one`,
            }),
        );
    });
  });

  describe('All drivers ary busy', () => {
    it('/order (Post)', async () => {
      await initDBAndFeelByFixtures();
      for (let requestNumber = 1; requestNumber < 10; requestNumber++) {
        await request(APP_URL)
          .post('/order')
          .send({ clientId: requestNumber, fromId: 2, toId: 7 });
      }

      return request(APP_URL)
        .post('/order')
        .send({ clientId: 10, fromId: 2, toId: 7 })
        .expect({
          error: true,
          reason: 'there are no free drivers now',
          code: 5,
          description: 'There are no free drivers now. Please, wait',
        });
    });
  });

  describe('Passed incorrect data by API', () => {
    it('/order (Post)', async () => {
      return request(APP_URL)
        .post('/order')
        .send({ clientId: -10, fromId: 2, toId: 7 })
        .expect({
          error: true,
          reason: 'an invalid object was passed',
          code: 0,
          description:
            'Passed data has the next problems: ' +
            `[ 'clientId must not be less than 0' ]`,
        });
    });
  });
});
