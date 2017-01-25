var config = require('./config.json');

var DEBUG = config.debug;

debug = function (message)
{
    if (DEBUG)
    {
        console.log("Cigarsbaseball Server:" + message);
    }
};

module.exports = debug;