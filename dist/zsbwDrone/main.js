(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! C:\Pro\Ephec\3TI\TFE\Drone\Site\zsbwDrone_guest\src\main.ts */"zUnb");


/***/ }),

/***/ 1:
/*!******************************!*\
  !*** min-document (ignored) ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ "24Si":
/*!******************************************************!*\
  !*** ./src/app/cartography/cartography.component.ts ***!
  \******************************************************/
/*! exports provided: CartographyComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CartographyComponent", function() { return CartographyComponent; });
/* harmony import */ var ol_Map__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ol/Map */ "Xu5n");
/* harmony import */ var ol_View__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ol/View */ "oscj");
/* harmony import */ var ol_layer_Tile__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ol/layer/Tile */ "SAzV");
/* harmony import */ var ol_source_OSM__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ol/source/OSM */ "0OmE");
/* harmony import */ var ol_proj__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ol/proj */ "JW8z");
/* harmony import */ var ol_source_vector__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ol/source/vector */ "At+4");
/* harmony import */ var ol_layer_vector__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ol/layer/vector */ "5nHY");
/* harmony import */ var ol__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ol */ "nXkb");
/* harmony import */ var ol_geom_LineString__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ol/geom/LineString */ "egkh");
/* harmony import */ var ol_style_Style__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ol/style/Style */ "bHcU");
/* harmony import */ var ol_style_Fill__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ol/style/Fill */ "g6Z0");
/* harmony import */ var ol_style_Stroke__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ol/style/Stroke */ "hoJM");
/* harmony import */ var ol_geom_Point__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ol/geom/Point */ "9ANI");
/* harmony import */ var ol_style_Circle__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ol/style/Circle */ "zixo");














class CartographyComponent {
    constructor(http) {
        this.http = http;
        this.dataJson = [];
        this.coordinate = [0, 0];
        this.currentHour = "00h00m00s";
        this.currentFlightTime = "00m00s";
        this.currentBatteryLevel = 0;
        this.currentHeight = 0;
        this.currentAcYaw = 0;
        this.currentGbYaw = 0;
        this.styleArrowAircraft = {};
        this.styleArrowGimbal = {};
    }
    onPointerMoveAndClick(evt) {
        var heureDate = "";
        var tempsVol = 0;
        var batteryPercent = 0;
        var height = 0;
        var acYaw = 0;
        var gbYaw = 0;
        var points = evt.coordinate;
        this.coordinate = Object(ol_proj__WEBPACK_IMPORTED_MODULE_4__["transform"])(points, 'EPSG:3857', 'EPSG:4326');
        var featureSelected = this.vectorLine.getClosestFeatureToCoordinate(evt.coordinate);
        this.drawClosestPoint(featureSelected);
        heureDate = featureSelected.values_.properties[0].date;
        tempsVol = featureSelected.values_.properties[1].flightTime;
        batteryPercent = featureSelected.values_.properties[2].battery;
        height = featureSelected.values_.properties[3].height;
        acYaw = featureSelected.values_.properties[4].aircraftYaw;
        gbYaw = featureSelected.values_.properties[5].gimbalYaw;
        this.lastFeature = featureSelected;
        this.styleArrowAircraft = { 'transform': ('rotate(' + acYaw + 'deg)') };
        this.styleArrowGimbal = { 'transform': ('rotate(' + gbYaw + 'deg)') };
        this.currentHour = this.changeHourFormat(heureDate);
        this.currentFlightTime = this.changeFlightTimeFormat(tempsVol.toString());
        this.currentBatteryLevel = batteryPercent;
        this.currentHeight = this.changeHeightFormat(height);
        this.currentAcYaw = acYaw;
        this.currentGbYaw = gbYaw;
    }
    // Modifie un format d'heure
    // Exemple : changeHourFormat("04:23:55 PM") -> "16h23m55s"
    changeHourFormat(hour) {
        var piece = hour.split(":");
        if (hour[hour.length - 2] == 'P') {
            if (parseInt(piece[0]) == 12) {
                var heures = "00";
            }
            else {
                var heures = (parseInt(piece[0]) + 12).toString();
            }
        }
        else {
            if (parseInt(piece[0]) < 10) {
                var heures = "0" + piece[0];
            }
            var heures = piece[0];
        }
        var minutes = piece[1];
        var secondes = piece[2].substring(0, 2);
        var timeShowed = heures + "h" + minutes + "m" + secondes + "s";
        return timeShowed;
    }
    // Change le format du temps de vol (secondes -> minutes/secondes)
    // changeFlightTimeFormat(61) -> 1m01s
    changeFlightTimeFormat(flightTime) {
        if (flightTime.includes(".")) {
            var ftInt = parseInt(flightTime.split(".")[0]);
        }
        else {
            var ftInt = parseInt(flightTime);
        }
        var minutes = Math.floor(ftInt / 60);
        var secondes = ftInt - (minutes * 60);
        if (secondes < 10 && minutes < 10) {
            var final = "0" + minutes + "m0" + secondes + "s";
        }
        else if (secondes < 10 && minutes > 10) {
            var final = minutes + "m0" + secondes + "s";
        }
        else if (secondes > 10 && minutes < 10) {
            var final = "0" + minutes + "m" + secondes + "s";
        }
        else {
            var final = minutes + "m" + secondes + "s";
        }
        return final;
    }
    changeHeightFormat(height) {
        var heightInMeters = Math.round(height * 0.3048);
        return heightInMeters;
    }
    // Récupère le point sur le tracé le plus proche de la souris
    drawClosestPoint(newFeature) {
        var _a;
        if (this.lastFeature == undefined) {
            this.vectorPoint = new ol_source_vector__WEBPACK_IMPORTED_MODULE_5__["default"]({});
            this.featurePoint = new ol__WEBPACK_IMPORTED_MODULE_7__["Feature"]({
                geometry: new ol_geom_Point__WEBPACK_IMPORTED_MODULE_12__["default"]([newFeature.values_.geometry.flatCoordinates[0], newFeature.values_.geometry.flatCoordinates[1]])
            });
            this.vectorPoint.addFeature(this.featurePoint);
            this.vectorPointLayer = new ol_layer_vector__WEBPACK_IMPORTED_MODULE_6__["default"]({
                source: this.vectorPoint,
                style: new ol_style_Style__WEBPACK_IMPORTED_MODULE_9__["default"]({
                    image: new ol_style_Circle__WEBPACK_IMPORTED_MODULE_13__["default"]({
                        radius: 5,
                        fill: new ol_style_Fill__WEBPACK_IMPORTED_MODULE_10__["default"]({ color: 'red' }),
                        stroke: new ol_style_Stroke__WEBPACK_IMPORTED_MODULE_11__["default"]({ color: 'white', width: 2 })
                    })
                })
            });
            (_a = this.map) === null || _a === void 0 ? void 0 : _a.addLayer(this.vectorPointLayer);
        }
        else {
            this.featurePoint.getGeometry().setCoordinates([newFeature.values_.geometry.flatCoordinates[0], newFeature.values_.geometry.flatCoordinates[1]]);
        }
    }
    // Dessine sur la carte le tracé du drone
    // Donné à chaque segment sous forme de propriété les données de vol
    drawAircraftGps() {
        var featureLine;
        this.vectorLine = new ol_source_vector__WEBPACK_IMPORTED_MODULE_5__["default"]({});
        var points;
        for (let i = 1; i < this.dataJson.length; i++) {
            points = [[parseFloat(this.dataJson[i - 1]["longitude"]), parseFloat(this.dataJson[i - 1]["latitude"])], [parseFloat(this.dataJson[i]["longitude"]), parseFloat(this.dataJson[i]["latitude"])]];
            for (let j = 0; j < points.length; j++) {
                points[j] = Object(ol_proj__WEBPACK_IMPORTED_MODULE_4__["transform"])(points[j], 'EPSG:4326', 'EPSG:3857');
            }
            featureLine = new ol__WEBPACK_IMPORTED_MODULE_7__["Feature"]({
                geometry: new ol_geom_LineString__WEBPACK_IMPORTED_MODULE_8__["default"](points),
                properties: [
                    { "date": this.dataJson[i]["hour"] },
                    { "flightTime": this.dataJson[i]["time"] },
                    { "battery": this.dataJson[i]["battery"] },
                    { "height": this.dataJson[i]["height"] },
                    { "aircraftYaw": this.dataJson[i]["aircraftYaw"] },
                    { "gimbalYaw": this.dataJson[i]["gimbalYaw"] },
                ]
            });
            this.vectorLine.addFeature(featureLine);
        }
        this.vectorLineLayer = new ol_layer_vector__WEBPACK_IMPORTED_MODULE_6__["default"]({
            source: this.vectorLine,
            style: new ol_style_Style__WEBPACK_IMPORTED_MODULE_9__["default"]({
                fill: new ol_style_Fill__WEBPACK_IMPORTED_MODULE_10__["default"]({ color: '#800080' }),
                stroke: new ol_style_Stroke__WEBPACK_IMPORTED_MODULE_11__["default"]({ color: '#800080', width: 3 })
            })
        });
        if (this.map != undefined) {
            this.map.getView().setZoom(15);
            this.map.getView().setCenter(Object(ol_proj__WEBPACK_IMPORTED_MODULE_4__["fromLonLat"])([parseFloat(this.dataJson[0]["longitude"]), parseFloat(this.dataJson[0]["latitude"])]));
            this.map.addLayer(this.vectorLineLayer);
        }
    }
    ngOnInit() {
        this.map = new ol_Map__WEBPACK_IMPORTED_MODULE_0__["default"]({
            view: new ol_View__WEBPACK_IMPORTED_MODULE_1__["default"]({
                center: Object(ol_proj__WEBPACK_IMPORTED_MODULE_4__["fromLonLat"])([4.626476, 50.674987]),
                zoom: 11,
            }),
            layers: [
                new ol_layer_Tile__WEBPACK_IMPORTED_MODULE_2__["default"]({
                    source: new ol_source_OSM__WEBPACK_IMPORTED_MODULE_3__["default"](),
                }),
            ],
            target: 'ol-map'
        });
        this.map.on('pointermove', (evt) => {
            this.onPointerMoveAndClick(evt);
        });
        this.map.on('click', (evt) => {
            this.onPointerMoveAndClick(evt);
        });
        var url = "http://localhost:8888/api/livedata?id=" + this.idVol;
        // var url = "http://localhost:8888/api/livedata?id=9";
        console.log(url);
        this.http.get(url)
            .subscribe(result => {
            console.log(result);
            var res = JSON.parse(JSON.stringify(result));
            if (res.length != 0) {
                this.dataJson = res;
                console.log(this.dataJson);
                this.drawAircraftGps();
            }
        }, error => {
            //TODO
        });
    }
}


/***/ }),

/***/ "409T":
/*!**********************************************!*\
  !*** ./src/app/replays/replays.component.ts ***!
  \**********************************************/
/*! exports provided: ReplaysComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReplaysComponent", function() { return ReplaysComponent; });
class ReplaysComponent {
    constructor(http) {
        this.http = http;
        this.interId = 1;
        this.videoNumber = [];
        this.styleChoixInter = "block";
        this.inters = [];
        this.displayLoading = "block";
        this.essai = "<p><b>Essai</b></p>";
        this.defaultImage = "../../assets/drone.png";
    }
    generateInterList() {
        var x = [];
        this.http.get("http://localhost:8888/api/interventions")
            .subscribe(result => {
            x = JSON.parse(JSON.stringify(result));
            for (let i = 0; i < x.length; i++) {
                var datetime = x[i]["startTime"];
                var date = "";
                var monthList = ["JANVIER", "FEVRIER", "MARS", "AVRIL", "MAI", "JUIN", "JUILLET", "AOUT", "SEPTEMBRE", "OCTOBRE", "NOVEMBRE", "DECEMBRE"];
                var month = +datetime[5] + +datetime[6];
                date += datetime[8] + datetime[9] + " " + monthList[month - 1] + " " + datetime[0] + datetime[1] + datetime[2] + datetime[3];
                x[i]["startTime"] = date;
                if (x[i]["commune"] == null && x[i]["street"] == null) {
                    x[i]["commune"] = "---Localisation inconnue---";
                    x[i]["street"] = " ";
                }
                else if (x[i]["commune"] == null) {
                    x[i]["commune"] = " ";
                }
                else if (x[i]["street"] == null) {
                    x[i]["street"] = " ";
                }
                else {
                    x[i]["commune"] += ", ";
                }
            }
            this.getVideoNumber(x);
            // this.inters = x;
            // var inters = [];
            // var sessions = [];
            // for(let i=0;i<x.length;i++) {
            //   console.log(x[i])
            // }
            // mp4 = mp4.filter(e => e[0].endsWith('mp4'));
            // 
            // var currentInter:any[] = [];
            // if(mp4.length != 1) {
            //   for(let i=0; i<mp4.length-1; i++) {
            //     var val1 = new Date(mp4[i][1]).getTime();
            //     var val2 = new Date(mp4[i+1][1]).getTime();
            //     if(i==0) {
            //       currentInter.push(mp4[i]);
            //     }
            //     if((val2-val1) < 1200000 && (val2-val1) > -1200000) { //Si moins de 20 min (1.200.000 ms)
            //       currentInter.push(mp4[i+1]);
            //     } else {
            //       inters.push(currentInter);
            //       currentInter = [mp4[i+1]];
            //     }
            //     if(i == mp4.length-1) {
            //       inters.push(currentInter);
            //     }
            //   }
            // } else {
            //   currentInter.push(mp4[0]);
            //   inters.push(currentInter);
            // }
            // this.inters = inters;
            // 
        }, error => {
            this.displayLoading = "none";
        });
    }
    checkImage(imageSrc, good, bad) {
        var img = new Image();
        img.onload = good;
        img.onerror = bad;
        img.src = imageSrc;
    }
    getVideoNumber(data) {
        for (let j = 0; j < data.length; j++) {
            this.http.get("http://localhost:8888/api/videoByInter?id=" + data[j]["idInter"])
                .subscribe(result => {
                var x = JSON.parse(JSON.stringify(result));
                data[j]["imageSource"] = "../../assets/drone.png";
                data[j]["numberOfVideos"] = x.length;
            }, error => {
                this.displayLoading = "none";
            });
        }
        this.inters = data;
        this.displayLoading = "none";
    }
    checkIfNewVideos(dbData) {
        this.http.get("http://192.168.13.110:8080/replay")
            // this.http.get("http://localhost:8888/api/videoFileNameList")
            .subscribe(result => {
            var x = JSON.parse(JSON.stringify(result));
            var dataDb = [];
            var dataServer = [];
            for (var j = 0; j < dbData.length; j++) {
                // y.push(serverData[j]["name"]);
                dataDb.push(dbData[j]["fileName"]);
            }
            for (var k = 0; k < x.length; k++) {
                var datetime = this.toDatetimeFormat(x[k]["mtime"]);
                if (x[k]["name"].includes("mp4")) {
                    dataServer.push([datetime, (x[k]["name"]).slice(0, -4)]);
                }
            }
            for (var i = 0; i < dataServer.length; i++) {
                if (!dataDb.includes(dataServer[i][1])) {
                    this.addVideoToDb(dataServer[i]);
                }
                if (i == dataServer.length - 1) {
                    this.generateInterList();
                }
            }
            if (dataServer.length == 0) {
                this.generateInterList();
            }
        }, error => {
            this.displayLoading = "none";
        });
    }
    checkIfUnassignedVideos() {
        this.http.get("http://localhost:8888/api/unassignedVideos")
            .subscribe(res => {
            var videoResult = JSON.parse(JSON.stringify(res));
            if (videoResult.length != 0) {
                this.http.get("http://localhost:8888/api/lastInter")
                    .subscribe(res2 => {
                    var interResult = JSON.parse(JSON.stringify(res2));
                    var date = (interResult[0]["startTime"]).slice(0, 19).replace('T', ' ');
                    var dateLastInter = new Date(date).getTime();
                    if (videoResult.length == 1) {
                        var timeValue = new Date((videoResult[0]["recordTime"]).slice(0, 19).replace('T', ' ')).getTime();
                        if ((timeValue - dateLastInter) < 1200000 && (timeValue - dateLastInter) > -1200000) { //Si moins de 20 min (1.200.000 ms)
                            this.setInterToVideo(videoResult[0]["fileName"], interResult[0]["idInter"]);
                        }
                        else {
                            this.createInter([[[videoResult[0]["fileName"], (videoResult[0]["recordTime"]).slice(0, 19).replace('T', ' ')]]], interResult[0]["idInter"]);
                        }
                    }
                    else {
                        var interToAdd = [];
                        var videoToAdd = [];
                        var cache = NaN;
                        for (let i = 0; i < videoResult.length - 1; i++) {
                            var timeValue = new Date((videoResult[i]["recordTime"]).slice(0, 19).replace('T', ' ')).getTime();
                            if ((timeValue - dateLastInter) < 1200000 && (timeValue - dateLastInter) > -1200000) { //Si moins de 20 min (1.200.000 ms)
                                this.setInterToVideo(videoResult[i]["fileName"], interResult[0]["idInter"]);
                            }
                            else {
                                if (videoToAdd.length == 0) {
                                    cache = timeValue;
                                    videoToAdd = [[videoResult[i]["fileName"], (videoResult[i]["recordTime"]).slice(0, 19).replace('T', ' ')]];
                                }
                                else {
                                    if (timeValue - cache < 1200000 && (timeValue - cache) > -1200000) {
                                        cache = timeValue;
                                        videoToAdd.push([videoResult[i]["fileName"], (videoResult[i]["recordTime"]).slice(0, 19).replace('T', ' ')]);
                                    }
                                    else {
                                        interToAdd.push(videoToAdd);
                                        cache = timeValue;
                                        videoToAdd = [[videoResult[i]["fileName"], (videoResult[i]["recordTime"]).slice(0, 19).replace('T', ' ')]];
                                    }
                                }
                            }
                        }
                        interToAdd.push(videoToAdd);
                        this.createInter(interToAdd, interResult[0]["idInter"]);
                    }
                }, error => {
                    this.displayLoading = "none";
                });
            }
        }, error => {
            this.displayLoading = "none";
        });
    }
    addVideoToDb(data) {
        this.http.post('http://localhost:8888/api/newvideo', { fileName: data[1], videoName: 'flag', recordTime: data[0] }).subscribe(data => {
            //  console.log(data);
        }, error => {
            this.displayLoading = "none";
        });
    }
    setInterToVideo(video, inter) {
        this.http.post('http://localhost:8888/api/intertovideo', { fileName: video, idInter: inter }).subscribe(data => {
            //  console.log(data);
        }, error => {
            this.displayLoading = "none";
        });
    }
    createInter(data, maxIdInter) {
        var newId = maxIdInter;
        for (let i = 0; i < data.length; i++) {
            newId++;
            this.http.post('http://localhost:8888/api/newinter', { idInter: newId, startTime: data[i][0][1] }).subscribe(data => {
                //  console.log(data);
            }, error => {
                this.displayLoading = "none";
            });
            for (let j = 0; j < data[i].length; j++) {
                this.setInterToVideo(data[i][j][0], newId);
            }
        }
    }
    moveToInterReplay(inter) {
        window.location.href = '/replay?id=' + inter["idInter"];
    }
    moveToInterStats(inter) {
        window.location.href = '/stats?id=' + inter["idInter"];
    }
    toDatetimeFormat(date) {
        var monthString = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var month = date[8] + date[9] + date[10];
        var monthStr = "";
        if (monthString.indexOf(month) + 1 < 10) {
            monthStr = "0" + (monthString.indexOf(month) + 1);
        }
        else {
            monthStr = (monthString.indexOf(month) + 1).toString();
        }
        var res = date[12] + date[13] + date[14] + date[15] + "-" + monthStr + "-" + date[5] + date[6] + " " + date[17] + date[18] + ":" + date[20] + date[21] + ":" + date[23] + date[24];
        return res;
    }
    ngOnInit() {
        // this.checkIfNewVideos("aze");
        // this.http.get("http://192.168.13.110:8080/replay")
        this.http.get("http://localhost:8888/api/videoFileNameList")
            .subscribe(result => {
            this.checkIfNewVideos(result);
            this.checkIfUnassignedVideos();
        }, error => {
            this.displayLoading = "none";
        });
    }
}


/***/ }),

/***/ "4Nlo":
/*!*********************************************************************!*\
  !*** ./src/app/statistics/statistics.component.css.shim.ngstyle.js ***!
  \*********************************************************************/
/*! exports provided: styles */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "styles", function() { return styles; });
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes,extraRequire}
 * tslint:disable
 */
var styles = ["body[_ngcontent-%COMP%] {\r\n    overflow-x: hidden;\r\n}\r\n\r\n#file-selector[_ngcontent-%COMP%] {\r\n    display: none;\r\n}\r\n\r\n#uploadFile[_ngcontent-%COMP%] {\r\n    width: 30%;\r\n    height: 50px;\r\n    font-size: 16px;\r\n    background-color: rgb(214, 214, 214);\r\n    text-align: center; \r\n    border-radius: 10px;\r\n    cursor: pointer;\r\n    margin-left: 35%;\r\n}\r\n\r\n#uploadFile[_ngcontent-%COMP%]    > p[_ngcontent-%COMP%] {\r\n    padding: 17px 0;\r\n}\r\n\r\n#uploadFile[_ngcontent-%COMP%]:hover {\r\n    background-color: rgb(190, 190, 190);\r\n}\r\n\r\n.loading[_ngcontent-%COMP%] {\r\n    width: 30%;\r\n    margin-left: 35%;\r\n}\r\n\r\n#graph[_ngcontent-%COMP%] {\r\n    \r\n}\r\n\r\n#graph1[_ngcontent-%COMP%] {\r\n    margin-left: 25vw; \r\n    \r\n}\r\n\r\n#graph1[_ngcontent-%COMP%]    > canvas[_ngcontent-%COMP%] {\r\n    width: 50vw;\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0YXRpc3RpY3MuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtJQUNJLGtCQUFrQjtBQUN0Qjs7QUFFQTtJQUNJLGFBQWE7QUFDakI7O0FBRUE7SUFDSSxVQUFVO0lBQ1YsWUFBWTtJQUNaLGVBQWU7SUFDZixvQ0FBb0M7SUFDcEMsa0JBQWtCO0lBQ2xCLG1CQUFtQjtJQUNuQixlQUFlO0lBQ2YsZ0JBQWdCO0FBQ3BCOztBQUVBO0lBQ0ksZUFBZTtBQUNuQjs7QUFFQTtJQUNJLG9DQUFvQztBQUN4Qzs7QUFFQTtJQUNJLFVBQVU7SUFDVixnQkFBZ0I7QUFDcEI7O0FBRUE7SUFDSTs7O2tCQUdjO0FBQ2xCOztBQUVBO0lBQ0ksaUJBQWlCOztBQUVyQjs7QUFFQTtJQUNJLFdBQVc7QUFDZiIsImZpbGUiOiJzdGF0aXN0aWNzLmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyJib2R5IHtcclxuICAgIG92ZXJmbG93LXg6IGhpZGRlbjtcclxufVxyXG5cclxuI2ZpbGUtc2VsZWN0b3Ige1xyXG4gICAgZGlzcGxheTogbm9uZTtcclxufVxyXG5cclxuI3VwbG9hZEZpbGUge1xyXG4gICAgd2lkdGg6IDMwJTtcclxuICAgIGhlaWdodDogNTBweDtcclxuICAgIGZvbnQtc2l6ZTogMTZweDtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYigyMTQsIDIxNCwgMjE0KTtcclxuICAgIHRleHQtYWxpZ246IGNlbnRlcjsgXHJcbiAgICBib3JkZXItcmFkaXVzOiAxMHB4O1xyXG4gICAgY3Vyc29yOiBwb2ludGVyO1xyXG4gICAgbWFyZ2luLWxlZnQ6IDM1JTtcclxufVxyXG5cclxuI3VwbG9hZEZpbGUgPiBwIHtcclxuICAgIHBhZGRpbmc6IDE3cHggMDtcclxufVxyXG5cclxuI3VwbG9hZEZpbGU6aG92ZXIge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDE5MCwgMTkwLCAxOTApO1xyXG59XHJcblxyXG4ubG9hZGluZyB7XHJcbiAgICB3aWR0aDogMzAlO1xyXG4gICAgbWFyZ2luLWxlZnQ6IDM1JTtcclxufVxyXG5cclxuI2dyYXBoIHtcclxuICAgIC8qIHdpZHRoOiA1MCU7XHJcbiAgICBoZWlnaHQ6IDUwMHB4O1xyXG4gICAgYm9yZGVyOiAxcHggc29saWQgZ3JleTtcclxuICAgIG1hcmdpbjogNXB4OyAqL1xyXG59XHJcblxyXG4jZ3JhcGgxIHtcclxuICAgIG1hcmdpbi1sZWZ0OiAyNXZ3OyBcclxuICAgIFxyXG59XHJcblxyXG4jZ3JhcGgxID4gY2FudmFzIHtcclxuICAgIHdpZHRoOiA1MHZ3O1xyXG59Il19 */"];



/***/ }),

/***/ "4QAB":
/*!****************************************************!*\
  !*** ./src/app/statistics/statistics.component.ts ***!
  \****************************************************/
/*! exports provided: StatisticsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StatisticsComponent", function() { return StatisticsComponent; });
class StatisticsComponent {
    constructor(http) {
        this.http = http;
        this.imageUrl = "";
        // imageUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAD6CAYAAABXq7VOAAAAAXNSR0IArs4c6QAAE7VJREFUeF7t3LGrJdUdB/Dv2mlK7ezSWKQISIqASoIg8R8IFmplYaEIQjoxrohVFgTRQAortZCQ1EkjBLVKFZaANuksAtrGzg0nzsBhcu++ubvvzJv7289tfO++uXPm9zk/93vPzNx7Lft+XJ8Ob/7vvo/W0d0zAreSb5L8KMnPriX/vGcKV+iuBW4lP0ny9yT/uZY8tOuDdXCXLnDt0vd4uTsU6JfraW+XJHAr+XWSn1xLvNm8JFO7uRyBWz/05D+vJX+8nD3ay7kICPRzmSnHSYAAAQIEbiMg0LUHAQIECBAoIHAo0J9N8uMkby3qeyzJ591zjyf5ovv9/iTvJHlxeu4PSV5N8t30e//655J83L32kSQvJHmj27792Sn3Ak2mBAIECBAYL7AM9BbmHyX57SLQW+B+kuSlKcRbOL+f5JkkX02H+XqSh6cQb0+1cP962s+DU4C3Nwlfdj/Pbwjaaz9dvEEQ6OPn3wgECBAgUERgDvR5df3zJP+eVuL9Cr0Fbnsce64F/rtJXukCvn9uDueX292XU9h/NgV7e3Pw5IEzAgK9SJMpgwABAgTGC8yB3kL1+Wl1/ZtFeM9hPwfwfFT9ax5N0kK/rfC/nTaYX/dhfviITzt9vgz0Pyd5M8kH3RuBvmqn3Mf3gBEIECBAoIDAoWvoy9V4f7q8v2beAn0O8aeTPLG4Zt6/EfjL4pT7e1PAt89JHludW6EXaDAlECBAgMA2AlsFersBbnlTXL86b8E+33DX3zBnhb5NHxiFAAECBM5cYMtAX1K10/Pt0a/e26n5/lq8QD/zBnP4BAgQILCNwJpAv4xr6P2p+lZZO43/dpLX8sPXEy6vr7fr7u01An2bPjAKAQIECJy5wJpAbyXe7V3u80fbZq55dd5Oxbe74QX6mTeSwydAgACBqxVYG+h3+zn0vsp+dd7uiO9vunPK/Wr7wegECBAgcKYCawO9lXe33xQ3E7XV/r8W3xR37FvknHI/08Zy2AQIECCwrYDvct/W22gECBAgQGCIgEAfwmqnBAgQIEBgWwGBvq230QgQIECAwBABgT6E1U4JECBAgMC2AgJ9W2+jESBAgACBIQICfQirnRIgQIAAgW0FBPq23kYjQIAAAQJDBAT6EFY7JUCAAAEC2woI9G29jUaAAAECBIYICPQhrHZKgAABAgS2FRDo23objQABAgQIDBEQ6ENY7ZQAAQIECGwrINC39TYaAQIECBAYIiDQh7DaKQECBAgQ2FZAoG/rbTQCBAgQIDBEQKAPYbVTAgQIECCwrYBA39bbaAQIECBAYIiAQB/CaqcECBAgQGBbAYG+rbfRCBAgQIDAEAGBPoTVTgkQIECAwLYCAn1bb6MRIECAAIEhAgJ9CKudEiBAgACBbQUE+rbeRiNAgAABAkMEBPoQVjslQIAAAQLbCgj0bb2NRoAAAQIEhggI9CGsdkqAAAECBLYVEOjbehuNAAECBAgMERDoQ1jtlAABAgQIbCsg0Lf1NhoBAgQIEBgiINCHsNopAQIECBDYVkCgb+ttNAIECBAgMERAoA9htVMCBAgQILCtgEDf1ttoBAgQIEBgiIBAH8JqpwQIECBAYFsBgb6tt9EIECBAgMAQAYE+hNVOCRAgQIDAtgICfVtvoxEgQIAAgSECAn0Iq50SIECAAIFtBQT6tt5GI0CAAAECQwQE+hBWOyVAgAABAtsKCPRtvY1GgAABAgSGCAj0Iax2SoAAAQIEthVYE+iPJfn8yGH9NslbSe5P8k6SFxfbPZfk4+m5Z5N8NP38eJIvum3bGE9O++p3cX36Zf7vtjpGI0CAAAECZyKwJtAPldIC+P0kzyT5KsmDU3C3cO+Den7tI0neTfLK9MT8c3ttezPwZpIPpn0J9DNpHodJgAABAvsRuJNAn8P7w2713Qd2C+nlo70BeD7Jq0keWIR/W7m3x7ySF+j76Q9HQoAAAQJnInAngf56koencP5uqrMFdnu+hfO3JwT6l0neTvLakdc55X4mjeQwCRAgQOBqBU4N9LYS/yTJS4tT6/318bmi/vr58pR7C+qXkzx9m9V5+5NAv9r+MDoBAgQInInAqYHegvuJxeq8ldpW522VPq/QD52WX94U16/OW7AfumHu+s2bN984E0uHSYAAAQIErkzglECf72T/7Mj17mURLcDbdfNjp+Hbm4BPk3zT3TD30OLUvRX6lbWGgQkQIEDgnAROCfSLbnxb1n276+ptXy8kaavvRxc3zL03nWpvN9cJ9HPqJsdKgAABAlcmcEqgHwvoYyv3Y6fn51P0bXXePuK2vANeoF9ZOxiYAAECBM5V4JRAv11AL0+vH7t5rjn1q/N2l3y/8nfK/Vw7yXETIECAwJUKnBLo7Zp3e7Qvjzn0WN7pvvw2uPaaeTXfPsPefwHNsW+Rc8r9StvD4AQIECBwLgKnBPpV1CTQr0LdmAQIECBwdgIC/eymzAETIECAAIH/FxDouoIAAQIECBQQEOgFJlEJBAgQIEBAoOsBAgQIECBQQECgF5hEJRAgQIAAAYGuBwgQIECAQAEBgV5gEpVAgAABAgQEuh4gQIAAAQIFBAR6gUlUAgECBAgQEOh6gAABAgQIFBAQ6AUmUQkECBAgQECg6wECBAgQIFBAQKAXmEQlECBAgAABga4HCBAgQIBAAQGBXmASlUCAAAECBAS6HiBAgAABAgUEBHqBSVQCAQIECBAQ6HqAAAECBAgUEBDoBSZRCQQIECBAQKDrAQIECBAgUEBAoBeYRCUQIECAAAGBrgcIECBAgEABAYFeYBKVQIAAAQIEBLoeIECAAAECBQQEeoFJVAIBAgQIEBDoeoAAAQIECBQQEOgFJlEJBAgQIEBAoOsBAgQIECBQQECgF5hEJRAgQIAAAYGuBwgQIECAQAEBgV5gEpVAgAABAgQEuh4gQIAAAQIFBAR6gUlUAgECBAgQEOh6gAABAgQIFBAQ6AUmUQkECBAgQECg6wECBAgQIFBAQKAXmEQlECBAgAABga4HCBAgQIBAAQGBXmASlUCAAAECBAS6HiBAgAABAgUEBHqBSVQCAQIECBAQ6HqAAAECBAgUEBDoBSZRCQQIECBAQKDrAQIECBAgUEBAoBeYRCUQIECAAAGBrgcIECBAgEABAYFeYBKVQIAAAQIEBLoeIECAAAECBQQEeoFJVAIBAgQIEBDoeoAAAQIECBQQWBvojyT5JMlPu5r/keSZJF9Nzz2W5PPu748n+aL7/dkkH02/L//WXvtkkrcWpten3+f/FiBXAgECBAgQuHyBtYHeAvf1JC2Uvz1wGHPgvzSFeNv+/S7w29/fTfLK9Nr55/Zm4P4kbyb5oHtzMA8h0C9/zu2RAAECBAoKrA30FuRPJHk1yXcHHFrYt0e/wu6fawH//PT6B5J8PG3bVvBt3+3Rnls+BHrBplMSAQIECFy+wNpAPxTY89G0FfY7ST5bhHIf4o8eCfQvk7yd5LUjK3+Bfvlzbo8ECBAgUFBgTaDPgf1iV39//fzBxYp73qw/Tf/Q4pR7C+qXkzx9m9V5+5NAL9h0SiJAgACByxdYE+hzYLfT4/Mp9f4a+TcrAr1dd1/eFNevzluwH7ph7vqNGzd+8dRTT/1tWfp99913a/nc999/f7Seu9n+dvttx7Dc96jtL9rv8lhO2f6Ubds4p2y/Ztv+2Nv2s+ma1/b+p2x/yran1nzq9hcdy9302GXu+5T/j07Z9vL/abNHAveewJpAP6Qyr9q/TvL7lYG+3E87jf9pkvaGYL5Jrq3k+5vv3rhx48YvDwX6vTdVKiZAgAABAscF7jTQ2x7n6+o3VlxDX95I1+56fyHJG0mW19ffm061tzvgnXLXvQQIECBAYIXAmkDvP3I2f+Z8eSPcRXe5H1udt9P4yzvgBfqKibMJAQIECBDoBdYEen96fb6G3q6Ht4+hzZ9Lv+hz6P2Y/eq8rdz7NwzLU+5W6PqVAAECBAisEFgT6G03yzvd/3rgS2Yu+qa4fj8frvwWuXZKvj3aF894ECBAgAABAkcE1gb6VQFaoV+VvHEJECBA4KwEBPpZTZeDJUCAAAEChwUEus4gQIAAAQIFBPYe6K6hF2gyJRAgQIDAeIG9B7pr6ON7wAgECBAgUEBAoBeYRCUQIECAAAGBrgcIECBAgEABgb0HumvoBZpMCQQIECAwXmDvge4a+vgeMAIBAgQIFBAQ6AUmUQkECBAgQECg6wECBAgQIFBAYO+B7hp6gSZTAgECBAiMF9h7oLuGPr4HjECAAAECBQQEeoFJVAIBAgQIEBDoeoAAAQIECBQQ2Hugu4ZeoMmUQIAAAQLjBfYe6K6hj+8BIxAgQIBAAQGBXmASlUCAAAECBAS6HiBAgAABAgUE9h7orqEXaDIlECBAgMB4gb0Humvo43vACAQIECBQQECgF5hEJRAgQIAAAYGuBwgQIECAQAGBvQe6a+gFmkwJBAgQIDBeYO+B7hr6+B4wAgECBAgUEBDoBSZRCQQIECBAQKDrAQIECBAgUEBg74HuGnqBJlMCAQIECIwX2Hugu4Y+vgeMQIAAAQIFBAR6gUlUAgECBAgQEOh6gAABAgQIFBDYe6C7hl6gyZRAgAABAuMF9h7orqGP7wEjECBAgEABAYFeYBKVQIAAAQIEBLoeIECAAAECBQT2HuiuoRdoMiUQIECAwHiBvQe6a+jje8AIBAgQIFBAQKAXmEQlECBAgAABga4HCBAgQIBAAYG9B7pr6AWaTAkECBAgMF5g74HuGvr4HjACAQIECBQQEOgFJlEJBAgQIEBAoOsBAgQIECBQQGDvge4aeoEmUwIBAgQIjBfYe6C7hj6+B4xAgAABAgUEBHqBSVQCAQIECBAQ6HqAAAECBAgUENh7oLuGXqDJlECAAAEC4wX2HuiuoY/vASMQIECAQAEBgV5gEpVAgAABAgQEuh4gQIAAAQIFBPYe6K6hF2gyJRAgQIDAeIG1gf5gko+T/Go6pL8meTbJt9Pv9yd5J8mLi0N+bnpde7pt/9H098eTfNFt+1iSJ5O8tXi9a+jje8AIBAgQIFBAYE2gz2H+4SKcn+9Cfd6mBXIf1DPRI0neTfLK9MT881dJ2puBN5N8kKT93j8EeoEmUwIBAgQIjBdYE+ht9fz6YkW+DPA+sJeh3Kpo+2hvAF5N8sD0xmAO/7Zyb492BmD5EOjje8AIBAgQIFBAYE2gHypzGeiHQr9/3bFA/zLJ20le607f969zDb1AkymBAAECBMYL3Gmgt4B+P8kz02ny/vr4fNT99fPlKfe28n45ydO3WZ23P1mhj+8BIxAgQIBAAYE7CfQWzp8k+V13mrydkm8hP98od+y6e39TXL86b8F+6Ia56zdv3pxX6QW4lUCAAAECBMYInBroc5j/6cAd6csjbOHe3zi3/Ht7E/Bpkm+6G+YeWlyvt0IfM+/2SoAAAQLFBE4J9FPCvDHd7rp629cLSdrq+9HFDXPvTafa2811Ar1YwymHAAECBMYIrA30Q6fZ5yOaP4P+2eJO9bZCf2K6s/27xeHPq/P2EbflDXMCfcxc2ysBAgQIFBZYE+iHrodfdHp9fgPw0oHPpfer8xb0/Q1zTrkXbjalESBAgMA4gTWBfugO9vmIjn0TXPv78tvg2nPzar59SU3/BTTHvkXOx9bGzb09EyBAgEAhgTWBfpXluoZ+lfrGJkCAAIGzERDoZzNVDpQAAQIECBwXEOi6gwABAgQIFBAQ6AUmUQkECBAgQECg6wECBAgQIFBAQKAXmEQlECBAgAABga4HCBAgQIBAAYG9B7rPoRdoMiUQIECAwHiBvQe6z6GP7wEjECBAgEABAYFeYBKVQIAAAQIEBLoeIECAAAECBQQEeoFJVAIBAgQIEBDoeoAAAQIECBQQEOgFJlEJBAgQIEBAoOsBAgQIECBQQGDvge5z6AWaTAkECBAgMF5g74Huc+jje8AIBAgQIFBAQKAXmEQlECBAgAABga4HCBAgQIBAAQGBXmASlUCAAAECBAS6HiBAgAABAgUEBHqBSVQCAQIECBAQ6HqAAAECBAgUENh7oPsceoEmUwIBAgQIjBfYe6D7HPr4HjACAQIECBQQEOgFJlEJBAgQIEBAoOsBAgQIECBQQECgF5hEJRAgQIAAAYGuBwgQIECAQAEBgV5gEpVAgAABAgQEuh4gQIAAAQIFBPYe6D6HXqDJlECAAAEC4wX2Hug+hz6+B4xAgAABAgUEBHqBSVQCAQIECBAQ6HqAAAECBAgUEBDoBSZRCQQIECBAQKDrAQIECBAgUEBAoBeYRCUQIECAAAGBrgcIECBAgEABgb0Hus+hF2gyJRAgQIDAeIG9B7rPoY/vASMQIECAQAEBgV5gEpVAgAABAgQEuh4gQIAAAQIFBAR6gUlUAgECBAgQ2HuguylOjxIgQIAAgRUCew90N8WtmESbECBAgAABga4HCBAgQIBAAYG9B7pT7gWaTAkECBAgMF5AoI83NgIBAgQIEBgusPdAdw19eAsYgAABAgQqCAj0CrOoBgIECBC45wUE+j3fAgAIECBAoILA3gPdTXEVukwNBAgQIDBcYO+B7hr68BYwAAECBAhUEBDoFWZRDQQIECBwzwvsPdCdcr/nWxQAAQIECKwROIdA/2WSv60pxjYECJQTuHWgomP/bp2ybdvtcvuL/j3stz9l2zbW2u0v2m553CO3H73v2XPNOH3da7Y/Za72su+76cf/9dh/AYcmP35kc4nVAAAAAElFTkSuQmCC";
        //Style du bouton supérieur (change en fonction de l'action)
        this.displayLoading = "none";
        this.buttonText = "Importer des données";
        //Tailles de graphiques
        this.widthBattery = 1040;
        this.heightBattery = 540;
        this.widthAltitude = 1040;
        this.heightAltitude = 540;
        this.loadFilesStyle = "block";
        this.showFilesStyle = "none";
        this.batteryUrl = "";
        this.heightUrl = "";
        this.idVol = [];
    }
    ngAfterViewInit() {
        if (this.canvasBattery != undefined) {
            this.contextBattery = this.canvasBattery.nativeElement.getContext('2d');
        }
        if (this.canvasAltitude != undefined) {
            this.contextAltitude = this.canvasAltitude.nativeElement.getContext('2d');
        }
    }
    // Ouvre la sélection de fichier
    chooseFile() {
        if (this.myInput != undefined) {
            let el = this.myInput.nativeElement;
            el.click();
        }
    }
    // Traite le fichier après l'avoir sélectionné
    readFile(eve) {
        this.displayLoading = "block";
        this.buttonText = "Traitement...";
        this.file = eve.target.files[0];
        let fileReader = new FileReader();
        fileReader.onload = (e) => {
            this.csvToArray(fileReader.result);
        };
        fileReader.readAsText(this.file);
    }
    // Tranforme le fichier .csv en format JSON
    csvToArray(csv) {
        var finalArray = [];
        var data, dataToPush;
        var line = csv.split("\n");
        var headers = line[1].split(",");
        if (headers[0] != "CUSTOM.updateTime [local]") {
            alert("Fichier non reconnu");
            this.displayLoading = "none";
            this.buttonText = "Importer des données";
            return;
        }
        else {
            dataToPush = [headers[0], headers[2], headers[3], headers[4], headers[5], headers[20], headers[55], headers[72]];
            finalArray.push(dataToPush);
            for (let i = 2; i < line.length; i++) {
                data = (line[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/));
                if (data[175] != undefined && data[175].length > 1) {
                    // console.log(data[175])
                }
                if (i % 10 == 2 || i == (line.length - 2)) {
                    if (!data.includes(undefined)) {
                        dataToPush = [data[0], data[2], data[3], data[4], data[5], data[20], data[55], data[72]];
                        finalArray.push(dataToPush);
                    }
                }
            }
            // this.insertFlightToDatabase(finalArray);
            this.displayLoading = "none";
            this.buttonText = "Importer des données";
        }
    }
    insertFlightToDatabase(data) {
        console.log(data);
        var idInter = parseInt((window.location.href).split("?")[1].substring(3));
        var startTime = data[1][0];
        var flightTime = 0;
        for (let h = 1; h < data.length; h++) {
            if (data[data.length - h][1] != undefined) {
                flightTime = Math.floor(data[data.length - h][1]);
                break;
            }
        }
        var startLatitude = data[1][2];
        var startLongitude = data[1][3];
        var batteryGraph = this.drawBattery(data, (this.widthBattery - 40), (this.heightBattery - 40));
        var heightGraph = this.drawAltitude(data, (this.widthAltitude - 40), (this.heightAltitude - 40));
        this.addFlightToDatabase(idInter, startTime, flightTime, startLatitude, startLongitude, batteryGraph, heightGraph, data);
    }
    addFlightToDatabase(idInter, startTime, flightTime, startLatitude, startLongitude, batteryGraph, heightGraph, data) {
        this.http.post('http://localhost:8888/api/newflight', { idInter, startTime, flightTime, startLatitude, startLongitude, batteryGraph, heightGraph }).subscribe(res => {
            this.addFlightDataToDatabase(data);
        }, error => {
            this.displayLoading = "none";
        });
    }
    addFlightDataToDatabase(data) {
        this.http.get("http://localhost:8888/api/lastflight")
            .subscribe(result => {
            var idVol = JSON.parse(JSON.stringify(result))[0]["idVol"];
            var hour;
            var time;
            var latitude;
            var longitude;
            var height;
            var battery;
            var aircraftYaw;
            var gimbalYaw;
            for (let i = 1; i < data.length; i++) {
                hour = data[i][0];
                time = data[i][1].replaceAll(",", "");
                latitude = data[i][2];
                longitude = data[i][3];
                height = data[i][4];
                if (data[i][7].length == 0) {
                    battery = null;
                }
                else {
                    battery = data[i][7];
                }
                aircraftYaw = data[i][5];
                gimbalYaw = data[i][6];
                this.http.post('http://localhost:8888/api/newdataflight', { idVol, hour, time, latitude, longitude, height, battery, aircraftYaw, gimbalYaw }).subscribe(data => {
                }, error => {
                    this.displayLoading = "none";
                });
            }
        }, error => {
            this.displayLoading = "none";
        });
    }
    // Fonction pour dessiner le graphique 'Batterie en fonction du temps'
    drawBattery(res, width, height) {
        this.drawBaseGraph(this.contextBattery, width, height);
        // Récupère le temps de vol du drone
        for (var i = 1; i < res.length; i++) {
            if (res[res.length - i][1] != undefined && res[res.length - i][1].length != 0) {
                var str = res[res.length - i][1];
                break;
            }
        }
        // Transforme le format du temps de vol (string to int)
        if (str.includes(',')) {
            str = str.replace(',', '');
            str = str.substring(1, str.length - 1);
        }
        var maxTimeInSeconds = Math.round(parseFloat(str));
        if (this.contextBattery != undefined && this.canvasBattery != undefined) {
            var g = this.contextBattery;
            ////////////////////////////////////////////////////////////
            // Calcule les valeurs de temps à mettre sur le graphique //
            ////////////////////////////////////////////////////////////
            //1. Valeur 1/4 temps
            var minutes = Math.floor(1 * (maxTimeInSeconds / 4) / 60);
            var seconds = Math.floor(1 * maxTimeInSeconds / 4) - minutes * 60;
            if (seconds < 10) {
                var strTimeQuarter1 = minutes + "m0" + seconds + "s";
            }
            else {
                var strTimeQuarter1 = minutes + "m" + seconds + "s";
            }
            //2. Valeur 1/2 temps
            var minutes = Math.floor(2 * (maxTimeInSeconds / 4) / 60);
            var seconds = Math.floor(2 * maxTimeInSeconds / 4) - minutes * 60;
            if (seconds < 10) {
                var strTimeQuarter2 = minutes + "m0" + seconds + "s";
            }
            else {
                var strTimeQuarter2 = minutes + "m" + seconds + "s";
            }
            //3. Valeur 3/4 temps
            var minutes = Math.floor(3 * (maxTimeInSeconds / 4) / 60);
            var seconds = Math.floor(3 * maxTimeInSeconds / 4) - minutes * 60;
            if (seconds < 10) {
                var strTimeQuarter3 = minutes + "m0" + seconds + "s";
            }
            else {
                var strTimeQuarter3 = minutes + "m" + seconds + "s";
            }
            //4. Valeur full time
            var minutes = Math.floor(4 * (maxTimeInSeconds / 4) / 60);
            var seconds = Math.floor(4 * maxTimeInSeconds / 4) - minutes * 60;
            if (seconds < 10) {
                var strTimeQuarter4 = minutes + "m0" + seconds + "s";
            }
            else {
                var strTimeQuarter4 = minutes + "m" + seconds + "s";
            }
            ////////////////////////////////////////
            // Ecrit les valeurs sur le graphique //
            ////////////////////////////////////////
            // 1. Axe X -> Valeurs de temps
            g.beginPath();
            g.font = "15px Arial";
            g.fillText(strTimeQuarter1, (1 * width / 4) - 12, (height + 20));
            g.fillText(strTimeQuarter2, (2 * width / 4) - 12, (height + 20));
            g.fillText(strTimeQuarter3, (3 * width / 4) - 12, (height + 20));
            g.fillText(strTimeQuarter4, (4 * width / 4) - 12, (height + 20));
            g.stroke();
            // 2. Axe Y -> Valeurs de batterie
            g.beginPath();
            g.font = "15px Arial";
            g.fillText("100%", 0, (0 * height / 4) + 15);
            g.fillText("75%", 8, (1 * height / 4) + 5);
            g.fillText("50%", 8, (2 * height / 4) + 5);
            g.fillText("25%", 8, (3 * height / 4) + 5);
            g.stroke();
            // 3. Dessine les datas
            g.beginPath();
            for (var i = 1; i < res.length; i++) {
                var charge = res[i][7]; // Récupère le %age de batterie
                var max = width / res.length;
                g.strokeStyle = "red";
                g.rect((i * max) + 40, height - ((height / 100) * charge), 1, 1);
            }
            g.stroke();
            const x = this.canvasBattery.nativeElement.width / 2;
            const y = this.canvasBattery.nativeElement.height / 2;
            // 4. Enregistre le grahique sous forme de dataUrl (Lu dans un format PNG)
            this.batteryUrl = this.canvasBattery.nativeElement.toDataURL('assets');
            return this.batteryUrl;
        }
        else {
            return 0;
        }
    }
    // Fonction pour dessiner le graphique 'Altitude en fonction du temps'
    drawAltitude(res, width, height) {
        this.drawBaseGraph(this.contextAltitude, width, height);
        var maxHeight = 0;
        // Récupère la hauteur maximale du drone
        for (var i = 1; i < res.length; i++) {
            if (parseFloat(res[i][4]) > maxHeight) {
                maxHeight = res[i][4];
            }
        }
        // Récupère le temps de vol du drone
        for (var i = 1; i < res.length; i++) {
            if (res[res.length - i][1] != undefined && res[res.length - i][1].length != 0) {
                var str = res[res.length - i][1];
                break;
            }
        }
        // Transforme le format du temps de vol (string to int)
        if (str.includes(',')) {
            str = str.replace(',', '');
            str = str.substring(1, str.length - 1);
        }
        var maxTimeInSeconds = Math.round(parseFloat(str));
        if (this.contextAltitude != undefined && this.canvasAltitude != undefined) {
            var g = this.contextAltitude;
            ////////////////////////////////////////////////////////////
            // Calcule les valeurs de temps à mettre sur le graphique //
            ////////////////////////////////////////////////////////////
            //1. Valeur 1/4 temps
            var minutes = Math.floor(1 * (maxTimeInSeconds / 4) / 60);
            var seconds = Math.floor(1 * maxTimeInSeconds / 4) - minutes * 60;
            if (seconds < 10) {
                var strTimeQuarter1 = minutes + "m0" + seconds + "s";
            }
            else {
                var strTimeQuarter1 = minutes + "m" + seconds + "s";
            }
            //2. Valeur 1/2 temps
            var minutes = Math.floor(2 * (maxTimeInSeconds / 4) / 60);
            var seconds = Math.floor(2 * maxTimeInSeconds / 4) - minutes * 60;
            if (seconds < 10) {
                var strTimeQuarter2 = minutes + "m0" + seconds + "s";
            }
            else {
                var strTimeQuarter2 = minutes + "m" + seconds + "s";
            }
            //3. Valeur 3/4 temps
            var minutes = Math.floor(3 * (maxTimeInSeconds / 4) / 60);
            var seconds = Math.floor(3 * maxTimeInSeconds / 4) - minutes * 60;
            if (seconds < 10) {
                var strTimeQuarter3 = minutes + "m0" + seconds + "s";
            }
            else {
                var strTimeQuarter3 = minutes + "m" + seconds + "s";
            }
            //4. Valeur full time
            var minutes = Math.floor(4 * (maxTimeInSeconds / 4) / 60);
            var seconds = Math.floor(4 * maxTimeInSeconds / 4) - minutes * 60;
            if (seconds < 10) {
                var strTimeQuarter4 = minutes + "m0" + seconds + "s";
            }
            else {
                var strTimeQuarter4 = minutes + "m" + seconds + "s";
            }
            //5. Valeur 1/4 altitude
            var strHeightQuarter1 = Math.round((1 * (maxHeight) / 4) * 0.3048).toString() + "m";
            //6. Valeur 1/2 altitude
            var strHeightQuarter2 = Math.round((2 * (maxHeight) / 4) * 0.3048).toString() + "m";
            //7. Valeur 3/4 altitude
            var strHeightQuarter3 = Math.round((3 * (maxHeight) / 4) * 0.3048).toString() + "m";
            //8. Valeur altitude maximale
            var strHeightQuarter4 = Math.round((4 * (maxHeight) / 4) * 0.3048).toString() + "m";
            ////////////////////////////////////////
            // Ecrit les valeurs sur le graphique //
            ////////////////////////////////////////
            // 1. Axe X -> Valeurs de temps
            g.font = "15px Arial";
            g.fillText(strTimeQuarter1, (1 * width / 4) - 12, (height + 20));
            g.fillText(strTimeQuarter2, (2 * width / 4) - 12, (height + 20));
            g.fillText(strTimeQuarter3, (3 * width / 4) - 12, (height + 20));
            g.fillText(strTimeQuarter4, (4 * width / 4) - 12, (height + 20));
            g.stroke();
            // 2. Axe Y -> Valeurs de l'altitude
            g.beginPath();
            g.font = "15px Arial";
            g.fillText(strHeightQuarter4, 0, (0 * height / 4) + 15);
            g.fillText(strHeightQuarter3, 0, (1 * height / 4) + 5);
            g.fillText(strHeightQuarter2, 0, (2 * height / 4) + 5);
            g.fillText(strHeightQuarter1, 0, (3 * height / 4) + 5);
            g.stroke();
            // 3. Dessine les datas
            g.beginPath();
            for (var i = 1; i < res.length; i++) {
                var currentHeight = res[i][4]; // Récupère la valeur d'altitude
                var max = width / res.length;
                g.strokeStyle = "red";
                g.rect((i * max) + 40, height - ((height / maxHeight) * currentHeight), 1, 1);
            }
            g.stroke();
            const x = this.canvasAltitude.nativeElement.width / 2;
            const y = this.canvasAltitude.nativeElement.height / 2;
            // 4. Enregistre le grahique sous forme de dataUrl (Lu dans un format PNG)
            this.heightUrl = this.canvasAltitude.nativeElement.toDataURL('assets');
            return this.heightUrl;
        }
        else {
            return 0;
        }
    }
    // Fonction pour dessiner les valeurs communes à tous les graphiques
    drawBaseGraph(context, width, height) {
        if (context != undefined) {
            var g = context;
            //////////////////////////////
            //Crée les médianes aux axes//
            //////////////////////////////
            //1. Horizontal
            g.beginPath();
            g.strokeStyle = "lightgray";
            g.moveTo(40, height / 4);
            g.lineTo(width + 40, height / 4);
            g.moveTo(40, 2 * height / 4);
            g.lineTo(width + 40, 2 * height / 4);
            g.moveTo(40, 3 * height / 4);
            g.lineTo(width + 40, 3 * height / 4);
            g.stroke();
            //2. Vertical
            g.beginPath();
            g.strokeStyle = "lightgray";
            g.moveTo((1 * width / 4 + 40), height);
            g.lineTo((1 * width / 4 + 40), 0);
            g.moveTo((2 * width / 4 + 40), height);
            g.lineTo((2 * width / 4 + 40), 0);
            g.moveTo((3 * width / 4 + 40), height);
            g.lineTo((3 * width / 4 + 40), 0);
            g.stroke();
            ////////////////////////
            //Crée les axes x et y//
            ////////////////////////
            g.beginPath();
            g.strokeStyle = "black";
            g.moveTo(width + 40, height);
            g.lineTo(40, height);
            g.moveTo(40, 0);
            g.lineTo(40, height);
            g.stroke();
        }
    }
    ngOnInit() {
        var id = NaN;
        if ((window.location.href).split("?")[1] != undefined) {
            var id = parseInt((window.location.href).split("?")[1].substring(3));
            // this.resetAll(id);
        }
        if (isNaN(id)) {
            alert('URL Error');
        }
        var url = "http://localhost:8888/api/interflight?id=" + id;
        this.http.get(url)
            .subscribe(result => {
            var x = JSON.parse(JSON.stringify(result));
            console.log(x);
            if (x.length == 0) {
                this.showFilesStyle = "none";
            }
            else {
                this.idVol = [];
                for (let i = 0; i < x.length; i++) {
                    this.idVol.push(x[i]["idVol"]);
                }
                this.showFilesStyle = "block";
            }
        }, error => {
            this.displayLoading = "none";
        });
    }
}


/***/ }),

/***/ "6WF9":
/*!**************************************************************!*\
  !*** ./src/app/statistics/statistics.component.ngfactory.js ***!
  \**************************************************************/
/*! exports provided: RenderType_StatisticsComponent, View_StatisticsComponent_0, View_StatisticsComponent_Host_0, StatisticsComponentNgFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RenderType_StatisticsComponent", function() { return RenderType_StatisticsComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_StatisticsComponent_0", function() { return View_StatisticsComponent_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_StatisticsComponent_Host_0", function() { return View_StatisticsComponent_Host_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StatisticsComponentNgFactory", function() { return StatisticsComponentNgFactory; });
/* harmony import */ var _statistics_component_css_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./statistics.component.css.shim.ngstyle */ "4Nlo");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "8Y7J");
/* harmony import */ var _cartography_cartography_component_ngfactory__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../cartography/cartography.component.ngfactory */ "kIdT");
/* harmony import */ var _cartography_cartography_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../cartography/cartography.component */ "24Si");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common/http */ "IheW");
/* harmony import */ var _header_header_component_ngfactory__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../header/header.component.ngfactory */ "a18t");
/* harmony import */ var _header_header_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../header/header.component */ "fECr");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ "SVse");
/* harmony import */ var _node_modules_angular_material_progress_bar_index_ngfactory__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../node_modules/@angular/material/progress-bar/index.ngfactory */ "0mH+");
/* harmony import */ var _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/progress-bar */ "BTe0");
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/platform-browser/animations */ "omvX");
/* harmony import */ var _statistics_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./statistics.component */ "4QAB");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes,extraRequire}
 * tslint:disable
 */












var styles_StatisticsComponent = [_statistics_component_css_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__["styles"]];
var RenderType_StatisticsComponent = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵcrt"]({ encapsulation: 0, styles: styles_StatisticsComponent, data: {} });

function View_StatisticsComponent_1(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 4, "div", [["id", "mainDiv"]], [[4, "display", null]], null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 1, "p", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](2, null, ["Essai ", ""])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](3, 0, null, null, 1, "app-cartography", [], null, null, null, _cartography_cartography_component_ngfactory__WEBPACK_IMPORTED_MODULE_2__["View_CartographyComponent_0"], _cartography_cartography_component_ngfactory__WEBPACK_IMPORTED_MODULE_2__["RenderType_CartographyComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](4, 114688, [[3, 4]], 0, _cartography_cartography_component__WEBPACK_IMPORTED_MODULE_3__["CartographyComponent"], [_angular_common_http__WEBPACK_IMPORTED_MODULE_4__["HttpClient"]], { idVol: [0, "idVol"] }, null)], function (_ck, _v) { var currVal_2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵinlineInterpolate"](1, "", _v.context.$implicit, ""); _ck(_v, 4, 0, currVal_2); }, function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.showFilesStyle; _ck(_v, 0, 0, currVal_0); var currVal_1 = _v.context.$implicit; _ck(_v, 2, 0, currVal_1); }); }
function View_StatisticsComponent_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵqud"](671088640, 1, { canvasBattery: 0 }), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵqud"](671088640, 2, { canvasAltitude: 0 }), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵqud"](671088640, 3, { childGames: 1 }), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵqud"](671088640, 4, { myInput: 0 }), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](4, 0, null, null, 14, "body", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](5, 0, null, null, 1, "app-header", [], null, null, null, _header_header_component_ngfactory__WEBPACK_IMPORTED_MODULE_5__["View_HeaderComponent_0"], _header_header_component_ngfactory__WEBPACK_IMPORTED_MODULE_5__["RenderType_HeaderComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](6, 114688, null, 0, _header_header_component__WEBPACK_IMPORTED_MODULE_6__["HeaderComponent"], [], null, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_StatisticsComponent_1)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](8, 278528, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_7__["NgForOf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["IterableDiffers"]], { ngForOf: [0, "ngForOf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](9, 0, null, null, 6, "div", [], [[4, "display", null]], null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](10, 0, [[4, 0], ["myInput", 1]], null, 0, "input", [["accept", ".csv"], ["id", "file-selector"], ["type", "file"]], null, [[null, "change"]], function (_v, en, $event) { var ad = true; var _co = _v.component; if (("change" === en)) {
        var pd_0 = (_co.readFile($event) !== false);
        ad = (pd_0 && ad);
    } return ad; }, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](11, 0, null, null, 2, "div", [["id", "uploadFile"]], null, [[null, "click"]], function (_v, en, $event) { var ad = true; var _co = _v.component; if (("click" === en)) {
        var pd_0 = (_co.chooseFile() !== false);
        ad = (pd_0 && ad);
    } return ad; }, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](12, 0, null, null, 1, "p", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](13, null, ["", ""])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](14, 0, null, null, 1, "mat-progress-bar", [["aria-valuemax", "100"], ["aria-valuemin", "0"], ["class", "loading mat-progress-bar"], ["mode", "indeterminate"], ["role", "progressbar"], ["tabindex", "-1"]], [[4, "display", null], [1, "aria-valuenow", 0], [1, "mode", 0], [2, "_mat-animation-noopable", null]], null, null, _node_modules_angular_material_progress_bar_index_ngfactory__WEBPACK_IMPORTED_MODULE_8__["View_MatProgressBar_0"], _node_modules_angular_material_progress_bar_index_ngfactory__WEBPACK_IMPORTED_MODULE_8__["RenderType_MatProgressBar"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](15, 4374528, null, 0, _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_9__["MatProgressBar"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["NgZone"], [2, _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_10__["ANIMATION_MODULE_TYPE"]], [2, _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_9__["MAT_PROGRESS_BAR_LOCATION"]]], { mode: [0, "mode"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](16, 0, null, null, 2, "div", [["id", "graph1"], ["style", "display: none"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](17, 0, [[1, 0], ["canvasBattery", 1]], null, 0, "canvas", [], [[8, "width", 0], [8, "height", 0]], null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](18, 0, [[2, 0], ["canvasAltitude", 1]], null, 0, "canvas", [], [[8, "width", 0], [8, "height", 0]], null, null, null, null))], function (_ck, _v) { var _co = _v.component; _ck(_v, 6, 0); var currVal_0 = _co.idVol; _ck(_v, 8, 0, currVal_0); var currVal_7 = "indeterminate"; _ck(_v, 15, 0, currVal_7); }, function (_ck, _v) { var _co = _v.component; var currVal_1 = _co.loadFilesStyle; _ck(_v, 9, 0, currVal_1); var currVal_2 = _co.buttonText; _ck(_v, 13, 0, currVal_2); var currVal_3 = _co.displayLoading; var currVal_4 = (((_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 15).mode === "indeterminate") || (_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 15).mode === "query")) ? null : _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 15).value); var currVal_5 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 15).mode; var currVal_6 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 15)._isNoopAnimation; _ck(_v, 14, 0, currVal_3, currVal_4, currVal_5, currVal_6); var currVal_8 = _co.widthBattery; var currVal_9 = _co.heightBattery; _ck(_v, 17, 0, currVal_8, currVal_9); var currVal_10 = _co.widthAltitude; var currVal_11 = _co.heightAltitude; _ck(_v, 18, 0, currVal_10, currVal_11); }); }
function View_StatisticsComponent_Host_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 1, "app-statistics", [], null, null, null, View_StatisticsComponent_0, RenderType_StatisticsComponent)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](1, 4308992, null, 0, _statistics_component__WEBPACK_IMPORTED_MODULE_11__["StatisticsComponent"], [_angular_common_http__WEBPACK_IMPORTED_MODULE_4__["HttpClient"]], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
var StatisticsComponentNgFactory = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵccf"]("app-statistics", _statistics_component__WEBPACK_IMPORTED_MODULE_11__["StatisticsComponent"], View_StatisticsComponent_Host_0, {}, {}, []);



/***/ }),

/***/ "8h3+":
/*!****************************************************************!*\
  !*** ./src/app/replayinter/replayinter.component.ngfactory.js ***!
  \****************************************************************/
/*! exports provided: RenderType_ReplayinterComponent, View_ReplayinterComponent_0, View_ReplayinterComponent_Host_0, ReplayinterComponentNgFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RenderType_ReplayinterComponent", function() { return RenderType_ReplayinterComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_ReplayinterComponent_0", function() { return View_ReplayinterComponent_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_ReplayinterComponent_Host_0", function() { return View_ReplayinterComponent_Host_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReplayinterComponentNgFactory", function() { return ReplayinterComponentNgFactory; });
/* harmony import */ var _replayinter_component_css_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./replayinter.component.css.shim.ngstyle */ "PCAR");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "8Y7J");
/* harmony import */ var _header_header_component_ngfactory__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../header/header.component.ngfactory */ "a18t");
/* harmony import */ var _header_header_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../header/header.component */ "fECr");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ "SVse");
/* harmony import */ var _replayinter_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./replayinter.component */ "WkRK");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common/http */ "IheW");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes,extraRequire}
 * tslint:disable
 */







var styles_ReplayinterComponent = [_replayinter_component_css_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__["styles"]];
var RenderType_ReplayinterComponent = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵcrt"]({ encapsulation: 0, styles: styles_ReplayinterComponent, data: {} });

function View_ReplayinterComponent_1(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 4, "div", [], [[4, "display", null]], null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 3, "div", [["class", "interDiv"]], null, [[null, "click"]], function (_v, en, $event) { var ad = true; var _co = _v.component; if (("click" === en)) {
        var pd_0 = (_co.changeSrc(_v.context.$implicit["fileName"]) !== false);
        ad = (pd_0 && ad);
    } return ad; }, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](2, 0, null, null, 0, "img", [["class", "miniature"]], [[8, "src", 4]], null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](3, 0, null, null, 1, "div", [["class", "infoVideo"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](4, null, ["", ""]))], null, function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.styleChoixInter; _ck(_v, 0, 0, currVal_0); var currVal_1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵinlineInterpolate"](1, "", _v.context.$implicit.miniature, ""); _ck(_v, 2, 0, currVal_1); var currVal_2 = _v.context.$implicit.fileName; _ck(_v, 4, 0, currVal_2); }); }
function View_ReplayinterComponent_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵqud"](402653184, 1, { target: 0 }), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 0, "link", [["href", "https://vjs.zencdn.net/7.11.4/video-js.css"], ["rel", "stylesheet"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](2, 0, null, null, 1, "app-header", [], null, null, null, _header_header_component_ngfactory__WEBPACK_IMPORTED_MODULE_2__["View_HeaderComponent_0"], _header_header_component_ngfactory__WEBPACK_IMPORTED_MODULE_2__["RenderType_HeaderComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](3, 114688, null, 0, _header_header_component__WEBPACK_IMPORTED_MODULE_3__["HeaderComponent"], [], null, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](4, 0, null, null, 3, "div", [["id", "contenu"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](5, 0, [[1, 0], ["target", 1]], null, 0, "video", [["class", "vjs-styling video-js"], ["height", "500px"], ["width", "250px"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](6, 0, null, null, 1, "p", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["Nom de la video ici"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](8, 0, null, null, 2, "div", [["class", "mainDiv"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_ReplayinterComponent_1)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](10, 278528, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_4__["NgForOf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["IterableDiffers"]], { ngForOf: [0, "ngForOf"] }, null)], function (_ck, _v) { var _co = _v.component; _ck(_v, 3, 0); var currVal_0 = _co.interData; _ck(_v, 10, 0, currVal_0); }, null); }
function View_ReplayinterComponent_Host_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 1, "app-replayinter", [], null, null, null, View_ReplayinterComponent_0, RenderType_ReplayinterComponent)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](1, 245760, null, 0, _replayinter_component__WEBPACK_IMPORTED_MODULE_5__["ReplayinterComponent"], [_angular_common_http__WEBPACK_IMPORTED_MODULE_6__["HttpClient"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"]], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
var ReplayinterComponentNgFactory = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵccf"]("app-replayinter", _replayinter_component__WEBPACK_IMPORTED_MODULE_5__["ReplayinterComponent"], View_ReplayinterComponent_Host_0, {}, {}, []);



/***/ }),

/***/ "AytR":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const environment = {
    production: false
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "C4TS":
/*!***************************************************************!*\
  !*** ./src/app/replays/replays.component.css.shim.ngstyle.js ***!
  \***************************************************************/
/*! exports provided: styles */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "styles", function() { return styles; });
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes,extraRequire}
 * tslint:disable
 */
var styles = [".loading[_ngcontent-%COMP%] {\r\n    width: 100%;\r\n}\r\n\r\n.interDiv[_ngcontent-%COMP%], .interDivChoice[_ngcontent-%COMP%] {\r\n    width: 50vw;\r\n    height: 10vw;\r\n    margin: 2vw 0;\r\n    \r\n    background-color: rgb(255, 255, 255);\r\n    border: 3px solid darkgrey;\r\n    border-radius: 25px 25px 25px 25px;\r\n}\r\n\r\n.interDiv[_ngcontent-%COMP%] {\r\n    display: block;\r\n}\r\n\r\n.interDiv[_ngcontent-%COMP%]    + .interDivChoice[_ngcontent-%COMP%] {\r\n    animation: seconds 1.0s forwards;\r\n}\r\n\r\n.interDivChoice[_ngcontent-%COMP%] {\r\n    display: none;\r\n}\r\n\r\n#mainDiv[_ngcontent-%COMP%] {\r\n    width: 50vw;\r\n    margin-left: 25vw;\r\n    display: inline-block;\r\n}\r\n\r\n#mainDiv[_ngcontent-%COMP%]:hover   .interDiv[_ngcontent-%COMP%] {\r\n    display: none;\r\n}\r\n\r\n#mainDiv[_ngcontent-%COMP%]:hover   .interDivChoice[_ngcontent-%COMP%] {\r\n    display: block;\r\n}\r\n\r\n.buttonReplay[_ngcontent-%COMP%], .buttonStats[_ngcontent-%COMP%] {\r\n    width: 40vw;\r\n    height: 5vw;\r\n    text-align: left;\r\n}\r\n\r\n.buttonReplay[_ngcontent-%COMP%]:hover, .buttonStats[_ngcontent-%COMP%]:hover {\r\n    cursor: pointer;\r\n    background-color: rgb(230, 230, 230);\r\n}\r\n\r\n.buttonReplay[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], .buttonStats[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\r\n    padding-top: 1.5vw;\r\n    margin-left: 5vw;\r\n}\r\n\r\n.choiceImage[_ngcontent-%COMP%] {\r\n    height: 4vw;\r\n    float: left;\r\n    margin: 0.5vw 2.5vw;\r\n    opacity: 0.3;\r\n}\r\n\r\n.bothButtons[_ngcontent-%COMP%] {\r\n    width: 40vw;\r\n    margin-left: 10vw;\r\n    font-size: 1.3vw;\r\n    \r\n    \r\n    \r\n    \r\n}\r\n\r\n.buttonReplay[_ngcontent-%COMP%] {\r\n    border-radius: 0 20px 0 0;\r\n}\r\n\r\n.buttonStats[_ngcontent-%COMP%] {\r\n    border-radius: 0 0 20px 0;\r\n}\r\n\r\n.link[_ngcontent-%COMP%] {\r\n    text-decoration: none;\r\n}\r\n\r\n.miniature[_ngcontent-%COMP%] {\r\n    height: 10vw;\r\n    float: left;\r\n    border-radius: 24px 0 0 24px;\r\n}\r\n\r\n.numberVideoImg[_ngcontent-%COMP%] {\r\n    position: absolute;\r\n    right: 25vw;\r\n    width: 4vw;\r\n    opacity: 0.2;\r\n    \r\n}\r\n\r\n.numberVideo[_ngcontent-%COMP%] {\r\n    position: absolute;\r\n    right: 25vw;\r\n    width: 4vw;\r\n    padding-top: 4vw;\r\n    font-size: 2vw;\r\n    text-align: center;\r\n}\r\n\r\n.infoVideo[_ngcontent-%COMP%] {\r\n    font-size: 1.3vw;\r\n    height: 5vw;\r\n    margin-left: 11vw;\r\n    margin-right: 7vw;\r\n    text-align: center;\r\n}\r\n\r\n.infoVideo[_ngcontent-%COMP%]    > p[_ngcontent-%COMP%] {\r\n    padding-top: 1.5vw;\r\n}\r\n\r\n.video-js[_ngcontent-%COMP%] {\r\n    width: 75%;\r\n    height: 75%;\r\n    margin: 0 auto;\r\n}\r\n\r\n.vjs-big-play-button[_ngcontent-%COMP%] {\r\n    position: absolute;\r\n    \r\n    margin-left: 50%;\r\n    margin-top: 13.5vw;\r\n    transform: translateX(-63%);\r\n    \r\n}\r\n\r\n.vjs-poster[_ngcontent-%COMP%] {\r\n    background-image: url('poster.jpg') !important;\r\n}\r\n\r\n@keyframes seconds {\r\n    0% {\r\n        border: 3px solid rgb(255, 255, 255);\r\n        background-color: rgb(240, 240, 240);\r\n    }\r\n    100% {\r\n        border: 3px solid #d9001b;\r\n        background-color: rgb(240, 240, 240);\r\n    }\r\n  }\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlcGxheXMuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtJQUNJLFdBQVc7QUFDZjs7QUFFQTtJQUNJLFdBQVc7SUFDWCxZQUFZO0lBQ1osYUFBYTtJQUNiLHdCQUF3QjtJQUN4QixvQ0FBb0M7SUFDcEMsMEJBQTBCO0lBQzFCLGtDQUFrQztBQUN0Qzs7QUFFQTtJQUNJLGNBQWM7QUFDbEI7O0FBRUE7SUFDSSxnQ0FBZ0M7QUFDcEM7O0FBRUE7SUFDSSxhQUFhO0FBQ2pCOztBQUVBO0lBQ0ksV0FBVztJQUNYLGlCQUFpQjtJQUNqQixxQkFBcUI7QUFDekI7O0FBRUE7SUFDSSxhQUFhO0FBQ2pCOztBQUVBO0lBQ0ksY0FBYztBQUNsQjs7QUFFQTtJQUNJLFdBQVc7SUFDWCxXQUFXO0lBQ1gsZ0JBQWdCO0FBQ3BCOztBQUVBO0lBQ0ksZUFBZTtJQUNmLG9DQUFvQztBQUN4Qzs7QUFFQTtJQUNJLGtCQUFrQjtJQUNsQixnQkFBZ0I7QUFDcEI7O0FBRUE7SUFDSSxXQUFXO0lBQ1gsV0FBVztJQUNYLG1CQUFtQjtJQUNuQixZQUFZO0FBQ2hCOztBQUdBO0lBQ0ksV0FBVztJQUNYLGlCQUFpQjtJQUNqQixnQkFBZ0I7SUFDaEI7bUNBQytCO0lBQy9CLHNCQUFzQjtJQUN0QixnQ0FBZ0M7SUFDaEMsa0NBQWtDO0FBQ3RDOztBQUVBO0lBQ0kseUJBQXlCO0FBQzdCOztBQUVBO0lBQ0kseUJBQXlCO0FBQzdCOztBQUVBO0lBQ0kscUJBQXFCO0FBQ3pCOztBQUVBO0lBQ0ksWUFBWTtJQUNaLFdBQVc7SUFDWCw0QkFBNEI7QUFDaEM7O0FBRUE7SUFDSSxrQkFBa0I7SUFDbEIsV0FBVztJQUNYLFVBQVU7SUFDVixZQUFZOztBQUVoQjs7QUFFQTtJQUNJLGtCQUFrQjtJQUNsQixXQUFXO0lBQ1gsVUFBVTtJQUNWLGdCQUFnQjtJQUNoQixjQUFjO0lBQ2Qsa0JBQWtCO0FBQ3RCOztBQUVBO0lBQ0ksZ0JBQWdCO0lBQ2hCLFdBQVc7SUFDWCxpQkFBaUI7SUFDakIsaUJBQWlCO0lBQ2pCLGtCQUFrQjtBQUN0Qjs7QUFFQTtJQUNJLGtCQUFrQjtBQUN0Qjs7QUFFQTtJQUNJLFVBQVU7SUFDVixXQUFXO0lBQ1gsY0FBYztBQUNsQjs7QUFDQTtJQUNJLGtCQUFrQjtJQUNsQixtQkFBbUI7SUFDbkIsZ0JBQWdCO0lBQ2hCLGtCQUFrQjtJQUNsQiwyQkFBMkI7SUFDM0IsMEJBQTBCO0FBQzlCOztBQUNBO0lBQ0ksOENBQTJEO0FBQy9EOztBQVlFO0lBQ0U7UUFDSSxvQ0FBb0M7UUFDcEMsb0NBQW9DO0lBQ3hDO0lBQ0E7UUFDSSx5QkFBeUI7UUFDekIsb0NBQW9DO0lBQ3hDO0VBQ0YiLCJmaWxlIjoicmVwbGF5cy5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmxvYWRpbmcge1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbn1cclxuXHJcbi5pbnRlckRpdiwgLmludGVyRGl2Q2hvaWNlIHtcclxuICAgIHdpZHRoOiA1MHZ3O1xyXG4gICAgaGVpZ2h0OiAxMHZ3O1xyXG4gICAgbWFyZ2luOiAydncgMDtcclxuICAgIC8qIHRleHQtYWxpZ246IGNlbnRlcjsgKi9cclxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYigyNTUsIDI1NSwgMjU1KTtcclxuICAgIGJvcmRlcjogM3B4IHNvbGlkIGRhcmtncmV5O1xyXG4gICAgYm9yZGVyLXJhZGl1czogMjVweCAyNXB4IDI1cHggMjVweDtcclxufVxyXG5cclxuLmludGVyRGl2IHtcclxuICAgIGRpc3BsYXk6IGJsb2NrO1xyXG59XHJcblxyXG4uaW50ZXJEaXYgKyAuaW50ZXJEaXZDaG9pY2Uge1xyXG4gICAgYW5pbWF0aW9uOiBzZWNvbmRzIDEuMHMgZm9yd2FyZHM7XHJcbn1cclxuXHJcbi5pbnRlckRpdkNob2ljZSB7XHJcbiAgICBkaXNwbGF5OiBub25lO1xyXG59XHJcblxyXG4jbWFpbkRpdiB7XHJcbiAgICB3aWR0aDogNTB2dztcclxuICAgIG1hcmdpbi1sZWZ0OiAyNXZ3O1xyXG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG59XHJcblxyXG4jbWFpbkRpdjpob3ZlciAuaW50ZXJEaXYge1xyXG4gICAgZGlzcGxheTogbm9uZTtcclxufVxyXG5cclxuI21haW5EaXY6aG92ZXIgLmludGVyRGl2Q2hvaWNlIHtcclxuICAgIGRpc3BsYXk6IGJsb2NrO1xyXG59XHJcblxyXG4uYnV0dG9uUmVwbGF5LCAuYnV0dG9uU3RhdHMge1xyXG4gICAgd2lkdGg6IDQwdnc7XHJcbiAgICBoZWlnaHQ6IDV2dztcclxuICAgIHRleHQtYWxpZ246IGxlZnQ7XHJcbn1cclxuXHJcbi5idXR0b25SZXBsYXk6aG92ZXIsIC5idXR0b25TdGF0czpob3ZlciB7XHJcbiAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMjMwLCAyMzAsIDIzMCk7XHJcbn1cclxuXHJcbi5idXR0b25SZXBsYXkgcCwgLmJ1dHRvblN0YXRzIHAge1xyXG4gICAgcGFkZGluZy10b3A6IDEuNXZ3O1xyXG4gICAgbWFyZ2luLWxlZnQ6IDV2dztcclxufVxyXG5cclxuLmNob2ljZUltYWdlIHtcclxuICAgIGhlaWdodDogNHZ3O1xyXG4gICAgZmxvYXQ6IGxlZnQ7XHJcbiAgICBtYXJnaW46IDAuNXZ3IDIuNXZ3O1xyXG4gICAgb3BhY2l0eTogMC4zO1xyXG59XHJcblxyXG5cclxuLmJvdGhCdXR0b25zIHtcclxuICAgIHdpZHRoOiA0MHZ3O1xyXG4gICAgbWFyZ2luLWxlZnQ6IDEwdnc7XHJcbiAgICBmb250LXNpemU6IDEuM3Z3O1xyXG4gICAgLyogYm9yZGVyOiAycHggc29saWQgZGFya2dyZXk7XHJcbiAgICBib3JkZXItbGVmdDogMHB4IHRyYW5zcGFyZW50OyAqL1xyXG4gICAgLyogbWFyZ2luLXRvcDogLTJweDsgKi9cclxuICAgIC8qIGJvcmRlcjogM3B4IHNvbGlkIGRhcmtncmV5OyAqL1xyXG4gICAgLyogYm9yZGVyLXJhZGl1czogMCAyNXB4IDI1cHggMDsgKi9cclxufVxyXG5cclxuLmJ1dHRvblJlcGxheSB7XHJcbiAgICBib3JkZXItcmFkaXVzOiAwIDIwcHggMCAwO1xyXG59XHJcblxyXG4uYnV0dG9uU3RhdHMge1xyXG4gICAgYm9yZGVyLXJhZGl1czogMCAwIDIwcHggMDtcclxufVxyXG5cclxuLmxpbmsge1xyXG4gICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xyXG59XHJcblxyXG4ubWluaWF0dXJlIHtcclxuICAgIGhlaWdodDogMTB2dztcclxuICAgIGZsb2F0OiBsZWZ0O1xyXG4gICAgYm9yZGVyLXJhZGl1czogMjRweCAwIDAgMjRweDtcclxufVxyXG5cclxuLm51bWJlclZpZGVvSW1nIHtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIHJpZ2h0OiAyNXZ3O1xyXG4gICAgd2lkdGg6IDR2dztcclxuICAgIG9wYWNpdHk6IDAuMjtcclxuICAgIFxyXG59XHJcblxyXG4ubnVtYmVyVmlkZW8ge1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgcmlnaHQ6IDI1dnc7XHJcbiAgICB3aWR0aDogNHZ3O1xyXG4gICAgcGFkZGluZy10b3A6IDR2dztcclxuICAgIGZvbnQtc2l6ZTogMnZ3O1xyXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG59XHJcblxyXG4uaW5mb1ZpZGVvIHtcclxuICAgIGZvbnQtc2l6ZTogMS4zdnc7XHJcbiAgICBoZWlnaHQ6IDV2dztcclxuICAgIG1hcmdpbi1sZWZ0OiAxMXZ3O1xyXG4gICAgbWFyZ2luLXJpZ2h0OiA3dnc7XHJcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbn1cclxuXHJcbi5pbmZvVmlkZW8gPiBwIHtcclxuICAgIHBhZGRpbmctdG9wOiAxLjV2dztcclxufVxyXG5cclxuLnZpZGVvLWpzIHtcclxuICAgIHdpZHRoOiA3NSU7XHJcbiAgICBoZWlnaHQ6IDc1JTtcclxuICAgIG1hcmdpbjogMCBhdXRvO1xyXG59XHJcbi52anMtYmlnLXBsYXktYnV0dG9uIHtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIC8qIG1hcmdpbjogMCA0NSU7ICovXHJcbiAgICBtYXJnaW4tbGVmdDogNTAlO1xyXG4gICAgbWFyZ2luLXRvcDogMTMuNXZ3O1xyXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKC02MyUpO1xyXG4gICAgLyogdG9wOiAxNHZ3ICFpbXBvcnRhbnQ7ICovXHJcbn1cclxuLnZqcy1wb3N0ZXIge1xyXG4gICAgYmFja2dyb3VuZC1pbWFnZTogdXJsKFwiLi4vLi4vYXNzZXRzL3Bvc3Rlci5qcGdcIikgIWltcG9ydGFudDtcclxufVxyXG5cclxuQC13ZWJraXQta2V5ZnJhbWVzIHNlY29uZHMge1xyXG4gICAgMCUge1xyXG4gICAgICAgIGJvcmRlcjogM3B4IHNvbGlkIHJnYigyNTUsIDI1NSwgMjU1KTtcclxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMjQwLCAyNDAsIDI0MCk7XHJcbiAgICB9XHJcbiAgICAxMDAlIHtcclxuICAgICAgICBib3JkZXI6IDNweCBzb2xpZCAjZDkwMDFiO1xyXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYigyNDAsIDI0MCwgMjQwKTtcclxuICAgIH1cclxuICB9XHJcbiAgQGtleWZyYW1lcyBzZWNvbmRzIHtcclxuICAgIDAlIHtcclxuICAgICAgICBib3JkZXI6IDNweCBzb2xpZCByZ2IoMjU1LCAyNTUsIDI1NSk7XHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDI0MCwgMjQwLCAyNDApO1xyXG4gICAgfVxyXG4gICAgMTAwJSB7XHJcbiAgICAgICAgYm9yZGVyOiAzcHggc29saWQgI2Q5MDAxYjtcclxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMjQwLCAyNDAsIDI0MCk7XHJcbiAgICB9XHJcbiAgfSJdfQ== */"];



/***/ }),

/***/ "L+R6":
/*!***********************************************************************!*\
  !*** ./src/app/cartography/cartography.component.css.shim.ngstyle.js ***!
  \***********************************************************************/
/*! exports provided: styles */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "styles", function() { return styles; });
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes,extraRequire}
 * tslint:disable
 */
var styles = ["body[_ngcontent-%COMP%] {\r\n    display: flex;\r\n    overflow-x: hidden;\r\n    flex-direction: column;\r\n    \r\n    \r\n}\r\n\r\nmain[_ngcontent-%COMP%] {\r\n    display: flex;\r\n    width: 88vw;\r\n    height: 80vh;\r\n    margin-left: 6vw;\r\n    border: 1px solid black;\r\n}\r\n\r\n.map-container[_ngcontent-%COMP%] {\r\n    flex-grow: 2;\r\n    width: 100%;\r\n    margin-right: -20vh;\r\n}\r\n\r\n#data[_ngcontent-%COMP%] {\r\n    position: absolute;\r\n    top: 16vh;\r\n    right: 6vw;\r\n    width: 16vw;\r\n    height: 70vh;\r\n    text-align: center;\r\n    border: 1px solid black;\r\n}\r\n\r\n.arrow[_ngcontent-%COMP%] {\r\n    position: absolute;\r\n    width: 8vh;\r\n    margin: 2vh 0 0;\r\n    right: 6vh;\r\n}\r\n\r\n.chrono[_ngcontent-%COMP%] {\r\n    position: absolute;\r\n    width: 20vh;\r\n    text-align: center;\r\n    font-size: 2.5vh;\r\n    top: 5vh;\r\n}\r\n\r\n.battery[_ngcontent-%COMP%] {\r\n    position: absolute;\r\n    width: 20vh;\r\n    text-align: center;\r\n    font-size: 2.5vh;\r\n    margin-top: 4.5vh;\r\n}\r\n\r\n.currentHour[_ngcontent-%COMP%] {\r\n    position: absolute;\r\n    width: 18vh;\r\n    bottom: 0;\r\n    text-align: center;\r\n    font-size: 2.5vh;\r\n    border: 1vh solid rgb(0, 0, 0, 0.4);\r\n    border-radius: 2vh;\r\n}\r\n\r\n.height[_ngcontent-%COMP%] {\r\n    position: absolute;\r\n    width: 20vh;\r\n    text-align: center;\r\n    font-size: 2.5vh;\r\n    margin-top: 4.5vh;\r\n}\r\n\r\n.logo[_ngcontent-%COMP%] {\r\n    margin: 0 4vh;\r\n    height: 12vh;\r\n    opacity: 0.4;\r\n    \r\n}\r\n\r\n.logoHeight[_ngcontent-%COMP%] {\r\n    margin: 0 7.98vh;\r\n    width: 4.03vh;\r\n    opacity: 0.4;\r\n}\r\n\r\n.airData[_ngcontent-%COMP%] {\r\n    position: relative;\r\n    top: 1vh;\r\n    height: 78vh;\r\n    width: 20vh;\r\n    border: 1px transparent;\r\n}\r\n\r\n.airDataItem[_ngcontent-%COMP%] { \r\n    width: 100%;\r\n}\r\n\r\nfooter[_ngcontent-%COMP%] {\r\n    background-color: var(--header-color);\r\n    padding: 1em;\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhcnRvZ3JhcGh5LmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0dBRUc7O0FBRUg7SUFDSSxhQUFhO0lBQ2Isa0JBQWtCO0lBQ2xCLHNCQUFzQjtJQUN0QixtQkFBbUI7SUFDbkIsaUJBQWlCO0FBQ3JCOztBQUVBO0lBQ0ksYUFBYTtJQUNiLFdBQVc7SUFDWCxZQUFZO0lBQ1osZ0JBQWdCO0lBQ2hCLHVCQUF1QjtBQUMzQjs7QUFFQTtJQUNJLFlBQVk7SUFDWixXQUFXO0lBQ1gsbUJBQW1CO0FBQ3ZCOztBQUVBO0lBQ0ksa0JBQWtCO0lBQ2xCLFNBQVM7SUFDVCxVQUFVO0lBQ1YsV0FBVztJQUNYLFlBQVk7SUFDWixrQkFBa0I7SUFDbEIsdUJBQXVCO0FBQzNCOztBQUVBO0lBQ0ksa0JBQWtCO0lBQ2xCLFVBQVU7SUFDVixlQUFlO0lBQ2YsVUFBVTtBQUNkOztBQUVBO0lBQ0ksa0JBQWtCO0lBQ2xCLFdBQVc7SUFDWCxrQkFBa0I7SUFDbEIsZ0JBQWdCO0lBQ2hCLFFBQVE7QUFDWjs7QUFFQTtJQUNJLGtCQUFrQjtJQUNsQixXQUFXO0lBQ1gsa0JBQWtCO0lBQ2xCLGdCQUFnQjtJQUNoQixpQkFBaUI7QUFDckI7O0FBRUE7SUFDSSxrQkFBa0I7SUFDbEIsV0FBVztJQUNYLFNBQVM7SUFDVCxrQkFBa0I7SUFDbEIsZ0JBQWdCO0lBQ2hCLG1DQUFtQztJQUNuQyxrQkFBa0I7QUFDdEI7O0FBRUE7SUFDSSxrQkFBa0I7SUFDbEIsV0FBVztJQUNYLGtCQUFrQjtJQUNsQixnQkFBZ0I7SUFDaEIsaUJBQWlCO0FBQ3JCOztBQUVBO0lBQ0ksYUFBYTtJQUNiLFlBQVk7SUFDWixZQUFZO0lBQ1osZ0NBQWdDO0FBQ3BDOztBQUVBO0lBQ0ksZ0JBQWdCO0lBQ2hCLGFBQWE7SUFDYixZQUFZO0FBQ2hCOztBQUVBO0lBQ0ksa0JBQWtCO0lBQ2xCLFFBQVE7SUFDUixZQUFZO0lBQ1osV0FBVztJQUNYLHVCQUF1QjtBQUMzQjs7QUFFQTtJQUNJLFdBQVc7QUFDZjs7QUFFQTtJQUNJLHFDQUFxQztJQUNyQyxZQUFZO0FBQ2hCIiwiZmlsZSI6ImNhcnRvZ3JhcGh5LmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBib2R5IHtcclxuICAgIG92ZXJmbG93LXg6IGhpZGRlbjtcclxufSAqL1xyXG5cclxuYm9keSB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgb3ZlcmZsb3cteDogaGlkZGVuO1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIC8qIGhlaWdodDogMTAwdmg7ICovXHJcbiAgICAvKiB3aWR0aDogMTAwJTsgKi9cclxufVxyXG5cclxubWFpbiB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgd2lkdGg6IDg4dnc7XHJcbiAgICBoZWlnaHQ6IDgwdmg7XHJcbiAgICBtYXJnaW4tbGVmdDogNnZ3O1xyXG4gICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XHJcbn1cclxuXHJcbi5tYXAtY29udGFpbmVyIHtcclxuICAgIGZsZXgtZ3JvdzogMjtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgbWFyZ2luLXJpZ2h0OiAtMjB2aDtcclxufVxyXG5cclxuI2RhdGEge1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgdG9wOiAxNnZoO1xyXG4gICAgcmlnaHQ6IDZ2dztcclxuICAgIHdpZHRoOiAxNnZ3O1xyXG4gICAgaGVpZ2h0OiA3MHZoO1xyXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XHJcbn1cclxuXHJcbi5hcnJvdyB7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICB3aWR0aDogOHZoO1xyXG4gICAgbWFyZ2luOiAydmggMCAwO1xyXG4gICAgcmlnaHQ6IDZ2aDtcclxufVxyXG5cclxuLmNocm9ubyB7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICB3aWR0aDogMjB2aDtcclxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgIGZvbnQtc2l6ZTogMi41dmg7XHJcbiAgICB0b3A6IDV2aDtcclxufVxyXG5cclxuLmJhdHRlcnkge1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgd2lkdGg6IDIwdmg7XHJcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICBmb250LXNpemU6IDIuNXZoO1xyXG4gICAgbWFyZ2luLXRvcDogNC41dmg7XHJcbn1cclxuXHJcbi5jdXJyZW50SG91ciB7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICB3aWR0aDogMTh2aDtcclxuICAgIGJvdHRvbTogMDtcclxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgIGZvbnQtc2l6ZTogMi41dmg7XHJcbiAgICBib3JkZXI6IDF2aCBzb2xpZCByZ2IoMCwgMCwgMCwgMC40KTtcclxuICAgIGJvcmRlci1yYWRpdXM6IDJ2aDtcclxufVxyXG5cclxuLmhlaWdodCB7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICB3aWR0aDogMjB2aDtcclxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgIGZvbnQtc2l6ZTogMi41dmg7XHJcbiAgICBtYXJnaW4tdG9wOiA0LjV2aDtcclxufVxyXG5cclxuLmxvZ28ge1xyXG4gICAgbWFyZ2luOiAwIDR2aDtcclxuICAgIGhlaWdodDogMTJ2aDtcclxuICAgIG9wYWNpdHk6IDAuNDtcclxuICAgIC8qIHRyYW5zZm9ybTogdHJhbnNsYXRlWCg1MCUpOyAqL1xyXG59XHJcblxyXG4ubG9nb0hlaWdodCB7XHJcbiAgICBtYXJnaW46IDAgNy45OHZoO1xyXG4gICAgd2lkdGg6IDQuMDN2aDtcclxuICAgIG9wYWNpdHk6IDAuNDtcclxufVxyXG5cclxuLmFpckRhdGEge1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgdG9wOiAxdmg7XHJcbiAgICBoZWlnaHQ6IDc4dmg7XHJcbiAgICB3aWR0aDogMjB2aDtcclxuICAgIGJvcmRlcjogMXB4IHRyYW5zcGFyZW50O1xyXG59XHJcblxyXG4uYWlyRGF0YUl0ZW0geyBcclxuICAgIHdpZHRoOiAxMDAlO1xyXG59XHJcblxyXG5mb290ZXIge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0taGVhZGVyLWNvbG9yKTtcclxuICAgIHBhZGRpbmc6IDFlbTtcclxufVxyXG4iXX0= */"];



/***/ }),

/***/ "L/CK":
/*!*************************************************************!*\
  !*** ./src/app/header/header.component.css.shim.ngstyle.js ***!
  \*************************************************************/
/*! exports provided: styles */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "styles", function() { return styles; });
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes,extraRequire}
 * tslint:disable
 */
var styles = ["#header[_ngcontent-%COMP%] {\r\n    height: 15vh;\r\n    width: 100%;\r\n    margin-bottom: 1vh;\r\n    \r\n    background-color: #d9001b;\r\n    color: white;\r\n    font-size: 3.5vh;\r\n}\r\n#title[_ngcontent-%COMP%] {\r\n    position: relative;\r\n    text-align: center;\r\n    padding-top: 6.5vh;\r\n    margin: 0 20vw;\r\n    z-index: 10;\r\n}\r\n#logoPompiersLeft[_ngcontent-%COMP%] {\r\n    float: left;\r\n    margin-left: 7%;\r\n    margin-top: 3vh;\r\n    height: 9vh;\r\n    z-index: 1000;\r\n}\r\n#logoPompiersRight[_ngcontent-%COMP%] {\r\n    float: right;\r\n    margin-right: 7%;\r\n    margin-top: 3vh;\r\n    height: 9vh;\r\n    z-index: 1000;\r\n}\r\n@media only screen and (max-width: 550px) {\r\n    #logoPompiersLeft[_ngcontent-%COMP%] {\r\n        margin-top: 5vh;\r\n        height: 5vh;\r\n    }\r\n    #logoPompiersRight[_ngcontent-%COMP%] {\r\n        margin-top: 5vh;\r\n        height: 5vh;\r\n    }\r\n}\r\n@media only screen and (max-width: 400px) {\r\n    #logoPompiersLeft[_ngcontent-%COMP%] {\r\n        margin-top: 6vh;\r\n        height: 3vh;\r\n    }\r\n    #logoPompiersRight[_ngcontent-%COMP%] {\r\n        margin-top: 6vh;\r\n        height: 3vh;\r\n    }\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhlYWRlci5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0lBQ0ksWUFBWTtJQUNaLFdBQVc7SUFDWCxrQkFBa0I7SUFDbEIsc0JBQXNCO0lBQ3RCLHlCQUF5QjtJQUN6QixZQUFZO0lBQ1osZ0JBQWdCO0FBQ3BCO0FBQ0E7SUFDSSxrQkFBa0I7SUFDbEIsa0JBQWtCO0lBQ2xCLGtCQUFrQjtJQUNsQixjQUFjO0lBQ2QsV0FBVztBQUNmO0FBQ0E7SUFDSSxXQUFXO0lBQ1gsZUFBZTtJQUNmLGVBQWU7SUFDZixXQUFXO0lBQ1gsYUFBYTtBQUNqQjtBQUVBO0lBQ0ksWUFBWTtJQUNaLGdCQUFnQjtJQUNoQixlQUFlO0lBQ2YsV0FBVztJQUNYLGFBQWE7QUFDakI7QUFFQTtJQUNJO1FBQ0ksZUFBZTtRQUNmLFdBQVc7SUFDZjtJQUNBO1FBQ0ksZUFBZTtRQUNmLFdBQVc7SUFDZjtBQUNKO0FBRUE7SUFDSTtRQUNJLGVBQWU7UUFDZixXQUFXO0lBQ2Y7SUFDQTtRQUNJLGVBQWU7UUFDZixXQUFXO0lBQ2Y7QUFDSiIsImZpbGUiOiJoZWFkZXIuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIiNoZWFkZXIge1xyXG4gICAgaGVpZ2h0OiAxNXZoO1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBtYXJnaW4tYm90dG9tOiAxdmg7XHJcbiAgICAvKiBtYXJnaW4tbGVmdDogLTUlOyAqL1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2Q5MDAxYjtcclxuICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgIGZvbnQtc2l6ZTogMy41dmg7XHJcbn1cclxuI3RpdGxlIHtcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgIHBhZGRpbmctdG9wOiA2LjV2aDtcclxuICAgIG1hcmdpbjogMCAyMHZ3O1xyXG4gICAgei1pbmRleDogMTA7XHJcbn1cclxuI2xvZ29Qb21waWVyc0xlZnQge1xyXG4gICAgZmxvYXQ6IGxlZnQ7XHJcbiAgICBtYXJnaW4tbGVmdDogNyU7XHJcbiAgICBtYXJnaW4tdG9wOiAzdmg7XHJcbiAgICBoZWlnaHQ6IDl2aDtcclxuICAgIHotaW5kZXg6IDEwMDA7XHJcbn1cclxuXHJcbiNsb2dvUG9tcGllcnNSaWdodCB7XHJcbiAgICBmbG9hdDogcmlnaHQ7XHJcbiAgICBtYXJnaW4tcmlnaHQ6IDclO1xyXG4gICAgbWFyZ2luLXRvcDogM3ZoO1xyXG4gICAgaGVpZ2h0OiA5dmg7XHJcbiAgICB6LWluZGV4OiAxMDAwO1xyXG59XHJcblxyXG5AbWVkaWEgb25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDU1MHB4KSB7XHJcbiAgICAjbG9nb1BvbXBpZXJzTGVmdCB7XHJcbiAgICAgICAgbWFyZ2luLXRvcDogNXZoO1xyXG4gICAgICAgIGhlaWdodDogNXZoO1xyXG4gICAgfVxyXG4gICAgI2xvZ29Qb21waWVyc1JpZ2h0IHtcclxuICAgICAgICBtYXJnaW4tdG9wOiA1dmg7XHJcbiAgICAgICAgaGVpZ2h0OiA1dmg7XHJcbiAgICB9XHJcbn1cclxuXHJcbkBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogNDAwcHgpIHtcclxuICAgICNsb2dvUG9tcGllcnNMZWZ0IHtcclxuICAgICAgICBtYXJnaW4tdG9wOiA2dmg7XHJcbiAgICAgICAgaGVpZ2h0OiAzdmg7XHJcbiAgICB9XHJcbiAgICAjbG9nb1BvbXBpZXJzUmlnaHQge1xyXG4gICAgICAgIG1hcmdpbi10b3A6IDZ2aDtcclxuICAgICAgICBoZWlnaHQ6IDN2aDtcclxuICAgIH1cclxufSJdfQ== */"];



/***/ }),

/***/ "O8d0":
/*!**************************************************************!*\
  !*** ./src/app/securelink/securelink.component.ngfactory.js ***!
  \**************************************************************/
/*! exports provided: RenderType_SecurelinkComponent, View_SecurelinkComponent_0, View_SecurelinkComponent_Host_0, SecurelinkComponentNgFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RenderType_SecurelinkComponent", function() { return RenderType_SecurelinkComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_SecurelinkComponent_0", function() { return View_SecurelinkComponent_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_SecurelinkComponent_Host_0", function() { return View_SecurelinkComponent_Host_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SecurelinkComponentNgFactory", function() { return SecurelinkComponentNgFactory; });
/* harmony import */ var _securelink_component_css_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./securelink.component.css.shim.ngstyle */ "OvRp");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "8Y7J");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "s7LF");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ "SVse");
/* harmony import */ var _securelink_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./securelink.component */ "UusY");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes,extraRequire}
 * tslint:disable
 */





var styles_SecurelinkComponent = [_securelink_component_css_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__["styles"]];
var RenderType_SecurelinkComponent = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵcrt"]({ encapsulation: 0, styles: styles_SecurelinkComponent, data: {} });

function View_SecurelinkComponent_1(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 3, "option", [], [[8, "selected", 0]], null, null, null, null)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](1, 147456, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NgSelectOption"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["Renderer2"], [2, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["SelectControlValueAccessor"]]], { value: [0, "value"] }, null), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](2, 147456, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ɵangular_packages_forms_forms_x"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["Renderer2"], [8, null]], { value: [0, "value"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](3, null, ["", ""]))], function (_ck, _v) { var currVal_1 = _v.context.$implicit.id; _ck(_v, 1, 0, currVal_1); var currVal_2 = _v.context.$implicit.id; _ck(_v, 2, 0, currVal_2); }, function (_ck, _v) { var currVal_0 = _v.context.$implicit.selected; _ck(_v, 0, 0, currVal_0); var currVal_3 = _v.context.$implicit.label; _ck(_v, 3, 0, currVal_3); }); }
function View_SecurelinkComponent_2(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 0, "div", [["style", "height: 0.5vw; background-color: white;"]], null, null, null, null, null))], null, null); }
function View_SecurelinkComponent_3(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 7, "div", [["id", "generationInfos"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 2, "p", [["id", "link"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](2, 0, null, null, 1, "a", [["style", "text-decoration:none, underline; color: black;"], ["target", "blank"]], [[8, "href", 4]], null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](3, null, ["", ""])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](4, 0, null, null, 3, "div", [["id", "buttons"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](5, 0, null, null, 2, "div", [["class", "copyButton"]], null, [[null, "click"]], function (_v, en, $event) { var ad = true; var _co = _v.component; if (("click" === en)) {
        var pd_0 = (_co.copyLink() !== false);
        ad = (pd_0 && ad);
    } return ad; }, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](6, 0, null, null, 1, "p", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["Copier le lien"]))], null, function (_ck, _v) { var _co = _v.component; var currVal_0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵinlineInterpolate"](1, "", _co.securedLink, ""); _ck(_v, 2, 0, currVal_0); var currVal_1 = _co.securedLink; _ck(_v, 3, 0, currVal_1); }); }
function View_SecurelinkComponent_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 2, "div", [["class", "linkButton"]], null, [[null, "click"]], function (_v, en, $event) { var ad = true; var _co = _v.component; if (("click" === en)) {
        var pd_0 = (_co.toggleModal() !== false);
        ad = (pd_0 && ad);
    } return ad; }, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 1, "p", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["G\u00E9n\u00E9rer un lien temporaire"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](3, 0, null, null, 0, "br", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](4, 0, null, null, 24, "div", [["class", "modal"], ["id", "myModal"]], [[4, "display", null]], null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](5, 0, null, null, 23, "div", [["class", "modal-box"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](6, 0, null, null, 22, "div", [["class", "modal-content"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](7, 0, null, null, 1, "span", [["class", "close"]], null, [[null, "click"]], function (_v, en, $event) { var ad = true; var _co = _v.component; if (("click" === en)) {
        var pd_0 = (_co.toggleModal() !== false);
        ad = (pd_0 && ad);
    } return ad; }, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["\u00D7"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](9, 0, null, null, 19, "div", [["id", "secureLinkmainDiv"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](10, 0, null, null, 14, "div", [["id", "secureLinkDataDiv"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](11, 0, null, null, 10, "p", [["id", "textGeneration"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["Le lien s\u00E9curis\u00E9 sera valable durant "])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](13, 0, null, null, 7, "select", [["id", "selectDuration"], ["type", "number"]], [[2, "ng-untouched", null], [2, "ng-touched", null], [2, "ng-pristine", null], [2, "ng-dirty", null], [2, "ng-valid", null], [2, "ng-invalid", null], [2, "ng-pending", null]], [[null, "ngModelChange"], [null, "change"], [null, "blur"]], function (_v, en, $event) { var ad = true; var _co = _v.component; if (("change" === en)) {
        var pd_0 = (_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 14).onChange($event.target.value) !== false);
        ad = (pd_0 && ad);
    } if (("blur" === en)) {
        var pd_1 = (_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 14).onTouched() !== false);
        ad = (pd_1 && ad);
    } if (("ngModelChange" === en)) {
        var pd_2 = ((_co.selectedOption = $event) !== false);
        ad = (pd_2 && ad);
    } return ad; }, null, null)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](14, 16384, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["SelectControlValueAccessor"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["Renderer2"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"]], null, null), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](1024, null, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NG_VALUE_ACCESSOR"], function (p0_0) { return [p0_0]; }, [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["SelectControlValueAccessor"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](16, 671744, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NgModel"], [[8, null], [8, null], [8, null], [6, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NG_VALUE_ACCESSOR"]]], { model: [0, "model"] }, { update: "ngModelChange" }), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](2048, null, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NgControl"], null, [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["NgModel"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](18, 16384, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NgControlStatus"], [[4, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NgControl"]]], null, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_SecurelinkComponent_1)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](20, 278528, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_3__["NgForOf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["IterableDiffers"]], { ngForOf: [0, "ngForOf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, [" heures"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](22, 0, null, null, 2, "div", [["class", "linkButton"]], null, [[null, "click"]], function (_v, en, $event) { var ad = true; var _co = _v.component; if (("click" === en)) {
        var pd_0 = (_co.generateSecureLink() !== false);
        ad = (pd_0 && ad);
    } return ad; }, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](23, 0, null, null, 1, "p", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["G\u00E9n\u00E9rer un lien s\u00E9curis\u00E9"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_SecurelinkComponent_2)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](26, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_3__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_SecurelinkComponent_3)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](28, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_3__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null)], function (_ck, _v) { var _co = _v.component; var currVal_8 = _co.selectedOption; _ck(_v, 16, 0, currVal_8); var currVal_9 = _co.options; _ck(_v, 20, 0, currVal_9); var currVal_10 = _co.isShown; _ck(_v, 26, 0, currVal_10); var currVal_11 = _co.isShown; _ck(_v, 28, 0, currVal_11); }, function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.displayModal; _ck(_v, 4, 0, currVal_0); var currVal_1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 18).ngClassUntouched; var currVal_2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 18).ngClassTouched; var currVal_3 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 18).ngClassPristine; var currVal_4 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 18).ngClassDirty; var currVal_5 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 18).ngClassValid; var currVal_6 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 18).ngClassInvalid; var currVal_7 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 18).ngClassPending; _ck(_v, 13, 0, currVal_1, currVal_2, currVal_3, currVal_4, currVal_5, currVal_6, currVal_7); }); }
function View_SecurelinkComponent_Host_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 1, "app-securelink", [], null, [["document", "click"]], function (_v, en, $event) { var ad = true; if (("document:click" === en)) {
        var pd_0 = (_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 1).onDocumentClick($event) !== false);
        ad = (pd_0 && ad);
    } return ad; }, View_SecurelinkComponent_0, RenderType_SecurelinkComponent)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](1, 114688, null, 0, _securelink_component__WEBPACK_IMPORTED_MODULE_4__["SecurelinkComponent"], [], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
var SecurelinkComponentNgFactory = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵccf"]("app-securelink", _securelink_component__WEBPACK_IMPORTED_MODULE_4__["SecurelinkComponent"], View_SecurelinkComponent_Host_0, {}, {}, []);



/***/ }),

/***/ "OvRp":
/*!*********************************************************************!*\
  !*** ./src/app/securelink/securelink.component.css.shim.ngstyle.js ***!
  \*********************************************************************/
/*! exports provided: styles */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "styles", function() { return styles; });
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes,extraRequire}
 * tslint:disable
 */
var styles = ["#secureLinkmainDiv[_ngcontent-%COMP%] {\r\n    height: auto;\r\n    width: 100%;\r\n}\r\n\r\n#secureLinkDataDiv[_ngcontent-%COMP%] {\r\n    width: 100%;\r\n    display: inline-block;\r\n    top: -50px; \r\n    text-align: center;\r\n}\r\n\r\n#textGeneration[_ngcontent-%COMP%] {\r\n    text-align: center;\r\n    font-size: 3vh;\r\n    color: black    ;\r\n    margin: 10px 0;\r\n}\r\n\r\n.linkButton[_ngcontent-%COMP%] {\r\n    text-align: center;\r\n    position: relative;\r\n    width: 20vw;\r\n    height: auto;\r\n    min-height: 8vh;\r\n    \r\n    margin: 5vh auto 0 auto;\r\n    background-color: rgb(214, 214, 214);\r\n}\r\n\r\n.copyButton[_ngcontent-%COMP%] {\r\n    text-align: center;\r\n    position: relative;\r\n    width: 15vw;\r\n    height: auto;\r\n    min-height: 6vh;\r\n    margin: 5vh auto 0 auto;\r\n    background-color: rgb(214, 214, 214);\r\n}\r\n\r\n.linkButton[_ngcontent-%COMP%]:hover, .copyButton[_ngcontent-%COMP%]:hover {\r\n    cursor: pointer;\r\n    background-color: rgb(190, 190, 190);\r\n}\r\n\r\n.linkButton[_ngcontent-%COMP%]    > p[_ngcontent-%COMP%] {\r\n    padding: 2vh 2vw;\r\n}\r\n\r\n.copyButton[_ngcontent-%COMP%]    > p[_ngcontent-%COMP%] {\r\n    padding: 1.5vh 1.5vw;\r\n}\r\n\r\n#link[_ngcontent-%COMP%] {\r\n    padding-top: 1vw;\r\n    font-size: 1vw;\r\n    text-align: center;\r\n    width: 100%;\r\n}\r\n\r\n#buttons[_ngcontent-%COMP%] {\r\n    text-align:center;\r\n}\r\n\r\n#validityHours[_ngcontent-%COMP%] {\r\n    width: 30px;\r\n}\r\n\r\n.modal[_ngcontent-%COMP%] {\r\n    position: fixed; \r\n    z-index: 1; \r\n    left: 0;\r\n    top: 0;\r\n    width: 100%; \r\n    height: 100%; \r\n    overflow: hidden; \r\n    background-color: rgb(0,0,0); \r\n    background-color: rgba(0,0,0,0.4); \r\n  }\r\n\r\n\r\n\r\n.modal-box[_ngcontent-%COMP%] {\r\n    background-color: #fefefe;\r\n    margin: 15% auto; \r\n    border: 1px solid #888;\r\n    width: 80%; \r\n  }\r\n\r\n.modal-content[_ngcontent-%COMP%] {\r\n    padding: 20px;\r\n  }\r\n\r\n\r\n\r\n.close[_ngcontent-%COMP%] {\r\n    color: #aaa;\r\n    float: right;\r\n    font-size: 28px;\r\n    font-weight: bold;\r\n  }\r\n\r\n.close[_ngcontent-%COMP%]:hover, .close[_ngcontent-%COMP%]:focus {\r\n    color: black;\r\n    text-decoration: none;\r\n    cursor: pointer;\r\n  }\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlY3VyZWxpbmsuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBO0lBQ0ksWUFBWTtJQUNaLFdBQVc7QUFDZjs7QUFFQTtJQUNJLFdBQVc7SUFDWCxxQkFBcUI7SUFDckIsVUFBVTtJQUNWLGtCQUFrQjtBQUN0Qjs7QUFFQTtJQUNJLGtCQUFrQjtJQUNsQixjQUFjO0lBQ2QsZ0JBQWdCO0lBQ2hCLGNBQWM7QUFDbEI7O0FBRUE7SUFDSSxrQkFBa0I7SUFDbEIsa0JBQWtCO0lBQ2xCLFdBQVc7SUFDWCxZQUFZO0lBQ1osZUFBZTtJQUNmLHFCQUFxQjtJQUNyQix1QkFBdUI7SUFDdkIsb0NBQW9DO0FBQ3hDOztBQUVBO0lBQ0ksa0JBQWtCO0lBQ2xCLGtCQUFrQjtJQUNsQixXQUFXO0lBQ1gsWUFBWTtJQUNaLGVBQWU7SUFDZix1QkFBdUI7SUFDdkIsb0NBQW9DO0FBQ3hDOztBQUVBO0lBQ0ksZUFBZTtJQUNmLG9DQUFvQztBQUN4Qzs7QUFFQTtJQUNJLGdCQUFnQjtBQUNwQjs7QUFFQTtJQUNJLG9CQUFvQjtBQUN4Qjs7QUFFQTtJQUNJLGdCQUFnQjtJQUNoQixjQUFjO0lBQ2Qsa0JBQWtCO0lBQ2xCLFdBQVc7QUFDZjs7QUFFQTtJQUNJLGlCQUFpQjtBQUNyQjs7QUFJQTtJQUNJLFdBQVc7QUFDZjs7QUFFQTtJQUNJLGVBQWUsRUFBRSxrQkFBa0I7SUFDbkMsVUFBVSxFQUFFLGVBQWU7SUFDM0IsT0FBTztJQUNQLE1BQU07SUFDTixXQUFXLEVBQUUsZUFBZTtJQUM1QixZQUFZLEVBQUUsZ0JBQWdCO0lBQzlCLGdCQUFnQixFQUFFLDRCQUE0QjtJQUM5Qyw0QkFBNEIsRUFBRSxtQkFBbUI7SUFDakQsaUNBQWlDLEVBQUUscUJBQXFCO0VBQzFEOztBQUVBLHNCQUFzQjs7QUFDdEI7SUFDRSx5QkFBeUI7SUFDekIsZ0JBQWdCLEVBQUUsa0NBQWtDO0lBQ3BELHNCQUFzQjtJQUN0QixVQUFVLEVBQUUsb0RBQW9EO0VBQ2xFOztBQUVBO0lBQ0UsYUFBYTtFQUNmOztBQUVBLHFCQUFxQjs7QUFDckI7SUFDRSxXQUFXO0lBQ1gsWUFBWTtJQUNaLGVBQWU7SUFDZixpQkFBaUI7RUFDbkI7O0FBRUE7O0lBRUUsWUFBWTtJQUNaLHFCQUFxQjtJQUNyQixlQUFlO0VBQ2pCIiwiZmlsZSI6InNlY3VyZWxpbmsuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5cclxuI3NlY3VyZUxpbmttYWluRGl2IHtcclxuICAgIGhlaWdodDogYXV0bztcclxuICAgIHdpZHRoOiAxMDAlO1xyXG59XHJcblxyXG4jc2VjdXJlTGlua0RhdGFEaXYge1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICB0b3A6IC01MHB4OyBcclxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxufVxyXG5cclxuI3RleHRHZW5lcmF0aW9uIHtcclxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgIGZvbnQtc2l6ZTogM3ZoO1xyXG4gICAgY29sb3I6IGJsYWNrICAgIDtcclxuICAgIG1hcmdpbjogMTBweCAwO1xyXG59XHJcblxyXG4ubGlua0J1dHRvbiB7XHJcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICB3aWR0aDogMjB2dztcclxuICAgIGhlaWdodDogYXV0bztcclxuICAgIG1pbi1oZWlnaHQ6IDh2aDtcclxuICAgIC8qIG1hcmdpbi10b3A6IDV2aDsgKi9cclxuICAgIG1hcmdpbjogNXZoIGF1dG8gMCBhdXRvO1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDIxNCwgMjE0LCAyMTQpO1xyXG59XHJcblxyXG4uY29weUJ1dHRvbiB7XHJcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICB3aWR0aDogMTV2dztcclxuICAgIGhlaWdodDogYXV0bztcclxuICAgIG1pbi1oZWlnaHQ6IDZ2aDtcclxuICAgIG1hcmdpbjogNXZoIGF1dG8gMCBhdXRvO1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDIxNCwgMjE0LCAyMTQpO1xyXG59XHJcblxyXG4ubGlua0J1dHRvbjpob3ZlciwgLmNvcHlCdXR0b246aG92ZXIge1xyXG4gICAgY3Vyc29yOiBwb2ludGVyO1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDE5MCwgMTkwLCAxOTApO1xyXG59XHJcblxyXG4ubGlua0J1dHRvbiA+IHAge1xyXG4gICAgcGFkZGluZzogMnZoIDJ2dztcclxufVxyXG5cclxuLmNvcHlCdXR0b24gPiBwIHtcclxuICAgIHBhZGRpbmc6IDEuNXZoIDEuNXZ3O1xyXG59XHJcblxyXG4jbGluayB7XHJcbiAgICBwYWRkaW5nLXRvcDogMXZ3O1xyXG4gICAgZm9udC1zaXplOiAxdnc7XHJcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICB3aWR0aDogMTAwJTtcclxufVxyXG5cclxuI2J1dHRvbnMge1xyXG4gICAgdGV4dC1hbGlnbjpjZW50ZXI7XHJcbn1cclxuXHJcblxyXG5cclxuI3ZhbGlkaXR5SG91cnMge1xyXG4gICAgd2lkdGg6IDMwcHg7XHJcbn0gICBcclxuXHJcbi5tb2RhbCB7XHJcbiAgICBwb3NpdGlvbjogZml4ZWQ7IC8qIFN0YXkgaW4gcGxhY2UgKi9cclxuICAgIHotaW5kZXg6IDE7IC8qIFNpdCBvbiB0b3AgKi9cclxuICAgIGxlZnQ6IDA7XHJcbiAgICB0b3A6IDA7XHJcbiAgICB3aWR0aDogMTAwJTsgLyogRnVsbCB3aWR0aCAqL1xyXG4gICAgaGVpZ2h0OiAxMDAlOyAvKiBGdWxsIGhlaWdodCAqL1xyXG4gICAgb3ZlcmZsb3c6IGhpZGRlbjsgLyogRW5hYmxlIHNjcm9sbCBpZiBuZWVkZWQgKi9cclxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYigwLDAsMCk7IC8qIEZhbGxiYWNrIGNvbG9yICovXHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsMCwwLDAuNCk7IC8qIEJsYWNrIHcvIG9wYWNpdHkgKi9cclxuICB9XHJcbiAgXHJcbiAgLyogTW9kYWwgQ29udGVudC9Cb3ggKi9cclxuICAubW9kYWwtYm94IHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICNmZWZlZmU7XHJcbiAgICBtYXJnaW46IDE1JSBhdXRvOyAvKiAxNSUgZnJvbSB0aGUgdG9wIGFuZCBjZW50ZXJlZCAqL1xyXG4gICAgYm9yZGVyOiAxcHggc29saWQgIzg4ODtcclxuICAgIHdpZHRoOiA4MCU7IC8qIENvdWxkIGJlIG1vcmUgb3IgbGVzcywgZGVwZW5kaW5nIG9uIHNjcmVlbiBzaXplICovXHJcbiAgfVxyXG5cclxuICAubW9kYWwtY29udGVudCB7XHJcbiAgICBwYWRkaW5nOiAyMHB4O1xyXG4gIH1cclxuICBcclxuICAvKiBUaGUgQ2xvc2UgQnV0dG9uICovXHJcbiAgLmNsb3NlIHtcclxuICAgIGNvbG9yOiAjYWFhO1xyXG4gICAgZmxvYXQ6IHJpZ2h0O1xyXG4gICAgZm9udC1zaXplOiAyOHB4O1xyXG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgfVxyXG4gIFxyXG4gIC5jbG9zZTpob3ZlcixcclxuICAuY2xvc2U6Zm9jdXMge1xyXG4gICAgY29sb3I6IGJsYWNrO1xyXG4gICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xyXG4gICAgY3Vyc29yOiBwb2ludGVyO1xyXG4gIH0iXX0= */"];



/***/ }),

/***/ "PCAR":
/*!***********************************************************************!*\
  !*** ./src/app/replayinter/replayinter.component.css.shim.ngstyle.js ***!
  \***********************************************************************/
/*! exports provided: styles */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "styles", function() { return styles; });
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes,extraRequire}
 * tslint:disable
 */
var styles = [".loading[_ngcontent-%COMP%] {\r\n    width: 100%;\r\n}\r\n\r\n.mainDiv[_ngcontent-%COMP%] {\r\n    width: 30%;\r\n    min-width: 200px;\r\n    margin-left: 67%;\r\n}\r\n\r\n.interDiv[_ngcontent-%COMP%] {\r\n    height: 75px;\r\n    margin: 10px 0;\r\n    right: 0;\r\n    text-align: center;\r\n    background-color: rgb(245, 245, 245);\r\n    border: 2px solid white;\r\n}\r\n\r\n.interDiv[_ngcontent-%COMP%]:hover {\r\n    background-color: rgb(214, 214, 214);\r\n    border: 2px solid darkgrey;\r\n}\r\n\r\n.link[_ngcontent-%COMP%] {\r\n    text-decoration: none;\r\n}\r\n\r\n.miniature[_ngcontent-%COMP%] {\r\n    height: 75px;\r\n    float: right;\r\n}\r\n\r\n.infoVideo[_ngcontent-%COMP%] {\r\n    padding: 29px 0;\r\n    left: 50px;\r\n    font-size: 15px;\r\n    height: 17px;\r\n}\r\n\r\n#contenu[_ngcontent-%COMP%] {\r\n    background-size: cover;\r\n    width: 60vw;\r\n    margin-left: 5%;\r\n    float: left;\r\n}\r\n\r\n.video-js[_ngcontent-%COMP%] {\r\n    width: 60vw;\r\n    height: 35vw;\r\n    margin: 0 auto;\r\n}\r\n\r\n.vjs-big-play-button[_ngcontent-%COMP%] {\r\n    position: absolute;\r\n    margin: 0 45%;\r\n    margin-left: 50%;\r\n    margin-top: 13.5vw;\r\n    \r\n}\r\n\r\n.vjs-poster[_ngcontent-%COMP%] {\r\n    background-image: url('poster.jpg') !important;\r\n}\r\n\r\n.vjs-styling[_ngcontent-%COMP%]   .vjs-volume-control[_ngcontent-%COMP%]   .vjs-control[_ngcontent-%COMP%]   .vjs-volume-horizontal[_ngcontent-%COMP%] {\r\n    background-color: red !important;\r\n}\r\n\r\n#changeButton[_ngcontent-%COMP%] {\r\n    height: 50px;\r\n    width: 75%;\r\n    margin-left: 12.5%;\r\n}\r\n\r\n#secureLinkDiv[_ngcontent-%COMP%] {\r\n\r\n    margin: 20px 0;\r\n    border: 2px solid black;\r\n}\r\n\r\n#newFluxDiv[_ngcontent-%COMP%] {\r\n    padding: 2px 0;\r\n    width: 102%;\r\n    margin-top: -10px;\r\n    margin-bottom: 10px;\r\n    margin-left: -1%;\r\n    background-color: #439600;\r\n    color: white;\r\n    font-size: 1.1vw;\r\n    text-align: center;\r\n    display: none;\r\n}\r\n\r\n#buttonLive[_ngcontent-%COMP%] {\r\n    text-align: center;\r\n}\r\n\r\n#backToLive[_ngcontent-%COMP%] {\r\n    height: 7%;\r\n    width:75%;\r\n    margin-left: 12.5%;\r\n    font-size: 1em;\r\n    display: block;\r\n}\r\n\r\n@media only screen and (max-width: 550px) {\r\n    .vjs-big-play-button[_ngcontent-%COMP%] {\r\n        margin-top: 0;\r\n    }\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlcGxheWludGVyLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7SUFDSSxXQUFXO0FBQ2Y7O0FBRUE7SUFDSSxVQUFVO0lBQ1YsZ0JBQWdCO0lBQ2hCLGdCQUFnQjtBQUNwQjs7QUFFQTtJQUNJLFlBQVk7SUFDWixjQUFjO0lBQ2QsUUFBUTtJQUNSLGtCQUFrQjtJQUNsQixvQ0FBb0M7SUFDcEMsdUJBQXVCO0FBQzNCOztBQUVBO0lBQ0ksb0NBQW9DO0lBQ3BDLDBCQUEwQjtBQUM5Qjs7QUFFQTtJQUNJLHFCQUFxQjtBQUN6Qjs7QUFFQTtJQUNJLFlBQVk7SUFDWixZQUFZO0FBQ2hCOztBQUVBO0lBQ0ksZUFBZTtJQUNmLFVBQVU7SUFDVixlQUFlO0lBQ2YsWUFBWTtBQUNoQjs7QUFFQTtJQUNJLHNCQUFzQjtJQUN0QixXQUFXO0lBQ1gsZUFBZTtJQUNmLFdBQVc7QUFDZjs7QUFDQTtJQUNJLFdBQVc7SUFDWCxZQUFZO0lBQ1osY0FBYztBQUNsQjs7QUFDQTtJQUNJLGtCQUFrQjtJQUNsQixhQUFhO0lBQ2IsZ0JBQWdCO0lBQ2hCLGtCQUFrQjtJQUNsQjsyQkFDdUI7QUFDM0I7O0FBQ0E7SUFDSSw4Q0FBMkQ7QUFDL0Q7O0FBQ0E7SUFDSSxnQ0FBZ0M7QUFDcEM7O0FBQ0E7SUFDSSxZQUFZO0lBQ1osVUFBVTtJQUNWLGtCQUFrQjtBQUN0Qjs7QUFDQTs7SUFFSSxjQUFjO0lBQ2QsdUJBQXVCO0FBQzNCOztBQUNBO0lBQ0ksY0FBYztJQUNkLFdBQVc7SUFDWCxpQkFBaUI7SUFDakIsbUJBQW1CO0lBQ25CLGdCQUFnQjtJQUNoQix5QkFBeUI7SUFDekIsWUFBWTtJQUNaLGdCQUFnQjtJQUNoQixrQkFBa0I7SUFDbEIsYUFBYTtBQUNqQjs7QUFDQTtJQUNJLGtCQUFrQjtBQUN0Qjs7QUFDQTtJQUNJLFVBQVU7SUFDVixTQUFTO0lBQ1Qsa0JBQWtCO0lBQ2xCLGNBQWM7SUFDZCxjQUFjO0FBQ2xCOztBQUVBO0lBQ0k7UUFDSSxhQUFhO0lBQ2pCO0FBQ0oiLCJmaWxlIjoicmVwbGF5aW50ZXIuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi5sb2FkaW5nIHtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG59XHJcblxyXG4ubWFpbkRpdiB7XHJcbiAgICB3aWR0aDogMzAlO1xyXG4gICAgbWluLXdpZHRoOiAyMDBweDtcclxuICAgIG1hcmdpbi1sZWZ0OiA2NyU7XHJcbn1cclxuXHJcbi5pbnRlckRpdiB7XHJcbiAgICBoZWlnaHQ6IDc1cHg7XHJcbiAgICBtYXJnaW46IDEwcHggMDtcclxuICAgIHJpZ2h0OiAwO1xyXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDI0NSwgMjQ1LCAyNDUpO1xyXG4gICAgYm9yZGVyOiAycHggc29saWQgd2hpdGU7XHJcbn1cclxuXHJcbi5pbnRlckRpdjpob3ZlciB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMjE0LCAyMTQsIDIxNCk7XHJcbiAgICBib3JkZXI6IDJweCBzb2xpZCBkYXJrZ3JleTtcclxufVxyXG5cclxuLmxpbmsge1xyXG4gICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xyXG59XHJcblxyXG4ubWluaWF0dXJlIHtcclxuICAgIGhlaWdodDogNzVweDtcclxuICAgIGZsb2F0OiByaWdodDtcclxufVxyXG5cclxuLmluZm9WaWRlbyB7XHJcbiAgICBwYWRkaW5nOiAyOXB4IDA7XHJcbiAgICBsZWZ0OiA1MHB4O1xyXG4gICAgZm9udC1zaXplOiAxNXB4O1xyXG4gICAgaGVpZ2h0OiAxN3B4O1xyXG59XHJcblxyXG4jY29udGVudSB7XHJcbiAgICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xyXG4gICAgd2lkdGg6IDYwdnc7XHJcbiAgICBtYXJnaW4tbGVmdDogNSU7XHJcbiAgICBmbG9hdDogbGVmdDtcclxufVxyXG4udmlkZW8tanMge1xyXG4gICAgd2lkdGg6IDYwdnc7XHJcbiAgICBoZWlnaHQ6IDM1dnc7XHJcbiAgICBtYXJnaW46IDAgYXV0bztcclxufVxyXG4udmpzLWJpZy1wbGF5LWJ1dHRvbiB7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICBtYXJnaW46IDAgNDUlO1xyXG4gICAgbWFyZ2luLWxlZnQ6IDUwJTtcclxuICAgIG1hcmdpbi10b3A6IDEzLjV2dztcclxuICAgIC8qIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtNjMlKTtcclxuICAgIHRvcDogMTR2dyAhaW1wb3J0YW50OyAqL1xyXG59IFxyXG4udmpzLXBvc3RlciB7XHJcbiAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCIuLi8uLi9hc3NldHMvcG9zdGVyLmpwZ1wiKSAhaW1wb3J0YW50O1xyXG59XHJcbi52anMtc3R5bGluZyAudmpzLXZvbHVtZS1jb250cm9sIC52anMtY29udHJvbCAudmpzLXZvbHVtZS1ob3Jpem9udGFsIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IHJlZCAhaW1wb3J0YW50O1xyXG59XHJcbiNjaGFuZ2VCdXR0b24ge1xyXG4gICAgaGVpZ2h0OiA1MHB4O1xyXG4gICAgd2lkdGg6IDc1JTtcclxuICAgIG1hcmdpbi1sZWZ0OiAxMi41JTtcclxufVxyXG4jc2VjdXJlTGlua0RpdiB7XHJcblxyXG4gICAgbWFyZ2luOiAyMHB4IDA7XHJcbiAgICBib3JkZXI6IDJweCBzb2xpZCBibGFjaztcclxufVxyXG4jbmV3Rmx1eERpdiB7XHJcbiAgICBwYWRkaW5nOiAycHggMDtcclxuICAgIHdpZHRoOiAxMDIlO1xyXG4gICAgbWFyZ2luLXRvcDogLTEwcHg7XHJcbiAgICBtYXJnaW4tYm90dG9tOiAxMHB4O1xyXG4gICAgbWFyZ2luLWxlZnQ6IC0xJTtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICM0Mzk2MDA7XHJcbiAgICBjb2xvcjogd2hpdGU7XHJcbiAgICBmb250LXNpemU6IDEuMXZ3O1xyXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgZGlzcGxheTogbm9uZTtcclxufVxyXG4jYnV0dG9uTGl2ZSB7XHJcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbn1cclxuI2JhY2tUb0xpdmUge1xyXG4gICAgaGVpZ2h0OiA3JTtcclxuICAgIHdpZHRoOjc1JTtcclxuICAgIG1hcmdpbi1sZWZ0OiAxMi41JTtcclxuICAgIGZvbnQtc2l6ZTogMWVtO1xyXG4gICAgZGlzcGxheTogYmxvY2s7XHJcbn1cclxuXHJcbkBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogNTUwcHgpIHtcclxuICAgIC52anMtYmlnLXBsYXktYnV0dG9uIHtcclxuICAgICAgICBtYXJnaW4tdG9wOiAwO1xyXG4gICAgfVxyXG59Il19 */"];



/***/ }),

/***/ "RnhZ":
/*!**************************************************!*\
  !*** ./node_modules/moment/locale sync ^\.\/.*$ ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./af": "K/tc",
	"./af.js": "K/tc",
	"./ar": "jnO4",
	"./ar-dz": "o1bE",
	"./ar-dz.js": "o1bE",
	"./ar-kw": "Qj4J",
	"./ar-kw.js": "Qj4J",
	"./ar-ly": "HP3h",
	"./ar-ly.js": "HP3h",
	"./ar-ma": "CoRJ",
	"./ar-ma.js": "CoRJ",
	"./ar-sa": "gjCT",
	"./ar-sa.js": "gjCT",
	"./ar-tn": "bYM6",
	"./ar-tn.js": "bYM6",
	"./ar.js": "jnO4",
	"./az": "SFxW",
	"./az.js": "SFxW",
	"./be": "H8ED",
	"./be.js": "H8ED",
	"./bg": "hKrs",
	"./bg.js": "hKrs",
	"./bm": "p/rL",
	"./bm.js": "p/rL",
	"./bn": "kEOa",
	"./bn-bd": "loYQ",
	"./bn-bd.js": "loYQ",
	"./bn.js": "kEOa",
	"./bo": "0mo+",
	"./bo.js": "0mo+",
	"./br": "aIdf",
	"./br.js": "aIdf",
	"./bs": "JVSJ",
	"./bs.js": "JVSJ",
	"./ca": "1xZ4",
	"./ca.js": "1xZ4",
	"./cs": "PA2r",
	"./cs.js": "PA2r",
	"./cv": "A+xa",
	"./cv.js": "A+xa",
	"./cy": "l5ep",
	"./cy.js": "l5ep",
	"./da": "DxQv",
	"./da.js": "DxQv",
	"./de": "tGlX",
	"./de-at": "s+uk",
	"./de-at.js": "s+uk",
	"./de-ch": "u3GI",
	"./de-ch.js": "u3GI",
	"./de.js": "tGlX",
	"./dv": "WYrj",
	"./dv.js": "WYrj",
	"./el": "jUeY",
	"./el.js": "jUeY",
	"./en-au": "Dmvi",
	"./en-au.js": "Dmvi",
	"./en-ca": "OIYi",
	"./en-ca.js": "OIYi",
	"./en-gb": "Oaa7",
	"./en-gb.js": "Oaa7",
	"./en-ie": "4dOw",
	"./en-ie.js": "4dOw",
	"./en-il": "czMo",
	"./en-il.js": "czMo",
	"./en-in": "7C5Q",
	"./en-in.js": "7C5Q",
	"./en-nz": "b1Dy",
	"./en-nz.js": "b1Dy",
	"./en-sg": "t+mt",
	"./en-sg.js": "t+mt",
	"./eo": "Zduo",
	"./eo.js": "Zduo",
	"./es": "iYuL",
	"./es-do": "CjzT",
	"./es-do.js": "CjzT",
	"./es-mx": "tbfe",
	"./es-mx.js": "tbfe",
	"./es-us": "Vclq",
	"./es-us.js": "Vclq",
	"./es.js": "iYuL",
	"./et": "7BjC",
	"./et.js": "7BjC",
	"./eu": "D/JM",
	"./eu.js": "D/JM",
	"./fa": "jfSC",
	"./fa.js": "jfSC",
	"./fi": "gekB",
	"./fi.js": "gekB",
	"./fil": "1ppg",
	"./fil.js": "1ppg",
	"./fo": "ByF4",
	"./fo.js": "ByF4",
	"./fr": "nyYc",
	"./fr-ca": "2fjn",
	"./fr-ca.js": "2fjn",
	"./fr-ch": "Dkky",
	"./fr-ch.js": "Dkky",
	"./fr.js": "nyYc",
	"./fy": "cRix",
	"./fy.js": "cRix",
	"./ga": "USCx",
	"./ga.js": "USCx",
	"./gd": "9rRi",
	"./gd.js": "9rRi",
	"./gl": "iEDd",
	"./gl.js": "iEDd",
	"./gom-deva": "qvJo",
	"./gom-deva.js": "qvJo",
	"./gom-latn": "DKr+",
	"./gom-latn.js": "DKr+",
	"./gu": "4MV3",
	"./gu.js": "4MV3",
	"./he": "x6pH",
	"./he.js": "x6pH",
	"./hi": "3E1r",
	"./hi.js": "3E1r",
	"./hr": "S6ln",
	"./hr.js": "S6ln",
	"./hu": "WxRl",
	"./hu.js": "WxRl",
	"./hy-am": "1rYy",
	"./hy-am.js": "1rYy",
	"./id": "UDhR",
	"./id.js": "UDhR",
	"./is": "BVg3",
	"./is.js": "BVg3",
	"./it": "bpih",
	"./it-ch": "bxKX",
	"./it-ch.js": "bxKX",
	"./it.js": "bpih",
	"./ja": "B55N",
	"./ja.js": "B55N",
	"./jv": "tUCv",
	"./jv.js": "tUCv",
	"./ka": "IBtZ",
	"./ka.js": "IBtZ",
	"./kk": "bXm7",
	"./kk.js": "bXm7",
	"./km": "6B0Y",
	"./km.js": "6B0Y",
	"./kn": "PpIw",
	"./kn.js": "PpIw",
	"./ko": "Ivi+",
	"./ko.js": "Ivi+",
	"./ku": "JCF/",
	"./ku.js": "JCF/",
	"./ky": "lgnt",
	"./ky.js": "lgnt",
	"./lb": "RAwQ",
	"./lb.js": "RAwQ",
	"./lo": "sp3z",
	"./lo.js": "sp3z",
	"./lt": "JvlW",
	"./lt.js": "JvlW",
	"./lv": "uXwI",
	"./lv.js": "uXwI",
	"./me": "KTz0",
	"./me.js": "KTz0",
	"./mi": "aIsn",
	"./mi.js": "aIsn",
	"./mk": "aQkU",
	"./mk.js": "aQkU",
	"./ml": "AvvY",
	"./ml.js": "AvvY",
	"./mn": "lYtQ",
	"./mn.js": "lYtQ",
	"./mr": "Ob0Z",
	"./mr.js": "Ob0Z",
	"./ms": "6+QB",
	"./ms-my": "ZAMP",
	"./ms-my.js": "ZAMP",
	"./ms.js": "6+QB",
	"./mt": "G0Uy",
	"./mt.js": "G0Uy",
	"./my": "honF",
	"./my.js": "honF",
	"./nb": "bOMt",
	"./nb.js": "bOMt",
	"./ne": "OjkT",
	"./ne.js": "OjkT",
	"./nl": "+s0g",
	"./nl-be": "2ykv",
	"./nl-be.js": "2ykv",
	"./nl.js": "+s0g",
	"./nn": "uEye",
	"./nn.js": "uEye",
	"./oc-lnc": "Fnuy",
	"./oc-lnc.js": "Fnuy",
	"./pa-in": "8/+R",
	"./pa-in.js": "8/+R",
	"./pl": "jVdC",
	"./pl.js": "jVdC",
	"./pt": "8mBD",
	"./pt-br": "0tRk",
	"./pt-br.js": "0tRk",
	"./pt.js": "8mBD",
	"./ro": "lyxo",
	"./ro.js": "lyxo",
	"./ru": "lXzo",
	"./ru.js": "lXzo",
	"./sd": "Z4QM",
	"./sd.js": "Z4QM",
	"./se": "//9w",
	"./se.js": "//9w",
	"./si": "7aV9",
	"./si.js": "7aV9",
	"./sk": "e+ae",
	"./sk.js": "e+ae",
	"./sl": "gVVK",
	"./sl.js": "gVVK",
	"./sq": "yPMs",
	"./sq.js": "yPMs",
	"./sr": "zx6S",
	"./sr-cyrl": "E+lV",
	"./sr-cyrl.js": "E+lV",
	"./sr.js": "zx6S",
	"./ss": "Ur1D",
	"./ss.js": "Ur1D",
	"./sv": "X709",
	"./sv.js": "X709",
	"./sw": "dNwA",
	"./sw.js": "dNwA",
	"./ta": "PeUW",
	"./ta.js": "PeUW",
	"./te": "XLvN",
	"./te.js": "XLvN",
	"./tet": "V2x9",
	"./tet.js": "V2x9",
	"./tg": "Oxv6",
	"./tg.js": "Oxv6",
	"./th": "EOgW",
	"./th.js": "EOgW",
	"./tk": "Wv91",
	"./tk.js": "Wv91",
	"./tl-ph": "Dzi0",
	"./tl-ph.js": "Dzi0",
	"./tlh": "z3Vd",
	"./tlh.js": "z3Vd",
	"./tr": "DoHr",
	"./tr.js": "DoHr",
	"./tzl": "z1FC",
	"./tzl.js": "z1FC",
	"./tzm": "wQk9",
	"./tzm-latn": "tT3J",
	"./tzm-latn.js": "tT3J",
	"./tzm.js": "wQk9",
	"./ug-cn": "YRex",
	"./ug-cn.js": "YRex",
	"./uk": "raLr",
	"./uk.js": "raLr",
	"./ur": "UpQW",
	"./ur.js": "UpQW",
	"./uz": "Loxo",
	"./uz-latn": "AQ68",
	"./uz-latn.js": "AQ68",
	"./uz.js": "Loxo",
	"./vi": "KSF8",
	"./vi.js": "KSF8",
	"./x-pseudo": "/X5v",
	"./x-pseudo.js": "/X5v",
	"./yo": "fzPg",
	"./yo.js": "fzPg",
	"./zh-cn": "XDpg",
	"./zh-cn.js": "XDpg",
	"./zh-hk": "SatO",
	"./zh-hk.js": "SatO",
	"./zh-mo": "OmwH",
	"./zh-mo.js": "OmwH",
	"./zh-tw": "kOpN",
	"./zh-tw.js": "kOpN"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "RnhZ";

/***/ }),

/***/ "Ss9G":
/*!*****************************************!*\
  !*** ./src/app/app.module.ngfactory.js ***!
  \*****************************************/
/*! exports provided: AppModuleNgFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModuleNgFactory", function() { return AppModuleNgFactory; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "8Y7J");
/* harmony import */ var _app_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app.module */ "ZAI4");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app.component */ "Sy1n");
/* harmony import */ var _statistics_statistics_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./statistics/statistics.component */ "4QAB");
/* harmony import */ var _node_modules_angular_router_router_ngfactory__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../node_modules/@angular/router/router.ngfactory */ "pMnS");
/* harmony import */ var _livestream_livestream_component_ngfactory__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./livestream/livestream.component.ngfactory */ "qJKH");
/* harmony import */ var _replays_replays_component_ngfactory__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./replays/replays.component.ngfactory */ "uwR5");
/* harmony import */ var _replayinter_replayinter_component_ngfactory__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./replayinter/replayinter.component.ngfactory */ "8h3+");
/* harmony import */ var _statistics_statistics_component_ngfactory__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./statistics/statistics.component.ngfactory */ "6WF9");
/* harmony import */ var _cartography_cartography_component_ngfactory__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./cartography/cartography.component.ngfactory */ "kIdT");
/* harmony import */ var _app_component_ngfactory__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./app.component.ngfactory */ "yvrC");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/common */ "SVse");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/platform-browser */ "cUpR");
/* harmony import */ var _angular_animations_browser__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/animations/browser */ "fDlF");
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/platform-browser/animations */ "omvX");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/common/http */ "IheW");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/router */ "iInd");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/forms */ "s7LF");
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/animations */ "GS7A");
/* harmony import */ var ng2_charts__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ng2-charts */ "hrfs");
/* harmony import */ var _livestream_livestream_component__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./livestream/livestream.component */ "a/xx");
/* harmony import */ var _replays_replays_component__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./replays/replays.component */ "409T");
/* harmony import */ var _replayinter_replayinter_component__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./replayinter/replayinter.component */ "WkRK");
/* harmony import */ var _cartography_cartography_component__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./cartography/cartography.component */ "24Si");
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./app-routing.module */ "vY5A");
/* harmony import */ var _angular_cdk_bidi__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! @angular/cdk/bidi */ "9gLZ");
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! @angular/material/core */ "UhP/");
/* harmony import */ var _angular_cdk_a11y__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! @angular/cdk/a11y */ "YEUz");
/* harmony import */ var _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! @angular/material/progress-bar */ "BTe0");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes,extraRequire}
 * tslint:disable
 */





























var AppModuleNgFactory = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵcmf"](_app_module__WEBPACK_IMPORTED_MODULE_1__["AppModule"], [_app_component__WEBPACK_IMPORTED_MODULE_2__["AppComponent"], _statistics_statistics_component__WEBPACK_IMPORTED_MODULE_3__["StatisticsComponent"]], function (_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmod"]([_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](512, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ComponentFactoryResolver"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵCodegenComponentFactoryResolver"], [[8, [_node_modules_angular_router_router_ngfactory__WEBPACK_IMPORTED_MODULE_4__["ɵangular_packages_router_router_lNgFactory"], _livestream_livestream_component_ngfactory__WEBPACK_IMPORTED_MODULE_5__["LivestreamComponentNgFactory"], _replays_replays_component_ngfactory__WEBPACK_IMPORTED_MODULE_6__["ReplaysComponentNgFactory"], _replayinter_replayinter_component_ngfactory__WEBPACK_IMPORTED_MODULE_7__["ReplayinterComponentNgFactory"], _statistics_statistics_component_ngfactory__WEBPACK_IMPORTED_MODULE_8__["StatisticsComponentNgFactory"], _cartography_cartography_component_ngfactory__WEBPACK_IMPORTED_MODULE_9__["CartographyComponentNgFactory"], _app_component_ngfactory__WEBPACK_IMPORTED_MODULE_10__["AppComponentNgFactory"]]], [3, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ComponentFactoryResolver"]], _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModuleRef"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](5120, _angular_core__WEBPACK_IMPORTED_MODULE_0__["LOCALE_ID"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵangular_packages_core_core_v"], [[3, _angular_core__WEBPACK_IMPORTED_MODULE_0__["LOCALE_ID"]]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](4608, _angular_common__WEBPACK_IMPORTED_MODULE_11__["NgLocalization"], _angular_common__WEBPACK_IMPORTED_MODULE_11__["NgLocaleLocalization"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["LOCALE_ID"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](5120, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵangular_packages_core_core_bc"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵangular_packages_core_core_x"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](5120, _angular_core__WEBPACK_IMPORTED_MODULE_0__["APP_ID"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵangular_packages_core_core_f"], []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](5120, _angular_core__WEBPACK_IMPORTED_MODULE_0__["IterableDiffers"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵangular_packages_core_core_t"], []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](5120, _angular_core__WEBPACK_IMPORTED_MODULE_0__["KeyValueDiffers"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵangular_packages_core_core_u"], []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](4608, _angular_platform_browser__WEBPACK_IMPORTED_MODULE_12__["DomSanitizer"], _angular_platform_browser__WEBPACK_IMPORTED_MODULE_12__["ɵDomSanitizerImpl"], [_angular_common__WEBPACK_IMPORTED_MODULE_11__["DOCUMENT"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](6144, _angular_core__WEBPACK_IMPORTED_MODULE_0__["Sanitizer"], null, [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_12__["DomSanitizer"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](4608, _angular_platform_browser__WEBPACK_IMPORTED_MODULE_12__["HAMMER_GESTURE_CONFIG"], _angular_platform_browser__WEBPACK_IMPORTED_MODULE_12__["HammerGestureConfig"], []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](5120, _angular_platform_browser__WEBPACK_IMPORTED_MODULE_12__["EVENT_MANAGER_PLUGINS"], function (p0_0, p0_1, p0_2, p1_0, p2_0, p2_1, p2_2, p2_3) { return [new _angular_platform_browser__WEBPACK_IMPORTED_MODULE_12__["ɵDomEventsPlugin"](p0_0, p0_1, p0_2), new _angular_platform_browser__WEBPACK_IMPORTED_MODULE_12__["ɵKeyEventsPlugin"](p1_0), new _angular_platform_browser__WEBPACK_IMPORTED_MODULE_12__["ɵHammerGesturesPlugin"](p2_0, p2_1, p2_2, p2_3)]; }, [_angular_common__WEBPACK_IMPORTED_MODULE_11__["DOCUMENT"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["PLATFORM_ID"], _angular_common__WEBPACK_IMPORTED_MODULE_11__["DOCUMENT"], _angular_common__WEBPACK_IMPORTED_MODULE_11__["DOCUMENT"], _angular_platform_browser__WEBPACK_IMPORTED_MODULE_12__["HAMMER_GESTURE_CONFIG"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵConsole"], [2, _angular_platform_browser__WEBPACK_IMPORTED_MODULE_12__["HAMMER_LOADER"]]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](4608, _angular_platform_browser__WEBPACK_IMPORTED_MODULE_12__["EventManager"], _angular_platform_browser__WEBPACK_IMPORTED_MODULE_12__["EventManager"], [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_12__["EVENT_MANAGER_PLUGINS"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](135680, _angular_platform_browser__WEBPACK_IMPORTED_MODULE_12__["ɵDomSharedStylesHost"], _angular_platform_browser__WEBPACK_IMPORTED_MODULE_12__["ɵDomSharedStylesHost"], [_angular_common__WEBPACK_IMPORTED_MODULE_11__["DOCUMENT"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](4608, _angular_platform_browser__WEBPACK_IMPORTED_MODULE_12__["ɵDomRendererFactory2"], _angular_platform_browser__WEBPACK_IMPORTED_MODULE_12__["ɵDomRendererFactory2"], [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_12__["EventManager"], _angular_platform_browser__WEBPACK_IMPORTED_MODULE_12__["ɵDomSharedStylesHost"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["APP_ID"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](5120, _angular_animations_browser__WEBPACK_IMPORTED_MODULE_13__["AnimationDriver"], _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_14__["ɵangular_packages_platform_browser_animations_animations_a"], []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](5120, _angular_animations_browser__WEBPACK_IMPORTED_MODULE_13__["ɵAnimationStyleNormalizer"], _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_14__["ɵangular_packages_platform_browser_animations_animations_b"], []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](4608, _angular_animations_browser__WEBPACK_IMPORTED_MODULE_13__["ɵAnimationEngine"], _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_14__["ɵInjectableAnimationEngine"], [_angular_common__WEBPACK_IMPORTED_MODULE_11__["DOCUMENT"], _angular_animations_browser__WEBPACK_IMPORTED_MODULE_13__["AnimationDriver"], _angular_animations_browser__WEBPACK_IMPORTED_MODULE_13__["ɵAnimationStyleNormalizer"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](5120, _angular_core__WEBPACK_IMPORTED_MODULE_0__["RendererFactory2"], _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_14__["ɵangular_packages_platform_browser_animations_animations_c"], [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_12__["ɵDomRendererFactory2"], _angular_animations_browser__WEBPACK_IMPORTED_MODULE_13__["ɵAnimationEngine"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](6144, _angular_platform_browser__WEBPACK_IMPORTED_MODULE_12__["ɵSharedStylesHost"], null, [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_12__["ɵDomSharedStylesHost"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](4608, _angular_core__WEBPACK_IMPORTED_MODULE_0__["Testability"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["Testability"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](4608, _angular_common_http__WEBPACK_IMPORTED_MODULE_15__["HttpXsrfTokenExtractor"], _angular_common_http__WEBPACK_IMPORTED_MODULE_15__["ɵangular_packages_common_http_http_g"], [_angular_common__WEBPACK_IMPORTED_MODULE_11__["DOCUMENT"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["PLATFORM_ID"], _angular_common_http__WEBPACK_IMPORTED_MODULE_15__["ɵangular_packages_common_http_http_e"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](4608, _angular_common_http__WEBPACK_IMPORTED_MODULE_15__["ɵangular_packages_common_http_http_h"], _angular_common_http__WEBPACK_IMPORTED_MODULE_15__["ɵangular_packages_common_http_http_h"], [_angular_common_http__WEBPACK_IMPORTED_MODULE_15__["HttpXsrfTokenExtractor"], _angular_common_http__WEBPACK_IMPORTED_MODULE_15__["ɵangular_packages_common_http_http_f"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](5120, _angular_common_http__WEBPACK_IMPORTED_MODULE_15__["HTTP_INTERCEPTORS"], function (p0_0) { return [p0_0]; }, [_angular_common_http__WEBPACK_IMPORTED_MODULE_15__["ɵangular_packages_common_http_http_h"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](4608, _angular_common_http__WEBPACK_IMPORTED_MODULE_15__["ɵangular_packages_common_http_http_d"], _angular_common_http__WEBPACK_IMPORTED_MODULE_15__["ɵangular_packages_common_http_http_d"], []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](6144, _angular_common_http__WEBPACK_IMPORTED_MODULE_15__["XhrFactory"], null, [_angular_common_http__WEBPACK_IMPORTED_MODULE_15__["ɵangular_packages_common_http_http_d"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](4608, _angular_common_http__WEBPACK_IMPORTED_MODULE_15__["HttpXhrBackend"], _angular_common_http__WEBPACK_IMPORTED_MODULE_15__["HttpXhrBackend"], [_angular_common_http__WEBPACK_IMPORTED_MODULE_15__["XhrFactory"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](6144, _angular_common_http__WEBPACK_IMPORTED_MODULE_15__["HttpBackend"], null, [_angular_common_http__WEBPACK_IMPORTED_MODULE_15__["HttpXhrBackend"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](4608, _angular_common_http__WEBPACK_IMPORTED_MODULE_15__["HttpHandler"], _angular_common_http__WEBPACK_IMPORTED_MODULE_15__["ɵHttpInterceptingHandler"], [_angular_common_http__WEBPACK_IMPORTED_MODULE_15__["HttpBackend"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injector"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](4608, _angular_common_http__WEBPACK_IMPORTED_MODULE_15__["HttpClient"], _angular_common_http__WEBPACK_IMPORTED_MODULE_15__["HttpClient"], [_angular_common_http__WEBPACK_IMPORTED_MODULE_15__["HttpHandler"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](5120, _angular_router__WEBPACK_IMPORTED_MODULE_16__["ActivatedRoute"], _angular_router__WEBPACK_IMPORTED_MODULE_16__["ɵangular_packages_router_router_g"], [_angular_router__WEBPACK_IMPORTED_MODULE_16__["Router"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](4608, _angular_router__WEBPACK_IMPORTED_MODULE_16__["NoPreloading"], _angular_router__WEBPACK_IMPORTED_MODULE_16__["NoPreloading"], []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](6144, _angular_router__WEBPACK_IMPORTED_MODULE_16__["PreloadingStrategy"], null, [_angular_router__WEBPACK_IMPORTED_MODULE_16__["NoPreloading"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](135680, _angular_router__WEBPACK_IMPORTED_MODULE_16__["RouterPreloader"], _angular_router__WEBPACK_IMPORTED_MODULE_16__["RouterPreloader"], [_angular_router__WEBPACK_IMPORTED_MODULE_16__["Router"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModuleFactoryLoader"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["Compiler"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injector"], _angular_router__WEBPACK_IMPORTED_MODULE_16__["PreloadingStrategy"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](4608, _angular_router__WEBPACK_IMPORTED_MODULE_16__["PreloadAllModules"], _angular_router__WEBPACK_IMPORTED_MODULE_16__["PreloadAllModules"], []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](5120, _angular_router__WEBPACK_IMPORTED_MODULE_16__["ɵangular_packages_router_router_o"], _angular_router__WEBPACK_IMPORTED_MODULE_16__["ɵangular_packages_router_router_c"], [_angular_router__WEBPACK_IMPORTED_MODULE_16__["Router"], _angular_common__WEBPACK_IMPORTED_MODULE_11__["ViewportScroller"], _angular_router__WEBPACK_IMPORTED_MODULE_16__["ROUTER_CONFIGURATION"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](5120, _angular_router__WEBPACK_IMPORTED_MODULE_16__["ROUTER_INITIALIZER"], _angular_router__WEBPACK_IMPORTED_MODULE_16__["ɵangular_packages_router_router_j"], [_angular_router__WEBPACK_IMPORTED_MODULE_16__["ɵangular_packages_router_router_h"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](5120, _angular_core__WEBPACK_IMPORTED_MODULE_0__["APP_BOOTSTRAP_LISTENER"], function (p0_0) { return [p0_0]; }, [_angular_router__WEBPACK_IMPORTED_MODULE_16__["ROUTER_INITIALIZER"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](4608, _angular_forms__WEBPACK_IMPORTED_MODULE_17__["ɵangular_packages_forms_forms_n"], _angular_forms__WEBPACK_IMPORTED_MODULE_17__["ɵangular_packages_forms_forms_n"], []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](4608, _angular_animations__WEBPACK_IMPORTED_MODULE_18__["AnimationBuilder"], _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_14__["ɵBrowserAnimationBuilder"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["RendererFactory2"], _angular_common__WEBPACK_IMPORTED_MODULE_11__["DOCUMENT"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](1073742336, ng2_charts__WEBPACK_IMPORTED_MODULE_19__["ChartsModule"], ng2_charts__WEBPACK_IMPORTED_MODULE_19__["ChartsModule"], []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](1073742336, _angular_common__WEBPACK_IMPORTED_MODULE_11__["CommonModule"], _angular_common__WEBPACK_IMPORTED_MODULE_11__["CommonModule"], []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](1024, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ErrorHandler"], _angular_platform_browser__WEBPACK_IMPORTED_MODULE_12__["ɵangular_packages_platform_browser_platform_browser_a"], []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](1024, _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgProbeToken"], function () { return [_angular_router__WEBPACK_IMPORTED_MODULE_16__["ɵangular_packages_router_router_b"]()]; }, []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](512, _angular_router__WEBPACK_IMPORTED_MODULE_16__["ɵangular_packages_router_router_h"], _angular_router__WEBPACK_IMPORTED_MODULE_16__["ɵangular_packages_router_router_h"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injector"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](1024, _angular_core__WEBPACK_IMPORTED_MODULE_0__["APP_INITIALIZER"], function (p0_0, p1_0) { return [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_12__["ɵangular_packages_platform_browser_platform_browser_m"](p0_0), _angular_router__WEBPACK_IMPORTED_MODULE_16__["ɵangular_packages_router_router_i"](p1_0)]; }, [[2, _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgProbeToken"]], _angular_router__WEBPACK_IMPORTED_MODULE_16__["ɵangular_packages_router_router_h"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](512, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ApplicationInitStatus"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ApplicationInitStatus"], [[2, _angular_core__WEBPACK_IMPORTED_MODULE_0__["APP_INITIALIZER"]]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](131584, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ApplicationRef"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ApplicationRef"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵConsole"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injector"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ErrorHandler"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ComponentFactoryResolver"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ApplicationInitStatus"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](1073742336, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ApplicationModule"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ApplicationModule"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ApplicationRef"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](1073742336, _angular_platform_browser__WEBPACK_IMPORTED_MODULE_12__["BrowserModule"], _angular_platform_browser__WEBPACK_IMPORTED_MODULE_12__["BrowserModule"], [[3, _angular_platform_browser__WEBPACK_IMPORTED_MODULE_12__["BrowserModule"]]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](1073742336, _angular_common_http__WEBPACK_IMPORTED_MODULE_15__["HttpClientXsrfModule"], _angular_common_http__WEBPACK_IMPORTED_MODULE_15__["HttpClientXsrfModule"], []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](1073742336, _angular_common_http__WEBPACK_IMPORTED_MODULE_15__["HttpClientModule"], _angular_common_http__WEBPACK_IMPORTED_MODULE_15__["HttpClientModule"], []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](1024, _angular_router__WEBPACK_IMPORTED_MODULE_16__["ɵangular_packages_router_router_a"], _angular_router__WEBPACK_IMPORTED_MODULE_16__["ɵangular_packages_router_router_e"], [[3, _angular_router__WEBPACK_IMPORTED_MODULE_16__["Router"]]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](512, _angular_router__WEBPACK_IMPORTED_MODULE_16__["UrlSerializer"], _angular_router__WEBPACK_IMPORTED_MODULE_16__["DefaultUrlSerializer"], []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](512, _angular_router__WEBPACK_IMPORTED_MODULE_16__["ChildrenOutletContexts"], _angular_router__WEBPACK_IMPORTED_MODULE_16__["ChildrenOutletContexts"], []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](256, _angular_router__WEBPACK_IMPORTED_MODULE_16__["ROUTER_CONFIGURATION"], {}, []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](1024, _angular_common__WEBPACK_IMPORTED_MODULE_11__["LocationStrategy"], _angular_router__WEBPACK_IMPORTED_MODULE_16__["ɵangular_packages_router_router_d"], [_angular_common__WEBPACK_IMPORTED_MODULE_11__["PlatformLocation"], [2, _angular_common__WEBPACK_IMPORTED_MODULE_11__["APP_BASE_HREF"]], _angular_router__WEBPACK_IMPORTED_MODULE_16__["ROUTER_CONFIGURATION"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](512, _angular_common__WEBPACK_IMPORTED_MODULE_11__["Location"], _angular_common__WEBPACK_IMPORTED_MODULE_11__["Location"], [_angular_common__WEBPACK_IMPORTED_MODULE_11__["LocationStrategy"], _angular_common__WEBPACK_IMPORTED_MODULE_11__["PlatformLocation"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](512, _angular_core__WEBPACK_IMPORTED_MODULE_0__["Compiler"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["Compiler"], []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](512, _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModuleFactoryLoader"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["SystemJsNgModuleLoader"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["Compiler"], [2, _angular_core__WEBPACK_IMPORTED_MODULE_0__["SystemJsNgModuleLoaderConfig"]]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](1024, _angular_router__WEBPACK_IMPORTED_MODULE_16__["ROUTES"], function () { return [[{ path: "live", component: _livestream_livestream_component__WEBPACK_IMPORTED_MODULE_20__["LivestreamComponent"] }, { path: "replays", component: _replays_replays_component__WEBPACK_IMPORTED_MODULE_21__["ReplaysComponent"] }, { path: "replay", component: _replayinter_replayinter_component__WEBPACK_IMPORTED_MODULE_22__["ReplayinterComponent"] }, { path: "stats", component: _statistics_statistics_component__WEBPACK_IMPORTED_MODULE_3__["StatisticsComponent"] }, { path: "carto", component: _cartography_cartography_component__WEBPACK_IMPORTED_MODULE_23__["CartographyComponent"] }, { path: "limited", component: _livestream_livestream_component__WEBPACK_IMPORTED_MODULE_20__["LivestreamComponent"] }, { path: "**", component: _cartography_cartography_component__WEBPACK_IMPORTED_MODULE_23__["CartographyComponent"] }]]; }, []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](1024, _angular_router__WEBPACK_IMPORTED_MODULE_16__["Router"], _angular_router__WEBPACK_IMPORTED_MODULE_16__["ɵangular_packages_router_router_f"], [_angular_router__WEBPACK_IMPORTED_MODULE_16__["UrlSerializer"], _angular_router__WEBPACK_IMPORTED_MODULE_16__["ChildrenOutletContexts"], _angular_common__WEBPACK_IMPORTED_MODULE_11__["Location"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injector"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModuleFactoryLoader"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["Compiler"], _angular_router__WEBPACK_IMPORTED_MODULE_16__["ROUTES"], _angular_router__WEBPACK_IMPORTED_MODULE_16__["ROUTER_CONFIGURATION"], [2, _angular_router__WEBPACK_IMPORTED_MODULE_16__["UrlHandlingStrategy"]], [2, _angular_router__WEBPACK_IMPORTED_MODULE_16__["RouteReuseStrategy"]]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](1073742336, _angular_router__WEBPACK_IMPORTED_MODULE_16__["RouterModule"], _angular_router__WEBPACK_IMPORTED_MODULE_16__["RouterModule"], [[2, _angular_router__WEBPACK_IMPORTED_MODULE_16__["ɵangular_packages_router_router_a"]], [2, _angular_router__WEBPACK_IMPORTED_MODULE_16__["Router"]]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](1073742336, _app_routing_module__WEBPACK_IMPORTED_MODULE_24__["AppRoutingModule"], _app_routing_module__WEBPACK_IMPORTED_MODULE_24__["AppRoutingModule"], []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](1073742336, _angular_forms__WEBPACK_IMPORTED_MODULE_17__["ɵangular_packages_forms_forms_d"], _angular_forms__WEBPACK_IMPORTED_MODULE_17__["ɵangular_packages_forms_forms_d"], []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](1073742336, _angular_forms__WEBPACK_IMPORTED_MODULE_17__["FormsModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_17__["FormsModule"], []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](1073742336, _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_14__["BrowserAnimationsModule"], _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_14__["BrowserAnimationsModule"], []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](1073742336, _angular_cdk_bidi__WEBPACK_IMPORTED_MODULE_25__["BidiModule"], _angular_cdk_bidi__WEBPACK_IMPORTED_MODULE_25__["BidiModule"], []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](1073742336, _angular_material_core__WEBPACK_IMPORTED_MODULE_26__["MatCommonModule"], _angular_material_core__WEBPACK_IMPORTED_MODULE_26__["MatCommonModule"], [_angular_cdk_a11y__WEBPACK_IMPORTED_MODULE_27__["HighContrastModeDetector"], [2, _angular_material_core__WEBPACK_IMPORTED_MODULE_26__["MATERIAL_SANITY_CHECKS"]], _angular_common__WEBPACK_IMPORTED_MODULE_11__["DOCUMENT"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](1073742336, _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_28__["MatProgressBarModule"], _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_28__["MatProgressBarModule"], []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](1073742336, _app_module__WEBPACK_IMPORTED_MODULE_1__["AppModule"], _app_module__WEBPACK_IMPORTED_MODULE_1__["AppModule"], []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](256, _angular_core__WEBPACK_IMPORTED_MODULE_0__["DEFAULT_CURRENCY_CODE"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵangular_packages_core_core_y"], []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](256, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵINJECTOR_SCOPE"], "root", []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](256, _angular_common_http__WEBPACK_IMPORTED_MODULE_15__["ɵangular_packages_common_http_http_e"], "XSRF-TOKEN", []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](256, _angular_common_http__WEBPACK_IMPORTED_MODULE_15__["ɵangular_packages_common_http_http_f"], "X-XSRF-TOKEN", []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵmpd"](256, _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_14__["ANIMATION_MODULE_TYPE"], "BrowserAnimations", [])]); });



/***/ }),

/***/ "Sy1n":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
// var videojs : any ;
class AppComponent {
    constructor() {
        this.title = 'zsbwDrone';
        // changeSrc(source: string) {
        //   if(source == "live") {
        //       window.location.href = window.location.href;
        //   }
        //   else {
        //       var source = "http://192.168.13.110:8080/replay/" + source;
        //       window.player.updateSrc([
        //           { type: "video/mp4", src: source, label:'HD' }
        //       ]);
        //       document.getElementById("backToLive").style.display = "block";
        //   }
        //   window.scrollTo({top: 0, behavior: 'smooth'})
        // }
        // notification(text: string) {
        //     document.getElementById("newFlux").innerText = text;
        //     document.getElementById("newFluxDiv").style.display = "block";
        // }
        // stopNotification() {
        //     document.getElementById("newFluxDiv").style.display = "none";
        // }
        // getFlux() {
        //     var xhttp = new XMLHttpRequest();
        //     xhttp.onreadystatechange = function() {
        //         if (this.readyState == 4 && this.status == 200) {
        //             var data = JSON.parse(this.responseText);
        //             if(data.length != 0) {
        //                 var isStreaming = false;
        //                 for(file in data) {
        //                     if(data[file].name == "index.m3u8") {
        //                         isStreaming = true;
        //                     }
        //                 }
        //                 if(isStreaming) {
        //                   this.notification('Une retransmission en direct est en cours.');
        //                     document.getElementById("buttonLive").style.display = "auto";
        //                 }
        //                 else {
        //                   this.stopNotification();
        //                     document.getElementById("buttonLive").style.display = "none";
        //                 }
        //             }
        //             else {
        //                 this.stopNotification();
        //                 document.getElementById("buttonLive").style.display = "none";
        //             }
        //         };
        //     }
        //     xhttp.open("GET", "http://192.168.13.110:8080/live", true);
        //     xhttp.send();
        // }
        // updateFlux() {
        //     this.getFlux();
        //     setTimeout(this.updateFlux, 30000)
        // }
    }
    // public videoJsConfigObj = {
    //   preload: "metadata",
    //   controls: true,
    //   autoplay: false,
    //   overrideNative: true,
    //   techOrder: ["html5", "flash"],
    //   html5: {
    //       nativeVideoTracks: true,
    //       nativeAudioTracks: false,
    //       nativeTextTracks: false,
    //       hls: {
    //           withCredentials: false,
    //           overrideNative: true,
    //           debug: true
    //       }
    //   }
    // };
    ngOnInit() {
        // var player = videojs('my-video', this.videoJsConfigObj);
    }
}


/***/ }),

/***/ "TYUN":
/*!****************************************************************!*\
  !*** ./src/app/livestream/livestream.component.css.ngstyle.js ***!
  \****************************************************************/
/*! exports provided: styles */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "styles", function() { return styles; });
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes,extraRequire}
 * tslint:disable
 */
var styles = ["#contenu {\r\n    background-image: url(\"/admin/assets/bgImg.jpg\");\r\n    background-size: cover;\r\n    width: 60%;\r\n    margin-left: 20%;\r\n}\r\n.video-js {\r\n    width: 75%;\r\n    height: 75%;\r\n    margin: 0 auto;\r\n}\r\n.vjs-big-play-button {\r\n    position: absolute;\r\n    \r\n    margin-left: 50%;\r\n    margin-top: 13.5vw;\r\n    transform: translateX(-63%);\r\n    \r\n}\r\n.vjs-poster {\r\n    background-image: url('poster.jpg') !important;\r\n}\r\n.vjs-styling .vjs-volume-bar {\r\n    background-color: red;\r\n}\r\n#changeButton {\r\n    height: 50px;\r\n    width: 75%;\r\n    margin-left: 12.5%;\r\n}\r\n#newFluxDiv {\r\n    padding: 2px 0;\r\n    width: 102%;\r\n    margin-top: -10px;\r\n    margin-bottom: 10px;\r\n    margin-left: -1%;\r\n    background-color: #439600;\r\n    color: white;\r\n    font-size: 1.1vw;\r\n    text-align: center;\r\n    display: none;\r\n}\r\n#buttonLive {\r\n    text-align: center;\r\n}\r\n#backToLive {\r\n    height: 7%;\r\n    width:75%;\r\n    margin-left: 12.5%;\r\n    font-size: 1em;\r\n    display: block;\r\n}\r\n@media only screen and (max-width: 550px) {\r\n    .vjs-big-play-button {\r\n        margin-top: 0;\r\n    }\r\n}\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpdmVzdHJlYW0uY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtJQUNJLGdEQUFnRDtJQUNoRCxzQkFBc0I7SUFDdEIsVUFBVTtJQUNWLGdCQUFnQjtBQUNwQjtBQUNBO0lBQ0ksVUFBVTtJQUNWLFdBQVc7SUFDWCxjQUFjO0FBQ2xCO0FBQ0E7SUFDSSxrQkFBa0I7SUFDbEIsbUJBQW1CO0lBQ25CLGdCQUFnQjtJQUNoQixrQkFBa0I7SUFDbEIsMkJBQTJCO0lBQzNCLDBCQUEwQjtBQUM5QjtBQUNBO0lBQ0ksOENBQTJEO0FBQy9EO0FBRUE7SUFDSSxxQkFBcUI7QUFDekI7QUFFQTtJQUNJLFlBQVk7SUFDWixVQUFVO0lBQ1Ysa0JBQWtCO0FBQ3RCO0FBRUE7SUFDSSxjQUFjO0lBQ2QsV0FBVztJQUNYLGlCQUFpQjtJQUNqQixtQkFBbUI7SUFDbkIsZ0JBQWdCO0lBQ2hCLHlCQUF5QjtJQUN6QixZQUFZO0lBQ1osZ0JBQWdCO0lBQ2hCLGtCQUFrQjtJQUNsQixhQUFhO0FBQ2pCO0FBQ0E7SUFDSSxrQkFBa0I7QUFDdEI7QUFDQTtJQUNJLFVBQVU7SUFDVixTQUFTO0lBQ1Qsa0JBQWtCO0lBQ2xCLGNBQWM7SUFDZCxjQUFjO0FBQ2xCO0FBRUE7SUFDSTtRQUNJLGFBQWE7SUFDakI7QUFDSiIsImZpbGUiOiJsaXZlc3RyZWFtLmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIjY29udGVudSB7XHJcbiAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCIvYWRtaW4vYXNzZXRzL2JnSW1nLmpwZ1wiKTtcclxuICAgIGJhY2tncm91bmQtc2l6ZTogY292ZXI7XHJcbiAgICB3aWR0aDogNjAlO1xyXG4gICAgbWFyZ2luLWxlZnQ6IDIwJTtcclxufVxyXG4udmlkZW8tanMge1xyXG4gICAgd2lkdGg6IDc1JTtcclxuICAgIGhlaWdodDogNzUlO1xyXG4gICAgbWFyZ2luOiAwIGF1dG87XHJcbn1cclxuLnZqcy1iaWctcGxheS1idXR0b24ge1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgLyogbWFyZ2luOiAwIDQ1JTsgKi9cclxuICAgIG1hcmdpbi1sZWZ0OiA1MCU7XHJcbiAgICBtYXJnaW4tdG9wOiAxMy41dnc7XHJcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTYzJSk7XHJcbiAgICAvKiB0b3A6IDE0dncgIWltcG9ydGFudDsgKi9cclxufVxyXG4udmpzLXBvc3RlciB7XHJcbiAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCIuLi8uLi9hc3NldHMvcG9zdGVyLmpwZ1wiKSAhaW1wb3J0YW50O1xyXG59XHJcblxyXG4udmpzLXN0eWxpbmcgLnZqcy12b2x1bWUtYmFyIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IHJlZDtcclxufVxyXG5cclxuI2NoYW5nZUJ1dHRvbiB7XHJcbiAgICBoZWlnaHQ6IDUwcHg7XHJcbiAgICB3aWR0aDogNzUlO1xyXG4gICAgbWFyZ2luLWxlZnQ6IDEyLjUlO1xyXG59XHJcblxyXG4jbmV3Rmx1eERpdiB7XHJcbiAgICBwYWRkaW5nOiAycHggMDtcclxuICAgIHdpZHRoOiAxMDIlO1xyXG4gICAgbWFyZ2luLXRvcDogLTEwcHg7XHJcbiAgICBtYXJnaW4tYm90dG9tOiAxMHB4O1xyXG4gICAgbWFyZ2luLWxlZnQ6IC0xJTtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICM0Mzk2MDA7XHJcbiAgICBjb2xvcjogd2hpdGU7XHJcbiAgICBmb250LXNpemU6IDEuMXZ3O1xyXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgZGlzcGxheTogbm9uZTtcclxufVxyXG4jYnV0dG9uTGl2ZSB7XHJcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbn1cclxuI2JhY2tUb0xpdmUge1xyXG4gICAgaGVpZ2h0OiA3JTtcclxuICAgIHdpZHRoOjc1JTtcclxuICAgIG1hcmdpbi1sZWZ0OiAxMi41JTtcclxuICAgIGZvbnQtc2l6ZTogMWVtO1xyXG4gICAgZGlzcGxheTogYmxvY2s7XHJcbn1cclxuXHJcbkBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogNTUwcHgpIHtcclxuICAgIC52anMtYmlnLXBsYXktYnV0dG9uIHtcclxuICAgICAgICBtYXJnaW4tdG9wOiAwO1xyXG4gICAgfVxyXG59Il19 */"];



/***/ }),

/***/ "UusY":
/*!****************************************************!*\
  !*** ./src/app/securelink/securelink.component.ts ***!
  \****************************************************/
/*! exports provided: SecurelinkComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SecurelinkComponent", function() { return SecurelinkComponent; });
/* harmony import */ var crypto_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! crypto-js */ "NFKh");
/* harmony import */ var crypto_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(crypto_js__WEBPACK_IMPORTED_MODULE_0__);

class SecurelinkComponent {
    constructor() {
        this.displayModal = "none";
        this.isModalOn = false;
        this.validite = "";
        this.options = [{ id: 0, label: 0, selected: false }];
        this.isShown = false;
        this.securedLink = "";
        this.securedUrl = "";
        this.selectedOption = "2";
    }
    onDocumentClick(event) {
        var isIncluded = false;
        var isButton = false;
        for (let i = 0; i < event["path"].length; i++) {
            if (event["path"][i].className == "modal-content") {
                isIncluded = true;
            }
            else if (event["path"][i].className == "linkButton") {
                isButton = true;
                break;
            }
        }
        if (!isIncluded && !isButton && this.isModalOn) {
            this.toggleModal();
        }
    }
    ngOnInit() {
        this.createOptions();
    }
    toggleModal() {
        if (!this.isModalOn) {
            this.displayModal = "block";
            this.isModalOn = true;
        }
        else {
            this.displayModal = "none";
            this.isModalOn = false;
            this.isShown = false;
        }
    }
    generateSecureLink() {
        var duree = parseInt(this.selectedOption);
        var d = new Date();
        d.setHours(d.getHours() + duree);
        var expiretime = Math.floor(d.valueOf() / 1000);
        var secret = "drone";
        var input = expiretime + "/limited " + secret;
        var hash = crypto_js__WEBPACK_IMPORTED_MODULE_0__["MD5"](input);
        var output = hash.toString(crypto_js__WEBPACK_IMPORTED_MODULE_0__["enc"].Base64);
        output = output.replace('=', '');
        output = output.replace('+', '-');
        output = output.replace('/', '_');
        var link = "http://192.168.13.110:8080/limited?md5=" + output + '&expires=' + expiretime;
        var url = '<a href=' + link + ' target="_blank" style="text-decoration:none, underline; color: white;">' + link + '</a>';
        this.validite = "Ce lien est valable jusqu'au " + d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear() + " à " + d.getHours() + ":" + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
        this.isShown = true;
        this.securedLink = link;
        this.securedUrl = url;
    }
    createOptions() {
        this.options = [];
        for (let i = 1; i <= 24; i++) {
            if (i == 2) {
                this.options.push({ id: i, label: i, selected: true });
            }
            else {
                this.options.push({ id: i, label: i, selected: false });
            }
        }
    }
    copyLink() {
        const selBox = document.createElement("input");
        selBox.value = this.securedLink;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
    }
}


/***/ }),

/***/ "WkRK":
/*!******************************************************!*\
  !*** ./src/app/replayinter/replayinter.component.ts ***!
  \******************************************************/
/*! exports provided: ReplayinterComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReplayinterComponent", function() { return ReplayinterComponent; });
/* harmony import */ var video_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! video.js */ "8OJ3");

class ReplayinterComponent {
    constructor(http, elementRef) {
        this.http = http;
        this.elementRef = elementRef;
        this.styleChoixInter = "block";
        this.interId = 0;
        this.sourceData = "https://multiplatform-f.akamaihd.net/i/multi/will/bunny/big_buck_bunny_,640x360_400,640x360_700,640x360_1000,950x540_1500,.f4v.csmil/master.m3u8";
        this.videoSource = { autoplay: true, controls: true, sources: [{ src: this.sourceData, type: 'application/x-mpegURL' }] };
        this.styleVideo = "width: 500px; height: 250px;";
    }
    checkIfNewVideos(dbData) {
        this.http.get("http://192.168.13.110:8080/replay")
            // this.http.get("http://localhost:8888/api/videoFileNameList")
            .subscribe(result => {
            var x = JSON.parse(JSON.stringify(result));
            var dataDb = [];
            var dataServer = [];
            for (var j = 0; j < dbData.length; j++) {
                dataDb.push(dbData[j]["fileName"]);
            }
            for (var k = 0; k < x.length; k++) {
                var datetime = this.toDatetimeFormat(x[k]["mtime"], true);
                if (x[k]["name"].includes("mp4")) {
                    dataServer.push([datetime, (x[k]["name"]).slice(0, -4)]);
                }
            }
            for (var i = 0; i < dataServer.length; i++) {
                if (!dataDb.includes(dataServer[i][1])) {
                    this.addVideoToDb(dataServer[i]);
                }
            }
        });
    }
    toDatetimeFormat(date, isDayOfWeek) {
        if (!isDayOfWeek) {
            date = "xxxxx" + date;
        }
        var monthString = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var month = date[8] + date[9] + date[10];
        var monthStr = "";
        if (monthString.indexOf(month) + 1 < 10) {
            monthStr = "0" + (monthString.indexOf(month) + 1);
        }
        else {
            monthStr = (monthString.indexOf(month) + 1).toString();
        }
        var res = date[12] + date[13] + date[14] + date[15] + "-" + monthStr + "-" + date[5] + date[6] + " " + date[17] + date[18] + ":" + date[20] + date[21] + ":" + date[23] + date[24];
        return res;
    }
    addVideoToDb(data) {
        this.http.post('http://localhost:8888/api/newvideo', { fileName: data[1], videoName: 'flag', recordTime: data[0] }).subscribe(data => {
            //  console.log(data);
        });
    }
    changeSrc(newSrc) {
        var source = "http://192.168.13.110:8080/replay/" + newSrc + ".mp4";
        // console.log(newSrc)
        // this.videoSource = { autoplay: true, controls: true, sources: [{ src: "", type: 'application/x-mpegURL' }]};
        if (this.target != undefined && this.player != undefined) {
            this.player.pause();
            // this.player.src("http://techslides.com/demos/sample-videos/small.mp4");
            this.player.src(source);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        // console.log('okok')
    }
    ngOnInit() {
        if (this.target != undefined) {
            this.player = Object(video_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this.target.nativeElement, this.videoSource, function onPlayerReady() { });
        }
        this.http.get("http://localhost:8888/api/videoFileNameList")
            .subscribe(result => {
            this.checkIfNewVideos(result);
        }, error => {
            //TODO
        });
        var location = window.location.href;
        var id = parseInt(location.split('?')[1].substring(3));
        this.interId = id;
        this.http.get("http://localhost:8888/api/videoByInter?id=" + id)
            .subscribe(result => {
            var videoResult = JSON.parse(JSON.stringify(result));
            for (let i = 0; i < videoResult.length; i++) {
                videoResult[i]["miniature"] = "http://192.168.13.110:8080/img/" + videoResult[i]["fileName"] + ".jpg";
            }
            this.interData = videoResult;
            console.log(this.interData);
        });
    }
    ngOnDestroy() {
        // destroy player
        if (this.player) {
            this.player.dispose();
        }
    }
}


/***/ }),

/***/ "ZAI4":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
class AppModule {
}


/***/ }),

/***/ "a/xx":
/*!****************************************************!*\
  !*** ./src/app/livestream/livestream.component.ts ***!
  \****************************************************/
/*! exports provided: LivestreamComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LivestreamComponent", function() { return LivestreamComponent; });
/* harmony import */ var video_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! video.js */ "8OJ3");

// var videoLink: string = "https://multiplatform-f.akamaihd.net/i/multi/will/bunny/big_buck_bunny_,640x360_400,640x360_700,640x360_1000,950x540_1500,.f4v.csmil/master.m3u8";
var videoLink = "http://192.168.13.110:8080/live/index.m3u8";
class LivestreamComponent {
    constructor(http) {
        this.http = http;
        this.videoJsConfigObj = {
            preload: "metadata",
            controls: true,
            autoplay: false,
            overrideNative: true,
            techOrder: ["html5", "flash"],
            html5: {
                nativeVideoTracks: true,
                nativeAudioTracks: false,
                nativeTextTracks: false,
                hls: {
                    withCredentials: false,
                    overrideNative: true,
                    debug: true
                }
            }
        };
    }
    changeSrc(src) {
        var source = "http://192.168.13.110:8080/replay/" + source;
        // window.player.updateSrc([
        //     { type: "video/mp4", src: source, label:'HD' }
        // ]);
        // document.getElementById("backToLive").style.display = "block";
    }
    ngOnInit() {
        var player = Object(video_js__WEBPACK_IMPORTED_MODULE_0__["default"])('my-video', this.videoJsConfigObj);
    }
}


/***/ }),

/***/ "a18t":
/*!******************************************************!*\
  !*** ./src/app/header/header.component.ngfactory.js ***!
  \******************************************************/
/*! exports provided: RenderType_HeaderComponent, View_HeaderComponent_0, View_HeaderComponent_Host_0, HeaderComponentNgFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RenderType_HeaderComponent", function() { return RenderType_HeaderComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_HeaderComponent_0", function() { return View_HeaderComponent_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_HeaderComponent_Host_0", function() { return View_HeaderComponent_Host_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HeaderComponentNgFactory", function() { return HeaderComponentNgFactory; });
/* harmony import */ var _header_component_css_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./header.component.css.shim.ngstyle */ "L/CK");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "8Y7J");
/* harmony import */ var _header_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./header.component */ "fECr");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes,extraRequire}
 * tslint:disable
 */



var styles_HeaderComponent = [_header_component_css_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__["styles"]];
var RenderType_HeaderComponent = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵcrt"]({ encapsulation: 0, styles: styles_HeaderComponent, data: {} });

function View_HeaderComponent_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 7, "div", [["id", "header"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 1, "a", [["href", "/"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](2, 0, null, null, 0, "img", [["id", "logoPompiersLeft"], ["src", "../../assets/stripes.svg"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](3, 0, null, null, 1, "a", [["href", "/"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](4, 0, null, null, 0, "img", [["id", "logoPompiersRight"], ["src", "../../assets/stripes.svg"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](5, 0, null, null, 2, "p", [["id", "title"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](6, 0, null, null, 1, "b", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["ZSBW - Drone"]))], null, null); }
function View_HeaderComponent_Host_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 1, "app-header", [], null, null, null, View_HeaderComponent_0, RenderType_HeaderComponent)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](1, 114688, null, 0, _header_component__WEBPACK_IMPORTED_MODULE_2__["HeaderComponent"], [], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
var HeaderComponentNgFactory = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵccf"]("app-header", _header_component__WEBPACK_IMPORTED_MODULE_2__["HeaderComponent"], View_HeaderComponent_Host_0, {}, {}, []);



/***/ }),

/***/ "fECr":
/*!********************************************!*\
  !*** ./src/app/header/header.component.ts ***!
  \********************************************/
/*! exports provided: HeaderComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HeaderComponent", function() { return HeaderComponent; });
class HeaderComponent {
    constructor() { }
    ngOnInit() {
    }
}


/***/ }),

/***/ "kIdT":
/*!****************************************************************!*\
  !*** ./src/app/cartography/cartography.component.ngfactory.js ***!
  \****************************************************************/
/*! exports provided: RenderType_CartographyComponent, View_CartographyComponent_0, View_CartographyComponent_Host_0, CartographyComponentNgFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RenderType_CartographyComponent", function() { return RenderType_CartographyComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_CartographyComponent_0", function() { return View_CartographyComponent_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_CartographyComponent_Host_0", function() { return View_CartographyComponent_Host_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CartographyComponentNgFactory", function() { return CartographyComponentNgFactory; });
/* harmony import */ var _cartography_component_css_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cartography.component.css.shim.ngstyle */ "L+R6");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "8Y7J");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "SVse");
/* harmony import */ var _cartography_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./cartography.component */ "24Si");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common/http */ "IheW");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes,extraRequire}
 * tslint:disable
 */





var styles_CartographyComponent = [_cartography_component_css_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__["styles"]];
var RenderType_CartographyComponent = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵcrt"]({ encapsulation: 0, styles: styles_CartographyComponent, data: {} });

function View_CartographyComponent_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 29, "main", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 0, "div", [["class", "map-container"], ["id", "ol-map"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](2, 0, null, null, 27, "div", [["class", "airData"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](3, 0, null, null, 4, "div", [["class", "airDataItem"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](4, 0, null, null, 2, "p", [["class", "chrono"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](5, 0, null, null, 1, "b", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](6, null, ["", ""])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](7, 0, null, null, 0, "img", [["class", "logo"], ["src", "../../assets/chrono.png"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](8, 0, null, null, 4, "div", [["class", "airDataItem"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](9, 0, null, null, 2, "p", [["class", "battery"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](10, 0, null, null, 1, "b", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](11, null, ["", "%"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](12, 0, null, null, 0, "img", [["class", "logo"], ["src", "../../assets/battery.png"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](13, 0, null, null, 4, "div", [["class", "airDataItem"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](14, 0, null, null, 2, "p", [["class", "height"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](15, 0, null, null, 1, "b", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](16, null, ["", "m"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](17, 0, null, null, 0, "img", [["class", "logoHeight"], ["src", "../../assets/height.png"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](18, 0, null, null, 3, "div", [["class", "airDataItem"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](19, 0, null, null, 0, "img", [["class", "logo"], ["src", "../../assets/drone.png"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](20, 0, [["arrowAircraft", 1]], null, 1, "img", [["class", "arrow"], ["src", "../../assets/arrow.png"]], null, null, null, null, null)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](21, 278528, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_2__["NgStyle"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["KeyValueDiffers"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["Renderer2"]], { ngStyle: [0, "ngStyle"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](22, 0, null, null, 3, "div", [["class", "airDataItem"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](23, 0, null, null, 0, "img", [["class", "logo"], ["src", "../../assets/camera.png"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](24, 0, [["arrowGimbal", 1]], null, 1, "img", [["class", "arrow"], ["src", "../../assets/arrow.png"]], null, null, null, null, null)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](25, 278528, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_2__["NgStyle"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["KeyValueDiffers"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["Renderer2"]], { ngStyle: [0, "ngStyle"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](26, 0, null, null, 3, "div", [["class", "airDataItem"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](27, 0, null, null, 2, "p", [["class", "currentHour"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](28, 0, null, null, 1, "b", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](29, null, ["", ""]))], function (_ck, _v) { var _co = _v.component; var currVal_3 = _co.styleArrowAircraft; _ck(_v, 21, 0, currVal_3); var currVal_4 = _co.styleArrowGimbal; _ck(_v, 25, 0, currVal_4); }, function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.currentFlightTime; _ck(_v, 6, 0, currVal_0); var currVal_1 = _co.currentBatteryLevel; _ck(_v, 11, 0, currVal_1); var currVal_2 = _co.currentHeight; _ck(_v, 16, 0, currVal_2); var currVal_5 = _co.currentHour; _ck(_v, 29, 0, currVal_5); }); }
function View_CartographyComponent_Host_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 1, "app-cartography", [], null, null, null, View_CartographyComponent_0, RenderType_CartographyComponent)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](1, 114688, null, 0, _cartography_component__WEBPACK_IMPORTED_MODULE_3__["CartographyComponent"], [_angular_common_http__WEBPACK_IMPORTED_MODULE_4__["HttpClient"]], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
var CartographyComponentNgFactory = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵccf"]("app-cartography", _cartography_component__WEBPACK_IMPORTED_MODULE_3__["CartographyComponent"], View_CartographyComponent_Host_0, { idVol: "idVol" }, {}, []);



/***/ }),

/***/ "lwNt":
/*!***************************************************!*\
  !*** ./src/app/app.component.css.shim.ngstyle.js ***!
  \***************************************************/
/*! exports provided: styles */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "styles", function() { return styles; });
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes,extraRequire}
 * tslint:disable
 */
var styles = ["@charset \"UTF-8\";\n.vjs-modal-dialog[_ngcontent-%COMP%]   .vjs-modal-dialog-content[_ngcontent-%COMP%], .video-js[_ngcontent-%COMP%]   .vjs-modal-dialog[_ngcontent-%COMP%], .vjs-button[_ngcontent-%COMP%]    > .vjs-icon-placeholder[_ngcontent-%COMP%]:before, .video-js[_ngcontent-%COMP%]   .vjs-big-play-button[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%]:before {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n}\n.vjs-button[_ngcontent-%COMP%]    > .vjs-icon-placeholder[_ngcontent-%COMP%]:before, .video-js[_ngcontent-%COMP%]   .vjs-big-play-button[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%]:before {\n  text-align: center;\n}\n@font-face {\n  font-family: VideoJS;\n  src: url(data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAABDkAAsAAAAAG6gAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABHU1VCAAABCAAAADsAAABUIIslek9TLzIAAAFEAAAAPgAAAFZRiV3hY21hcAAAAYQAAADaAAADPv749/pnbHlmAAACYAAAC3AAABHQZg6OcWhlYWQAAA3QAAAAKwAAADYZw251aGhlYQAADfwAAAAdAAAAJA+RCLFobXR4AAAOHAAAABMAAACM744AAGxvY2EAAA4wAAAASAAAAEhF6kqubWF4cAAADngAAAAfAAAAIAE0AIFuYW1lAAAOmAAAASUAAAIK1cf1oHBvc3QAAA/AAAABJAAAAdPExYuNeJxjYGRgYOBiMGCwY2BycfMJYeDLSSzJY5BiYGGAAJA8MpsxJzM9kYEDxgPKsYBpDiBmg4gCACY7BUgAeJxjYGS7wTiBgZWBgaWQ5RkDA8MvCM0cwxDOeI6BgYmBlZkBKwhIc01hcPjI+FGJHcRdyA4RZgQRADK3CxEAAHic7dFZbsMgAEXRS0ycyZnnOeG7y+qC8pU1dHusIOXxuoxaOlwZYWQB0Aea4quIEN4E9LzKbKjzDeM6H/mua6Lmc/p8yhg0lvdYx15ZG8uOLQOGjMp3EzqmzJizYMmKNRu27Nhz4MiJMxeu3Ljz4Ekqm7T8P52G8PP3lnTOVk++Z6iN6QZzNN1F7ptuN7eGOjDUoaGODHVsuvU8MdTO9Hd5aqgzQ50b6sJQl4a6MtS1oW4MdWuoO0PdG+rBUI+GejLUs6FeDPVqqDdDvRvqw1CfhpqM9At0iFLaAAB4nJ1YDXBTVRZ+5/22TUlJ8we0pHlJm7RJf5O8F2j6EymlSPkpxaL8U2xpa3DKj0CBhc2IW4eWKSokIoLsuMqssM64f+jA4HSdWXXXscBq67IOs3FXZ1ZYWVyRFdo899yXtIBQZ90k7717zz3v3HPPOfd854YCCj9cL9dL0RQFOqCbGJnrHb5EayiKIWN8iA/hWBblo6hUWm8TtCDwE80WMJus/irwyxOdxeB0MDb14VNJHnXYoLLSl6FfCUYO9nYPTA8Epg9090LprfbBbZ2hY0UlJUXHQp3/vtWkS6EBv8+rPMq5u9692f/dNxJNiqwC1xPE9TCUgCsSdQWgE3XQD25lkG4CN2xmTcOXWBOyser6RN6KnGbKSbmQ3+d0OI1m2W8QzLLkI2sykrWAgJJEtA8vGGW/2Q+CmT3n8zS9wZwu2DCvtuZKZN3xkrLh36yCZuUomQSqGpY8t/25VfHVhw8z4ebGBtfLb0ya9PCaDc+8dGTvk2dsh6z7WzvowlXKUSWo9MJ15a3KrEP2loOr2Ojhw6iW6hf2BDdEccQvZGpaAy7YovSwq8kr7HGllxpd71rkS6G0Sf11sl9OvMK1+jwPPODxjUwkOim9CU3ix1wNjXDfmJSEn618Bs6lpWwUpU+8PCqLMY650zjq8VhCIP17NEKTx3eaLL+s5Pi6yJWaWjTHLR1jYzPSV9VF/6Ojdb/1kO3Mk3uhHC0x6gc1BjlKQ+nQFxTYdaJkZ7ySVxLBbhR1dsboNXp1tCYKW2LRaEzpYcIx2BKNxaL0ZaUnSqfFoiNhHKR/GkX6PWUSAaJelQaqZL1EpoHNsajSEyPSoJ9IjhIxTdjHLmwZvhRDOiFTY/YeQnvrVZmiTQtGncECXtFTBZLOVwwMRgoXHAkXzMzPn1nAJJ8jYSbMDaqN2waGLzNhih/bZynUBMpIWSg7VYi7DRx2m8ALkIdRCJwI6ArJx2EI8kaDWeTQKeAFk9fjl/1AvwktjQ1P7NjyMGQyfd4vjipX6M/i52D7Cq80kqlcxEcGXRr/FEcgs0u5uGgB4VWuMFfpdn2Re6Hi3PqzmxWKsz6+ae2Pn9hXXw/fqM859UiGC0oKYYILJBqJrsn1Z1E5qOs9rQCiUQRREjm8yJcbHF5cUJufX1vAHlefw0XgUoboS3ETfQlTxBC4SOtuE8VPRJTBSCQSjZCpk7Gqzu+masaZ2y7Zjehho4F3g82BNDkAHpORG4+OCS+f6JTPmtRn/PH1kch6d04sp7AQb25aQ/pqUyXeQ8vrebG8OYQdXOQ+585u0sdW9rqalzRURiJ+9F4MweRFrKUjl1GUYhH1A27WOHw5cTFSFPMo9EeUIGnQTZHIaJ7AHLaOKsOODaNF9jkBjYG2QEsQ2xjMUAx2bBEbeTBWMHwskBjngq56S/yfgkBnWBa4K9sqKtq2t1UI8S9He5XuBRbawAdatrQEAi30Aks2+LM8WeCbalVZkWNylvJ+dqJnzVb+OHlSoKW8nPCP7Rd+CcZ2DdWAGqJ2CBFOphgywFFCFBNtfAbGtNPBCwxvygHeYMZMY9ZboBqwq/pVrsbgN5tkv152ODlbMfiqwGMBgxa4Exz3QhovRIUp6acqZmQzRq0ypDXS2TPLT02YIkQETnOE445oOGxOmXAqUJNNG7XgupMjPq2ua9asrj5yY/yuKteO1Kx0YNJTufrirLe1mZnat7OL6rnUdCWenpW6I8mAnbsY8KWs1PuSovCW9A/Z25PQ24a7cNOqgmTkLmBMgh4THgc4b9k2IVv1/g/F5nGljwPLfOgHAzJzh45V/4+WenTzmMtR5Z7us2Tys909UHqrPY7KbckoxRvRHhmVc3cJGE97uml0R1S0jdULVl7EvZtDFVBF35N9cEdjpgmAiOlFZ+Dtoh93+D3zzHr8RRNZQhnCNMNbcegOvpEwZoL+06cJQ07h+th3fZ/7PVbVC6ngTAV/KoLFuO6+2KFcU651gEb5ugPSIb1D+Xp8V4+k3sEIGnw5mYe4If4k1lFYr6SCzmM2EQ8iWtmwjnBI9kTwe1TlfAmXh7H02by9fW2gsjKwtv0aaURKil4OdV7rDL1MXIFNrhdxohcZXYTnq47WisrKitaObbf5+yvkLi5J6lCNZZ+B6GC38VNBZBDidSS/+mSvh6s+srgC8pyKMvDtt+de3c9fU76ZPfuM8ud4Kv0fyP/LqfepMT/3oZxSqpZaTa1DaQYLY8TFsHYbWYsPoRhRWfL5eSSQbhUGgGC3YLbVMk6PitTFNGpAsNrC6D1VNBKgBHMejaiuRWEWGgsSDBTJjqWIl8kJLlsaLJ2tXDr6xGfT85bM2Q06a46x2HTgvdnV8z5YDy/27J4zt6x2VtkzjoYpkq36kaBr4eQSg7tyiVweWubXZugtadl58ydapfbORfKsDTuZ0OBgx4cfdjCf5tbWNITnL120fdOi1RV1C3uKGzNdwYLcMvZ3BxoPyTOCD1XvXTp7U10gWCVmTV9b3r2z0SkGWovb2hp9I89O8a2smlyaO8muMU+dRmtzp60IzAoFpjLr1n388boLyf0dRvxhsHZ0qbWqDkwqvvpkj4l0fY6EIXRi5sQSrAvsVYwXRy4qJ2EVtD1AN7a0HWth9ymvL1xc3WTUKK/TAHA/bXDVtVWfOMfuGxGZv4Ln/jVr9jc3j1yMv0tndmyt9Vq88Y9gH1wtLX3KWjot5++jWHgAoZZkQ14wGQ20Fli71UmKJAy4xKMSTGbVdybW7FDDAut9XpD5AzWrYO7zQ8qffqF8+Ynd/clrHcdyxGy3a/3+mfNnzC/cBsveTjnTvXf1o6vzOlZw7WtqtdmPK/Errz/6NNtD72zmNOZfbmYdTGHfoofqI79Oc+R2n1lrnL6pOm0Up7kwxhTW12Amm7WYkXR2qYrF2AmgmbAsxZjwy1xpg/m1Je2vrp8v/nz2xpmlBg4E9hrMU341wVpTOh/OfmGvAnra8q6uctr60ZQHV3Q+WMQJykMj8ZsWn2QBOmmHMB+m5pDIpTFonYigiaKAhGEiAHF7EliVnQkjoLVIMPtJpBKHYd3A8GYH9jJzrWwmHx5Qjp7vDAX0suGRym1vtm/9W1/HyR8vczfMs6Sk8DSv855/5dlX9oQq52hT8syyp2rx5Id17IAyAM3wIjQPMOHzytEB64q6D5zT91yNbnx3V/nqnd017S9Y0605k3izoXLpsxde2n38yoOV9s1LcjwzNjbdX6asnBVaBj/6/DwKwPkpcqbDG7BnsXoSqWnUAmottYF6jMSdVyYZh3zVXCjwTiwwHH6sGuRiEHQGzuRX6whZkp123oy1BWE2mEfJ/tvIRtM4ZM5bDXiMsPMaAKOTyc5uL57rqyyc5y5JE5pm1i2S2iUX0CcaQ6lC6Zog7JqSqZmYlosl2K6pwNA84zRnQW6SaALYZQGW5lhCtU/W34N6o+bKfZ8cf3/Cl/+iTX3wBzpOY4mRkeNf3rptycGSshQWgGbYt5jFc2e0+DglIrwl6DVWQ7BuwaJ3Xk1J4VL5urnLl/Wf+gHU/hZoZdKNym6lG+I34FaNeZKcSpJIo2IeCVvpdsDGfKvzJnAwmeD37Ow65ZWwSowpgwX5T69s/rB55dP5BcpgDKFV8p7q2sn/1uc93bVzT/w6UrCqDTWvfCq/oCD/qZXNoUj8BL5Kp6GU017frfNXkAtiiyf/SOCEeLqnd8R/Ql9GlCRfctS6k5chvIBuQ1zCCjoCHL2DHNHIXxMJ3kQeO8lbsUXONeSfA5EjcG6/E+KdhN4bP04vBhdi883+BFBzQbxFbvZzQeY9LNBZc0FNfn5NwfDn6rCTnTw6R8o+gfpf5hCom33cRuiTlss3KHmZjD+BPN+5gXuA2ziS/Q73mLxUkpbKN/eqwz5uK0X9F3h2d1V4nGNgZGBgAOJd776+iue3+crAzc4AAje5Bfcg0xz9YHEOBiYQBQA8FQlFAHicY2BkYGBnAAGOPgaG//85+hkYGVCBMgBGGwNYAAAAeJxjYGBgYB8EmKOPgQEAQ04BfgAAAAAAAA4AaAB+AMwA4AECAUIBbAGYAcICGAJYArQC4AMwA7AD3gQwBJYE3AUkBWYFigYgBmYGtAbqB1gIEghYCG4IhAi2COh4nGNgZGBgUGYoZWBnAAEmIOYCQgaG/2A+AwAYCQG2AHicXZBNaoNAGIZfE5PQCKFQ2lUps2oXBfOzzAESyDKBQJdGR2NQR3QSSE/QE/QEPUUPUHqsvsrXjTMw83zPvPMNCuAWP3DQDAejdm1GjzwS7pMmwi75XngAD4/CQ/oX4TFe4Qt7uMMbOzjuDc0EmXCP/C7cJ38Iu+RP4QEe8CU8pP8WHmOPX2EPz87TPo202ey2OjlnQSXV/6arOjWFmvszMWtd6CqwOlKHq6ovycLaWMWVydXKFFZnmVFlZU46tP7R2nI5ncbi/dDkfDtFBA2DDXbYkhKc+V0Bqs5Zt9JM1HQGBRTm/EezTmZNKtpcAMs9Yu6AK9caF76zoLWIWcfMGOSkVduvSWechqZsz040Ib2PY3urxBJTzriT95lipz+TN1fmAAAAeJxtkMl2wjAMRfOAhABlKm2h80C3+ajgCKKDY6cegP59TYBzukAL+z1Zsq8ctaJTTKPrsUQLbXQQI0EXKXroY4AbDDHCGBNMcYsZ7nCPB8yxwCOe8IwXvOIN7/jAJ76wxHfUqWX+OzgumWAjJMV17i0Ndlr6irLKO+qftdT7i6y4uFSUvCknay+lFYZIZaQcmfH/xIFdYn98bqhra1aKTM/6lWMnyaYirx1rFUQZFBkb2zJUtoXeJCeg0WnLtHeSFc3OtrnozNwqi0TkSpBMDB1nSde5oJXW23hTS2/T0LilglXX7dmFVxLnq5U0vYATHFk3zX3BOisoQHNDFDeZnqKDy9hRNawN7Vh727hFzcJ5c8TILrKZfH7tIPxAFP0BpLeJPA==) format(\"woff\");\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-play[_ngcontent-%COMP%], .video-js[_ngcontent-%COMP%]   .vjs-play-control[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%], .video-js[_ngcontent-%COMP%]   .vjs-big-play-button[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%]:before {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-play[_ngcontent-%COMP%]:before, .video-js[_ngcontent-%COMP%]   .vjs-play-control[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%]:before, .video-js[_ngcontent-%COMP%]   .vjs-big-play-button[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%]:before {\n  content: \"\\f101\";\n}\n.vjs-icon-play-circle[_ngcontent-%COMP%] {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-play-circle[_ngcontent-%COMP%]:before {\n  content: \"\\f102\";\n}\n.vjs-icon-pause[_ngcontent-%COMP%], .video-js[_ngcontent-%COMP%]   .vjs-play-control.vjs-playing[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%] {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-pause[_ngcontent-%COMP%]:before, .video-js[_ngcontent-%COMP%]   .vjs-play-control.vjs-playing[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%]:before {\n  content: \"\\f103\";\n}\n.vjs-icon-volume-mute[_ngcontent-%COMP%], .video-js[_ngcontent-%COMP%]   .vjs-mute-control.vjs-vol-0[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%] {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-volume-mute[_ngcontent-%COMP%]:before, .video-js[_ngcontent-%COMP%]   .vjs-mute-control.vjs-vol-0[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%]:before {\n  content: \"\\f104\";\n}\n.vjs-icon-volume-low[_ngcontent-%COMP%], .video-js[_ngcontent-%COMP%]   .vjs-mute-control.vjs-vol-1[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%] {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-volume-low[_ngcontent-%COMP%]:before, .video-js[_ngcontent-%COMP%]   .vjs-mute-control.vjs-vol-1[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%]:before {\n  content: \"\\f105\";\n}\n.vjs-icon-volume-mid[_ngcontent-%COMP%], .video-js[_ngcontent-%COMP%]   .vjs-mute-control.vjs-vol-2[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%] {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-volume-mid[_ngcontent-%COMP%]:before, .video-js[_ngcontent-%COMP%]   .vjs-mute-control.vjs-vol-2[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%]:before {\n  content: \"\\f106\";\n}\n.vjs-icon-volume-high[_ngcontent-%COMP%], .video-js[_ngcontent-%COMP%]   .vjs-mute-control[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%] {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-volume-high[_ngcontent-%COMP%]:before, .video-js[_ngcontent-%COMP%]   .vjs-mute-control[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%]:before {\n  content: \"\\f107\";\n}\n.vjs-icon-fullscreen-enter[_ngcontent-%COMP%], .video-js[_ngcontent-%COMP%]   .vjs-fullscreen-control[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%] {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-fullscreen-enter[_ngcontent-%COMP%]:before, .video-js[_ngcontent-%COMP%]   .vjs-fullscreen-control[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%]:before {\n  content: \"\\f108\";\n}\n.vjs-icon-fullscreen-exit[_ngcontent-%COMP%], .video-js.vjs-fullscreen[_ngcontent-%COMP%]   .vjs-fullscreen-control[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%] {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-fullscreen-exit[_ngcontent-%COMP%]:before, .video-js.vjs-fullscreen[_ngcontent-%COMP%]   .vjs-fullscreen-control[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%]:before {\n  content: \"\\f109\";\n}\n.vjs-icon-square[_ngcontent-%COMP%] {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-square[_ngcontent-%COMP%]:before {\n  content: \"\\f10a\";\n}\n.vjs-icon-spinner[_ngcontent-%COMP%] {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-spinner[_ngcontent-%COMP%]:before {\n  content: \"\\f10b\";\n}\n.vjs-icon-subtitles[_ngcontent-%COMP%], .video-js[_ngcontent-%COMP%]   .vjs-subs-caps-button[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%], .video-js.video-js[_ngcontent-%COMP%]:lang(en-GB)   .vjs-subs-caps-button[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%], .video-js.video-js[_ngcontent-%COMP%]:lang(en-IE)   .vjs-subs-caps-button[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%], .video-js.video-js[_ngcontent-%COMP%]:lang(en-AU)   .vjs-subs-caps-button[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%], .video-js.video-js[_ngcontent-%COMP%]:lang(en-NZ)   .vjs-subs-caps-button[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%], .video-js[_ngcontent-%COMP%]   .vjs-subtitles-button[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%] {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-subtitles[_ngcontent-%COMP%]:before, .video-js[_ngcontent-%COMP%]   .vjs-subs-caps-button[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%]:before, .video-js.video-js[_ngcontent-%COMP%]:lang(en-GB)   .vjs-subs-caps-button[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%]:before, .video-js.video-js[_ngcontent-%COMP%]:lang(en-IE)   .vjs-subs-caps-button[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%]:before, .video-js.video-js[_ngcontent-%COMP%]:lang(en-AU)   .vjs-subs-caps-button[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%]:before, .video-js.video-js[_ngcontent-%COMP%]:lang(en-NZ)   .vjs-subs-caps-button[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%]:before, .video-js[_ngcontent-%COMP%]   .vjs-subtitles-button[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%]:before {\n  content: \"\\f10c\";\n}\n.vjs-icon-captions[_ngcontent-%COMP%], .video-js[_ngcontent-%COMP%]:lang(en)   .vjs-subs-caps-button[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%], .video-js[_ngcontent-%COMP%]:lang(fr-CA)   .vjs-subs-caps-button[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%], .video-js[_ngcontent-%COMP%]   .vjs-captions-button[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%] {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-captions[_ngcontent-%COMP%]:before, .video-js[_ngcontent-%COMP%]:lang(en)   .vjs-subs-caps-button[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%]:before, .video-js[_ngcontent-%COMP%]:lang(fr-CA)   .vjs-subs-caps-button[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%]:before, .video-js[_ngcontent-%COMP%]   .vjs-captions-button[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%]:before {\n  content: \"\\f10d\";\n}\n.vjs-icon-chapters[_ngcontent-%COMP%], .video-js[_ngcontent-%COMP%]   .vjs-chapters-button[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%] {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-chapters[_ngcontent-%COMP%]:before, .video-js[_ngcontent-%COMP%]   .vjs-chapters-button[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%]:before {\n  content: \"\\f10e\";\n}\n.vjs-icon-share[_ngcontent-%COMP%] {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-share[_ngcontent-%COMP%]:before {\n  content: \"\\f10f\";\n}\n.vjs-icon-cog[_ngcontent-%COMP%] {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-cog[_ngcontent-%COMP%]:before {\n  content: \"\\f110\";\n}\n.vjs-icon-circle[_ngcontent-%COMP%], .vjs-seek-to-live-control[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%], .video-js[_ngcontent-%COMP%]   .vjs-volume-level[_ngcontent-%COMP%], .video-js[_ngcontent-%COMP%]   .vjs-play-progress[_ngcontent-%COMP%] {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-circle[_ngcontent-%COMP%]:before, .vjs-seek-to-live-control[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%]:before, .video-js[_ngcontent-%COMP%]   .vjs-volume-level[_ngcontent-%COMP%]:before, .video-js[_ngcontent-%COMP%]   .vjs-play-progress[_ngcontent-%COMP%]:before {\n  content: \"\\f111\";\n}\n.vjs-icon-circle-outline[_ngcontent-%COMP%] {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-circle-outline[_ngcontent-%COMP%]:before {\n  content: \"\\f112\";\n}\n.vjs-icon-circle-inner-circle[_ngcontent-%COMP%] {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-circle-inner-circle[_ngcontent-%COMP%]:before {\n  content: \"\\f113\";\n}\n.vjs-icon-hd[_ngcontent-%COMP%] {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-hd[_ngcontent-%COMP%]:before {\n  content: \"\\f114\";\n}\n.vjs-icon-cancel[_ngcontent-%COMP%], .video-js[_ngcontent-%COMP%]   .vjs-control.vjs-close-button[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%] {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-cancel[_ngcontent-%COMP%]:before, .video-js[_ngcontent-%COMP%]   .vjs-control.vjs-close-button[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%]:before {\n  content: \"\\f115\";\n}\n.vjs-icon-replay[_ngcontent-%COMP%], .video-js[_ngcontent-%COMP%]   .vjs-play-control.vjs-ended[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%] {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-replay[_ngcontent-%COMP%]:before, .video-js[_ngcontent-%COMP%]   .vjs-play-control.vjs-ended[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%]:before {\n  content: \"\\f116\";\n}\n.vjs-icon-facebook[_ngcontent-%COMP%] {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-facebook[_ngcontent-%COMP%]:before {\n  content: \"\\f117\";\n}\n.vjs-icon-gplus[_ngcontent-%COMP%] {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-gplus[_ngcontent-%COMP%]:before {\n  content: \"\\f118\";\n}\n.vjs-icon-linkedin[_ngcontent-%COMP%] {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-linkedin[_ngcontent-%COMP%]:before {\n  content: \"\\f119\";\n}\n.vjs-icon-twitter[_ngcontent-%COMP%] {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-twitter[_ngcontent-%COMP%]:before {\n  content: \"\\f11a\";\n}\n.vjs-icon-tumblr[_ngcontent-%COMP%] {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-tumblr[_ngcontent-%COMP%]:before {\n  content: \"\\f11b\";\n}\n.vjs-icon-pinterest[_ngcontent-%COMP%] {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-pinterest[_ngcontent-%COMP%]:before {\n  content: \"\\f11c\";\n}\n.vjs-icon-audio-description[_ngcontent-%COMP%], .video-js[_ngcontent-%COMP%]   .vjs-descriptions-button[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%] {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-audio-description[_ngcontent-%COMP%]:before, .video-js[_ngcontent-%COMP%]   .vjs-descriptions-button[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%]:before {\n  content: \"\\f11d\";\n}\n.vjs-icon-audio[_ngcontent-%COMP%], .video-js[_ngcontent-%COMP%]   .vjs-audio-button[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%] {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-audio[_ngcontent-%COMP%]:before, .video-js[_ngcontent-%COMP%]   .vjs-audio-button[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%]:before {\n  content: \"\\f11e\";\n}\n.vjs-icon-next-item[_ngcontent-%COMP%] {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-next-item[_ngcontent-%COMP%]:before {\n  content: \"\\f11f\";\n}\n.vjs-icon-previous-item[_ngcontent-%COMP%] {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-previous-item[_ngcontent-%COMP%]:before {\n  content: \"\\f120\";\n}\n.vjs-icon-picture-in-picture-enter[_ngcontent-%COMP%], .video-js[_ngcontent-%COMP%]   .vjs-picture-in-picture-control[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%] {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-picture-in-picture-enter[_ngcontent-%COMP%]:before, .video-js[_ngcontent-%COMP%]   .vjs-picture-in-picture-control[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%]:before {\n  content: \"\\f121\";\n}\n.vjs-icon-picture-in-picture-exit[_ngcontent-%COMP%], .video-js.vjs-picture-in-picture[_ngcontent-%COMP%]   .vjs-picture-in-picture-control[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%] {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-picture-in-picture-exit[_ngcontent-%COMP%]:before, .video-js.vjs-picture-in-picture[_ngcontent-%COMP%]   .vjs-picture-in-picture-control[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%]:before {\n  content: \"\\f122\";\n}\n.video-js[_ngcontent-%COMP%] {\n  display: block;\n  vertical-align: top;\n  box-sizing: border-box;\n  color: #fff;\n  background-color: #000;\n  position: relative;\n  padding: 0;\n  font-size: 10px;\n  line-height: 1;\n  font-weight: normal;\n  font-style: normal;\n  font-family: Arial, Helvetica, sans-serif;\n  word-break: initial;\n}\n.video-js[_ngcontent-%COMP%]:-moz-full-screen {\n  position: absolute;\n}\n.video-js[_ngcontent-%COMP%]:-webkit-full-screen {\n  width: 100% !important;\n  height: 100% !important;\n}\n.video-js[tabindex=\"-1\"][_ngcontent-%COMP%] {\n  outline: none;\n}\n.video-js[_ngcontent-%COMP%]   *[_ngcontent-%COMP%], .video-js[_ngcontent-%COMP%]   *[_ngcontent-%COMP%]:before, .video-js[_ngcontent-%COMP%]   *[_ngcontent-%COMP%]:after {\n  box-sizing: inherit;\n}\n.video-js[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%] {\n  font-family: inherit;\n  font-size: inherit;\n  line-height: inherit;\n  list-style-position: outside;\n  margin-left: 0;\n  margin-right: 0;\n  margin-top: 0;\n  margin-bottom: 0;\n}\n.video-js.vjs-fluid[_ngcontent-%COMP%], .video-js.vjs-16-9[_ngcontent-%COMP%], .video-js.vjs-4-3[_ngcontent-%COMP%], .video-js.vjs-9-16[_ngcontent-%COMP%], .video-js.vjs-1-1[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 100%;\n  height: 0;\n}\n.video-js.vjs-16-9[_ngcontent-%COMP%] {\n  padding-top: 56.25%;\n}\n.video-js.vjs-4-3[_ngcontent-%COMP%] {\n  padding-top: 75%;\n}\n.video-js.vjs-9-16[_ngcontent-%COMP%] {\n  padding-top: 177.7777777778%;\n}\n.video-js.vjs-1-1[_ngcontent-%COMP%] {\n  padding-top: 100%;\n}\n.video-js.vjs-fill[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-tech[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n}\nbody.vjs-full-window[_ngcontent-%COMP%] {\n  padding: 0;\n  margin: 0;\n  height: 100%;\n}\n.vjs-full-window[_ngcontent-%COMP%]   .video-js.vjs-fullscreen[_ngcontent-%COMP%] {\n  position: fixed;\n  overflow: hidden;\n  z-index: 1000;\n  left: 0;\n  top: 0;\n  bottom: 0;\n  right: 0;\n}\n.video-js.vjs-fullscreen[_ngcontent-%COMP%]:not(.vjs-ios-native-fs) {\n  width: 100% !important;\n  height: 100% !important;\n  padding-top: 0 !important;\n}\n.video-js.vjs-fullscreen.vjs-user-inactive[_ngcontent-%COMP%] {\n  cursor: none;\n}\n.vjs-hidden[_ngcontent-%COMP%] {\n  display: none !important;\n}\n.vjs-disabled[_ngcontent-%COMP%] {\n  opacity: 0.5;\n  cursor: default;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-offscreen[_ngcontent-%COMP%] {\n  height: 1px;\n  left: -9999px;\n  position: absolute;\n  top: 0;\n  width: 1px;\n}\n.vjs-lock-showing[_ngcontent-%COMP%] {\n  display: block !important;\n  opacity: 1;\n  visibility: visible;\n}\n.vjs-no-js[_ngcontent-%COMP%] {\n  padding: 20px;\n  color: #fff;\n  background-color: #000;\n  font-size: 18px;\n  font-family: Arial, Helvetica, sans-serif;\n  text-align: center;\n  width: 300px;\n  height: 150px;\n  margin: 0px auto;\n}\n.vjs-no-js[_ngcontent-%COMP%]   a[_ngcontent-%COMP%], .vjs-no-js[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:visited {\n  color: #66A8CC;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-big-play-button[_ngcontent-%COMP%] {\n  font-size: 3em;\n  line-height: 1.5em;\n  height: 1.63332em;\n  width: 3em;\n  display: block;\n  position: absolute;\n  top: 10px;\n  left: 10px;\n  padding: 0;\n  cursor: pointer;\n  opacity: 1;\n  border: 0.06666em solid #fff;\n  background-color: #2B333F;\n  background-color: rgba(43, 51, 63, 0.7);\n  border-radius: 0.3em;\n  transition: all 0.4s;\n}\n.vjs-big-play-centered[_ngcontent-%COMP%]   .vjs-big-play-button[_ngcontent-%COMP%] {\n  top: 50%;\n  left: 50%;\n  margin-top: -0.81666em;\n  margin-left: -1.5em;\n}\n.video-js[_ngcontent-%COMP%]:hover   .vjs-big-play-button[_ngcontent-%COMP%], .video-js[_ngcontent-%COMP%]   .vjs-big-play-button[_ngcontent-%COMP%]:focus {\n  border-color: #fff;\n  background-color: #73859f;\n  background-color: rgba(115, 133, 159, 0.5);\n  transition: all 0s;\n}\n.vjs-controls-disabled[_ngcontent-%COMP%]   .vjs-big-play-button[_ngcontent-%COMP%], .vjs-has-started[_ngcontent-%COMP%]   .vjs-big-play-button[_ngcontent-%COMP%], .vjs-using-native-controls[_ngcontent-%COMP%]   .vjs-big-play-button[_ngcontent-%COMP%], .vjs-error[_ngcontent-%COMP%]   .vjs-big-play-button[_ngcontent-%COMP%] {\n  display: none;\n}\n.vjs-has-started.vjs-paused.vjs-show-big-play-button-on-pause[_ngcontent-%COMP%]   .vjs-big-play-button[_ngcontent-%COMP%] {\n  display: block;\n}\n.video-js[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  background: none;\n  border: none;\n  color: inherit;\n  display: inline-block;\n  font-size: inherit;\n  line-height: inherit;\n  text-transform: none;\n  text-decoration: none;\n  transition: none;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n}\n.vjs-control[_ngcontent-%COMP%]   .vjs-button[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-control.vjs-close-button[_ngcontent-%COMP%] {\n  cursor: pointer;\n  height: 3em;\n  position: absolute;\n  right: 0;\n  top: 0.5em;\n  z-index: 2;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-modal-dialog[_ngcontent-%COMP%] {\n  background: rgba(0, 0, 0, 0.8);\n  background: linear-gradient(180deg, rgba(0, 0, 0, 0.8), rgba(255, 255, 255, 0));\n  overflow: auto;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-modal-dialog[_ngcontent-%COMP%]    > *[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n}\n.vjs-modal-dialog[_ngcontent-%COMP%]   .vjs-modal-dialog-content[_ngcontent-%COMP%] {\n  font-size: 1.2em;\n  line-height: 1.5;\n  padding: 20px 24px;\n  z-index: 1;\n}\n.vjs-menu-button[_ngcontent-%COMP%] {\n  cursor: pointer;\n}\n.vjs-menu-button.vjs-disabled[_ngcontent-%COMP%] {\n  cursor: default;\n}\n.vjs-workinghover[_ngcontent-%COMP%]   .vjs-menu-button.vjs-disabled[_ngcontent-%COMP%]:hover   .vjs-menu[_ngcontent-%COMP%] {\n  display: none;\n}\n.vjs-menu[_ngcontent-%COMP%]   .vjs-menu-content[_ngcontent-%COMP%] {\n  display: block;\n  padding: 0;\n  margin: 0;\n  font-family: Arial, Helvetica, sans-serif;\n  overflow: auto;\n}\n.vjs-menu[_ngcontent-%COMP%]   .vjs-menu-content[_ngcontent-%COMP%]    > *[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n}\n.vjs-scrubbing[_ngcontent-%COMP%]   .vjs-control.vjs-menu-button[_ngcontent-%COMP%]:hover   .vjs-menu[_ngcontent-%COMP%] {\n  display: none;\n}\n.vjs-menu[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  list-style: none;\n  margin: 0;\n  padding: 0.2em 0;\n  line-height: 1.4em;\n  font-size: 1.2em;\n  text-align: center;\n  text-transform: lowercase;\n}\n.vjs-menu[_ngcontent-%COMP%]   li.vjs-menu-item[_ngcontent-%COMP%]:focus, .vjs-menu[_ngcontent-%COMP%]   li.vjs-menu-item[_ngcontent-%COMP%]:hover, .js-focus-visible[_ngcontent-%COMP%]   .vjs-menu[_ngcontent-%COMP%]   li.vjs-menu-item[_ngcontent-%COMP%]:hover {\n  background-color: #73859f;\n  background-color: rgba(115, 133, 159, 0.5);\n}\n.vjs-menu[_ngcontent-%COMP%]   li.vjs-selected[_ngcontent-%COMP%], .vjs-menu[_ngcontent-%COMP%]   li.vjs-selected[_ngcontent-%COMP%]:focus, .vjs-menu[_ngcontent-%COMP%]   li.vjs-selected[_ngcontent-%COMP%]:hover, .js-focus-visible[_ngcontent-%COMP%]   .vjs-menu[_ngcontent-%COMP%]   li.vjs-selected[_ngcontent-%COMP%]:hover {\n  background-color: #fff;\n  color: #2B333F;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-menu[_ngcontent-%COMP%]   *[_ngcontent-%COMP%]:not(.vjs-selected):focus:not(:focus-visible), .js-focus-visible[_ngcontent-%COMP%]   .vjs-menu[_ngcontent-%COMP%]   *[_ngcontent-%COMP%]:not(.vjs-selected):focus:not(.focus-visible) {\n  background: none;\n}\n.vjs-menu[_ngcontent-%COMP%]   li.vjs-menu-title[_ngcontent-%COMP%] {\n  text-align: center;\n  text-transform: uppercase;\n  font-size: 1em;\n  line-height: 2em;\n  padding: 0;\n  margin: 0 0 0.3em 0;\n  font-weight: bold;\n  cursor: default;\n}\n.vjs-menu-button-popup[_ngcontent-%COMP%]   .vjs-menu[_ngcontent-%COMP%] {\n  display: none;\n  position: absolute;\n  bottom: 0;\n  width: 10em;\n  left: -3em;\n  height: 0em;\n  margin-bottom: 1.5em;\n  border-top-color: rgba(43, 51, 63, 0.7);\n}\n.vjs-menu-button-popup[_ngcontent-%COMP%]   .vjs-menu[_ngcontent-%COMP%]   .vjs-menu-content[_ngcontent-%COMP%] {\n  background-color: #2B333F;\n  background-color: rgba(43, 51, 63, 0.7);\n  position: absolute;\n  width: 100%;\n  bottom: 1.5em;\n  max-height: 15em;\n}\n.vjs-layout-tiny[_ngcontent-%COMP%]   .vjs-menu-button-popup[_ngcontent-%COMP%]   .vjs-menu[_ngcontent-%COMP%]   .vjs-menu-content[_ngcontent-%COMP%], .vjs-layout-x-small[_ngcontent-%COMP%]   .vjs-menu-button-popup[_ngcontent-%COMP%]   .vjs-menu[_ngcontent-%COMP%]   .vjs-menu-content[_ngcontent-%COMP%] {\n  max-height: 5em;\n}\n.vjs-layout-small[_ngcontent-%COMP%]   .vjs-menu-button-popup[_ngcontent-%COMP%]   .vjs-menu[_ngcontent-%COMP%]   .vjs-menu-content[_ngcontent-%COMP%] {\n  max-height: 10em;\n}\n.vjs-layout-medium[_ngcontent-%COMP%]   .vjs-menu-button-popup[_ngcontent-%COMP%]   .vjs-menu[_ngcontent-%COMP%]   .vjs-menu-content[_ngcontent-%COMP%] {\n  max-height: 14em;\n}\n.vjs-layout-large[_ngcontent-%COMP%]   .vjs-menu-button-popup[_ngcontent-%COMP%]   .vjs-menu[_ngcontent-%COMP%]   .vjs-menu-content[_ngcontent-%COMP%], .vjs-layout-x-large[_ngcontent-%COMP%]   .vjs-menu-button-popup[_ngcontent-%COMP%]   .vjs-menu[_ngcontent-%COMP%]   .vjs-menu-content[_ngcontent-%COMP%], .vjs-layout-huge[_ngcontent-%COMP%]   .vjs-menu-button-popup[_ngcontent-%COMP%]   .vjs-menu[_ngcontent-%COMP%]   .vjs-menu-content[_ngcontent-%COMP%] {\n  max-height: 25em;\n}\n.vjs-workinghover[_ngcontent-%COMP%]   .vjs-menu-button-popup.vjs-hover[_ngcontent-%COMP%]   .vjs-menu[_ngcontent-%COMP%], .vjs-menu-button-popup[_ngcontent-%COMP%]   .vjs-menu.vjs-lock-showing[_ngcontent-%COMP%] {\n  display: block;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-menu-button-inline[_ngcontent-%COMP%] {\n  transition: all 0.4s;\n  overflow: hidden;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-menu-button-inline[_ngcontent-%COMP%]:before {\n  width: 2.222222222em;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-menu-button-inline[_ngcontent-%COMP%]:hover, .video-js[_ngcontent-%COMP%]   .vjs-menu-button-inline[_ngcontent-%COMP%]:focus, .video-js[_ngcontent-%COMP%]   .vjs-menu-button-inline.vjs-slider-active[_ngcontent-%COMP%], .video-js.vjs-no-flex[_ngcontent-%COMP%]   .vjs-menu-button-inline[_ngcontent-%COMP%] {\n  width: 12em;\n}\n.vjs-menu-button-inline[_ngcontent-%COMP%]   .vjs-menu[_ngcontent-%COMP%] {\n  opacity: 0;\n  height: 100%;\n  width: auto;\n  position: absolute;\n  left: 4em;\n  top: 0;\n  padding: 0;\n  margin: 0;\n  transition: all 0.4s;\n}\n.vjs-menu-button-inline[_ngcontent-%COMP%]:hover   .vjs-menu[_ngcontent-%COMP%], .vjs-menu-button-inline[_ngcontent-%COMP%]:focus   .vjs-menu[_ngcontent-%COMP%], .vjs-menu-button-inline.vjs-slider-active[_ngcontent-%COMP%]   .vjs-menu[_ngcontent-%COMP%] {\n  display: block;\n  opacity: 1;\n}\n.vjs-no-flex[_ngcontent-%COMP%]   .vjs-menu-button-inline[_ngcontent-%COMP%]   .vjs-menu[_ngcontent-%COMP%] {\n  display: block;\n  opacity: 1;\n  position: relative;\n  width: auto;\n}\n.vjs-no-flex[_ngcontent-%COMP%]   .vjs-menu-button-inline[_ngcontent-%COMP%]:hover   .vjs-menu[_ngcontent-%COMP%], .vjs-no-flex[_ngcontent-%COMP%]   .vjs-menu-button-inline[_ngcontent-%COMP%]:focus   .vjs-menu[_ngcontent-%COMP%], .vjs-no-flex[_ngcontent-%COMP%]   .vjs-menu-button-inline.vjs-slider-active[_ngcontent-%COMP%]   .vjs-menu[_ngcontent-%COMP%] {\n  width: auto;\n}\n.vjs-menu-button-inline[_ngcontent-%COMP%]   .vjs-menu-content[_ngcontent-%COMP%] {\n  width: auto;\n  height: 100%;\n  margin: 0;\n  overflow: hidden;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-control-bar[_ngcontent-%COMP%] {\n  display: none;\n  width: 100%;\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  height: 3em;\n  background-color: #2B333F;\n  background-color: rgba(43, 51, 63, 0.7);\n}\n.vjs-has-started[_ngcontent-%COMP%]   .vjs-control-bar[_ngcontent-%COMP%] {\n  display: flex;\n  visibility: visible;\n  opacity: 1;\n  transition: visibility 0.1s, opacity 0.1s;\n}\n.vjs-has-started.vjs-user-inactive.vjs-playing[_ngcontent-%COMP%]   .vjs-control-bar[_ngcontent-%COMP%] {\n  visibility: visible;\n  opacity: 0;\n  transition: visibility 1s, opacity 1s;\n}\n.vjs-controls-disabled[_ngcontent-%COMP%]   .vjs-control-bar[_ngcontent-%COMP%], .vjs-using-native-controls[_ngcontent-%COMP%]   .vjs-control-bar[_ngcontent-%COMP%], .vjs-error[_ngcontent-%COMP%]   .vjs-control-bar[_ngcontent-%COMP%] {\n  display: none !important;\n}\n.vjs-audio.vjs-has-started.vjs-user-inactive.vjs-playing[_ngcontent-%COMP%]   .vjs-control-bar[_ngcontent-%COMP%] {\n  opacity: 1;\n  visibility: visible;\n}\n.vjs-has-started.vjs-no-flex[_ngcontent-%COMP%]   .vjs-control-bar[_ngcontent-%COMP%] {\n  display: table;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-control[_ngcontent-%COMP%] {\n  position: relative;\n  text-align: center;\n  margin: 0;\n  padding: 0;\n  height: 100%;\n  width: 4em;\n  flex: none;\n}\n.vjs-button[_ngcontent-%COMP%]    > .vjs-icon-placeholder[_ngcontent-%COMP%]:before {\n  font-size: 1.8em;\n  line-height: 1.67;\n}\n.vjs-button[_ngcontent-%COMP%]    > .vjs-icon-placeholder[_ngcontent-%COMP%] {\n  display: block;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-control[_ngcontent-%COMP%]:focus:before, .video-js[_ngcontent-%COMP%]   .vjs-control[_ngcontent-%COMP%]:hover:before, .video-js[_ngcontent-%COMP%]   .vjs-control[_ngcontent-%COMP%]:focus {\n  text-shadow: 0em 0em 1em white;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-control-text[_ngcontent-%COMP%] {\n  border: 0;\n  clip: rect(0 0 0 0);\n  height: 1px;\n  overflow: hidden;\n  padding: 0;\n  position: absolute;\n  width: 1px;\n}\n.vjs-no-flex[_ngcontent-%COMP%]   .vjs-control[_ngcontent-%COMP%] {\n  display: table-cell;\n  vertical-align: middle;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-custom-control-spacer[_ngcontent-%COMP%] {\n  display: none;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-progress-control[_ngcontent-%COMP%] {\n  cursor: pointer;\n  flex: auto;\n  display: flex;\n  align-items: center;\n  min-width: 4em;\n  touch-action: none;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-progress-control.disabled[_ngcontent-%COMP%] {\n  cursor: default;\n}\n.vjs-live[_ngcontent-%COMP%]   .vjs-progress-control[_ngcontent-%COMP%] {\n  display: none;\n}\n.vjs-liveui[_ngcontent-%COMP%]   .vjs-progress-control[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n}\n.vjs-no-flex[_ngcontent-%COMP%]   .vjs-progress-control[_ngcontent-%COMP%] {\n  width: auto;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-progress-holder[_ngcontent-%COMP%] {\n  flex: auto;\n  transition: all 0.2s;\n  height: 0.3em;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-progress-control[_ngcontent-%COMP%]   .vjs-progress-holder[_ngcontent-%COMP%] {\n  margin: 0 10px;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-progress-control[_ngcontent-%COMP%]:hover   .vjs-progress-holder[_ngcontent-%COMP%] {\n  font-size: 1.6666666667em;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-progress-control[_ngcontent-%COMP%]:hover   .vjs-progress-holder.disabled[_ngcontent-%COMP%] {\n  font-size: 1em;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-progress-holder[_ngcontent-%COMP%]   .vjs-play-progress[_ngcontent-%COMP%], .video-js[_ngcontent-%COMP%]   .vjs-progress-holder[_ngcontent-%COMP%]   .vjs-load-progress[_ngcontent-%COMP%], .video-js[_ngcontent-%COMP%]   .vjs-progress-holder[_ngcontent-%COMP%]   .vjs-load-progress[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  position: absolute;\n  display: block;\n  height: 100%;\n  margin: 0;\n  padding: 0;\n  width: 0;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-play-progress[_ngcontent-%COMP%] {\n  background-color: #fff;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-play-progress[_ngcontent-%COMP%]:before {\n  font-size: 0.9em;\n  position: absolute;\n  right: -0.5em;\n  top: -0.3333333333em;\n  z-index: 1;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-load-progress[_ngcontent-%COMP%] {\n  background: rgba(115, 133, 159, 0.5);\n}\n.video-js[_ngcontent-%COMP%]   .vjs-load-progress[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  background: rgba(115, 133, 159, 0.75);\n}\n.video-js[_ngcontent-%COMP%]   .vjs-time-tooltip[_ngcontent-%COMP%] {\n  background-color: #fff;\n  background-color: rgba(255, 255, 255, 0.8);\n  border-radius: 0.3em;\n  color: #000;\n  float: right;\n  font-family: Arial, Helvetica, sans-serif;\n  font-size: 1em;\n  padding: 6px 8px 8px 8px;\n  pointer-events: none;\n  position: absolute;\n  top: -3.4em;\n  visibility: hidden;\n  z-index: 1;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-progress-holder[_ngcontent-%COMP%]:focus   .vjs-time-tooltip[_ngcontent-%COMP%] {\n  display: none;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-progress-control[_ngcontent-%COMP%]:hover   .vjs-time-tooltip[_ngcontent-%COMP%], .video-js[_ngcontent-%COMP%]   .vjs-progress-control[_ngcontent-%COMP%]:hover   .vjs-progress-holder[_ngcontent-%COMP%]:focus   .vjs-time-tooltip[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 0.6em;\n  visibility: visible;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-progress-control.disabled[_ngcontent-%COMP%]:hover   .vjs-time-tooltip[_ngcontent-%COMP%] {\n  font-size: 1em;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-progress-control[_ngcontent-%COMP%]   .vjs-mouse-display[_ngcontent-%COMP%] {\n  display: none;\n  position: absolute;\n  width: 1px;\n  height: 100%;\n  background-color: #000;\n  z-index: 1;\n}\n.vjs-no-flex[_ngcontent-%COMP%]   .vjs-progress-control[_ngcontent-%COMP%]   .vjs-mouse-display[_ngcontent-%COMP%] {\n  z-index: 0;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-progress-control[_ngcontent-%COMP%]:hover   .vjs-mouse-display[_ngcontent-%COMP%] {\n  display: block;\n}\n.video-js.vjs-user-inactive[_ngcontent-%COMP%]   .vjs-progress-control[_ngcontent-%COMP%]   .vjs-mouse-display[_ngcontent-%COMP%] {\n  visibility: hidden;\n  opacity: 0;\n  transition: visibility 1s, opacity 1s;\n}\n.video-js.vjs-user-inactive.vjs-no-flex[_ngcontent-%COMP%]   .vjs-progress-control[_ngcontent-%COMP%]   .vjs-mouse-display[_ngcontent-%COMP%] {\n  display: none;\n}\n.vjs-mouse-display[_ngcontent-%COMP%]   .vjs-time-tooltip[_ngcontent-%COMP%] {\n  color: #fff;\n  background-color: #000;\n  background-color: rgba(0, 0, 0, 0.8);\n}\n.video-js[_ngcontent-%COMP%]   .vjs-slider[_ngcontent-%COMP%] {\n  position: relative;\n  cursor: pointer;\n  padding: 0;\n  margin: 0 0.45em 0 0.45em;\n  \n  -webkit-touch-callout: none;\n  \n  -webkit-user-select: none;\n  \n  \n  \n  \n  user-select: none;\n  background-color: #73859f;\n  background-color: rgba(115, 133, 159, 0.5);\n}\n.video-js[_ngcontent-%COMP%]   .vjs-slider.disabled[_ngcontent-%COMP%] {\n  cursor: default;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-slider[_ngcontent-%COMP%]:focus {\n  text-shadow: 0em 0em 1em white;\n  box-shadow: 0 0 1em #fff;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-mute-control[_ngcontent-%COMP%] {\n  cursor: pointer;\n  flex: none;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-volume-control[_ngcontent-%COMP%] {\n  cursor: pointer;\n  margin-right: 1em;\n  display: flex;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-volume-control.vjs-volume-horizontal[_ngcontent-%COMP%] {\n  width: 5em;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-volume-panel[_ngcontent-%COMP%]   .vjs-volume-control[_ngcontent-%COMP%] {\n  visibility: visible;\n  opacity: 0;\n  width: 1px;\n  height: 1px;\n  margin-left: -1px;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-volume-panel[_ngcontent-%COMP%] {\n  transition: width 1s;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-volume-panel.vjs-hover[_ngcontent-%COMP%]   .vjs-volume-control[_ngcontent-%COMP%], .video-js[_ngcontent-%COMP%]   .vjs-volume-panel[_ngcontent-%COMP%]:active   .vjs-volume-control[_ngcontent-%COMP%], .video-js[_ngcontent-%COMP%]   .vjs-volume-panel[_ngcontent-%COMP%]:focus   .vjs-volume-control[_ngcontent-%COMP%], .video-js[_ngcontent-%COMP%]   .vjs-volume-panel[_ngcontent-%COMP%]   .vjs-volume-control[_ngcontent-%COMP%]:active, .video-js[_ngcontent-%COMP%]   .vjs-volume-panel.vjs-hover[_ngcontent-%COMP%]   .vjs-mute-control[_ngcontent-%COMP%]    ~ .vjs-volume-control[_ngcontent-%COMP%], .video-js[_ngcontent-%COMP%]   .vjs-volume-panel[_ngcontent-%COMP%]   .vjs-volume-control.vjs-slider-active[_ngcontent-%COMP%] {\n  visibility: visible;\n  opacity: 1;\n  position: relative;\n  transition: visibility 0.1s, opacity 0.1s, height 0.1s, width 0.1s, left 0s, top 0s;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-volume-panel.vjs-hover[_ngcontent-%COMP%]   .vjs-volume-control.vjs-volume-horizontal[_ngcontent-%COMP%], .video-js[_ngcontent-%COMP%]   .vjs-volume-panel[_ngcontent-%COMP%]:active   .vjs-volume-control.vjs-volume-horizontal[_ngcontent-%COMP%], .video-js[_ngcontent-%COMP%]   .vjs-volume-panel[_ngcontent-%COMP%]:focus   .vjs-volume-control.vjs-volume-horizontal[_ngcontent-%COMP%], .video-js[_ngcontent-%COMP%]   .vjs-volume-panel[_ngcontent-%COMP%]   .vjs-volume-control[_ngcontent-%COMP%]:active.vjs-volume-horizontal, .video-js[_ngcontent-%COMP%]   .vjs-volume-panel.vjs-hover[_ngcontent-%COMP%]   .vjs-mute-control[_ngcontent-%COMP%]    ~ .vjs-volume-control.vjs-volume-horizontal[_ngcontent-%COMP%], .video-js[_ngcontent-%COMP%]   .vjs-volume-panel[_ngcontent-%COMP%]   .vjs-volume-control.vjs-slider-active.vjs-volume-horizontal[_ngcontent-%COMP%] {\n  width: 5em;\n  height: 3em;\n  margin-right: 0;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-volume-panel.vjs-hover[_ngcontent-%COMP%]   .vjs-volume-control.vjs-volume-vertical[_ngcontent-%COMP%], .video-js[_ngcontent-%COMP%]   .vjs-volume-panel[_ngcontent-%COMP%]:active   .vjs-volume-control.vjs-volume-vertical[_ngcontent-%COMP%], .video-js[_ngcontent-%COMP%]   .vjs-volume-panel[_ngcontent-%COMP%]:focus   .vjs-volume-control.vjs-volume-vertical[_ngcontent-%COMP%], .video-js[_ngcontent-%COMP%]   .vjs-volume-panel[_ngcontent-%COMP%]   .vjs-volume-control[_ngcontent-%COMP%]:active.vjs-volume-vertical, .video-js[_ngcontent-%COMP%]   .vjs-volume-panel.vjs-hover[_ngcontent-%COMP%]   .vjs-mute-control[_ngcontent-%COMP%]    ~ .vjs-volume-control.vjs-volume-vertical[_ngcontent-%COMP%], .video-js[_ngcontent-%COMP%]   .vjs-volume-panel[_ngcontent-%COMP%]   .vjs-volume-control.vjs-slider-active.vjs-volume-vertical[_ngcontent-%COMP%] {\n  left: -3.5em;\n  transition: left 0s;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-volume-panel.vjs-volume-panel-horizontal.vjs-hover[_ngcontent-%COMP%], .video-js[_ngcontent-%COMP%]   .vjs-volume-panel.vjs-volume-panel-horizontal[_ngcontent-%COMP%]:active, .video-js[_ngcontent-%COMP%]   .vjs-volume-panel.vjs-volume-panel-horizontal.vjs-slider-active[_ngcontent-%COMP%] {\n  width: 10em;\n  transition: width 0.1s;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-volume-panel.vjs-volume-panel-horizontal.vjs-mute-toggle-only[_ngcontent-%COMP%] {\n  width: 4em;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-volume-panel[_ngcontent-%COMP%]   .vjs-volume-control.vjs-volume-vertical[_ngcontent-%COMP%] {\n  height: 8em;\n  width: 3em;\n  left: -3000em;\n  transition: visibility 1s, opacity 1s, height 1s 1s, width 1s 1s, left 1s 1s, top 1s 1s;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-volume-panel[_ngcontent-%COMP%]   .vjs-volume-control.vjs-volume-horizontal[_ngcontent-%COMP%] {\n  transition: visibility 1s, opacity 1s, height 1s 1s, width 1s, left 1s 1s, top 1s 1s;\n}\n.video-js.vjs-no-flex[_ngcontent-%COMP%]   .vjs-volume-panel[_ngcontent-%COMP%]   .vjs-volume-control.vjs-volume-horizontal[_ngcontent-%COMP%] {\n  width: 5em;\n  height: 3em;\n  visibility: visible;\n  opacity: 1;\n  position: relative;\n  transition: none;\n}\n.video-js.vjs-no-flex[_ngcontent-%COMP%]   .vjs-volume-control.vjs-volume-vertical[_ngcontent-%COMP%], .video-js.vjs-no-flex[_ngcontent-%COMP%]   .vjs-volume-panel[_ngcontent-%COMP%]   .vjs-volume-control.vjs-volume-vertical[_ngcontent-%COMP%] {\n  position: absolute;\n  bottom: 3em;\n  left: 0.5em;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-volume-panel[_ngcontent-%COMP%] {\n  display: flex;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-volume-bar[_ngcontent-%COMP%] {\n  margin: 1.35em 0.45em;\n}\n.vjs-volume-bar.vjs-slider-horizontal[_ngcontent-%COMP%] {\n  width: 5em;\n  height: 0.3em;\n}\n.vjs-volume-bar.vjs-slider-vertical[_ngcontent-%COMP%] {\n  width: 0.3em;\n  height: 5em;\n  margin: 1.35em auto;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-volume-level[_ngcontent-%COMP%] {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  background-color: #fff;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-volume-level[_ngcontent-%COMP%]:before {\n  position: absolute;\n  font-size: 0.9em;\n  z-index: 1;\n}\n.vjs-slider-vertical[_ngcontent-%COMP%]   .vjs-volume-level[_ngcontent-%COMP%] {\n  width: 0.3em;\n}\n.vjs-slider-vertical[_ngcontent-%COMP%]   .vjs-volume-level[_ngcontent-%COMP%]:before {\n  top: -0.5em;\n  left: -0.3em;\n  z-index: 1;\n}\n.vjs-slider-horizontal[_ngcontent-%COMP%]   .vjs-volume-level[_ngcontent-%COMP%] {\n  height: 0.3em;\n}\n.vjs-slider-horizontal[_ngcontent-%COMP%]   .vjs-volume-level[_ngcontent-%COMP%]:before {\n  top: -0.3em;\n  right: -0.5em;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-volume-panel.vjs-volume-panel-vertical[_ngcontent-%COMP%] {\n  width: 4em;\n}\n.vjs-volume-bar.vjs-slider-vertical[_ngcontent-%COMP%]   .vjs-volume-level[_ngcontent-%COMP%] {\n  height: 100%;\n}\n.vjs-volume-bar.vjs-slider-horizontal[_ngcontent-%COMP%]   .vjs-volume-level[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-volume-vertical[_ngcontent-%COMP%] {\n  width: 3em;\n  height: 8em;\n  bottom: 8em;\n  background-color: #2B333F;\n  background-color: rgba(43, 51, 63, 0.7);\n}\n.video-js[_ngcontent-%COMP%]   .vjs-volume-horizontal[_ngcontent-%COMP%]   .vjs-menu[_ngcontent-%COMP%] {\n  left: -2em;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-volume-tooltip[_ngcontent-%COMP%] {\n  background-color: #fff;\n  background-color: rgba(255, 255, 255, 0.8);\n  border-radius: 0.3em;\n  color: #000;\n  float: right;\n  font-family: Arial, Helvetica, sans-serif;\n  font-size: 1em;\n  padding: 6px 8px 8px 8px;\n  pointer-events: none;\n  position: absolute;\n  top: -3.4em;\n  visibility: hidden;\n  z-index: 1;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-volume-control[_ngcontent-%COMP%]:hover   .vjs-volume-tooltip[_ngcontent-%COMP%], .video-js[_ngcontent-%COMP%]   .vjs-volume-control[_ngcontent-%COMP%]:hover   .vjs-progress-holder[_ngcontent-%COMP%]:focus   .vjs-volume-tooltip[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 1em;\n  visibility: visible;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-volume-vertical[_ngcontent-%COMP%]:hover   .vjs-volume-tooltip[_ngcontent-%COMP%], .video-js[_ngcontent-%COMP%]   .vjs-volume-vertical[_ngcontent-%COMP%]:hover   .vjs-progress-holder[_ngcontent-%COMP%]:focus   .vjs-volume-tooltip[_ngcontent-%COMP%] {\n  left: 1em;\n  top: -12px;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-volume-control.disabled[_ngcontent-%COMP%]:hover   .vjs-volume-tooltip[_ngcontent-%COMP%] {\n  font-size: 1em;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-volume-control[_ngcontent-%COMP%]   .vjs-mouse-display[_ngcontent-%COMP%] {\n  display: none;\n  position: absolute;\n  width: 100%;\n  height: 1px;\n  background-color: #000;\n  z-index: 1;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-volume-horizontal[_ngcontent-%COMP%]   .vjs-mouse-display[_ngcontent-%COMP%] {\n  width: 1px;\n  height: 100%;\n}\n.vjs-no-flex[_ngcontent-%COMP%]   .vjs-volume-control[_ngcontent-%COMP%]   .vjs-mouse-display[_ngcontent-%COMP%] {\n  z-index: 0;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-volume-control[_ngcontent-%COMP%]:hover   .vjs-mouse-display[_ngcontent-%COMP%] {\n  display: block;\n}\n.video-js.vjs-user-inactive[_ngcontent-%COMP%]   .vjs-volume-control[_ngcontent-%COMP%]   .vjs-mouse-display[_ngcontent-%COMP%] {\n  visibility: hidden;\n  opacity: 0;\n  transition: visibility 1s, opacity 1s;\n}\n.video-js.vjs-user-inactive.vjs-no-flex[_ngcontent-%COMP%]   .vjs-volume-control[_ngcontent-%COMP%]   .vjs-mouse-display[_ngcontent-%COMP%] {\n  display: none;\n}\n.vjs-mouse-display[_ngcontent-%COMP%]   .vjs-volume-tooltip[_ngcontent-%COMP%] {\n  color: #fff;\n  background-color: #000;\n  background-color: rgba(0, 0, 0, 0.8);\n}\n.vjs-poster[_ngcontent-%COMP%] {\n  display: inline-block;\n  vertical-align: middle;\n  background-repeat: no-repeat;\n  background-position: 50% 50%;\n  background-size: contain;\n  background-color: #000000;\n  cursor: pointer;\n  margin: 0;\n  padding: 0;\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  height: 100%;\n}\n.vjs-has-started[_ngcontent-%COMP%]   .vjs-poster[_ngcontent-%COMP%] {\n  display: none;\n}\n.vjs-audio.vjs-has-started[_ngcontent-%COMP%]   .vjs-poster[_ngcontent-%COMP%] {\n  display: block;\n}\n.vjs-using-native-controls[_ngcontent-%COMP%]   .vjs-poster[_ngcontent-%COMP%] {\n  display: none;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-live-control[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  flex: auto;\n  font-size: 1em;\n  line-height: 3em;\n}\n.vjs-no-flex[_ngcontent-%COMP%]   .vjs-live-control[_ngcontent-%COMP%] {\n  display: table-cell;\n  width: auto;\n  text-align: left;\n}\n.video-js[_ngcontent-%COMP%]:not(.vjs-live)   .vjs-live-control[_ngcontent-%COMP%], .video-js.vjs-liveui[_ngcontent-%COMP%]   .vjs-live-control[_ngcontent-%COMP%] {\n  display: none;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-seek-to-live-control[_ngcontent-%COMP%] {\n  align-items: center;\n  cursor: pointer;\n  flex: none;\n  display: inline-flex;\n  height: 100%;\n  padding-left: 0.5em;\n  padding-right: 0.5em;\n  font-size: 1em;\n  line-height: 3em;\n  width: auto;\n  min-width: 4em;\n}\n.vjs-no-flex[_ngcontent-%COMP%]   .vjs-seek-to-live-control[_ngcontent-%COMP%] {\n  display: table-cell;\n  width: auto;\n  text-align: left;\n}\n.video-js.vjs-live[_ngcontent-%COMP%]:not(.vjs-liveui)   .vjs-seek-to-live-control[_ngcontent-%COMP%], .video-js[_ngcontent-%COMP%]:not(.vjs-live)   .vjs-seek-to-live-control[_ngcontent-%COMP%] {\n  display: none;\n}\n.vjs-seek-to-live-control.vjs-control.vjs-at-live-edge[_ngcontent-%COMP%] {\n  cursor: auto;\n}\n.vjs-seek-to-live-control[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%] {\n  margin-right: 0.5em;\n  color: #888;\n}\n.vjs-seek-to-live-control.vjs-control.vjs-at-live-edge[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%] {\n  color: red;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-time-control[_ngcontent-%COMP%] {\n  flex: none;\n  font-size: 1em;\n  line-height: 3em;\n  min-width: 2em;\n  width: auto;\n  padding-left: 1em;\n  padding-right: 1em;\n}\n.vjs-live[_ngcontent-%COMP%]   .vjs-time-control[_ngcontent-%COMP%] {\n  display: none;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-current-time[_ngcontent-%COMP%], .vjs-no-flex[_ngcontent-%COMP%]   .vjs-current-time[_ngcontent-%COMP%] {\n  display: none;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-duration[_ngcontent-%COMP%], .vjs-no-flex[_ngcontent-%COMP%]   .vjs-duration[_ngcontent-%COMP%] {\n  display: none;\n}\n.vjs-time-divider[_ngcontent-%COMP%] {\n  display: none;\n  line-height: 3em;\n}\n.vjs-live[_ngcontent-%COMP%]   .vjs-time-divider[_ngcontent-%COMP%] {\n  display: none;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-play-control[_ngcontent-%COMP%] {\n  cursor: pointer;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-play-control[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%] {\n  flex: none;\n}\n.vjs-text-track-display[_ngcontent-%COMP%] {\n  position: absolute;\n  bottom: 3em;\n  left: 0;\n  right: 0;\n  top: 0;\n  pointer-events: none;\n}\n.video-js.vjs-user-inactive.vjs-playing[_ngcontent-%COMP%]   .vjs-text-track-display[_ngcontent-%COMP%] {\n  bottom: 1em;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-text-track[_ngcontent-%COMP%] {\n  font-size: 1.4em;\n  text-align: center;\n  margin-bottom: 0.1em;\n}\n.vjs-subtitles[_ngcontent-%COMP%] {\n  color: #fff;\n}\n.vjs-captions[_ngcontent-%COMP%] {\n  color: #fc6;\n}\n.vjs-tt-cue[_ngcontent-%COMP%] {\n  display: block;\n}\nvideo[_ngcontent-%COMP%]::-webkit-media-text-track-display {\n  transform: translateY(-3em);\n}\n.video-js.vjs-user-inactive.vjs-playing[_ngcontent-%COMP%]   video[_ngcontent-%COMP%]::-webkit-media-text-track-display {\n  transform: translateY(-1.5em);\n}\n.video-js[_ngcontent-%COMP%]   .vjs-picture-in-picture-control[_ngcontent-%COMP%] {\n  cursor: pointer;\n  flex: none;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-fullscreen-control[_ngcontent-%COMP%] {\n  cursor: pointer;\n  flex: none;\n}\n.vjs-playback-rate[_ngcontent-%COMP%]    > .vjs-menu-button[_ngcontent-%COMP%], .vjs-playback-rate[_ngcontent-%COMP%]   .vjs-playback-rate-value[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n}\n.vjs-playback-rate[_ngcontent-%COMP%]   .vjs-playback-rate-value[_ngcontent-%COMP%] {\n  pointer-events: none;\n  font-size: 1.5em;\n  line-height: 2;\n  text-align: center;\n}\n.vjs-playback-rate[_ngcontent-%COMP%]   .vjs-menu[_ngcontent-%COMP%] {\n  width: 4em;\n  left: 0em;\n}\n.vjs-error[_ngcontent-%COMP%]   .vjs-error-display[_ngcontent-%COMP%]   .vjs-modal-dialog-content[_ngcontent-%COMP%] {\n  font-size: 1.4em;\n  text-align: center;\n}\n.vjs-error[_ngcontent-%COMP%]   .vjs-error-display[_ngcontent-%COMP%]:before {\n  color: #fff;\n  content: \"X\";\n  font-family: Arial, Helvetica, sans-serif;\n  font-size: 4em;\n  left: 0;\n  line-height: 1;\n  margin-top: -0.5em;\n  position: absolute;\n  text-shadow: 0.05em 0.05em 0.1em #000;\n  text-align: center;\n  top: 50%;\n  vertical-align: middle;\n  width: 100%;\n}\n.vjs-loading-spinner[_ngcontent-%COMP%] {\n  display: none;\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  margin: -25px 0 0 -25px;\n  opacity: 0.85;\n  text-align: left;\n  border: 6px solid rgba(43, 51, 63, 0.7);\n  box-sizing: border-box;\n  background-clip: padding-box;\n  width: 50px;\n  height: 50px;\n  border-radius: 25px;\n  visibility: hidden;\n}\n.vjs-seeking[_ngcontent-%COMP%]   .vjs-loading-spinner[_ngcontent-%COMP%], .vjs-waiting[_ngcontent-%COMP%]   .vjs-loading-spinner[_ngcontent-%COMP%] {\n  display: block;\n  animation: vjs-spinner-show 0s linear 0.3s forwards;\n}\n.vjs-loading-spinner[_ngcontent-%COMP%]:before, .vjs-loading-spinner[_ngcontent-%COMP%]:after {\n  content: \"\";\n  position: absolute;\n  margin: -6px;\n  box-sizing: inherit;\n  width: inherit;\n  height: inherit;\n  border-radius: inherit;\n  opacity: 1;\n  border: inherit;\n  border-color: transparent;\n  border-top-color: white;\n}\n.vjs-seeking[_ngcontent-%COMP%]   .vjs-loading-spinner[_ngcontent-%COMP%]:before, .vjs-seeking[_ngcontent-%COMP%]   .vjs-loading-spinner[_ngcontent-%COMP%]:after, .vjs-waiting[_ngcontent-%COMP%]   .vjs-loading-spinner[_ngcontent-%COMP%]:before, .vjs-waiting[_ngcontent-%COMP%]   .vjs-loading-spinner[_ngcontent-%COMP%]:after {\n  animation: vjs-spinner-spin 1.1s cubic-bezier(0.6, 0.2, 0, 0.8) infinite, vjs-spinner-fade 1.1s linear infinite;\n}\n.vjs-seeking[_ngcontent-%COMP%]   .vjs-loading-spinner[_ngcontent-%COMP%]:before, .vjs-waiting[_ngcontent-%COMP%]   .vjs-loading-spinner[_ngcontent-%COMP%]:before {\n  border-top-color: white;\n}\n.vjs-seeking[_ngcontent-%COMP%]   .vjs-loading-spinner[_ngcontent-%COMP%]:after, .vjs-waiting[_ngcontent-%COMP%]   .vjs-loading-spinner[_ngcontent-%COMP%]:after {\n  border-top-color: white;\n  animation-delay: 0.44s;\n}\n@keyframes vjs-spinner-show {\n  to {\n    visibility: visible;\n  }\n}\n@keyframes vjs-spinner-spin {\n  100% {\n    transform: rotate(360deg);\n  }\n}\n@keyframes vjs-spinner-fade {\n  0% {\n    border-top-color: #73859f;\n  }\n  20% {\n    border-top-color: #73859f;\n  }\n  35% {\n    border-top-color: white;\n  }\n  60% {\n    border-top-color: #73859f;\n  }\n  100% {\n    border-top-color: #73859f;\n  }\n}\n.vjs-chapters-button[_ngcontent-%COMP%]   .vjs-menu[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%] {\n  width: 24em;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-subs-caps-button[_ngcontent-%COMP%]    + .vjs-menu[_ngcontent-%COMP%]   .vjs-captions-menu-item[_ngcontent-%COMP%]   .vjs-menu-item-text[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%] {\n  vertical-align: middle;\n  display: inline-block;\n  margin-bottom: -0.1em;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-subs-caps-button[_ngcontent-%COMP%]    + .vjs-menu[_ngcontent-%COMP%]   .vjs-captions-menu-item[_ngcontent-%COMP%]   .vjs-menu-item-text[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%]:before {\n  font-family: VideoJS;\n  content: \"\";\n  font-size: 1.5em;\n  line-height: inherit;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-audio-button[_ngcontent-%COMP%]    + .vjs-menu[_ngcontent-%COMP%]   .vjs-main-desc-menu-item[_ngcontent-%COMP%]   .vjs-menu-item-text[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%] {\n  vertical-align: middle;\n  display: inline-block;\n  margin-bottom: -0.1em;\n}\n.video-js[_ngcontent-%COMP%]   .vjs-audio-button[_ngcontent-%COMP%]    + .vjs-menu[_ngcontent-%COMP%]   .vjs-main-desc-menu-item[_ngcontent-%COMP%]   .vjs-menu-item-text[_ngcontent-%COMP%]   .vjs-icon-placeholder[_ngcontent-%COMP%]:before {\n  font-family: VideoJS;\n  content: \" \";\n  font-size: 1.5em;\n  line-height: inherit;\n}\n.video-js.vjs-layout-small[_ngcontent-%COMP%]   .vjs-current-time[_ngcontent-%COMP%], .video-js.vjs-layout-small[_ngcontent-%COMP%]   .vjs-time-divider[_ngcontent-%COMP%], .video-js.vjs-layout-small[_ngcontent-%COMP%]   .vjs-duration[_ngcontent-%COMP%], .video-js.vjs-layout-small[_ngcontent-%COMP%]   .vjs-remaining-time[_ngcontent-%COMP%], .video-js.vjs-layout-small[_ngcontent-%COMP%]   .vjs-playback-rate[_ngcontent-%COMP%], .video-js.vjs-layout-small[_ngcontent-%COMP%]   .vjs-chapters-button[_ngcontent-%COMP%], .video-js.vjs-layout-small[_ngcontent-%COMP%]   .vjs-descriptions-button[_ngcontent-%COMP%], .video-js.vjs-layout-small[_ngcontent-%COMP%]   .vjs-captions-button[_ngcontent-%COMP%], .video-js.vjs-layout-small[_ngcontent-%COMP%]   .vjs-subtitles-button[_ngcontent-%COMP%], .video-js.vjs-layout-small[_ngcontent-%COMP%]   .vjs-audio-button[_ngcontent-%COMP%], .video-js.vjs-layout-small[_ngcontent-%COMP%]   .vjs-volume-control[_ngcontent-%COMP%], .video-js.vjs-layout-x-small[_ngcontent-%COMP%]   .vjs-current-time[_ngcontent-%COMP%], .video-js.vjs-layout-x-small[_ngcontent-%COMP%]   .vjs-time-divider[_ngcontent-%COMP%], .video-js.vjs-layout-x-small[_ngcontent-%COMP%]   .vjs-duration[_ngcontent-%COMP%], .video-js.vjs-layout-x-small[_ngcontent-%COMP%]   .vjs-remaining-time[_ngcontent-%COMP%], .video-js.vjs-layout-x-small[_ngcontent-%COMP%]   .vjs-playback-rate[_ngcontent-%COMP%], .video-js.vjs-layout-x-small[_ngcontent-%COMP%]   .vjs-chapters-button[_ngcontent-%COMP%], .video-js.vjs-layout-x-small[_ngcontent-%COMP%]   .vjs-descriptions-button[_ngcontent-%COMP%], .video-js.vjs-layout-x-small[_ngcontent-%COMP%]   .vjs-captions-button[_ngcontent-%COMP%], .video-js.vjs-layout-x-small[_ngcontent-%COMP%]   .vjs-subtitles-button[_ngcontent-%COMP%], .video-js.vjs-layout-x-small[_ngcontent-%COMP%]   .vjs-audio-button[_ngcontent-%COMP%], .video-js.vjs-layout-x-small[_ngcontent-%COMP%]   .vjs-volume-control[_ngcontent-%COMP%], .video-js.vjs-layout-tiny[_ngcontent-%COMP%]   .vjs-current-time[_ngcontent-%COMP%], .video-js.vjs-layout-tiny[_ngcontent-%COMP%]   .vjs-time-divider[_ngcontent-%COMP%], .video-js.vjs-layout-tiny[_ngcontent-%COMP%]   .vjs-duration[_ngcontent-%COMP%], .video-js.vjs-layout-tiny[_ngcontent-%COMP%]   .vjs-remaining-time[_ngcontent-%COMP%], .video-js.vjs-layout-tiny[_ngcontent-%COMP%]   .vjs-playback-rate[_ngcontent-%COMP%], .video-js.vjs-layout-tiny[_ngcontent-%COMP%]   .vjs-chapters-button[_ngcontent-%COMP%], .video-js.vjs-layout-tiny[_ngcontent-%COMP%]   .vjs-descriptions-button[_ngcontent-%COMP%], .video-js.vjs-layout-tiny[_ngcontent-%COMP%]   .vjs-captions-button[_ngcontent-%COMP%], .video-js.vjs-layout-tiny[_ngcontent-%COMP%]   .vjs-subtitles-button[_ngcontent-%COMP%], .video-js.vjs-layout-tiny[_ngcontent-%COMP%]   .vjs-audio-button[_ngcontent-%COMP%], .video-js.vjs-layout-tiny[_ngcontent-%COMP%]   .vjs-volume-control[_ngcontent-%COMP%] {\n  display: none !important;\n}\n.video-js.vjs-layout-small[_ngcontent-%COMP%]   .vjs-volume-panel.vjs-volume-panel-horizontal[_ngcontent-%COMP%]:hover, .video-js.vjs-layout-small[_ngcontent-%COMP%]   .vjs-volume-panel.vjs-volume-panel-horizontal[_ngcontent-%COMP%]:active, .video-js.vjs-layout-small[_ngcontent-%COMP%]   .vjs-volume-panel.vjs-volume-panel-horizontal.vjs-slider-active[_ngcontent-%COMP%], .video-js.vjs-layout-x-small[_ngcontent-%COMP%]   .vjs-volume-panel.vjs-volume-panel-horizontal[_ngcontent-%COMP%]:hover, .video-js.vjs-layout-x-small[_ngcontent-%COMP%]   .vjs-volume-panel.vjs-volume-panel-horizontal[_ngcontent-%COMP%]:active, .video-js.vjs-layout-x-small[_ngcontent-%COMP%]   .vjs-volume-panel.vjs-volume-panel-horizontal.vjs-slider-active[_ngcontent-%COMP%], .video-js.vjs-layout-tiny[_ngcontent-%COMP%]   .vjs-volume-panel.vjs-volume-panel-horizontal[_ngcontent-%COMP%]:hover, .video-js.vjs-layout-tiny[_ngcontent-%COMP%]   .vjs-volume-panel.vjs-volume-panel-horizontal[_ngcontent-%COMP%]:active, .video-js.vjs-layout-tiny[_ngcontent-%COMP%]   .vjs-volume-panel.vjs-volume-panel-horizontal.vjs-slider-active[_ngcontent-%COMP%] {\n  width: auto;\n  width: initial;\n}\n.video-js.vjs-layout-x-small[_ngcontent-%COMP%]:not(.vjs-liveui)   .vjs-subs-caps-button[_ngcontent-%COMP%], .video-js.vjs-layout-x-small[_ngcontent-%COMP%]:not(.vjs-live)   .vjs-subs-caps-button[_ngcontent-%COMP%], .video-js.vjs-layout-tiny[_ngcontent-%COMP%]   .vjs-subs-caps-button[_ngcontent-%COMP%] {\n  display: none;\n}\n.video-js.vjs-layout-x-small.vjs-liveui[_ngcontent-%COMP%]   .vjs-custom-control-spacer[_ngcontent-%COMP%], .video-js.vjs-layout-tiny[_ngcontent-%COMP%]   .vjs-custom-control-spacer[_ngcontent-%COMP%] {\n  flex: auto;\n  display: block;\n}\n.video-js.vjs-layout-x-small.vjs-liveui.vjs-no-flex[_ngcontent-%COMP%]   .vjs-custom-control-spacer[_ngcontent-%COMP%], .video-js.vjs-layout-tiny.vjs-no-flex[_ngcontent-%COMP%]   .vjs-custom-control-spacer[_ngcontent-%COMP%] {\n  width: auto;\n}\n.video-js.vjs-layout-x-small.vjs-liveui[_ngcontent-%COMP%]   .vjs-progress-control[_ngcontent-%COMP%], .video-js.vjs-layout-tiny[_ngcontent-%COMP%]   .vjs-progress-control[_ngcontent-%COMP%] {\n  display: none;\n}\n.vjs-modal-dialog.vjs-text-track-settings[_ngcontent-%COMP%] {\n  background-color: #2B333F;\n  background-color: rgba(43, 51, 63, 0.75);\n  color: #fff;\n  height: 70%;\n}\n.vjs-text-track-settings[_ngcontent-%COMP%]   .vjs-modal-dialog-content[_ngcontent-%COMP%] {\n  display: table;\n}\n.vjs-text-track-settings[_ngcontent-%COMP%]   .vjs-track-settings-colors[_ngcontent-%COMP%], .vjs-text-track-settings[_ngcontent-%COMP%]   .vjs-track-settings-font[_ngcontent-%COMP%], .vjs-text-track-settings[_ngcontent-%COMP%]   .vjs-track-settings-controls[_ngcontent-%COMP%] {\n  display: table-cell;\n}\n.vjs-text-track-settings[_ngcontent-%COMP%]   .vjs-track-settings-controls[_ngcontent-%COMP%] {\n  text-align: right;\n  vertical-align: bottom;\n}\n@supports (display: grid) {\n  .vjs-text-track-settings[_ngcontent-%COMP%]   .vjs-modal-dialog-content[_ngcontent-%COMP%] {\n    display: grid;\n    grid-template-columns: 1fr 1fr;\n    grid-template-rows: 1fr;\n    padding: 20px 24px 0px 24px;\n  }\n\n  .vjs-track-settings-controls[_ngcontent-%COMP%]   .vjs-default-button[_ngcontent-%COMP%] {\n    margin-bottom: 20px;\n  }\n\n  .vjs-text-track-settings[_ngcontent-%COMP%]   .vjs-track-settings-controls[_ngcontent-%COMP%] {\n    grid-column: 1/-1;\n  }\n\n  .vjs-layout-small[_ngcontent-%COMP%]   .vjs-text-track-settings[_ngcontent-%COMP%]   .vjs-modal-dialog-content[_ngcontent-%COMP%], .vjs-layout-x-small[_ngcontent-%COMP%]   .vjs-text-track-settings[_ngcontent-%COMP%]   .vjs-modal-dialog-content[_ngcontent-%COMP%], .vjs-layout-tiny[_ngcontent-%COMP%]   .vjs-text-track-settings[_ngcontent-%COMP%]   .vjs-modal-dialog-content[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.vjs-track-setting[_ngcontent-%COMP%]    > select[_ngcontent-%COMP%] {\n  margin-right: 1em;\n  margin-bottom: 0.5em;\n}\n.vjs-text-track-settings[_ngcontent-%COMP%]   fieldset[_ngcontent-%COMP%] {\n  margin: 5px;\n  padding: 3px;\n  border: none;\n}\n.vjs-text-track-settings[_ngcontent-%COMP%]   fieldset[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: inline-block;\n}\n.vjs-text-track-settings[_ngcontent-%COMP%]   fieldset[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]    > select[_ngcontent-%COMP%] {\n  max-width: 7.3em;\n}\n.vjs-text-track-settings[_ngcontent-%COMP%]   legend[_ngcontent-%COMP%] {\n  color: #fff;\n  margin: 0 0 5px 0;\n}\n.vjs-text-track-settings[_ngcontent-%COMP%]   .vjs-label[_ngcontent-%COMP%] {\n  position: absolute;\n  clip: rect(1px 1px 1px 1px);\n  clip: rect(1px, 1px, 1px, 1px);\n  display: block;\n  margin: 0 0 5px 0;\n  padding: 0;\n  border: 0;\n  height: 1px;\n  width: 1px;\n  overflow: hidden;\n}\n.vjs-track-settings-controls[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:focus, .vjs-track-settings-controls[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:active {\n  outline-style: solid;\n  outline-width: medium;\n  background-image: linear-gradient(0deg, #fff 88%, #73859f 100%);\n}\n.vjs-track-settings-controls[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover {\n  color: rgba(43, 51, 63, 0.75);\n}\n.vjs-track-settings-controls[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  background-color: #fff;\n  background-image: linear-gradient(-180deg, #fff 88%, #73859f 100%);\n  color: #2B333F;\n  cursor: pointer;\n  border-radius: 2px;\n}\n.vjs-track-settings-controls[_ngcontent-%COMP%]   .vjs-default-button[_ngcontent-%COMP%] {\n  margin-right: 1em;\n}\n@media print {\n  .video-js[_ngcontent-%COMP%]    > *[_ngcontent-%COMP%]:not(.vjs-tech):not(.vjs-poster) {\n    visibility: hidden;\n  }\n}\n.vjs-resize-manager[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  border: none;\n  z-index: -1000;\n}\n.js-focus-visible[_ngcontent-%COMP%]   .video-js[_ngcontent-%COMP%]   *[_ngcontent-%COMP%]:focus:not(.focus-visible) {\n  outline: none;\n}\n.video-js[_ngcontent-%COMP%]   *[_ngcontent-%COMP%]:focus:not(:focus-visible) {\n  outline: none;\n}\nhtml[_ngcontent-%COMP%] {\r\n    overflow-x: hidden;\r\n    font-family: 'Lucida Sans',sans-serif;\r\n    margin: 0 -8px;\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy92aWRlby5qcy9kaXN0L3ZpZGVvLWpzLmNzcyIsImFwcC5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGdCQUFnQjtBQUNoQjtFQUNFLGtCQUFrQjtFQUNsQixNQUFNO0VBQ04sT0FBTztFQUNQLFdBQVc7RUFDWCxZQUFZO0FBQ2Q7QUFFQTtFQUNFLGtCQUFrQjtBQUNwQjtBQUVBO0VBQ0Usb0JBQW9CO0VBQ3BCLGl0TEFBaXRMO0VBQ2p0TCxtQkFBbUI7RUFDbkIsa0JBQWtCO0FBQ3BCO0FBQ0E7RUFDRSxvQkFBb0I7RUFDcEIsbUJBQW1CO0VBQ25CLGtCQUFrQjtBQUNwQjtBQUNBO0VBQ0UsZ0JBQWdCO0FBQ2xCO0FBRUE7RUFDRSxvQkFBb0I7RUFDcEIsbUJBQW1CO0VBQ25CLGtCQUFrQjtBQUNwQjtBQUNBO0VBQ0UsZ0JBQWdCO0FBQ2xCO0FBRUE7RUFDRSxvQkFBb0I7RUFDcEIsbUJBQW1CO0VBQ25CLGtCQUFrQjtBQUNwQjtBQUNBO0VBQ0UsZ0JBQWdCO0FBQ2xCO0FBRUE7RUFDRSxvQkFBb0I7RUFDcEIsbUJBQW1CO0VBQ25CLGtCQUFrQjtBQUNwQjtBQUNBO0VBQ0UsZ0JBQWdCO0FBQ2xCO0FBRUE7RUFDRSxvQkFBb0I7RUFDcEIsbUJBQW1CO0VBQ25CLGtCQUFrQjtBQUNwQjtBQUNBO0VBQ0UsZ0JBQWdCO0FBQ2xCO0FBRUE7RUFDRSxvQkFBb0I7RUFDcEIsbUJBQW1CO0VBQ25CLGtCQUFrQjtBQUNwQjtBQUNBO0VBQ0UsZ0JBQWdCO0FBQ2xCO0FBRUE7RUFDRSxvQkFBb0I7RUFDcEIsbUJBQW1CO0VBQ25CLGtCQUFrQjtBQUNwQjtBQUNBO0VBQ0UsZ0JBQWdCO0FBQ2xCO0FBRUE7RUFDRSxvQkFBb0I7RUFDcEIsbUJBQW1CO0VBQ25CLGtCQUFrQjtBQUNwQjtBQUNBO0VBQ0UsZ0JBQWdCO0FBQ2xCO0FBRUE7RUFDRSxvQkFBb0I7RUFDcEIsbUJBQW1CO0VBQ25CLGtCQUFrQjtBQUNwQjtBQUNBO0VBQ0UsZ0JBQWdCO0FBQ2xCO0FBRUE7RUFDRSxvQkFBb0I7RUFDcEIsbUJBQW1CO0VBQ25CLGtCQUFrQjtBQUNwQjtBQUNBO0VBQ0UsZ0JBQWdCO0FBQ2xCO0FBRUE7RUFDRSxvQkFBb0I7RUFDcEIsbUJBQW1CO0VBQ25CLGtCQUFrQjtBQUNwQjtBQUNBO0VBQ0UsZ0JBQWdCO0FBQ2xCO0FBRUE7Ozs7O0VBS0Usb0JBQW9CO0VBQ3BCLG1CQUFtQjtFQUNuQixrQkFBa0I7QUFDcEI7QUFDQTs7Ozs7RUFLRSxnQkFBZ0I7QUFDbEI7QUFFQTs7RUFFRSxvQkFBb0I7RUFDcEIsbUJBQW1CO0VBQ25CLGtCQUFrQjtBQUNwQjtBQUNBOztFQUVFLGdCQUFnQjtBQUNsQjtBQUVBO0VBQ0Usb0JBQW9CO0VBQ3BCLG1CQUFtQjtFQUNuQixrQkFBa0I7QUFDcEI7QUFDQTtFQUNFLGdCQUFnQjtBQUNsQjtBQUVBO0VBQ0Usb0JBQW9CO0VBQ3BCLG1CQUFtQjtFQUNuQixrQkFBa0I7QUFDcEI7QUFDQTtFQUNFLGdCQUFnQjtBQUNsQjtBQUVBO0VBQ0Usb0JBQW9CO0VBQ3BCLG1CQUFtQjtFQUNuQixrQkFBa0I7QUFDcEI7QUFDQTtFQUNFLGdCQUFnQjtBQUNsQjtBQUVBO0VBQ0Usb0JBQW9CO0VBQ3BCLG1CQUFtQjtFQUNuQixrQkFBa0I7QUFDcEI7QUFDQTtFQUNFLGdCQUFnQjtBQUNsQjtBQUVBO0VBQ0Usb0JBQW9CO0VBQ3BCLG1CQUFtQjtFQUNuQixrQkFBa0I7QUFDcEI7QUFDQTtFQUNFLGdCQUFnQjtBQUNsQjtBQUVBO0VBQ0Usb0JBQW9CO0VBQ3BCLG1CQUFtQjtFQUNuQixrQkFBa0I7QUFDcEI7QUFDQTtFQUNFLGdCQUFnQjtBQUNsQjtBQUVBO0VBQ0Usb0JBQW9CO0VBQ3BCLG1CQUFtQjtFQUNuQixrQkFBa0I7QUFDcEI7QUFDQTtFQUNFLGdCQUFnQjtBQUNsQjtBQUVBO0VBQ0Usb0JBQW9CO0VBQ3BCLG1CQUFtQjtFQUNuQixrQkFBa0I7QUFDcEI7QUFDQTtFQUNFLGdCQUFnQjtBQUNsQjtBQUVBO0VBQ0Usb0JBQW9CO0VBQ3BCLG1CQUFtQjtFQUNuQixrQkFBa0I7QUFDcEI7QUFDQTtFQUNFLGdCQUFnQjtBQUNsQjtBQUVBO0VBQ0Usb0JBQW9CO0VBQ3BCLG1CQUFtQjtFQUNuQixrQkFBa0I7QUFDcEI7QUFDQTtFQUNFLGdCQUFnQjtBQUNsQjtBQUVBO0VBQ0Usb0JBQW9CO0VBQ3BCLG1CQUFtQjtFQUNuQixrQkFBa0I7QUFDcEI7QUFDQTtFQUNFLGdCQUFnQjtBQUNsQjtBQUVBO0VBQ0Usb0JBQW9CO0VBQ3BCLG1CQUFtQjtFQUNuQixrQkFBa0I7QUFDcEI7QUFDQTtFQUNFLGdCQUFnQjtBQUNsQjtBQUVBO0VBQ0Usb0JBQW9CO0VBQ3BCLG1CQUFtQjtFQUNuQixrQkFBa0I7QUFDcEI7QUFDQTtFQUNFLGdCQUFnQjtBQUNsQjtBQUVBO0VBQ0Usb0JBQW9CO0VBQ3BCLG1CQUFtQjtFQUNuQixrQkFBa0I7QUFDcEI7QUFDQTtFQUNFLGdCQUFnQjtBQUNsQjtBQUVBO0VBQ0Usb0JBQW9CO0VBQ3BCLG1CQUFtQjtFQUNuQixrQkFBa0I7QUFDcEI7QUFDQTtFQUNFLGdCQUFnQjtBQUNsQjtBQUVBO0VBQ0Usb0JBQW9CO0VBQ3BCLG1CQUFtQjtFQUNuQixrQkFBa0I7QUFDcEI7QUFDQTtFQUNFLGdCQUFnQjtBQUNsQjtBQUVBO0VBQ0Usb0JBQW9CO0VBQ3BCLG1CQUFtQjtFQUNuQixrQkFBa0I7QUFDcEI7QUFDQTtFQUNFLGdCQUFnQjtBQUNsQjtBQUVBO0VBQ0Usb0JBQW9CO0VBQ3BCLG1CQUFtQjtFQUNuQixrQkFBa0I7QUFDcEI7QUFDQTtFQUNFLGdCQUFnQjtBQUNsQjtBQUVBO0VBQ0Usb0JBQW9CO0VBQ3BCLG1CQUFtQjtFQUNuQixrQkFBa0I7QUFDcEI7QUFDQTtFQUNFLGdCQUFnQjtBQUNsQjtBQUVBO0VBQ0Usb0JBQW9CO0VBQ3BCLG1CQUFtQjtFQUNuQixrQkFBa0I7QUFDcEI7QUFDQTtFQUNFLGdCQUFnQjtBQUNsQjtBQUVBO0VBQ0Usb0JBQW9CO0VBQ3BCLG1CQUFtQjtFQUNu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Q2xCIiwiZmlsZSI6ImFwcC5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiQGNoYXJzZXQgXCJVVEYtOFwiO1xuLnZqcy1tb2RhbC1kaWFsb2cgLnZqcy1tb2RhbC1kaWFsb2ctY29udGVudCwgLnZpZGVvLWpzIC52anMtbW9kYWwtZGlhbG9nLCAudmpzLWJ1dHRvbiA+IC52anMtaWNvbi1wbGFjZWhvbGRlcjpiZWZvcmUsIC52aWRlby1qcyAudmpzLWJpZy1wbGF5LWJ1dHRvbiAudmpzLWljb24tcGxhY2Vob2xkZXI6YmVmb3JlIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDA7XG4gIGxlZnQ6IDA7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDEwMCU7XG59XG5cbi52anMtYnV0dG9uID4gLnZqcy1pY29uLXBsYWNlaG9sZGVyOmJlZm9yZSwgLnZpZGVvLWpzIC52anMtYmlnLXBsYXktYnV0dG9uIC52anMtaWNvbi1wbGFjZWhvbGRlcjpiZWZvcmUge1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG59XG5cbkBmb250LWZhY2Uge1xuICBmb250LWZhbWlseTogVmlkZW9KUztcbiAgc3JjOiB1cmwoZGF0YTphcHBsaWNhdGlvbi9mb250LXdvZmY7Y2hhcnNldD11dGYtODtiYXNlNjQsZDA5R1JnQUJBQUFBQUJEa0FBc0FBQUFBRzZnQUFRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUJIVTFWQ0FBQUJDQUFBQURzQUFBQlVJSXNsZWs5VEx6SUFBQUZFQUFBQVBnQUFBRlpSaVYzaFkyMWhjQUFBQVlRQUFBRGFBQUFEUHY3NDkvcG5iSGxtQUFBQ1lBQUFDM0FBQUJIUVpnNk9jV2hsWVdRQUFBM1FBQUFBS3dBQUFEWVp3MjUxYUdobFlRQUFEZndBQUFBZEFBQUFKQStSQ0xGb2JYUjRBQUFPSEFBQUFCTUFBQUNNNzQ0QUFHeHZZMkVBQUE0d0FBQUFTQUFBQUVoRjZrcXViV0Y0Y0FBQURuZ0FBQUFmQUFBQUlBRTBBSUZ1WVcxbEFBQU9tQUFBQVNVQUFBSUsxY2Yxb0hCdmMzUUFBQS9BQUFBQkpBQUFBZFBFeFl1TmVKeGpZR1JnWU9CaU1HQ3dZMkJ5Y2ZNSlllRExTU3pKWTVCaVlHR0FBSkE4TXBzeEp6TTlrWUVEeGdQS3NZQnBEaUJtZzRnQ0FDWTdCVWdBZUp4allHUzd3VGlCZ1pXQmdhV1E1UmtEQThNdkNNMGN3eERPZUk2QmdZbUJsWmtCS3doSWMwMWhjUGpJK0ZHSkhjUmR5QTRSWmdRUkFESzNDeEVBQUhpYzdkRlpic01nQUVYUlMweWN5Wm5uT2VHN3krcUM4cFUxZEh1c0lPWHh1b3hhT2x3WllXUUIwQWVhNHF1SUVONEU5THpLYktqekRlTTZIL211YTZMbWMvcDh5aGcwbHZkWXgxNVpHOHVPTFFPR2pNcDNFenFtekppellNbUtOUnUyN05oejRNaUpNeGV1M0xqejRFa3FtN1Q4UDUyRzhQUDNsblRPVmsrK1o2aU42UVp6Tk4xRjdwdHVON2VHT2pEVW9hR09ESFZzdXZVOE1kVE85SGQ1YXFnelE1MGI2c0pRbDRhNk10UzFvVzRNZFd1b08wUGRHK3JCVUkrR2VqTFVzNkZlRFBWcXFEZER2UnZxdzFDZmhwcU05QXQwaUZMYUFBQjRuSjFZRFhCVFZSWis1LzIyVFVsSjh3ZTBwSGxKbTdSSmY1TzhGMmo2RXltbFNQa3B4YUw4VTJ4cGEzREtqMENCaGMySVc0ZVdLU29rSW9Mc3VNcXNzTTY0ZitqQTRIU2RXWFhYc2NCcTY3SU9zM0ZYWjFaWVdWeVJGZG84OTl5WHRJQlFaOTBrNzcxN3p6M3YzSFBQT2ZkODU0WUNDajljTDlkTDBSUUZPcUNiR0puckhiNUVheWlLSVdOOGlBL2hXQmJsbzZoVVdtOFR0Q0R3RTgwV01KdXMvaXJ3eXhPZHhlQjBNRGIxNFZOSkhuWFlvTExTbDZGZkNVWU85bllQVEE4RXBnOTA5MExwcmZiQmJaMmhZMFVsSlVYSFFwMy92dFdrUzZFQnY4K3JQTXE1dTk2OTJmL2ROeEpOaXF3QzF4UEU5VENVZ0NzU2RRV2dFM1hRRDI1bGtHNENOMnhtVGNPWFdCT3lzZXI2Uk42S25HYktTYm1RMytkME9JMW0yVzhRekxMa0kyc3lrcldBZ0pKRXRBOHZHR1cvMlErQ21UM244elM5d1p3dTJEQ3Z0dVpLWk4zeGtyTGgzNnlDWnVVb21RU3FHcFk4dC8yNVZmSFZodzh6NGViR0J0ZkxiMHlhOVBDYURjKzhkR1R2azJkc2g2ejdXenZvd2xYS1VTV285TUoxNWEzS3JFUDJsb09yMk9qaHc2aVc2aGYyQkRkRWNjUXZaR3BhQXk3WW92U3dxOGtyN0hHbGx4cGQ3MXJrUzZHMFNmMTFzbDlPdk1LMStqd1BQT0R4alV3a09pbTlDVTNpeDF3TmpYRGZtSlNFbjYxOEJzNmxwV3dVcFUrOFBDcUxNWTY1MHpqcThWaENJUDE3TkVLVHgzZWFMTCtzNVBpNnlKV2FXalRITFIxall6UFNWOVZGLzZPamRiLzFrTzNNazN1aEhDMHg2Z2MxQmpsS1ErblFGeFRZZGFKa1o3eVNWeExCYmhSMWRzYm9OWHAxdENZS1cyTFJhRXpwWWNJeDJCS054YUwwWmFVblNxZkZvaU5oSEtSL0drWDZQV1VTQWFKZWxRYXFaTDFFcG9ITnNhalNFeVBTb0o5SWpoSXhUZGpITG13WnZoUkRPaUZUWS9ZZVFudnJWWm1pVFF0R25jRUNYdEZUQlpMT1Z3d01SZ29YSEFrWHpNelBuMW5BSko4allTYk1EYXFOMndhR0x6TmhpaC9iWnluVUJNcElXU2c3VllpN0RSeDJtOEFMa0lkUkNKd0k2QXJKeDJFSThrYURXZVRRS2VBRms5ZmpsLzFBdndrdGpRMVA3Tmp5TUdReWZkNHZqaXBYNk0vaTUyRDdDcTgwa3FsY3hFY0dYUnIvRkVjZ3MwdTV1R2dCNFZXdU1GZnBkbjJSZTZIaTNQcXpteFdLc3o2K2FlMlBuOWhYWHcvZnFNODU5VWlHQzBvS1lZSUxKQnFKcnNuMVoxRTVxT3M5clFDaVVRUlJFam04eUpjYkhGNWNVSnVmWDF2QUhsZWZ3MFhnVW9ib1MzRVRmUWxUeEJDNFNPdHVFOFZQUkpUQlNDUVNqWkNwazdHcXp1K21hc2FaMnk3WmplaGhvNEYzZzgyQk5Ea0FIcE9SRzQrT0NTK2Y2SlRQbXRSbi9QSDFrY2g2ZDA0c3A3QVFiMjVhUS9wcVV5WGVROHZyZWJHOE9ZUWRYT1ErNTg1dTBzZFc5cnFhbHpSVVJpSis5RjRNd2VSRnJLVWpsMUdVWWhIMUEyN1dPSHc1Y1RGU0ZQTW85RWVVSUduUVRaSElhSjdBSExhT0tzT09EYU5GOWprQmpZRzJRRXNRMnhqTVVBeDJiQkViZVRCV01Id3NrQmpuZ3E1NlMveWZna0JuV0JhNEs5c3FLdHEydDFVSThTOUhlNVh1QlJiYXdBZGF0clFFQWkzMEFrczIrTE04V2VDYmFsVlprV055bHZKK2RxSm56VmIrT0hsU29LVzhuUENQN1JkK0NjWjJEZFdBR3FKMkNCRk9waGd5d0ZGQ0ZCTnRmQWJHdE5QQkN3eHZ5Z0hlWU1aTVk5WmJvQnF3cS9wVnJzYmdONXRrdjE1Mk9EbGJNZmlxd0dNQmd4YTRFeHozUWhvdlJJVXA2YWNxWm1RelJxMHlwRFhTMlRQTFQwMllJa1FFVG5PRTQ0NW9PR3hPbVhBcVVKTk5HN1hndXBNalBxMnVhOWFzcmo1eVkveXVLdGVPMUt4MFlOSlR1ZnJpckxlMW1abmF0N09MNnJuVWRDV2VucFc2SThtQW5ic1k4S1dzMVB1U292Q1c5QS9aMjVQUTI0YTdjTk9xZ21Ua0xtQk1naDRUSGdjNGI5azJJVnYxL2cvRjVuR2xqd1BMZk9nSEF6SnpoNDVWLzQrV2VuVHptTXRSNVo3dXMyVHlzOTA5VUhxclBZN0tiY2tveFJ2UkhobVZjM2NKR0U5N3VtbDBSMVMwamRVTFZsN0V2WnRERlZCRjM1TjljRWRqcGdtQWlPbEZaK0R0b2g5MytEM3p6SHI4UlJOWlFobkNOTU5iY2VnT3ZwRXdab0wrMDZjSlEwN2grdGgzZlovN1BWYlZDNm5nVEFWL0tvTEZ1TzYrMktGY1U2NTFnRWI1dWdQU0liMUQrWHA4VjQrazNzRUlHbnc1bVllNElmNGsxbEZZcjZTQ3ptTTJFUThpV3Rtd2puQkk5a1R3ZTFUbGZBbVhoN0gwMmJ5OWZXMmdzakt3dHYwYWFVUktpbDRPZFY3ckRMMU1YSUZOcmhkeG9oY1pYWVRucTQ3V2lzcktpdGFPYmJmNSt5dmtMaTVKNmxDTlpaK0I2R0MzOFZOQlpCRGlkU1MvK21Tdmg2cytzcmdDOHB5S012RHR0K2RlM2M5ZlU3NlpQZnVNOHVkNEt2MGZ5UC9McWZlcE1ULzNvWnhTcXBaYVRhMURhUVlMWThURnNIWWJXWXNQb1JoUldmTDVlU1NRYmhVR2dHQzNZTGJWTWs2UGl0VEZOR3BBc05yQzZEMVZOQktnQkhNZWphaXVSV0VXR2dzU0RCVEpqcVdJbDhrSkxsc2FMSjJ0WERyNnhHZlQ4NWJNMlEwNmE0NngySFRndmRuVjh6NVlEeS8yN0o0enQ2eDJWdGt6am9ZcGtxMzZrYUJyNGVRU2c3dHlpVndlV3ViWFp1Z3RhZGw1OHlkYXBmYk9SZktzRFR1WjBPQmd4NGNmZGpDZjV0YldOSVRuTDEyMGZkT2kxUlYxQzN1S0d6TmR3WUxjTXZaM0J4b1B5VE9DRDFYdlhUcDdVMTBnV0NWbVRWOWIzcjJ6MFNrR1dvdmIyaHA5STg5TzhhMnNtbHlhTzhtdU1VK2RSbXR6cDYwSXpBb0ZwakxyMW4zODhib0x5ZjBkUnZ4aHNIWjBxYldxRGt3cXZ2cGtqNGwwZlk2RUlYUmk1c1FTckF2c1ZZd1hSeTRxSjJFVnREMUFON2EwSFd0aDl5bXZMMXhjM1dUVUtLL1RBSEEvYlhEVnRWV2ZPTWZ1R3hHWnY0TG4valZyOWpjM2oxeU12MHRuZG15dDlWcTg4WTlnSDF3dExYM0tXam90NSsraldIZ0FvWlprUTE0d0dRMjBGbGk3MVVtS0pBeTR4S01TVEdiVmR5Ylc3RkREQXV0OVhwRDVBeldyWU83elE4cWZmcUY4K1luZC9jbHJIY2R5eEd5M2EvMyttZk5uekMvY0JzdmVUam5UdlhmMW82dnpPbFp3N1d0cXRkbVBLL0VycnovNk5OdEQ3MnptTk9aZmJtWWRUR0hmb29mcUk3OU9jK1IybjFscm5MNnBPbTBVcDdrd3hoVFcxMkFtbTdXWWtYUjJxWXJGMkFtZ21iQXN4Wmp3eTF4cGcvbTFKZTJ2cnA4di9uejJ4cG1sQmc0RTlock1VMzQxd1ZwVE9oL09mbUd2QW5yYThxNnVjdHI2MFpRSFYzUStXTVFKeWtNajhac1duMlFCT21tSE1CK201cERJcFRGb25ZaWdpYUtBaEdFaUFIRjdFbGlWblFram9MVklNUHRKcEJLSFlkM0E4R1lIOWpKenJXd21IeDVRanA3dkRBWDBzdUdSeW0xdnRtLzlXMS9IeVI4dmN6Zk1zNlNrOERTdjg1NS81ZGxYOW9RcTUyaFQ4c3l5cDJyeDVJZDE3SUF5QU0zd0lqUVBNT0h6eXRFQjY0cTZENXpUOTF5TmJueDNWL25xbmQwMTdTOVkwNjA1azNpem9YTHBzeGRlMm4zOHlvT1Y5czFMY2p3ek5qYmRYNmFzbkJWYUJqLzYvRHdLd1BrcGNxYkRHN0Juc1hvU3FXblVBbW90dFlGNmpNU2RWeVlaaDN6VlhDandUaXd3SEg2c0d1UmlFSFFHenVSWDZ3aFprcDEyM295MUJXRTJtRWZKL3R2SVJ0TTRaTTViRFhpTXNQTWFBS09UeWM1dUw1N3JxeXljNXk1SkU1cG0xaTJTMmlVWDBDY2FRNmxDNlpvZzdKcVNxWm1ZbG9zbDJLNnB3TkE4NHpSblFXNlNhQUxZWlFHVzVsaEN0VS9XMzRONm8rYktmWjhjZjMvQ2wvK2lUWDN3QnpwT1k0bVJrZU5mM3JwdHljR1NzaFFXZ0diWXQ1akZjMmUwK0RnbElyd2w2RFZXUTdCdXdhSjNYazFKNFZMNXVybkxsL1dmK2dIVS9oWm9aZEtOeW02bEcrSTM0RmFOZVpLY1NwSklvMkllQ1Z2cGRzREdmS3Z6Sm5Bd21lRDM3T3c2NVpXd1Nvd3Bnd1g1VDY5cy9yQjU1ZFA1QmNwZ0RLRlY4cDdxMnNuLzF1YzkzYlZ6VC93NlVyQ3FEVFd2ZkNxL29DRC9xWlhOb1VqOEJMNUtwNkdVMDE3ZnJmTlhrQXRpaXlmL1NPQ0VlTHFuZDhSL1FsOUdsQ1JmY3RTNms1Y2h2SUJ1UTF6Q0Nqb0NITDJESE5ISVh4TUoza1FlTzhsYnNVWE9OZVNmQTVFamNHNi9FK0tkaE40YlAwNHZCaGRpODgzK0JGQnpRYnhGYnZaelFlWTlMTkJaYzBGTmZuNU53ZkRuNnJDVG5UdzZSOG8rZ2ZwZjVoQ29tMzNjUnVpVGxzczNLSG1aakQrQlBOKzVnWHVBMnppUy9RNzNtTHhVa3BiS04vZXF3ejV1SzBYOUYzaDJkMVY0bkdOZ1pHQmdBT0pkNzc2K2l1ZTMrY3JBemM0QUFqZTVCZmNnMHh6OVlIRU9CaVlRQlFBOEZRbEZBSGljWTJCa1lHQm5BQUdPUGdhRy8vODUraGtZR1ZDQk1nQkdHd05ZQUFBQWVKeGpZR0JnWUI4RW1LT1BnUUVBUTA0QmZnQUFBQUFBQUE0QWFBQitBTXdBNEFFQ0FVSUJiQUdZQWNJQ0dBSllBclFDNEFNd0E3QUQzZ1F3QkpZRTNBVWtCV1lGaWdZZ0JtWUd0QWJxQjFnSUVnaFlDRzRJaEFpMkNPaDRuR05nWkdCZ1VHWW9aV0JuQUFFbUlPWUNRZ2FHLzJBK0F3QVlDUUcyQUhpY1haQk5hb05BR0laZkU1UFFDS0ZRMmxVcHMyb1hCZk96ekFFU3lES0JRSmRHUjJOUVIzUVNTRS9RRS9RRVBVVVBVSHFzdnNyWGpUTXc4M3pQdlBNTkN1QVdQM0RRREFlamRtMUdqendTN3BNbXdpNzVYbmdBRDQvQ1Evb1g0VEZlNFF0N3VNTWJPemp1RGMwRW1YQ1AvQzdjSjM4SXUrUlA0UUVlOENVOHBQOFdIbU9QWDJFUHo4N1RQbzIwMmV5Mk9qbG5RU1hWLzZhck9qV0ZtdnN6TVd0ZDZDcXdPbEtIcTZvdnljTGFXTVdWeWRYS0ZGWm5tVkZsWlU0NnRQN1Iybkk1bmNiaS9kRGtmRHRGQkEyRERYYllraEtjK1YwQnFzNVp0OUpNMUhRR0JSVG0vRWV6VG1aTkt0cGNBTXM5WXU2QUs5Y2FGNzZ6b0xXSVdjZk1HT1NrVmR1dlNXZWNocVpzejA0MEliMlBZM3VyeEJKVHpyaVQ5NWxpcHorVE4xZm1BQUFBZUp4dGtNbDJ3akFNUmZPQWhBQmxLbTJoODBDMythamdDS0tEWTZjZWdQNTlUWUJ6dWtBTCt6MVpzcThjdGFKVFRLUHJzVVFMYlhRUUkwRVhLWHJvWTRBYkRESENHQk5NY1lzWjduQ1BCOHl4d0NPZThJd1h2T0lONy9qQUo3Nnd4SGZVcVdYK096Z3VtV0FqSk1WMTdpME5kbHI2aXJMS08rcWZ0ZFQ3aTZ5NHVGU1V2Q2tuYXkrbEZZWklaYVFjbWZIL3hJRmRZbjk4YnFocmExYUtUTS82bFdNbnlhWWlyeDFyRlVRWkZCa2IyekpVdG9YZUpDZWcwV25MdEhlU0ZjM090cm5vek53cWkwVGtTcEJNREIxblNkZTVvSlhXMjNoVFMyL1QwTGlsZ2xYWDdkbUZWeExucTVVMHZZQVRIRmszelgzQk9pc29RSE5ERkRlWm5xS0R5OWhSTmF3TjdWaDcyN2hGemNKNWM4VElMcktaZkg3dElQeEFGUDBCcExlSlBBPT0pIGZvcm1hdChcIndvZmZcIik7XG4gIGZvbnQtd2VpZ2h0OiBub3JtYWw7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbn1cbi52anMtaWNvbi1wbGF5LCAudmlkZW8tanMgLnZqcy1wbGF5LWNvbnRyb2wgLnZqcy1pY29uLXBsYWNlaG9sZGVyLCAudmlkZW8tanMgLnZqcy1iaWctcGxheS1idXR0b24gLnZqcy1pY29uLXBsYWNlaG9sZGVyOmJlZm9yZSB7XG4gIGZvbnQtZmFtaWx5OiBWaWRlb0pTO1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG59XG4udmpzLWljb24tcGxheTpiZWZvcmUsIC52aWRlby1qcyAudmpzLXBsYXktY29udHJvbCAudmpzLWljb24tcGxhY2Vob2xkZXI6YmVmb3JlLCAudmlkZW8tanMgLnZqcy1iaWctcGxheS1idXR0b24gLnZqcy1pY29uLXBsYWNlaG9sZGVyOmJlZm9yZSB7XG4gIGNvbnRlbnQ6IFwiXFxmMTAxXCI7XG59XG5cbi52anMtaWNvbi1wbGF5LWNpcmNsZSB7XG4gIGZvbnQtZmFtaWx5OiBWaWRlb0pTO1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG59XG4udmpzLWljb24tcGxheS1jaXJjbGU6YmVmb3JlIHtcbiAgY29udGVudDogXCJcXGYxMDJcIjtcbn1cblxuLnZqcy1pY29uLXBhdXNlLCAudmlkZW8tanMgLnZqcy1wbGF5LWNvbnRyb2wudmpzLXBsYXlpbmcgLnZqcy1pY29uLXBsYWNlaG9sZGVyIHtcbiAgZm9udC1mYW1pbHk6IFZpZGVvSlM7XG4gIGZvbnQtd2VpZ2h0OiBub3JtYWw7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbn1cbi52anMtaWNvbi1wYXVzZTpiZWZvcmUsIC52aWRlby1qcyAudmpzLXBsYXktY29udHJvbC52anMtcGxheWluZyAudmpzLWljb24tcGxhY2Vob2xkZXI6YmVmb3JlIHtcbiAgY29udGVudDogXCJcXGYxMDNcIjtcbn1cblxuLnZqcy1pY29uLXZvbHVtZS1tdXRlLCAudmlkZW8tanMgLnZqcy1tdXRlLWNvbnRyb2wudmpzLXZvbC0wIC52anMtaWNvbi1wbGFjZWhvbGRlciB7XG4gIGZvbnQtZmFtaWx5OiBWaWRlb0pTO1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG59XG4udmpzLWljb24tdm9sdW1lLW11dGU6YmVmb3JlLCAudmlkZW8tanMgLnZqcy1tdXRlLWNvbnRyb2wudmpzLXZvbC0wIC52anMtaWNvbi1wbGFjZWhvbGRlcjpiZWZvcmUge1xuICBjb250ZW50OiBcIlxcZjEwNFwiO1xufVxuXG4udmpzLWljb24tdm9sdW1lLWxvdywgLnZpZGVvLWpzIC52anMtbXV0ZS1jb250cm9sLnZqcy12b2wtMSAudmpzLWljb24tcGxhY2Vob2xkZXIge1xuICBmb250LWZhbWlseTogVmlkZW9KUztcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xufVxuLnZqcy1pY29uLXZvbHVtZS1sb3c6YmVmb3JlLCAudmlkZW8tanMgLnZqcy1tdXRlLWNvbnRyb2wudmpzLXZvbC0xIC52anMtaWNvbi1wbGFjZWhvbGRlcjpiZWZvcmUge1xuICBjb250ZW50OiBcIlxcZjEwNVwiO1xufVxuXG4udmpzLWljb24tdm9sdW1lLW1pZCwgLnZpZGVvLWpzIC52anMtbXV0ZS1jb250cm9sLnZqcy12b2wtMiAudmpzLWljb24tcGxhY2Vob2xkZXIge1xuICBmb250LWZhbWlseTogVmlkZW9KUztcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xufVxuLnZqcy1pY29uLXZvbHVtZS1taWQ6YmVmb3JlLCAudmlkZW8tanMgLnZqcy1tdXRlLWNvbnRyb2wudmpzLXZvbC0yIC52anMtaWNvbi1wbGFjZWhvbGRlcjpiZWZvcmUge1xuICBjb250ZW50OiBcIlxcZjEwNlwiO1xufVxuXG4udmpzLWljb24tdm9sdW1lLWhpZ2gsIC52aWRlby1qcyAudmpzLW11dGUtY29udHJvbCAudmpzLWljb24tcGxhY2Vob2xkZXIge1xuICBmb250LWZhbWlseTogVmlkZW9KUztcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xufVxuLnZqcy1pY29uLXZvbHVtZS1oaWdoOmJlZm9yZSwgLnZpZGVvLWpzIC52anMtbXV0ZS1jb250cm9sIC52anMtaWNvbi1wbGFjZWhvbGRlcjpiZWZvcmUge1xuICBjb250ZW50OiBcIlxcZjEwN1wiO1xufVxuXG4udmpzLWljb24tZnVsbHNjcmVlbi1lbnRlciwgLnZpZGVvLWpzIC52anMtZnVsbHNjcmVlbi1jb250cm9sIC52anMtaWNvbi1wbGFjZWhvbGRlciB7XG4gIGZvbnQtZmFtaWx5OiBWaWRlb0pTO1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG59XG4udmpzLWljb24tZnVsbHNjcmVlbi1lbnRlcjpiZWZvcmUsIC52aWRlby1qcyAudmpzLWZ1bGxzY3JlZW4tY29udHJvbCAudmpzLWljb24tcGxhY2Vob2xkZXI6YmVmb3JlIHtcbiAgY29udGVudDogXCJcXGYxMDhcIjtcbn1cblxuLnZqcy1pY29uLWZ1bGxzY3JlZW4tZXhpdCwgLnZpZGVvLWpzLnZqcy1mdWxsc2NyZWVuIC52anMtZnVsbHNjcmVlbi1jb250cm9sIC52anMtaWNvbi1wbGFjZWhvbGRlciB7XG4gIGZvbnQtZmFtaWx5OiBWaWRlb0pTO1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG59XG4udmpzLWljb24tZnVsbHNjcmVlbi1leGl0OmJlZm9yZSwgLnZpZGVvLWpzLnZqcy1mdWxsc2NyZWVuIC52anMtZnVsbHNjcmVlbi1jb250cm9sIC52anMtaWNvbi1wbGFjZWhvbGRlcjpiZWZvcmUge1xuICBjb250ZW50OiBcIlxcZjEwOVwiO1xufVxuXG4udmpzLWljb24tc3F1YXJlIHtcbiAgZm9udC1mYW1pbHk6IFZpZGVvSlM7XG4gIGZvbnQtd2VpZ2h0OiBub3JtYWw7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbn1cbi52anMtaWNvbi1zcXVhcmU6YmVmb3JlIHtcbiAgY29udGVudDogXCJcXGYxMGFcIjtcbn1cblxuLnZqcy1pY29uLXNwaW5uZXIge1xuICBmb250LWZhbWlseTogVmlkZW9KUztcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xufVxuLnZqcy1pY29uLXNwaW5uZXI6YmVmb3JlIHtcbiAgY29udGVudDogXCJcXGYxMGJcIjtcbn1cblxuLnZqcy1pY29uLXN1YnRpdGxlcywgLnZpZGVvLWpzIC52anMtc3Vicy1jYXBzLWJ1dHRvbiAudmpzLWljb24tcGxhY2Vob2xkZXIsXG4udmlkZW8tanMudmlkZW8tanM6bGFuZyhlbi1HQikgLnZqcy1zdWJzLWNhcHMtYnV0dG9uIC52anMtaWNvbi1wbGFjZWhvbGRlcixcbi52aWRlby1qcy52aWRlby1qczpsYW5nKGVuLUlFKSAudmpzLXN1YnMtY2Fwcy1idXR0b24gLnZqcy1pY29uLXBsYWNlaG9sZGVyLFxuLnZpZGVvLWpzLnZpZGVvLWpzOmxhbmcoZW4tQVUpIC52anMtc3Vicy1jYXBzLWJ1dHRvbiAudmpzLWljb24tcGxhY2Vob2xkZXIsXG4udmlkZW8tanMudmlkZW8tanM6bGFuZyhlbi1OWikgLnZqcy1zdWJzLWNhcHMtYnV0dG9uIC52anMtaWNvbi1wbGFjZWhvbGRlciwgLnZpZGVvLWpzIC52anMtc3VidGl0bGVzLWJ1dHRvbiAudmpzLWljb24tcGxhY2Vob2xkZXIge1xuICBmb250LWZhbWlseTogVmlkZW9KUztcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xufVxuLnZqcy1pY29uLXN1YnRpdGxlczpiZWZvcmUsIC52aWRlby1qcyAudmpzLXN1YnMtY2Fwcy1idXR0b24gLnZqcy1pY29uLXBsYWNlaG9sZGVyOmJlZm9yZSxcbi52aWRlby1qcy52aWRlby1qczpsYW5nKGVuLUdCKSAudmpzLXN1YnMtY2Fwcy1idXR0b24gLnZqcy1pY29uLXBsYWNlaG9sZGVyOmJlZm9yZSxcbi52aWRlby1qcy52aWRlby1qczpsYW5nKGVuLUlFKSAudmpzLXN1YnMtY2Fwcy1idXR0b24gLnZqcy1pY29uLXBsYWNlaG9sZGVyOmJlZm9yZSxcbi52aWRlby1qcy52aWRlby1qczpsYW5nKGVuLUFVKSAudmpzLXN1YnMtY2Fwcy1idXR0b24gLnZqcy1pY29uLXBsYWNlaG9sZGVyOmJlZm9yZSxcbi52aWRlby1qcy52aWRlby1qczpsYW5nKGVuLU5aKSAudmpzLXN1YnMtY2Fwcy1idXR0b24gLnZqcy1pY29uLXBsYWNlaG9sZGVyOmJlZm9yZSwgLnZpZGVvLWpzIC52anMtc3VidGl0bGVzLWJ1dHRvbiAudmpzLWljb24tcGxhY2Vob2xkZXI6YmVmb3JlIHtcbiAgY29udGVudDogXCJcXGYxMGNcIjtcbn1cblxuLnZqcy1pY29uLWNhcHRpb25zLCAudmlkZW8tanM6bGFuZyhlbikgLnZqcy1zdWJzLWNhcHMtYnV0dG9uIC52anMtaWNvbi1wbGFjZWhvbGRlcixcbi52aWRlby1qczpsYW5nKGZyLUNBKSAudmpzLXN1YnMtY2Fwcy1idXR0b24gLnZqcy1pY29uLXBsYWNlaG9sZGVyLCAudmlkZW8tanMgLnZqcy1jYXB0aW9ucy1idXR0b24gLnZqcy1pY29uLXBsYWNlaG9sZGVyIHtcbiAgZm9udC1mYW1pbHk6IFZpZGVvSlM7XG4gIGZvbnQtd2VpZ2h0OiBub3JtYWw7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbn1cbi52anMtaWNvbi1jYXB0aW9uczpiZWZvcmUsIC52aWRlby1qczpsYW5nKGVuKSAudmpzLXN1YnMtY2Fwcy1idXR0b24gLnZqcy1pY29uLXBsYWNlaG9sZGVyOmJlZm9yZSxcbi52aWRlby1qczpsYW5nKGZyLUNBKSAudmpzLXN1YnMtY2Fwcy1idXR0b24gLnZqcy1pY29uLXBsYWNlaG9sZGVyOmJlZm9yZSwgLnZpZGVvLWpzIC52anMtY2FwdGlvbnMtYnV0dG9uIC52anMtaWNvbi1wbGFjZWhvbGRlcjpiZWZvcmUge1xuICBjb250ZW50OiBcIlxcZjEwZFwiO1xufVxuXG4udmpzLWljb24tY2hhcHRlcnMsIC52aWRlby1qcyAudmpzLWNoYXB0ZXJzLWJ1dHRvbiAudmpzLWljb24tcGxhY2Vob2xkZXIge1xuICBmb250LWZhbWlseTogVmlkZW9KUztcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xufVxuLnZqcy1pY29uLWNoYXB0ZXJzOmJlZm9yZSwgLnZpZGVvLWpzIC52anMtY2hhcHRlcnMtYnV0dG9uIC52anMtaWNvbi1wbGFjZWhvbGRlcjpiZWZvcmUge1xuICBjb250ZW50OiBcIlxcZjEwZVwiO1xufVxuXG4udmpzLWljb24tc2hhcmUge1xuICBmb250LWZhbWlseTogVmlkZW9KUztcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xufVxuLnZqcy1pY29uLXNoYXJlOmJlZm9yZSB7XG4gIGNvbnRlbnQ6IFwiXFxmMTBmXCI7XG59XG5cbi52anMtaWNvbi1jb2cge1xuICBmb250LWZhbWlseTogVmlkZW9KUztcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xufVxuLnZqcy1pY29uLWNvZzpiZWZvcmUge1xuICBjb250ZW50OiBcIlxcZjExMFwiO1xufVxuXG4udmpzLWljb24tY2lyY2xlLCAudmpzLXNlZWstdG8tbGl2ZS1jb250cm9sIC52anMtaWNvbi1wbGFjZWhvbGRlciwgLnZpZGVvLWpzIC52anMtdm9sdW1lLWxldmVsLCAudmlkZW8tanMgLnZqcy1wbGF5LXByb2dyZXNzIHtcbiAgZm9udC1mYW1pbHk6IFZpZGVvSlM7XG4gIGZvbnQtd2VpZ2h0OiBub3JtYWw7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbn1cbi52anMtaWNvbi1jaXJjbGU6YmVmb3JlLCAudmpzLXNlZWstdG8tbGl2ZS1jb250cm9sIC52anMtaWNvbi1wbGFjZWhvbGRlcjpiZWZvcmUsIC52aWRlby1qcyAudmpzLXZvbHVtZS1sZXZlbDpiZWZvcmUsIC52aWRlby1qcyAudmpzLXBsYXktcHJvZ3Jlc3M6YmVmb3JlIHtcbiAgY29udGVudDogXCJcXGYxMTFcIjtcbn1cblxuLnZqcy1pY29uLWNpcmNsZS1vdXRsaW5lIHtcbiAgZm9udC1mYW1pbHk6IFZpZGVvSlM7XG4gIGZvbnQtd2VpZ2h0OiBub3JtYWw7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbn1cbi52anMtaWNvbi1jaXJjbGUtb3V0bGluZTpiZWZvcmUge1xuICBjb250ZW50OiBcIlxcZjExMlwiO1xufVxuXG4udmpzLWljb24tY2lyY2xlLWlubmVyLWNpcmNsZSB7XG4gIGZvbnQtZmFtaWx5OiBWaWRlb0pTO1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG59XG4udmpzLWljb24tY2lyY2xlLWlubmVyLWNpcmNsZTpiZWZvcmUge1xuICBjb250ZW50OiBcIlxcZjExM1wiO1xufVxuXG4udmpzLWljb24taGQge1xuICBmb250LWZhbWlseTogVmlkZW9KUztcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xufVxuLnZqcy1pY29uLWhkOmJlZm9yZSB7XG4gIGNvbnRlbnQ6IFwiXFxmMTE0XCI7XG59XG5cbi52anMtaWNvbi1jYW5jZWwsIC52aWRlby1qcyAudmpzLWNvbnRyb2wudmpzLWNsb3NlLWJ1dHRvbiAudmpzLWljb24tcGxhY2Vob2xkZXIge1xuICBmb250LWZhbWlseTogVmlkZW9KUztcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xufVxuLnZqcy1pY29uLWNhbmNlbDpiZWZvcmUsIC52aWRlby1qcyAudmpzLWNvbnRyb2wudmpzLWNsb3NlLWJ1dHRvbiAudmpzLWljb24tcGxhY2Vob2xkZXI6YmVmb3JlIHtcbiAgY29udGVudDogXCJcXGYxMTVcIjtcbn1cblxuLnZqcy1pY29uLXJlcGxheSwgLnZpZGVvLWpzIC52anMtcGxheS1jb250cm9sLnZqcy1lbmRlZCAudmpzLWljb24tcGxhY2Vob2xkZXIge1xuICBmb250LWZhbWlseTogVmlkZW9KUztcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xufVxuLnZqcy1pY29uLXJlcGxheTpiZWZvcmUsIC52aWRlby1qcyAudmpzLXBsYXktY29udHJvbC52anMtZW5kZWQgLnZqcy1pY29uLXBsYWNlaG9sZGVyOmJlZm9yZSB7XG4gIGNvbnRlbnQ6IFwiXFxmMTE2XCI7XG59XG5cbi52anMtaWNvbi1mYWNlYm9vayB7XG4gIGZvbnQtZmFtaWx5OiBWaWRlb0pTO1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG59XG4udmpzLWljb24tZmFjZWJvb2s6YmVmb3JlIHtcbiAgY29udGVudDogXCJcXGYxMTdcIjtcbn1cblxuLnZqcy1pY29uLWdwbHVzIHtcbiAgZm9udC1mYW1pbHk6IFZpZGVvSlM7XG4gIGZvbnQtd2VpZ2h0OiBub3JtYWw7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbn1cbi52anMtaWNvbi1ncGx1czpiZWZvcmUge1xuICBjb250ZW50OiBcIlxcZjExOFwiO1xufVxuXG4udmpzLWljb24tbGlua2VkaW4ge1xuICBmb250LWZhbWlseTogVmlkZW9KUztcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xufVxuLnZqcy1pY29uLWxpbmtlZGluOmJlZm9yZSB7XG4gIGNvbnRlbnQ6IFwiXFxmMTE5XCI7XG59XG5cbi52anMtaWNvbi10d2l0dGVyIHtcbiAgZm9udC1mYW1pbHk6IFZpZGVvSlM7XG4gIGZvbnQtd2VpZ2h0OiBub3JtYWw7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbn1cbi52anMtaWNvbi10d2l0dGVyOmJlZm9yZSB7XG4gIGNvbnRlbnQ6IFwiXFxmMTFhXCI7XG59XG5cbi52anMtaWNvbi10dW1ibHIge1xuICBmb250LWZhbWlseTogVmlkZW9KUztcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xufVxuLnZqcy1pY29uLXR1bWJscjpiZWZvcmUge1xuICBjb250ZW50OiBcIlxcZjExYlwiO1xufVxuXG4udmpzLWljb24tcGludGVyZXN0IHtcbiAgZm9udC1mYW1pbHk6IFZpZGVvSlM7XG4gIGZvbnQtd2VpZ2h0OiBub3JtYWw7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbn1cbi52anMtaWNvbi1waW50ZXJlc3Q6YmVmb3JlIHtcbiAgY29udGVudDogXCJcXGYxMWNcIjtcbn1cblxuLnZqcy1pY29uLWF1ZGlvLWRlc2NyaXB0aW9uLCAudmlkZW8tanMgLnZqcy1kZXNjcmlwdGlvbnMtYnV0dG9uIC52anMtaWNvbi1wbGFjZWhvbGRlciB7XG4gIGZvbnQtZmFtaWx5OiBWaWRlb0pTO1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG59XG4udmpzLWljb24tYXVkaW8tZGVzY3JpcHRpb246YmVmb3JlLCAudmlkZW8tanMgLnZqcy1kZXNjcmlwdGlvbnMtYnV0dG9uIC52anMtaWNvbi1wbGFjZWhvbGRlcjpiZWZvcmUge1xuICBjb250ZW50OiBcIlxcZjExZFwiO1xufVxuXG4udmpzLWljb24tYXVkaW8sIC52aWRlby1qcyAudmpzLWF1ZGlvLWJ1dHRvbiAudmpzLWljb24tcGxhY2Vob2xkZXIge1xuICBmb250LWZhbWlseTogVmlkZW9KUztcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xufVxuLnZqcy1pY29uLWF1ZGlvOmJlZm9yZSwgLnZpZGVvLWpzIC52anMtYXVkaW8tYnV0dG9uIC52anMtaWNvbi1wbGFjZWhvbGRlcjpiZWZvcmUge1xuICBjb250ZW50OiBcIlxcZjExZVwiO1xufVxuXG4udmpzLWljb24tbmV4dC1pdGVtIHtcbiAgZm9udC1mYW1pbHk6IFZpZGVvSlM7XG4gIGZvbnQtd2VpZ2h0OiBub3JtYWw7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbn1cbi52anMtaWNvbi1uZXh0LWl0ZW06YmVmb3JlIHtcbiAgY29udGVudDogXCJcXGYxMWZcIjtcbn1cblxuLnZqcy1pY29uLXByZXZpb3VzLWl0ZW0ge1xuICBmb250LWZhbWlseTogVmlkZW9KUztcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xufVxuLnZqcy1pY29uLXByZXZpb3VzLWl0ZW06YmVmb3JlIHtcbiAgY29udGVudDogXCJcXGYxMjBcIjtcbn1cblxuLnZqcy1pY29uLXBpY3R1cmUtaW4tcGljdHVyZS1lbnRlciwgLnZpZGVvLWpzIC52anMtcGljdHVyZS1pbi1waWN0dXJlLWNvbnRyb2wgLnZqcy1pY29uLXBsYWNlaG9sZGVyIHtcbiAgZm9udC1mYW1pbHk6IFZpZGVvSlM7XG4gIGZvbnQtd2VpZ2h0OiBub3JtYWw7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbn1cbi52anMtaWNvbi1waWN0dXJlLWluLXBpY3R1cmUtZW50ZXI6YmVmb3JlLCAudmlkZW8tanMgLnZqcy1waWN0dXJlLWluLXBpY3R1cmUtY29udHJvbCAudmpzLWljb24tcGxhY2Vob2xkZXI6YmVmb3JlIHtcbiAgY29udGVudDogXCJcXGYxMjFcIjtcbn1cblxuLnZqcy1pY29uLXBpY3R1cmUtaW4tcGljdHVyZS1leGl0LCAudmlkZW8tanMudmpzLXBpY3R1cmUtaW4tcGljdHVyZSAudmpzLXBpY3R1cmUtaW4tcGljdHVyZS1jb250cm9sIC52anMtaWNvbi1wbGFjZWhvbGRlciB7XG4gIGZvbnQtZmFtaWx5OiBWaWRlb0pTO1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG59XG4udmpzLWljb24tcGljdHVyZS1pbi1waWN0dXJlLWV4aXQ6YmVmb3JlLCAudmlkZW8tanMudmpzLXBpY3R1cmUtaW4tcGljdHVyZSAudmpzLXBpY3R1cmUtaW4tcGljdHVyZS1jb250cm9sIC52anMtaWNvbi1wbGFjZWhvbGRlcjpiZWZvcmUge1xuICBjb250ZW50OiBcIlxcZjEyMlwiO1xufVxuXG4udmlkZW8tanMge1xuICBkaXNwbGF5OiBibG9jaztcbiAgdmVydGljYWwtYWxpZ246IHRvcDtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgY29sb3I6ICNmZmY7XG4gIGJhY2tncm91bmQtY29sb3I6ICMwMDA7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgcGFkZGluZzogMDtcbiAgZm9udC1zaXplOiAxMHB4O1xuICBsaW5lLWhlaWdodDogMTtcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LWZhbWlseTogQXJpYWwsIEhlbHZldGljYSwgc2Fucy1zZXJpZjtcbiAgd29yZC1icmVhazogaW5pdGlhbDtcbn1cbi52aWRlby1qczotbW96LWZ1bGwtc2NyZWVuIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xufVxuLnZpZGVvLWpzOi13ZWJraXQtZnVsbC1zY3JlZW4ge1xuICB3aWR0aDogMTAwJSAhaW1wb3J0YW50O1xuICBoZWlnaHQ6IDEwMCUgIWltcG9ydGFudDtcbn1cblxuLnZpZGVvLWpzW3RhYmluZGV4PVwiLTFcIl0ge1xuICBvdXRsaW5lOiBub25lO1xufVxuXG4udmlkZW8tanMgKixcbi52aWRlby1qcyAqOmJlZm9yZSxcbi52aWRlby1qcyAqOmFmdGVyIHtcbiAgYm94LXNpemluZzogaW5oZXJpdDtcbn1cblxuLnZpZGVvLWpzIHVsIHtcbiAgZm9udC1mYW1pbHk6IGluaGVyaXQ7XG4gIGZvbnQtc2l6ZTogaW5oZXJpdDtcbiAgbGluZS1oZWlnaHQ6IGluaGVyaXQ7XG4gIGxpc3Qtc3R5bGUtcG9zaXRpb246IG91dHNpZGU7XG4gIG1hcmdpbi1sZWZ0OiAwO1xuICBtYXJnaW4tcmlnaHQ6IDA7XG4gIG1hcmdpbi10b3A6IDA7XG4gIG1hcmdpbi1ib3R0b206IDA7XG59XG5cbi52aWRlby1qcy52anMtZmx1aWQsXG4udmlkZW8tanMudmpzLTE2LTksXG4udmlkZW8tanMudmpzLTQtMyxcbi52aWRlby1qcy52anMtOS0xNixcbi52aWRlby1qcy52anMtMS0xIHtcbiAgd2lkdGg6IDEwMCU7XG4gIG1heC13aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAwO1xufVxuXG4udmlkZW8tanMudmpzLTE2LTkge1xuICBwYWRkaW5nLXRvcDogNTYuMjUlO1xufVxuXG4udmlkZW8tanMudmpzLTQtMyB7XG4gIHBhZGRpbmctdG9wOiA3NSU7XG59XG5cbi52aWRlby1qcy52anMtOS0xNiB7XG4gIHBhZGRpbmctdG9wOiAxNzcuNzc3Nzc3Nzc3OCU7XG59XG5cbi52aWRlby1qcy52anMtMS0xIHtcbiAgcGFkZGluZy10b3A6IDEwMCU7XG59XG5cbi52aWRlby1qcy52anMtZmlsbCB7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDEwMCU7XG59XG5cbi52aWRlby1qcyAudmpzLXRlY2gge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMDtcbiAgbGVmdDogMDtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMTAwJTtcbn1cblxuYm9keS52anMtZnVsbC13aW5kb3cge1xuICBwYWRkaW5nOiAwO1xuICBtYXJnaW46IDA7XG4gIGhlaWdodDogMTAwJTtcbn1cblxuLnZqcy1mdWxsLXdpbmRvdyAudmlkZW8tanMudmpzLWZ1bGxzY3JlZW4ge1xuICBwb3NpdGlvbjogZml4ZWQ7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIHotaW5kZXg6IDEwMDA7XG4gIGxlZnQ6IDA7XG4gIHRvcDogMDtcbiAgYm90dG9tOiAwO1xuICByaWdodDogMDtcbn1cblxuLnZpZGVvLWpzLnZqcy1mdWxsc2NyZWVuOm5vdCgudmpzLWlvcy1uYXRpdmUtZnMpIHtcbiAgd2lkdGg6IDEwMCUgIWltcG9ydGFudDtcbiAgaGVpZ2h0OiAxMDAlICFpbXBvcnRhbnQ7XG4gIHBhZGRpbmctdG9wOiAwICFpbXBvcnRhbnQ7XG59XG5cbi52aWRlby1qcy52anMtZnVsbHNjcmVlbi52anMtdXNlci1pbmFjdGl2ZSB7XG4gIGN1cnNvcjogbm9uZTtcbn1cblxuLnZqcy1oaWRkZW4ge1xuICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG59XG5cbi52anMtZGlzYWJsZWQge1xuICBvcGFjaXR5OiAwLjU7XG4gIGN1cnNvcjogZGVmYXVsdDtcbn1cblxuLnZpZGVvLWpzIC52anMtb2Zmc2NyZWVuIHtcbiAgaGVpZ2h0OiAxcHg7XG4gIGxlZnQ6IC05OTk5cHg7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAwO1xuICB3aWR0aDogMXB4O1xufVxuXG4udmpzLWxvY2stc2hvd2luZyB7XG4gIGRpc3BsYXk6IGJsb2NrICFpbXBvcnRhbnQ7XG4gIG9wYWNpdHk6IDE7XG4gIHZpc2liaWxpdHk6IHZpc2libGU7XG59XG5cbi52anMtbm8tanMge1xuICBwYWRkaW5nOiAyMHB4O1xuICBjb2xvcjogI2ZmZjtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzAwMDtcbiAgZm9udC1zaXplOiAxOHB4O1xuICBmb250LWZhbWlseTogQXJpYWwsIEhlbHZldGljYSwgc2Fucy1zZXJpZjtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICB3aWR0aDogMzAwcHg7XG4gIGhlaWdodDogMTUwcHg7XG4gIG1hcmdpbjogMHB4IGF1dG87XG59XG5cbi52anMtbm8tanMgYSxcbi52anMtbm8tanMgYTp2aXNpdGVkIHtcbiAgY29sb3I6ICM2NkE4Q0M7XG59XG5cbi52aWRlby1qcyAudmpzLWJpZy1wbGF5LWJ1dHRvbiB7XG4gIGZvbnQtc2l6ZTogM2VtO1xuICBsaW5lLWhlaWdodDogMS41ZW07XG4gIGhlaWdodDogMS42MzMzMmVtO1xuICB3aWR0aDogM2VtO1xuICBkaXNwbGF5OiBibG9jaztcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDEwcHg7XG4gIGxlZnQ6IDEwcHg7XG4gIHBhZGRpbmc6IDA7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgb3BhY2l0eTogMTtcbiAgYm9yZGVyOiAwLjA2NjY2ZW0gc29saWQgI2ZmZjtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzJCMzMzRjtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSg0MywgNTEsIDYzLCAwLjcpO1xuICBib3JkZXItcmFkaXVzOiAwLjNlbTtcbiAgdHJhbnNpdGlvbjogYWxsIDAuNHM7XG59XG4udmpzLWJpZy1wbGF5LWNlbnRlcmVkIC52anMtYmlnLXBsYXktYnV0dG9uIHtcbiAgdG9wOiA1MCU7XG4gIGxlZnQ6IDUwJTtcbiAgbWFyZ2luLXRvcDogLTAuODE2NjZlbTtcbiAgbWFyZ2luLWxlZnQ6IC0xLjVlbTtcbn1cblxuLnZpZGVvLWpzOmhvdmVyIC52anMtYmlnLXBsYXktYnV0dG9uLFxuLnZpZGVvLWpzIC52anMtYmlnLXBsYXktYnV0dG9uOmZvY3VzIHtcbiAgYm9yZGVyLWNvbG9yOiAjZmZmO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjNzM4NTlmO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDExNSwgMTMzLCAxNTksIDAuNSk7XG4gIHRyYW5zaXRpb246IGFsbCAwcztcbn1cblxuLnZqcy1jb250cm9scy1kaXNhYmxlZCAudmpzLWJpZy1wbGF5LWJ1dHRvbixcbi52anMtaGFzLXN0YXJ0ZWQgLnZqcy1iaWctcGxheS1idXR0b24sXG4udmpzLXVzaW5nLW5hdGl2ZS1jb250cm9scyAudmpzLWJpZy1wbGF5LWJ1dHRvbixcbi52anMtZXJyb3IgLnZqcy1iaWctcGxheS1idXR0b24ge1xuICBkaXNwbGF5OiBub25lO1xufVxuXG4udmpzLWhhcy1zdGFydGVkLnZqcy1wYXVzZWQudmpzLXNob3ctYmlnLXBsYXktYnV0dG9uLW9uLXBhdXNlIC52anMtYmlnLXBsYXktYnV0dG9uIHtcbiAgZGlzcGxheTogYmxvY2s7XG59XG5cbi52aWRlby1qcyBidXR0b24ge1xuICBiYWNrZ3JvdW5kOiBub25lO1xuICBib3JkZXI6IG5vbmU7XG4gIGNvbG9yOiBpbmhlcml0O1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIGZvbnQtc2l6ZTogaW5oZXJpdDtcbiAgbGluZS1oZWlnaHQ6IGluaGVyaXQ7XG4gIHRleHQtdHJhbnNmb3JtOiBub25lO1xuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gIHRyYW5zaXRpb246IG5vbmU7XG4gIC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcbiAgLW1vei1hcHBlYXJhbmNlOiBub25lO1xuICBhcHBlYXJhbmNlOiBub25lO1xufVxuXG4udmpzLWNvbnRyb2wgLnZqcy1idXR0b24ge1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAxMDAlO1xufVxuXG4udmlkZW8tanMgLnZqcy1jb250cm9sLnZqcy1jbG9zZS1idXR0b24ge1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGhlaWdodDogM2VtO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHJpZ2h0OiAwO1xuICB0b3A6IDAuNWVtO1xuICB6LWluZGV4OiAyO1xufVxuLnZpZGVvLWpzIC52anMtbW9kYWwtZGlhbG9nIHtcbiAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjgpO1xuICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMTgwZGVnLCByZ2JhKDAsIDAsIDAsIDAuOCksIHJnYmEoMjU1LCAyNTUsIDI1NSwgMCkpO1xuICBvdmVyZmxvdzogYXV0bztcbn1cblxuLnZpZGVvLWpzIC52anMtbW9kYWwtZGlhbG9nID4gKiB7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG59XG5cbi52anMtbW9kYWwtZGlhbG9nIC52anMtbW9kYWwtZGlhbG9nLWNvbnRlbnQge1xuICBmb250LXNpemU6IDEuMmVtO1xuICBsaW5lLWhlaWdodDogMS41O1xuICBwYWRkaW5nOiAyMHB4IDI0cHg7XG4gIHotaW5kZXg6IDE7XG59XG5cbi52anMtbWVudS1idXR0b24ge1xuICBjdXJzb3I6IHBvaW50ZXI7XG59XG5cbi52anMtbWVudS1idXR0b24udmpzLWRpc2FibGVkIHtcbiAgY3Vyc29yOiBkZWZhdWx0O1xufVxuXG4udmpzLXdvcmtpbmdob3ZlciAudmpzLW1lbnUtYnV0dG9uLnZqcy1kaXNhYmxlZDpob3ZlciAudmpzLW1lbnUge1xuICBkaXNwbGF5OiBub25lO1xufVxuXG4udmpzLW1lbnUgLnZqcy1tZW51LWNvbnRlbnQge1xuICBkaXNwbGF5OiBibG9jaztcbiAgcGFkZGluZzogMDtcbiAgbWFyZ2luOiAwO1xuICBmb250LWZhbWlseTogQXJpYWwsIEhlbHZldGljYSwgc2Fucy1zZXJpZjtcbiAgb3ZlcmZsb3c6IGF1dG87XG59XG5cbi52anMtbWVudSAudmpzLW1lbnUtY29udGVudCA+ICoge1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xufVxuXG4udmpzLXNjcnViYmluZyAudmpzLWNvbnRyb2wudmpzLW1lbnUtYnV0dG9uOmhvdmVyIC52anMtbWVudSB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG5cbi52anMtbWVudSBsaSB7XG4gIGxpc3Qtc3R5bGU6IG5vbmU7XG4gIG1hcmdpbjogMDtcbiAgcGFkZGluZzogMC4yZW0gMDtcbiAgbGluZS1oZWlnaHQ6IDEuNGVtO1xuICBmb250LXNpemU6IDEuMmVtO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIHRleHQtdHJhbnNmb3JtOiBsb3dlcmNhc2U7XG59XG5cbi52anMtbWVudSBsaS52anMtbWVudS1pdGVtOmZvY3VzLFxuLnZqcy1tZW51IGxpLnZqcy1tZW51LWl0ZW06aG92ZXIsXG4uanMtZm9jdXMtdmlzaWJsZSAudmpzLW1lbnUgbGkudmpzLW1lbnUtaXRlbTpob3ZlciB7XG4gIGJhY2tncm91bmQtY29sb3I6ICM3Mzg1OWY7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMTE1LCAxMzMsIDE1OSwgMC41KTtcbn1cblxuLnZqcy1tZW51IGxpLnZqcy1zZWxlY3RlZCxcbi52anMtbWVudSBsaS52anMtc2VsZWN0ZWQ6Zm9jdXMsXG4udmpzLW1lbnUgbGkudmpzLXNlbGVjdGVkOmhvdmVyLFxuLmpzLWZvY3VzLXZpc2libGUgLnZqcy1tZW51IGxpLnZqcy1zZWxlY3RlZDpob3ZlciB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XG4gIGNvbG9yOiAjMkIzMzNGO1xufVxuXG4udmlkZW8tanMgLnZqcy1tZW51ICo6bm90KC52anMtc2VsZWN0ZWQpOmZvY3VzOm5vdCg6Zm9jdXMtdmlzaWJsZSksXG4uanMtZm9jdXMtdmlzaWJsZSAudmpzLW1lbnUgKjpub3QoLnZqcy1zZWxlY3RlZCk6Zm9jdXM6bm90KC5mb2N1cy12aXNpYmxlKSB7XG4gIGJhY2tncm91bmQ6IG5vbmU7XG59XG5cbi52anMtbWVudSBsaS52anMtbWVudS10aXRsZSB7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgZm9udC1zaXplOiAxZW07XG4gIGxpbmUtaGVpZ2h0OiAyZW07XG4gIHBhZGRpbmc6IDA7XG4gIG1hcmdpbjogMCAwIDAuM2VtIDA7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICBjdXJzb3I6IGRlZmF1bHQ7XG59XG5cbi52anMtbWVudS1idXR0b24tcG9wdXAgLnZqcy1tZW51IHtcbiAgZGlzcGxheTogbm9uZTtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBib3R0b206IDA7XG4gIHdpZHRoOiAxMGVtO1xuICBsZWZ0OiAtM2VtO1xuICBoZWlnaHQ6IDBlbTtcbiAgbWFyZ2luLWJvdHRvbTogMS41ZW07XG4gIGJvcmRlci10b3AtY29sb3I6IHJnYmEoNDMsIDUxLCA2MywgMC43KTtcbn1cblxuLnZqcy1tZW51LWJ1dHRvbi1wb3B1cCAudmpzLW1lbnUgLnZqcy1tZW51LWNvbnRlbnQge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMkIzMzNGO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDQzLCA1MSwgNjMsIDAuNyk7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgd2lkdGg6IDEwMCU7XG4gIGJvdHRvbTogMS41ZW07XG4gIG1heC1oZWlnaHQ6IDE1ZW07XG59XG5cbi52anMtbGF5b3V0LXRpbnkgLnZqcy1tZW51LWJ1dHRvbi1wb3B1cCAudmpzLW1lbnUgLnZqcy1tZW51LWNvbnRlbnQsXG4udmpzLWxheW91dC14LXNtYWxsIC52anMtbWVudS1idXR0b24tcG9wdXAgLnZqcy1tZW51IC52anMtbWVudS1jb250ZW50IHtcbiAgbWF4LWhlaWdodDogNWVtO1xufVxuXG4udmpzLWxheW91dC1zbWFsbCAudmpzLW1lbnUtYnV0dG9uLXBvcHVwIC52anMtbWVudSAudmpzLW1lbnUtY29udGVudCB7XG4gIG1heC1oZWlnaHQ6IDEwZW07XG59XG5cbi52anMtbGF5b3V0LW1lZGl1bSAudmpzLW1lbnUtYnV0dG9uLXBvcHVwIC52anMtbWVudSAudmpzLW1lbnUtY29udGVudCB7XG4gIG1heC1oZWlnaHQ6IDE0ZW07XG59XG5cbi52anMtbGF5b3V0LWxhcmdlIC52anMtbWVudS1idXR0b24tcG9wdXAgLnZqcy1tZW51IC52anMtbWVudS1jb250ZW50LFxuLnZqcy1sYXlvdXQteC1sYXJnZSAudmpzLW1lbnUtYnV0dG9uLXBvcHVwIC52anMtbWVudSAudmpzLW1lbnUtY29udGVudCxcbi52anMtbGF5b3V0LWh1Z2UgLnZqcy1tZW51LWJ1dHRvbi1wb3B1cCAudmpzLW1lbnUgLnZqcy1tZW51LWNvbnRlbnQge1xuICBtYXgtaGVpZ2h0OiAyNWVtO1xufVxuXG4udmpzLXdvcmtpbmdob3ZlciAudmpzLW1lbnUtYnV0dG9uLXBvcHVwLnZqcy1ob3ZlciAudmpzLW1lbnUsXG4udmpzLW1lbnUtYnV0dG9uLXBvcHVwIC52anMtbWVudS52anMtbG9jay1zaG93aW5nIHtcbiAgZGlzcGxheTogYmxvY2s7XG59XG5cbi52aWRlby1qcyAudmpzLW1lbnUtYnV0dG9uLWlubGluZSB7XG4gIHRyYW5zaXRpb246IGFsbCAwLjRzO1xuICBvdmVyZmxvdzogaGlkZGVuO1xufVxuXG4udmlkZW8tanMgLnZqcy1tZW51LWJ1dHRvbi1pbmxpbmU6YmVmb3JlIHtcbiAgd2lkdGg6IDIuMjIyMjIyMjIyZW07XG59XG5cbi52aWRlby1qcyAudmpzLW1lbnUtYnV0dG9uLWlubGluZTpob3Zlcixcbi52aWRlby1qcyAudmpzLW1lbnUtYnV0dG9uLWlubGluZTpmb2N1cyxcbi52aWRlby1qcyAudmpzLW1lbnUtYnV0dG9uLWlubGluZS52anMtc2xpZGVyLWFjdGl2ZSxcbi52aWRlby1qcy52anMtbm8tZmxleCAudmpzLW1lbnUtYnV0dG9uLWlubGluZSB7XG4gIHdpZHRoOiAxMmVtO1xufVxuXG4udmpzLW1lbnUtYnV0dG9uLWlubGluZSAudmpzLW1lbnUge1xuICBvcGFjaXR5OiAwO1xuICBoZWlnaHQ6IDEwMCU7XG4gIHdpZHRoOiBhdXRvO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGxlZnQ6IDRlbTtcbiAgdG9wOiAwO1xuICBwYWRkaW5nOiAwO1xuICBtYXJnaW46IDA7XG4gIHRyYW5zaXRpb246IGFsbCAwLjRzO1xufVxuXG4udmpzLW1lbnUtYnV0dG9uLWlubGluZTpob3ZlciAudmpzLW1lbnUsXG4udmpzLW1lbnUtYnV0dG9uLWlubGluZTpmb2N1cyAudmpzLW1lbnUsXG4udmpzLW1lbnUtYnV0dG9uLWlubGluZS52anMtc2xpZGVyLWFjdGl2ZSAudmpzLW1lbnUge1xuICBkaXNwbGF5OiBibG9jaztcbiAgb3BhY2l0eTogMTtcbn1cblxuLnZqcy1uby1mbGV4IC52anMtbWVudS1idXR0b24taW5saW5lIC52anMtbWVudSB7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICBvcGFjaXR5OiAxO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHdpZHRoOiBhdXRvO1xufVxuXG4udmpzLW5vLWZsZXggLnZqcy1tZW51LWJ1dHRvbi1pbmxpbmU6aG92ZXIgLnZqcy1tZW51LFxuLnZqcy1uby1mbGV4IC52anMtbWVudS1idXR0b24taW5saW5lOmZvY3VzIC52anMtbWVudSxcbi52anMtbm8tZmxleCAudmpzLW1lbnUtYnV0dG9uLWlubGluZS52anMtc2xpZGVyLWFjdGl2ZSAudmpzLW1lbnUge1xuICB3aWR0aDogYXV0bztcbn1cblxuLnZqcy1tZW51LWJ1dHRvbi1pbmxpbmUgLnZqcy1tZW51LWNvbnRlbnQge1xuICB3aWR0aDogYXV0bztcbiAgaGVpZ2h0OiAxMDAlO1xuICBtYXJnaW46IDA7XG4gIG92ZXJmbG93OiBoaWRkZW47XG59XG5cbi52aWRlby1qcyAudmpzLWNvbnRyb2wtYmFyIHtcbiAgZGlzcGxheTogbm9uZTtcbiAgd2lkdGg6IDEwMCU7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgYm90dG9tOiAwO1xuICBsZWZ0OiAwO1xuICByaWdodDogMDtcbiAgaGVpZ2h0OiAzZW07XG4gIGJhY2tncm91bmQtY29sb3I6ICMyQjMzM0Y7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoNDMsIDUxLCA2MywgMC43KTtcbn1cblxuLnZqcy1oYXMtc3RhcnRlZCAudmpzLWNvbnRyb2wtYmFyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgdmlzaWJpbGl0eTogdmlzaWJsZTtcbiAgb3BhY2l0eTogMTtcbiAgdHJhbnNpdGlvbjogdmlzaWJpbGl0eSAwLjFzLCBvcGFjaXR5IDAuMXM7XG59XG5cbi52anMtaGFzLXN0YXJ0ZWQudmpzLXVzZXItaW5hY3RpdmUudmpzLXBsYXlpbmcgLnZqcy1jb250cm9sLWJhciB7XG4gIHZpc2liaWxpdHk6IHZpc2libGU7XG4gIG9wYWNpdHk6IDA7XG4gIHRyYW5zaXRpb246IHZpc2liaWxpdHkgMXMsIG9wYWNpdHkgMXM7XG59XG5cbi52anMtY29udHJvbHMtZGlzYWJsZWQgLnZqcy1jb250cm9sLWJhcixcbi52anMtdXNpbmctbmF0aXZlLWNvbnRyb2xzIC52anMtY29udHJvbC1iYXIsXG4udmpzLWVycm9yIC52anMtY29udHJvbC1iYXIge1xuICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG59XG5cbi52anMtYXVkaW8udmpzLWhhcy1zdGFydGVkLnZqcy11c2VyLWluYWN0aXZlLnZqcy1wbGF5aW5nIC52anMtY29udHJvbC1iYXIge1xuICBvcGFjaXR5OiAxO1xuICB2aXNpYmlsaXR5OiB2aXNpYmxlO1xufVxuXG4udmpzLWhhcy1zdGFydGVkLnZqcy1uby1mbGV4IC52anMtY29udHJvbC1iYXIge1xuICBkaXNwbGF5OiB0YWJsZTtcbn1cblxuLnZpZGVvLWpzIC52anMtY29udHJvbCB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBtYXJnaW46IDA7XG4gIHBhZGRpbmc6IDA7XG4gIGhlaWdodDogMTAwJTtcbiAgd2lkdGg6IDRlbTtcbiAgZmxleDogbm9uZTtcbn1cblxuLnZqcy1idXR0b24gPiAudmpzLWljb24tcGxhY2Vob2xkZXI6YmVmb3JlIHtcbiAgZm9udC1zaXplOiAxLjhlbTtcbiAgbGluZS1oZWlnaHQ6IDEuNjc7XG59XG5cbi52anMtYnV0dG9uID4gLnZqcy1pY29uLXBsYWNlaG9sZGVyIHtcbiAgZGlzcGxheTogYmxvY2s7XG59XG5cbi52aWRlby1qcyAudmpzLWNvbnRyb2w6Zm9jdXM6YmVmb3JlLFxuLnZpZGVvLWpzIC52anMtY29udHJvbDpob3ZlcjpiZWZvcmUsXG4udmlkZW8tanMgLnZqcy1jb250cm9sOmZvY3VzIHtcbiAgdGV4dC1zaGFkb3c6IDBlbSAwZW0gMWVtIHdoaXRlO1xufVxuXG4udmlkZW8tanMgLnZqcy1jb250cm9sLXRleHQge1xuICBib3JkZXI6IDA7XG4gIGNsaXA6IHJlY3QoMCAwIDAgMCk7XG4gIGhlaWdodDogMXB4O1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICBwYWRkaW5nOiAwO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHdpZHRoOiAxcHg7XG59XG5cbi52anMtbm8tZmxleCAudmpzLWNvbnRyb2wge1xuICBkaXNwbGF5OiB0YWJsZS1jZWxsO1xuICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xufVxuXG4udmlkZW8tanMgLnZqcy1jdXN0b20tY29udHJvbC1zcGFjZXIge1xuICBkaXNwbGF5OiBub25lO1xufVxuXG4udmlkZW8tanMgLnZqcy1wcm9ncmVzcy1jb250cm9sIHtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBmbGV4OiBhdXRvO1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBtaW4td2lkdGg6IDRlbTtcbiAgdG91Y2gtYWN0aW9uOiBub25lO1xufVxuXG4udmlkZW8tanMgLnZqcy1wcm9ncmVzcy1jb250cm9sLmRpc2FibGVkIHtcbiAgY3Vyc29yOiBkZWZhdWx0O1xufVxuXG4udmpzLWxpdmUgLnZqcy1wcm9ncmVzcy1jb250cm9sIHtcbiAgZGlzcGxheTogbm9uZTtcbn1cblxuLnZqcy1saXZldWkgLnZqcy1wcm9ncmVzcy1jb250cm9sIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbn1cblxuLnZqcy1uby1mbGV4IC52anMtcHJvZ3Jlc3MtY29udHJvbCB7XG4gIHdpZHRoOiBhdXRvO1xufVxuXG4udmlkZW8tanMgLnZqcy1wcm9ncmVzcy1ob2xkZXIge1xuICBmbGV4OiBhdXRvO1xuICB0cmFuc2l0aW9uOiBhbGwgMC4ycztcbiAgaGVpZ2h0OiAwLjNlbTtcbn1cblxuLnZpZGVvLWpzIC52anMtcHJvZ3Jlc3MtY29udHJvbCAudmpzLXByb2dyZXNzLWhvbGRlciB7XG4gIG1hcmdpbjogMCAxMHB4O1xufVxuXG4udmlkZW8tanMgLnZqcy1wcm9ncmVzcy1jb250cm9sOmhvdmVyIC52anMtcHJvZ3Jlc3MtaG9sZGVyIHtcbiAgZm9udC1zaXplOiAxLjY2NjY2NjY2NjdlbTtcbn1cblxuLnZpZGVvLWpzIC52anMtcHJvZ3Jlc3MtY29udHJvbDpob3ZlciAudmpzLXByb2dyZXNzLWhvbGRlci5kaXNhYmxlZCB7XG4gIGZvbnQtc2l6ZTogMWVtO1xufVxuXG4udmlkZW8tanMgLnZqcy1wcm9ncmVzcy1ob2xkZXIgLnZqcy1wbGF5LXByb2dyZXNzLFxuLnZpZGVvLWpzIC52anMtcHJvZ3Jlc3MtaG9sZGVyIC52anMtbG9hZC1wcm9ncmVzcyxcbi52aWRlby1qcyAudmpzLXByb2dyZXNzLWhvbGRlciAudmpzLWxvYWQtcHJvZ3Jlc3MgZGl2IHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBkaXNwbGF5OiBibG9jaztcbiAgaGVpZ2h0OiAxMDAlO1xuICBtYXJnaW46IDA7XG4gIHBhZGRpbmc6IDA7XG4gIHdpZHRoOiAwO1xufVxuXG4udmlkZW8tanMgLnZqcy1wbGF5LXByb2dyZXNzIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcbn1cbi52aWRlby1qcyAudmpzLXBsYXktcHJvZ3Jlc3M6YmVmb3JlIHtcbiAgZm9udC1zaXplOiAwLjllbTtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICByaWdodDogLTAuNWVtO1xuICB0b3A6IC0wLjMzMzMzMzMzMzNlbTtcbiAgei1pbmRleDogMTtcbn1cblxuLnZpZGVvLWpzIC52anMtbG9hZC1wcm9ncmVzcyB7XG4gIGJhY2tncm91bmQ6IHJnYmEoMTE1LCAxMzMsIDE1OSwgMC41KTtcbn1cblxuLnZpZGVvLWpzIC52anMtbG9hZC1wcm9ncmVzcyBkaXYge1xuICBiYWNrZ3JvdW5kOiByZ2JhKDExNSwgMTMzLCAxNTksIDAuNzUpO1xufVxuXG4udmlkZW8tanMgLnZqcy10aW1lLXRvb2x0aXAge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuOCk7XG4gIGJvcmRlci1yYWRpdXM6IDAuM2VtO1xuICBjb2xvcjogIzAwMDtcbiAgZmxvYXQ6IHJpZ2h0O1xuICBmb250LWZhbWlseTogQXJpYWwsIEhlbHZldGljYSwgc2Fucy1zZXJpZjtcbiAgZm9udC1zaXplOiAxZW07XG4gIHBhZGRpbmc6IDZweCA4cHggOHB4IDhweDtcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAtMy40ZW07XG4gIHZpc2liaWxpdHk6IGhpZGRlbjtcbiAgei1pbmRleDogMTtcbn1cblxuLnZpZGVvLWpzIC52anMtcHJvZ3Jlc3MtaG9sZGVyOmZvY3VzIC52anMtdGltZS10b29sdGlwIHtcbiAgZGlzcGxheTogbm9uZTtcbn1cblxuLnZpZGVvLWpzIC52anMtcHJvZ3Jlc3MtY29udHJvbDpob3ZlciAudmpzLXRpbWUtdG9vbHRpcCxcbi52aWRlby1qcyAudmpzLXByb2dyZXNzLWNvbnRyb2w6aG92ZXIgLnZqcy1wcm9ncmVzcy1ob2xkZXI6Zm9jdXMgLnZqcy10aW1lLXRvb2x0aXAge1xuICBkaXNwbGF5OiBibG9jaztcbiAgZm9udC1zaXplOiAwLjZlbTtcbiAgdmlzaWJpbGl0eTogdmlzaWJsZTtcbn1cblxuLnZpZGVvLWpzIC52anMtcHJvZ3Jlc3MtY29udHJvbC5kaXNhYmxlZDpob3ZlciAudmpzLXRpbWUtdG9vbHRpcCB7XG4gIGZvbnQtc2l6ZTogMWVtO1xufVxuXG4udmlkZW8tanMgLnZqcy1wcm9ncmVzcy1jb250cm9sIC52anMtbW91c2UtZGlzcGxheSB7XG4gIGRpc3BsYXk6IG5vbmU7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgd2lkdGg6IDFweDtcbiAgaGVpZ2h0OiAxMDAlO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDAwO1xuICB6LWluZGV4OiAxO1xufVxuXG4udmpzLW5vLWZsZXggLnZqcy1wcm9ncmVzcy1jb250cm9sIC52anMtbW91c2UtZGlzcGxheSB7XG4gIHotaW5kZXg6IDA7XG59XG5cbi52aWRlby1qcyAudmpzLXByb2dyZXNzLWNvbnRyb2w6aG92ZXIgLnZqcy1tb3VzZS1kaXNwbGF5IHtcbiAgZGlzcGxheTogYmxvY2s7XG59XG5cbi52aWRlby1qcy52anMtdXNlci1pbmFjdGl2ZSAudmpzLXByb2dyZXNzLWNvbnRyb2wgLnZqcy1tb3VzZS1kaXNwbGF5IHtcbiAgdmlzaWJpbGl0eTogaGlkZGVuO1xuICBvcGFjaXR5OiAwO1xuICB0cmFuc2l0aW9uOiB2aXNpYmlsaXR5IDFzLCBvcGFjaXR5IDFzO1xufVxuXG4udmlkZW8tanMudmpzLXVzZXItaW5hY3RpdmUudmpzLW5vLWZsZXggLnZqcy1wcm9ncmVzcy1jb250cm9sIC52anMtbW91c2UtZGlzcGxheSB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG5cbi52anMtbW91c2UtZGlzcGxheSAudmpzLXRpbWUtdG9vbHRpcCB7XG4gIGNvbG9yOiAjZmZmO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDAwO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuOCk7XG59XG5cbi52aWRlby1qcyAudmpzLXNsaWRlciB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBwYWRkaW5nOiAwO1xuICBtYXJnaW46IDAgMC40NWVtIDAgMC40NWVtO1xuICAvKiBpT1MgU2FmYXJpICovXG4gIC13ZWJraXQtdG91Y2gtY2FsbG91dDogbm9uZTtcbiAgLyogU2FmYXJpICovXG4gIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XG4gIC8qIEtvbnF1ZXJvciBIVE1MICovXG4gIC8qIEZpcmVmb3ggKi9cbiAgLW1vei11c2VyLXNlbGVjdDogbm9uZTtcbiAgLyogSW50ZXJuZXQgRXhwbG9yZXIvRWRnZSAqL1xuICAtbXMtdXNlci1zZWxlY3Q6IG5vbmU7XG4gIC8qIE5vbi1wcmVmaXhlZCB2ZXJzaW9uLCBjdXJyZW50bHkgc3VwcG9ydGVkIGJ5IENocm9tZSBhbmQgT3BlcmEgKi9cbiAgdXNlci1zZWxlY3Q6IG5vbmU7XG4gIGJhY2tncm91bmQtY29sb3I6ICM3Mzg1OWY7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMTE1LCAxMzMsIDE1OSwgMC41KTtcbn1cblxuLnZpZGVvLWpzIC52anMtc2xpZGVyLmRpc2FibGVkIHtcbiAgY3Vyc29yOiBkZWZhdWx0O1xufVxuXG4udmlkZW8tanMgLnZqcy1zbGlkZXI6Zm9jdXMge1xuICB0ZXh0LXNoYWRvdzogMGVtIDBlbSAxZW0gd2hpdGU7XG4gIGJveC1zaGFkb3c6IDAgMCAxZW0gI2ZmZjtcbn1cblxuLnZpZGVvLWpzIC52anMtbXV0ZS1jb250cm9sIHtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBmbGV4OiBub25lO1xufVxuLnZpZGVvLWpzIC52anMtdm9sdW1lLWNvbnRyb2wge1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIG1hcmdpbi1yaWdodDogMWVtO1xuICBkaXNwbGF5OiBmbGV4O1xufVxuXG4udmlkZW8tanMgLnZqcy12b2x1bWUtY29udHJvbC52anMtdm9sdW1lLWhvcml6b250YWwge1xuICB3aWR0aDogNWVtO1xufVxuXG4udmlkZW8tanMgLnZqcy12b2x1bWUtcGFuZWwgLnZqcy12b2x1bWUtY29udHJvbCB7XG4gIHZpc2liaWxpdHk6IHZpc2libGU7XG4gIG9wYWNpdHk6IDA7XG4gIHdpZHRoOiAxcHg7XG4gIGhlaWdodDogMXB4O1xuICBtYXJnaW4tbGVmdDogLTFweDtcbn1cblxuLnZpZGVvLWpzIC52anMtdm9sdW1lLXBhbmVsIHtcbiAgdHJhbnNpdGlvbjogd2lkdGggMXM7XG59XG4udmlkZW8tanMgLnZqcy12b2x1bWUtcGFuZWwudmpzLWhvdmVyIC52anMtdm9sdW1lLWNvbnRyb2wsIC52aWRlby1qcyAudmpzLXZvbHVtZS1wYW5lbDphY3RpdmUgLnZqcy12b2x1bWUtY29udHJvbCwgLnZpZGVvLWpzIC52anMtdm9sdW1lLXBhbmVsOmZvY3VzIC52anMtdm9sdW1lLWNvbnRyb2wsIC52aWRlby1qcyAudmpzLXZvbHVtZS1wYW5lbCAudmpzLXZvbHVtZS1jb250cm9sOmFjdGl2ZSwgLnZpZGVvLWpzIC52anMtdm9sdW1lLXBhbmVsLnZqcy1ob3ZlciAudmpzLW11dGUtY29udHJvbCB+IC52anMtdm9sdW1lLWNvbnRyb2wsIC52aWRlby1qcyAudmpzLXZvbHVtZS1wYW5lbCAudmpzLXZvbHVtZS1jb250cm9sLnZqcy1zbGlkZXItYWN0aXZlIHtcbiAgdmlzaWJpbGl0eTogdmlzaWJsZTtcbiAgb3BhY2l0eTogMTtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB0cmFuc2l0aW9uOiB2aXNpYmlsaXR5IDAuMXMsIG9wYWNpdHkgMC4xcywgaGVpZ2h0IDAuMXMsIHdpZHRoIDAuMXMsIGxlZnQgMHMsIHRvcCAwcztcbn1cbi52aWRlby1qcyAudmpzLXZvbHVtZS1wYW5lbC52anMtaG92ZXIgLnZqcy12b2x1bWUtY29udHJvbC52anMtdm9sdW1lLWhvcml6b250YWwsIC52aWRlby1qcyAudmpzLXZvbHVtZS1wYW5lbDphY3RpdmUgLnZqcy12b2x1bWUtY29udHJvbC52anMtdm9sdW1lLWhvcml6b250YWwsIC52aWRlby1qcyAudmpzLXZvbHVtZS1wYW5lbDpmb2N1cyAudmpzLXZvbHVtZS1jb250cm9sLnZqcy12b2x1bWUtaG9yaXpvbnRhbCwgLnZpZGVvLWpzIC52anMtdm9sdW1lLXBhbmVsIC52anMtdm9sdW1lLWNvbnRyb2w6YWN0aXZlLnZqcy12b2x1bWUtaG9yaXpvbnRhbCwgLnZpZGVvLWpzIC52anMtdm9sdW1lLXBhbmVsLnZqcy1ob3ZlciAudmpzLW11dGUtY29udHJvbCB+IC52anMtdm9sdW1lLWNvbnRyb2wudmpzLXZvbHVtZS1ob3Jpem9udGFsLCAudmlkZW8tanMgLnZqcy12b2x1bWUtcGFuZWwgLnZqcy12b2x1bWUtY29udHJvbC52anMtc2xpZGVyLWFjdGl2ZS52anMtdm9sdW1lLWhvcml6b250YWwge1xuICB3aWR0aDogNWVtO1xuICBoZWlnaHQ6IDNlbTtcbiAgbWFyZ2luLXJpZ2h0OiAwO1xufVxuLnZpZGVvLWpzIC52anMtdm9sdW1lLXBhbmVsLnZqcy1ob3ZlciAudmpzLXZvbHVtZS1jb250cm9sLnZqcy12b2x1bWUtdmVydGljYWwsIC52aWRlby1qcyAudmpzLXZvbHVtZS1wYW5lbDphY3RpdmUgLnZqcy12b2x1bWUtY29udHJvbC52anMtdm9sdW1lLXZlcnRpY2FsLCAudmlkZW8tanMgLnZqcy12b2x1bWUtcGFuZWw6Zm9jdXMgLnZqcy12b2x1bWUtY29udHJvbC52anMtdm9sdW1lLXZlcnRpY2FsLCAudmlkZW8tanMgLnZqcy12b2x1bWUtcGFuZWwgLnZqcy12b2x1bWUtY29udHJvbDphY3RpdmUudmpzLXZvbHVtZS12ZXJ0aWNhbCwgLnZpZGVvLWpzIC52anMtdm9sdW1lLXBhbmVsLnZqcy1ob3ZlciAudmpzLW11dGUtY29udHJvbCB+IC52anMtdm9sdW1lLWNvbnRyb2wudmpzLXZvbHVtZS12ZXJ0aWNhbCwgLnZpZGVvLWpzIC52anMtdm9sdW1lLXBhbmVsIC52anMtdm9sdW1lLWNvbnRyb2wudmpzLXNsaWRlci1hY3RpdmUudmpzLXZvbHVtZS12ZXJ0aWNhbCB7XG4gIGxlZnQ6IC0zLjVlbTtcbiAgdHJhbnNpdGlvbjogbGVmdCAwcztcbn1cbi52aWRlby1qcyAudmpzLXZvbHVtZS1wYW5lbC52anMtdm9sdW1lLXBhbmVsLWhvcml6b250YWwudmpzLWhvdmVyLCAudmlkZW8tanMgLnZqcy12b2x1bWUtcGFuZWwudmpzLXZvbHVtZS1wYW5lbC1ob3Jpem9udGFsOmFjdGl2ZSwgLnZpZGVvLWpzIC52anMtdm9sdW1lLXBhbmVsLnZqcy12b2x1bWUtcGFuZWwtaG9yaXpvbnRhbC52anMtc2xpZGVyLWFjdGl2ZSB7XG4gIHdpZHRoOiAxMGVtO1xuICB0cmFuc2l0aW9uOiB3aWR0aCAwLjFzO1xufVxuLnZpZGVvLWpzIC52anMtdm9sdW1lLXBhbmVsLnZqcy12b2x1bWUtcGFuZWwtaG9yaXpvbnRhbC52anMtbXV0ZS10b2dnbGUtb25seSB7XG4gIHdpZHRoOiA0ZW07XG59XG5cbi52aWRlby1qcyAudmpzLXZvbHVtZS1wYW5lbCAudmpzLXZvbHVtZS1jb250cm9sLnZqcy12b2x1bWUtdmVydGljYWwge1xuICBoZWlnaHQ6IDhlbTtcbiAgd2lkdGg6IDNlbTtcbiAgbGVmdDogLTMwMDBlbTtcbiAgdHJhbnNpdGlvbjogdmlzaWJpbGl0eSAxcywgb3BhY2l0eSAxcywgaGVpZ2h0IDFzIDFzLCB3aWR0aCAxcyAxcywgbGVmdCAxcyAxcywgdG9wIDFzIDFzO1xufVxuXG4udmlkZW8tanMgLnZqcy12b2x1bWUtcGFuZWwgLnZqcy12b2x1bWUtY29udHJvbC52anMtdm9sdW1lLWhvcml6b250YWwge1xuICB0cmFuc2l0aW9uOiB2aXNpYmlsaXR5IDFzLCBvcGFjaXR5IDFzLCBoZWlnaHQgMXMgMXMsIHdpZHRoIDFzLCBsZWZ0IDFzIDFzLCB0b3AgMXMgMXM7XG59XG5cbi52aWRlby1qcy52anMtbm8tZmxleCAudmpzLXZvbHVtZS1wYW5lbCAudmpzLXZvbHVtZS1jb250cm9sLnZqcy12b2x1bWUtaG9yaXpvbnRhbCB7XG4gIHdpZHRoOiA1ZW07XG4gIGhlaWdodDogM2VtO1xuICB2aXNpYmlsaXR5OiB2aXNpYmxlO1xuICBvcGFjaXR5OiAxO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHRyYW5zaXRpb246IG5vbmU7XG59XG5cbi52aWRlby1qcy52anMtbm8tZmxleCAudmpzLXZvbHVtZS1jb250cm9sLnZqcy12b2x1bWUtdmVydGljYWwsXG4udmlkZW8tanMudmpzLW5vLWZsZXggLnZqcy12b2x1bWUtcGFuZWwgLnZqcy12b2x1bWUtY29udHJvbC52anMtdm9sdW1lLXZlcnRpY2FsIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBib3R0b206IDNlbTtcbiAgbGVmdDogMC41ZW07XG59XG5cbi52aWRlby1qcyAudmpzLXZvbHVtZS1wYW5lbCB7XG4gIGRpc3BsYXk6IGZsZXg7XG59XG5cbi52aWRlby1qcyAudmpzLXZvbHVtZS1iYXIge1xuICBtYXJnaW46IDEuMzVlbSAwLjQ1ZW07XG59XG5cbi52anMtdm9sdW1lLWJhci52anMtc2xpZGVyLWhvcml6b250YWwge1xuICB3aWR0aDogNWVtO1xuICBoZWlnaHQ6IDAuM2VtO1xufVxuXG4udmpzLXZvbHVtZS1iYXIudmpzLXNsaWRlci12ZXJ0aWNhbCB7XG4gIHdpZHRoOiAwLjNlbTtcbiAgaGVpZ2h0OiA1ZW07XG4gIG1hcmdpbjogMS4zNWVtIGF1dG87XG59XG5cbi52aWRlby1qcyAudmpzLXZvbHVtZS1sZXZlbCB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgYm90dG9tOiAwO1xuICBsZWZ0OiAwO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xufVxuLnZpZGVvLWpzIC52anMtdm9sdW1lLWxldmVsOmJlZm9yZSB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgZm9udC1zaXplOiAwLjllbTtcbiAgei1pbmRleDogMTtcbn1cblxuLnZqcy1zbGlkZXItdmVydGljYWwgLnZqcy12b2x1bWUtbGV2ZWwge1xuICB3aWR0aDogMC4zZW07XG59XG4udmpzLXNsaWRlci12ZXJ0aWNhbCAudmpzLXZvbHVtZS1sZXZlbDpiZWZvcmUge1xuICB0b3A6IC0wLjVlbTtcbiAgbGVmdDogLTAuM2VtO1xuICB6LWluZGV4OiAxO1xufVxuXG4udmpzLXNsaWRlci1ob3Jpem9udGFsIC52anMtdm9sdW1lLWxldmVsIHtcbiAgaGVpZ2h0OiAwLjNlbTtcbn1cbi52anMtc2xpZGVyLWhvcml6b250YWwgLnZqcy12b2x1bWUtbGV2ZWw6YmVmb3JlIHtcbiAgdG9wOiAtMC4zZW07XG4gIHJpZ2h0OiAtMC41ZW07XG59XG5cbi52aWRlby1qcyAudmpzLXZvbHVtZS1wYW5lbC52anMtdm9sdW1lLXBhbmVsLXZlcnRpY2FsIHtcbiAgd2lkdGg6IDRlbTtcbn1cblxuLnZqcy12b2x1bWUtYmFyLnZqcy1zbGlkZXItdmVydGljYWwgLnZqcy12b2x1bWUtbGV2ZWwge1xuICBoZWlnaHQ6IDEwMCU7XG59XG5cbi52anMtdm9sdW1lLWJhci52anMtc2xpZGVyLWhvcml6b250YWwgLnZqcy12b2x1bWUtbGV2ZWwge1xuICB3aWR0aDogMTAwJTtcbn1cblxuLnZpZGVvLWpzIC52anMtdm9sdW1lLXZlcnRpY2FsIHtcbiAgd2lkdGg6IDNlbTtcbiAgaGVpZ2h0OiA4ZW07XG4gIGJvdHRvbTogOGVtO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMkIzMzNGO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDQzLCA1MSwgNjMsIDAuNyk7XG59XG5cbi52aWRlby1qcyAudmpzLXZvbHVtZS1ob3Jpem9udGFsIC52anMtbWVudSB7XG4gIGxlZnQ6IC0yZW07XG59XG5cbi52aWRlby1qcyAudmpzLXZvbHVtZS10b29sdGlwIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjgpO1xuICBib3JkZXItcmFkaXVzOiAwLjNlbTtcbiAgY29sb3I6ICMwMDA7XG4gIGZsb2F0OiByaWdodDtcbiAgZm9udC1mYW1pbHk6IEFyaWFsLCBIZWx2ZXRpY2EsIHNhbnMtc2VyaWY7XG4gIGZvbnQtc2l6ZTogMWVtO1xuICBwYWRkaW5nOiA2cHggOHB4IDhweCA4cHg7XG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogLTMuNGVtO1xuICB2aXNpYmlsaXR5OiBoaWRkZW47XG4gIHotaW5kZXg6IDE7XG59XG5cbi52aWRlby1qcyAudmpzLXZvbHVtZS1jb250cm9sOmhvdmVyIC52anMtdm9sdW1lLXRvb2x0aXAsXG4udmlkZW8tanMgLnZqcy12b2x1bWUtY29udHJvbDpob3ZlciAudmpzLXByb2dyZXNzLWhvbGRlcjpmb2N1cyAudmpzLXZvbHVtZS10b29sdGlwIHtcbiAgZGlzcGxheTogYmxvY2s7XG4gIGZvbnQtc2l6ZTogMWVtO1xuICB2aXNpYmlsaXR5OiB2aXNpYmxlO1xufVxuXG4udmlkZW8tanMgLnZqcy12b2x1bWUtdmVydGljYWw6aG92ZXIgLnZqcy12b2x1bWUtdG9vbHRpcCxcbi52aWRlby1qcyAudmpzLXZvbHVtZS12ZXJ0aWNhbDpob3ZlciAudmpzLXByb2dyZXNzLWhvbGRlcjpmb2N1cyAudmpzLXZvbHVtZS10b29sdGlwIHtcbiAgbGVmdDogMWVtO1xuICB0b3A6IC0xMnB4O1xufVxuXG4udmlkZW8tanMgLnZqcy12b2x1bWUtY29udHJvbC5kaXNhYmxlZDpob3ZlciAudmpzLXZvbHVtZS10b29sdGlwIHtcbiAgZm9udC1zaXplOiAxZW07XG59XG5cbi52aWRlby1qcyAudmpzLXZvbHVtZS1jb250cm9sIC52anMtbW91c2UtZGlzcGxheSB7XG4gIGRpc3BsYXk6IG5vbmU7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMXB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDAwO1xuICB6LWluZGV4OiAxO1xufVxuXG4udmlkZW8tanMgLnZqcy12b2x1bWUtaG9yaXpvbnRhbCAudmpzLW1vdXNlLWRpc3BsYXkge1xuICB3aWR0aDogMXB4O1xuICBoZWlnaHQ6IDEwMCU7XG59XG5cbi52anMtbm8tZmxleCAudmpzLXZvbHVtZS1jb250cm9sIC52anMtbW91c2UtZGlzcGxheSB7XG4gIHotaW5kZXg6IDA7XG59XG5cbi52aWRlby1qcyAudmpzLXZvbHVtZS1jb250cm9sOmhvdmVyIC52anMtbW91c2UtZGlzcGxheSB7XG4gIGRpc3BsYXk6IGJsb2NrO1xufVxuXG4udmlkZW8tanMudmpzLXVzZXItaW5hY3RpdmUgLnZqcy12b2x1bWUtY29udHJvbCAudmpzLW1vdXNlLWRpc3BsYXkge1xuICB2aXNpYmlsaXR5OiBoaWRkZW47XG4gIG9wYWNpdHk6IDA7XG4gIHRyYW5zaXRpb246IHZpc2liaWxpdHkgMXMsIG9wYWNpdHkgMXM7XG59XG5cbi52aWRlby1qcy52anMtdXNlci1pbmFjdGl2ZS52anMtbm8tZmxleCAudmpzLXZvbHVtZS1jb250cm9sIC52anMtbW91c2UtZGlzcGxheSB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG5cbi52anMtbW91c2UtZGlzcGxheSAudmpzLXZvbHVtZS10b29sdGlwIHtcbiAgY29sb3I6ICNmZmY7XG4gIGJhY2tncm91bmQtY29sb3I6ICMwMDA7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC44KTtcbn1cblxuLnZqcy1wb3N0ZXIge1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG4gIGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7XG4gIGJhY2tncm91bmQtcG9zaXRpb246IDUwJSA1MCU7XG4gIGJhY2tncm91bmQtc2l6ZTogY29udGFpbjtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzAwMDAwMDtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBtYXJnaW46IDA7XG4gIHBhZGRpbmc6IDA7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAwO1xuICByaWdodDogMDtcbiAgYm90dG9tOiAwO1xuICBsZWZ0OiAwO1xuICBoZWlnaHQ6IDEwMCU7XG59XG5cbi52anMtaGFzLXN0YXJ0ZWQgLnZqcy1wb3N0ZXIge1xuICBkaXNwbGF5OiBub25lO1xufVxuXG4udmpzLWF1ZGlvLnZqcy1oYXMtc3RhcnRlZCAudmpzLXBvc3RlciB7XG4gIGRpc3BsYXk6IGJsb2NrO1xufVxuXG4udmpzLXVzaW5nLW5hdGl2ZS1jb250cm9scyAudmpzLXBvc3RlciB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG5cbi52aWRlby1qcyAudmpzLWxpdmUtY29udHJvbCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xuICBmbGV4OiBhdXRvO1xuICBmb250LXNpemU6IDFlbTtcbiAgbGluZS1oZWlnaHQ6IDNlbTtcbn1cblxuLnZqcy1uby1mbGV4IC52anMtbGl2ZS1jb250cm9sIHtcbiAgZGlzcGxheTogdGFibGUtY2VsbDtcbiAgd2lkdGg6IGF1dG87XG4gIHRleHQtYWxpZ246IGxlZnQ7XG59XG5cbi52aWRlby1qczpub3QoLnZqcy1saXZlKSAudmpzLWxpdmUtY29udHJvbCxcbi52aWRlby1qcy52anMtbGl2ZXVpIC52anMtbGl2ZS1jb250cm9sIHtcbiAgZGlzcGxheTogbm9uZTtcbn1cblxuLnZpZGVvLWpzIC52anMtc2Vlay10by1saXZlLWNvbnRyb2wge1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGZsZXg6IG5vbmU7XG4gIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICBoZWlnaHQ6IDEwMCU7XG4gIHBhZGRpbmctbGVmdDogMC41ZW07XG4gIHBhZGRpbmctcmlnaHQ6IDAuNWVtO1xuICBmb250LXNpemU6IDFlbTtcbiAgbGluZS1oZWlnaHQ6IDNlbTtcbiAgd2lkdGg6IGF1dG87XG4gIG1pbi13aWR0aDogNGVtO1xufVxuXG4udmpzLW5vLWZsZXggLnZqcy1zZWVrLXRvLWxpdmUtY29udHJvbCB7XG4gIGRpc3BsYXk6IHRhYmxlLWNlbGw7XG4gIHdpZHRoOiBhdXRvO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xufVxuXG4udmlkZW8tanMudmpzLWxpdmU6bm90KC52anMtbGl2ZXVpKSAudmpzLXNlZWstdG8tbGl2ZS1jb250cm9sLFxuLnZpZGVvLWpzOm5vdCgudmpzLWxpdmUpIC52anMtc2Vlay10by1saXZlLWNvbnRyb2wge1xuICBkaXNwbGF5OiBub25lO1xufVxuXG4udmpzLXNlZWstdG8tbGl2ZS1jb250cm9sLnZqcy1jb250cm9sLnZqcy1hdC1saXZlLWVkZ2Uge1xuICBjdXJzb3I6IGF1dG87XG59XG5cbi52anMtc2Vlay10by1saXZlLWNvbnRyb2wgLnZqcy1pY29uLXBsYWNlaG9sZGVyIHtcbiAgbWFyZ2luLXJpZ2h0OiAwLjVlbTtcbiAgY29sb3I6ICM4ODg7XG59XG5cbi52anMtc2Vlay10by1saXZlLWNvbnRyb2wudmpzLWNvbnRyb2wudmpzLWF0LWxpdmUtZWRnZSAudmpzLWljb24tcGxhY2Vob2xkZXIge1xuICBjb2xvcjogcmVkO1xufVxuXG4udmlkZW8tanMgLnZqcy10aW1lLWNvbnRyb2wge1xuICBmbGV4OiBub25lO1xuICBmb250LXNpemU6IDFlbTtcbiAgbGluZS1oZWlnaHQ6IDNlbTtcbiAgbWluLXdpZHRoOiAyZW07XG4gIHdpZHRoOiBhdXRvO1xuICBwYWRkaW5nLWxlZnQ6IDFlbTtcbiAgcGFkZGluZy1yaWdodDogMWVtO1xufVxuXG4udmpzLWxpdmUgLnZqcy10aW1lLWNvbnRyb2wge1xuICBkaXNwbGF5OiBub25lO1xufVxuXG4udmlkZW8tanMgLnZqcy1jdXJyZW50LXRpbWUsXG4udmpzLW5vLWZsZXggLnZqcy1jdXJyZW50LXRpbWUge1xuICBkaXNwbGF5OiBub25lO1xufVxuXG4udmlkZW8tanMgLnZqcy1kdXJhdGlvbixcbi52anMtbm8tZmxleCAudmpzLWR1cmF0aW9uIHtcbiAgZGlzcGxheTogbm9uZTtcbn1cblxuLnZqcy10aW1lLWRpdmlkZXIge1xuICBkaXNwbGF5OiBub25lO1xuICBsaW5lLWhlaWdodDogM2VtO1xufVxuXG4udmpzLWxpdmUgLnZqcy10aW1lLWRpdmlkZXIge1xuICBkaXNwbGF5OiBub25lO1xufVxuXG4udmlkZW8tanMgLnZqcy1wbGF5LWNvbnRyb2wge1xuICBjdXJzb3I6IHBvaW50ZXI7XG59XG5cbi52aWRlby1qcyAudmpzLXBsYXktY29udHJvbCAudmpzLWljb24tcGxhY2Vob2xkZXIge1xuICBmbGV4OiBub25lO1xufVxuXG4udmpzLXRleHQtdHJhY2stZGlzcGxheSB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgYm90dG9tOiAzZW07XG4gIGxlZnQ6IDA7XG4gIHJpZ2h0OiAwO1xuICB0b3A6IDA7XG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xufVxuXG4udmlkZW8tanMudmpzLXVzZXItaW5hY3RpdmUudmpzLXBsYXlpbmcgLnZqcy10ZXh0LXRyYWNrLWRpc3BsYXkge1xuICBib3R0b206IDFlbTtcbn1cblxuLnZpZGVvLWpzIC52anMtdGV4dC10cmFjayB7XG4gIGZvbnQtc2l6ZTogMS40ZW07XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgbWFyZ2luLWJvdHRvbTogMC4xZW07XG59XG5cbi52anMtc3VidGl0bGVzIHtcbiAgY29sb3I6ICNmZmY7XG59XG5cbi52anMtY2FwdGlvbnMge1xuICBjb2xvcjogI2ZjNjtcbn1cblxuLnZqcy10dC1jdWUge1xuICBkaXNwbGF5OiBibG9jaztcbn1cblxudmlkZW86Oi13ZWJraXQtbWVkaWEtdGV4dC10cmFjay1kaXNwbGF5IHtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0zZW0pO1xufVxuXG4udmlkZW8tanMudmpzLXVzZXItaW5hY3RpdmUudmpzLXBsYXlpbmcgdmlkZW86Oi13ZWJraXQtbWVkaWEtdGV4dC10cmFjay1kaXNwbGF5IHtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0xLjVlbSk7XG59XG5cbi52aWRlby1qcyAudmpzLXBpY3R1cmUtaW4tcGljdHVyZS1jb250cm9sIHtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBmbGV4OiBub25lO1xufVxuLnZpZGVvLWpzIC52anMtZnVsbHNjcmVlbi1jb250cm9sIHtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBmbGV4OiBub25lO1xufVxuLnZqcy1wbGF5YmFjay1yYXRlID4gLnZqcy1tZW51LWJ1dHRvbixcbi52anMtcGxheWJhY2stcmF0ZSAudmpzLXBsYXliYWNrLXJhdGUtdmFsdWUge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMDtcbiAgbGVmdDogMDtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMTAwJTtcbn1cblxuLnZqcy1wbGF5YmFjay1yYXRlIC52anMtcGxheWJhY2stcmF0ZS12YWx1ZSB7XG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICBmb250LXNpemU6IDEuNWVtO1xuICBsaW5lLWhlaWdodDogMjtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xufVxuXG4udmpzLXBsYXliYWNrLXJhdGUgLnZqcy1tZW51IHtcbiAgd2lkdGg6IDRlbTtcbiAgbGVmdDogMGVtO1xufVxuXG4udmpzLWVycm9yIC52anMtZXJyb3ItZGlzcGxheSAudmpzLW1vZGFsLWRpYWxvZy1jb250ZW50IHtcbiAgZm9udC1zaXplOiAxLjRlbTtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xufVxuXG4udmpzLWVycm9yIC52anMtZXJyb3ItZGlzcGxheTpiZWZvcmUge1xuICBjb2xvcjogI2ZmZjtcbiAgY29udGVudDogXCJYXCI7XG4gIGZvbnQtZmFtaWx5OiBBcmlhbCwgSGVsdmV0aWNhLCBzYW5zLXNlcmlmO1xuICBmb250LXNpemU6IDRlbTtcbiAgbGVmdDogMDtcbiAgbGluZS1oZWlnaHQ6IDE7XG4gIG1hcmdpbi10b3A6IC0wLjVlbTtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0ZXh0LXNoYWRvdzogMC4wNWVtIDAuMDVlbSAwLjFlbSAjMDAwO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIHRvcDogNTAlO1xuICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xuICB3aWR0aDogMTAwJTtcbn1cblxuLnZqcy1sb2FkaW5nLXNwaW5uZXIge1xuICBkaXNwbGF5OiBub25lO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogNTAlO1xuICBsZWZ0OiA1MCU7XG4gIG1hcmdpbjogLTI1cHggMCAwIC0yNXB4O1xuICBvcGFjaXR5OiAwLjg1O1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBib3JkZXI6IDZweCBzb2xpZCByZ2JhKDQzLCA1MSwgNjMsIDAuNyk7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gIGJhY2tncm91bmQtY2xpcDogcGFkZGluZy1ib3g7XG4gIHdpZHRoOiA1MHB4O1xuICBoZWlnaHQ6IDUwcHg7XG4gIGJvcmRlci1yYWRpdXM6IDI1cHg7XG4gIHZpc2liaWxpdHk6IGhpZGRlbjtcbn1cblxuLnZqcy1zZWVraW5nIC52anMtbG9hZGluZy1zcGlubmVyLFxuLnZqcy13YWl0aW5nIC52anMtbG9hZGluZy1zcGlubmVyIHtcbiAgZGlzcGxheTogYmxvY2s7XG4gIC13ZWJraXQtYW5pbWF0aW9uOiB2anMtc3Bpbm5lci1zaG93IDBzIGxpbmVhciAwLjNzIGZvcndhcmRzO1xuICAgICAgICAgIGFuaW1hdGlvbjogdmpzLXNwaW5uZXItc2hvdyAwcyBsaW5lYXIgMC4zcyBmb3J3YXJkcztcbn1cblxuLnZqcy1sb2FkaW5nLXNwaW5uZXI6YmVmb3JlLFxuLnZqcy1sb2FkaW5nLXNwaW5uZXI6YWZ0ZXIge1xuICBjb250ZW50OiBcIlwiO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIG1hcmdpbjogLTZweDtcbiAgYm94LXNpemluZzogaW5oZXJpdDtcbiAgd2lkdGg6IGluaGVyaXQ7XG4gIGhlaWdodDogaW5oZXJpdDtcbiAgYm9yZGVyLXJhZGl1czogaW5oZXJpdDtcbiAgb3BhY2l0eTogMTtcbiAgYm9yZGVyOiBpbmhlcml0O1xuICBib3JkZXItY29sb3I6IHRyYW5zcGFyZW50O1xuICBib3JkZXItdG9wLWNvbG9yOiB3aGl0ZTtcbn1cblxuLnZqcy1zZWVraW5nIC52anMtbG9hZGluZy1zcGlubmVyOmJlZm9yZSxcbi52anMtc2Vla2luZyAudmpzLWxvYWRpbmctc3Bpbm5lcjphZnRlcixcbi52anMtd2FpdGluZyAudmpzLWxvYWRpbmctc3Bpbm5lcjpiZWZvcmUsXG4udmpzLXdhaXRpbmcgLnZqcy1sb2FkaW5nLXNwaW5uZXI6YWZ0ZXIge1xuICAtd2Via2l0LWFuaW1hdGlvbjogdmpzLXNwaW5uZXItc3BpbiAxLjFzIGN1YmljLWJlemllcigwLjYsIDAuMiwgMCwgMC44KSBpbmZpbml0ZSwgdmpzLXNwaW5uZXItZmFkZSAxLjFzIGxpbmVhciBpbmZpbml0ZTtcbiAgYW5pbWF0aW9uOiB2anMtc3Bpbm5lci1zcGluIDEuMXMgY3ViaWMtYmV6aWVyKDAuNiwgMC4yLCAwLCAwLjgpIGluZmluaXRlLCB2anMtc3Bpbm5lci1mYWRlIDEuMXMgbGluZWFyIGluZmluaXRlO1xufVxuXG4udmpzLXNlZWtpbmcgLnZqcy1sb2FkaW5nLXNwaW5uZXI6YmVmb3JlLFxuLnZqcy13YWl0aW5nIC52anMtbG9hZGluZy1zcGlubmVyOmJlZm9yZSB7XG4gIGJvcmRlci10b3AtY29sb3I6IHdoaXRlO1xufVxuXG4udmpzLXNlZWtpbmcgLnZqcy1sb2FkaW5nLXNwaW5uZXI6YWZ0ZXIsXG4udmpzLXdhaXRpbmcgLnZqcy1sb2FkaW5nLXNwaW5uZXI6YWZ0ZXIge1xuICBib3JkZXItdG9wLWNvbG9yOiB3aGl0ZTtcbiAgLXdlYmtpdC1hbmltYXRpb24tZGVsYXk6IDAuNDRzO1xuICBhbmltYXRpb24tZGVsYXk6IDAuNDRzO1xufVxuXG5Aa2V5ZnJhbWVzIHZqcy1zcGlubmVyLXNob3cge1xuICB0byB7XG4gICAgdmlzaWJpbGl0eTogdmlzaWJsZTtcbiAgfVxufVxuQC13ZWJraXQta2V5ZnJhbWVzIHZqcy1zcGlubmVyLXNob3cge1xuICB0byB7XG4gICAgdmlzaWJpbGl0eTogdmlzaWJsZTtcbiAgfVxufVxuQGtleWZyYW1lcyB2anMtc3Bpbm5lci1zcGluIHtcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnKTtcbiAgfVxufVxuQC13ZWJraXQta2V5ZnJhbWVzIHZqcy1zcGlubmVyLXNwaW4ge1xuICAxMDAlIHtcbiAgICAtd2Via2l0LXRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyk7XG4gIH1cbn1cbkBrZXlmcmFtZXMgdmpzLXNwaW5uZXItZmFkZSB7XG4gIDAlIHtcbiAgICBib3JkZXItdG9wLWNvbG9yOiAjNzM4NTlmO1xuICB9XG4gIDIwJSB7XG4gICAgYm9yZGVyLXRvcC1jb2xvcjogIzczODU5ZjtcbiAgfVxuICAzNSUge1xuICAgIGJvcmRlci10b3AtY29sb3I6IHdoaXRlO1xuICB9XG4gIDYwJSB7XG4gICAgYm9yZGVyLXRvcC1jb2xvcjogIzczODU5ZjtcbiAgfVxuICAxMDAlIHtcbiAgICBib3JkZXItdG9wLWNvbG9yOiAjNzM4NTlmO1xuICB9XG59XG5ALXdlYmtpdC1rZXlmcmFtZXMgdmpzLXNwaW5uZXItZmFkZSB7XG4gIDAlIHtcbiAgICBib3JkZXItdG9wLWNvbG9yOiAjNzM4NTlmO1xuICB9XG4gIDIwJSB7XG4gICAgYm9yZGVyLXRvcC1jb2xvcjogIzczODU5ZjtcbiAgfVxuICAzNSUge1xuICAgIGJvcmRlci10b3AtY29sb3I6IHdoaXRlO1xuICB9XG4gIDYwJSB7XG4gICAgYm9yZGVyLXRvcC1jb2xvcjogIzczODU5ZjtcbiAgfVxuICAxMDAlIHtcbiAgICBib3JkZXItdG9wLWNvbG9yOiAjNzM4NTlmO1xuICB9XG59XG4udmpzLWNoYXB0ZXJzLWJ1dHRvbiAudmpzLW1lbnUgdWwge1xuICB3aWR0aDogMjRlbTtcbn1cblxuLnZpZGVvLWpzIC52anMtc3Vicy1jYXBzLWJ1dHRvbiArIC52anMtbWVudSAudmpzLWNhcHRpb25zLW1lbnUtaXRlbSAudmpzLW1lbnUtaXRlbS10ZXh0IC52anMtaWNvbi1wbGFjZWhvbGRlciB7XG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgbWFyZ2luLWJvdHRvbTogLTAuMWVtO1xufVxuXG4udmlkZW8tanMgLnZqcy1zdWJzLWNhcHMtYnV0dG9uICsgLnZqcy1tZW51IC52anMtY2FwdGlvbnMtbWVudS1pdGVtIC52anMtbWVudS1pdGVtLXRleHQgLnZqcy1pY29uLXBsYWNlaG9sZGVyOmJlZm9yZSB7XG4gIGZvbnQtZmFtaWx5OiBWaWRlb0pTO1xuICBjb250ZW50OiBcIu+EjVwiO1xuICBmb250LXNpemU6IDEuNWVtO1xuICBsaW5lLWhlaWdodDogaW5oZXJpdDtcbn1cblxuLnZpZGVvLWpzIC52anMtYXVkaW8tYnV0dG9uICsgLnZqcy1tZW51IC52anMtbWFpbi1kZXNjLW1lbnUtaXRlbSAudmpzLW1lbnUtaXRlbS10ZXh0IC52anMtaWNvbi1wbGFjZWhvbGRlciB7XG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgbWFyZ2luLWJvdHRvbTogLTAuMWVtO1xufVxuXG4udmlkZW8tanMgLnZqcy1hdWRpby1idXR0b24gKyAudmpzLW1lbnUgLnZqcy1tYWluLWRlc2MtbWVudS1pdGVtIC52anMtbWVudS1pdGVtLXRleHQgLnZqcy1pY29uLXBsYWNlaG9sZGVyOmJlZm9yZSB7XG4gIGZvbnQtZmFtaWx5OiBWaWRlb0pTO1xuICBjb250ZW50OiBcIiDvhJ1cIjtcbiAgZm9udC1zaXplOiAxLjVlbTtcbiAgbGluZS1oZWlnaHQ6IGluaGVyaXQ7XG59XG5cbi52aWRlby1qcy52anMtbGF5b3V0LXNtYWxsIC52anMtY3VycmVudC10aW1lLFxuLnZpZGVvLWpzLnZqcy1sYXlvdXQtc21hbGwgLnZqcy10aW1lLWRpdmlkZXIsXG4udmlkZW8tanMudmpzLWxheW91dC1zbWFsbCAudmpzLWR1cmF0aW9uLFxuLnZpZGVvLWpzLnZqcy1sYXlvdXQtc21hbGwgLnZqcy1yZW1haW5pbmctdGltZSxcbi52aWRlby1qcy52anMtbGF5b3V0LXNtYWxsIC52anMtcGxheWJhY2stcmF0ZSxcbi52aWRlby1qcy52anMtbGF5b3V0LXNtYWxsIC52anMtY2hhcHRlcnMtYnV0dG9uLFxuLnZpZGVvLWpzLnZqcy1sYXlvdXQtc21hbGwgLnZqcy1kZXNjcmlwdGlvbnMtYnV0dG9uLFxuLnZpZGVvLWpzLnZqcy1sYXlvdXQtc21hbGwgLnZqcy1jYXB0aW9ucy1idXR0b24sXG4udmlkZW8tanMudmpzLWxheW91dC1zbWFsbCAudmpzLXN1YnRpdGxlcy1idXR0b24sXG4udmlkZW8tanMudmpzLWxheW91dC1zbWFsbCAudmpzLWF1ZGlvLWJ1dHRvbixcbi52aWRlby1qcy52anMtbGF5b3V0LXNtYWxsIC52anMtdm9sdW1lLWNvbnRyb2wsIC52aWRlby1qcy52anMtbGF5b3V0LXgtc21hbGwgLnZqcy1jdXJyZW50LXRpbWUsXG4udmlkZW8tanMudmpzLWxheW91dC14LXNtYWxsIC52anMtdGltZS1kaXZpZGVyLFxuLnZpZGVvLWpzLnZqcy1sYXlvdXQteC1zbWFsbCAudmpzLWR1cmF0aW9uLFxuLnZpZGVvLWpzLnZqcy1sYXlvdXQteC1zbWFsbCAudmpzLXJlbWFpbmluZy10aW1lLFxuLnZpZGVvLWpzLnZqcy1sYXlvdXQteC1zbWFsbCAudmpzLXBsYXliYWNrLXJhdGUsXG4udmlkZW8tanMudmpzLWxheW91dC14LXNtYWxsIC52anMtY2hhcHRlcnMtYnV0dG9uLFxuLnZpZGVvLWpzLnZqcy1sYXlvdXQteC1zbWFsbCAudmpzLWRlc2NyaXB0aW9ucy1idXR0b24sXG4udmlkZW8tanMudmpzLWxheW91dC14LXNtYWxsIC52anMtY2FwdGlvbnMtYnV0dG9uLFxuLnZpZGVvLWpzLnZqcy1sYXlvdXQteC1zbWFsbCAudmpzLXN1YnRpdGxlcy1idXR0b24sXG4udmlkZW8tanMudmpzLWxheW91dC14LXNtYWxsIC52anMtYXVkaW8tYnV0dG9uLFxuLnZpZGVvLWpzLnZqcy1sYXlvdXQteC1zbWFsbCAudmpzLXZvbHVtZS1jb250cm9sLCAudmlkZW8tanMudmpzLWxheW91dC10aW55IC52anMtY3VycmVudC10aW1lLFxuLnZpZGVvLWpzLnZqcy1sYXlvdXQtdGlueSAudmpzLXRpbWUtZGl2aWRlcixcbi52aWRlby1qcy52anMtbGF5b3V0LXRpbnkgLnZqcy1kdXJhdGlvbixcbi52aWRlby1qcy52anMtbGF5b3V0LXRpbnkgLnZqcy1yZW1haW5pbmctdGltZSxcbi52aWRlby1qcy52anMtbGF5b3V0LXRpbnkgLnZqcy1wbGF5YmFjay1yYXRlLFxuLnZpZGVvLWpzLnZqcy1sYXlvdXQtdGlueSAudmpzLWNoYXB0ZXJzLWJ1dHRvbixcbi52aWRlby1qcy52anMtbGF5b3V0LXRpbnkgLnZqcy1kZXNjcmlwdGlvbnMtYnV0dG9uLFxuLnZpZGVvLWpzLnZqcy1sYXlvdXQtdGlueSAudmpzLWNhcHRpb25zLWJ1dHRvbixcbi52aWRlby1qcy52anMtbGF5b3V0LXRpbnkgLnZqcy1zdWJ0aXRsZXMtYnV0dG9uLFxuLnZpZGVvLWpzLnZqcy1sYXlvdXQtdGlueSAudmpzLWF1ZGlvLWJ1dHRvbixcbi52aWRlby1qcy52anMtbGF5b3V0LXRpbnkgLnZqcy12b2x1bWUtY29udHJvbCB7XG4gIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcbn1cbi52aWRlby1qcy52anMtbGF5b3V0LXNtYWxsIC52anMtdm9sdW1lLXBhbmVsLnZqcy12b2x1bWUtcGFuZWwtaG9yaXpvbnRhbDpob3Zlcixcbi52aWRlby1qcy52anMtbGF5b3V0LXNtYWxsIC52anMtdm9sdW1lLXBhbmVsLnZqcy12b2x1bWUtcGFuZWwtaG9yaXpvbnRhbDphY3RpdmUsXG4udmlkZW8tanMudmpzLWxheW91dC1zbWFsbCAudmpzLXZvbHVtZS1wYW5lbC52anMtdm9sdW1lLXBhbmVsLWhvcml6b250YWwudmpzLXNsaWRlci1hY3RpdmUsIC52aWRlby1qcy52anMtbGF5b3V0LXgtc21hbGwgLnZqcy12b2x1bWUtcGFuZWwudmpzLXZvbHVtZS1wYW5lbC1ob3Jpem9udGFsOmhvdmVyLFxuLnZpZGVvLWpzLnZqcy1sYXlvdXQteC1zbWFsbCAudmpzLXZvbHVtZS1wYW5lbC52anMtdm9sdW1lLXBhbmVsLWhvcml6b250YWw6YWN0aXZlLFxuLnZpZGVvLWpzLnZqcy1sYXlvdXQteC1zbWFsbCAudmpzLXZvbHVtZS1wYW5lbC52anMtdm9sdW1lLXBhbmVsLWhvcml6b250YWwudmpzLXNsaWRlci1hY3RpdmUsIC52aWRlby1qcy52anMtbGF5b3V0LXRpbnkgLnZqcy12b2x1bWUtcGFuZWwudmpzLXZvbHVtZS1wYW5lbC1ob3Jpem9udGFsOmhvdmVyLFxuLnZpZGVvLWpzLnZqcy1sYXlvdXQtdGlueSAudmpzLXZvbHVtZS1wYW5lbC52anMtdm9sdW1lLXBhbmVsLWhvcml6b250YWw6YWN0aXZlLFxuLnZpZGVvLWpzLnZqcy1sYXlvdXQtdGlueSAudmpzLXZvbHVtZS1wYW5lbC52anMtdm9sdW1lLXBhbmVsLWhvcml6b250YWwudmpzLXNsaWRlci1hY3RpdmUge1xuICB3aWR0aDogYXV0bztcbiAgd2lkdGg6IGluaXRpYWw7XG59XG4udmlkZW8tanMudmpzLWxheW91dC14LXNtYWxsOm5vdCgudmpzLWxpdmV1aSkgLnZqcy1zdWJzLWNhcHMtYnV0dG9uLCAudmlkZW8tanMudmpzLWxheW91dC14LXNtYWxsOm5vdCgudmpzLWxpdmUpIC52anMtc3Vicy1jYXBzLWJ1dHRvbiwgLnZpZGVvLWpzLnZqcy1sYXlvdXQtdGlueSAudmpzLXN1YnMtY2Fwcy1idXR0b24ge1xuICBkaXNwbGF5OiBub25lO1xufVxuLnZpZGVvLWpzLnZqcy1sYXlvdXQteC1zbWFsbC52anMtbGl2ZXVpIC52anMtY3VzdG9tLWNvbnRyb2wtc3BhY2VyLCAudmlkZW8tanMudmpzLWxheW91dC10aW55IC52anMtY3VzdG9tLWNvbnRyb2wtc3BhY2VyIHtcbiAgZmxleDogYXV0bztcbiAgZGlzcGxheTogYmxvY2s7XG59XG4udmlkZW8tanMudmpzLWxheW91dC14LXNtYWxsLnZqcy1saXZldWkudmpzLW5vLWZsZXggLnZqcy1jdXN0b20tY29udHJvbC1zcGFjZXIsIC52aWRlby1qcy52anMtbGF5b3V0LXRpbnkudmpzLW5vLWZsZXggLnZqcy1jdXN0b20tY29udHJvbC1zcGFjZXIge1xuICB3aWR0aDogYXV0bztcbn1cbi52aWRlby1qcy52anMtbGF5b3V0LXgtc21hbGwudmpzLWxpdmV1aSAudmpzLXByb2dyZXNzLWNvbnRyb2wsIC52aWRlby1qcy52anMtbGF5b3V0LXRpbnkgLnZqcy1wcm9ncmVzcy1jb250cm9sIHtcbiAgZGlzcGxheTogbm9uZTtcbn1cblxuLnZqcy1tb2RhbC1kaWFsb2cudmpzLXRleHQtdHJhY2stc2V0dGluZ3Mge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMkIzMzNGO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDQzLCA1MSwgNjMsIDAuNzUpO1xuICBjb2xvcjogI2ZmZjtcbiAgaGVpZ2h0OiA3MCU7XG59XG5cbi52anMtdGV4dC10cmFjay1zZXR0aW5ncyAudmpzLW1vZGFsLWRpYWxvZy1jb250ZW50IHtcbiAgZGlzcGxheTogdGFibGU7XG59XG5cbi52anMtdGV4dC10cmFjay1zZXR0aW5ncyAudmpzLXRyYWNrLXNldHRpbmdzLWNvbG9ycyxcbi52anMtdGV4dC10cmFjay1zZXR0aW5ncyAudmpzLXRyYWNrLXNldHRpbmdzLWZvbnQsXG4udmpzLXRleHQtdHJhY2stc2V0dGluZ3MgLnZqcy10cmFjay1zZXR0aW5ncy1jb250cm9scyB7XG4gIGRpc3BsYXk6IHRhYmxlLWNlbGw7XG59XG5cbi52anMtdGV4dC10cmFjay1zZXR0aW5ncyAudmpzLXRyYWNrLXNldHRpbmdzLWNvbnRyb2xzIHtcbiAgdGV4dC1hbGlnbjogcmlnaHQ7XG4gIHZlcnRpY2FsLWFsaWduOiBib3R0b207XG59XG5cbkBzdXBwb3J0cyAoZGlzcGxheTogZ3JpZCkge1xuICAudmpzLXRleHQtdHJhY2stc2V0dGluZ3MgLnZqcy1tb2RhbC1kaWFsb2ctY29udGVudCB7XG4gICAgZGlzcGxheTogZ3JpZDtcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAxZnI7XG4gICAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiAxZnI7XG4gICAgcGFkZGluZzogMjBweCAyNHB4IDBweCAyNHB4O1xuICB9XG5cbiAgLnZqcy10cmFjay1zZXR0aW5ncy1jb250cm9scyAudmpzLWRlZmF1bHQtYnV0dG9uIHtcbiAgICBtYXJnaW4tYm90dG9tOiAyMHB4O1xuICB9XG5cbiAgLnZqcy10ZXh0LXRyYWNrLXNldHRpbmdzIC52anMtdHJhY2stc2V0dGluZ3MtY29udHJvbHMge1xuICAgIGdyaWQtY29sdW1uOiAxLy0xO1xuICB9XG5cbiAgLnZqcy1sYXlvdXQtc21hbGwgLnZqcy10ZXh0LXRyYWNrLXNldHRpbmdzIC52anMtbW9kYWwtZGlhbG9nLWNvbnRlbnQsXG4udmpzLWxheW91dC14LXNtYWxsIC52anMtdGV4dC10cmFjay1zZXR0aW5ncyAudmpzLW1vZGFsLWRpYWxvZy1jb250ZW50LFxuLnZqcy1sYXlvdXQtdGlueSAudmpzLXRleHQtdHJhY2stc2V0dGluZ3MgLnZqcy1tb2RhbC1kaWFsb2ctY29udGVudCB7XG4gICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnI7XG4gIH1cbn1cbi52anMtdHJhY2stc2V0dGluZyA+IHNlbGVjdCB7XG4gIG1hcmdpbi1yaWdodDogMWVtO1xuICBtYXJnaW4tYm90dG9tOiAwLjVlbTtcbn1cblxuLnZqcy10ZXh0LXRyYWNrLXNldHRpbmdzIGZpZWxkc2V0IHtcbiAgbWFyZ2luOiA1cHg7XG4gIHBhZGRpbmc6IDNweDtcbiAgYm9yZGVyOiBub25lO1xufVxuXG4udmpzLXRleHQtdHJhY2stc2V0dGluZ3MgZmllbGRzZXQgc3BhbiB7XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbn1cblxuLnZqcy10ZXh0LXRyYWNrLXNldHRpbmdzIGZpZWxkc2V0IHNwYW4gPiBzZWxlY3Qge1xuICBtYXgtd2lkdGg6IDcuM2VtO1xufVxuXG4udmpzLXRleHQtdHJhY2stc2V0dGluZ3MgbGVnZW5kIHtcbiAgY29sb3I6ICNmZmY7XG4gIG1hcmdpbjogMCAwIDVweCAwO1xufVxuXG4udmpzLXRleHQtdHJhY2stc2V0dGluZ3MgLnZqcy1sYWJlbCB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgY2xpcDogcmVjdCgxcHggMXB4IDFweCAxcHgpO1xuICBjbGlwOiByZWN0KDFweCwgMXB4LCAxcHgsIDFweCk7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICBtYXJnaW46IDAgMCA1cHggMDtcbiAgcGFkZGluZzogMDtcbiAgYm9yZGVyOiAwO1xuICBoZWlnaHQ6IDFweDtcbiAgd2lkdGg6IDFweDtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbn1cblxuLnZqcy10cmFjay1zZXR0aW5ncy1jb250cm9scyBidXR0b246Zm9jdXMsXG4udmpzLXRyYWNrLXNldHRpbmdzLWNvbnRyb2xzIGJ1dHRvbjphY3RpdmUge1xuICBvdXRsaW5lLXN0eWxlOiBzb2xpZDtcbiAgb3V0bGluZS13aWR0aDogbWVkaXVtO1xuICBiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQoMGRlZywgI2ZmZiA4OCUsICM3Mzg1OWYgMTAwJSk7XG59XG5cbi52anMtdHJhY2stc2V0dGluZ3MtY29udHJvbHMgYnV0dG9uOmhvdmVyIHtcbiAgY29sb3I6IHJnYmEoNDMsIDUxLCA2MywgMC43NSk7XG59XG5cbi52anMtdHJhY2stc2V0dGluZ3MtY29udHJvbHMgYnV0dG9uIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcbiAgYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KC0xODBkZWcsICNmZmYgODglLCAjNzM4NTlmIDEwMCUpO1xuICBjb2xvcjogIzJCMzMzRjtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBib3JkZXItcmFkaXVzOiAycHg7XG59XG5cbi52anMtdHJhY2stc2V0dGluZ3MtY29udHJvbHMgLnZqcy1kZWZhdWx0LWJ1dHRvbiB7XG4gIG1hcmdpbi1yaWdodDogMWVtO1xufVxuXG5AbWVkaWEgcHJpbnQge1xuICAudmlkZW8tanMgPiAqOm5vdCgudmpzLXRlY2gpOm5vdCgudmpzLXBvc3Rlcikge1xuICAgIHZpc2liaWxpdHk6IGhpZGRlbjtcbiAgfVxufVxuLnZqcy1yZXNpemUtbWFuYWdlciB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAwO1xuICBsZWZ0OiAwO1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAxMDAlO1xuICBib3JkZXI6IG5vbmU7XG4gIHotaW5kZXg6IC0xMDAwO1xufVxuXG4uanMtZm9jdXMtdmlzaWJsZSAudmlkZW8tanMgKjpmb2N1czpub3QoLmZvY3VzLXZpc2libGUpIHtcbiAgb3V0bGluZTogbm9uZTtcbn1cblxuLnZpZGVvLWpzICo6Zm9jdXM6bm90KDpmb2N1cy12aXNpYmxlKSB7XG4gIG91dGxpbmU6IG5vbmU7XG59XG4iLCJAaW1wb3J0ICd+dmlkZW8uanMvZGlzdC92aWRlby1qcy5jc3MnO1xyXG5odG1sIHtcclxuICAgIG92ZXJmbG93LXg6IGhpZGRlbjtcclxuICAgIGZvbnQtZmFtaWx5OiAnTHVjaWRhIFNhbnMnLHNhbnMtc2VyaWY7XHJcbiAgICBtYXJnaW46IDAgLThweDtcclxufVxyXG5cclxuXHJcblxyXG4iXX0= */"];



/***/ }),

/***/ "qJKH":
/*!**************************************************************!*\
  !*** ./src/app/livestream/livestream.component.ngfactory.js ***!
  \**************************************************************/
/*! exports provided: RenderType_LivestreamComponent, View_LivestreamComponent_0, View_LivestreamComponent_Host_0, LivestreamComponentNgFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RenderType_LivestreamComponent", function() { return RenderType_LivestreamComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_LivestreamComponent_0", function() { return View_LivestreamComponent_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_LivestreamComponent_Host_0", function() { return View_LivestreamComponent_Host_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LivestreamComponentNgFactory", function() { return LivestreamComponentNgFactory; });
/* harmony import */ var _livestream_component_css_ngstyle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./livestream.component.css.ngstyle */ "TYUN");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "8Y7J");
/* harmony import */ var _header_header_component_ngfactory__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../header/header.component.ngfactory */ "a18t");
/* harmony import */ var _header_header_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../header/header.component */ "fECr");
/* harmony import */ var _securelink_securelink_component_ngfactory__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../securelink/securelink.component.ngfactory */ "O8d0");
/* harmony import */ var _securelink_securelink_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../securelink/securelink.component */ "UusY");
/* harmony import */ var _livestream_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./livestream.component */ "a/xx");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common/http */ "IheW");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes,extraRequire}
 * tslint:disable
 */








var styles_LivestreamComponent = ["\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZpZGVvanMtcmVzb2x1dGlvbi1zd2l0Y2hlci5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7S0FrQ0siLCJmaWxlIjoidmlkZW9qcy1yZXNvbHV0aW9uLXN3aXRjaGVyLmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC52anMtcmVzb2x1dGlvbi1idXR0b24gLnZqcy1tZW51LWljb246YmVmb3JlIHtcclxuICAgIGNvbnRlbnQ6ICdcXGYxMTAnO1xyXG4gICAgZm9udC1mYW1pbHk6IFZpZGVvSlM7XHJcbiAgICBmb250LXdlaWdodDogbm9ybWFsO1xyXG4gICAgZm9udC1zdHlsZTogbm9ybWFsO1xyXG4gICAgZm9udC1zaXplOiAxLjhlbTtcclxuICAgIGxpbmUtaGVpZ2h0OiAxLjY3ZW07XHJcbiAgfVxyXG4gIFxyXG4gIC52anMtcmVzb2x1dGlvbi1idXR0b24gLnZqcy1yZXNvbHV0aW9uLWJ1dHRvbi1sYWJlbCB7XHJcbiAgICBmb250LXNpemU6IDFlbTtcclxuICAgIGxpbmUtaGVpZ2h0OiAzZW07XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICB0b3A6IDA7XHJcbiAgICBsZWZ0OiAwO1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICBib3gtc2l6aW5nOiBpbmhlcml0O1xyXG4gIH1cclxuICBcclxuICAudmpzLXJlc29sdXRpb24tYnV0dG9uIC52anMtbWVudSAudmpzLW1lbnUtY29udGVudCB7XHJcbiAgICB3aWR0aDogNGVtO1xyXG4gICAgbGVmdDogNTAlO1xyXG4gICAgbWFyZ2luLWxlZnQ6IC0yZW07XHJcbiAgfVxyXG4gIFxyXG4gIC52anMtcmVzb2x1dGlvbi1idXR0b24gLnZqcy1tZW51IGxpIHtcclxuICAgIHRleHQtdHJhbnNmb3JtOiBub25lO1xyXG4gICAgZm9udC1zaXplOiAxZW07XHJcbiAgfVxyXG5cclxuICAudmpzLXZvbHVtZS1jb250cm9sIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IHJlZDtcclxuICB9ICovIl19 */", _livestream_component_css_ngstyle__WEBPACK_IMPORTED_MODULE_0__["styles"]];
var RenderType_LivestreamComponent = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵcrt"]({ encapsulation: 2, styles: styles_LivestreamComponent, data: {} });

function View_LivestreamComponent_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 0, "link", [["href", "https://vjs.zencdn.net/7.11.4/video-js.css"], ["rel", "stylesheet"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 0, "link", [["href", "https://css.gg/play-button.css"], ["rel", "stylesheet"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](2, 0, null, null, 1, "app-header", [], null, null, null, _header_header_component_ngfactory__WEBPACK_IMPORTED_MODULE_2__["View_HeaderComponent_0"], _header_header_component_ngfactory__WEBPACK_IMPORTED_MODULE_2__["RenderType_HeaderComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](3, 114688, null, 0, _header_header_component__WEBPACK_IMPORTED_MODULE_3__["HeaderComponent"], [], null, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](4, 0, null, null, 4, "div", [["id", "newFluxDiv"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](5, 0, null, null, 1, "p", [["id", "newFlux"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["Une retransmission en direct est en cours."])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](7, 0, null, null, 1, "button", [["id", "buttonLive"]], null, [[null, "click"]], function (_v, en, $event) { var ad = true; var _co = _v.component; if (("click" === en)) {
        var pd_0 = (_co.changeSrc("live") !== false);
        ad = (pd_0 && ad);
    } return ad; }, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["Voir le live"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](9, 0, null, null, 6, "div", [["id", "contenu"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](10, 0, null, null, 5, "video", [["class", "vjs-styling video-js"], ["controls", ""], ["data-setup", "{\"fluid\":true}"], ["id", "my-video"], ["poster", ""], ["preload", "auto"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](11, 0, null, null, 0, "source", [["src", "http://192.168.13.110:8080/live/index.m3u8"], ["type", "application/x-mpegURL"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](12, 0, null, null, 3, "p", [["class", "vjs-no-js"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, [" To view this video please enable JavaScript, and consider upgrading to a web browser that "])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](14, 0, null, null, 1, "a", [["href", "https://videojs.com/html5-video-support/"], ["target", "_blank"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["supports HTML5 video"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](16, 0, null, null, 2, "div", [["id", "secureLinkDiv"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](17, 0, null, null, 1, "app-securelink", [], null, [["document", "click"]], function (_v, en, $event) { var ad = true; if (("document:click" === en)) {
        var pd_0 = (_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 18).onDocumentClick($event) !== false);
        ad = (pd_0 && ad);
    } return ad; }, _securelink_securelink_component_ngfactory__WEBPACK_IMPORTED_MODULE_4__["View_SecurelinkComponent_0"], _securelink_securelink_component_ngfactory__WEBPACK_IMPORTED_MODULE_4__["RenderType_SecurelinkComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](18, 114688, null, 0, _securelink_securelink_component__WEBPACK_IMPORTED_MODULE_5__["SecurelinkComponent"], [], null, null)], function (_ck, _v) { _ck(_v, 3, 0); _ck(_v, 18, 0); }, null); }
function View_LivestreamComponent_Host_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 1, "app-livestream", [], null, null, null, View_LivestreamComponent_0, RenderType_LivestreamComponent)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](1, 114688, null, 0, _livestream_component__WEBPACK_IMPORTED_MODULE_6__["LivestreamComponent"], [_angular_common_http__WEBPACK_IMPORTED_MODULE_7__["HttpClient"]], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
var LivestreamComponentNgFactory = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵccf"]("app-livestream", _livestream_component__WEBPACK_IMPORTED_MODULE_6__["LivestreamComponent"], View_LivestreamComponent_Host_0, {}, {}, []);



/***/ }),

/***/ "uwR5":
/*!********************************************************!*\
  !*** ./src/app/replays/replays.component.ngfactory.js ***!
  \********************************************************/
/*! exports provided: RenderType_ReplaysComponent, View_ReplaysComponent_0, View_ReplaysComponent_Host_0, ReplaysComponentNgFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RenderType_ReplaysComponent", function() { return RenderType_ReplaysComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_ReplaysComponent_0", function() { return View_ReplaysComponent_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_ReplaysComponent_Host_0", function() { return View_ReplaysComponent_Host_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReplaysComponentNgFactory", function() { return ReplaysComponentNgFactory; });
/* harmony import */ var _replays_component_css_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./replays.component.css.shim.ngstyle */ "C4TS");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "8Y7J");
/* harmony import */ var _node_modules_angular_material_progress_bar_index_ngfactory__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../node_modules/@angular/material/progress-bar/index.ngfactory */ "0mH+");
/* harmony import */ var _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/progress-bar */ "BTe0");
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/platform-browser/animations */ "omvX");
/* harmony import */ var _header_header_component_ngfactory__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../header/header.component.ngfactory */ "a18t");
/* harmony import */ var _header_header_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../header/header.component */ "fECr");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ "SVse");
/* harmony import */ var _replays_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./replays.component */ "409T");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/common/http */ "IheW");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes,extraRequire}
 * tslint:disable
 */










var styles_ReplaysComponent = [_replays_component_css_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__["styles"]];
var RenderType_ReplaysComponent = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵcrt"]({ encapsulation: 0, styles: styles_ReplaysComponent, data: {} });

function View_ReplaysComponent_1(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 23, "div", [["id", "mainDiv"]], [[4, "display", null]], null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 11, "div", [["class", "interDiv"]], null, [[null, "click"]], function (_v, en, $event) { var ad = true; var _co = _v.component; if (("click" === en)) {
        var pd_0 = (_co.moveToInterReplay(_v.context.$implicit) !== false);
        ad = (pd_0 && ad);
    } return ad; }, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](2, 0, null, null, 0, "img", [["class", "numberVideoImg"], ["src", "../../assets/camera.png"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](3, 0, null, null, 2, "p", [["class", "numberVideo"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](4, 0, null, null, 1, "b", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](5, null, ["", ""])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](6, 0, null, null, 0, "img", [["class", "miniature"]], [[8, "src", 4]], [[null, "error"]], function (_v, en, $event) { var ad = true; var _co = _v.component; if (("error" === en)) {
        var pd_0 = (_co.defaultImage !== false);
        ad = (pd_0 && ad);
    } return ad; }, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](7, 0, null, null, 2, "div", [["class", "infoVideo"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](8, 0, null, null, 1, "p", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](9, null, ["", "", ""])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](10, 0, null, null, 2, "div", [["class", "infoVideo"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](11, 0, null, null, 1, "p", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](12, null, ["", ""])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](13, 0, null, null, 10, "div", [["class", "interDivChoice"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](14, 0, null, null, 0, "img", [["class", "miniature"]], [[8, "src", 4]], [[null, "error"]], function (_v, en, $event) { var ad = true; var _co = _v.component; if (("error" === en)) {
        var pd_0 = (_co.defaultImage !== false);
        ad = (pd_0 && ad);
    } return ad; }, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](15, 0, null, null, 8, "div", [["class", "bothButtons"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](16, 0, null, null, 3, "div", [["class", "buttonReplay"]], null, [[null, "click"]], function (_v, en, $event) { var ad = true; var _co = _v.component; if (("click" === en)) {
        var pd_0 = (_co.moveToInterReplay(_v.context.$implicit) !== false);
        ad = (pd_0 && ad);
    } return ad; }, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](17, 0, null, null, 0, "img", [["class", "choiceImage"], ["src", "../../assets/camera.png"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](18, 0, null, null, 1, "p", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](19, null, ["Revisionnage (", " vid\u00E9os)"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](20, 0, null, null, 3, "div", [["class", "buttonStats"]], null, [[null, "click"]], function (_v, en, $event) { var ad = true; var _co = _v.component; if (("click" === en)) {
        var pd_0 = (_co.moveToInterStats(_v.context.$implicit) !== false);
        ad = (pd_0 && ad);
    } return ad; }, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](21, 0, null, null, 0, "img", [["class", "choiceImage"], ["src", "../../assets/stats.png"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](22, 0, null, null, 1, "p", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["Statistiques"]))], null, function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.styleChoixInter; _ck(_v, 0, 0, currVal_0); var currVal_1 = _v.context.$implicit.numberOfVideos; _ck(_v, 5, 0, currVal_1); var currVal_2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵinlineInterpolate"](1, "", _v.context.$implicit.imageSource, ""); _ck(_v, 6, 0, currVal_2); var currVal_3 = _v.context.$implicit.commune; var currVal_4 = _v.context.$implicit.street; _ck(_v, 9, 0, currVal_3, currVal_4); var currVal_5 = _v.context.$implicit.startTime; _ck(_v, 12, 0, currVal_5); var currVal_6 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵinlineInterpolate"](1, "", _v.context.$implicit.imageSource, ""); _ck(_v, 14, 0, currVal_6); var currVal_7 = _v.context.$implicit.numberOfVideos; _ck(_v, 19, 0, currVal_7); }); }
function View_ReplaysComponent_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 1, "mat-progress-bar", [["aria-valuemax", "100"], ["aria-valuemin", "0"], ["class", "loading mat-progress-bar"], ["mode", "indeterminate"], ["role", "progressbar"], ["tabindex", "-1"]], [[4, "display", null], [1, "aria-valuenow", 0], [1, "mode", 0], [2, "_mat-animation-noopable", null]], null, null, _node_modules_angular_material_progress_bar_index_ngfactory__WEBPACK_IMPORTED_MODULE_2__["View_MatProgressBar_0"], _node_modules_angular_material_progress_bar_index_ngfactory__WEBPACK_IMPORTED_MODULE_2__["RenderType_MatProgressBar"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](1, 4374528, null, 0, _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_3__["MatProgressBar"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["NgZone"], [2, _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_4__["ANIMATION_MODULE_TYPE"]], [2, _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_3__["MAT_PROGRESS_BAR_LOCATION"]]], { mode: [0, "mode"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](2, 0, null, null, 1, "app-header", [], null, null, null, _header_header_component_ngfactory__WEBPACK_IMPORTED_MODULE_5__["View_HeaderComponent_0"], _header_header_component_ngfactory__WEBPACK_IMPORTED_MODULE_5__["RenderType_HeaderComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](3, 114688, null, 0, _header_header_component__WEBPACK_IMPORTED_MODULE_6__["HeaderComponent"], [], null, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_ReplaysComponent_1)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](5, 278528, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_7__["NgForOf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["IterableDiffers"]], { ngForOf: [0, "ngForOf"] }, null)], function (_ck, _v) { var _co = _v.component; var currVal_4 = "indeterminate"; _ck(_v, 1, 0, currVal_4); _ck(_v, 3, 0); var currVal_5 = _co.inters; _ck(_v, 5, 0, currVal_5); }, function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.displayLoading; var currVal_1 = (((_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 1).mode === "indeterminate") || (_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 1).mode === "query")) ? null : _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 1).value); var currVal_2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 1).mode; var currVal_3 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 1)._isNoopAnimation; _ck(_v, 0, 0, currVal_0, currVal_1, currVal_2, currVal_3); }); }
function View_ReplaysComponent_Host_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 1, "app-replays", [], null, null, null, View_ReplaysComponent_0, RenderType_ReplaysComponent)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](1, 114688, null, 0, _replays_component__WEBPACK_IMPORTED_MODULE_8__["ReplaysComponent"], [_angular_common_http__WEBPACK_IMPORTED_MODULE_9__["HttpClient"]], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
var ReplaysComponentNgFactory = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵccf"]("app-replays", _replays_component__WEBPACK_IMPORTED_MODULE_8__["ReplaysComponent"], View_ReplaysComponent_Host_0, {}, {}, []);



/***/ }),

/***/ "vY5A":
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var _cartography_cartography_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cartography/cartography.component */ "24Si");
/* harmony import */ var _livestream_livestream_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./livestream/livestream.component */ "a/xx");
/* harmony import */ var _replayinter_replayinter_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./replayinter/replayinter.component */ "WkRK");
/* harmony import */ var _replays_replays_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./replays/replays.component */ "409T");
/* harmony import */ var _statistics_statistics_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./statistics/statistics.component */ "4QAB");





const routes = [
    { path: 'live', component: _livestream_livestream_component__WEBPACK_IMPORTED_MODULE_1__["LivestreamComponent"] },
    { path: 'replays', component: _replays_replays_component__WEBPACK_IMPORTED_MODULE_3__["ReplaysComponent"] },
    { path: 'replay', component: _replayinter_replayinter_component__WEBPACK_IMPORTED_MODULE_2__["ReplayinterComponent"] },
    { path: 'stats', component: _statistics_statistics_component__WEBPACK_IMPORTED_MODULE_4__["StatisticsComponent"] },
    { path: 'carto', component: _cartography_cartography_component__WEBPACK_IMPORTED_MODULE_0__["CartographyComponent"] },
    { path: 'limited', component: _livestream_livestream_component__WEBPACK_IMPORTED_MODULE_1__["LivestreamComponent"] },
    { path: '**', component: _cartography_cartography_component__WEBPACK_IMPORTED_MODULE_0__["CartographyComponent"] },
];
class AppRoutingModule {
}


/***/ }),

/***/ "yvrC":
/*!********************************************!*\
  !*** ./src/app/app.component.ngfactory.js ***!
  \********************************************/
/*! exports provided: RenderType_AppComponent, View_AppComponent_0, View_AppComponent_Host_0, AppComponentNgFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RenderType_AppComponent", function() { return RenderType_AppComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_AppComponent_0", function() { return View_AppComponent_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_AppComponent_Host_0", function() { return View_AppComponent_Host_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponentNgFactory", function() { return AppComponentNgFactory; });
/* harmony import */ var _app_component_css_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app.component.css.shim.ngstyle */ "lwNt");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "8Y7J");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "iInd");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app.component */ "Sy1n");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes,extraRequire}
 * tslint:disable
 */




var styles_AppComponent = [_app_component_css_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__["styles"]];
var RenderType_AppComponent = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵcrt"]({ encapsulation: 0, styles: styles_AppComponent, data: {} });

function View_AppComponent_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 1, "head", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 0, "meta", [["charset", "UTF-8"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](2, 0, null, null, 2, "body", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](3, 16777216, null, null, 1, "router-outlet", [], null, null, null, null, null)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](4, 212992, null, 0, _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterOutlet"], [_angular_router__WEBPACK_IMPORTED_MODULE_2__["ChildrenOutletContexts"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["ComponentFactoryResolver"], [8, null], _angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"]], null, null)], function (_ck, _v) { _ck(_v, 4, 0); }, null); }
function View_AppComponent_Host_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 1, "app-root", [], null, null, null, View_AppComponent_0, RenderType_AppComponent)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](1, 114688, null, 0, _app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"], [], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
var AppComponentNgFactory = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵccf"]("app-root", _app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"], View_AppComponent_Host_0, {}, {}, []);



/***/ }),

/***/ "zUnb":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "8Y7J");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./environments/environment */ "AytR");
/* harmony import */ var _app_app_module_ngfactory__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module.ngfactory */ "Ss9G");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/platform-browser */ "cUpR");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
_angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__["platformBrowser"]().bootstrapModuleFactory(_app_app_module_ngfactory__WEBPACK_IMPORTED_MODULE_2__["AppModuleNgFactory"])
    .catch(err => console.error(err));


/***/ }),

/***/ "zn8P":
/*!******************************************************!*\
  !*** ./$$_lazy_route_resource lazy namespace object ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "zn8P";

/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map