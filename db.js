var pg = require('pg');
var config = require('./config.json');

var pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL || config.databaseURL || 'postgres://cigars:cigars123@localhost:5432/cigarsbaseball'
});

module.exports = pool;
