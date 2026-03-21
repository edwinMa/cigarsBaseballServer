var config = require('./config.json');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var bcrypt = require('bcryptjs');
var path = require('path');
var fs = require('fs');
var app = express();

var pg = require('pg');
var pool = require('./db');

var debug = require('./debug');

var ScheduleDB = require('./scheduleDB');

CigarsServer = {};
CigarsServer.ListenPort = config.listenPort;
CigarsServer.JSONSpacing = config.jsonSpacing;
CigarsServer.Fields = require('./fields');
CigarsServer.Roster = require('./roster');
CigarsServer.Stats = require('./stats');
CigarsServer.StatsFile = config.statsFile;

debug("opening statistics file: " + CigarsServer.StatsFile);
var fileDataArray = fs.readFileSync(CigarsServer.StatsFile).toString().split("\n");
CigarsServer.Stats.processStatsFile(fileDataArray);

CigarsServer.TeamSnapClientID = config.teamSnapClientID;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
    secret: process.env.SESSION_SECRET || config.sessionSecret || 'cigars-baseball-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === 'production'
    },
    proxy: process.env.NODE_ENV === 'production'
}));

if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

/*
 ** Public API Routes
 */

app.get('/cigarsbaseball', function (request, response) {
    response.send("Hello, it's a Cigars Baseball World");
});

app.get('/cigarsbaseball/db', function (request, response) {
    debug("trying to connect to postgres db");
    pool.query('SELECT NOW()', function (err, result) {
        if (err) {
            debug("query error " + err);
            response.send("Query Error " + err);
        } else {
            debug("database query successful");
            response.send("database query successful... " + JSON.stringify(result.rows));
        }
    });
});

app.get('/cigarsbaseball/fields/', function (request, response) {
    debug("requesting fields...");
    var result = JSON.stringify(CigarsServer.Fields.getFields(), null, CigarsServer.JSONSpacing);
    response.send(result);
});

app.get('/cigarsbaseball/schedule/', async function (request, response) {
    try {
        debug("requesting schedule...");
        var year = request.query.year ? parseInt(request.query.year) : null;
        var schedule = await ScheduleDB.getSchedule(year);
        var result = JSON.stringify(schedule ? schedule.events : [], null, CigarsServer.JSONSpacing);
        response.send(result);
    } catch (err) {
        debug("schedule error: " + err);
        response.status(500).send(JSON.stringify({ error: "Failed to fetch schedule" }));
    }
});

app.get('/cigarsbaseball/schedule/years', async function (request, response) {
    try {
        var years = await ScheduleDB.getAvailableYears();
        response.send(JSON.stringify(years, null, CigarsServer.JSONSpacing));
    } catch (err) {
        response.status(500).send(JSON.stringify({ error: "Failed to fetch years" }));
    }
});

app.get('/cigarsbaseball/record/', async function (request, response) {
    try {
        debug("requesting record...");
        var year = request.query.year ? parseInt(request.query.year) : null;
        var record = await ScheduleDB.getRecord(year);
        response.send(JSON.stringify(record, null, CigarsServer.JSONSpacing));
    } catch (err) {
        debug("record error: " + err);
        response.status(500).send(JSON.stringify({ error: "Failed to fetch record" }));
    }
});

app.get('/cigarsbaseball/nextgame/', async function (request, response) {
    try {
        debug("requesting next game...");
        var year = request.query.year ? parseInt(request.query.year) : null;
        var game = await ScheduleDB.getNextGame(year);
        response.send(JSON.stringify(game, null, CigarsServer.JSONSpacing));
    } catch (err) {
        debug("next game error: " + err);
        response.status(500).send(JSON.stringify({ error: "Failed to fetch next game" }));
    }
});

app.get('/cigarsbaseball/prevgame/', async function (request, response) {
    try {
        debug("requesting previous game...");
        var year = request.query.year ? parseInt(request.query.year) : null;
        var game = await ScheduleDB.getPrevGame(year);
        response.send(JSON.stringify(game, null, CigarsServer.JSONSpacing));
    } catch (err) {
        debug("prev game error: " + err);
        response.status(500).send(JSON.stringify({ error: "Failed to fetch previous game" }));
    }
});

app.get('/cigarsbaseball/roster/', function (request, response) {
    debug("requesting roster...");
    var result = JSON.stringify(CigarsServer.Roster.getRoster(), null, CigarsServer.JSONSpacing);
    response.send(result);
});

app.get('/cigarsbaseball/stats/', function (request, response) {
    debug("requesting stats...");
    var result = JSON.stringify(CigarsServer.Stats.getStats(), null, CigarsServer.JSONSpacing);
    response.send(result);
});

app.get('/cigarsbaseball/tophitter/', function (request, response) {
    debug("requesting top hitter...");
    var result = JSON.stringify(CigarsServer.Stats.getTopHitter(), null, CigarsServer.JSONSpacing);
    response.send(result);
});

app.get('/cigarsbaseball/toppitcher/', function (request, response) {
    debug("requesting top pitcher...");
    var result = JSON.stringify(CigarsServer.Stats.getTopPitcher(), null, CigarsServer.JSONSpacing);
    response.send(result);
});


/*
 ** Admin Authentication Middleware
 */

function requireAuth(req, res, next) {
    if (req.session && req.session.adminUser) {
        next();
    } else {
        res.redirect('/admin/login');
    }
}

/*
 ** Admin Routes
 */

app.get('/admin/login', function (req, res) {
    if (req.session && req.session.adminUser) {
        return res.redirect('/admin/dashboard');
    }
    res.render('login', { error: null });
});

