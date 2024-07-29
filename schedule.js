
var debug = require ('./debug');

var games2024 = [

        // last column is a url link that links back from the date - first column
        
        //2024
        new Event ("Sun April 7", "12:00 PM", "Shamrock", "Cobb Angesls", "W 8-3", "Opening Day", ""),
        new Event ("Sun April 14", "12:00 PM", "Shamrock", "@ Black Sox", "W 5-1", "", ""),
        new Event ("Sun April 21", "12:00 PM", "Shamrock", "Squeaks", "PPD", "", ""),
        new Event ("Sun April 28", "10:00 AM", "Lakeside", "@ Dragons", "L 6-7", "", ""),
        new Event ("Sun May 5", "12:00 PM", "Shamrock", "Internacional Punishers", "W 11-1", "", ""),
        new Event ("Sun May 19", "12:30 PM", "Shamrock", "@ Cherokees", "W 8-2", "", ""),
        new Event ("Sun June 2", "1:00 PM", "Lakeside", "Midtown Magic", "W 18-0", "", ""),
        new Event ("Sun June 9", "12:00 PM", "Shamrock", "Blue Sox", "W 3-1", "", ""),
        new Event ("Sun June 16", "12:00 PM", "Shamrock", "Cobb Angels", "W 9-2", "", ""),
        new Event ("Sun June 23", "12:00 PM", "Shamrock", "@ ABC", "T 3-3", "", ""),
        new Event ("Sun June 30", "2:00 PM", "Johns Creek", "@ Internacional Punishers", "W 12-10", "", ""),
        new Event ("Sun July 7", "12:00 PM", "Shamrock", "Black Sox", "PPD", "", ""),
        new Event ("Sun July 14", "12:00 PM", "Shamrock", "@ Squeaks", "L 5-4*", "Protested", ""),
        new Event ("Sun July 21", "10:00 AM", "Lakeside", "Dragons", "W 4-2", "", ""),
        new Event ("Sun July 28", "3:30 PM", "Berkmar", "@ Internacional Punishers", "W 10-6", "", ""),
        new Event ("Sun August 4", "3:30 PM", "Shamrock", "Cherokees", "", "", ""),
        new Event ("Sun August 11", "12:00 PM", "Shamrock", "@ Midtown Magic", "", "", ""),
        new Event ("Sun August 18", "12:00 PM", "Shamrock ", "Black Sox", "", "", ""),
        new Event ("Sun August 25", "12:00 PM", "Shamrock ", "@Cobb Angels", "", "", "")

        // TBD -- new Event ("Sun August 25", "12:00 PM", "Shamrock ", "Squeaks", "", "", "")
];


