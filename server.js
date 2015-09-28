var express = require('express');

var app = express();

// constants
CigarsServer = {};
CigarsServer.DEBUG = true;
CigarsServer.ListenPort = 3000;
CigarsServer.JSONSpacing = 4;
CigarsServer.Schedule = createSchedule();
CigarsServer.Schedule2 = createSchedule2();
CigarsServer.Locations = new Locations();
CigarsServer.Roster = createRoster();


function debug(message)
{
    if (CigarsServer.DEBUG)
    {
        console.log(message);
    }
}

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

/*
 ** Begin JSON Restful API Calls
 */

app.get('/', function(request, response)
{
    response.send("Hello, it's a Cigars Baseball World");
});


app.get('/cigarsbaseball/fields/', function(request, response)
{
    debug("requesting fields...");

    var result = JSON.stringify(CigarsServer.Locations.getFields(), null, CigarsServer.JSONSpacing);

    response.send(result);
});

app.get('/cigarsbaseball/schedule/', function(request, response)
{
    debug("requesting schedule...");

    var result = JSON.stringify(CigarsServer.Schedule.getSchedule(), null, CigarsServer.JSONSpacing);
    response.send(result);
});

app.get('/cigarsbaseball/schedule2/', function(request, response)
{
    debug("requesting schedule...");

    var result = JSON.stringify(CigarsServer.Schedule2.getSchedule(), null, CigarsServer.JSONSpacing);

    response.send(result);
});

app.get('/cigarsbaseball/nextgame/', function(request, response)
{
    debug("requesting next game...");

    var result = JSON.stringify(CigarsServer.Schedule.getNextGame(), null, CigarsServer.JSONSpacing);

    response.send(result);
});

app.get('/cigarsbaseball/prevgame/', function(request, response)
{
    debug("requesting previous game...");

    var result = JSON.stringify(CigarsServer.Schedule.getPrevGame(), null, CigarsServer.JSONSpacing);

    response.send(result);
});

app.get('/cigarsbaseball/roster/', function(request, response)
{
    debug("requesting roster...");
    var result = JSON.stringify(CigarsServer.Roster.getRoster(), null, CigarsServer.JSONSpacing);
    response.send(result);
});
/*
 ** End JSON API Calls
 */


function Field (name, id, lat, long, address)
{
    this.name = name;
    this.id = id;
    this.lat = lat;
    this.long = long;
    this.marker = null;
    this.address = address;

}

function Locations()
{

    this.fields = [
        new Field("Lakeside High School", "lakeside", 33.8453, -84.2848, "3801 Briarcliff Rd NE, Atlanta, GA 30345"),
        new Field("Tucker High School", "tucker", 33.856215, -84.215753, "5036 Lavista Rd, Tucker, GA 30084"),
        new Field("Shamrock - AKA Druid Hills Middle School", "shamrock", 33.81914, -84.274298, "3100 Mt Olive Dr, Decatur, GA 30033"),
        new Field("North Cobb High School", "northCobb", 34.0409756, -84.6483621, "3601 Nowlin Rd, Kennesaw, GA 30144"),
        new Field("Osborne High School", "osborne", 33.89208, -84.565659, "2451 Favor Rd SW, Marietta, GA 30060"),
        new Field("Oglethorpe University", "oglethorpe", 33.8750, -84.3330, "4484 Peachtree Rd, Atlanta, GA 30319"),
        new Field("Holy Spirit Catholic Church", "holySpirit", 33.877268, -84.411387, "4465 Northside Dr NW, Atlanta, GA 30327"),
        new Field("Lithia Springs High School", "lithiaSprings", 33.755571, -84.657863, "2520 E County Line Rd, Lithia Springs, GA 30122"),
        new Field("Dunwoody High School", "dunwoody", 33.9452548, -84.314946, "5035 Vermack Rd, Dunwoody, GA 30338"),
        new Field("Grand Slam Golf & Baseball", "grandSlamCage", 33.812883, -84.29490, "3352 N Druid Hills Rd, Decatur, GA 30033")
    ];

    this.getFields = function()
    {
        var result = this.fields;
        debug(result);
        return (result);
    }

}

/*
 ** function to create a schedule item
 */
function Event(date, time, field, opponent, result, note)
{
    this.date = date;
    this.time = time;
    this.opponent = opponent;
    this.field = field;
    this.result = result;
    this.note = note;
}

function createEvent(date, time, field, opponent, result, note)
{
    return {
        date: date,
        time: time,
        opponent: opponent,
        field: field,
        result: result,
        note: note
    };
}


