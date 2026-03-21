var pg = require('pg');
var config = require('./config.json');

var connectionString = process.env.DATABASE_URL || config.databaseURL || 'postgres://cigars:cigars123@localhost:5432/cigarsbaseball';

var poolConfig = {
    connectionString: connectionString
};

if (process.env.DATABASE_URL) {
    poolConfig.ssl = { rejectUnauthorized: false };
}

var pool = new pg.Pool(poolConfig);

module.exports = pool;