var games2023 = [

        // last column is a url link that links back from the date - first column
        
        //2023
        new Event ("Sun April 2", "1:00 PM", "South Gwinett", "Roccos", "W 12-1", "Opening Day", ""),
        new Event ("Sun April 16", "1:00 PM", "South Gwinett", "Squeaks", "PPD-Rain", "", ""),
        new Event ("Sun April 23", "1:00 PM", "South Cobb", "@Cobb Angels", "L 14-8", "", ""),
        new Event ("Sun April 30", "2:00 PM", "Osborne", "@Cherokees", "PPD-Rain", "Made up 7/16", ""),
        new Event ("Sun May 7", "4:00 PM", "South Gwinett", "@Outlaws", "W 12-7", "", ""),
        new Event ("Sun May 21", "1:00 PM", "Berkmar", "Black Sox", "W 4-2", "", ""),
        new Event ("Sun June 4", "12:00 PM", "South Gwinett", "@ Midtown Magic", "W 17-1", "", ""),
        new Event ("Sun June 11", "1:30 PM", "Ward Park", "Internacional Punishers", "PPD-Rain", "Made up 7/30", ""),
        new Event ("Sun June 18", "10:00 AM", "Lakeside", "Dragons", "T 6-6", "", ""),
        new Event ("Sun June 25", "12:00 PM", "Shamrock", "Cobb Angels", "W 12-1", "", ""),
        new Event ("Sun July 2", "1:00 PM", "Shamrock", "Giants", "W 4-3", "", ""),
        new Event ("Sun July 9", "2:00 PM", "Ward Park", "@Cherokees18", "L 4-3", "", ""),
        new Event ("Sun July 16", "10:30 AM", "Shamrock", "@Cherokees", "W 5-4", "", ""),
        new Event ("Sun July 16", "1:00 PM", "Shamrock", "Cherokees", "W 7-5", "", ""),
        new Event ("Sun July 23", "12:00 PM", "Shamrock", "Midtown Magic", "W 19-11", "", ""),
        new Event ("Sun July 30", "1:00 PM", "Dunwoody HS", "@Internacional Punishers", "W 13-9", "", ""),
        new Event ("Sun July 30", "3:30 PM", "Dunwoody HS", "Internacional Punishers", "W 8-3", "", ""),
        new Event ("Sun August 6", "11:00 AM", "Lakeside", "@ Roccos", "W 9-0", "forfeit", ""),
        new Event ("Sun August 6", "12:00 PM", "Shamrock", "@ Black Sox", "W 4-1", "Rained out after 5", ""),

        new Event ("Sun August 13", "7:40 PM", "Ward", "Squeaks", "W 6-5", "", ""),
        new Event ("Sun August 20", "1 PM", "Lakeside", "@ Squeaks", "W 10-2", "", ""),


        new Event ("Sat August 26", "11 AM", "Shamrock", "Black Sox", "W 1-0", "Playoff Round 1 - Game 1", ""),
        new Event ("Sat August 26", "130 PM", "Shamrock", "@ Black Sox", "L 2-0", "Playoff Round 1 - Game 2", ""),
        new Event ("Sun August 27", "230 PM", "Berkmar", "Black Sox", "W 8-4", "Playoff Round 1 - Game 3", ""),

        new Event ("Sat September 9", "1 PM", "Shamrock", "Cobb Angels", "W 14-2", "Semi-Final - Game 1", ""),
        new Event ("Sat September 9", "330 PM", "Shamrock", "@ Cobb Angels", "L 14-5", "Semi-Final - Game 2", ""),
        new Event ("Sun September 10", "1 PM", "Lakeside", "Cobb Angels", "W 10-2", "Semi-Final - Game 3", ""),


        // new Event ("Sat September 16", "1 PM", "Shamrock", "Dragons", "PPD-Rain", "Championship - Game 1", ""),
        // new Event ("Sat September 16", "4 PM", "Shamrock", "@ Dragons", "PPD-Rain", "Championship - Game 2", ""),

        // new Event ("Sun September 17", "2 PM", "Lakeside", "Dragons", "PPD-Rain", "Championship - Game 1", ""),
        // new Event ("Sun September 17", "5 PM", "Lakeside", "@ Dragons", "PPD-Rain", "Championship - Game 2", ""),


        new Event ("Sat September 23", "1 PM", "Shamrock", "Dragons", "L", "Championship - Game 1", ""),
        new Event ("Sat September 23", "4 PM", "Shamrock", "@ Dragons", "L 8-7", "Championship - Game 2", ""),
        // new Event ("Sun September 24", "1 PM", "Lakeside", "Dragons", "", "Championship - Game 3 - If Necessary", ""),


        new Event ("Fri October 20", "7:30 PM", "TBD", "@ Atlanta Diamondbacks", "", "Postponed-Rain", ""),
        new Event ("TBD", "7:30 PM", "TBD", "@ Atlanta Diamondbacks", "", "", "")


];


