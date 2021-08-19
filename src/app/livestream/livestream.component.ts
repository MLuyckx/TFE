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
  displaySecureLink = false;

  sourceLive = "http://192.168.13.110:8080/getdirectlive/index.m3u8";

  constructor(private http: HttpClient) {}

  updateFlux() {
    this.http.get("http://192.168.13.110:8080/getdirectlive")
      .subscribe(result => {  
        console.log(result)
      },
      error => {});
    
    setTimeout(()=>{ 
      this.updateFlux();
    }, 30000)
  }

  getDroits() {
    var mail = this.getCookie("email");
    var url = "http://localhost:8888/api/droits?mail=" + mail; 
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
  }

}
