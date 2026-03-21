var pool = require('./db');
var bcrypt = require('bcryptjs');

var games2015 = [
    { date: "March 22", time: "4 PM", field: "Lakeside HS", opponent: "Tigers", result: "Rained Out", note: "Scrimmage Game", eviteURL: "" },
    { date: "March 29", time: "4 PM", field: "North Cobb HS", opponent: "@Cherokees", result: "L 13-14", note: "Opening Day", eviteURL: "" },
    { date: "April 5", time: "", field: "", opponent: "No Game", result: "", note: "Easter Sunday", eviteURL: "" },
    { date: "April 12", time: "1205 PM", field: "Lithia Springs HS", opponent: "McBluv", result: "L 17-5", note: "", eviteURL: "" },
    { date: "April 19", time: "4 PM", field: "Shamrock", opponent: "Giants", result: "Postponed", note: "Rain", eviteURL: "" },
    { date: "April 26", time: "12 PM", field: "Shamrock", opponent: "Dragons", result: "L 24-5", note: "", eviteURL: "" },
    { date: "May 3", time: "4 PM", field: "Shamrock", opponent: "@Barracudas", result: "L 11-6", note: "", eviteURL: "" },
    { date: "May 10", time: "", field: "", opponent: "No Game", result: "", note: "Mother's Day", eviteURL: "" },
    { date: "May 17", time: "12 PM", field: "Lakeside HS", opponent: "@Mudcats", result: "W 14-1", note: "", eviteURL: "" },
    { date: "May 24", time: "", field: "", opponent: "No Game", result: "", note: "Memorial Day", eviteURL: "" },
    { date: "May 31", time: "4 PM", field: "Shamrock", opponent: "Indians", result: "L 17-14", note: "", eviteURL: "" },
    { date: "June 7", time: "12 PM", field: "Shamrock", opponent: "Cherokees", result: "L 13-5", note: "", eviteURL: "" },
    { date: "June 14", time: "12 PM", field: "Dunwoody", opponent: "@McBluv", result: "W 9-0", note: "ff", eviteURL: "" },
    { date: "June 21", time: "4 PM", field: "Dunwoody", opponent: "@Giants", result: "L 19-2", note: "Father's Day", eviteURL: "" },
    { date: "June 28", time: "12 PM", field: "Oglethorpe U.", opponent: "@Dragons", result: "W 14-9", note: "", eviteURL: "" },
    { date: "July 5", time: "", field: "", opponent: "No Game", result: "", note: "July 4th Weekend", eviteURL: "" },
    { date: "July 12", time: "4 PM", field: "Shamrock", opponent: "Barracudas", result: "L 8-3", note: "", eviteURL: "" },
    { date: "July 19", time: "12 PM", field: "Lakeside HS", opponent: "Mudcats", result: "T 6-6", note: "", eviteURL: "" },
    { date: "July 26", time: "12 PM", field: "Shamrock", opponent: "@Indians", result: "W 15-2", note: "", eviteURL: "" },
    { date: "Aug 2", time: "12 PM", field: "Lithia Springs HS", opponent: "McBluv", result: "W 9-0", note: "ff", eviteURL: "" },
    { date: "Aug 9", time: "140 PM ", field: "Campbell Middle School", opponent: "Giants", result: "L 10-0", note: "", eviteURL: "" },
    { date: "Aug 9", time: "11 AM", field: "Campbell Middle School", opponent: "@Giants", result: "L 6-8", note: "4/19 Make up game", eviteURL: "" },
    { date: "Aug 16", time: "12 PM", field: "Lakeside HS", opponent: "@Mudcats", result: "L 10-15", note: "", eviteURL: "" },
    { date: "Aug 23", time: "4PM", field: "Lakeside HS", opponent: "Indians", result: "Postponed", note: "Rain", eviteURL: "" },
    { date: "Aug 30", time: "4PM", field: "Lakeside HS", opponent: "Indians", result: "Rained Out", note: "4/23 make up game", eviteURL: "" },
    { date: "Sept 7", time: "", field: "", opponent: "No Game", result: "", note: "Labor Day Weekend", eviteURL: "" },
    { date: "Sep 12", time: "10 AM", field: "North Cobb", opponent: "@Cherokees", result: "L 0-1", note: "Playoff Game 1", eviteURL: "" },
    { date: "Sep 12", time: "1 PM", field: "North Cobb", opponent: "Cherokees", result: "L 6-0", note: "Playoff Game 2", eviteURL: "" },
    { date: "March 2016", time: "TBD", field: " TBD", opponent: "TBD", result: "", note: "", eviteURL: "" }
];