var games2022 = [
        // last column is a url link that links back from the date - first column
        new Event ("Sun April 3", "12:00 PM", "Shamrock", "@Dragons", "L 2-3", "", ""),
        new Event ("Sun April 10", "12:00 PM", "Shamrock", "Squeaks", "W 7-5", "", ""),
        new Event ("Sun April 24", "12:00 PM", "Shamrock", "Cherokees", "W 11-8", "", ""),
        new Event ("Sun May 1", "12:00 PM", "Shamrock", "Black Sox", "L 5-1", "", ""),        
        new Event ("Sun May 15", "3:00 PM", "South Gwinett", "@Outlaws", "W 9-5", "", ""),
        new Event ("Sun May 22", "12:00 PM", "Shamrock", "@Cobb Angels", "W 6-2", "", ""),
        new Event ("Sun June 5", "12:00 PM", "Shamrock", "Midtown Magic", "W 15-2", "", ""),
        new Event ("Sun June 12", "10:00 AM", "Tucker High School", "Dragons", "L 13-5", "", ""),
        new Event ("Sun June 19", "1:00 PM", "Berkmar", "@Black Sox", "W 6-3", "", ""),
        new Event ("Sun June 26", "3:00 PM", "South Gwinett", "Outlaws", "W 5-4", "", ""),
        new Event ("Sun July 10", "1:00 PM", "Berkmar", "@Midtown Magic", "PPD-Rain", "", ""),
        new Event ("Sun July 17", "2:00 PM", "Osborne", "@Cherokees", "T 7-7", "", ""),
        new Event ("Sun July 24", "1:00 PM", "South Cobb", "Cobb Angels", "W 4-1", "", ""),
        new Event ("Sun July 31", "11:00 AM", "Maynard Jackson", "ABC", "W 9-7", "", ""),
        new Event ("Sun August 7", "10:00 AM", "Ward Park", "@Giants", "L 9-2", "", ""),
        new Event ("Sun August 7", "1:00 PM", "Ward Park", "@Midtown Magic", "W 12-0", "", ""),
        new Event ("Sun August 14", "12:00 PM", "South Gwinett", "@Squeaks", "L 6-2", "", ""),

        new Event ("Sat Aug 20", "1:15 PM", "Lake Point", "Cobb Angels", "W 14-9", "Playoff Round 1", ""),
        new Event ("Sat Aug 20", "4:00 PM", "Lake Point", "@Cobb Angels", "W 12-4", "Playoff Round 1", ""),
        new Event ("Sat Aug 27", "1 PM", "South Gwinett", "Outlaws", "W 4-1", "Playoff Semi-Final", ""),
        new Event ("Sat Aug 27", "4 PM", "South Gwinett", "@Outlaws", "W 6-2", "Playoff Semi-Final", ""),
        new Event ("Sat Sep 10", "12 PM", "Osborne", "@Dragons", "L 1-0", "Championship", ""),
        new Event ("Sun Sep 11", "3 PM", "Osborne", "Dragons", "L 6-2", "Championship", ""),

        new Event ("Sat Dec 3", "11 AM", "Lake Point", "Phantoms", "W 14-1", "Santa Shuffle", ""),
        new Event ("Sat Dec 3", "2 PM", "Lake Point", "@Reds", "T 10-10", "Santa Shuffle", ""),
        new Event ("Sat Dec 3", "11 AM", "Lake Point", "@Dragons", "W 10-8", "Santa Shuffle", ""),
        new Event ("Sat Dec 3", "2 PM", "Lake Point", "Squeaks", "W 11-1", "Santa Shuffle Championship", ""),

        new Event ("Sun Apr 2", "12 PM", "2023 Opening Day", "TBD", "", "2023 Opening Day", "")

        // Regular Season
        // Championship Game Runner UP - Lost to Dragons
        // 14 - 7 - 1

        // Santa Shuffle Champions
        // 3 - 0 - 1

        // Overall
        // 17 - 7 - 2
];


