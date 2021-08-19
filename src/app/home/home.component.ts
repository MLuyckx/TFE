import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private http: HttpClient) { }

  liveAccess = false;
  replaysAccess = false;

  moveToLive() {
    if(this.liveAccess) {
      window.location.href = "/live"
    } else {
      alert("Vous n'êtes pas autorisé à visiter cette page. Veuillez contacter un administrateur pour recevoir les droits.")
    }
  }

  moveToInters() {
    if(this.replaysAccess) {
      window.location.href = "/inters"
    } else {
      alert("Vous n'êtes pas autorisé à visiter cette page. Veuillez contacter un administrateur pour recevoir les droits.")
    }
  }
  
  getDroits() {
    var mail = this.getCookie("email");
    var url = "http://localhost:8888/api/droits?mail=" + mail; 
    this.http.get(url)
      .subscribe(result => {
        var x = JSON.parse(JSON.stringify(result))[0];
        if(x.isSuperAdmin) {
          this.liveAccess = true;
          this.replaysAccess = true;
        } else if (x.isAdmin) {
          this.liveAccess = true;
          this.replaysAccess = true;
        } else if (x.isDispatch) {
          this.liveAccess = true;
          this.replaysAccess = false;
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
  }

}
