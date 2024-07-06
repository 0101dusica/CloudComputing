import { Component, OnInit } from '@angular/core';
import { MovieService } from "../movie.service";
import { Observable } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchCriteria = {
    title: '',
    description: '',
    actors: '',
    director: '',
    genres: ''
  };
  selectedGenres: string[] = []
  genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance'];

  movies: any[] = [];
  filteredMovies: any[] = [];

  constructor(private movieService: MovieService) { }

  ngOnInit() {
    this.getMovies();
  }

  getMovies() {
    this.movieService.getMovies().subscribe(
      (movies: any[]) => {
        this.movies = movies;
        this.filteredMovies = movies;
      },
      error => {
        console.error('Error fetching movies:', error);
      }
    );
  }

  searchMovies() {
    // Konvertovanje unosa u mala slova
    const criteria = {
      title: this.searchCriteria.title.toLowerCase(),
      description: this.searchCriteria.description.toLowerCase(),
      actors: this.searchCriteria.actors.toLowerCase(),
      director: this.searchCriteria.director.toLowerCase(),
      genres: this.selectedGenres.map(genre => genre.toLowerCase()).join(',')
    };

    console.log(criteria);
    this.movieService.searchMovies(criteria).subscribe(
      (movies: any[]) => {
        this.filteredMovies = movies;
        console.log(movies);
      },
      error => {
        console.error('Error searching movies:', error);
      }
    );
  }

  // updateSelectedGenres(event: any, genre: string) {
  //   const checked = event.target.checked;
  //   if (checked) {
  //     this.selectedGenres.push(genre);
  //   } else {
  //     const index = this.selectedGenres.indexOf(genre);
  //     if (index > -1) {
  //       this.selectedGenres.splice(index, 1);
  //     }
  //   }
  // }
}
