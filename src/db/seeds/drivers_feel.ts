import * as Knex from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('driver').insert([
    { driverName: 'Xavier Vu' },
    { driverName: 'Yanis Medina' },
    { driverName: 'Owen Bradford' },
    { driverName: 'Will Mccann' },
    { driverName: 'Hector Frost' },
    { driverName: 'Jemma Metcalfe' },
    { driverName: 'Maleeha Knapp' },
    { driverName: 'Ruby-Rose Rich' },
    { driverName: 'Beatriz Goldsmith' },
  ]);
}