var games2021 = [
        // last column is a url link that links back from the date - first column
        new Event ("Sun April 11", "4:00 PM", "Lakeoint #11", "@Cherokees", "W 10-8", "", ""),
        new Event ("Sun April 18", "4:00 PM", "South Cobb", "Cobb Angels", "W 17-15", "", ""),
        new Event ("Sun May 2", "3:00 PM", "Hunter Park", "Tainos", "L 5-4", "", ""),
        new Event ("Sun May 16", "12:00 PM", "Shamrock", "Tornados", "W 11-3", "", ""),
        new Event ("Sun May 23", "12:00 PM", "Shamrock", "@Cobb Angels", "W 14-2", "", ""),
        new Event ("Sun June 6", "12:00 PM", "Shamrock", "Dragons", "L 6-3", "", ""), 
        new Event ("Sun June 13", "12:00 PM", "Shamrock", "@ Muckdogs", "W 7-3", "", ""), 
        new Event ("Sun June 20", "11:00 AM", "Shamrock", "@ Black Sox", "PPD", "", ""), 
        new Event ("Sun June 27", "12:00 PM", "Shamrock", "@ Dragons", "W 6-1", "", ""), 
        new Event ("Sun July 11", "11:00 AM", "Shamrock", "@ Tornados", "PPD", "", ""), 
        new Event ("Sun July 18", "11:00 AM", "Shamrock", "@ Black Sox", "L 4-5", "", ""), 
        new Event ("Sun July 18", "2:00 PM", "Shamrock", "Black Sox", "W 2-1", "", ""), 
        new Event ("Sun July 25", "12:00 PM", "Shamrock", "Spades", "W 13-0", "", ""), 
        new Event ("Sun Aug 1", "12:00 PM", "Shamrock", "@ Tainos", "W 8-5", "", ""), 
        new Event ("Sun Aug 8", "12:00 PM", "Shamrock", "Cherokees", "L 7-2", "", ""), 
        new Event ("Sun Aug 15", "12:00 PM", "Shamrock", "@ Squeaks", "W 13-0", "", ""), 
        new Event ("Sun Aug 22", "10:00 AM", "Shamrock", "Muckdogs", "W ", "", ""), 
        new Event ("Sun Aug 22", "1:00 PM", "Shamrock", "Spades", "W", "", ""), 
        new Event ("Sun Aug 29", "10:30 AM", "Shamrock", "Squeaks", "W 5-2", "", ""),
        new Event ("Sat Sep 11", "1:00 PM", "Shamrock", "Angels", "W 6-5", "Playoff Round 1 - Game 1", ""),
        new Event ("Sat Sep 11", "3:35 PM", "Shamrock", "@ Angels", "W 15-6", "Playoff Round 1 - Game 2", ""),
        new Event ("Sat Sep 18", "12 PM", "Shamrock", "Muckdogs", "L 4-3", "Playoff Semi-Final - Game 1", ""),
        new Event ("Sat Sep 18", "3 PM", "Shamrock", "@ Muckdogs", "W 4-1", "Playoff Semi-Final - Game 2", ""),
        new Event ("Sun Sep 26", "11 AM", "Shamrock", "Muckdogs", "W 13-3", "Playoff Semi-Final - Game 3", ""),
        new Event ("Sat Oct 9", "TBD", "Hunter Park", "@ Tainos", "L 12-11", "Championship Series - Game 1", ""),
        new Event ("Sat Oct 9", "TBD", "Hunter Park", "Tainos", "L 6-2", "Championship Series - Game 2", ""),
        new Event ("March 2022", "TBD", "TBD", "TBD", "", "TBD", "")

        // Regular Season
        // Championship Game Runner UP - Lost to Tainos
        // 17 - 7

];


var games2020 = [
        // last column is a url link that links back from the date - first column
        new Event ("Sun July 19", "1:15 PM", "Osborne", "Muckdogs", "W 8-0", "", ""),
        new Event ("Sun July 26", "4:30 PM", "South Cobb", "@Tainos", "W 2-0", "", ""),
        new Event ("Sun Aug 2", "12 PM", "Big Shanty", "Cherokees", "L 5-2", "", ""),
        new Event ("Sun Aug 9", "430 PM", "South Cobb", "@Cobb Angels", "W 15-5", "", ""),
        new Event ("Sun Aug 16", "130 PM", "Osborne", "@Squeaks", "T 2-2", "", ""),
        new Event ("Sun Aug 23", "130 PM", "South Cobb", "Black Sox", "T 8-8", "", ""),
        new Event ("Sun Aug 30", "10 AM", "Osborne", "@Dragons", "L 19-5", "", ""),
        new Event ("Sun Sep 13", "130 PM", "Osborne", "@Black Sox", "W 8-6", "", ""),
        new Event ("Sun Sep 20", "130 PM", "Osborne", "Dragons", "W 7-3", "", ""),
        new Event ("Sun Sep 27", "10 AM", "Pebblebrook", "Muckdogs", "L 9-2", "", ""),
        new Event ("Sun Oct 4", "130 PM", "Osborne", "@Cobb Angels", "W 11-1", "", ""),
        // new Event ("Sun Oct 11", "TBD", "TBD", "Playoff Round 1", "rained out", "", ""),
        new Event ("Sun Oct 18", "510 PM", "Osborne", "Muckdogs", "W 6-3", "Playoff Round 1", ""),

        new Event ("Sun Oct 24", "130 PM", "Osborne", "Cherokees", "PPD - Rain", "Playoff Semi-Final", ""),
        new Event ("Tue Oct 27", "745 PM", "Osborne", "Cherokees", "W 9-7", "Playoff Semi-Final", ""),

        new Event ("Sun Nov 15", "1 PM", "Pebblebrook", "Tainos", "L 14-1", "Playoff Finals - Game 1", ""),
        new Event ("Sun Nov 15", "4 PM", "Pebblebrook", "@Tainos", "W 6-4", "Playoff Finals - Game 2", ""),
        new Event ("Sun Nov 22", "1230 PM", "Lake Point", "Tainos", "", "Playoff Finals - Game 3", "")

        // Regular Season
        // Championship Game Runner UP - Lost to Tainos
        // 9 - 4 - 2
];


