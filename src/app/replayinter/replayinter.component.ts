import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import videojs from 'video.js';

@Component({
  selector: 'app-replayinter',
  templateUrl: './replayinter.component.html',
  styleUrls: ['./replayinter.component.css']
})
export class ReplayinterComponent implements OnInit {

  @ViewChild('target', {static: true}) target: ElementRef | undefined;
  // see options: https://github.com/videojs/video.js/blob/maintutorial-options.html
  player: videojs.Player | undefined;

  constructor(private http: HttpClient, private elementRef: ElementRef,) { }
  styleChoixInter = "block";
  
  interId: number = 0;
  interData: any;
  sourceData:string= "https://multiplatform-f.akamaihd.net/i/multi/will/bunny/big_buck_bunny_,640x360_400,640x360_700,640x360_1000,950x540_1500,.f4v.csmil/master.m3u8"
  videoSource:Object = { autoplay: true, controls: true, sources: [{ src: this.sourceData, type: 'application/x-mpegURL' }]};
  styleVideo = "width: 500px; height: 250px;"

  checkIfNewVideos(dbData:any) {
    this.http.get("http://192.168.13.110:8080/replay")
    // this.http.get("http://localhost:8888/api/videoFileNameList")
      .subscribe(result => {
        var x = JSON.parse(JSON.stringify(result));
        var dataDb = [];
        var dataServer = [];
        for(var j=0;j<dbData.length; j++) {
          dataDb.push(dbData[j]["fileName"]);
        }
        for(var k=0; k<x.length; k++) {
          var datetime = this.toDatetimeFormat(x[k]["mtime"], true);
          if(x[k]["name"].includes("mp4")) {
            dataServer.push([datetime, (x[k]["name"]).slice(0, -4)]);
          }
        }
        for(var i=0;i<dataServer.length; i++) {
            if(!dataDb.includes(dataServer[i][1])) {
              this.addVideoToDb(dataServer[i]);
            }
        }
    })
  }

  toDatetimeFormat(date:string, isDayOfWeek: boolean) {
    if(!isDayOfWeek) {
      date = "xxxxx" + date;
    }
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

  addVideoToDb(data:any) {
    this.http.post<any>('http://localhost:8888/api/newvideo', {fileName: data[1], videoName: 'flag', recordTime: data[0]}).subscribe(data => {
      //  console.log(data);
    })
  }

  changeSrc(newSrc:string) {
    var source = "http://192.168.13.110:8080/replay/" + newSrc + ".mp4"
    // console.log(newSrc)
    // this.videoSource = { autoplay: true, controls: true, sources: [{ src: "", type: 'application/x-mpegURL' }]};
    if(this.target != undefined && this.player != undefined) {
      this.player.pause();
      // this.player.src("http://techslides.com/demos/sample-videos/small.mp4");
      this.player.src(source);
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
    // console.log('okok')
  }

  ngOnInit(): void {
    if(this.target != undefined) {
      this.player = videojs(this.target.nativeElement, this.videoSource, function onPlayerReady() {});
    }
    this.http.get("http://localhost:8888/api/videoFileNameList")
      .subscribe(result => {
        this.checkIfNewVideos(result);
      },
      error => {
        //TODO
      });
    var location = window.location.href;
    var id = parseInt(location.split('?')[1].substring(3));
    this.interId = id;
    this.http.get("http://localhost:8888/api/videoByInter?id=" + id)
      .subscribe(result => {
        var videoResult = JSON.parse(JSON.stringify(result));
        for(let i=0;i<videoResult.length; i++) {
          videoResult[i]["miniature"] = "http://192.168.13.110:8080/img/" + videoResult[i]["fileName"] + ".jpg";
        }
        this.interData = videoResult;
        console.log(this.interData)
      });
  }
  ngOnDestroy() {
    // destroy player
    if (this.player) {
      this.player.dispose();
    }
  }
}
