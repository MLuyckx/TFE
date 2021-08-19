import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import videojs from 'video.js';

// var videojs : any ;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  
})

export class AppComponent {

  isConnected = false;
  access = [];
  tryingToConnect = false;

  constructor(private http: HttpClient) { }

  connection() {
    var token = this.getCookie('token');
    if(!token) {
      var url = "";
      var code = window.location.href.split('?')[1];
      if(!code || !code.startsWith("code=")) {
        
        url = "http://localhost:8888/connexion";
        this.http.get(url,  {responseType: 'text'})
        .subscribe(result => {
          var x = JSON.parse(JSON.stringify(result));
          var split = x.split('&flowName');
          var url = split[0] + "&hd=incendiebw.be&flowName" + split[1]
          window.location.href = url;
        },
        error => {
          console.log(error)
          this.tryingToConnect = false;
        });
      } else {
          url = "http://localhost:8888/connexion?" + code;
          this.http.get(url, {responseType: 'text'})
          .subscribe(result => {
            var x = JSON.parse(JSON.stringify(result.substring(1, result.length-1)));
            x = JSON.parse(x)
            if(x["infos"]["email"].endsWith("@incendiebw") || x["infos"]["email"] == "luyckx.matthieu@gmail.com") {
              this.setCookie('token', x["token"], 1);
              this.setCookie('email', x["infos"]["email"],1)
            } else {
              alert("Cette adresse mail n'est pas autorisée. Veuillez réessayer")
            }
            
            window.location.href = '/'
          },
          error => {
            console.log(error)
          });      
      }
    } else {
      var token = this.getCookie('token');    
      url = "https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=" + token;
      this.http.get(url)
      .subscribe(result => {
        this.isConnected = true;
      },
      error => {
        if(error.status == 400) {
          this.isConnected = false;
          this.deleteCookie('token');
          this.connection();
        } else {
          console.log(error)
        }
      });
    }
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

  deleteCookie(name: string) {
      this.setCookie(name, '', -1);
  }

  setCookie(name: string, value: string, expireDays: number, path: string = '') {
    let d:Date = new Date();
    d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
    let expires:string = `expires=${d.toUTCString()}`;
    let cpath:string = path ? `; path=${path}` : '';
    document.cookie = `${name}=${value}; ${expires}${cpath}`;
  }

  ngOnUpdate() {
    // if(!this.isConnected) {
    //   this.connection();
    // }
  }

  ngOnInit() {
    this.isConnected = false;
    this.connection();
  }
  
  title = 'Drone - ZSBW';
}