var games2016 = [
    { date: "April 3", time: "12 PM", field: "Druid Hills Middle", opponent: "Reds", result: "W 8-6", note: "Opening Day", eviteURL: "" },
    { date: "April 10", time: "12 PM", field: "Druid Hills Middle", opponent: "@Dragons", result: "L 6-8", note: "", eviteURL: "" },
    { date: "April 17", time: "", field: "", opponent: "No Game", result: "", note: "BYE", eviteURL: "" },
    { date: "April 24", time: "12 PM", field: "Druid Hills Middle", opponent: "@Rangers", result: "L 4-5", note: "", eviteURL: "" },
    { date: "May 1", time: "12 PM", field: "Druid Hills Middle", opponent: "Rangers", result: "L 11-9", note: "", eviteURL: "" },
    { date: "May 8", time: "", field: "", opponent: "No Game", result: "", note: "Mother's Day", eviteURL: "" },
    { date: "May 15", time: "12 PM", field: "North Cobb", opponent: "@Cherokees", result: "L 5-6", note: "", eviteURL: "" },
    { date: "May 22", time: "12 PM", field: "Druid Hills Middle", opponent: "@Reds", result: "W 10-1", note: "", eviteURL: "" },
    { date: "May 29", time: "", field: "", opponent: "No Game", result: "", note: "Memorial Day", eviteURL: "" },
    { date: "June 5", time: "12 PM", field: "Druid Hills Middle", opponent: "@Barracudas", result: "W 5-4", note: "", eviteURL: "" },
    { date: "June 12", time: "12 PM", field: "North Cobb", opponent: "Cherokees", result: "W 3-4", note: "", eviteURL: "" },
    { date: "June 19", time: "12 PM", field: "Lakeside", opponent: "Mudcats", result: "L 6-5", note: "", eviteURL: "" },
    { date: "June 26", time: "12 PM", field: "Druid Hills Middle", opponent: "Rockies", result: "W 12-6", note: "", eviteURL: "" },
    { date: "July 3", time: "", field: "", opponent: "No Game", result: "", note: "4th of July Weekend", eviteURL: "" },
    { date: "July 10", time: "12 PM", field: "Lakeside", opponent: "@Mudcats", result: "W 14-2", note: "", eviteURL: "" },
    { date: "July 17", time: "12 PM", field: "South Gwinett", opponent: "Dragons", result: "L 5-2", note: "", eviteURL: "" },
    { date: "July 24", time: "", field: "", opponent: "No Game", result: "", note: "BYE", eviteURL: "" },
    { date: "July 31", time: "4 PM", field: "Druid Hills Middle", opponent: "Raw Dawgs", result: "W 9-6", note: "", eviteURL: "" },
    { date: "August 7", time: "12 PM", field: "Druid Hills Middle", opponent: "@Titans", result: "L 6-5", note: "", eviteURL: "" },
    { date: "August 14", time: "12 PM", field: "Druid Hills Middle", opponent: "@Cobb Red Sox", result: "W 17-6", note: "", eviteURL: "" },
    { date: "August 21", time: "12 PM", field: "Druid Hills Middle", opponent: "@Bandits", result: "W 11-4", note: "", eviteURL: "" },
    { date: "August 28", time: "12 PM", field: "Druid Hills Middle", opponent: "Dragons (18+)", result: "W 18-0", note: "", eviteURL: "" },
    { date: "September 4", time: "", field: "", opponent: "No Game", result: "", note: "Labor Day Weekend", eviteURL: "" },
    { date: "September 11", time: "12 PM", field: "Druid Hills Middle", opponent: "Barracudas", result: "W 5-0", note: "", eviteURL: "" },
    { date: "September 17", time: "4 PM", field: "Druid Hills Middle", opponent: "Rangers", result: "W 5-2", note: "Saturday Wildcard - Round 1", eviteURL: "" },
    { date: "September 18", time: "12 PM", field: "Osborne HS", opponent: "Dragons", result: "L 6-1", note: "Semi Final Game 1", eviteURL: "" },
    { date: "September 25", time: "11 AM", field: "Druid Hills Middle", opponent: "Dragons", result: "L 5-3", note: "Semi Final Game 2", eviteURL: "" },
    { date: "March 26, 2017", time: "T B D", field: "T B D", opponent: "T B D", result: "", note: "", eviteURL: "" }
];

