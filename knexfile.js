module.exports = {
  development: {
    client: 'pg', // Using PostgreSQL
    connection: {
      host: process.env.DB_HOST || '',
      user: process.env.DB_USER || '',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || '',
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
