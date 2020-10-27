import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import initDBAndFeelByFixtures from '../src/db/ss';
import * as knex from '../src/db/knex';
import { start } from 'repl';

const APP_URL = 'http://localhost:3000';

describe('Finish order (e2e)', () => {
  beforeAll(async () => {
    await initDBAndFeelByFixtures();
  });

  afterAll(async done => {
    knex.default.destroy();
    done();
  });

  describe('Simple', () => {
    it('/order/finish (Post)', async () => {
      const beforeRequest = new Date().getTime();
      const res = await request(APP_URL)
        .post('/order')
        .send({ clientId: 5, fromId: 2, toId: 7 });
      const startTime = await request(APP_URL)
        .post('/order/start')
        .send({ orderId: res.body.orderId })
        .then(res => {
          return Date.parse(res.body.orderStartTime);
        });
      return request(APP_URL)
        .post('/order/finish')
        .send({ orderId: res.body.orderId })
        .then(res => {
          const finishTime = Date.parse(res.body.orderFinishTime);
          const now = new Date().getTime();
          expect(finishTime).toBeGreaterThan(beforeRequest);
          expect(finishTime).toBeLessThan(now);
          const duration = finishTime - startTime;
          // Miliseconds to seconds and second to cost (1 second = 0.01 cost)
          expect((duration / 1000) * 0.01).toBe(res.body.cost);
        });
    });
  });

  describe('Order not found', () => {
    it('/order/finish (Post)', async () => {
      request(APP_URL)
        .post('/order/finish')
        .send({ orderId: 100 })
        .expect({
          error: true,
          reason: 'order not found',
          code: 6,
          description:
            'Order with ID=100 not found in DB. Plese create it before',
        });
    });
  });
  describe('Incorrect order status (order status is not "inProgress", before finishing)', () => {
    it('/order/finish (Post)', async () => {
      await request(APP_URL)
        .post('/order')
        .send({ clientId: 1, fromId: 2, toId: 7 });
      await request(APP_URL)
        .post('/order/start')
        .send({ orderId: 2 });
      await request(APP_URL)
        .post('/order/finish')
        .send({ orderId: 2 });
      return request(APP_URL)
        .post('/order/finish')
        .send({ orderId: 2 })
        .expect({
          error: true,
          reason: 'the order has an invalid status for this operation',
          code: 7,
          description: `For set the order status to finished, it must have a status inProgress, but
    now orders status is finished. So you cant do this operation with this order now`,
        });
    });
    it('/order/finish (Post)', async () => {
      await request(APP_URL)
        .post('/order')
        .send({ clientId: 1, fromId: 2, toId: 7 });
      return request(APP_URL)
        .post('/order/finish')
        .send({ orderId: 3 })
        .expect({
          error: true,
          reason: 'the order has an invalid status for this operation',
          code: 7,
          description: `For set the order status to finished, it must have a status inProgress, but
    now orders status is new. So you cant do this operation with this order now`,
        });
    });
  });
});
