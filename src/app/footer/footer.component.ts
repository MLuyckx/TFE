import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(private http: HttpClient) { }
  displayModal = "none";
  sendText = "Soumettre";
  users = [];
  isModalOn = false;
  adminAccess = false;
  email = "";
  newsuperadmin = false;
  newadmin = false;
  newdispatch = false;

@HostListener('document:click', ['$event'])
onDocumentClick(event: any) {
  var isIncluded = false;
  var isButton = false;
  for(let i=0;i<event["path"].length; i++) {
    if(event["path"][i].className == "modal-content") {
      isIncluded = true;
    }
    else if(event["path"][i].className == "admin") {
        isButton = true;
        break;
    }
  }
  if(!isIncluded && !isButton && this.isModalOn) {
    this.toggleModal();
  }
}

logout() {
  this.deleteCookie("token");
  this.deleteCookie("email")
  window.location.href = "/"
}

updateDroits() {
  console.log(this.email);
  console.log(this.newsuperadmin);
  console.log(this.newadmin);
  console.log(this.newdispatch);
  this.sendText = "Envoi..."
  if(this.email == "" || !this.email.includes("@")) {
    this.sendText = "Soumettre";
    alert("Email incorrect");
  } else {
    var url = "http://192.168.13.110:8888/api/droits?mail=" + this.email; 
    this.http.get(url)
      .subscribe(result => {
        var x = JSON.parse(JSON.stringify(result));
        console.log(x);
        if(x.length == 0) {
          this.http.post<any>('http://192.168.13.110:8888/api/newuser', {name: this.email})
          .subscribe(data => {
            this.http.post<any>('http://192.168.13.110:8888/api/updateuser', {name: this.email, superadmin: this.newsuperadmin, admin: this.newadmin, dispatch: this.newdispatch})
            .subscribe(data => {
              this.sendText = "Envoi..."
              setTimeout(() => {
                this.loadDroitsPersons();
                this.sendText = "Enregistré !";
                setTimeout(() => {
                  this.sendText = "Soumettre";
                }, 1000);
              }, 500);
              
            },
            error => {
              alert("Une erreur s'est produite. Veuillez réessayer.");
              this.sendText = "Soumettre";
            })
          },
          error => {
            alert("Une erreur s'est produite. Veuillez réessayer.");
            this.sendText = "Soumettre";
          })
        }
        else {
          this.http.post<any>('http://192.168.13.110:8888/api/updateuser', {name: this.email, superadmin: this.newsuperadmin, admin: this.newadmin, dispatch: this.newdispatch})
          .subscribe(data => {
            this.sendText = "Envoi..."
            setTimeout(() => {
              this.loadDroitsPersons();
              this.sendText = "Enregistré !";
              setTimeout(() => {
                this.sendText = "Soumettre"
              }, 1000);
            }, 500);
            
          },
          error => {
            alert("Une erreur s'est produite. Veuillez réessayer.")
            this.sendText = "Soumettre"
          })
        }
      },
      error => {
       console.log(error);
      });
  }
}

changeUser(name:string, isSuperAdmin: string, isAdmin:string, isDispatch: string, target:any) {
  this.email = name;
  
  if(isSuperAdmin == "X") {
    this.newsuperadmin = true;
  } else {
    this.newsuperadmin = false;
  }

  if(isAdmin == "X") {
    this.newadmin = true;
  } else {
    this.newadmin = false;
  }

  if(isDispatch == "X") {
    this.newdispatch = true;
  } else {
    this.newdispatch = false;
  }
  target.scrollTo({top: 50, behavior: 'smooth'});
}

toggleModal() {
  if(!this.isModalOn) {
    this.loadDroitsPersons();
    this.displayModal = "block";
    this.isModalOn = true;
  }
  else {
    this.displayModal = "none";
    this.isModalOn = false;
  }
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

getDroits() {
  var mail = this.getCookie("email");
  var url = "http://192.168.13.110:8888/api/droits?mail=" + mail; 
  this.http.get(url)
  .subscribe(result => {
    var x = JSON.parse(JSON.stringify(result))[0];
    if(x.isSuperAdmin) {
      this.adminAccess = true;
    } else if (x.isAdmin) {
      this.adminAccess = false;
    } else if (x.isDispatch) {
      this.adminAccess = false;
    } else {
      this.adminAccess = false;
    }
  },
  error => {
    console.log(error);
  });
}

loadDroitsPersons() {
  var url = "http://192.168.13.110:8888/api/getallusers"; 
  this.http.get(url)
  .subscribe(result => {
    var x = JSON.parse(JSON.stringify(result));
    console.log(x)
    for(let i=0; i<x.length; i++) {
      if(x[i]["isSuperAdmin"] == 1) {
        x[i]["isSuperAdmin"] = "X";
      } else {
        x[i]["isSuperAdmin"] = " ";
      }

      if(x[i]["isAdmin"] == 1) {
        x[i]["isAdmin"] = "X";
      } else {
        x[i]["isAdmin"] = " ";
      }

      if(x[i]["isDispatch"] == 1) {
        x[i]["isDispatch"] = "X";
      } else {
        x[i]["isDispatch"] = " ";
      }
    }
    
    this.users = x;
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