var games2017 = [
    { date: "September 25", time: "11 AM", field: "Druid Hills Middle", opponent: "Dragons", result: "L 5-3", note: "Semi Final Game 2", eviteURL: "" },
    { date: "March 26", time: "12 PM", field: "TBD", opponent: "TBD", result: "", note: "", eviteURL: "" }
];

var games2018 = [
    { date: "March 25", time: "12 PM", field: "Druid Hills Middle", opponent: "Reds", result: "W 7-3", note: "Opening Day", eviteURL: "" },
    { date: "April 8", time: "12 PM", field: "Druid Hills Middle", opponent: "Dragons", result: "L 4-8", note: "", eviteURL: "" },
    { date: "April 15", time: "12 PM", field: "North Cobb", opponent: "@Cherokees", result: "L 3-7", note: "", eviteURL: "" },
    { date: "April 22", time: "12 PM", field: "Druid Hills Middle", opponent: "Rangers", result: "W 6-4", note: "", eviteURL: "" },
    { date: "April 29", time: "", field: "", opponent: "No Game", result: "", note: "BYE", eviteURL: "" },
    { date: "May 6", time: "12 PM", field: "Druid Hills Middle", opponent: "@Barracudas", result: "W 9-2", note: "", eviteURL: "" },
    { date: "May 13", time: "", field: "", opponent: "No Game", result: "", note: "Mother's Day", eviteURL: "" },
    { date: "May 20", time: "12 PM", field: "Druid Hills Middle", opponent: "Mudcats", result: "W 11-5", note: "", eviteURL: "" },
    { date: "May 27", time: "", field: "", opponent: "No Game", result: "", note: "Memorial Day", eviteURL: "" },
    { date: "June 3", time: "12 PM", field: "Druid Hills Middle", opponent: "@Reds", result: "W 8-7", note: "", eviteURL: "" },
    { date: "June 10", time: "12 PM", field: "Druid Hills Middle", opponent: "Cherokees", result: "L 5-9", note: "", eviteURL: "" },
    { date: "June 17", time: "12 PM", field: "Druid Hills Middle", opponent: "@Rangers", result: "L 4-6", note: "", eviteURL: "" },
    { date: "July 1", time: "", field: "", opponent: "No Game", result: "", note: "4th of July Weekend", eviteURL: "" },
    { date: "July 8", time: "12 PM", field: "Druid Hills Middle", opponent: "Barracudas", result: "W 10-3", note: "", eviteURL: "" },
    { date: "July 15", time: "12 PM", field: "Lakeside", opponent: "@Mudcats", result: "W 12-4", note: "", eviteURL: "" },
    { date: "July 22", time: "12 PM", field: "Druid Hills Middle", opponent: "@Dragons", result: "L 3-7", note: "", eviteURL: "" },
    { date: "August 5", time: "12 PM", field: "Druid Hills Middle", opponent: "Titans", result: "W 8-2", note: "", eviteURL: "" },
    { date: "August 12", time: "", field: "", opponent: "No Game", result: "", note: "BYE", eviteURL: "" },
    { date: "August 19", time: "12 PM", field: "Druid Hills Middle", opponent: "Bandits", result: "W 14-1", note: "", eviteURL: "" },
    { date: "September 2", time: "", field: "", opponent: "No Game", result: "", note: "Labor Day Weekend", eviteURL: "" },
    { date: "September 9", time: "12 PM", field: "Druid Hills Middle", opponent: "Rangers", result: "W 6-2", note: "Playoff Round 1", eviteURL: "" },
    { date: "September 16", time: "12 PM", field: "Druid Hills Middle", opponent: "Cherokees", result: "L 4-7", note: "Semi Final", eviteURL: "" }
];

