import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
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
  videoName: string = "Unknown";
  fileName: string = "";
  fileNameDownload: string = "";
  interData: any;
  sourceData:string= "unknow.mp4"
  videoSource:Object = { autoplay: false, controls: true, sources: [{ src: this.sourceData, type: 'video/mp4' }]};
  styleVideo = "width: 500px; height: 250px;"
  displayModal = "none";
  isModalOn = false;
  newTitle = "";
  displayError = "none";
  fileUrl = "";

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: any) {
    var isIncluded = false;
    var isButton = false;
    for(let i=0;i<event["path"].length; i++) {
      if(event["path"][i].className == "modal-content") {
        isIncluded = true;
      }
      else if(event["path"][i].className == "edit") {
          isButton = true;
          break;
      }
    }
    if(!isIncluded && !isButton && this.isModalOn) {
      this.toggleModal();
    }
  }

  checkIfNewVideos(dbData:any) {
    this.http.get("http://192.168.13.110:8080/getreplays")
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

  changeSrc(newSrc:string, videoName: string) {
    var source = "http://192.168.13.110:8080/getreplays/" + newSrc + ".mp4"
    // console.log(newSrc)
    // this.videoSource = { autoplay: true, controls: true, sources: [{ src: "", type: 'application/x-mpegURL' }]};
    if(this.target != undefined && this.player != undefined) {
      this.player.pause();
      // this.player.src("http://techslides.com/demos/sample-videos/small.mp4");
      this.player.src(source);
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
    this.fileUrl = "/getreplays/" + newSrc + ".mp4";
    this.fileName = newSrc;
    this.fileNameDownload = newSrc + ".mp4"
    this.videoName = videoName;
    // console.log('okok')
  }

  toggleModal() {
    if(!this.isModalOn) {
      this.displayModal = "block";
      this.isModalOn = true;
    }
    else {
      this.displayModal = "none";
      this.isModalOn = false;
    }
  }

  editName() {
    this.displayError = "none";
    if(this.newTitle.length == 0) {
      this.displayError = "block";
    }
    else {
      this.http.post<any>('http://localhost:8888/api/editvideoname', {fileName: this.fileName, newname: this.newTitle}).subscribe(data => {
        window.location.href = window.location.href; 
      })
    }
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
          if(i==0) {
            this.changeSrc(videoResult[i]["fileName"], videoResult[i]["videoName"]);
          }
          videoResult[i]["miniature"] = "http://192.168.13.110:8080/img/" + videoResult[i]["fileName"] + ".jpg";
        }
        this.interData = videoResult;
      });
  }
  ngOnDestroy() {
    // destroy player
    if (this.player) {
      this.player.dispose();
    }
  }
}
