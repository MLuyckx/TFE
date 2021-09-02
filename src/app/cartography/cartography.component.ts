import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {fromLonLat, transform} from 'ol/proj';
import VectorSource from 'ol/source/vector';
import Vector from 'ol/layer/vector';
import { Feature } from 'ol';
import LineString from 'ol/geom/LineString';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import { JsonPipe } from '@angular/common';
import PointerInteraction  from 'ol/interaction/Pointer';
import Point from 'ol/geom/Point';
import Circle from 'ol/style/Circle';
import { ConstantPool } from '@angular/compiler';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-cartography',
  templateUrl: './cartography.component.html',
  styleUrls: ['./cartography.component.css']
})
export class CartographyComponent implements OnInit {

  dataJson:any = [];
  @Input() idVol:any;
  constructor(private http: HttpClient) {
      
   }

  //Définition de variables globales
  
  map: Map | undefined;
  coordinate: number[] = [0, 0];

  currentHour: string = "00h00m00s";
  currentFlightTime: string = "00m00s";
  currentBatteryLevel: number = 0;
  currentHeight: number = 0;
  currentAcYaw: number = 0;
  currentGbYaw: number = 0;

  vectorLineLayer:any;
  vectorLine: any= new VectorSource({});
  vectorPoint: any;
  vectorPointLayer: any;
  featurePoint: any;
  lastFeature: any;


  styleArrowAircraft:object = {};
  styleArrowGimbal:object = {};

  //Lorsque le curseur bouge/clique sur la carte :
  onPointerMoveAndClick(evt: any) {
    var heureDate: string = "";
    var tempsVol: number = 0;
    var batteryPercent: number = 0;
    var height: number = 0;
    var acYaw: number = 0;
    var gbYaw: number = 0;
    var points = evt.coordinate;
    this.coordinate = transform(points,'EPSG:3857', 'EPSG:4326');

    var featureSelected = this.vectorLine.getClosestFeatureToCoordinate(evt.coordinate);
    this.drawClosestPoint(featureSelected);
    heureDate = featureSelected.values_.properties[0].date;
    tempsVol = featureSelected.values_.properties[1].flightTime
    batteryPercent = featureSelected.values_.properties[2].battery;
    height = featureSelected.values_.properties[3].height;
    acYaw = featureSelected.values_.properties[4].aircraftYaw;
    gbYaw = featureSelected.values_.properties[5].gimbalYaw;
    this.lastFeature = featureSelected;

    this.styleArrowAircraft = {'transform' : ('rotate(' + acYaw + 'deg)')}
    this.styleArrowGimbal = {'transform' : ('rotate(' + gbYaw + 'deg)')}

    
    this.currentHour = this.changeHourFormat(heureDate);
    this.currentFlightTime = this.changeFlightTimeFormat(tempsVol.toString());
    this.currentBatteryLevel = batteryPercent;
    this.currentHeight = this.changeHeightFormat(height);
    this.currentAcYaw = acYaw;
    this.currentGbYaw = gbYaw;
  }

  // Modifie un format d'heure
  // Exemple : changeHourFormat("04:23:55 PM") -> "16h23m55s"
  changeHourFormat(hour:string) {
    var piece = hour.split(":")
    if(hour[hour.length-2] == 'P'){
      if(parseInt(piece[0]) == 12) {
        var heures = piece[0];
      } else {
        var heures = (parseInt(piece[0]) + 12).toString();
      }
    } else {
      if(parseInt(piece[0]) == 12) {
        var heures = "00";
      }
      if(parseInt(piece[0]) < 10) {
          var heures = "0" + piece[0];
      }
      var heures = piece[0];
    }
    var minutes = piece[1];
    var secondes = piece[2].substring(0,2);
    var timeShowed = heures + "h" + minutes + "m" + secondes + "s";
    return timeShowed;
  }

