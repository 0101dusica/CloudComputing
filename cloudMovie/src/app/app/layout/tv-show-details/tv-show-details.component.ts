import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ReviewDialogComponent } from '../review-dialog/review-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SubscribeDialogComponent } from '../subscribe-dialog/subscribe-dialog.component';
import { MovieService } from '../movie.service';
import {Episode, Movie} from '../movie';
import Swal from "sweetalert2";


@Component({
  selector: 'app-tv-show-details',
  templateUrl: './tv-show-details.component.html',
  styleUrls: ['./tv-show-details.component.css']
})
export class TvShowDetailsComponent implements OnInit {

  @ViewChild('bgVideo', { static: false }) bgVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('fullScreenVideo', { static: false }) fullScreenVideo!: ElementRef<HTMLVideoElement>;

  isVideoVisible = false;
  series: Movie | undefined;
  isNotificationVisible = false;
  isImageVisible: boolean = true;
  isUserRated = false;
  rate: number = 0;
  subscribe: {} | null = null;
  isInfoBoxVisible: boolean = false;

  actors: string[] | undefined;
  directors: string[] = [];
  episodes: Episode[] = [];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private movieService: MovieService
  ) {}

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

          // Load episodes for the series
          if (this.series && this.series.movieId) {
            this.loadEpisodes(this.series.movieId);
          }

          console.log(data);
          this.getMovieRate("1", this.series!.movieId)
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

  getMovieRate(user_id: string, series_id: string) {
  this.movieService.getMovieRate(user_id, series_id).subscribe(
    (response: any) => {
      if (response) {
        this.rate = response.rate;
        this.isUserRated = true;
        console.log("User rating found:", this.rate);
      } else {
        console.log("Rate not found or response is invalid");
        this.isUserRated = false;
      }
      console.log("isUserRated:", this.isUserRated);
    },
    (error) => {
      console.error('Error fetching series rate:', error);
      this.isUserRated = false;
    }
  );
}

  loadEpisodes(seriesId: string) {
    this.movieService.getEpisodesBySeriesId(seriesId).subscribe(episodes => {
      this.episodes = episodes;
      console.log(episodes)
    }, error => {
      console.error('Error loading episodes:', error);
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
            panelClass: 'popup-overlay',
            data: { movie: this.series } // Pass the movie data
        });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.subscribe = result;

        // @ts-ignore
        this.movieService.subscribe("1", this.subscribe.genres, this.subscribe.actors, this.subscribe.director).subscribe(response => {
          console.log('Subscription successful', response);
          alert('Successfully subscribed!');
        }, error => {
          console.error('Error doing subscription', error);
          alert('Unsuccessfully subscribed. Please try again later.');
        });
      }
    });
  }

  onNotificationIconClick(): void {
    this.isNotificationVisible = !this.isNotificationVisible;
    this.addReview(); // Ensure the dialog is opened here
  }

  addReview(): void {
    const dialogRef = this.dialog.open(ReviewDialogComponent, {
      panelClass: 'popup-overlay'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rate = result;
        this.isUserRated = true;


         if (this.series && this.series.movieId) {
                // Call the addRating method from the service
           console.log("ID " + this.series.movieId)
           console.log("RATE " + this.rate)
            this.movieService.addRating("1", this.series.movieId, this.rate).subscribe(response => {
                console.log('Rating successful', response);
                alert('You have successfully added your rating!');
            }, error => {
                console.error('Error rating movie', error);
                alert('There was an error adding your rating. Please try again later.');
            });
         } else {
            console.error('Series or series.movieId is undefined');
            alert('There was an error adding your rating. Please try again later.');
         }
      }

    });
  }

  scrollToTop() {
    window.scrollTo(0, 0);
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

  notImplemented() {

  }

 ceilValue(value: string): number {
    const numberValue = parseFloat(value);
    return Math.ceil(numberValue);
  }

  playEpisode(episode: Episode) {
if (episode) {
      this.movieService.getWatchUrl(episode.episodeId).subscribe(response => {
        const presignedUrl = response.presignedUrl;
        const video = this.fullScreenVideo.nativeElement;
        if (video) {
          video.src = presignedUrl;
          video.load();
          video.play();
          this.isVideoVisible = true;
        }
      }, error => {
        console.log(error);
        alert('Failed to get presigned URL for watching');
      });
    }
  }



  editEpisode(episode: Episode) {

  }

  deleteEpisode(episode: Episode) {
    if (episode) {
      this.movieService.deleteMovie(episode.episodeId, episode.createdAt).subscribe(response => {
        alert('Movie deleted successfully');
        this.router.navigate(['/']); // Redirect to home page
      }, error => {
        console.log(error);
        alert('Failed to delete the movie');
      });
    }
  }

  delete() {
    console.log(this.episodes.length)
     if (this.episodes.length != 0) {
           console.log((this.episodes.length))


      Swal.fire({
        icon: 'warning',
        title: 'Cannot Delete',
        text: 'This series cannot be deleted because it has episodes.',
        confirmButtonText: 'Close'
      });
    } else {
           console.log((this.episodes.length + '>>>'))
        if (this.series) {
              this.movieService.deleteMovie(this.series.movieId, this.series.createdAt).subscribe(response => {
                alert('Movie deleted successfully');
                this.router.navigate(['/']); // Redirect to home page
              }, error => {
                console.log(error);
                alert('Failed to delete the movie');
              });
            }
      // Poziv za brisanje serije
      // Tvoj kod za brisanje serije ovde
      Swal.fire({
        icon: 'success',
        title: 'Deleted',
        text: 'The series has been deleted successfully!',
        confirmButtonText: 'OK'
      });
    }
  }

  downloadEpisode(episode: Episode) {
    this.movieService.getDownloadUrl(episode.episodeId, "1", this.series!.genres).subscribe(response => {
      const presignedUrl = response.presigned_url;
      window.open(presignedUrl, '_blank');
    }, error => {
      console.log(error);
      alert('Failed to get presigned URL');
    });
  }

}
