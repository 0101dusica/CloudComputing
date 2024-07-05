import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../movie.service';
import { Movie } from '../movie';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ReviewDialogComponent } from '../review-dialog/review-dialog.component';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit {
  
  isNotificationVisible = false;
  movie: Movie | undefined;
  notImplemented() {
    throw new Error('Method not implemented.');
  }

  @ViewChild('bgVideo') bgVideo: ElementRef<HTMLVideoElement> | undefined;
  isImageVisible = false;
  isUserRated = false;
  rate: number = 0;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private router: Router,
    private location: Location,
    private dialog: MatDialog
  ) {}

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
          console.log(data)
        });
      });
    });
  }

  checkVideoTime() {
    const video = this.bgVideo?.nativeElement;
    if (video !== undefined && video.currentTime >= 15) {
      video.pause();
      this.isImageVisible = true;
    }
  }

  downloadMovie() {
    this.movieService.getDownloadUrl(this.movie!.movieId).subscribe(response => {
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
        const video = this.bgVideo?.nativeElement;
        if (video) {
          video.src = presignedUrl;
          video.load();
          video.play();
        }
      }, error => {
        console.log(error);
        alert('Failed to get presigned URL for watching');
      });
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
