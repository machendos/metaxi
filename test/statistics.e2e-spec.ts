import * as request from 'supertest';
import initDBAndFeelByFixtures from '../src/db/ss';
import * as knex from '../src/db/knex';

const APP_URL = 'http://localhost:3000';

describe('Get statistics (e2e)', () => {
  beforeEach(async () => {
    await initDBAndFeelByFixtures();
  });

  afterAll(async done => {
    knex.default.destroy();
    done();
  });

  describe('count', () => {
    it('/statistics/count (Get)', async () => {
      for (let order = 1; order < 21; order++) {
        await request(APP_URL)
          .post('/order')
          .send({ clientId: 1, fromId: 2, toId: 7 });
        await request(APP_URL)
          .post('/order/start')
          .send({ orderId: order });
        await request(APP_URL)
          .post('/order/finish')
          .send({ orderId: order });
      }
      // We have totally 9 drivers. Made 20 request. So, first and second
      // drivers will have 3 orders.Other will have 2 orders
      await request(APP_URL)
        .get('/statistics/count/1')
        .expect({ driverId: '1', ordersCount: '3' });
      return request(APP_URL)
        .get('/statistics/count/3')
        .expect({ driverId: '3', ordersCount: '2' });
    });
  });

  describe('averageTime', () => {
    it('/statistics/count (Get)', async () => {
      const times = [];
      for (let order = 1; order < 21; order++) {
        await request(APP_URL)
          .post('/order')
          .send({ clientId: 1, fromId: 2, toId: 7 });
        const startTime = await request(APP_URL)
          .post('/order/start')
          .send({ orderId: order });
        const finishTime = await request(APP_URL)
          .post('/order/finish')
          .send({ orderId: order });
        if (order % 9 === 1)
          times.push(
            Date.parse(finishTime.body.orderFinishTime) -
              Date.parse(startTime.body.orderStartTime),
          );
      }
      return request(APP_URL)
        .get('/statistics/averageTime/1')
        .expect({
          driverId: '1',
          averageRoadTime: {
            milliseconds:
              Math.round(
                (times.reduce((prev, cur) => prev + cur) / times.length) * 1000,
              ) / 1000,
          },
        });
    });
  });
  describe('cost', () => {
    it('/statistics/cost (Get)', async () => {
      const times = [];
      for (let order = 1; order < 21; order++) {
        await request(APP_URL)
          .post('/order')
          .send({ clientId: 1, fromId: 2, toId: 7 });
        const startTime = await request(APP_URL)
          .post('/order/start')
          .send({ orderId: order });
        const finishTime = await request(APP_URL)
          .post('/order/finish')
          .send({ orderId: order });
        if (order % 9 === 1)
          times.push(
            ((Date.parse(finishTime.body.orderFinishTime) -
              Date.parse(startTime.body.orderStartTime)) /
              1000) *
              0.01,
          );
      }
      const result = await request(APP_URL).get('/statistics/cost/1');
      return expect(Math.round(result.body.totalCost * 100000) / 100000).toBe(
        Math.round(times.reduce((prev, cur) => prev + cur) * 100000) / 100000,
      );
    });
  });
  describe('frequentDestination', () => {
    it('/statistics/frequentDestination (Get)', async () => {
      for (let order = 1; order < 21; order++) {
        await request(APP_URL)
          .post('/order')
          .send({ clientId: 1, fromId: 2, toId: 7 });
        await request(APP_URL)
          .post('/order/start')
          .send({ orderId: order });
        await request(APP_URL)
          .post('/order/finish')
          .send({ orderId: order });
      }
      const result = await request(APP_URL).get(
        '/statistics/frequentDestination/1',
      );
      return expect(result.body).toEqual({
        driverId: '1',
        toPointId: 7,
        count: '3',
        pointTitle: '19-a, Petra Zaporozhtsia Street',
      });
    });
  });
});