var games2019 = [
        new Event ("April 7", "12 PM", "Druid Hills", "@Buckhead Squeaks", "Postponed", "Opening Day", ""),
        new Event ("April 14", "12 PM", "Druid Hills", "Bombers", "PPD-Made Up", "", ""),
        new Event ("April 18", "730 PM", "Osborne", "Bombers", "W 9-4", "", ""),
        new Event ("April 21", "", "", "No Game", "", "Easter Sunday", ""),
        new Event ("April 28", "12 PM", "Druid Hills", "Tainos", "L 8-3", "", ""),
        new Event ("May 5", "12 PM", "Druid Hills", "@Cherokees", "L 5-0", "", ""),
        new Event ("May 12", "", "", "No Game", "", "Mother's Day", ""),
        new Event ("May 19", "4 PM", "South Gwinett", "@Muckdogs", "W 11-3", "", ""),
        new Event ("May 26", "", "", "No Game", "", "Memorial Day Weekend", ""),
        new Event ("June 2", "12 PM", "South Gwinett", "Black Sox", "L 12-0", "", ""),
        new Event ("June 9", "12 PM", "South Gwinett", "Dragons", "PPD-Made Up", "", ""),
        new Event ("June 16", "12 PM", "South Gwinett", "Buckhead Squeaks", "W 8-5", "", ""),
        new Event ("June 23", "12 PM", "Druid Hills", "@Bombers", "W 18-1", "", ""),
        new Event ("June 30", "12 PM", "Osborne", "@Black Sox", "L 6-1", "", ""),
        new Event ("July 7", "4 PM", "Ward Park", "@Tainos", "Postponed", "", ""),
        new Event ("July 14", "4 PM", "South Gwinett", "@Muckdogs", "L 5-3", "", ""),
        new Event ("July 21", "12 PM", "Druid Hills", "Cherokees", "L 6-4", "", ""),
        new Event ("July 28", "12 PM", "South Gwinett", "@Dragons", "L 15-3", "", ""),
        new Event ("August 4", "4 PM", "South Gwinett", "@Muckdogs", "Postponed-Rescheduled", "", ""),
        new Event ("August 11", "12 PM", "South Gwinett", "Black Sox", "L", "", ""),
        new Event ("August 18", "12 PM", "South Gwinett", "Dragons", "L 8-1", "", ""),
        new Event ("August 18", "3 PM", "South Gwinett", "Dragons", "T 1-1", "makeup", ""),
        new Event ("August 25", "12 PM", "Druid Hills", "@Squeaks", "W 15-0", "", ""),
        new Event ("August 25", "4 PM", "Druid Hills", "Squeaks", "W 9-0", "forfeit", ""),
        new Event ("September 1", "", "", "No Game", "", "Labor Day Weekend", ""),
        new Event ("September 8", "4 PM", "South Gwinett", "@Muckdogs", "W 12-3", "makeup", ""),
        new Event ("September 14", "12 PM", "Druid Hills", "@ Black Sox", "L 7-5", "Playoff Game 1", ""),
        new Event ("September 14", "3 PM", "Druid Hillls", "Black Sox", "L 6-2", "Playoff Game 2", ""),
        new Event ("April 2020", "12 PM", "Druid Hills", "TBD", "", "OPening Day 2020", "")


];


