import * as Knex from 'knex';
import {
  ClientStatuses,
  DriverStatuses,
  OrderStatuses,
} from '../../helpers/enums';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('client', table => {
      table.increments('clientId');
      table.string('clientName');
      table
        .enum('status', [
          ClientStatuses.Free,
          ClientStatuses.WaitForDriver,
          ClientStatuses.InTheCar,
        ])
        .defaultTo(DriverStatuses.Free);
    })
    .createTable('driver', table => {
      table.increments('driverId');
      table.string('driverName');
      table
        .enum('status', [
          DriverStatuses.Free,
          DriverStatuses.FulfillsOrder,
          DriverStatuses.TookOrder,
        ])
        .defaultTo(DriverStatuses.Free);
    })
    .createTable('point', table => {
      table.increments('pointId');
      table.string('pointTitle');
    })
    .createTable('order', table => {
      table.increments('orderId');
      table
        .integer('clientId')
        .references('clientId')
        .inTable('client');
      table
        .integer('driverId')
        .references('driverId')
        .inTable('driver');
      table
        .integer('fromPointId')
        .references('pointId')
        .inTable('point');
      table
        .integer('toPointId')
        .references('pointId')
        .inTable('point');
      table.timestamp('orderStartTime');
      table.specificType('duration', 'interval');
      table.float('cost');
      table.enum('status', [
        OrderStatuses.New,
        OrderStatuses.InProgress,
        OrderStatuses.Canceled,
        OrderStatuses.Finished,
      ]);
      table.text('cancellReason').defaultTo(null);
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTable('order')
    .dropTable('client')
    .dropTable('driver')
    .dropTable('point');
}