var games2019 = [
    { date: "March 24", time: "12 PM", field: "Druid Hills Middle", opponent: "Barracudas", result: "W 6-2", note: "Opening Day", eviteURL: "" },
    { date: "March 31", time: "12 PM", field: "Druid Hills Middle", opponent: "@Dragons", result: "L 3-9", note: "", eviteURL: "" },
    { date: "April 7", time: "12 PM", field: "North Cobb", opponent: "@Cherokees", result: "L 2-5", note: "", eviteURL: "" },
    { date: "April 14", time: "12 PM", field: "Druid Hills Middle", opponent: "Reds", result: "W 10-4", note: "", eviteURL: "" },
    { date: "April 21", time: "", field: "", opponent: "No Game", result: "", note: "Easter", eviteURL: "" },
    { date: "April 28", time: "12 PM", field: "Druid Hills Middle", opponent: "Rangers", result: "W 7-5", note: "", eviteURL: "" },
    { date: "May 5", time: "12 PM", field: "Druid Hills Middle", opponent: "@Mudcats", result: "W 8-3", note: "", eviteURL: "" },
    { date: "May 12", time: "", field: "", opponent: "No Game", result: "", note: "Mother's Day", eviteURL: "" },
    { date: "May 19", time: "12 PM", field: "Druid Hills Middle", opponent: "Cherokees", result: "L 4-8", note: "", eviteURL: "" },
    { date: "May 26", time: "", field: "", opponent: "No Game", result: "", note: "Memorial Day", eviteURL: "" },
    { date: "June 2", time: "12 PM", field: "Druid Hills Middle", opponent: "@Barracudas", result: "W 9-1", note: "", eviteURL: "" },
    { date: "June 9", time: "12 PM", field: "Druid Hills Middle", opponent: "Dragons", result: "L 5-10", note: "", eviteURL: "" },
    { date: "June 16", time: "12 PM", field: "Druid Hills Middle", opponent: "@Reds", result: "W 11-3", note: "", eviteURL: "" },
    { date: "June 23", time: "12 PM", field: "Druid Hills Middle", opponent: "@Rangers", result: "L 6-8", note: "", eviteURL: "" },
    { date: "June 30", time: "", field: "", opponent: "No Game", result: "", note: "4th of July Weekend", eviteURL: "" },
    { date: "July 14", time: "12 PM", field: "Lakeside", opponent: "Mudcats", result: "W 13-2", note: "", eviteURL: "" },
    { date: "July 21", time: "12 PM", field: "Druid Hills Middle", opponent: "Titans", result: "W 7-4", note: "", eviteURL: "" },
    { date: "July 28", time: "", field: "", opponent: "No Game", result: "", note: "BYE", eviteURL: "" },
    { date: "August 4", time: "12 PM", field: "Druid Hills Middle", opponent: "Bandits", result: "W 15-2", note: "", eviteURL: "" },
    { date: "August 11", time: "12 PM", field: "Druid Hills Middle", opponent: "@Titans", result: "W 9-5", note: "", eviteURL: "" },
    { date: "September 1", time: "", field: "", opponent: "No Game", result: "", note: "Labor Day Weekend", eviteURL: "" },
    { date: "September 8", time: "12 PM", field: "Druid Hills Middle", opponent: "Mudcats", result: "W 8-1", note: "Playoff Round 1", eviteURL: "" },
    { date: "September 15", time: "12 PM", field: "Druid Hills Middle", opponent: "Dragons", result: "L 3-6", note: "Semi Final", eviteURL: "" }
];

var games2020 = [
    { date: "March 15", time: "12 PM", field: "Druid Hills Middle", opponent: "TBD", result: "", note: "Season Cancelled - COVID-19", eviteURL: "" }
];

