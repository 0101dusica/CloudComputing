import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import { ReviewDialogComponent } from '../review-dialog/review-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SubscribeDialogComponent } from '../subscribe-dialog/subscribe-dialog.component';
import {MovieService} from "../movie.service";
import {Movie} from "../movie";

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
export class TvShowDetailsComponent implements OnInit {

  @ViewChild('bgVideo', { static: false }) bgVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('fullScreenVideo', { static: false }) fullScreenVideo!: ElementRef<HTMLVideoElement>;

  isVideoVisible = false;
  series: Movie | undefined
  isNotificationVisible = false;
  isImageVisible: boolean = true;
  isUserRated = false;
  rate: number = 0;
  subscribe: {} | null = null;
  isInfoBoxVisible: boolean = false;

  actors: string[] | undefined;
  directors: string[] = [];

  constructor(private router: Router,
              private dialog: MatDialog,
              private route: ActivatedRoute,
              private movieService: MovieService) {}

  ngOnInit() {
    // Subscribe to both route params and query params
    this.route.params.subscribe(params => {
      const movieId = params['movieId']; // Get movieId from route params
      this.route.queryParams.subscribe(queryParams => {
        const createdAt = queryParams['createdAt']; // Get createdAt from query params

        // Call service method to get movie details
        this.movieService.getMovieById(movieId, createdAt).subscribe(data => {
          this.series = data;
          this.actors = this.series!.actors;
          this.directors = [this.series!.director];

          console.log("sta je series"+data)
          console.log(data)
        });
      });
    });
    this.scrollToTop();

    // Ensure the scroll to top occurs on every route change within this component
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.scrollToTop();
      }
    });
  }


  showInfoBox() {
    this.isInfoBoxVisible = true;
  }

  hideInfoBox() {
    this.isInfoBoxVisible = false;
  }

  onSubscribeIconClick(): void {
    this.isNotificationVisible = !this.isNotificationVisible;
    this.addSubscribe(); // Ensure the dialog is opened here
  }

  onSubscribePopupClick(event: Event): void {
    if (this.isNotificationVisible && event.target instanceof HTMLElement && !event.target.closest('.notification-dropdown')) {
       this.isNotificationVisible = false;
    }
  }

  addSubscribe(): void {
    const dialogRef = this.dialog.open(SubscribeDialogComponent, {
      panelClass: 'popup-overlay'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.subscribe = result;
        console.log("You are subscribed at: ", result);
      }
    });
  }

  onNotificationIconClick(): void {
    this.isNotificationVisible = !this.isNotificationVisible;
    this.addReview(); // Ensure the dialog is opened here
  }

  onNotificationPopupClick(event: Event): void {
    if (this.isNotificationVisible && event.target instanceof HTMLElement && !event.target.closest('.notification-dropdown')) {
       this.isNotificationVisible = false;
    }
  }

  addReview(): void {
    const dialogRef = this.dialog.open(ReviewDialogComponent, {
      panelClass: 'popup-overlay'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rate = result;
        this.isUserRated = true;
        alert('You have successfully added your rating!');
      }
    });
  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }


  episodes: Episode[] = [
    { number: 1, image: '../../../../assets/episode-one.jpg', title: 'The Offer', description: 'While Haru Tawara develops a crush on a mysterious young woman at work, an unusual opportunity arises at his father\'s financially struggling brewery.', duration: '55m' },
    { number: 2, image: '../../../../assets/episode-two.jpg', title: 'The Trail', description: 'Haru accompanies Karen to investigate a whistleblower\'s apartment. Meanwhile, several other Tawaras are tempted to step out of their ordinary lives.', duration: '52m' },
    { number: 3, image: '../../../../assets/episode-three.jpg', title: 'The Flower', description: 'As Haru and Yoko\'s respective missions take unexpected turns, Nagi\'s mischievous adventures start attracting unwanted attention.', duration: '53m' },
    { number: 4, image: '../../../../assets/episode-four.jpg', title: 'The Resurrection', description: 'Karen confides in Haru about a longstanding suspicion. In the meantime, Soichi receives a shocking phone call that keeps him up at night.', duration: '52m' },
  ];

  notImplemented() {
    alert('This feature is not implemented yet.');
  }

  checkVideoTime() {
    const video = this.bgVideo?.nativeElement;
    if (video != undefined) {
      if(video.currentTime >= 15){
        video.pause();
        this.isImageVisible = true;
      }
    }
  }

  watchNow() {
    alert('This feature is not implemented yet.');
    // if (this.movie) {
    //   this.movieService.getWatchUrl(this.movie.movieId).subscribe(response => {
    //     const presignedUrl = response.presignedUrl;
    //     const video = this.fullScreenVideo.nativeElement;
    //     if (video) {
    //       video.src = presignedUrl;
    //       video.load();
    //       video.play();
    //       this.isVideoVisible = true;
    //     }
    //   }, error => {
    //     console.log(error);
    //     alert('Failed to get presigned URL for watching');
    //   });
    // }
  }

  closeVideo() {
    const video = this.fullScreenVideo.nativeElement;
    if (video) {
      video.pause();
      video.src = '';
      this.isVideoVisible = false;
    }
  }



}
