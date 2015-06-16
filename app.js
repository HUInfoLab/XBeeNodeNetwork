var util = require('util');
var SerialPort = require('serialport').SerialPort;
var xbee_api = require('xbee-api');
var C = xbee_api.constants;
//MEAN Stack setup files
var mongoose = require('mongoose');
var express  = require('express');
var app      = express();                               // create our app w/ express
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)


//XBee config
var xbeeAPI = new xbee_api.XBeeAPI({
    api_mode: 1,
    module: "Any",
    raw_frames: true
});

//config
var database = require('./config/database');
mongoose.connect(database.url); // connect to our database
/*
app.use(express.static(__dirname + '/public')); // set the static files location /public/img
app.use(morgan('dev'));  // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));  // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); //parse app/vnd.api+json as json
app.use(methodOverride());

// listen (start app with node app)
app.listen(8080);
console.log("App listening on port 8080");
*/

//setup database variables
var myvalue = mongoose.model('myvalue', { 
    SensorID: String,
    SensorTime: String,
    SensorVal: Number
}); 
 

//SerialPort config
var serialport = new SerialPort("/dev/ttyAMA0", {
  baudrate: 9600,
  //parser: xbeeAPI.rawParser()
});

//get data from serial port
serialport.on("open", function () {
    console.log('open');
    serialport.on('data', function(data) {
        //get timestamp
        var timeString = String(new Date());
        var timeArray = timeString.split(" ");
        var currentTime = timeArray[4];
        //parse contents
        var stringdata = String(data);
        var dataArray = stringdata.split(" ");
        var id = dataArray[0];
        var value = dataArray[1];
        console.log("ID#: " + id + ", Time: " + currentTime + ", Value: " + value);
        //Write to DB
        var dataWrite = new myvalue({ SensorID: id, SensorTime: currentTime, SensorVal: value })
        dataWrite.save(function (err, dataWrite) {
            if (err) return console.error(err);
        });
    });
});

/*
//Read from DB
app.get('/api/myvalues', function(req, res) { //print values to webpage
    myvalue.find(function (err, myvalues) {
        if (err) res.send(err);
        res.json(myvalues); // return all myvalues in JSON format
    });
});    

// application -------------------------------------------------------------
app.get('*', function(req, res) {
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});
*/
