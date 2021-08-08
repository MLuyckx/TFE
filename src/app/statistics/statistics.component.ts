import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, ViewChildren, QueryList  } from '@angular/core';
import { CartographyComponent } from '../cartography/cartography.component';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit, AfterViewInit  {
  
  imageUrl = "";
  // imageUrl = "data:image/png;base64,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";

  //Style du bouton supérieur (change en fonction de l'action)
  displayLoading = "none";
  buttonText = "Importer des données";

  //Tailles de graphiques
  widthBattery = 1040;
  heightBattery = 540;
  widthAltitude = 1040;
  heightAltitude = 540;

  loadFilesStyle = "block";
  showFilesStyle = "none"

  batteryUrl = "";
  heightUrl = "";

  idVol:string[][] = [];

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
    var data, dataToPush;
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
          // console.log(data[175])
        }
        if(i%10 == 2 || i == (line.length - 2)) {
          if(!data.includes(undefined)) {
            dataToPush = [data[0], data[2], data[3], data[4], data[5], data[20], data[55], data[72]]
            finalArray.push(dataToPush);
          }
        }
      }
      // this.insertFlightToDatabase(finalArray);
      this.displayLoading = "none";
      this.buttonText = "Importer des données"
    }
    
  }

  insertFlightToDatabase(data:any) {
    console.log(data);
    var idInter = parseInt((window.location.href).split("?")[1].substring(3));
    var startTime = data[1][0];
    var flightTime = 0;
    for(let h=1;h<data.length; h++) {
      if(data[data.length-h][1] != undefined) {
        flightTime = Math.floor(data[data.length-h][1]);
        break;
      }
    }
    var startLatitude = data[1][2];
    var startLongitude = data[1][3];
    var batteryGraph = this.drawBattery(data, (this.widthBattery-40), (this.heightBattery-40));
    var heightGraph = this.drawAltitude(data, (this.widthAltitude-40), (this.heightAltitude-40));

    this.addFlightToDatabase(idInter, startTime, flightTime, startLatitude, startLongitude, batteryGraph, heightGraph, data);
  }

  addFlightToDatabase(idInter:number, startTime:string, flightTime:number, startLatitude:string, startLongitude:string, batteryGraph:any, heightGraph:any, data:any) {
    this.http.post<any>('http://localhost:8888/api/newflight', {idInter, startTime, flightTime, startLatitude, startLongitude, batteryGraph, heightGraph}).subscribe(res => {
      this.addFlightDataToDatabase(data);
    },
    error => {
      this.displayLoading = "none";
    })
  }

  addFlightDataToDatabase(data:any) {
    this.http.get("http://localhost:8888/api/lastflight")
    .subscribe(result => {
      var idVol = JSON.parse(JSON.stringify(result))[0]["idVol"]
      var hour;
      var time;
      var latitude;
      var longitude;
      var height;
      var battery
      var aircraftYaw;
      var gimbalYaw;
      for(let i=1;i<data.length; i++) {
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

        this.http.post<any>('http://localhost:8888/api/newdataflight', {idVol, hour, time, latitude, longitude, height, battery, aircraftYaw, gimbalYaw}).subscribe(data => {
     
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

  ngOnInit(): void {
    var id:number = NaN;
    if((window.location.href).split("?")[1] != undefined) {
      var id = parseInt((window.location.href).split("?")[1].substring(3));
      
      // this.resetAll(id);
    }
    
    if(isNaN(id)) {
      alert('URL Error')
    }
    var url = "http://localhost:8888/api/interflight?id=" + id;
    this.http.get(url)
      .subscribe(result => {
        var x = JSON.parse(JSON.stringify(result));
        console.log(x)
        if(x.length == 0) {
          this.showFilesStyle = "none";
        } else {
          this.idVol = [];
          for(let i=0;i<x.length;i++) {
            this.idVol.push(x[i]["idVol"]);
          }
          this.showFilesStyle = "block";
        }
    },
    error => {
      this.displayLoading = "none";
    });
  }
}
