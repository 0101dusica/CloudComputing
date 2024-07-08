import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../movie.service';
import {Movie} from "../movie";
import {forkJoin, map, tap} from "rxjs";
import {AuthService} from "../../auth/auth.service"; // Adjust the path as per your project structure

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  movies: Movie[] = []; // Define the movies array to hold movie data
  username: string | undefined

  constructor(private route: ActivatedRoute, private movieService: MovieService, private authService: AuthService) { }

  id: number | null = null;

  ngOnInit() {
    this.username = this.authService.email;
    console.log("USERNAME ", this.username)
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      this.id = idParam !== null ? +idParam : null;
    });

    // Call the getMovies function when component initializes
    // this.getMovies()
    this.generateFeed()


  }

  generateFeed() {
    this.movieService.generateUserFeed(this.username!).subscribe(
      (response) => {
        console.log('User feed generated:', response);
        this.processMovies(response)
      },
      (error) => {
        console.error('Error generating user feed:', error);
      }
    );
  }

processMovies(response: any[]) {
  const movieObservables = response.map((item, index) => {
    return this.movieService.getMovieById(item.movie_id, item.created_at)
      .pipe(
        map(movie => ({
          index: index,
          movie: movie
        }))
      );
  });

  // Wait for all getMovieById calls to complete
  forkJoin(movieObservables).subscribe(
    (movies) => {
      // Sort movies by their original index
      this.movies = movies.sort((a, b) => a.index - b.index).map(item => item.movie);
      console.log('All movies processed:', this.movies);
    },
    (error) => {
      console.error('Error processing movies:', error);
    }
  );
}

  getRouterLink(movie: any): string[] {
    if (movie.type === 'show') {
      return ['/tv-show-details', movie.movieId];
    } else {
      return ['/movie-details', movie.movieId];
    }
  }

  @ViewChild('widgetsContent') widgetsContent: ElementRef | undefined;

  scrollLeft() {
    const container = this.widgetsContent!.nativeElement;
  container.scrollBy({
    left: -container.offsetWidth,
    behavior: 'smooth'
  });
  }

  scrollRight() {
    const container = this.widgetsContent!.nativeElement;
    container.scrollBy({
      left: container.offsetWidth,
      behavior: 'smooth'
    });
  }


}
