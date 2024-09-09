import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize("pizzaria-bot", "postgres", "56989771gui", {
  host: "localhost",
  dialect: 'postgres',
  timezone: '-03:00',
  logging: console.log
});

export default sequelize;
