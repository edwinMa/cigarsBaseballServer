var pool = require('./db');
var debug = require('./debug');

var ScheduleDB = {

    getAvailableYears: async function () {
        var result = await pool.query('SELECT year FROM seasons ORDER BY year DESC');
        return result.rows.map(function (r) { return r.year; });
    },

    getScheduleByYear: async function (year) {
        var seasonResult = await pool.query('SELECT id, year FROM seasons WHERE year = $1', [year]);
        if (seasonResult.rows.length === 0) {
            return null;
        }
        var season = seasonResult.rows[0];
        var eventsResult = await pool.query(
            'SELECT id, event_date, event_time, field, opponent, result, note, evite_url, sort_order FROM schedule_events WHERE season_id = $1 ORDER BY sort_order ASC',
            [season.id]
        );
        return {
            year: season.year,
            events: eventsResult.rows.map(function (r) {
                return {
                    id: r.id,
                    date: r.event_date,
                    time: r.event_time,
                    field: r.field,
                    opponent: r.opponent,
                    result: r.result,
                    note: r.note,
                    eviteURL: r.evite_url
                };
            })
        };
    },

    getCurrentOrMostRecentYear: async function () {
        var currentYear = new Date().getFullYear();
        var result = await pool.query(
            'SELECT year FROM seasons WHERE year <= $1 ORDER BY year DESC LIMIT 1',
            [currentYear]
        );
        if (result.rows.length === 0) {
            var fallback = await pool.query('SELECT year FROM seasons ORDER BY year DESC LIMIT 1');
            return fallback.rows.length > 0 ? fallback.rows[0].year : null;
        }
        return result.rows[0].year;
    },

    getSchedule: async function (year) {
        var targetYear = year;
        if (!targetYear) {
            targetYear = await ScheduleDB.getCurrentOrMostRecentYear();
        }
        if (!targetYear) return { year: null, events: [] };
        return await ScheduleDB.getScheduleByYear(targetYear);
    },

    getNextGame: async function (year) {
        var schedule = await ScheduleDB.getSchedule(year);
        if (!schedule) return null;
        var games = schedule.events;
        for (var j = 0; j < games.length; j++) {
            if (games[j].result === '' && games[j].opponent !== 'No Game') {
                return games[j];
            }
        }
        return null;
    },

    getPrevGame: async function (year) {
        var schedule = await ScheduleDB.getSchedule(year);
        if (!schedule) return null;
        var games = schedule.events;
        for (var j = 0; j < games.length; j++) {
            if (games[j].result === '' && games[j].opponent !== 'No Game') {
                for (var k = j - 1; k >= 0; k--) {
                    if (games[k].result !== '' && games[k].opponent !== 'No Game') {
                        return games[k];
                    }
                }
                return null;
            }
        }
        return null;
    },

    getRecord: async function (year) {
        var schedule = await ScheduleDB.getSchedule(year);
        if (!schedule) return { year: null, wins: 0, losses: 0, ties: 0 };
        var games = schedule.events;
        var record = { year: schedule.year, wins: 0, losses: 0, ties: 0 };
        for (var j = 0; j < games.length; j++) {
            if (games[j].result.indexOf('W') > -1) {
                record.wins++;
            } else if (games[j].result.indexOf('L') > -1) {
                record.losses++;
            } else if (games[j].result.indexOf('T') > -1) {
                record.ties++;
            }
        }
        return record;
    },

    addEvent: async function (seasonId, eventData, sortOrder) {
        var result = await pool.query(
            'INSERT INTO schedule_events (season_id, event_date, event_time, field, opponent, result, note, evite_url, sort_order) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [seasonId, eventData.date, eventData.time || '', eventData.field || '', eventData.opponent || '', eventData.result || '', eventData.note || '', eventData.eviteURL || '', sortOrder]
        );
        return result.rows[0];
    },

    updateEvent: async function (eventId, eventData) {
        var result = await pool.query(
            'UPDATE schedule_events SET event_date = $1, event_time = $2, field = $3, opponent = $4, result = $5, note = $6, evite_url = $7 WHERE id = $8 RETURNING *',
            [eventData.date, eventData.time || '', eventData.field || '', eventData.opponent || '', eventData.result || '', eventData.note || '', eventData.eviteURL || '', eventId]
        );
        return result.rows[0];
    },

    deleteEvent: async function (eventId) {
        var result = await pool.query('DELETE FROM schedule_events WHERE id = $1 RETURNING *', [eventId]);
        return result.rows[0];
    },

    createSeason: async function (year) {
        var result = await pool.query(
            'INSERT INTO seasons (year) VALUES ($1) RETURNING *',
            [year]
        );
        return result.rows[0];
    },

    deleteSeason: async function (year) {
        var seasonResult = await pool.query('SELECT id FROM seasons WHERE year = $1', [year]);
        if (seasonResult.rows.length === 0) return null;
        var seasonId = seasonResult.rows[0].id;
        await pool.query('DELETE FROM schedule_events WHERE season_id = $1', [seasonId]);
        await pool.query('DELETE FROM seasons WHERE id = $1', [seasonId]);
        return { year: year };
    },

    getSeasonId: async function (year) {
        var result = await pool.query('SELECT id FROM seasons WHERE year = $1', [year]);
        return result.rows.length > 0 ? result.rows[0].id : null;
    },

    getMaxSortOrder: async function (seasonId) {
        var result = await pool.query(
            'SELECT COALESCE(MAX(sort_order), -1) as max_order FROM schedule_events WHERE season_id = $1',
            [seasonId]
        );
        return result.rows[0].max_order;
    }
};

module.exports = ScheduleDB;
