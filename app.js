const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");  
var mysql = require('mysql');
const {google} = require('googleapis');
const url = require('url');
const session = require('express-session');
var genuuid=require('uuid/v4');
const { ConsoleReporter } = require('jasmine');

const app = express();

app.use(cors());
app.use(express.json()); 

const oAuth2Client = new google.auth.OAuth2(
    "790181222647-97ed31co551pqqfpfu4663lbu3qtuuab.apps.googleusercontent.com",
    "-PDWRxmAPnDhdtjbCcm-EXBL",
    "http://localhost:4200"
);

const scopes = ["https://www.googleapis.com/auth/userinfo.email"];

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

app.use(session({
    genid: function(req) {
        return genuuid() // use UUIDs for session IDs
    },
    secret: 'Passw0rd!',
    resave: false,
    saveUninitialized: false,
    cookie: {secure : false, expires: (30 * 24 * 3600 * 1000)} //30 days
}));

app.all("/api/*", function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});


app.get('/connexion', async (req,res) => {
    var codeUrl = req.originalUrl.split('?')[1];
    if(!codeUrl) {
        const url = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes
        });
        res.send(url)
    } else {
        try {
            const qs = new url.URL(req.url, 'http://localhost:8888').searchParams;
            var code = qs.get('code');
            const r = await oAuth2Client.getToken(code);
            oAuth2Client.setCredentials(r.tokens);
            const tokenInfo = await oAuth2Client.getTokenInfo(r.tokens.access_token, r.tokens.refresh_token);
            var toreturn = [{token: r.tokens.access_token, infos: tokenInfo}]
            res.send(toreturn);
        }
        catch (error) {
            console.log(error)
        }
    } 
})

app.get('/confirmconnexion', async (req,res) => {
    try {
        var access_token = req.originalUrl.split('?')[1];
        oAuth2Client.setCredentials({
            access_token: access_token
        });
        res.send(true);
    }
    catch (error) {
        console.log(error)
    }
})

app.get('/api/droits', (req,res) => {
    var mail = (req.originalUrl.split('?')[1]).substring(5);
    var sql = "SELECT isDispatch, isAdmin, isSuperAdmin FROM User WHERE name='" + mail + "';";
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
})

app.get('/api/getallusers', (req,res) => {
    var sql = "SELECT * FROM User ORDER BY name;";
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
})

app.post('/api/newuser', (req,res) => {
    var user = req.body.name;
    let sql = "INSERT INTO User (name, isSuperAdmin, isAdmin, isDispatch) values ('" + user + "', 0, 0, 0);"
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

app.post('/api/updateuser', (req,res) => {
    var user = req.body.name;
    var isSuperAdmin = req.body.superadmin;
    var isAdmin = req.body.admin;
    var isDispatch = req.body.dispatch;
    let sql = "UPDATE User SET isSuperAdmin = " + isSuperAdmin + ", isAdmin = " + isAdmin + ", isDispatch = "+ isDispatch + " where name = '" + user + "';";
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

oAuth2Client.on('tokens', (tokens) => {
    if (tokens.refresh_token) {
        console.log(tokens.refresh_token);
    }
    console.log(tokens.access_token);
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

app.get('/api/statsByInter', (req, res) => {
    var id = (req.originalUrl.split('?')[1]).substring(3);
    var sql = "SELECT idVol FROM Flights WHERE idInter=" + id;
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

app.get('/api/intervention', (req, res) => {
    var id = (req.originalUrl.split('?')[1]).substring(3);
    var sql = "SELECT * FROM Interventions where idInter=" + id;
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

app.post('/api/newaddress', (req,res) => {
    var commune = req.body.commune;
    var street = req.body.street;
    var idInter = req.body.idInter;
    let sql = "UPDATE Interventions SET commune = '" + commune + "', street = '" + street + "' WHERE idInter = " + idInter + ";"
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

app.post('/api/editvideoname', (req,res) => {
    var newname = req.body.newname;
    var fileName = req.body.fileName;
    if(newname.includes("'")) {
        newname = newname.replace(/'/g, "''");
    }
    let sql = "UPDATE Videos SET videoName = '" + newname + "' where fileName = '" + fileName + "';";
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

app.post('/api/editinterventionname', (req,res) => {
    var newname = req.body.newname;
    var idInter = req.body.idInter;
    if(newname.includes("'")) {
        newname = newname.replace(/'/g, "''");
    }
    let sql = "UPDATE Interventions SET name = '" + newname + "' where idInter = '" + idInter + "';";
    con.query(sql, function (err, result) {
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
    let sql = "INSERT INTO Videos (fileName, recordTime, videoName) VALUES ('" + fileName + "','" + recordTime + "','" + fileName + "');";
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

app.post('/api/newinter', (req,res) => {
    var startTime = req.body.startTime;
    let sql = "INSERT INTO Interventions (startTime) VALUES ('" + startTime + "');";
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

app.post('/api/intertovideo', (req,res) => {
    var fileName = req.body.fileName;
    var idInter = req.body.idInter
    let sql = "UPDATE Videos SET idInter = '" + idInter + "' WHERE fileName = '" + fileName + "';";
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

app.post('/api/newflight', (req,res) => {
    var idInter = req.body.idInter;
    var startTime = req.body.startTime;
    var flightTime = req.body.flightTime;
    var startLatitude = req.body.startLatitude;
    var startLongitude = req.body.startLongitude;
    var batteryGraph = req.body.batteryGraph;
    var heightGraph = req.body.heightGraph;
    var maxHeight = req.body.maxHeight;
    let sql = "INSERT INTO Flights (idInter, startTime, flightTime, startLatitude, startLongitude, batteryGraph, heightGraph, maxHeight) VALUES (" + idInter + ",'" + startTime + "'," + flightTime + ",'" + startLatitude + "','" + startLongitude + "','" + batteryGraph + "','" + heightGraph + "'," + maxHeight + ");";
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

app.post('/api/newwarnings', (req,res) => {
    var idVol = req.body.idVol;
    var heure = req.body.heure;
    var warning = req.body.warn;
    if(warning.includes("'")) {
        warning = warning.replace(/'/g, "''");
    }
    let sql = "INSERT INTO Warnings (idVol, warning, time) VALUES (" + idVol + ",'" + warning + "','" + heure + "');";
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

app.get('/api/getwarnings', (req,res) => {
    var idVol = (req.originalUrl.split('?')[1]).substring(3);
    let sql = "select * from Warnings where idVol = " + idVol + ";"
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
    let sql = "select idInter,recordTime from Videos where recordTime = (select MAX(recordTime) from Videos where idInter is not null);"
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