  // Change le format du temps de vol (secondes -> minutes/secondes)
  // changeFlightTimeFormat(61) -> 1m01s
  changeFlightTimeFormat(flightTime: string) {
    if(flightTime.includes(",")) {
      flightTime = flightTime.replace(/,/g, "");
    }
    if(flightTime.includes('"')) {
      flightTime = flightTime.replace(/"/g, "");
    }
    if(flightTime.includes(".")) {
        var ftInt = parseInt(flightTime.split(".")[0]);
    } else {
        var ftInt = parseInt(flightTime);
    }
    var minutes = Math.floor(ftInt/60)
    var secondes = ftInt - (minutes*60);
    if(secondes < 10 && minutes < 10) {
        var final = "0" + minutes + "m0" + secondes + "s";
    } else if (secondes < 10 && minutes > 10) {
        var final = minutes + "m0" + secondes + "s";
    } else if (secondes > 10 && minutes < 10){
        var final = "0" + minutes + "m" + secondes + "s";
    } else {
        var final = minutes + "m" + secondes + "s";
    }
    return final;
  }

  changeHeightFormat(height:any) {
    var heightInMeters = Math.round(height * 0.3048);
    return heightInMeters;
  }

  // Récupère le point sur le tracé le plus proche de la souris
  drawClosestPoint(newFeature: any) {
      if(this.lastFeature == undefined) {
        this.vectorPoint = new VectorSource({});
        this.featurePoint = new Feature({
            geometry: new Point([newFeature.values_.geometry.flatCoordinates[0],newFeature.values_.geometry.flatCoordinates[1]])
        });
        this.vectorPoint.addFeature(this.featurePoint); 

        this.vectorPointLayer = new Vector({
            source: this.vectorPoint,
            style: new Style({
              image: new Circle({
                radius: 5,
                fill: new Fill({color: 'red'}),
                stroke: new Stroke({color: 'white', width: 2})
              })
            })
          });
          this.map?.addLayer(this.vectorPointLayer);
      } else {
        this.featurePoint.getGeometry().setCoordinates([newFeature.values_.geometry.flatCoordinates[0],newFeature.values_.geometry.flatCoordinates[1]]);
      }
  }

  // Dessine sur la carte le tracé du drone
  // Donné à chaque segment sous forme de propriété les données de vol
  drawAircraftGps() {
    var featureLine;
    var points;
      for(let i=1; i<this.dataJson.length; i++) { 
        points = [[parseFloat(this.dataJson[i-1]["longitude"]), parseFloat(this.dataJson[i-1]["latitude"])], [parseFloat(this.dataJson[i]["longitude"]), parseFloat(this.dataJson[i]["latitude"])]]
        for(let j=0; j<points.length; j++) {
          points[j] = transform(points[j], 'EPSG:4326', 'EPSG:3857');
        }
        featureLine = new Feature({
          geometry: new LineString(points),
          properties: [
            {"date": this.dataJson[i]["hour"]},
            {"flightTime": this.dataJson[i]["time"]},
            {"battery": this.dataJson[i]["battery"]},
            {"height": this.dataJson[i]["height"]},
            {"aircraftYaw": this.dataJson[i]["aircraftYaw"]},
            {"gimbalYaw": this.dataJson[i]["gimbalYaw"]},
          ]
        });
        this.vectorLine.addFeature(featureLine);    
      }
    
      console.log(this.vectorLine)
    this.vectorLineLayer = new Vector({
      source: this.vectorLine,
      style: new Style({
          fill: new Fill({color: '#800080'}),
          stroke: new Stroke({ color: '#800080', width: 3 })
      })
    });
    if(this.map != undefined) {
      this.map.getView().setZoom(15);
      this.map.getView().setCenter(fromLonLat([parseFloat(this.dataJson[0]["longitude"]), parseFloat(this.dataJson[0]["latitude"])]));
      this.map.addLayer(this.vectorLineLayer);
    }
  }

  ngOnChanges() {
    for(let i=0;i<this.idVol.length; i++) {
      var url = "http://192.168.13.110:8888/api/livedata?id=" + this.idVol[i]["idVol"];
      console.log(url)
      // var url = "http://localhost:8888/api/livedata?id=9";
      this.http.get(url)
      .subscribe(result => {
          var res = JSON.parse(JSON.stringify(result))
          if(res.length != 0) {
              console.log(res);
              this.dataJson = res;
              this.drawAircraftGps();
          }
      },
      error => {
          //TODO
      });
    }
  }

  ngOnInit(): void {
    this.map = new Map({
      view: new View({
        center: fromLonLat([4.626476, 50.674987]),
        zoom: 11,
      }),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: 'ol-map'
    });
    this.map.on('pointermove', (evt) =>{
        this.onPointerMoveAndClick(evt)
    });
    this.map.on('click', (evt) => {
        this.onPointerMoveAndClick(evt)
    })

    console.log(this.idVol)
  }
}
