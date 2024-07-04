import { Component, ElementRef, ViewChild } from '@angular/core';

interface Episode {
  number: number;
  image: string;
  title: string;
  description: string;
  duration: string;
}

@Component({
  selector: 'app-tv-show-details',
  templateUrl: './tv-show-details.component.html',
  styleUrls: ['./tv-show-details.component.css']
})
export class TvShowDetailsComponent {
  isImageVisible: boolean = true;

  episodes: Episode[] = [
    { number: 1, image: '../../../../assets/episode-one.jpg', title: 'The Offer', description: 'While Haru Tawara develops a crush on a mysterious young woman at work, an unusual opportunity arises at his father\'s financially struggling brewery.', duration: '55m' },
    { number: 2, image: '../../../../assets/episode-two.jpg', title: 'The Trail', description: 'Haru accompanies Karen to investigate a whistleblower\'s apartment. Meanwhile, several other Tawaras are tempted to step out of their ordinary lives.', duration: '52m' },
    { number: 3, image: '../../../../assets/episode-three.jpg', title: 'The Flower', description: 'As Haru and Yoko\'s respective missions take unexpected turns, Nagi\'s mischievous adventures start attracting unwanted attention.', duration: '53m' },
    { number: 4, image: '../../../../assets/episode-four.jpg', title: 'The Resurrection', description: 'Karen confides in Haru about a longstanding suspicion. In the meantime, Soichi receives a shocking phone call that keeps him up at night.', duration: '52m' },
  ];

  notImplemented() {
    alert('This feature is not implemented yet.');
  }

  @ViewChild('bgVideo') bgVideo: ElementRef<HTMLVideoElement> | undefined;

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