var games2021 = [
    { date: "April 11", time: "12 PM", field: "Druid Hills Middle", opponent: "Reds", result: "W 9-4", note: "Opening Day", eviteURL: "" },
    { date: "April 18", time: "12 PM", field: "Druid Hills Middle", opponent: "@Dragons", result: "L 2-8", note: "", eviteURL: "" },
    { date: "April 25", time: "12 PM", field: "North Cobb", opponent: "@Cherokees", result: "L 4-7", note: "", eviteURL: "" },
    { date: "May 2", time: "12 PM", field: "Druid Hills Middle", opponent: "Rangers", result: "W 8-5", note: "", eviteURL: "" },
    { date: "May 9", time: "", field: "", opponent: "No Game", result: "", note: "Mother's Day", eviteURL: "" },
    { date: "May 16", time: "12 PM", field: "Druid Hills Middle", opponent: "@Barracudas", result: "W 7-3", note: "", eviteURL: "" },
    { date: "May 23", time: "12 PM", field: "Lakeside", opponent: "Mudcats", result: "W 10-6", note: "", eviteURL: "" },
    { date: "May 30", time: "", field: "", opponent: "No Game", result: "", note: "Memorial Day", eviteURL: "" },
    { date: "June 6", time: "12 PM", field: "Druid Hills Middle", opponent: "Cherokees", result: "L 3-9", note: "", eviteURL: "" },
    { date: "June 13", time: "12 PM", field: "Druid Hills Middle", opponent: "@Reds", result: "W 12-4", note: "", eviteURL: "" },
    { date: "June 20", time: "12 PM", field: "Druid Hills Middle", opponent: "Dragons", result: "L 5-11", note: "", eviteURL: "" },
    { date: "June 27", time: "12 PM", field: "Druid Hills Middle", opponent: "@Rangers", result: "W 6-3", note: "", eviteURL: "" },
    { date: "July 4", time: "", field: "", opponent: "No Game", result: "", note: "4th of July", eviteURL: "" },
    { date: "July 11", time: "12 PM", field: "Druid Hills Middle", opponent: "Barracudas", result: "W 11-2", note: "", eviteURL: "" },
    { date: "July 18", time: "12 PM", field: "Lakeside", opponent: "@Mudcats", result: "W 9-5", note: "", eviteURL: "" },
    { date: "July 25", time: "", field: "", opponent: "No Game", result: "", note: "BYE", eviteURL: "" },
    { date: "August 1", time: "12 PM", field: "Druid Hills Middle", opponent: "Titans", result: "W 13-1", note: "", eviteURL: "" },
    { date: "August 8", time: "12 PM", field: "Druid Hills Middle", opponent: "Bandits", result: "W 8-4", note: "", eviteURL: "" },
    { date: "September 5", time: "", field: "", opponent: "No Game", result: "", note: "Labor Day", eviteURL: "" },
    { date: "September 12", time: "12 PM", field: "Druid Hills Middle", opponent: "Rangers", result: "W 7-2", note: "Playoff Round 1", eviteURL: "" },
    { date: "September 19", time: "12 PM", field: "Druid Hills Middle", opponent: "Cherokees", result: "L 5-8", note: "Semi Final", eviteURL: "" }
];

var games2022 = [
    { date: "March 27", time: "12 PM", field: "Druid Hills Middle", opponent: "Barracudas", result: "W 10-3", note: "Opening Day", eviteURL: "" },
    { date: "April 3", time: "12 PM", field: "Druid Hills Middle", opponent: "@Reds", result: "W 7-4", note: "", eviteURL: "" },
    { date: "April 10", time: "12 PM", field: "Druid Hills Middle", opponent: "Dragons", result: "L 4-9", note: "", eviteURL: "" },
    { date: "April 17", time: "", field: "", opponent: "No Game", result: "", note: "Easter", eviteURL: "" },
    { date: "April 24", time: "12 PM", field: "North Cobb", opponent: "@Cherokees", result: "L 3-6", note: "", eviteURL: "" },
    { date: "May 1", time: "12 PM", field: "Druid Hills Middle", opponent: "Rangers", result: "W 9-5", note: "", eviteURL: "" },
    { date: "May 8", time: "", field: "", opponent: "No Game", result: "", note: "Mother's Day", eviteURL: "" },
    { date: "May 15", time: "12 PM", field: "Druid Hills Middle", opponent: "@Mudcats", result: "W 8-3", note: "", eviteURL: "" },
    { date: "May 22", time: "12 PM", field: "Druid Hills Middle", opponent: "Cherokees", result: "L 6-10", note: "", eviteURL: "" },
    { date: "May 29", time: "", field: "", opponent: "No Game", result: "", note: "Memorial Day", eviteURL: "" },
    { date: "June 5", time: "12 PM", field: "Druid Hills Middle", opponent: "@Barracudas", result: "W 12-1", note: "", eviteURL: "" },
    { date: "June 12", time: "12 PM", field: "Druid Hills Middle", opponent: "Reds", result: "W 6-2", note: "", eviteURL: "" },
    { date: "June 19", time: "12 PM", field: "Druid Hills Middle", opponent: "@Dragons", result: "L 3-8", note: "", eviteURL: "" },
    { date: "June 26", time: "12 PM", field: "Druid Hills Middle", opponent: "@Rangers", result: "W 11-7", note: "", eviteURL: "" },
    { date: "July 3", time: "", field: "", opponent: "No Game", result: "", note: "4th of July Weekend", eviteURL: "" },
    { date: "July 10", time: "12 PM", field: "Lakeside", opponent: "Mudcats", result: "W 14-3", note: "", eviteURL: "" },
    { date: "July 17", time: "12 PM", field: "Druid Hills Middle", opponent: "Titans", result: "W 9-1", note: "", eviteURL: "" },
    { date: "July 24", time: "", field: "", opponent: "No Game", result: "", note: "BYE", eviteURL: "" },
    { date: "August 7", time: "12 PM", field: "Druid Hills Middle", opponent: "Bandits", result: "W 10-5", note: "", eviteURL: "" },
    { date: "September 4", time: "", field: "", opponent: "No Game", result: "", note: "Labor Day Weekend", eviteURL: "" },
    { date: "September 11", time: "12 PM", field: "Druid Hills Middle", opponent: "Barracudas", result: "W 8-2", note: "Playoff Round 1", eviteURL: "" },
    { date: "September 18", time: "12 PM", field: "Druid Hills Middle", opponent: "Dragons", result: "L 4-7", note: "Semi Final", eviteURL: "" }
];

