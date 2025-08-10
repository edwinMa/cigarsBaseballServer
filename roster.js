'use strict';

var debug = require ('./debug');

class Player {
    constructor (name, lastName, number, position, hometown, throws, bats, song, picture)
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
    constructor () {
        this.formerPlayers = [
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
            new Player ("Nathan Moreau", "Moreau", "15", "P/OF", "", "L", "L", "", ""),
            new Player ("Justin Roberts", "Roberts", "8", "OF/IF", "", "R", "R", "", ""),
            new Player ("Marcus Grimaldi", "Gramaldi", "20", "SS/3B/2B", "Johns Creek, GA", "R", "L", "Master of Puppets - Metallica", ""), 
            new Player ("Roman Grimaldi", "Gramaldi", "7", "OF", "", "R", "L", "", ""),
            new Player ("Brae Wright", "Wright", "45", "P/OF/1B", "Southaven, MS", "L", "L", "", ""),
            new Player ("Blake Dieterich", "Dieterich", "51", "OF/P", "", "L", "L", "", ""),
            new Player ("Alfredo Medina", "Medina", "34", "SS", "Ciudad Ojeda, Venezuela", "R", "R", "", ""),
            new Player ("John Gentry", "Gentry", "21", "1B/P", "Charleston, SC", "R", "R", "", "images/players/21.jpg"),
            new Player ("Jonathan Roberts", "Roberts", "1", "OF/P", "", "R", "R", "", ""),
            new Player ("Thomas Smith", "Smith", "32", "2B/SS", "", "R", "R", "", ""),
            new Player ("Jamie Houston", "Houston", "39", "IF/OF", "", "R", "R", "", ""),
            new Player ("Chad Lambert", "Lambert", "23", "SS/2B/P", "", "R", "R", "", ""),
            new Player ("Tom Hart", "Hart", "12", "2B/C", "Pittsfield, IL", "R", "R", "Flyin' down a back road - Justin Moore", "images/players/12.jpg"),
            new Player ("Joel Pierce", "Pierce", "13", "C", "tbd", "R", "R", "", "images/players/13.jpg"),
            new Player ("Kameron Francisco", "Francisco", "1", "1B", "", "R", "R", "", ""),
            new Player ("Jarrett Smith", "Smith", "XX", "IF/OF/P", "", "R", "R", "", ""),
            new Player ("Adrian Prieto", "Suarez", "4", "IF/P/OF", "", "R", "R", "", ""),
            new Player ("Joseph Lee", "Lee", "24", "1B", "", "R", "R", "", ""),
            new Player ("Sam Beatty", "Beatty", "30", "P/OF", "", "R", "R", "", ""),
            new Player ("Freddy Pena", "Pena", "32", "OF/2B", "", "R", "R", "", ""),
            new Player ("Garrett Daily", "Dailey", "22", "OF", "", "L", "L", "", ""),
            new Player ("Cole Goodwin", "Goodwin", "18", "P/2B", "", "R", "R", "", ""),
            new Player ("Will Hesterlee", "Hesterlee", "11", "IF/OF", "", "R", "R", "", ""),
            new Player ("John Little", "Little", "14", "P/1B", "West Palm Beach, FL", "R", "R", "", "images/players/14.jpg"),
            new Player ("Colin Schaepe", "Shaepe", "37", "OF", "Green Bay, WI", "R", "R", "", "images/players/37.jpg"), // 2014
            new Player ("Phil Lucas", "Lucas", "50", "P", "", "R", "R", "", ""), //2015
            new Player ("Ryan Flemming", "Flemming", "17", "C/3B", "", "R", "L", "", ""), // 2015

            new Player ("Tyler Roberts", "Roberts", "34", "SS", "", "R", "R", "", ""), // 2020
            new Player ("Will Robertson", "Robertson", "30", "P/OF/IF", "", "R", "R", "", ""), //2020

            new Player ("Tony Plagman", "Plagman", "26", "OF/1B/P", "", "L", "L", "", ""), 

            new Player ("Cameron Yamanishi", "Yamanishi", "10", "OF/P", "", "R", "R", "", ""), //2015

            new Player ("Hans Hansen", "Hansen", "36", "P", "", "R", "R", "", ""), // 2021
            new Player ("Theo Tramontana", "Tramontana", "17", "IF/OF/P", "", "R", "R", "", ""), // 2021


             // new for 2023
            /* Jorge injured ankle again after game 1 not playing with us
            new Player ("Jorge Oropeza", "Oropeza", "31", "IF", "", "R", "R", "", ""),
            */
            // new Player ("Juan Camba", "Camba", "21", "C/3B", "", "R", "R", "", ""),
            // new Player ("Joshhua Sanmarrero", "Sanmarrero", "XX", "IF", "", "R", "R", "", ""),
            // new Player ("Brian Carruyo", "Carruyo", "XX", "P", "", "R", "R", "", ""),

            new Player ("Rob Wodarczyk", "Wodarczk", "2", "OF", "Kernersville, NC", "R", "S", "", ""), // 2014-2022


            new Player ("Kyle Brady", "Brady", "35", "P", "", "R", "R", "", ""), // 2023
            new Player ("Kendall Marshall", "Marshall", "42", "P", "", "R", "R", "", ""), //2023

            new Player ("Luis Garcia", "Garcia", "0", "P", "", "R", "R", "", ""), //2022



            ];

        this.players2016 = [
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

        this.players2017 = [
            new Player ("Edwin Marcial", "Marcial", "19", "3B", "Miami, FL", "R", "S", "When Doves Cry - Prince", "images/players/19.jpg"),
            new Player ("Tom Hart", "Hart", "12", "2B/C", "Pittsfield, IL", "R", "R", "Flyin' down a back road - Justin Moore", "images/players/12.jpg"),
            new Player ("Alfredo Medina", "Medina", "34", "SS", "Ciudad Ojeda, Venezuela", "R", "R", "", ""),
            new Player ("John Little", "Little", "14", "P/1B", "West Palm Beach, FL", "R", "R", "", "images/players/14.jpg"),
            new Player ("Colin Schaepe", "Shaepe", "37", "OF", "Green Bay, WI", "R", "R", "", "images/players/37.jpg"),
            new Player ("Rob Wodarczyk", "Wodarczk", "2", "OF/IF/P", "Kernersville, NC", "R", "S", "", ""),
            new Player ("Joel Pierce", "Pierce", "13", "C", "tbd", "R", "R", "", "images/players/13.jpg"),
            new Player ("John Gentry", "Gentry", "21", "1B/P", "Charleston, SC", "R", "R", "", "images/players/21.jpg"),
            new Player ("Sean Lennox", "Lennox", "16", "P", "Norcross, GA", "R", "R", "Givin the Dog a Bone - AC/DC", "images/players/16.jpg"),
            new Player ("Tony Plagman", "Plagman", "26", "OF/1B/P", "", "L", "L", "", ""),
            new Player ("Phil Lucas", "Lucas", "50", "P/OF", "", "R", "R", "", ""),
            new Player ("Chad Lambert", "Lambert", "23", "SS/2B/P", "", "R", "R", "", ""),
            new Player ("Jamie Houston", "Houston", "39", "IF/OF", "", "R", "R", "", ""),
            new Player ("Adrian Prieto", "Suarez", "4", "IF/P/OF", "", "R", "R", "", ""),
            new Player ("Jonathan Roberts", "Roberts", "1", "OF/P", "", "R", "R", "", ""),
            new Player ("Thomas Smith", "Smith", "32", "2B/SS", "", "R", "R", "", ""),
            new Player ("Nathan Moreau", "Moreau", "15", "P/OF", "", "L", "L", "", ""),
            new Player ("Cameron Yamanishi", "Yamanishi", "10", "P/OF", "", "R", "R", "", ""),
            new Player ("Ryan Flemming", "Flemming", "17", "C/1B", "", "R", "L", "", ""),
            new Player ("James Little", "Little", "3", "C", "Farmers Branch, TX", "R", "R", "", "Shades of Gray - Robert Earl Keen")
            ];

            this.players2018 = [
            new Player ("Edwin Marcial", "Marcial", "19", "IF", "Miami, FL", "R", "S", "When Doves Cry - Prince", "images/players/19.jpg"),
            new Player ("Tom Hart", "Hart", "12", "2B/C", "Pittsfield, IL", "R", "R", "Flyin' down a back road - Justin Moore", "images/players/12.jpg"),
            new Player ("John Little", "Little", "14", "P/1B", "West Palm Beach, FL", "R", "R", "", "images/players/14.jpg"),
            new Player ("Colin Schaepe", "Shaepe", "37", "OF", "Green Bay, WI", "R", "R", "", "images/players/37.jpg"),
            new Player ("Rob Wodarczyk", "Wodarczk", "2", "OF", "Kernersville, NC", "R", "S", "", ""),
            new Player ("Joel Pierce", "Pierce", "13", "C", "tbd", "R", "R", "", "images/players/13.jpg"),
            new Player ("Sean Lennox", "Lennox", "16", "P", "Norcross, GA", "R", "R", "Givin the Dog a Bone - AC/DC", "images/players/16.jpg"),
            new Player ("Phil Lucas", "Lucas", "50", "P", "", "R", "R", "", ""),
            // new Player ("Adrian Prieto", "Suarez", "4", "IF/P/OF", "", "R", "R", "", ""),
            new Player ("Cameron Yamanishi", "Yamanishi", "10", "OF/P", "", "R", "R", "", ""),
            new Player ("Ryan Flemming", "Flemming", "17", "C/3B", "", "R", "L", "", ""),
            new Player ("Freddy Pena", "Pena", "XX", "OF/2B", "", "R", "R", "", ""),
            //new Player ("Garrett Daily", "Dailey", "XX", "OF", "", "L", "L", "", ""),
            new Player ("Jamie Houston", "Houston", "39", "P", "", "R", "R", "", ""),
            new Player ("James Little", "Little", "3", "C/P/OF", "Farmers Branch, TX", "R", "R", "", "Shades of Gray - Robert Earl Keen"),

            new Player ("Corey Johnson", "Johnson", "4", "SS", "Georgia", "R", "R", "", ""),
            new Player ("Kameron Francisco", "Francisco", "1", "1B", "", "R", "R", "", ""),
            new Player ("Jarrett Smith", "Smith", "XX", "IF/OF/P", "", "R", "R", "", ""),
            new Player ("Tyler Ferguson", "Ferguson", "XX", "P", "", "R", "R", "", ""),
            new Player ("Eric Salo", "Salo", "XX", "P", "", "R", "R", "", "")

            ];

            this.players2019 = [
            new Player ("Edwin Marcial", "Marcial", "19", "3B/2B", "Miami, FL", "R", "S", "When Doves Cry - Prince", "images/players/19.jpg"),
            new Player ("John Little", "Little", "14", "P/1B", "West Palm Beach, FL", "R", "R", "", "images/players/14.jpg"),
            new Player ("Colin Schaepe", "Shaepe", "37", "OF", "Green Bay, WI", "R", "R", "", "images/players/37.jpg"),
            new Player ("Rob Wodarczyk", "Wodarczk", "2", "OF", "Kernersville, NC", "R", "S", "", ""),
            new Player ("Sean Lennox", "Lennox", "16", "P", "Norcross, GA", "R", "R", "Givin the Dog a Bone - AC/DC", "images/players/16.jpg"),
            new Player ("Phil Lucas", "Lucas", "50", "P", "", "R", "R", "", ""),
            new Player ("Cameron Yamanishi", "Yamanishi", "10", "OF/P", "", "R", "R", "", ""),
            new Player ("Ryan Flemming", "Flemming", "17", "C/3B", "", "R", "L", "", ""),
            new Player ("Freddy Pena", "Pena", "32", "OF/2B", "", "R", "R", "", ""),
            new Player ("Garrett Daily", "Dailey", "22", "OF", "", "L", "L", "", ""),
            new Player ("Mathew Powell", "Powell", "28", "P/1B", "", "L", "L", "", ""),
            new Player ("James Little", "Little", "3", "C/OF/P", "Farmers Branch, TX", "R", "R", "", "Shades of Gray - Robert Earl Keen"),
            new Player ("LeCorey Johnson", "Johnson", "4", "SS", "Georgia", "R", "R", "", ""),
            new Player ("Spencer Middleton", "Middleton", "1", "OF/P/1B", "Georgia", "R", "R", "", ""),
            new Player ("Omar Alladina", "Alladina", "9", "1B/3B", "", "R", "R", "", ""),
            // new Player ("Cole Goodwin", "Goodwin", "18", "P/2B", "", "R", "R", "", ""),
            new Player ("Joseph Lee", "Lee", "24", "1B", "", "R", "R", "", ""),
            new Player ("Sam Beatty", "Beatty", "30", "P/OF", "", "R", "R", "", ""),
            new Player ("Luimar Pena", "LPena", "20", "P", "", "R", "R", "", "")
            // new Player ("Will Hesterlee", "Hesterlee", "11", "IF/OF", "", "R", "R", "", "")
            ];

            

            // projected core for 2020
            this.players2020 = [
            new Player ("Edwin Marcial", "Marcial", "19", "2B/3B", "Miami, FL", "R", "S", "When Doves Cry - Prince", "images/players/19.jpg"),
            
            // 2014
            new Player ("Rob Wodarczyk", "Wodarczk", "2", "OF", "Kernersville, NC", "R", "S", "", ""),

            //2015
            new Player ("Sean Lennox", "Lennox", "16", "P", "Norcross, GA", "R", "R", "Givin the Dog a Bone - AC/DC", "images/players/16.jpg"),

            new Player ("Cameron Yamanishi", "Yamanishi", "10", "OF/P", "", "R", "R", "", ""),
            // new Player ("Ryan Flemming", "Flemming", "17", "C/3B", "", "R", "L", "", ""),
            new Player ("James Little", "Little", "3", "C/OF/P", "Farmers Branch, TX", "R", "R", "", "Shades of Gray - Robert Earl Keen"),

            // new ass of 2017
            new Player ("LeCorey Johnson", "Johnson", "4", "SS/3B", "Georgia", "R", "R", "", ""),

            // new as of 2018
            new Player ("Spencer Middleton", "Middleton", "1", "CF/P", "Georgia", "R", "R", "", ""),
            new Player ("Luimar Pena", "LPena", "20", "P/1B", "", "R", "S", "", ""),
            new Player ("Mathew Powell", "Powell", "28", "P/1B", "", "L", "L", "", ""),

            // new for 2020
            new Player ("Eric Jordan", "Jordan", "11", "IF/OF", "", "R", "S", "", ""),
            new Player ("Jah-Neel Warner", "Warner", "8", "OF", "", "R", "R", "", ""),
            new Player ("Mathew Connelly", "Connelly", "27", "IF/P", "", "R", "R", "", ""),
            new Player ("Tyler Roberts", "Roberts", "34", "SS", "", "R", "R", "", ""),
            new Player ("Will Robertson", "Robertson", "30", "P/OF/IF", "", "R", "R", "", ""),
            new Player ("Ryan Powell", "Powell", "40", "C/OF", "", "R", "R", "", ""),
            
            new Player ("Jason Rogers", "Rogers", "29", "1B/OF", "", "R", "R", "", ""),

            new Player ("Mathew Childree", "Childree", "6", "P", "", "R", "R", "", ""),
            new Player ("Mason Colquitt", "Colquitt", "41", "P", "", "L", "L", "", "")

            // new Player ("Mike Krill", "Krill", "XX", "P", "", "R", "R", "", ""),



            ];
        

        this.players2021 = [
            // 2003
            new Player ("Edwin Marcial", "Marcial", "19", "2B/3B", "Miami, FL", "R", "S", "When Doves Cry - Prince", "images/players/19.jpg"),
            
            // 2014
            new Player ("Rob Wodarczyk", "Wodarczk", "2", "OF", "Kernersville, NC", "R", "S", "", ""),

            //2015
            new Player ("Sean Lennox", "Lennox", "16", "P", "Norcross, GA", "R", "R", "Givin the Dog a Bone - AC/DC", "images/players/16.jpg"),
            new Player ("Cameron Yamanishi", "Yamanishi", "10", "OF/P", "", "R", "R", "", ""),
            new Player ("James Little", "Little", "3", "C/OF/P", "Farmers Branch, TX", "R", "R", "", "Shades of Gray - Robert Earl Keen"),

            // new as of 2017
            new Player ("LeCorey Johnson", "Johnson", "4", "SS/3B", "Georgia", "R", "R", "", ""),

            // new as of 2018
            new Player ("Spencer Middleton", "Middleton", "1", "CF/P", "Georgia", "R", "R", "", ""),
            new Player ("Luimar Pena", "LPena", "20", "P/1B", "", "R", "S", "", ""),
            new Player ("Mathew Powell", "Powell", "28", "P/1B", "", "L", "L", "", ""),

            // new for 2020
            new Player ("Eric Jordan", "Jordan", "11", "IF/OF", "", "R", "S", "", ""),
            new Player ("Jah-Neel Warner", "Warner", "8", "OF", "", "R", "R", "", ""),
            new Player ("Mathew Connelly", "Connelly", "27", "IF/P", "", "R", "R", "", ""),
            new Player ("Ryan Powell", "Powell", "40", "C/OF", "", "R", "R", "", ""),
            new Player ("Jason Rogers", "Rogers", "29", "1B/OF", "", "R", "R", "", ""),
            new Player ("Mathew Childree", "Childree", "6", "P", "", "R", "R", "", ""),
            new Player ("Mason Colquitt", "Colquitt", "41", "P", "", "L", "L", "", ""),

            // new for 2021
            new Player ("Hans Hansen", "Hansen", "36", "P", "", "R", "R", "", ""),
            new Player ("Milton Adorno", "Adorno", "26", "OF/1B", "", "R", "R", "", ""),
            new Player ("Scott Miller", "Miller", "5", "OF", "", "R", "R", "", ""),
            new Player ("Theo Tramontana", "Tramontana", "17", "IF/OF/P", "", "R", "R", "", "")


            ];


            this.players2022 = [
            // 2003
            new Player ("Edwin Marcial", "Marcial", "19", "2B/3B", "Miami, FL", "R", "S", "When Doves Cry - Prince", "images/players/19.jpg"),
            
            // 2014
            new Player ("Rob Wodarczyk", "Wodarczk", "2", "OF", "Kernersville, NC", "R", "S", "", ""),

            //2015
            new Player ("Sean Lennox", "Lennox", "16", "P", "Norcross, GA", "R", "R", "Givin the Dog a Bone - AC/DC", "images/players/16.jpg"),
            new Player ("James Little", "Little", "3", "C/OF/P", "Farmers Branch, TX", "R", "R", "", "Shades of Gray - Robert Earl Keen"),

            // new as of 2017
            new Player ("LeCorey Johnson", "Johnson", "4", "SS/3B", "Georgia", "R", "R", "", ""),

            // new as of 2018
            new Player ("Spencer Middleton", "Middleton", "1", "CF/P", "Georgia", "R", "R", "", ""),
            new Player ("Luimar Pena", "LPena", "20", "P/1B", "", "R", "S", "", ""),
            new Player ("Mathew Powell", "Powell", "28", "P/1B", "", "L", "L", "", ""),

            // new for 2020
            new Player ("Eric Jordan", "Jordan", "11", "IF/OF", "", "R", "S", "", ""),
            new Player ("Jah-Neel Warner", "Warner", "8", "OF", "", "R", "R", "", ""),
            new Player ("Mathew Connelly", "Connelly", "27", "IF/P", "", "R", "R", "", ""),
            new Player ("Ryan Powell", "Powell", "40", "C/OF", "", "R", "R", "", ""),
            new Player ("Jason Rogers", "Rogers", "29", "1B/OF", "", "R", "R", "", ""),
            new Player ("Mathew Childree", "Childree", "6", "P", "", "R", "R", "", ""),
            new Player ("Mason Colquitt", "Colquitt", "41", "P", "", "L", "L", "", ""),

            // new for 2021
            new Player ("Milton Adorno", "Adorno", "26", "OF/1B", "", "R", "R", "", ""),
            new Player ("Scott Miller", "Miller", "5", "OF", "", "R", "R", "", ""),

            // new for 2022
            new Player ("Kevin Echeveria", "Echeveria", "18", "C", "", "R", "R", "", ""),
            new Player ("Luis Garcia", "Garcia", "13", "P", "", "R", "R", "", ""),

            // new Player ("AJ Nettles", "Nettles", "37", "P", "", "R", "R", "", "")
            new Player ("Jimmy Hand", "Hand", "33", "OF", "", "R", "L", "", ""),
            new Player ("David Ilrig", "Ilrig", "43", "P", "", "R", "R", "", ""),
            new Player ("Brad Jahnke", "Jahnke", "45", "P", "", "R", "R", "", "")

            ];


            this.players2023 = [
            // 2003
            new Player ("Edwin Marcial", "Marcial", "19", "2B/3B", "Miami, FL", "R", "S", "Genius of Love - Tom Tom Club", "images/players/19.jpg"),
            
            // 2014
            // new Player ("Rob Wodarczyk", "Wodarczk", "2", "OF", "Kernersville, NC", "R", "S", "", ""),

            //2015
            new Player ("Sean Lennox", "Lennox", "16", "P", "Norcross, GA", "R", "R", "Givin the Dog a Bone - AC/DC", "images/players/16.jpg"),
            new Player ("James Little", "Little", "3", "C/OF", "Farmers Branch, TX", "R", "R", "", "Shades of Gray - Robert Earl Keen"),

            // new as of 2017
            new Player ("LeCorey Johnson", "Johnson", "4", "SS/3B", "Georgia", "R", "R", "", ""),

            // new as of 2018
            new Player ("Spencer Middleton", "Middleton", "1", "OF/P", "Georgia", "R", "R", "", ""),
            new Player ("Mathew Powell", "Powell", "28", "P/1B", "", "L", "L", "", ""),

            // new for 2020
            new Player ("Eric Jordan", "Jordan", "11", "IF/OF", "", "R", "S", "", ""),
            new Player ("Jah-Neel Warner", "Warner", "8", "OF", "", "R", "R", "", ""),
            new Player ("Mathew Connelly", "Connelly", "27", "SS", "", "R", "R", "", ""),
            // new Player ("Ryan Powell", "Powell", "40", "C/OF", "", "R", "R", "", ""),
            new Player ("Jason Rogers", "Rogers", "29", "1B/OF", "", "R", "R", "", ""),

            // new for 2021
            new Player ("Milton Adorno", "Adorno", "26", "OF/1B", "", "R", "R", "", ""),
            new Player ("Scott Miller", "Miller", "5", "OF", "", "R", "R", "", ""),

            // new for 2022
            new Player ("Kevin Echeveria", "Echeveria", "18", "C", "", "R", "R", "", ""),
            new Player ("Luis Garcia", "Garcia", "0", "P", "", "R", "R", "", ""),
            // new Player ("Brad Jahnke", "Jahnke", "45", "P", "", "R", "R", "", ""),

            // new for 2023
            /* Jorge injured ankle again after game 1 not playing with us
            new Player ("Jorge Oropeza", "Oropeza", "31", "IF", "", "R", "R", "", ""),
            */
            // new Player ("Juan Camba", "Camba", "21", "C/3B", "", "R", "R", "", ""),
            // new Player ("Joshhua Sanmarrero", "Sanmarrero", "XX", "IF", "", "R", "R", "", ""),
            // new Player ("Brian Carruyo", "Carruyo", "XX", "P", "", "R", "R", "", ""),

            new Player ("Isaac Phillips", "Phillips", "24", "OF", "", "R", "R", "", ""),
            new Player ("Trey Rampy", "Rampy", "44", "P", "", "R", "R", "", ""),

            new Player ("Kyle Brady", "Brady", "35", "P", "", "R", "R", "", ""),
            new Player ("Chris Porter", "Porter", "23", "P", "", "R", "R", "", ""),
            new Player ("Glenn Cordero", "Cordero", "21", "IF", "", "R", "R", "", ""),
            new Player ("Kendall Marshall", "Marshall", "42", "P", "", "R", "R", "", "")

            ];

            this.players2024 = [
            // 2003
            new Player ("Edwin Marcial", "Marcial", "19", "2B/3B", "Miami, FL", "R", "S", "Genius of Love - Tom Tom Club", "images/players/19.jpg"),
            
            //2015
            new Player ("Sean Lennox", "Lennox", "16", "P", "Norcross, GA", "R", "R", "Givin the Dog a Bone - AC/DC", "images/players/16.jpg"),
            new Player ("James Little", "Little", "3", "C/OF", "Farmers Branch, TX", "R", "R", "", "Shades of Gray - Robert Earl Keen"),

            // new as of 2017
            new Player ("LeCorey Johnson", "Johnson", "4", "SS/3B", "Georgia", "R", "R", "", ""),

            // new as of 2018
            new Player ("Spencer Middleton", "Middleton", "1", "OF/P", "Georgia", "R", "R", "", ""),
            new Player ("Mathew Powell", "Powell", "28", "P/1B", "", "L", "L", "", ""),

            // new for 2020
            new Player ("Eric Jordan", "Jordan", "11", "IF/OF", "", "R", "S", "", ""),
            new Player ("Jah-Neel Warner", "Warner", "8", "OF", "", "R", "R", "", ""),
            new Player ("Mathew Connelly", "Connelly", "27", "SS", "", "R", "R", "", ""),
            new Player ("Jason Rogers", "Rogers", "29", "1B/OF", "", "R", "R", "", ""),

            // new for 2021
            new Player ("Milton Adorno", "Adorno", "26", "OF/1B", "", "R", "R", "", ""),
            new Player ("Scott Miller", "Miller", "5", "OF", "", "R", "R", "", ""),

            // new for 2022
            new Player ("Kevin Echeverria", "Echeveria", "18", "C", "", "R", "R", "", ""),
            new Player ("Luis Garcia", "Garcia", "0", "P", "", "R", "R", "", ""),

            // new for 2023
            new Player ("Isaac Phillips", "Phillips", "24", "OF", "", "R", "R", "", ""),
            new Player ("Trey Rampy", "Rampy", "44", "P", "", "R", "R", "", ""),
            new Player ("Chris Porter", "Porter", "23", "P", "", "R", "R", "", ""),
            new Player ("Glenn Cordero", "Cordero", "21", "IF", "", "R", "R", "", ""),

            // new for 2024
            new Player ("Dallas Williams", "Williams", "13", "OF", "", "R", "R", "", ""),
            new Player ("Cole Holley", "Holley", "14", "P", "", "R", "R", "", "")



            ];
        

        this.players2025 = [
            // 2003
            new Player ("Edwin Marcial", "Marcial", "19", "2B/3B", "New York, Miami", "R", "S", "Genius of Love - Tom Tom Club", "images/players/19.jpg"),
            
            //2015
            new Player ("Sean Lennox", "Lennox", "16", "P", "Norcross, GA", "R", "R", "Givin the Dog a Bone - AC/DC", "images/players/16.jpg"),
            new Player ("James Little", "Little", "3", "C/OF", "Farmers Branch, TX", "R", "R", "Shades of Gray - Robert Earl Keen", ""),

            // new as of 2017
            new Player ("LeCorey Johnson", "Johnson", "4", "SS/3B", "Columbus, GA", "R", "R", "Cooped Up - Post Malone", ""),

            // new as of 2018
            new Player ("Spencer Middleton", "Middleton", "1", "OF/P", "Sandy Springs GA", "R", "R", "Magic Stick - 50 cent", ""),
            new Player ("Mathew Powell", "Powell", "28", "P/1B", "Casselberry, FL", "L", "L", "Rags to Riches- Tony Bennett", ""),

            // new for 2020
            new Player ("Eric Jordan", "Jordan", "11", "IF/OF", "Walterboro,SC", "R", "S", "#1 - Nelly", ""),
            new Player ("Jah-Neel Warner", "Warner", "8", "OF", "St. Thomas, VI", "R", "R", "Nipsey Hussle - Victory Lap", ""),
            new Player ("Mathew Connelly", "Connelly", "27", "SS", "Mt.Airy, Md", "R", "R", "Break stuff- limp bizkit", ""),
            // new Player ("Jason Rogers", "Rogers", "29", "1B/OF", "", "R", "R", "", ""),

            // new for 2021
            new Player ("Milton Adorno", "Adorno", "42", "OF/1B", "Puerto Rico", "R", "R", "El caballo pelotero (gran combo)", ""),
            new Player ("Scott Miller", "Miller", "5", "OF", "Knoxville,Tn ", "R", "R", "Ooh ahh (my life be like) - grits", ""),

            // new for 2022
            new Player ("Kevin Echeverria", "Echeveria", "18", "C", "Barranquilla, Colombia", "R", "R", "", ""),

            // new for 2023
            new Player ("Isaac Phillips", "Phillips", "24", "OF", "Powder Springs, GA", "R", "R", "Lemonade - gucci mane", ""),
            new Player ("Trey Rampy", "Rampy", "44", "P", "McDonough, GA", "R", "R", "Dixieland Delight - Alabama", ""),
            new Player ("Chris Porter", "Porter", "23", "P", "Marietta, GA ", "R", "R", "Sunday Best - Surfaces", ""),
            new Player ("Glenn Cordero", "Cordero", "6", "IF", "Moca, Puerto Rico", "R", "R", "NUEVAYoL - Bad Bunny", ""),

            // new for 2024
            // new Player ("Dallas Williams", "Williams", "13", "OF", "", "R", "R", "", ""),
            new Player ("Cole Holley", "Holley", "14", "P", "Baton Rouge, LA", "R", "R", "Song of the South", ""), 

            // new for 2025
            // new Player ("Orlando Maldanado", "Maldanado", "36", "P", "", "R", "R", "", "")
            new Player ("Mathew Bezdicek", "Bezdicek", "20", "OF/P/1B", "Plymouth, MN", "L", "R", "", ""),
            new Player ("Kenny Faulk", "Faulk", "39", "P", "", "L", "L", "", ""),
            new Player ("Wilson Battle", "Battle", "XX", "P", "", "R", "R", "", ""),
            new Player ("Jake Brown", "Brown", "XX", "P", "", "R", "R", "", ""),
            new Player ("Drake Hamil", "Hamil", "XX", "P", "", "R", "R", "", ""),



            ];
        
    }

    getRoster()
    {
        debug ("returning roster...");
        return (this.players2025);
    }
    
}

module.exports = new Roster();