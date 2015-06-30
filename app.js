//var util = require('util');
var SerialPort = require('serialport').SerialPort;
var xbee_api = require('xbee-api');
var C = xbee_api.constants;
//Database setup files
var mongoose = require('mongoose');
var database = require('./config/database');
mongoose.connect(database.url); // connect to our database

//setup database variables
var myvalue = mongoose.model('myvalue', { 
    SensorID: String,
    SensorTime: String,
    SensorVal: Number
}); 

//XBee config
var xbeeAPI = new xbee_api.XBeeAPI({
    api_mode: 1,
    module: "Any",
    raw_frames: true
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
        var timeArray = timeString.split(" GMT");
        var currentTime = timeArray[0];       
        //parse contents
        var stringdata = String(data);
        var dataArray = stringdata.split(' ');
        var id = dataArray[0];
        var value = dataArray[1];
        if ((id == "1111" || id == "2222") && (value != "" && value != " "))
        {
            console.log("ID#: " + id + ", Time: " + currentTime + ", Value: " + value);
            //Write to DB
            var dataWrite = new myvalue({ SensorID: id, SensorTime: currentTime, SensorVal: value })
            dataWrite.save(function (err, dataWrite) {
                if (err) return console.error(err);
            });
        }
    });
});
