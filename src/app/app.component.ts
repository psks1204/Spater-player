import { Component, OnInit } from '@angular/core';
import {VideoService} from "./video.service";
import {OptionsComponent} from './options.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [VideoService]
})

export class AppComponent implements OnInit {
  constructor(public videoService:VideoService) {}
    ngOnInit() {
        this.videoService.appSetup("videoDisplay");
        this.videoService.gatherJSON();
    }
}
