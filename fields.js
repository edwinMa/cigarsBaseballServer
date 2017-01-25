var debug = require ('./debug');

/*
var aField = {
    name: "Marcial Park",
    id: "1",
    lat: "55",
    long: "75",
    marker: "",
    address: "Grayton Beach, FL",

    build: function (name, id, lat, long, marker, address) 
    {
        this.name = name;
        this.id = id;
        this.lat = lat;
        this.long = long;
        this.marker = null;
        this.address = address;
    }
}

const NumFields = 10;

function Fields()
{
    this.fields = [];

    // create field objects based on aField prototype
    for (j = 0; j < NumFields; j++)
    {
        this.fields.push (Object.create (aField));
    }
    
    // populate fields with specific field properties
    var index=0;
    this.fields[index++].build("Lakeside High School", "lakeside", 33.8453, -84.2848, "3801 Briarcliff Rd NE, Atlanta, GA 30345");
    this.fields[index++].build("Tucker High School", "tucker", 33.856215, -84.215753, "5036 Lavista Rd, Tucker, GA 30084");
    this.fields[index++].build("Druid Hills Middle School (Shamrock)", "shamrock", 33.81914, -84.274298, "3100 Mt Olive Dr, Decatur, GA 30033");
    this.fields[index++].build("North Cobb High School", "northCobb", 34.0409756, -84.6483621, "3601 Nowlin Rd, Kennesaw, GA 30144");
    this.fields[index++].build("Osborne High School", "osborne", 33.89208, -84.565659, "2451 Favor Rd SW, Marietta, GA 30060");
    this.fields[index++].build("Oglethorpe University", "oglethorpe", 33.8750, -84.3330, "4484 Peachtree Rd, Atlanta, GA 30319");
    // this.fields[index++].build("Holy Spirit Catholic Church", "holySpirit", 33.877268, -84.411387, "4465 Northside Dr NW, Atlanta, GA 30327");
    this.fields[index++].build("Lithia Springs High School", "lithiaSprings", 33.755571, -84.657863, "2520 E County Line Rd, Lithia Springs, GA 30122");
    this.fields[index++].build("Dunwoody High School", "dunwoody", 33.9452548, -84.314946, "5035 Vermack Rd, Dunwoody, GA 30338");
    this.fields[index++].build("South Gwinett High School", "southGwinett", 33.8540569, -84.0075551, "2288 E Main St, Snellville, GA 30078");
    this.fields[index++].build("Grand Slam Golf & Baseball", "grandSlamCage", 33.812883, -84.29490, "3352 N Druid Hills Rd, Decatur, GA 30033");
    
        
    for (j = 0; j < NumFields; j++)
    {
        debug (this.fields [j].name);
    }


    this.getFields = function()
    {
        var result = this.fields;
        debug(result);
        return (result);
    }
}
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

Field.prototype = {
    // set constructors 
    constructor: Field,

    // set methods
    toString: function () {
        return (this.name);
    }
};


function Fields()
{
    this.fields = [
        new Field("Lakeside High School", "lakeside", 33.8453, -84.2848, "3801 Briarcliff Rd NE, Atlanta, GA 30345"),
        new Field("Tucker High School", "tucker", 33.856215, -84.215753, "5036 Lavista Rd, Tucker, GA 30084"),
        new Field("Druid Hills Middle School (Shamrock)", "shamrock", 33.81914, -84.274298, "3100 Mt Olive Dr, Decatur, GA 30033"),
        new Field("North Cobb High School", "northCobb", 34.0409756, -84.6483621, "3601 Nowlin Rd, Kennesaw, GA 30144"),
        new Field("Osborne High School", "osborne", 33.89208, -84.565659, "2451 Favor Rd SW, Marietta, GA 30060"),
        new Field("Oglethorpe University", "oglethorpe", 33.8750, -84.3330, "4484 Peachtree Rd, Atlanta, GA 30319"),
        //new Field("Holy Spirit Catholic Church", "holySpirit", 33.877268, -84.411387, "4465 Northside Dr NW, Atlanta, GA 30327"),
        new Field("Lithia Springs High School", "lithiaSprings", 33.755571, -84.657863, "2520 E County Line Rd, Lithia Springs, GA 30122"),
        new Field("Dunwoody High School", "dunwoody", 33.9452548, -84.314946, "5035 Vermack Rd, Dunwoody, GA 30338"),
        new Field("South Gwinett High School", "southGwinett", 33.8540569, -84.0075551, "2288 E Main St, Snellville, GA 30078"),
        new Field("Grand Slam Golf & Baseball", "grandSlamCage", 33.812883, -84.29490, "3352 N Druid Hills Rd, Decatur, GA 30033")
    ];

    /*
    this.getFields = function()
    {
        var result = this.fields;
        debug(result);
        return (result);
    }
    */

}

Fields.prototype = {
    // set constructors 
    constructor: Fields,

    // set methods
    getFields: function()
    {
        var result = this.fields;
        debug("getFields returning: " + result);

        return (result);
    }
};


module.exports = new Fields();