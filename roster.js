'use strict';

var debug = require ('./debug');

/*
** Enable once ES6 upgrade is complete
**
class Player
{
    construct (name, lastName, number, position, hometown, throws, bats, song, picture)
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
}

class Roster
{
    construct ()
    {
        var players = [
        new Player ("Edwin Marcial", "Marcial", "19", "3B", "Miami, FL", "R", "S", "When Doves Cry - Prince", "images/players/19.jpg"),
        new Player ("Tom Hart", "Hart", "12", "2B/C", "Pittsfield, IL", "R", "R", "Flyin' down a back road - Justin Moore", "images/players/12.jpg"),
        new Player ("Alfredo Medina", "Medina", "34", "SS", "Ciudad Ojeda, Venezuela", "R", "R", "", ""),
        new Player ("John Little", "Little", "14", "P/1B", "West Palm Beach, FL", "R", "R", "", "images/players/14.jpg"),
        new Player ("Colin Schaepe", "Shaepe", "37", "OF", "Green Bay, WI", "R", "R", "", "images/players/37.jpg"),
        // new Player ("Justin Frobose", "Frobose", "7", "P/OF", "tbd", "R", "R", "", ""),
        // new Player ("Landon Bennet", "Bennet", "32", "OF", "Atlanta, GA", "R", "R", "", ""),
        new Player ("Rob Wodarczyk", "Wodarczk", "2", "OF/IF/P", "Kernersville, NC", "R", "S", "", ""),
        new Player ("Joel Pierce", "Pierce", "13", "C", "tbd", "R", "R", "", "images/players/13.jpg"),
        // new Player ("Jamie Lugo", "Lugo", "0", "2B/OF", "Newark, NJ", "R", "R", "", ""),
        // new Player ("Thomas Padilla", "Padilla", "8", "1B/3B", "Norcross, GA", "R", "R", "Thunderstruck- AC/DC", "images/players/8.jpg"),
        // new Player ("Kevin Cattie", "Cattie", "3", "OF", "tbd", "L", "L", "", ""),
        // new Player ("Jordan Kosterich", "Kosterich", "50", "P", "Westchester, NY", "L", "L", "", "images/players/50.jpg"),
        // new Player ("Ryan Krezel", "Kretzel", "22", "OF/P", "Chicago, IL", "R", "R", "", "images/players/22.jpg"),
        new Player ("John Gentry", "Gentry", "21", "1B/P", "Charleston, SC", "R", "R", "", "images/players/21.jpg"),
        // new Player ("Ryan Holland", "Holland", "23", "SS/2B", "Atlanta, GA", "R", "L", "", "images/players/23.jpg"),
        // new Player ("Caleb Crotts", "Crotts", "XX", "C (Injured)", "McDounough, GA", "R", "R", "Radioactive - Imagine Dragons", ""),
        new Player ("Sean Lennox", "Lennox", "16", "P", "Norcross, GA", "R", "R", "Givin the Dog a Bone - AC/DC", "images/players/16.jpg"),
        new Player ("Nathan Moreau", "Moreau", "15", "P/OF", "", "L", "L", "", ""),
        // new Player ("Brad May", "May", "6", "IF/OF/C", "", "R", "R", "", ""),
        // new Player ("Blake Bailey", "Bailey", "5", "OF", "", "R", "R", "", ""),
        new Player ("Justin Roberts", "Roberts", "8", "OF/IF", "", "R", "R", "", ""),
        new Player ("Tony Plagman", "Plagman", "26", "OF/1B/P", "", "L", "L", "", ""),
        new Player ("Marcus Grimaldi", "Gramaldi", "20", "SS/3B/2B", "Johns Creek, GA", "R", "L", "Master of Puppets - Metallica", ""),
        new Player ("Roman Grimaldi", "Gramaldi", "7", "OF", "", "R", "L", "", ""),
        new Player ("Brae Wright", "Wright", "45", "P/OF/1B", "Southaven, MS", "L", "L", "", ""),
        new Player ("Phil Lucas", "Lucas", "50", "P/OF", "", "R", "R", "", ""),
        new Player ("Chad Lambert", "Lambert", "23", "SS/2B/P", "", "R", "R", "", ""),
        new Player ("Jamie Houston", "Houston", "39", "IF/OF", "", "R", "R", "", ""),
        new Player ("Adrian Prieto", "Suarez", "4", "IF/P/OF", "", "R", "R", "", ""),
        new Player ("James Little", "Little", "3", "C", "Farmers Branch, TX", "R", "R", "", "Shades of Gray - Robert Earl Keen")
        // new Player ("Stephen Dodson", "Dodson", "26", "P/IF/OF", "", "R", "R", "", ""),
        // new Player ("Jeff Downer", "Downer", "27", "IF/C", "", "R", "R", "", ""),
        // new Player ("Cash Collins", "Collins", "4", "P/OF", "", "L", "L", "", "images/players/4.jpg"),
        // new Player ("Peter Verdin", "Verdin", "39", "OF/P", "", "R", "R", "", ""),
        // new Player ("Blake Dieterich", "Dieterich", "51", "OF/P", "", "L", "L", "", "")
        ];
    }

    getRoster ()
    {
        debug ("returning roster...");
        debug (players);
        return (players);
    }

}
*/



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


