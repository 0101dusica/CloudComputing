import { Component } from '@angular/core';
import {MovieService} from "../movie.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  searchCriteria = {
    title: '',
    description: '',
    actors: '',
    directors: '',
    genres: []
  };

  genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance'];

  filteredMovies: any[] = [];

  constructor(private movieService: MovieService) { }

  searchMovies() {
    this.movieService.searchMovies(this.searchCriteria).subscribe(
      (movies: any[]) => {
        this.filteredMovies = movies;
      },
      error => {
        console.error('Error searching movies:', error);
      }
    );
  }
}
