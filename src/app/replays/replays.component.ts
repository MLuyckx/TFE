import { Component, HostListener, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-replays',
  templateUrl: './replays.component.html',
  styleUrls: ['./replays.component.css']
})
export class ReplaysComponent implements OnInit {

  //Création des variables globales
  interId:number = 1;
  videoNumber: any[][] = [];
  styleChoixInter = "block";
  inters: any[][] = [];
  displayLoading = "block";
  essai = "<p><b>Essai</b></p>"
  defaultImage = "../../assets/drone.png";
  displayModal = "none";
  isModalOn = false;
  newTitle = "";
  displayError = "none";

  selectedName = "";
  selectedIdInter = 0;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: any) {
    var isIncluded = false;
    var isButton = false;
    for(let i=0;i<event["path"].length; i++) {
      if(event["path"][i].className == "modal-content") {
        isIncluded = true;
      }
      else if(event["path"][i].className == "buttonEdit") {
          isButton = true;
          break;
      }
    }
    if(!isIncluded && !isButton && this.isModalOn) {
      this.toggleModal({idInter: 0, name: ""});
    }
  }

  constructor(private http: HttpClient) { }

  //Affiche/Enleve le modal (modificatin du nom de l'intervention)
  toggleModal(inter:any) {
    this.newTitle = "";
    this.displayError = "none"
    this.selectedIdInter = inter.idInter;
    this.selectedName = inter.name;
    if(!this.isModalOn) {
      this.displayModal = "block";
      this.isModalOn = true;
    }
    else {
      this.displayModal = "none";
      this.isModalOn = false;
    }
  }

  //Soumet le nouveau nom dans la base de données
  editName(idInter:any) {
    this.displayError = "none";
    if(this.newTitle.length == 0) {
      this.displayError = "block";
    }
    else {
      this.http.post<any>('http://192.168.13.110:8888/api/editinterventionname', {idInter: idInter, newname: this.newTitle}).subscribe(data => {
        this.generateInterList();
        this.displayModal = "none"
      })
    }
  }

  //Crée la liste des interventions après demande à la db
  generateInterList(){
    var x:any [] = [];
    this.http.get("http://192.168.13.110:8888/api/interventions")
      .subscribe(result => {
        x = JSON.parse(JSON.stringify(result));
        for(let i=0;i<x.length; i++) {
          var datetime = x[i]["startTime"];
          var date = "";
          var monthList = ["JANVIER", "FEVRIER", "MARS", "AVRIL", "MAI", "JUIN", "JUILLET", "AOUT", "SEPTEMBRE", "OCTOBRE", "NOVEMBRE", "DECEMBRE"]
          var month = +datetime[5] + +datetime[6];

          date += datetime[8] + datetime[9] + " " + monthList[month-1] + " " + datetime[0] + datetime[1] + datetime[2] + datetime[3];
          x[i]["startTime"] = date;
          // alert(x[i]["name"]);
          if(!x[i]["name"]) {
            x[i]["name"] = "[Intervention]"
          }
          if(x[i]["commune"] == null && x[i]["street"] == null) {
            x[i]["commune"] = "[Localisation inconnue]";
            x[i]["street"] = " ";
          } else if (x[i]["commune"] == null) {
            x[i]["commune"] = " ";
          } else if (x[i]["street"] == null) {
            x[i]["street"] = " ";
          } else {
            x[i]["commune"] += ", "
          }
        }
        this.getVideoNumber(x);
      },
      error => {
        this.displayLoading = "none";
      });
  }


  checkImage(imageSrc:string, good:any, bad:any) {
    var img = new Image();
    img.onload = good; 
    img.onerror = bad;
    img.src = imageSrc;
  } 

  //Récupère en base de données le nombre de vidéos par intervention
  getVideoNumber(data: any[]) {
    for(let j=0;j<data.length;j++){
      this.http.get("http://192.168.13.110:8888/api/videoByInter?id=" + data[j]["idInter"])
      .subscribe(result => {
        var x = JSON.parse(JSON.stringify(result));
        data[j]["imageSource"] = "../../assets/drone.png" 
        data[j]["numberOfVideos"] = x.length;        
      },
      error => {
        this.displayLoading = "none";
      });
      this.http.get("http://192.168.13.110:8888/api/statsByInter?id=" + data[j]["idInter"])
      .subscribe(result => {
        var x = JSON.parse(JSON.stringify(result))
        if(x.length == 0)  {
          data[j]["isStats"] = "Aucun vol enregistré";
        } else if (x.length == 1) {
          data[j]["isStats"] = x.length + " vol";
        } else {
          data[j]["isStats"] = x.length + " vols";
        } 
      },
      error => {
        this.displayLoading = "none";
      });
    }
    this.inters = data;
    this.displayLoading = "none";
    console.log(this.inters)
  }

  //Vérifie si de nouvelles vidéos sont dispos (et ne sont pas encore en db)
  checkIfNewVideos(dbData:any) {
    this.http.get("http://192.168.13.110:8080/getreplays")
      .subscribe(result => {
        var x = JSON.parse(JSON.stringify(result));
        var dataDb = [];
        var dataServer = [];
        for(var j=0;j<dbData.length; j++) {
          // y.push(serverData[j]["name"]);
          dataDb.push(dbData[j]["fileName"]);
          
        }
        for(var k=0; k<x.length; k++) {
          var datetime = this.toDatetimeFormat(x[k]["mtime"]);
         
          if(x[k]["name"].includes("mp4")) {
            dataServer.push([datetime, (x[k]["name"]).slice(0, -4)]);
          }
        }
        for(var i=0;i<dataServer.length; i++) {
          if(!dataDb.includes(dataServer[i][1])) {
            this.addVideoToDb(dataServer[i]);
          }
          if(i==dataServer.length-1) {
            this.generateInterList();
          }
        }
        if(dataServer.length == 0) {
          this.generateInterList();
        }
    },
    error => {
      this.displayLoading = "none";
    });
    setTimeout(() => {
      this.checkIfUnassignedVideos();
    }, 500);
  }

  //Vérifie si des vidéos en db ne sont pas assignées à une intervention
  checkIfUnassignedVideos() {
    this.http.get("http://192.168.13.110:8888/api/unassignedVideos")
      .subscribe(res => {
        var videoResult = JSON.parse(JSON.stringify(res));
        if(videoResult.length != 0) {
          this.http.get("http://192.168.13.110:8888/api/lastInter")
            .subscribe(res2 => {
              var interResult = JSON.parse(JSON.stringify(res2));
              var date:number, dateLastInter:any, idInter:number;
              if(interResult.length == 0) {
                dateLastInter = 0;
              }
              else {
                date = (interResult[0]["recordTime"]).slice(0, 19).replace('T', ' ');
                dateLastInter = new Date(date).getTime();
              }
              if(videoResult.length == 1) {
                var timeValue = new Date((videoResult[0]["recordTime"]).slice(0, 19).replace('T', ' ')).getTime();
                if((timeValue-dateLastInter) < 1200000 && (timeValue-dateLastInter) > -1200000) { //Si moins de 20 min (1.200.000 ms)
                  this.setInterToVideo(videoResult[0]["fileName"], interResult[0]["idInter"])
                } else {
                  this.createInter([[[videoResult[0]["fileName"], (videoResult[0]["recordTime"]).slice(0, 19).replace('T', ' ')]]]);
                }
              } 
              else {
                var interToAdd: any[][][] = [];
                var videoToAdd: any[][] = [];
                var cache:number = NaN;
                for(let i=0; i<videoResult.length; i++) {
                  var timeValue = new Date((videoResult[i]["recordTime"]).slice(0, 19).replace('T', ' ')).getTime();
                  if((timeValue-dateLastInter) < 1200000 && (timeValue-dateLastInter) > -1200000) { //Si moins de 20 min (1.200.000 ms)
                    this.setInterToVideo(videoResult[i]["fileName"], interResult[0]["idInter"])
                  } 
                  else {
                    if(videoToAdd.length == 0) {
                      cache = timeValue;
                      videoToAdd = [[videoResult[i]["fileName"], (videoResult[i]["recordTime"]).slice(0, 19).replace('T', ' ')]];
                    } 
                    else {
                      if(timeValue-cache < 1200000 && (timeValue-cache) > -1200000) {
                        cache = timeValue;
                        videoToAdd.push([videoResult[i]["fileName"], (videoResult[i]["recordTime"]).slice(0, 19).replace('T', ' ')]);
                      }
                      else {
                        interToAdd.push(videoToAdd)
                        cache = timeValue
                        videoToAdd = [[videoResult[i]["fileName"], (videoResult[i]["recordTime"]).slice(0, 19).replace('T', ' ')]];
                      }
                    }
                  }
                }
                interToAdd.push(videoToAdd);
                this.createInter(interToAdd)//["idInter"])
              }
              
            },
            error => {
              this.displayLoading = "none";
            });
        }
      },
      error => {
        this.displayLoading = "none";
      });
  }

  //Ajoute une vidéo en base de données
  addVideoToDb(data:any) {
    this.http.post<any>('http://192.168.13.110:8888/api/newvideo', {fileName: data[1], videoName: data[1], recordTime: data[0]}).subscribe(data => {
      this.generateInterList();
    },
    error => {
      this.displayLoading = "none";
    })
  }

  //Assigne une interventions à une vidéo
  setInterToVideo(video: string, inter: number) {
    console.log(video, inter)
    this.http.post<any>('http://192.168.13.110:8888/api/intertovideo', {fileName: video, idInter: inter}).subscribe(data => {
      this.generateInterList();
    },
    error => {
      this.displayLoading = "none";
    })
  }

  //Crée une nouvelle inter en db
  createInter(data:any[][]){//, maxIdInter: number) {
    for(let i=0;i<data.length; i++) {
      this.http.post<any>('http://192.168.13.110:8888/api/newinter', {startTime: data[i][0][1]})
      .subscribe(data2 => {
        for(let j=0; j<data[i].length; j++) {
          console.log(data[i][j][0]);
          this.setInterToVideo(data[i][j][0], data2.insertId);
        }
        this.generateInterList();
      },
      error => {
        console.log(error)
        this.displayLoading = "none";
      });
    }
    this.generateInterList();
  }

  //Routing
  moveToInterReplay(inter:any) {
    if(inter.numberOfVideos == 0) {
      return;
    } else {
      window.location.href = '/replay?id=' + inter["idInter"];
    }
    
  }

  //Routing
  moveToInterStats(inter:any) {
    window.location.href = '/stats?id=' + inter["idInter"];
  }

  //Changement du format de date
  toDatetimeFormat(date:string) {
    var monthString = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var month = date[8] + date[9] + date[10]; 
    var monthStr = "";
    if(monthString.indexOf(month) + 1 < 10) {
      monthStr = "0" + (monthString.indexOf(month) + 1);
    } else {
      monthStr = (monthString.indexOf(month) + 1).toString();
    }
    var res = date[12] + date[13] + date[14] + date[15] + "-" + monthStr + "-" + date[5] + date[6] + " " + date[17] + date[18] + ":" + date[20] + date[21] + ":" + date[23] + date[24];
    return res;
  }

  //Récupère les droits d'accès de l'utilisateur connecté
  getDroits() {
    var mail = this.getCookie("email");
    var url = "http://192.168.13.110:8888/api/droits?mail=" + mail; 
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

  //Récupère la valeur du cookie
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
    this.http.get("http://192.168.13.110:8888/api/videoFileNameList")
      .subscribe(result => {
        this.checkIfNewVideos(result);
    },
    error => {
      this.displayLoading = "none";
    });
  }
}