var games2023 = [
    { date: "March 26", time: "12 PM", field: "Druid Hills Middle", opponent: "Reds", result: "W 8-3", note: "Opening Day", eviteURL: "" },
    { date: "April 2", time: "12 PM", field: "Druid Hills Middle", opponent: "@Dragons", result: "L 5-12", note: "", eviteURL: "" },
    { date: "April 9", time: "", field: "", opponent: "No Game", result: "", note: "Easter", eviteURL: "" },
    { date: "April 16", time: "12 PM", field: "North Cobb", opponent: "@Cherokees", result: "L 2-6", note: "", eviteURL: "" },
    { date: "April 23", time: "12 PM", field: "Druid Hills Middle", opponent: "Rangers", result: "W 9-4", note: "", eviteURL: "" },
    { date: "April 30", time: "12 PM", field: "Druid Hills Middle", opponent: "@Barracudas", result: "W 7-2", note: "", eviteURL: "" },
    { date: "May 7", time: "12 PM", field: "Lakeside", opponent: "Mudcats", result: "W 11-5", note: "", eviteURL: "" },
    { date: "May 14", time: "", field: "", opponent: "No Game", result: "", note: "Mother's Day", eviteURL: "" },
    { date: "May 21", time: "12 PM", field: "Druid Hills Middle", opponent: "Cherokees", result: "L 4-9", note: "", eviteURL: "" },
    { date: "May 28", time: "", field: "", opponent: "No Game", result: "", note: "Memorial Day", eviteURL: "" },
    { date: "June 4", time: "12 PM", field: "Druid Hills Middle", opponent: "@Reds", result: "W 10-2", note: "", eviteURL: "" },
    { date: "June 11", time: "12 PM", field: "Druid Hills Middle", opponent: "Dragons", result: "L 3-8", note: "", eviteURL: "" },
    { date: "June 18", time: "12 PM", field: "Druid Hills Middle", opponent: "@Rangers", result: "W 6-5", note: "", eviteURL: "" },
    { date: "June 25", time: "12 PM", field: "Druid Hills Middle", opponent: "Barracudas", result: "W 13-1", note: "", eviteURL: "" },
    { date: "July 2", time: "", field: "", opponent: "No Game", result: "", note: "4th of July Weekend", eviteURL: "" },
    { date: "July 9", time: "12 PM", field: "Lakeside", opponent: "@Mudcats", result: "W 9-4", note: "", eviteURL: "" },
    { date: "July 16", time: "12 PM", field: "Druid Hills Middle", opponent: "Titans", result: "W 14-2", note: "", eviteURL: "" },
    { date: "July 23", time: "", field: "", opponent: "No Game", result: "", note: "BYE", eviteURL: "" },
    { date: "August 6", time: "12 PM", field: "Druid Hills Middle", opponent: "Bandits", result: "W 8-3", note: "", eviteURL: "" },
    { date: "August 13", time: "12 PM", field: "Druid Hills Middle", opponent: "@Titans", result: "W 10-1", note: "", eviteURL: "" },
    { date: "September 3", time: "", field: "", opponent: "No Game", result: "", note: "Labor Day Weekend", eviteURL: "" },
    { date: "September 10", time: "12 PM", field: "Druid Hills Middle", opponent: "Mudcats", result: "W 7-3", note: "Playoff Round 1", eviteURL: "" },
    { date: "September 17", time: "12 PM", field: "Druid Hills Middle", opponent: "Dragons", result: "L 5-9", note: "Semi Final", eviteURL: "" }
];

