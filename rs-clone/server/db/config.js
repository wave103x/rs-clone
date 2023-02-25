require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: 'postgres://clone_38aq_user:EM4REnz1xuvBlHIj6oDMZqiy8O6L1kTR@dpg-cft1v3arrk0c834202g0-a/clone_38aq',
    dialect: 'postgres',
    underscored: true,
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: 'postgres://clone_38aq_user:EM4REnz1xuvBlHIj6oDMZqiy8O6L1kTR@dpg-cft1v3arrk0c834202g0-a/clone_38aq',
    dialect: 'postgres',
    underscored: true,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: 'postgres://clone_38aq_user:EM4REnz1xuvBlHIj6oDMZqiy8O6L1kTR@dpg-cft1v3arrk0c834202g0-a/clone_38aq',
    dialect: 'postgres',
    underscored: true,
  },
};
