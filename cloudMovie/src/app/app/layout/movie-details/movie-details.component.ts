import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../movie.service';
import { Movie } from '../movie';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ReviewDialogComponent } from '../review-dialog/review-dialog.component';
import { SubscribeDialogComponent } from '../subscribe-dialog/subscribe-dialog.component';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit {

  isNotificationVisible = false;
  movie: Movie | undefined;

  @ViewChild('bgVideo', { static: false }) bgVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('fullScreenVideo', { static: false }) fullScreenVideo!: ElementRef<HTMLVideoElement>;

  isVideoVisible = false;

  isImageVisible = false;
  isUserRated = false;
  rate: number = 0;
  subscribe: {} | null = null;

  isInfoBoxVisible: boolean = false;
  actors: string[] | undefined;
  directors: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private router: Router,
    private location: Location,
    private dialog: MatDialog
  ) {}

  notImplemented() {
    throw new Error('Method not implemented.');
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

  addSubscribe(): void {
    const dialogRef = this.dialog.open(SubscribeDialogComponent, {
            panelClass: 'popup-overlay',
            data: { movie: this.movie } // Pass the movie data
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

        if (this.movie && this.movie.movieId) {
           // Call the addRating method from the service
            this.movieService.addRating("1", this.movie.movieId, this.rate).subscribe(response => {
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

  ngOnInit() {
    // Subscribe to both route params and query params
    this.route.params.subscribe(params => {
      const movieId = params['movieId']; // Get movieId from route params
      this.route.queryParams.subscribe(queryParams => {
        const createdAt = queryParams['createdAt']; // Get createdAt from query params

        // Call service method to get movie details
        this.movieService.getMovieById(movieId, createdAt).subscribe(data => {
          this.movie = data;
          this.actors = this.movie!.actors;
          this.directors = [this.movie!.director];

          console.log(data);
          this.getMovieRate('1', movieId);
          console.log(this.isUserRated)
        });
      });
    });
  }

  getMovieRate(user_id: string, movie_id: string) {
  this.movieService.getMovieRate(user_id, movie_id).subscribe(
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
      console.error('Error fetching movie rate:', error);
      this.isUserRated = false;
    }
  );
}

  checkVideoTime() {
    const video = this.bgVideo?.nativeElement;
    if (video !== undefined && video.currentTime >= 15) {
      video.pause();
      this.isImageVisible = true;
    }
  }

  downloadMovie() {
    this.movieService.getDownloadUrl(this.movie!.movieId, "1", this.movie!.genres).subscribe(response => {
      const presignedUrl = response.presigned_url;
      window.open(presignedUrl, '_blank');
    }, error => {
      console.log(error);
      alert('Failed to get presigned URL');
    });
  }

  watchNow() {
    if (this.movie) {
      this.movieService.getWatchUrl(this.movie.movieId).subscribe(response => {
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

  closeVideo() {
    const video = this.fullScreenVideo.nativeElement;
    if (video) {
      video.pause();
      video.src = '';
      this.isVideoVisible = false;
    }
  }

  deleteMovie() {
    if (this.movie) {
      this.movieService.deleteMovie(this.movie.movieId, this.movie.createdAt).subscribe(response => {
        alert('Movie deleted successfully');
        this.router.navigate(['/']); // Redirect to home page
      }, error => {
        console.log(error);
        alert('Failed to delete the movie');
      });
    }
  }
}