var games2018 = [
        new Event ("April 8", "4 PM", "Druid Hills Middle", "@Buckhead Squeaks", "W 13-2", "Opening Day 2018", ""),
        new Event ("April 15", "4 PM", "South Gwinett HS", "@Muckdogs", "Postponed", "Rain", ""),
        new Event ("April 22", "4 PM", "South Gwinett HS", "Outlaws", "Postponed", "Rain", ""),
        new Event ("April 29", "12 PM", "South Cobb HS", "@Cherokees", "L 12-0", "", ""),

        new Event ("May 6", "4 PM", "Druid Hills Middle", "Tainos", "L 11-1", "", ""),
        new Event ("May 13", "", "", "No Game", "", "Mother's Day", ""),
        new Event ("May 20", "12 PM", "Druid Hills Middle", "Black Sox", "L", "", ""),
        new Event ("May 27", "", "", "No Game", "", "Memorial Day Weekend", ""),

        new Event ("June 3", "12 PM", "Druid Hills Middle", "@Dodgers", "L 1-0", "", ""),
        new Event ("June 10", "12 PM", "Druid Hills Middle", "Gwinett Tigers", "L 2-1", "", ""),
        new Event ("June 17", "12 PM", "Druid Hills Middle", "@Dragons", "L", "forfeit", ""),
        new Event ("June 24", "12 PM", "Druid Hills Middle", "Buckhead Squeaks", "W", "", ""),

        new Event ("July 1", "12 PM", "South Gwinett HS", "Muckdogs", "Postponed", "", ""),
        new Event ("July 8", "4 PM", "Druid Hills Middle", "@Tainos", "L", "", ""),
        new Event ("July 17", "12 PM", "Osborne HS", "Cherokees", "L", "", ""),
        new Event ("July 22", "4 PM", "South Gwinett HS", "@Outlaws", "L 4-2", "", ""),
        new Event ("July 29", "12 PM", "Lakeside HS", "Black Sox", "L", "", ""),

        new Event ("August 5", "4 PM", "Druid Hills Middle", "Dodgers", "L", "", ""),
        new Event ("August 12", "12 PM", "Druid Hills Middle", "@Gwinett Tigers", "W 8-3", "", ""),
        new Event ("August 19", "1030 AM", "South Gwinett HS", "Dragons", "W 1-0", "", ""),
        new Event ("August 19", "130 PM", "South Gwinett HS", "Outlaws", "L 8-1", "", ""),

        new Event ("August 26", "1030 AM", "South Gwinett HS", "Muckdogs", "W 2-1", "", ""),
        new Event ("August 26", "130 PM", "South Gwinett HS", "@Muckdogs", "W 15-6", "", ""),

        new Event ("September 2", "", "", "No Game", "", "Labor Day Weekend", ""),
        
        new Event ("September 8", "4 PM", "Druid Hills Middle", "@Cherokees", "W 9-4", "Playoff Game 1", ""),
        new Event ("September 9", "1030 AM", "Druid Hills Middle", "Cherokees", "L 6-2", "Playoff Game 2", ""),
        new Event ("September 9", "130 PM", "Druid Hills Middle", "@Cherokees", "L 9-2", "Playoff Game 3", ""),
        new Event ("March  2019", "TBD", "TBD", "TBD", "", "", "")
        

    ];

