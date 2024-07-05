import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../movie.service';
import { Movie } from '../movie';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit {
  movie: Movie | undefined;
  notImplemented() {
    throw new Error('Method not implemented.');
  }

  @ViewChild('bgVideo') bgVideo: ElementRef<HTMLVideoElement> | undefined;
  isImageVisible = false;

  constructor(
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

  downloadMovie(){
    this.movieService.getDownloadUrl(this.movie!.movieId).subscribe(response => {
      const presignedUrl = response.presigned_url;
      window.open(presignedUrl, '_blank');
    }, error => {
      console.log(error);
      alert('Failed to get presigned URL');
    });
  }
}
