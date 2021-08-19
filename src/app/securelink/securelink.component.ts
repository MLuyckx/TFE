import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import * as CryptoJS from 'crypto-js';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-securelink',
  templateUrl: './securelink.component.html',
  styleUrls: ['./securelink.component.css']
})

export class SecurelinkComponent implements OnInit {
  constructor() { }
  displayModal = "none";
  isModalOn = false;
  copyText = "Copier le lien"

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: any) {
    var isIncluded = false;
    var isButton = false;
    for(let i=0;i<event["path"].length; i++) {
      if(event["path"][i].className == "modal-content") {
        isIncluded = true;
      }
      else if(event["path"][i].className == "linkButton") {
          isButton = true;
          break;
      }
    }
    if(!isIncluded && !isButton && this.isModalOn) {
      this.toggleModal();
    }
  }

  
  ngOnInit(): void {
    this.createOptions();
  }
  
  validite = "";
  options = [{id: 0, label: 0, selected: false}];
  isShown:Boolean = false;
  securedLink:string = "";
  securedUrl: string = "";
  selectedOption: string = "2";

  toggleModal() {
    if(!this.isModalOn) {
      this.displayModal = "block";
      this.isModalOn = true;
    }
    else {
      this.displayModal = "none";
      this.isModalOn = false;
      this.isShown = false;
    }
  }
  
  generateSecureLink() {
    var duree = parseInt(this.selectedOption);
    var d = new Date();
    d.setHours(d.getHours()+duree);
    var expiretime = Math.floor(d.valueOf()/1000);
    var secret = "drone";
    var input = expiretime + "/limited/index.html " + secret;
    var hash = CryptoJS.MD5(input)
    var output = hash.toString(CryptoJS.enc.Base64);
    output = output.replace('=','');
    output = output.replace('+','-');
    output = output.replace('/','_');
    var link = "http://192.168.13.110:8080/limited/index.html?md5=" + output + '&expires=' + expiretime;
    var url = '<a href=' + link + ' target="_blank" style="text-decoration:none, underline; color: white;">' + link + '</a>';
    this.validite = "Ce lien est valable jusqu'au " + d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear() + " à " + d.getHours() + ":" + (d.getMinutes()<10?'0':'') + d.getMinutes();
    this.isShown = true;
    this.securedLink = link;
    this.securedUrl = url;
  }

  createOptions() {
    this.options = [];
    for(let i=1; i<=24; i++) {
        if(i==2) {
          this.options.push({id: i, label: i, selected: true})
        } else {
          this.options.push({id: i, label: i, selected: false})
        }
    }
  }

  copyLink() {
    const selBox = document.createElement("input");
    selBox.value = this.securedLink;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.copyText = "Copié !"
    setTimeout(() => {
      this.copyText = "Copier le lien"
    }, 1000);
  }
}
