import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  console.log(',kz');
  return knex.schema
    .createTable('client', table => {
      table.increments('client_id');
      table.string('client_name');
    })
    .createTable('driver', table => {
      table.increments('driver_id');
      table.string('driver_name');
    })
    .createTable('point', table => {
      table.increments('point_id');
      table.string('point_title');
    })
    .createTable('status', table => {
      table.increments('status_id');
      table.string('status_title');
    })
    .createTable('order', table => {
      table.increments('order_id');
      table
        .integer('client_id')
        .references('client_id')
        .inTable('client');
      table
        .integer('driver_id')
        .references('driver_id')
        .inTable('driver');
      table
        .integer('from_point_id')
        .references('point_id')
        .inTable('point');
      table
        .integer('to_point_id')
        .references('point_id')
        .inTable('point');
      table.timestamp('order_start_time');
      table.timestamp('duration');
      table.float('cost');
      table
        .integer('status_id')
        .references('status_id')
        .inTable('status');
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTable('client')
    .dropTable('driver')
    .dropTable('point')
    .dropTable('status')
    .dropTable('order');
}