var games2017 = [
        new Event ("April 2", "12 PM", "Druid Hills Middle", "@Black Sox", "W 11-1", "GC: James Little", ""),
        new Event ("April 9", "12 PM", "South Gwinett", "Outlaws", "L 7-4", "", ""),
        new Event ("April 16", "", "", "No Game", "", "Easter", ""),
        new Event ("April 23", "12 PM", "Druid Hills Middle", "Cherokees", "Postponed", "Rain", ""),
        new Event ("April 30", "12 PM", "Lakeside", "@Black Sox", "L 9-4", "", ""),
        new Event ("May 5", "12 PM", "Druid Hills Middle", "@Muckdogs", "L 9-8", "", ""),
        new Event ("May 14", "", "", "No Game", "", "Mother's Day", ""),
        new Event ("May 21", "12 PM", "Druid Hills Middle", "Dragons", "Postponed", "Rain", ""),
        new Event ("May 30", "", "", "No Game", "", "Memorial Day", ""),
        new Event ("June 4", "4 PM", "Druid Hills Middle", "@Rangers", "Postponed", "Rain", ""),
        new Event ("June 11", "12 PM", "Osborne", "@Cherokees", "L 3-2", "", ""),
        new Event ("June 18", "12 PM", "Druid Hills Middle", "@Barracudas", "L 11-8", "", ""),
        new Event ("June 25", "12 PM", "Druid Hills Middle", "Muckdogs", "W 8-3", "GC: Tom Hart", ""),
        new Event ("July 2", "12 PM", "South Gwinett", "@Outlaws", "L 11-6", "", ""),
        new Event ("July 9", "12 PM", "Druid Hills Middle", "Barracudas", "W 4-3", "GC: Joel Pierce", ""),
        new Event ("July 16", "1145 PM", "Druid Hills Middle", "Dragons", "L 6-0", "", ""),
        new Event ("July 23", "10 AM", "Druid Hills Middle", "@Rangers", "W 10-5", "GC: Sean Lennox, Colin Shaepe", ""),
        new Event ("July 23", "1 PM", "Druid Hills Middle", "Rangers", "L 10-6", "", ""),
        new Event ("July 30", "12 PM", "Druid Hills Middle", "Black Sox", "W 12-5", "GC: Tony Plagman", ""),
        new Event ("August 6", "4 PM", "Druid Hills Middle", "Rangers", "L 4-3", "", ""),
        new Event ("August 13", "1030 AM", "Druid Hills Middle", "Cherokees", "W 4-3", "GC: Ryan Flemming, Sean Lennox", ""),
        new Event ("August 13", "1 PM", "Druid Hills Middle", "Cherokees", "W 6-3", "GC: Phil Lucas", ""),
        new Event ("August 20", "4 PM", "Druid Hills Middle", "@Barracudas", "W 6-1", "GC: Phil Lucas", ""),
        new Event ("August 27", "10 AM", "Druid Hills Middle", "Dragons", "L 4-1", "", ""),
        new Event ("September 3", "", "", "No Game", "", "Labor Day", ""),
        new Event ("September 9", "1215 PM", "South Gwinett HS", "@Outlaws", "L", "Playoff Game 1", ""),
        new Event ("September 9", "3 PM", "South Gwinett HS", "Outlaws", "L", "Playoff Game 2", "")


    ];


