import { Component, OnInit } from '@angular/core';
import videojs from 'video.js';

// var videojs : any ;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  
})

export class AppComponent {
    
// public videoJsConfigObj = {
//   preload: "metadata",
//   controls: true,
//   autoplay: false,
//   overrideNative: true,
//   techOrder: ["html5", "flash"],
//   html5: {
//       nativeVideoTracks: true,
//       nativeAudioTracks: false,
//       nativeTextTracks: false,
//       hls: {
//           withCredentials: false,
//           overrideNative: true,
//           debug: true
//       }
//   }
// };
ngOnInit() {

// var player = videojs('my-video', this.videoJsConfigObj);

}


  title = 'zsbwDrone';

  // changeSrc(source: string) {
  //   if(source == "live") {
  //       window.location.href = window.location.href;
  //   }
  //   else {
  //       var source = "http://192.168.13.110:8080/replay/" + source;
  //       window.player.updateSrc([
  //           { type: "video/mp4", src: source, label:'HD' }
  //       ]);
  //       document.getElementById("backToLive").style.display = "block";
  //   }
  //   window.scrollTo({top: 0, behavior: 'smooth'})
  // }

  // notification(text: string) {
  //     document.getElementById("newFlux").innerText = text;
  //     document.getElementById("newFluxDiv").style.display = "block";
  // }

  // stopNotification() {
  //     document.getElementById("newFluxDiv").style.display = "none";
  // }

  // getFlux() {
  //     var xhttp = new XMLHttpRequest();
  //     xhttp.onreadystatechange = function() {
  //         if (this.readyState == 4 && this.status == 200) {
  //             var data = JSON.parse(this.responseText);
  //             if(data.length != 0) {
  //                 var isStreaming = false;
  //                 for(file in data) {
  //                     if(data[file].name == "index.m3u8") {
  //                         isStreaming = true;
  //                     }
  //                 }
  //                 if(isStreaming) {
  //                   this.notification('Une retransmission en direct est en cours.');
  //                     document.getElementById("buttonLive").style.display = "auto";
  //                 }
  //                 else {
  //                   this.stopNotification();
  //                     document.getElementById("buttonLive").style.display = "none";
  //                 }
  //             }
  //             else {
  //                 this.stopNotification();
  //                 document.getElementById("buttonLive").style.display = "none";
  //             }
  //         };
  //     }
  //     xhttp.open("GET", "http://192.168.13.110:8080/live", true);
  //     xhttp.send();
  // }

  // updateFlux() {
  //     this.getFlux();
  //     setTimeout(this.updateFlux, 30000)
  // }
}