function Roster ()
{
    var formerPlayers = [
        new Player ("Justin Frobose", "Frobose", "7", "P/OF", "tbd", "R", "R", "", ""),
        new Player ("Landon Bennet", "Bennet", "32", "OF", "Atlanta, GA", "R", "R", "", ""),
        new Player ("Jamie Lugo", "Lugo", "0", "2B/OF", "Newark, NJ", "R", "R", "", ""),
        new Player ("Thomas Padilla", "Padilla", "8", "1B/3B", "Norcross, GA", "R", "R", "Thunderstruck- AC/DC", "images/players/8.jpg"),
        new Player ("Kevin Cattie", "Cattie", "3", "OF", "tbd", "L", "L", "", ""),
        new Player ("Jordan Kosterich", "Kosterich", "50", "P", "Westchester, NY", "L", "L", "", "images/players/50.jpg"),
        new Player ("Ryan Krezel", "Kretzel", "22", "OF/P", "Chicago, IL", "R", "R", "", "images/players/22.jpg"),
        new Player ("Ryan Holland", "Holland", "23", "SS/2B", "Atlanta, GA", "R", "L", "", "images/players/23.jpg"),
        new Player ("Caleb Crotts", "Crotts", "XX", "C (Injured)", "McDounough, GA", "R", "R", "Radioactive - Imagine Dragons", ""),
        new Player ("Brad May", "May", "6", "IF/OF/C", "", "R", "R", "", ""),
        new Player ("Blake Bailey", "Bailey", "5", "OF", "", "R", "R", "", ""),
        new Player ("Stephen Dodson", "Dodson", "26", "P/IF/OF", "", "R", "R", "", ""),
        new Player ("Cash Collins", "Collins", "4", "P/OF", "", "L", "L", "", "images/players/4.jpg"),
        new Player ("Peter Verdin", "Verdin", "39", "OF/P", "", "R", "R", "", ""),
        new Player ("Blake Dieterich", "Dieterich", "51", "OF/P", "", "L", "L", "", "")
        ];

    var players2016 = [
        new Player ("Edwin Marcial", "Marcial", "19", "3B", "Miami, FL", "R", "S", "When Doves Cry - Prince", "images/players/19.jpg"),
        new Player ("Tom Hart", "Hart", "12", "2B/C", "Pittsfield, IL", "R", "R", "Flyin' down a back road - Justin Moore", "images/players/12.jpg"),
        new Player ("Alfredo Medina", "Medina", "34", "SS", "Ciudad Ojeda, Venezuela", "R", "R", "", ""),
        new Player ("John Little", "Little", "14", "P/1B", "West Palm Beach, FL", "R", "R", "", "images/players/14.jpg"),
        new Player ("Colin Schaepe", "Shaepe", "37", "OF", "Green Bay, WI", "R", "R", "", "images/players/37.jpg"),
        new Player ("Rob Wodarczyk", "Wodarczk", "2", "OF/IF/P", "Kernersville, NC", "R", "S", "", ""),
        new Player ("Joel Pierce", "Pierce", "13", "C", "tbd", "R", "R", "", "images/players/13.jpg"),
        new Player ("John Gentry", "Gentry", "21", "1B/P", "Charleston, SC", "R", "R", "", "images/players/21.jpg"),
        new Player ("Sean Lennox", "Lennox", "16", "P", "Norcross, GA", "R", "R", "Givin the Dog a Bone - AC/DC", "images/players/16.jpg"),
        new Player ("Nathan Moreau", "Moreau", "15", "P/OF", "", "L", "L", "", ""),
        new Player ("Justin Roberts", "Roberts", "8", "OF/IF", "", "R", "R", "", ""),
        new Player ("Tony Plagman", "Plagman", "26", "OF/1B/P", "", "L", "L", "", ""),
        new Player ("Marcus Grimaldi", "Gramaldi", "20", "SS/3B/2B", "Johns Creek, GA", "R", "L", "Master of Puppets - Metallica", ""),
        new Player ("Roman Grimaldi", "Gramaldi", "7", "OF", "", "R", "L", "", ""),
        new Player ("Brae Wright", "Wright", "45", "P/OF/1B", "Southaven, MS", "L", "L", "", ""),
        new Player ("Phil Lucas", "Lucas", "50", "P/OF", "", "R", "R", "", ""),
        new Player ("Chad Lambert", "Lambert", "23", "SS/2B/P", "", "R", "R", "", ""),
        new Player ("Jamie Houston", "Houston", "39", "IF/OF", "", "R", "R", "", ""),
        new Player ("Adrian Prieto", "Suarez", "4", "IF/P/OF", "", "R", "R", "", ""),
        new Player ("James Little", "Little", "3", "C", "Farmers Branch, TX", "R", "R", "", "Shades of Gray - Robert Earl Keen")
        ];

    return {
        getRoster: function()
        {
            debug ("returning roster...");
            debug (players2016);
            return (players2016);
        }
    }; // end return object
}

module.exports = new Roster();