import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import videojs from 'video.js';

// var videoLink: string = "https://multiplatform-f.akamaihd.net/i/multi/will/bunny/big_buck_bunny_,640x360_400,640x360_700,640x360_1000,950x540_1500,.f4v.csmil/master.m3u8";
var videoLink: string = "http://192.168.13.110:8080/live/index.m3u8"

@Component({
  selector: 'app-livestream',
  templateUrl: './livestream.component.html',
  styleUrls: ['./livestream.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LivestreamComponent implements OnInit {

  constructor(private http: HttpClient) {

  }
  public videoJsConfigObj = {
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

  changeSrc(src:string) {
    var source:any = "http://192.168.13.110:8080/replay/" + source;
    // window.player.updateSrc([
    //     { type: "video/mp4", src: source, label:'HD' }
    // ]);
    // document.getElementById("backToLive").style.display = "block";
  }

  ngOnInit() {
    var player = videojs('my-video', this.videoJsConfigObj);
  }

}
