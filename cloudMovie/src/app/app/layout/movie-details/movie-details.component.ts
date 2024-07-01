import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent {
  notImplemented() {
    throw new Error('Method not implemented.');
  }

  @ViewChild('bgVideo') bgVideo: ElementRef<HTMLVideoElement> | undefined;
  isImageVisible = false;

  checkVideoTime() {
    const video = this.bgVideo?.nativeElement;
    if (video != undefined) {
      if(video.currentTime >= 15){
        video.pause();
        this.isImageVisible = true;
      }
    }
  }
}
