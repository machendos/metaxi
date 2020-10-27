import * as request from 'supertest';
import initDBAndFeelByFixtures from '../src/db/init.db.with.fixtures';
import * as knex from '../src/db/knex';

const APP_URL = 'http://localhost:3000';

describe('Start order (e2e)', () => {
  beforeAll(async () => {
    await initDBAndFeelByFixtures();
  });

  afterAll(async done => {
    knex.default.destroy();
    done();
  });

  describe('Simple', () => {
    it('/order/start (Post)', () => {
      const beforeRequest = new Date().getTime();
      return request(APP_URL)
        .post('/order')
        .send({ clientId: 5, fromId: 2, toId: 7 })
        .then(res => {
          return request(APP_URL)
            .post('/order/start')
            .send({ orderId: res.body.orderId })
            .then(res => {
              const startTime = Date.parse(res.body.orderStartTime);
              const now = new Date().getTime();
              expect(startTime).toBeGreaterThan(beforeRequest);
              expect(startTime).toBeLessThan(now);
            });
        });
    });
  });

  describe('Order not found', () => {
    it('/order/start (Post)', () => {
      return request(APP_URL)
        .post('/order')
        .send({ clientId: 6, fromId: 2, toId: 7 })
        .then(() => {
          request(APP_URL)
            .post('/order/start')
            .send({ orderId: 2 })
            .expect({
              error: true,
              reason: 'order not found',
              code: 6,
              description:
                'Order with ID=2 not found in DB. Plese create it before',
            });
        });
    });
  });
  describe('Incorrect order status (order status is not "new", before starting)', () => {
    it('/order/start (Post)', async () => {
      await request(APP_URL)
        .post('/order')
        .send({ clientId: 1, fromId: 2, toId: 7 });
      await request(APP_URL)
        .post('/order/start')
        .send({ orderId: 3 });
      return request(APP_URL)
        .post('/order/start')
        .send({ orderId: 3 })
        .expect({
          error: true,
          reason: 'the order has an invalid status for this operation',
          code: 7,
          description: `For set the order status to inProgress, it must have a status new, but
    now orders status is inProgress. So you cant do this operation with this order now`,
        });
    });
  });
});
