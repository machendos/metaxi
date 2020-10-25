require('ts-node/register');

export default {
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: process.env.METAXI_DATABASE_USER,
    password: process.env.METAXI_DATABASE_PASSWORD,
    database: 'metaxi',
    git,
  },
  migrations: {
    directory: __dirname + '/src/db/migrations',
    disableMigrationsListValidation: true,
  },
  seeds: {
    directory: __dirname + '/src/db/seeds',
  },
};