function createSchedule()
{
    var events = [
        createEvent("March 22", "4 PM", "Lakeside HS", "Tigers", "Rained Out", "Scrimmage Game"),
        createEvent("March 29", "4 PM", "North Cobb HS", "@Cherokees", "L 13-14", "Opening Day"),
        createEvent("April 5", "", "", "No Game", "", "Easter Sunday"),
        createEvent("April 12", "1205 PM", "Lithia Springs HS", "McBluv", "L 17-5", ""),
        createEvent("April 19", "4 PM", "Shamrock", "Giants", "Postponed", "Rain"),
        createEvent("April 26", "12 PM", "Shamrock", "Dragons", "L 24-5", ""),
        createEvent("May 3", "4 PM", "Shamrock", "@Barracudas", "L 11-6", "", ""),
        createEvent("May 10", "", "", "No Game", "", "Mother's Day"),
        createEvent("May 17", "12 PM", "Lakeside HS", "@Mudcats", "W 14-1", ""),
        createEvent("May 24", "", "", "No Game", "", "Memorial Day"),
        createEvent("May 31", "4 PM", "Shamrock", "Indians", "L 17-14", ""),
        createEvent("June 7", "12 PM", "Shamrock", "Cherokees", "L 13-5", ""),
        createEvent("June 14", "12 PM", "Dunwoody", "@McBluv", "W 9-0", "ff"),
        createEvent("June 21", "4 PM", "Dunwoody", "@Giants", "L 19-2", "Father's Day"),
        createEvent("June 28", "12 PM", "Oglethorpe U.", "@Dragons", "W 14-9", ""),
        createEvent("July 5", "", "", "No Game", "", "July 4th Weekend"),
        createEvent("July 12", "4 PM", "Shamrock", "Barracudas", "L 8-3", ""),
        createEvent("July 19", "12 PM", "Lakeside HS", "Mudcats", "T 6-6", ""),
        createEvent("July 26", "12 PM", "Shamrock", "@Indians", "W 15-2", ""),
        createEvent("Aug 2", "12 PM", "Lithia Springs HS", "McBluv", "W 9-0", "ff"),
        createEvent("Aug 9", "140 PM ", "Campbell Middle School", "Giants", "L 10-0", ""),
        createEvent("Aug 9", "11 AM", "Campbell Middle School", "@Giants", "L 6-8", "4/19 Make up game"),
        createEvent("Aug 16", "12 PM", "Lakeside HS", "@Mudcats", "L 10-15", ""),
        createEvent("Aug 23", "4PM", "Lakeside HS", "Indians", "Postponed", "Rain"),
        createEvent("Aug 30", "4PM", "Lakeside HS", "Indians", "Rained Out", "4/23 make up game"),
        createEvent("Sept 7", "", "", "No Game", "", "Labor Day Weekend"),
        createEvent("Sep 12", "10 AM", "North Cobb", "@Cherokees", "L 0-1", "Playoff Game 1"),
        createEvent("Sep 12", "1 PM", "North Cobb", "Cherokees", "L 6-0", "Playoff Game 2"),
        createEvent("March 2016", "TBD", " TBD", "TBD", "", "")
    ];

    //debug (events[2].getNote());

    return {
        getSchedule: function()
        {
            debug  ("returning schedule...");
            debug (events);
            return (events);
        }
    }; // end return object
}


function createSchedule2()
{
    var events = [
        new Event ("March 22", "4 PM", "Lakeside HS", "Tigers", "Rained Out", "Scrimmage Game"),
        new Event ("March 29", "4 PM", "North Cobb HS", "@Cherokees", "L 13-14", "Opening Day"),
        new Event ("April 5", "", "", "No Game", "", "Easter Sunday"),
        new Event ("April 12", "1205 PM", "Lithia Springs HS", "McBluv", "L 17-5", ""),
        new Event ("April 19", "4 PM", "Shamrock", "Giants", "Postponed", "Rain"),
        new Event ("April 26", "12 PM", "Shamrock", "Dragons", "L 24-5", ""),
        new Event ("May 3", "4 PM", "Shamrock", "@Barracudas", "L 11-6", "", ""),
        new Event ("May 10", "", "", "No Game", "", "Mother's Day"),
        new Event ("May 17", "12 PM", "Lakeside HS", "@Mudcats", "W 14-1", ""),
        new Event ("May 24", "", "", "No Game", "", "Memorial Day"),
        new Event ("May 31", "4 PM", "Shamrock", "Indians", "L 17-14", ""),
        new Event ("June 7", "12 PM", "Shamrock", "Cherokees", "L 13-5", ""),
        new Event ("June 14", "12 PM", "Dunwoody", "@McBluv", "W 9-0", "ff"),
        new Event ("June 21", "4 PM", "Dunwoody", "@Giants", "L 19-2", "Father's Day"),
        new Event ("June 28", "12 PM", "Oglethorpe U.", "@Dragons", "W 14-9", ""),
        new Event ("July 5", "", "", "No Game", "", "July 4th Weekend"),
        new Event ("July 12", "4 PM", "Shamrock", "Barracudas", "L 8-3", ""),
        new Event ("July 19", "12 PM", "Lakeside HS", "Mudcats", "T 6-6", ""),
        new Event ("July 26", "12 PM", "Shamrock", "@Indians", "W 15-2", ""),
        new Event ("Aug 2", "12 PM", "Lithia Springs HS", "McBluv", "W 9-0", "ff"),
        new Event ("Aug 9", "140 PM ", "Campbell Middle School", "Giants", "L 10-0", ""),
        new Event ("Aug 9", "11 AM", "Campbell Middle School", "@Giants", "L 6-8", "4/19 Make up game"),
        new Event ("Aug 16", "12 PM", "Lakeside HS", "@Mudcats", "L 10-15", ""),
        new Event ("Aug 23", "4PM", "Lakeside HS", "Indians", "Postponed", "Rain"),
        new Event ("Aug 30", "4PM", "Lakeside HS", "Indians", "Rained Out", "4/23 make up game"),
        new Event ("Sept 7", "", "", "No Game", "", "Labor Day Weekend"),
        new Event ("Sep 12", "10 AM", "North Cobb", "@Cherokees", "L 0-1", "Playoff Game 1"),
        new Event ("Sep 12", "1 PM", "North Cobb", "Cherokees", "L 6-0", "Playoff Game 2"),
        new Event ("March 2016", "TBD", " TBD", "TBD", "", "")
    ];

    //debug (events[2].getNote());

    return {
        
        getSchedule: function()
        {
            debug ("returning schedule...");
            debug (events);
            return (events);
        }

    }; // end return object
}

