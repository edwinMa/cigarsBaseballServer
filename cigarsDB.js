var pg = require('pg');
// var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/todo';

// constants
CigarsDB = {};
CigarsDB.DEBUG = true;

function debug(message)
{
    if (CigarsDB.DEBUG)
    {
        console.log(message);
    }
}

var connectionString = 'postgres://localhost:5432/cigarsbaseball';

var client = new pg.Client(connectionString);
client.connect();

/*
** create players table
*/
var query = client.query ('CREATE TABLE players (id SERIAL PRIMARY KEY, firstname VARCHAR(32) not null, lastname VARCHAR(32) not null, number SMALLINT not null, email VARCHAR(48) not null, password VARCHAR(16) not null, birthdate DATE, mobileNumber VARCHAR(24), isActive BOOLEAN, throws VARCHAR(5))', 
	function (err, result)
	{
		if (err)
		{
			debug ("CREATE TABLE players error-> " + err);	
		}
		else
		{
			debug ("players table created");
		}
	});


/*
** create fields table
*/
//Field("Lakeside High School", "lakeside", 33.8453, -84.2848, "3801 Briarcliff Rd NE, Atlanta, GA 30345"),
var query = client.query ('CREATE TABLE fields (id SERIAL PRIMARY KEY, fullname VARCHAR(64) not null, shortname VARCHAR(16) not null, address VARCHAR(64) not null, long REAL not null, lat REAL not null)',
	function (err, result)
	{
		if (err)
		{
			debug ("CREATE TABLE players error-> " + err);	
		}
		else
		{
			debug ("fields table created");
		}
	});

/*
** create opponents table
*/
var query = client.query ('CREATE TABLE teams (id SERIAL PRIMARY KEY, name VARCHAR(64) not null)',
	function (err, result)
	{
		if (err)
		{
			debug ("CREATE TABLE opponents error-> " + err);	
		}
		else
		{
			debug ("teams table created");
		}
	});

/*
** create schedule table
*/
//"March 22", "4 PM", "Lakeside HS", "Tigers", "Rained Out", "Scrimmage Game"
var query = client.query ('CREATE TABLE schedule (eventid SERIAL PRIMARY KEY, eventDate DATE not null, eventTime TIME not null, fieldId integer REFERENCES fields (id), opponentId integer REFERENCES teams(id), result VARCHAR(16), note VARCHAR(128))',
	function (err, result)
	{
		if (err)
		{
			debug ("CREATE TABLE schedule error-> " + err);	
		}
		else
		{
			debug ("schedule table created");
		}
	});


query.on('end', function() { client.end(); });
