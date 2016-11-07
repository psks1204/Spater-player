import {Injectable, OnChanges} from '@angular/core';
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class VideoService {

  public videoElement:any;
  public currentPath:string = "";
  public currentTitle:string = "loading...";
  public currentTime:number = 0;
  public totalTime:number = 0;
  public calculatedWidth:number;
  public calculatedBuffWidth:number;
  public calculatedScrubY:number;
  public calculatedVolWidth:number;
  public isMuted:boolean = false;
  public isPlaying:boolean = false;
  public isEnds:boolean = false;
  public isDragging:boolean = false;
  public isVolDragging:boolean = false;
  public showDetails:boolean = false;
  public isFullscreen:boolean = false;
  public currentDesc:string = "A very nice video...";
  public playlist:Array<Object> = [];

  constructor(private http:Http) {}

  appSetup(v:string) {
    this.videoElement = <HTMLVideoElement> document.getElementById(v);
    this.videoElement.addEventListener("loadedmetadata", this.updateData);
    this.videoElement.addEventListener("timeupdate", this.updateTime);
    this.videoElement.addEventListener("progress", this.updateBuffTime);
    window.setInterval(this.timerFired, 500);
  }

  gatherJSON = () => {
      this.http.get('./assets/playlist.json')
          .map((res:Response) => res.json())
          .subscribe(
              data => {
                  this.playlist = data;
                  this.selectedVideo(1);
              }
          );
  };

  selectedVideo = (i:number) => {
      this.currentTitle = this.playlist[i]['title'];
      this.currentDesc = this.playlist[i]['description'];
      this.videoElement.src = this.playlist[i]['path'];
      this.videoElement.pause();
      this.isPlaying = false;
  };

  seekVideo(e:any) {
      var w = document.getElementById('progressMeterFull').offsetWidth;
      var l = document.getElementById('main').offsetLeft;
      var d = this.videoElement.duration;
      if(!this.isFullscreen){
      var p = Math.floor(e.pageX - l - 15);
    }
      else{
      var p = Math.floor(e.pageX);
    }
      var s = Math.floor(p / w * d);
      this.videoElement.currentTime = s;
  };

  moveSlider = function(e){
    if(this.isVolDragging == true){
      this.dragVolStart(e);
    }
  }

  dragVolStart(e){
    var pos = document.getElementById('slider').offsetLeft;
    if(!this.isFullscreen){
      var posX = e.pageX - pos - 15;
    }else{
      var posX = e.pageX - pos;
    }
    var wid = document.getElementById('slider').offsetWidth;
    var val = posX*100/wid;
    if(val >= 0 && val <= 100){
      this.videoElement.volume = val / 100;
    }
    if(posX >= 0 && posX <= document.getElementById('slider').offsetWidth){
      this.calculatedVolWidth = posX;
    }
    this.isVolDragging = true;
  	if(this.videoElement.volume == 0){
  		this.isMuted = true;
  	} else {
  		this.isMuted = false;
  	}
  }

  moveStop = function(e){
    if(this.isVolDragging == true){
      this.isVolDragging = false;
    }
  }


  dragStart = function(e:any) {
      this.isDragging = true;
  };
  dragMove = function(e:any) {
      if(this.isDragging){
          var l = document.getElementById('main').offsetLeft;
        if(!this.isFullscreen){
          var g = Math.floor(e.x - l - 15);
        }else{
          var g = Math.floor(e.x);
        }
          this.calculatedWidth = g;
      }
  };
  dragStop = function(e:any) {
      if(this.isDragging){
          this.isDragging = false;
          this.seekVideo(e);
      }
  };

  muteVideo() {
    var mVol = this.calculatedVolWidth;
    var wid = document.getElementById('slider').offsetWidth;
    var val = mVol*100/wid;
      if(this.videoElement.volume == 0){
        this.isMuted = false;
        this.videoElement.volume = val / 100;
      }else{
          this.videoElement.volume = 0;
          this.isMuted = true;
      }
  }

  playVideo() {
      if(this.videoElement.paused) {
          this.videoElement.play();
          this.isPlaying = true;
      }else{
          this.videoElement.pause();
          this.isPlaying = false;
      }
  };

  updateData = (e:any) => {
      this.totalTime = this.videoElement.duration;
  };
  updateTime = (e:any) => {
      this.currentTime = this.videoElement.currentTime;
  };

  updateBuffTime = () => {
    var bufferedEnd = this.videoElement.buffered.end(0);
    var dur = this.videoElement.duration;
    this.calculatedBuffWidth = (bufferedEnd / dur * this.videoElement.offsetWidth);
  }

  timerFired = () => {
    if(!this.isDragging) {
      this.calculatedScrubY = this.videoElement.offsetHeight;
      var t = this.videoElement.currentTime;
      var d = this.videoElement.duration;
      this.calculatedWidth = (t / d * this.videoElement.offsetWidth);
    }
    if (this.videoElement.currentTime === this.videoElement.duration) {
      this.isEnds = true;
        }else{
        this.isEnds = false;
      }
      if(this.isEnds == true){
        this.isPlaying = false;
      }
  };

  details() {
      if(this.showDetails == false){
          this.showDetails = true;
      }else{
          this.showDetails = false;
      }
  };

  fullScreen() {
    var doc = document.getElementById('fullPlayer');
    if (this.isFullscreen == false){
      if(doc.requestFullscreen) {
          doc.requestFullscreen();
      }else if(doc.mozRequestFullScreen) {
          doc.mozRequestFullScreen();
      }else if(doc.webkitRequestFullscreen) {
          doc.webkitRequestFullscreen();
      }else if(doc.msRequestFullscreen) {
          doc.msRequestFullscreen();
      }
      this.isFullscreen = true;
    } else {
      if(document.exitFullScreen) {
          document.exitFullScreen();
      }else if(document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
      }else if(document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
      }else if(document.msExitFullScreen) {
          document.msExitFullScreen();
      }
      this.isFullscreen = false;
    }
  };

}
