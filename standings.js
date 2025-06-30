var debug = require ('./debug');

var standings2025 = [

        // last column is a url link that links back from the date - first column
        
        //2025
        new Standing ("Cigars", "4", "3", "0"),
        new Standing ("Black Sox", "4", "3", "0"),
        new Standing ("Midtown Magic", "0", "10", "0"),
        new Standing ("Dragons", "6", "2", "0"),
        new Standing ("Cherokees", "4", "4", "0"),
        new Standing ("Punishers", "4", "5", "0"),
        new Standing ("Squeaks", "4", "3", "0"),
        new Standing ("Cobb Angels", "3", "4", "1")
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




/*
            2015 Standings
            this.teams = [
                new TeamStanding ("Cigars", 5, 11, 1),
                new TeamStanding ("Mudcats", 3, 11, 1),
                new TeamStanding ("Giants", 15, 2, 0),
                new TeamStanding ("Barracudas", 7, 8, 0),
                new TeamStanding ("McBluv", 7, 8, 0),
                new TeamStanding ("Cherokees", 12, 5, 0),
                new TeamStanding ("Dragons", 12, 5, 0),
                new TeamStanding ("Indians", 3, 14, 0)
            ];
            */

            /*
            ** 2016 Standings
            
            this.teams = [
                new TeamStanding ("Cigars", 11, 7, 0),
                new TeamStanding ("Barracudas", 5, 12, 1),
                new TeamStanding ("Cherokees", 12, 6, 0),
                new TeamStanding ("Dragons", 16, 2, 0),
                new TeamStanding ("Mudcats", 12, 6, 0),
                new TeamStanding ("Rangers", 8, 9, 1),
                new TeamStanding ("Reds", 5, 13, 0)
            ];
            */

            /*
            ** 2017 standings
                        this.teams = [
                new TeamStanding ("Cigars", 8, 10, 0),
                new TeamStanding ("Barracudas", 10, 8, 0),
                new TeamStanding ("Cherokees", 11, 5, 2),
                new TeamStanding ("Dragons", 13, 4, 1),
                new TeamStanding ("Black Sox", 9, 7, 2),
                new TeamStanding ("Rangers", 3, 15, 0),
                new TeamStanding ("Muckdogs", 5, 13, 0),
                new TeamStanding ("Outlaws", 9, 6, 3)
            ];
            */


            /*
            ** 2018 standings
                        this.teams = [
                new TeamStanding ("Cigars", 6, 12, 0),
                new TeamStanding ("Cherokees", 12, 4, 0),
                new TeamStanding ("Dragons", 14, 3, 1),
                new TeamStanding ("Black Sox", 12, 6, 0),
                new TeamStanding ("Gwinett Tigers", 4, 12, 1),
                new TeamStanding ("Muckdogs", 4, 12, 2),
                new TeamStanding ("Outlaws", 8, 7, 2),
                new TeamStanding ("Squeaks", 1, 16, 1),
                new TeamStanding ("Tainos", 14, 3, 0),
                new TeamStanding ("Dodgers", 8, 8, 1),
            ];
            */


            /*
            ** 2019 standings
            
            this.teams = [
                new TeamStanding ("Cigars", 7, 9, 1),
                new TeamStanding ("Cherokees", 12, 6, 0),
                new TeamStanding ("Dragons", 12, 4, 2),
                new TeamStanding ("Black Sox", 13, 5, 0),
                new TeamStanding ("Bombers", 2, 15, 0),
                new TeamStanding ("Muckdogs", 8, 10, 0),
                new TeamStanding ("Squeaks", 2, 14, 0),
                new TeamStanding ("Tainos", 13, 4, 1)
            ];
            */

            /*
            ** 2020 standings
                        this.teams = [
                new TeamStanding ("Cigars", 8, 3, 2),
                new TeamStanding ("Cherokees", 8, 5, 0),
                new TeamStanding ("Dragons", 6, 6, 0),
                new TeamStanding ("Black Sox", 9, 2, 1),
                new TeamStanding ("Cobb Angels", 3, 9, 0),
                new TeamStanding ("Muckdogs", 4, 7, 0),
                new TeamStanding ("Squeaks", 0, 10, 1),
                new TeamStanding ("Tainos", 8, 4, 0)
            ];
            */

            
            /*
            ** 2021 standings
            
            this.teams = [
                new TeamStanding ("Cigars", 13, 4, 0),
                new TeamStanding ("Cherokees", 9, 7, 0),
                new TeamStanding ("Dragons", 13, 5, 0),
                new TeamStanding ("Black Sox", 11, 7, 0),
                new TeamStanding ("Cobb Angels", 7, 8, 1),
                new TeamStanding ("Muckdogs", 8, 9, 0),
                new TeamStanding ("Squeaks", 2, 11, 1),
                new TeamStanding ("Tainos", 14, 1, 0),
                new TeamStanding ("Spades", 0, 14, 0),
                new TeamStanding ("Tornados", 1, 12, 0)
            ];
            */
            
            /*
            ** 2022 standings
            
            this.teams = [
                new TeamStanding ("Cigars", 10, 5, 1),
                new TeamStanding ("Cherokees", 6, 9, 1),
                new TeamStanding ("Dragons", 13, 3, 0),
                new TeamStanding ("Black Sox", 8, 8, 0),
                new TeamStanding ("Cobb Angels", 7, 9, 0),
                new TeamStanding ("Outlaws", 10, 6, 0),
                new TeamStanding ("Squeaks", 8, 7, 0),
                new TeamStanding ("Midtown Magic", 0, 16, 0)
            ];
            */
            
            /*
            ** 2023 standings
                        this.teams = [
                new TeamStanding ("Cigars", 15, 2, 1),
                new TeamStanding ("Cherokees", 8, 10, 0),
                new TeamStanding ("Dragons", 14, 3, 1),
                new TeamStanding ("Black Sox", 6, 11, 0),
                new TeamStanding ("Cobb Angels", 9, 8, 0),

                //2018
                new TeamStanding ("Squeaks", 8, 8, 1),

                // 2022
                new TeamStanding ("Outlaws", 10, 8, 0),
                new TeamStanding ("Midtown Magic", 1, 17, 0),

                // 2023
                new TeamStanding ("Roccos", 0, 17, 0),
                new TeamStanding ("Internacional Punishers", 10, 6, 1)

            ];
            */


            /*
            ** 2024 standings
            this.teams = [
                // 2003
                new TeamStanding ("Cigars", 13, 4, 1),
                new TeamStanding ("Cherokees", 9, 10, 0),
                new TeamStanding ("Dragons", 12, 6, 0),
                
                // 2017
                new TeamStanding ("Black Sox", 8, 10, 0),
                // 2020
                new TeamStanding ("Cobb Angels", 10, 9, 0),

                //2018
                new TeamStanding ("Squeaks", 11, 7, 0),

                // 2022
                new TeamStanding ("Midtown Magic", 0, 17, 1),

                // 2023
                new TeamStanding ("Internacional Punishers", 6, 12, 0)

            ];
            */