function Player (name, lastName, number, position, hometown, throws, bats, song, picture)
{
    this.name = name;
    this.lastName = lastName;
    this.number = number;
    this.position = position;
    this.hometown = hometown;
    this.throws = throws;
    this.bats = bats;
    this.song = song;
    this.picture = picture; 
}


function createRoster ()
{
    var players = [
                new Player ("Edwin Marcial", "Marcial", "19", "3B", "Miami, FL", "R", "S", "When Doves Cry - Prince", "images/players/19.jpg"),
                new Player ("Tom Hart", "Hart", "12", "2B/C", "Pittsfield, IL", "R", "R", "Flyin' down a back road - Justin Moore", "images/players/12.jpg"),
                new Player ("Alfredo Medina", "Medina", "34", "SS", "Ciudad Ojeda, Venezuela", "R", "R", "", ""),
                new Player ("John Little", "Little", "14", "P/1B/", "West Palm Beach, FL", "R", "R", "", "images/players/14.jpg"),
                new Player ("Colin Schaepe", "Shaepe", "37", "OF/IF", "Green Bay, WI", "R", "R", "", "images/players/37.jpg"),
                // new Player ("Justin Frobose", "Frobose", "7", "P/OF", "tbd", "R", "R", "", ""),
                // new Player ("Landon Bennet", "Bennet", "32", "OF", "Atlanta, GA", "R", "R", "", ""),
                new Player ("Rob Wodarczk", "Wodarczk", "2", "IF/OF/P", "Kernersville, NC", "R", "L", "", ""),
                new Player ("Joel Pierce", "Pierce", "13", "C", "tbd", "R", "R", "", "images/players/13.jpg"),
                new Player ("Jamie Lugo", "Lugo", "0", "2B/OF", "Newark, NJ", "R", "R", "", ""),
                new Player ("Thomas Padilla", "Padilla", "8", "1B/3B", "Norcross, GA", "R", "R", "Thunderstruck- AC/DC", "images/players/8.jpg"),
                // new Player ("Kevin Cattie", "Cattie", "3", "OF", "tbd", "L", "L", "", ""),
                new Player ("Jordan Kosterich", "Kosterich", "50", "P", "Westchester, NY", "L", "L", "", "images/players/50.jpg"),
                new Player ("Ryan Krezel", "Kretzel", "22", "OF/P", "Chicago, IL", "R", "R", "", "images/players/22.jpg"),
                new Player ("John Gentry", "Gentry", "21", "1B/P", "Charleston, SC", "R", "R", "", "images/players/21.jpg"),
                // new Player ("Ryan Holland", "Holland", "23", "SS/2B", "Atlanta, GA", "R", "L", "", "images/players/23.jpg"),
                // new Player ("Caleb Crotts", "Crotts", "XX", "C (Injured)", "McDounough, GA", "R", "R", "Radioactive - Imagine Dragons", ""),
                new Player ("Sean Lennox", "Lennox", "16", "P", "Norcross, GA", "R", "R", "Givin the Dog a Bone - AC/DC", "images/players/16.jpg"),
                new Player ("Nathan Moreau", "Moreau", "15", "P/OF", "", "L", "L", "", ""),
                new Player ("Brad May", "May", "6", "IF/OF/C", "", "R", "R", "", ""),
                // new Player ("Stephen Dodson", "Dodson", "26", "P/IF/OF", "", "R", "R", "", ""),
                // new Player ("Jeff Downer", "Downer", "27", "IF/C", "", "R", "R", "", ""),
                // new Player ("Cash Collins", "Collins", "4", "P/OF", "", "L", "L", "", "images/players/4.jpg"),
                new Player ("Peter Verdin", "Verdin", "39", "OF/P", "", "R", "R", "", ""),
                // new Player ("Blake Dieterich", "Dieterich", "51", "OF/P", "", "L", "L", "", "")
            ];

    return {
        getRoster: function()
        {
            debug ("returning roster...");
            debug (players);
            return (players);
        }
    }; // end return object
}


app.listen(CigarsServer.ListenPort);
/*
 ** END
 */