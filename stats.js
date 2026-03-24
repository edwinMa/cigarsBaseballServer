var debug = require ('./debug');

// check if a string contains a set of characters
function contains (aString, someCharacters)
{
    return (aString.indexOf (someCharacters) > -1);
}

function BaseballStat (statArray)
{
    // /Player,GP,AB,R,1B,2B,3B,HR,H,BB,HBP,TB,AVG,OBP,SLG,OPS,SF,RBI,SO,SB,CS
    var index = 0; 

    this.player = (statArray[index++]).toLowerCase();
    debug ("player name is: " + this.player + "*");

    var lastChar = this.player[this.player.length-1];
    debug ("last character of player name is: *" + lastChar + "*");

    if (lastChar == " ")
    {
        debug ("stripping off blank space from the end");
        this.player = (this.player.slice (0, -1)).toLowerCase(); // file includes blank space after last name so slice it off  
    }

    debug ("player name is: " + this.player + "*");

    
    this.gamesPlayed = statArray[index++];
    this.atBats = statArray[index++];
    this.runs = statArray[index++];
    this.singles = statArray[index++];
    this.doubles = statArray[index++];
    this.triples = statArray[index++];
    this.hrs = statArray[index++];
    this.hits = statArray[index++]; 
    if (this.hits == "-") this.hits = "0";

    this.walks = statArray[index++];
    this.hbp = statArray[index++];
    this.tb = statArray[index++];

    this.avg = statArray[index++];
    this.avg = this.formatBattingStat (this.avg);

    this.obp = statArray[index++];
    this.obp = this.formatBattingStat (this.obp);
            
    this.slg = statArray[index++];
    this.slg = this.formatBattingStat (this.slg);

    this.ops = statArray[index++];
    this.ops = this.formatBattingStat (this.ops);

    this.sacFly = statArray[index++]; // not used
    this.rbis = statArray[index++];
    this.ks = statArray[index++];
    this.sb = statArray[index++];
    this.cs = statArray[index++]; // not used

    // GS, IP,ER,ERA,K,WALK,HB,W,L,WP,SV,WIP,HA,WHIP
    this.gs = statArray[index++];
    this.ip = statArray[index++];
    this.er = statArray[index++];
    this.era = statArray[index++];
            
    if (contains (this.era, "-")) this.era = "0.00";
    this.era = parseFloat (this.era).toFixed(2);

    this.pitchingKs = statArray[index++];
    if (this.pitchingKs == "-") this.pitchingKs = "0";

    this.pitchingWalks = statArray[index++];
    this.hb = statArray[index++];
    this.wins = statArray[index++];
    this.losses = statArray[index++];
    this.wp = statArray[index++];
    this.sv = statArray[index++];
    this.wip = statArray[index++];
    this.ha = statArray[index++];
    this.whip = statArray[index++];
    if (contains (this.whip, "-")) this.whip = "0.00";
}

BaseballStat.prototype = {
    // set constructors 
    constructor: BaseballStat,

    formatBattingStat: function (stat)
    {
        // format the batting stats like batting average and OPS

        if (contains (stat, "-"))
        {
            stat = "0.000";
        }

        // format to remove leading 0 if less than 1.000 and show 3 decimal places
        stat = parseFloat (stat);
        stat = stat.toFixed (3);

        if ("0" == stat[0])
        {
            stat = stat.slice(1);
        }

        return (stat);
    }
};


function Stats()
{
    this.stats = []; // stats data array

}

Stats.prototype = {
    constructor: Stats,

    /*
    ** initialiazed funtion returns true if stats data already read
    */
    initialized: function ()
    {
        return (this.stats.length > 0);
    },

    getStats: function ()
    {
        return this.stats;
    },

    /*
    ** adds a new data stat at given index
    */ 
    addNewStat: function (index, data)
    {
        var hStat = new BaseballStat(data);

        this.stats [index] = hStat;
    },

    processStatsFile: function(allText)
    {
        // var allTextLines = allText.split(/\r\n|\n/); 
        var allTextLines = allText;
        var headers = allTextLines[0].split(',');
        var lines = [];

        // read each line in the file and convert it to 
        // a hitting stat in the array; start reading at 1 to skip header
        var numLines = allTextLines.length;
        for (var j = 1; j < numLines; j++)
        {
            // debug (j + ":" + allTextLines[j]);
            var data = allTextLines[j].split(',');

            // subtract 1 from j index to start at 0 in the array
            this.addNewStat (j-1, data);

        }
        debug (this.stats);
    },

    sortByOPS: function ()
    {
        if (this.initialized())
        {
            this.stats.sort(function(a, b)
            {
                return b.ops - a.ops;
            });
        }
        else
        {
            debug ("can't sort ops stats... not initialized");
        }
    },
        
    sortByWHIP: function ()
    {
        if (this.initialized())
        {
            this.stats.sort(function(a, b)
            {
                return a.whip - b.whip;
            });
        }
        else
        {
            debug ("can't sort whip stats... not initialized");
        }
    },

    getPlayerStats: function (playerName)
    {
        var playerStats = {"player":"not_found"};

        var numPlayers = this.stats.length;
        for (var j = 0; j < numPlayers; j++)
        {
            debug ("player stat is *" + this.stats[j].player + "* looking for player " + playerName);
            if (this.stats[j].player == playerName)
            {
                playerStats = this.stats[j];
            }
        }

        if (playerStats)
        {
            debug ("looking for " + playerName + " returning player " + playerStats.player);
        }
        else 
        {
            debug ("did not find stats for player " + playerName);
        }
        return (playerStats);
    },


    getTopHitter: function ()
    {
        this.sortByOPS();
        var topHitter = null;
        var found = false;
        var minAB = 10;
        var numPlayers = this.stats.length;

        for (var j=0; j< numPlayers && !found; j++)
        {
            if (this.stats[j].atBats > minAB)
            {
                topHitter = this.stats[j];
                found = true;
            }
        }

        return (topHitter);
    },

    getTopPitcher: function ()
    {
        this.sortByWHIP();
        var topPitcher = null;
        var found = false;
        var minInnings = 5;
        var numPlayers = this.stats.length;

        for (var j=0; j< numPlayers && !found; j++)
        {
            if (this.stats[j].ip > minInnings)
            {
                topPitcher = this.stats[j];
                found = true;
            }
        }

        return (topPitcher);
    }
};


module.exports = new Stats();