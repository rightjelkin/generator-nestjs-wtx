export default {
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT),
  logging: process.env.DB_LOGGING === 'true',
  entities: process.env.DB_ENTITIES.split(','),
  migrationsRun: process.env.DB_MIGRATIONS_RUN === 'true',
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
};
