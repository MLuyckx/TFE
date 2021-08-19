import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, ViewChildren, QueryList, HostListener  } from '@angular/core';
import { fakeAsync } from '@angular/core/testing';
import { CartographyComponent } from '../cartography/cartography.component';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit, AfterViewInit  {
  
  imageUrl = "";

  //Style du bouton supérieur (change en fonction de l'action)
  displayLoading = "none";
  buttonText = "Importer des données";

  //Tailles de graphiques
  widthBattery = 1040;
  heightBattery = 540;
  widthAltitude = 1040;
  heightAltitude = 540;

  loadFilesStyle = "block";
  showFilesStyle = "none";
  cartoDisplay = "none";

  batteryUrl = "";
  heightUrl = "";

  idVol:string[][] = [];
  warnings:string[][] = [];
  isAddress = false;

  displayModal = "none";
  isModalOn = false;

  public contextBattery: CanvasRenderingContext2D | undefined;
  @ViewChild('canvasBattery', {static: false}) canvasBattery: ElementRef | undefined;

  public contextAltitude: CanvasRenderingContext2D | undefined;
  @ViewChild('canvasAltitude', {static: false}) canvasAltitude: ElementRef | undefined;

  @ViewChildren(CartographyComponent)
  childGames: QueryList<CartographyComponent> | undefined;

  constructor(private http: HttpClient) { }
  ngAfterViewInit(): void {
    if(this.canvasBattery != undefined) {
      this.contextBattery = this.canvasBattery.nativeElement.getContext('2d');
    }
    if(this.canvasAltitude != undefined) {
      this.contextAltitude = this.canvasAltitude.nativeElement.getContext('2d');
    }
  }

  @ViewChild('myInput') myInput: ElementRef<HTMLElement> | undefined;


  @HostListener('document:click', ['$event'])
  onDocumentClick(event: any) {
    var isIncluded = false;
    var isButton = false;
    for(let i=0;i<event["path"].length; i++) {
      if(event["path"][i].className == "modal-content") {
        isIncluded = true;
      }
      else if(event["path"][i].className == "linkButton") {
          isButton = true;
          break;
      }
    }
    if(!isIncluded && !isButton && this.isModalOn) {
      this.toggleModal("");
    }
  }

  toggleModal(idVol: string) {
    if(idVol.length != 0) {
      var url = "http://localhost:8888/api/getwarnings?id=" + idVol;
      console.log(url)
      this.http.get(url)
        .subscribe(result => {
          var x = JSON.parse(JSON.stringify(result));
          console.log(x)
          for(let i=0;i<x.length; i++) {
            x[i]["time"] = this.changeHourFormat(x[i]["time"]);
          }
          this.warnings = x;
          this.displayModal = "block";
          this.isModalOn = true;
      },
      error => {
        this.displayLoading = "none";
      });
    }
    else {
      this.displayModal = "none";
      this.isModalOn = false;
    }
  }

  

  // Ouvre la sélection de fichier
  chooseFile() {
    if(this.myInput != undefined) {
      let el: HTMLElement = this.myInput.nativeElement;
      el.click();
    }
  }

  file:any
  // Traite le fichier après l'avoir sélectionné
  readFile(eve: any) {
    this.displayLoading = "block";
    this.buttonText = "Traitement..."
    this.file = eve.target.files[0];
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.csvToArray(fileReader.result);
    }
    fileReader.readAsText(this.file);
  }

  // Tranforme le fichier .csv en format JSON
  csvToArray(csv: any){
    var finalArray = [];
    var finalWarnings = [];
    var data, dataToPush, warningsToPush;
    var line = csv.split("\n")
    var headers = line[1].split(",");
    if(headers[0] != "CUSTOM.updateTime [local]") {
      alert("Fichier non reconnu");
      this.displayLoading = "none";
      this.buttonText = "Importer des données"
      return;
    }
    else {
      dataToPush = [headers[0], headers[2], headers[3], headers[4], headers[5], headers[20], headers[55], headers[72]]
      finalArray.push(dataToPush);
      for(let i=2; i<line.length; i++) {
        data = (line[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/))
        if(data[175]!= undefined && data[175].length > 1) {
          warningsToPush = [data[0], data[175]]
          finalWarnings.push(warningsToPush);
        }
        if(i%10 == 2 || i == (line.length - 2)) {
          if(!data.includes(undefined)) {
            dataToPush = [data[0], data[2], data[3], data[4], data[5], data[20], data[55], data[72]]
            finalArray.push(dataToPush);
          }
        }
      }
      // this.insertWarningsToDatabase(finalWarnings);
      this.insertFlightToDatabase(finalArray, finalWarnings);
    }
  }

  insertFlightToDatabase(data:any, datawarnings:any) {
    var idInter = parseInt((window.location.href).split("?")[1].substring(3));
    var startTime = data[1][0];
    var flightTime = 0;
    for(let h=1;h<data.length; h++) {
      if(data[data.length-h][1] != undefined && data[data.length-h][1] != null) {
        var y = data[data.length-h][1];
        y = y.replaceAll('"', '');
        y = y.replaceAll(',', '');

        flightTime = Math.floor(y);
        break;
      }
    }
    var maxHeight:number = 0;

    // Récupère la hauteur maximale du drone
    for(var i=1;i<data.length;i++) {
      if(parseFloat(data[i][4]) > maxHeight) {
        maxHeight = data[i][4];
      }
    }

    var startLatitude = data[1][2];
    var startLongitude = data[1][3];
    var batteryGraph = this.drawBattery(data, (this.widthBattery-40), (this.heightBattery-40));
    var heightGraph = this.drawAltitude(data, (this.widthAltitude-40), (this.heightAltitude-40));

    this.addFlightToDatabase(idInter, startTime, flightTime, startLatitude, startLongitude, batteryGraph, heightGraph, maxHeight, data, datawarnings);
  }

  addFlightToDatabase(idInter:number, startTime:string, flightTime:number, startLatitude:string, startLongitude:string, batteryGraph:any, heightGraph:any, maxHeight:any, data:any, datawarnings: any) {
    this.http.post<any>('http://localhost:8888/api/newflight', {idInter, startTime, flightTime, startLatitude, startLongitude, batteryGraph, heightGraph, maxHeight}).subscribe(res => {
      this.addFlightDataToDatabase(data, datawarnings);
    },
    error => {
      this.displayLoading = "none";
    })
    if(this.isAddress == false) {
      var url = "https://reverse.geocoder.ls.hereapi.com/6.2/reversegeocode.json?apiKey=oiddpbeVlrbmsordL-3o1kwXtDNxa2YXnhBb7q4_NJ4&mode=retrieveAddresses&prox=" + startLatitude + "," + startLongitude;
      console.log(url)
      this.http.get(url)
        .subscribe(result => {  
          var res = JSON.parse(JSON.stringify(result));
          if(res.length != 0) {
            var dataAddress = res["Response"]["View"][0]["Result"][0]["Location"]["Address"];
            var commune = dataAddress["City"];
            var street = dataAddress["Street"];
            this.http.post<any>('http://localhost:8888/api/newaddress', {idInter, commune, street})
            .subscribe(res => {
              
            },
            error => {
              // this.displayLoading = "none";
            })
          }
          
        });
    }  
    this.displayLoading = "none";
    this.buttonText = "Importer des données"  
  }

  addFlightDataToDatabase(data:any, datawarnings:any) {
    this.http.get("http://localhost:8888/api/lastflight")
    .subscribe(result => {
      var idVol = JSON.parse(JSON.stringify(result))[0]["idVol"]
      var hour, time, latitude, longitude, height, battery, aircraftYaw, gimbalYaw;
      for(let i=1;i<data.length; i++) {
        if(data[i][0] != undefined && data[i][1] != undefined && data[i][2] != undefined && data[i][3] != undefined && data[i][4] != undefined && data[i][5] != undefined && data[i][6] != undefined && data[i][7] != undefined) {
          hour = data[i][0]
          time = data[i][1].replaceAll(",", "");
          latitude = data[i][2];
          longitude = data[i][3];
          height = data[i][4];
          if(data[i][7].length == 0) {
            battery = null;
          } else {
            battery = data[i][7];
          }
          
          aircraftYaw = data[i][5];
          gimbalYaw = data[i][6];
        }
        

        this.http.post<any>('http://localhost:8888/api/newdataflight', {idVol, hour, time, latitude, longitude, height, battery, aircraftYaw, gimbalYaw}).subscribe(data => {
  
        },
        error => {
          this.displayLoading = "none";
        })
      }
      var heure, warn;
      for(let j=0;j<datawarnings.length; j++) { 
        heure = datawarnings[j][0];
        warn = datawarnings[j][1];
        console.log('new warn')
        this.http.post<any>('http://localhost:8888/api/newwarnings', {idVol, heure, warn}).subscribe(data => {
      
        },
        error => {
          this.displayLoading = "none";
        })
      }
    },
    error => {
      this.displayLoading = "none";
    });
  }

  // Fonction pour dessiner le graphique 'Batterie en fonction du temps'
  drawBattery(res: any[], width: number, height: number) {
    this.drawBaseGraph(this.contextBattery, width, height)

    // Récupère le temps de vol du drone
    for(var i=1;i<res.length;i++) {
      if(res[res.length-i][1] != undefined && res[res.length-i][1].length != 0) {
        var str = res[res.length-i][1];
        break;
      } 
    }
    
    // Transforme le format du temps de vol (string to int)
    if(str.includes(',')) {
      str = str.replace(',', '');
      str = str.substring(1, str.length-1)
    }
    
    var maxTimeInSeconds = Math.round(parseFloat(str));

    if(this.contextBattery != undefined && this.canvasBattery != undefined) {
      
      var g = this.contextBattery;

      ////////////////////////////////////////////////////////////
      // Calcule les valeurs de temps à mettre sur le graphique //
      ////////////////////////////////////////////////////////////

      //1. Valeur 1/4 temps
      var minutes = Math.floor(1*(maxTimeInSeconds/4) / 60);
      var seconds = Math.floor(1*maxTimeInSeconds/4) - minutes * 60;
      if(seconds < 10) {
        var strTimeQuarter1 = minutes + "m0" + seconds + "s";
      }else {
        var strTimeQuarter1 = minutes + "m" + seconds + "s";
      }

       //2. Valeur 1/2 temps
      var minutes = Math.floor(2*(maxTimeInSeconds/4) / 60);
      var seconds = Math.floor(2*maxTimeInSeconds/4) - minutes * 60;
      if(seconds < 10) {
        var strTimeQuarter2 = minutes + "m0" + seconds + "s";
      }else {
        var strTimeQuarter2 = minutes + "m" + seconds + "s";
      }

      //3. Valeur 3/4 temps
      var minutes = Math.floor(3*(maxTimeInSeconds/4) / 60);
      var seconds = Math.floor(3*maxTimeInSeconds/4) - minutes * 60;
      if(seconds < 10) {
        var strTimeQuarter3 = minutes + "m0" + seconds + "s";
      }else {
        var strTimeQuarter3 = minutes + "m" + seconds + "s";
      }
      
      //4. Valeur full time
      var minutes = Math.floor(4*(maxTimeInSeconds/4) / 60);
      var seconds = Math.floor(4*maxTimeInSeconds/4) - minutes * 60;
      if(seconds < 10) {
        var strTimeQuarter4 = minutes + "m0" + seconds + "s";
      }else {
        var strTimeQuarter4 = minutes + "m" + seconds + "s";
      }

      ////////////////////////////////////////
      // Ecrit les valeurs sur le graphique //
      ////////////////////////////////////////
      
      // 1. Axe X -> Valeurs de temps
      g.beginPath();
      g.font="15px Arial";    
      g.fillText(strTimeQuarter1, (1*width/4)-12, (height+20))
      g.fillText(strTimeQuarter2, (2*width/4)-12, (height+20))
      g.fillText(strTimeQuarter3, (3*width/4)-12, (height+20))
      g.fillText(strTimeQuarter4, (4*width/4)-12, (height+20))
      g.stroke();

      // 2. Axe Y -> Valeurs de batterie
      g.beginPath();
      g.font="15px Arial";
      g.fillText("100%", 0, (0*height/4) + 15)
      g.fillText("75%", 8, (1*height/4) + 5)
      g.fillText("50%", 8, (2*height/4) + 5)
      g.fillText("25%", 8, (3*height/4) + 5)
      g.stroke();

      // 3. Dessine les datas
      g.beginPath();
      for(var i=1; i<res.length; i++) {
        var charge = res[i][7];     // Récupère le %age de batterie
        var max = width/res.length; 
        g.strokeStyle = "red";
        g.rect((i*max)+40, height-((height/100)*charge), 1, 1)
      }
      g.stroke();
  
      const x = (this.canvasBattery.nativeElement as HTMLCanvasElement).width / 2;
      const y = (this.canvasBattery.nativeElement as HTMLCanvasElement).height / 2;
      // 4. Enregistre le grahique sous forme de dataUrl (Lu dans un format PNG)
      this.batteryUrl = this.canvasBattery.nativeElement.toDataURL('assets');
      return this.batteryUrl;
    } else {
      return 0;
    }
  }

  // Fonction pour dessiner le graphique 'Altitude en fonction du temps'
  drawAltitude(res: any[], width: number, height: number) {
    this.drawBaseGraph(this.contextAltitude, width, height);
    var maxHeight:number = 0;

    // Récupère la hauteur maximale du drone
    for(var i=1;i<res.length;i++) {
      if(parseFloat(res[i][4]) > maxHeight) {
        maxHeight = res[i][4];
      }
    }

    // Récupère le temps de vol du drone
    for(var i=1;i<res.length;i++) {
      if(res[res.length-i][1] != undefined && res[res.length-i][1].length != 0) {
        var str = res[res.length-i][1];
        break;
      } 
    }
    
    // Transforme le format du temps de vol (string to int)
    if(str.includes(',')) {
      str = str.replace(',', '');
      str = str.substring(1, str.length-1)
    }
    
    var maxTimeInSeconds = Math.round(parseFloat(str));

    if(this.contextAltitude != undefined && this.canvasAltitude != undefined) {
      var g = this.contextAltitude;

      ////////////////////////////////////////////////////////////
      // Calcule les valeurs de temps à mettre sur le graphique //
      ////////////////////////////////////////////////////////////

      //1. Valeur 1/4 temps
      var minutes = Math.floor(1*(maxTimeInSeconds/4) / 60);
      var seconds = Math.floor(1*maxTimeInSeconds/4) - minutes * 60;
      if(seconds < 10) {
        var strTimeQuarter1 = minutes + "m0" + seconds + "s";
      }else {
        var strTimeQuarter1 = minutes + "m" + seconds + "s";
      }

      //2. Valeur 1/2 temps
      var minutes = Math.floor(2*(maxTimeInSeconds/4) / 60);
      var seconds = Math.floor(2*maxTimeInSeconds/4) - minutes * 60;
      if(seconds < 10) {
        var strTimeQuarter2 = minutes + "m0" + seconds + "s";
      }else {
        var strTimeQuarter2 = minutes + "m" + seconds + "s";
      }

      //3. Valeur 3/4 temps
      var minutes = Math.floor(3*(maxTimeInSeconds/4) / 60);
      var seconds = Math.floor(3*maxTimeInSeconds/4) - minutes * 60;
      if(seconds < 10) {
        var strTimeQuarter3 = minutes + "m0" + seconds + "s";
      }else {
        var strTimeQuarter3 = minutes + "m" + seconds + "s";
      }
      
      //4. Valeur full time
      var minutes = Math.floor(4*(maxTimeInSeconds/4) / 60);
      var seconds = Math.floor(4*maxTimeInSeconds/4) - minutes * 60;
      if(seconds < 10) {
        var strTimeQuarter4 = minutes + "m0" + seconds + "s";
      }else {
        var strTimeQuarter4 = minutes + "m" + seconds + "s";
      }

      //5. Valeur 1/4 altitude
      var strHeightQuarter1 = Math.round((1*(maxHeight)/4)*0.3048).toString() + "m";
      //6. Valeur 1/2 altitude
      var strHeightQuarter2 = Math.round((2*(maxHeight)/4)*0.3048).toString() + "m";
      //7. Valeur 3/4 altitude
      var strHeightQuarter3 = Math.round((3*(maxHeight)/4)*0.3048).toString() + "m";
      //8. Valeur altitude maximale
      var strHeightQuarter4 = Math.round((4*(maxHeight)/4)*0.3048).toString() + "m";

      ////////////////////////////////////////
      // Ecrit les valeurs sur le graphique //
      ////////////////////////////////////////
      
      // 1. Axe X -> Valeurs de temps
      g.font="15px Arial";    
      g.fillText(strTimeQuarter1, (1*width/4)-12, (height+20))
      g.fillText(strTimeQuarter2, (2*width/4)-12, (height+20))
      g.fillText(strTimeQuarter3, (3*width/4)-12, (height+20))
      g.fillText(strTimeQuarter4, (4*width/4)-12, (height+20))
      g.stroke();

      

      // 2. Axe Y -> Valeurs de l'altitude
      g.beginPath();
      g.font="15px Arial";
      g.fillText(strHeightQuarter4, 0, (0*height/4) + 15)
      g.fillText(strHeightQuarter3, 0, (1*height/4) + 5)
      g.fillText(strHeightQuarter2, 0, (2*height/4) + 5)
      g.fillText(strHeightQuarter1, 0, (3*height/4) + 5)
      g.stroke();

      // 3. Dessine les datas
      g.beginPath();
      for(var i=1; i<res.length; i++) {
        var currentHeight = res[i][4]; // Récupère la valeur d'altitude
        var max = width/res.length;
        g.strokeStyle = "red";
        g.rect((i*max)+40, height-((height/maxHeight)*currentHeight), 1, 1)
      }
      g.stroke();
  
      const x = (this.canvasAltitude.nativeElement as HTMLCanvasElement).width / 2;
      const y = (this.canvasAltitude.nativeElement as HTMLCanvasElement).height / 2;
      // 4. Enregistre le grahique sous forme de dataUrl (Lu dans un format PNG)
      this.heightUrl = this.canvasAltitude.nativeElement.toDataURL('assets');
      return this.heightUrl;
    } else {
      return 0;
    }
  }

  // Fonction pour dessiner les valeurs communes à tous les graphiques
  drawBaseGraph(context: any, width: number, height: number) {
    if(context != undefined) {
      var g = context;

      //////////////////////////////
      //Crée les médianes aux axes//
      //////////////////////////////

      //1. Horizontal
      g.beginPath();
      g.strokeStyle = "lightgray";

      g.moveTo(40, height/4);
      g.lineTo(width+40, height/4);

      g.moveTo(40, 2*height/4);
      g.lineTo(width+40, 2*height/4);

      g.moveTo(40, 3*height/4);
      g.lineTo(width+40, 3*height/4);
      g.stroke();

      //2. Vertical

      g.beginPath();
      g.strokeStyle = "lightgray";

      g.moveTo((1*width/4 + 40), height);
      g.lineTo((1*width/4 + 40), 0);

      g.moveTo((2*width/4 + 40), height);
      g.lineTo((2*width/4 + 40), 0);

      g.moveTo((3*width/4 + 40), height);
      g.lineTo((3*width/4 + 40), 0);
      g.stroke();

      ////////////////////////
      //Crée les axes x et y//
      ////////////////////////
      g.beginPath();
      g.strokeStyle = "black";
      g.moveTo(width+40, height);
      g.lineTo(40, height);
      g.moveTo(40, 0);
      g.lineTo(40,height);
      g.stroke();
    }
  }


  // Change le format du temps de vol (secondes -> minutes/secondes)
  // changeFlightTimeFormat(61) -> 1m01s
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
    console.log(flightTime)
    var final = "";
    if(flightTime != null) {
      flightTime = flightTime.toString()
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
    }
    
    return final;
  }

  changeHeightFormat(height:any) {
    var heightInMeters = Math.round(height * 0.3048);
    return heightInMeters;
  }

  getDroits() {
    var mail = this.getCookie("email");
    var url = "http://localhost:8888/api/droits?mail=" + mail; 
    this.http.get(url)
      .subscribe(result => {
        var x = JSON.parse(JSON.stringify(result))[0];
        if(!x.isSuperAdmin && !x.isAdmin) {
          window.location.href = "/";
        }
      },
      error => {
       console.log(error);
      });
  }

  getCookie(name: string) {
    let ca: Array<string> = document.cookie.split(';');
    let caLen: number = ca.length;
    let cookieName = `${name}=`;
    let c: string;

    for (let i: number = 0; i < caLen; i += 1) {
        c = ca[i].replace(/^\s+/g, '');
        if (c.indexOf(cookieName) == 0) {
            return c.substring(cookieName.length, c.length);
        }
    }
    return '';
  }

  ngOnInit(): void {
    this.getDroits();
    var id:number = NaN;
    if((window.location.href).split("?")[1] != undefined) {
      var id = parseInt((window.location.href).split("?")[1].substring(3));
    }
    
    if(isNaN(id)) {
      alert('URL Error')
    }
    var url = "http://localhost:8888/api/interflight?id=" + id;
    this.http.get(url)
      .subscribe(result => {
        var x = JSON.parse(JSON.stringify(result));
        if(x.length == 0) {
          this.showFilesStyle = "none";
          this.cartoDisplay = "none";
        } else {
          this.idVol = [];
          for(let i=0;i<x.length;i++) {
            x[i]["startTime"] = this.changeHourFormat(x[i]["startTime"]);
            console.log(x[i]["flightTime"]);
            x[i]["flightTime"] = this.changeFlightTimeFormat(x[i]["flightTime"]);
            x[i]["maxHeight"] = Math.floor(parseInt(x[i]["maxHeight"]) * 0.3048);
            this.idVol.push(x[i]);
          }
          this.cartoDisplay = "block";
          this.showFilesStyle = "block";
        }
    },
    error => {
      this.displayLoading = "none";
    });
    var url = "http://localhost:8888/api/intervention?id=" + id;
    this.http.get(url)
      .subscribe(result => {
        var x = JSON.parse(JSON.stringify(result));
        if(x["commune"] == null && x["street"] == null) {
          this.isAddress = false;
        } else {
          this.isAddress = true;
        }
    },
    error => {
      this.displayLoading = "none";
    });
  }
}
