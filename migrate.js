var pool = require('./db');

async function migrate() {
    var client = await pool.connect();
    try {
        await client.query('BEGIN');

        await client.query(`
            CREATE TABLE IF NOT EXISTS seasons (
                id SERIAL PRIMARY KEY,
                year INTEGER NOT NULL UNIQUE
            )
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS schedule_events (
                id SERIAL PRIMARY KEY,
                season_id INTEGER NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
                event_date VARCHAR(64) NOT NULL,
                event_time VARCHAR(32) NOT NULL DEFAULT '',
                field VARCHAR(128) NOT NULL DEFAULT '',
                opponent VARCHAR(128) NOT NULL DEFAULT '',
                result VARCHAR(64) NOT NULL DEFAULT '',
                note VARCHAR(256) NOT NULL DEFAULT '',
                evite_url VARCHAR(512) NOT NULL DEFAULT '',
                sort_order INTEGER NOT NULL DEFAULT 0
            )
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS admin_users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(64) NOT NULL UNIQUE,
                password_hash VARCHAR(128) NOT NULL
            )
        `);

        await client.query('COMMIT');
        console.log('Migration completed successfully');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Migration failed:', err);
        throw err;
    } finally {
        client.release();
    }
}

if (require.main === module) {
    migrate().then(function () {
        process.exit(0);
    }).catch(function () {
        process.exit(1);
    });
}

module.exports = migrate;
