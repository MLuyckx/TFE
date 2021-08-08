import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-replays',
  templateUrl: './replays.component.html',
  styleUrls: ['./replays.component.css']
})
export class ReplaysComponent implements OnInit {

  interId:number = 1;
  videoNumber: any[][] = [];
  styleChoixInter = "block";
  inters: any[][] = [];
  displayLoading = "block";
  essai = "<p><b>Essai</b></p>"
  defaultImage = "../../assets/drone.png"
  constructor(private http: HttpClient) { }

  generateInterList(){
    var x:any [] = [];
    this.http.get("http://localhost:8888/api/interventions")
      .subscribe(result => {
        x = JSON.parse(JSON.stringify(result));
        for(let i=0;i<x.length; i++) {
          var datetime = x[i]["startTime"];
          var date = "";
          var monthList = ["JANVIER", "FEVRIER", "MARS", "AVRIL", "MAI", "JUIN", "JUILLET", "AOUT", "SEPTEMBRE", "OCTOBRE", "NOVEMBRE", "DECEMBRE"]
          var month = +datetime[5] + +datetime[6];

          date += datetime[8] + datetime[9] + " " + monthList[month-1] + " " + datetime[0] + datetime[1] + datetime[2] + datetime[3];
          x[i]["startTime"] = date;
          if(x[i]["commune"] == null && x[i]["street"] == null) {
            x[i]["commune"] = "---Localisation inconnue---";
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

  getVideoNumber(data: any[]) {
    for(let j=0;j<data.length;j++){
      this.http.get("http://localhost:8888/api/videoByInter?id=" + data[j]["idInter"])
      .subscribe(result => {
        var x = JSON.parse(JSON.stringify(result));
        data[j]["imageSource"] = "../../assets/drone.png" 
        data[j]["numberOfVideos"] = x.length;        
      },
      error => {
        this.displayLoading = "none";
      });
    }
    this.inters = data;
    this.displayLoading = "none";
  }


  checkIfNewVideos(dbData:any) {
    this.http.get("http://192.168.13.110:8080/replay")
    // this.http.get("http://localhost:8888/api/videoFileNameList")
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
  }

  checkIfUnassignedVideos() {
    this.http.get("http://localhost:8888/api/unassignedVideos")
      .subscribe(res => {
        var videoResult = JSON.parse(JSON.stringify(res));
        if(videoResult.length != 0) {
          this.http.get("http://localhost:8888/api/lastInter")
            .subscribe(res2 => {
              var interResult = JSON.parse(JSON.stringify(res2))
              var date = (interResult[0]["startTime"]).slice(0, 19).replace('T', ' ');
              var dateLastInter = new Date(date).getTime();

              if(videoResult.length == 1) {
                var timeValue = new Date((videoResult[0]["recordTime"]).slice(0, 19).replace('T', ' ')).getTime();
                if((timeValue-dateLastInter) < 1200000 && (timeValue-dateLastInter) > -1200000) { //Si moins de 20 min (1.200.000 ms)
                  this.setInterToVideo(videoResult[0]["fileName"], interResult[0]["idInter"])
                } else {
                  this.createInter([[[videoResult[0]["fileName"], (videoResult[0]["recordTime"]).slice(0, 19).replace('T', ' ')]]], interResult[0]["idInter"]);
                }
              } 
              else {
                var interToAdd: any[][][] = [];
                var videoToAdd: any[][] = [];
                var cache:number = NaN;
                for(let i=0; i<videoResult.length-1; i++) {
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
                this.createInter(interToAdd, interResult[0]["idInter"])
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

  addVideoToDb(data:any) {
    this.http.post<any>('http://localhost:8888/api/newvideo', {fileName: data[1], videoName: 'flag', recordTime: data[0]}).subscribe(data => {
      //  console.log(data);
    },
    error => {
      this.displayLoading = "none";
    })
  }

  setInterToVideo(video: string, inter: number) {
    this.http.post<any>('http://localhost:8888/api/intertovideo', {fileName: video, idInter: inter}).subscribe(data => {
      //  console.log(data);
    },
    error => {
      this.displayLoading = "none";
    })
  }

  createInter(data:any[][], maxIdInter: number) {
    var newId = maxIdInter
    for(let i=0;i<data.length; i++) {
      newId++;
      this.http.post<any>('http://localhost:8888/api/newinter', {idInter: newId, startTime: data[i][0][1]}).subscribe(data => {
        //  console.log(data);
      },
      error => {
        this.displayLoading = "none";
      });
      for(let j=0; j<data[i].length; j++) {
        this.setInterToVideo(data[i][j][0], newId);
      }
    }
    
  }

  moveToInterReplay(inter:any) {
    window.location.href = '/replay?id=' + inter["idInter"];
  }

  moveToInterStats(inter:any) {
    window.location.href = '/stats?id=' + inter["idInter"];
  }

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

  ngOnInit(): void {
    // this.checkIfNewVideos("aze");
    // this.http.get("http://192.168.13.110:8080/replay")
    this.http.get("http://localhost:8888/api/videoFileNameList")
      .subscribe(result => {
        this.checkIfNewVideos(result);
        this.checkIfUnassignedVideos();
    },
    error => {
      this.displayLoading = "none";
    });
  }

}