var games2024 = [
    { date: "March 24", time: "12 PM", field: "Druid Hills Middle", opponent: "Barracudas", result: "W 11-4", note: "Opening Day", eviteURL: "" },
    { date: "March 31", time: "", field: "", opponent: "No Game", result: "", note: "Easter", eviteURL: "" },
    { date: "April 7", time: "12 PM", field: "Druid Hills Middle", opponent: "@Reds", result: "W 8-5", note: "", eviteURL: "" },
    { date: "April 14", time: "12 PM", field: "Druid Hills Middle", opponent: "Dragons", result: "L 3-10", note: "", eviteURL: "" },
    { date: "April 21", time: "12 PM", field: "North Cobb", opponent: "@Cherokees", result: "L 5-8", note: "", eviteURL: "" },
    { date: "April 28", time: "12 PM", field: "Druid Hills Middle", opponent: "Rangers", result: "W 9-6", note: "", eviteURL: "" },
    { date: "May 5", time: "12 PM", field: "Druid Hills Middle", opponent: "@Barracudas", result: "W 7-2", note: "", eviteURL: "" },
    { date: "May 12", time: "", field: "", opponent: "No Game", result: "", note: "Mother's Day", eviteURL: "" },
    { date: "May 19", time: "12 PM", field: "Lakeside", opponent: "Mudcats", result: "W 12-3", note: "", eviteURL: "" },
    { date: "May 26", time: "", field: "", opponent: "No Game", result: "", note: "Memorial Day", eviteURL: "" },
    { date: "June 2", time: "12 PM", field: "Druid Hills Middle", opponent: "Cherokees", result: "L 4-7", note: "", eviteURL: "" },
    { date: "June 9", time: "12 PM", field: "Druid Hills Middle", opponent: "@Dragons", result: "L 2-9", note: "", eviteURL: "" },
    { date: "June 16", time: "12 PM", field: "Druid Hills Middle", opponent: "Reds", result: "W 10-3", note: "", eviteURL: "" },
    { date: "June 23", time: "12 PM", field: "Druid Hills Middle", opponent: "@Rangers", result: "W 8-4", note: "", eviteURL: "" },
    { date: "June 30", time: "", field: "", opponent: "No Game", result: "", note: "4th of July Weekend", eviteURL: "" },
    { date: "July 7", time: "12 PM", field: "Lakeside", opponent: "@Mudcats", result: "W 15-2", note: "", eviteURL: "" },
    { date: "July 14", time: "12 PM", field: "Druid Hills Middle", opponent: "Titans", result: "W 11-1", note: "", eviteURL: "" },
    { date: "July 21", time: "", field: "", opponent: "No Game", result: "", note: "BYE", eviteURL: "" },
    { date: "August 4", time: "12 PM", field: "Druid Hills Middle", opponent: "Bandits", result: "W 13-4", note: "", eviteURL: "" },
    { date: "August 11", time: "12 PM", field: "Druid Hills Middle", opponent: "@Titans", result: "W 9-2", note: "", eviteURL: "" },
    { date: "September 1", time: "", field: "", opponent: "No Game", result: "", note: "Labor Day Weekend", eviteURL: "" },
    { date: "September 8", time: "12 PM", field: "Druid Hills Middle", opponent: "Rangers", result: "W 6-1", note: "Playoff Round 1", eviteURL: "" },
    { date: "September 15", time: "12 PM", field: "Druid Hills Middle", opponent: "Cherokees", result: "L 3-5", note: "Semi Final", eviteURL: "" }
];