app.post('/admin/login', async function (req, res) {
    try {
        var username = req.body.username;
        var password = req.body.password;

        var result = await pool.query('SELECT * FROM admin_users WHERE username = $1', [username]);
        if (result.rows.length === 0) {
            return res.render('login', { error: 'Invalid username or password' });
        }

        var user = result.rows[0];
        var valid = bcrypt.compareSync(password, user.password_hash);
        if (!valid) {
            return res.render('login', { error: 'Invalid username or password' });
        }

        req.session.adminUser = { id: user.id, username: user.username };
        res.redirect('/admin/dashboard');
    } catch (err) {
        debug("login error: " + err);
        res.render('login', { error: 'An error occurred. Please try again.' });
    }
});

app.get('/admin/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/admin/login');
});

app.get('/admin/dashboard', requireAuth, async function (req, res) {
    try {
        var years = await ScheduleDB.getAvailableYears();
        var selectedYear = req.query.year ? parseInt(req.query.year) : null;

        if (!selectedYear) {
            selectedYear = await ScheduleDB.getCurrentOrMostRecentYear();
        }

        if (!selectedYear && years.length > 0) {
            selectedYear = years[0];
        }

        var schedule = selectedYear ? await ScheduleDB.getScheduleByYear(selectedYear) : null;
        var events = schedule ? schedule.events : [];
        var record = selectedYear ? await ScheduleDB.getRecord(selectedYear) : { wins: 0, losses: 0, ties: 0 };

        res.render('admin', {
            username: req.session.adminUser.username,
            years: years,
            selectedYear: selectedYear || new Date().getFullYear(),
            events: events,
            record: record,
            message: req.query.message || null,
            error: req.query.error || null
        });
    } catch (err) {
        debug("dashboard error: " + err);
        res.render('admin', {
            username: req.session.adminUser.username,
            years: [],
            selectedYear: new Date().getFullYear(),
            events: [],
            record: { wins: 0, losses: 0, ties: 0 },
            message: null,
            error: 'Failed to load dashboard: ' + err.message
        });
    }
});

app.post('/admin/events/add', requireAuth, async function (req, res) {
    try {
        var year = parseInt(req.body.year);
        var seasonId = await ScheduleDB.getSeasonId(year);
        if (!seasonId) {
            return res.redirect('/admin/dashboard?year=' + year + '&error=Season not found');
        }
        var maxOrder = await ScheduleDB.getMaxSortOrder(seasonId);
        await ScheduleDB.addEvent(seasonId, {
            date: req.body.date,
            time: req.body.time,
            field: req.body.field,
            opponent: req.body.opponent,
            result: req.body.result,
            note: req.body.note,
            eviteURL: req.body.eviteURL
        }, maxOrder + 1);
        res.redirect('/admin/dashboard?year=' + year + '&message=Event added successfully');
    } catch (err) {
        debug("add event error: " + err);
        res.redirect('/admin/dashboard?year=' + req.body.year + '&error=Failed to add event');
    }
});

app.post('/admin/events/edit', requireAuth, async function (req, res) {
    try {
        var year = parseInt(req.body.year);
        await ScheduleDB.updateEvent(parseInt(req.body.eventId), {
            date: req.body.date,
            time: req.body.time,
            field: req.body.field,
            opponent: req.body.opponent,
            result: req.body.result,
            note: req.body.note,
            eviteURL: req.body.eviteURL
        });
        res.redirect('/admin/dashboard?year=' + year + '&message=Event updated successfully');
    } catch (err) {
        debug("edit event error: " + err);
        res.redirect('/admin/dashboard?year=' + req.body.year + '&error=Failed to update event');
    }
});

app.post('/admin/events/delete', requireAuth, async function (req, res) {
    try {
        var year = parseInt(req.body.year);
        await ScheduleDB.deleteEvent(parseInt(req.body.eventId));
        res.redirect('/admin/dashboard?year=' + year + '&message=Event deleted successfully');
    } catch (err) {
        debug("delete event error: " + err);
        res.redirect('/admin/dashboard?year=' + req.body.year + '&error=Failed to delete event');
    }
});

app.post('/admin/seasons/create', requireAuth, async function (req, res) {
    try {
        var year = parseInt(req.body.year);
        await ScheduleDB.createSeason(year);
        res.redirect('/admin/dashboard?year=' + year + '&message=Season ' + year + ' created successfully');
    } catch (err) {
        debug("create season error: " + err);
        if (err.message && err.message.indexOf('duplicate') > -1) {
            res.redirect('/admin/dashboard?error=Season already exists');
        } else {
            res.redirect('/admin/dashboard?error=Failed to create season');
        }
    }
});

app.post('/admin/seasons/delete', requireAuth, async function (req, res) {
    try {
        var year = parseInt(req.body.year);
        await ScheduleDB.deleteSeason(year);
        res.redirect('/admin/dashboard?message=Season ' + year + ' deleted successfully');
    } catch (err) {
        debug("delete season error: " + err);
        res.redirect('/admin/dashboard?error=Failed to delete season');
    }
});


/*
 ** TeamSnap functions (legacy)
 */

function teamSnapAuthenticate() {
    debug("beginning teamSnap authentication");
    var tpath = 'https://auth.teamsnap.com/oauth/authorize?';
    var responseURI = "https://edwinma.github.io/cigarsbaseball.org/stats.html";
    var queryParams = ['client_id=' + CigarsServer.TeamSnapClientID,
        'redirect_uri=' + responseURI,
        'scope=' + "read",
        'response_type=token'];
    var query = queryParams.join('&');
    var url = tpath + query;
    debug("team snap auth URL: " + url);
}

function teamSnapInitialize() {
    debug("initializing teamsnap w/ id");
}


app.listen(process.env.PORT || CigarsServer.ListenPort);
debug("ready and listening on port " + CigarsServer.ListenPort);
