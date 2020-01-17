const { join } = require('path');

require('dotenv').config({
  path: join(__dirname, '..', '.env'),
});


const config = {
  "production": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "port": process.env.DB_PORT,
    "host": process.env.DB_HOST,
  },
  "development": {
    "username": process.env.DB_LOCAL_USER,
    "password": process.env.DB_LOCAL_PASSWORD,
    "database": process.env.DB_LOCAL_NAME,
    "port": process.env.DB_LOCAL_PORT,
    "host": process.env.DB_LOCAL_HOST,
  }
};

module.exports = config;