var games2016 = [
        new Event("April 3", "12 PM", "Druid Hills Middle", "Reds", "W 8-6", "Opening Day", ""),
        new Event("April 10", "12 PM", "Druid Hills Middle", "@Dragons", "L 6-8", "", ""),
        new Event("April 17", "", "", "No Game", "", "BYE", ""),
        new Event("April 24", "12 PM", "Druid Hills Middle", "@Rangers", "L 4-5", "", ""),
        new Event("May 1", "12 PM", "Druid Hills Middle", "Rangers", "L 11-9", "", ""),
        new Event("May 8", "", "", "No Game", "", "Mother's Day", ""),
        new Event("May 15", "12 PM", "North Cobb", "@Cherokees", "L 5-6", "", ""),
        new Event("May 22", "12 PM", "Druid Hills Middle", "@Reds", "W 10-1", "", ""),
        new Event("May 29", "", "", "No Game", "", "Memorial Day", ""),
        new Event("June 5", "12 PM", "Druid Hills Middle", "@Barracudas", "W 5-4", "", ""),
        new Event("June 12", "12 PM", "North Cobb", "Cherokees", "W 3-4", "", ""),
        new Event("June 19", "12 PM", "Lakeside", "Mudcats", "L 6-5", "", ""),
        new Event("June 26", "12 PM", "Druid Hills Middle", "Rockies", "W 12-6", "", ""),
        new Event("July 3", "", "", "No Game", "", "4th of July Weekend", ""),
        new Event("July 10", "12 PM", "Lakeside", "@Mudcats", "W 14-2", "", ""),
        new Event("July 17", "12 PM", "South Gwinett", "Dragons", "L 5-2", "", ""),
        new Event("July 24", "", "", "No Game", "", "BYE", ""),
        new Event("July 31", "4 PM", "Druid Hills Middle", "Raw Dawgs", "W 9-6", "", ""),
        new Event("August 7", "12 PM", "Druid Hills Middle", "@Titans", "L 6-5", "", ""),
        new Event("August 14", "12 PM", "Druid Hills Middle", "@Cobb Red Sox", "W 17-6", "", ""),
        new Event("August 21", "12 PM", "Druid Hills Middle", "@Bandits", "W 11-4", "", ""),
        new Event("August 28", "12 PM", "Druid Hills Middle", "Dragons (18+)", "W 18-0", "", ""),
        new Event("September 4", "", "", "No Game", "", "Labor Day Weekend", ""),
        new Event("September 11", "12 PM", "Druid Hills Middle", "Barracudas", "W 5-0", "", ""),
        new Event("September 17", "4 PM", "Druid Hills Middle", "Rangers", "W 5-2", "Saturday Wildcard - Round 1", ""),
        new Event("September 18", "12 PM", "Osborne HS", "Dragons", "L 6-1", "Semi Final Game 1", ""),
        new Event("September 25", "11 AM", "Druid Hills Middle", "Dragons", "L 5-3", "Semi Final Game 2", ""),
        new Event("March 26, 2017", "T B D", "T B D", "T B D", "", "", "")
];

var games2015 = [
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

/*
 ** function to create a schedule item
 */
function Event(date, time, field, opponent, result, note, eviteURL)
{
    this.date = date;
    this.time = time;
    this.opponent = opponent;
    this.field = field;
    this.result = result;
    this.note = note;
    this.eviteURL = eviteURL;
}


function Schedule()
{
    // last column is for evite link
    this.events = games2024;
    this.year = "2024";
}


Schedule.prototype = {
    // set constructors 
    constructor: Schedule,

    // set methods
    getSchedule: function()
    {
        var result = this.events;
        debug(result);
        return (result);
    },

    getNextGame: function ()
    {
        
        var games = this.events;
        var nextGame = null;
        var done = false;
        var numGames = games.length;

        for (var j=0; !done && j<numGames; j++)
        {
            // find game that has no result and is not a holiday
            if (games[j].result=="" && games[j].opponent != "No Game")
            {
                // found it; return this one
                nextGame = games[j];
                done = true;
            }
        }

        debug ("getNextGame, nextGame:" + nextGame);

        return (nextGame);
    },

    getPrevGame: function()
    {
        var games = this.events;
        debug ("games is " + games);
        debug ("this.events is " + this.events);

        var prevGame = null;
        var done = false;
        var doneInner = false;
        var numGames = games.length;

        // first find next game, and then loop backwards to prior game that is not a holiday 
        for (j=0; !done && j<numGames; j++)
        {
            debug (games[j].opponent);
            // find game that has no result and is not a holiday
            if (games[j].result=="" && games[j].opponent != "No Game")
            {
                // found it; return this one
                for (k=j-1; !doneInner && k>=0; k--)
                {
                    // find game that has a result and is not a holiday
                    if (games[k].result !="" && games[k].opponent != "No Game")
                    {
                        prevGame = games[k];
                        debug ("prev game opp:" + prevGame.opponent);
                        doneInner = true;
                        done = true;
                    }
                }
            }
        }
        return (prevGame);
    },

    getRecord: function ()
    {
        var games = this.events;
        var record = {
            year: this.year,
            wins: 0,
            losses: 0,
            ties: 0,
        };

        for (var j= 0; j < games.length; j++ )
        {
            if (games[j].result.indexOf ("W") > -1)
            {
                record.wins++;
            }
            else if (games[j].result.indexOf ("L") > -1)
            {
                record.losses++;
            }
            else if (games[j].result.indexOf ("T") > -1)
            {
                record.ties++;
            }

        }
        return record;
    }

};


module.exports = new Schedule();