var games2025 = [
    { date: "March 23", time: "12 PM", field: "Druid Hills Middle", opponent: "Reds", result: "", note: "Opening Day", eviteURL: "" },
    { date: "March 30", time: "12 PM", field: "Druid Hills Middle", opponent: "@Dragons", result: "", note: "", eviteURL: "" },
    { date: "April 6", time: "12 PM", field: "North Cobb", opponent: "@Cherokees", result: "", note: "", eviteURL: "" },
    { date: "April 13", time: "12 PM", field: "Druid Hills Middle", opponent: "Rangers", result: "", note: "", eviteURL: "" },
    { date: "April 20", time: "", field: "", opponent: "No Game", result: "", note: "Easter", eviteURL: "" },
    { date: "April 27", time: "12 PM", field: "Druid Hills Middle", opponent: "@Barracudas", result: "", note: "", eviteURL: "" },
    { date: "May 4", time: "12 PM", field: "Lakeside", opponent: "Mudcats", result: "", note: "", eviteURL: "" },
    { date: "May 11", time: "", field: "", opponent: "No Game", result: "", note: "Mother's Day", eviteURL: "" },
    { date: "May 18", time: "12 PM", field: "Druid Hills Middle", opponent: "Cherokees", result: "", note: "", eviteURL: "" },
    { date: "May 25", time: "", field: "", opponent: "No Game", result: "", note: "Memorial Day", eviteURL: "" },
    { date: "June 1", time: "12 PM", field: "Druid Hills Middle", opponent: "@Reds", result: "", note: "", eviteURL: "" },
    { date: "June 8", time: "12 PM", field: "Druid Hills Middle", opponent: "Dragons", result: "", note: "", eviteURL: "" },
    { date: "June 15", time: "12 PM", field: "Druid Hills Middle", opponent: "@Rangers", result: "", note: "", eviteURL: "" },
    { date: "June 22", time: "12 PM", field: "Druid Hills Middle", opponent: "Barracudas", result: "", note: "", eviteURL: "" },
    { date: "June 29", time: "", field: "", opponent: "No Game", result: "", note: "4th of July Weekend", eviteURL: "" },
    { date: "July 6", time: "12 PM", field: "Lakeside", opponent: "@Mudcats", result: "", note: "", eviteURL: "" },
    { date: "July 13", time: "12 PM", field: "Druid Hills Middle", opponent: "Titans", result: "", note: "", eviteURL: "" },
    { date: "July 20", time: "", field: "", opponent: "No Game", result: "", note: "BYE", eviteURL: "" },
    { date: "August 3", time: "12 PM", field: "Druid Hills Middle", opponent: "Bandits", result: "", note: "", eviteURL: "" },
    { date: "August 10", time: "12 PM", field: "Druid Hills Middle", opponent: "@Titans", result: "", note: "", eviteURL: "" },
    { date: "August 31", time: "", field: "", opponent: "No Game", result: "", note: "Labor Day Weekend", eviteURL: "" }
];

var allSeasons = {
    2015: games2015,
    2016: games2016,
    2017: games2017,
    2018: games2018,
    2019: games2019,
    2020: games2020,
    2021: games2021,
    2022: games2022,
    2023: games2023,
    2024: games2024,
    2025: games2025
};

async function seed() {
    var client = await pool.connect();
    try {
        var existing = await client.query('SELECT COUNT(*) as count FROM seasons');
        if (parseInt(existing.rows[0].count) > 0) {
            console.log('Database already seeded (' + existing.rows[0].count + ' seasons found). Skipping seed.');
            client.release();
            return;
        }

        await client.query('BEGIN');

        await client.query('DELETE FROM schedule_events');
        await client.query('DELETE FROM seasons');
        await client.query('DELETE FROM admin_users');

        var hash = bcrypt.hashSync('admin123', 10);
        await client.query(
            'INSERT INTO admin_users (username, password_hash) VALUES ($1, $2)',
            ['admin', hash]
        );

        var years = Object.keys(allSeasons).sort();
        for (var i = 0; i < years.length; i++) {
            var year = parseInt(years[i]);
            var games = allSeasons[year];

            var seasonResult = await client.query(
                'INSERT INTO seasons (year) VALUES ($1) RETURNING id',
                [year]
            );
            var seasonId = seasonResult.rows[0].id;

            for (var j = 0; j < games.length; j++) {
                var g = games[j];
                await client.query(
                    'INSERT INTO schedule_events (season_id, event_date, event_time, field, opponent, result, note, evite_url, sort_order) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
                    [seasonId, g.date, g.time, g.field, g.opponent, g.result, g.note, g.eviteURL, j]
                );
            }
            console.log('Seeded ' + games.length + ' events for ' + year);
        }

        await client.query('COMMIT');
        console.log('Seed completed successfully');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Seed failed:', err);
        throw err;
    } finally {
        client.release();
    }
}

if (require.main === module) {
    seed().then(function () {
        process.exit(0);
    }).catch(function () {
        process.exit(1);
    });
}

module.exports = seed;
