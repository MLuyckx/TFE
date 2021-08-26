import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import videojs from 'video.js';

// var videoLink: string = "https://multiplatform-f.akamaihd.net/i/multi/will/bunny/big_buck_bunny_,640x360_400,640x360_700,640x360_1000,950x540_1500,.f4v.csmil/master.m3u8";
var videoLink: string = "http://192.168.13.110:8080/live/index.m3u8";

@Component({
  selector: 'app-livestream',
  templateUrl: './livestream.component.html',
  styleUrls: ['./livestream.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LivestreamComponent implements OnInit {

  @ViewChild('target', {static: true}) target: ElementRef | undefined;
  // see options: https://github.com/videojs/video.js/blob/maintutorial-options.html
  player: videojs.Player | undefined;

  isCurrentLive = false;
  displaySecureLink = false;
  sourceData:string= "http://192.168.13.110:8080/getdirectlive/index.m3u8";
  videoSource:Object = { autoplay: true, controls: true, sources: [{ src: this.sourceData, type: 'application/x-mpegURL' }]};
  styleVideo = "width: 500px; height: 250px;"
  imageQuality = "Haute qualité";
  bgColor = "lightgreen";
  isReading = false;

  constructor(private http: HttpClient) {}

  setToLive() {
    if(this.target != undefined && this.player != undefined) {
      this.player.pause();
      this.player.src("http://192.168.13.110:8080/getdirectlive/index.m3u8");
    }
  }

  changeQuality() {
    if(this.imageQuality == "Haute qualité") {
      this.imageQuality = "Basse qualité";
      this.bgColor = "orange";
      if(this.target != undefined && this.player != undefined) {
        this.player.pause();
        this.player.src("http://192.168.13.110:8080/getdirectmobile/index.m3u8");
      }
    } else {
      this.imageQuality = "Haute qualité";
      this.bgColor = "lightgreen"
      if(this.target != undefined && this.player != undefined) {
        this.player.pause();
        this.player.src("http://192.168.13.110:8080/getdirectlive/index.m3u8");
      }
    }
  }

  updateFlux() {
    this.http.get("http://192.168.13.110:8080/getdirectlive")
      .subscribe(result => {  
        var x = JSON.parse(JSON.stringify(result));
        if(x.length == 0) {
          this.isCurrentLive = false;
        } else {
          var isIncluded = false;
          for(let i=0; i<x.length;i++) {
            if(x[i]["name"] == "index.m3u8") {
                isIncluded = true;
            }   
          }
          if(isIncluded) {
            this.isCurrentLive = true;
            this.isReading = true;
          }
        }
      },
      error => {});
    
    setTimeout(()=>{ 
      this.updateFlux();
    }, 10000)
  }

  getDroits() {
    var mail = this.getCookie("email");
    var url = "http://192.168.13.110:8888/api/droits?mail=" + mail; 
    this.http.get(url)
      .subscribe(result => {
        var x = JSON.parse(JSON.stringify(result))[0];
        if(x.isSuperAdmin) {
          this.displaySecureLink = true;
        } else if (x.isAdmin) {
          this.displaySecureLink = true;
        } else if (x.isDispatch) {
          this.displaySecureLink = false;
        }
        else {
          this.displaySecureLink = false;
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

  ngOnInit() {
    this.getDroits();
    this.updateFlux();
    if(this.target != undefined) {
      this.player = videojs(this.target.nativeElement, this.videoSource, function onPlayerReady() {});
    }
    
  }

}
