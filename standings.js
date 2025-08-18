var debug = require ('./debug');

/*
** 2025 standings
*/
var standings2025 = [
        
    new Standing ("Cigars", "12", "3", "0"),
    new Standing ("Black Sox", "7", "6", "0"),
    new Standing ("Midtown Magic", "0", "15", "0"),
    new Standing ("Dragons", "11", "4", "0"),
    new Standing ("Cherokees", "8", "6", "0"),
    new Standing ("Punishers", "4", "10", "0"),
    new Standing ("Squeaks", "5", "8", "0"),
    new Standing ("Cobb Angels", "5", "10", "1")
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
    this.events = standings2025;
    this.year = "2025";
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



            
            