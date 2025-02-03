module.exports = {
  development: {
    client: 'pg', // Using PostgreSQL
    connection: {
      host: '127.0.0.1',
      user: 'postgres',
      password: '1234',
      database: 'openai',
      charset: 'utf8',
    },
    migrations: {
      directory: './src/database/migrations',
    },
    seeds: {
      directory: './src/database/seeds',
    },
  },
};
