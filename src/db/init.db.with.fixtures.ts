import knex from './knex';

export default async () => {
  await knex.migrate.rollback();
  await knex.migrate.latest();
  await knex.seed.run();
};
