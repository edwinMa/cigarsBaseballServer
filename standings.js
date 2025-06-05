var debug = require ('./debug');

var standings2025 = [

        // last column is a url link that links back from the date - first column
        
        //2025
        new Standing ("Cigars", "4", "0", "0"),
        new Standing ("Black Sox", "4", "1", "0"),
        new Standing ("Midtown Magic", "0", "6", "0"),
        new Standing ("Dragons", "4", "2", "0"),
        new Standing ("Cherokees", "3", "2", "0"),
        new Standing ("Punishers", "1", "4", "0"),
        new Standing ("Squeaks", "2", "2", "0"),
        new Standing ("Cobb Angels", "2", "3", "0")
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