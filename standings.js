var debug = require ('./debug');

/*
** 2026 standings
*/
var standings2026 = [
        
    new Standing ("Cigars", "1", "1", "0"),
    new Standing ("Black Sox", "1", "1", "0"),
    new Standing ("Midtown Magic", "0", "1", "0"),
    new Standing ("Dragons", "2", "0", "0"),
    new Standing ("Cherokees", "1", "1", "0"),
    new Standing ("Atlanta Sox", "2", "0", "0"),
    new Standing ("Georgia Joros", "0", "1", "0"),
    new Standing ("Cobb Angels", "0", "2", "0")
    ];

/*
** 2025 standings
*/
var standings2025 = [
        
    new Standing ("Cigars", "15", "3", "0"),
    new Standing ("Black Sox", "7", "11", "0"),
    new Standing ("Midtown Magic", "0", "16", "1"),
    new Standing ("Dragons", "13", "5", "0"),
    new Standing ("Cherokees", "10", "7", "0"),
    new Standing ("Punishers", "7", "11", "0"),
    new Standing ("Squeaks", "6", "11", "0"),
    new Standing ("Cobb Angels", "7", "11", "")
    ];


/*
 ** function to create a schedule item
 */
function Standing(team, wins, losses, ties)
{
    this.team = team;
    this.wins = wins;
    this.losses = losses;
    this.ties = ties;
}


function Standings()
{
    // last column is for evite link
    this.events = standings2026;
    this.year = "2026";
}


Standings.prototype = {
    // set constructors 
    constructor: Standings,

    // set methods
    getStandings: function()
    {
        var result = this.events;
        debug(result);
        return (result);
    }

};


module.exports = new Standings();



            
            