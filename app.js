const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");  
var mysql = require('mysql');

const app = express();

app.use(cors());
app.use(express.json());

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Craft13Zeph$$$",
    database: "drone"
});

con.connect(function(err) {
    if (err) {
        console.log(err);
        throw err;
    }
    console.log("Connected!");
});

app.all("/api/*", function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});

app.get('/api/videoFileNameList', (req, res) => {
    con.query("SELECT fileName FROM Videos", function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

app.get('/api/videoByInter', (req, res) => {
    var id = (req.originalUrl.split('?')[1]).substring(3);
    var sql = "SELECT * FROM Videos WHERE idInter=" + id;
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

app.get('/api/interventions', (req, res) => {
    con.query("SELECT * FROM Interventions ORDER BY startTime DESC", function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

app.get('/api/interflight', (req, res) => {
    var id = (req.originalUrl.split('?')[1]).substring(3);
    let sql = "SELECT * FROM Flights WHERE idInter=" + id;
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

app.get('/api/livedata', (req, res) => {
    var idVol = (req.originalUrl.split('?')[1]).substring(3);
    let sql = "SELECT * FROM LiveData WHERE idVol=" + idVol;
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

app.post('/api/newvideo', (req,res) => {
    var fileName = req.body.fileName;
    var recordTime = req.body.recordTime;
    let sql = "INSERT INTO Videos (fileName, recordTime) VALUES ('" + fileName + "','" + recordTime + "');";
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

app.post('/api/newinter', (req,res) => {
    var idInter = req.body.idInter;
    var startTime = req.body.startTime;
    let sql = "INSERT INTO Interventions (idInter, startTime) VALUES (" + idInter + ",'" + startTime + "');";
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

app.post('/api/intertovideo', (req,res) => {
    var fileName = req.body.fileName;
    var idInter = req.body.idInter
    // var videoName = req.body.videoName;
    var recordTime = req.body.recordTime;
    let sql = "UPDATE Videos SET idInter = '" + idInter + "' WHERE fileName = '" + fileName + "';";
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

app.post('/api/newflight', (req,res) => {
    var idInter = req.body.idInter
    var startTime = req.body.startTime
    var flightTime = req.body.flightTime
    var startLatitude = req.body.startLatitude
    var startLongitude = req.body.startLongitude
    var batteryGraph = req.body.batteryGraph
    var heightGraph = req.body.heightGraph
    // var batteryGraph = "1"
    // var heightGraph = "1"
    let sql = "INSERT INTO Flights (idInter, startTime, flightTime, startLatitude, startLongitude, batteryGraph, heightGraph) VALUES (" + idInter + ",'" + startTime + "'," + flightTime + ",'" + startLatitude + "','" + startLongitude + "','" + batteryGraph + "','" + heightGraph + "');";
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

app.post('/api/newdataflight', (req,res) => {
    var idVol = req.body.idVol
    var hour = req.body.hour
    var time = req.body.time
    var latitude = req.body.latitude
    var longitude = req.body.longitude
    var height = req.body.height
    var battery = req.body.battery
    var aircraftYaw = req.body.aircraftYaw
    var gimbalYaw = req.body.gimbalYaw
    let sql = "INSERT INTO LiveData (idVol, hour, time, latitude, longitude, height, battery, aircraftYaw, gimbalYaw) VALUES (" + idVol + ",'" + hour + "','" + time + "','" + latitude + "','" + longitude + "','" + height + "'," + battery + ",'" + aircraftYaw + "','" + gimbalYaw + "');";
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

app.get('/api/lastflight', (req,res) => {
    let sql = "select idVol from Flights where idVol = (Select MAX(idVol) from Flights);"
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

app.get('/api/lastinter', (req,res) => {
    let sql = "select idInter, startTime from Interventions where idInter = (Select MAX(idInter) from Videos);"
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

app.get('/api/unassignedVideos', (req,res) => {
    let sql = "select * from Videos where idInter is NULL ORDER BY recordTime DESC;"
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

console.log("App listening on localhost:8888")
app.listen(8888, "localhost");