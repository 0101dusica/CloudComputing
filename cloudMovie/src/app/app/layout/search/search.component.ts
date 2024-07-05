import { Component } from '@angular/core';

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

  movies = [
    { title: 'Apollo 13', image: '../../../../assets/poster-one.jpg', description: 'Space mission', actors: ['Tom Hanks'], directors: ['Ron Howard'], genres: ['Drama', 'History'] },
    { title: 'Oldboy', image: '../../../../assets/poster-two.jpg', description: 'Revenge story', actors: ['Choi Min-sik'], directors: ['Park Chan-wook'], genres: ['Action', 'Thriller'] },
    { title: 'Pacific Rim', image: '../../../../assets/poster-three.jpg', description: 'Robots vs Monsters', actors: ['Charlie Hunnam'], directors: ['Guillermo del Toro'], genres: ['Action', 'Sci-Fi'] },
    { title: 'Jurassic World', image: '../../../../assets/poster-four.jpg', description: 'Dinosaur Park', actors: ['Chris Pratt'], directors: ['Colin Trevorrow'], genres: ['Action', 'Sci-Fi'] },
    { title: 'The Garfield Show', image: '../../../../assets/poster-five.jpg', description: 'Cartoon show', actors: ['Frank Welker'], directors: ['Phil Roman'], genres: ['Comedy', 'Family'] },
    { title: 'Blazing Saddles', image: '../../../../assets/poster-six.jpg', description: 'Western parody', actors: ['Cleavon Little'], directors: ['Mel Brooks'], genres: ['Comedy', 'Western'] },
    { title: 'Apollo 13', image: '../../../../assets/poster-seven.jpg', description: 'Space mission', actors: ['Tom Hanks'], directors: ['Ron Howard'], genres: ['Drama', 'History'] },
    { title: 'Oldboy', image: '../../../../assets/poster-eight.jpg', description: 'Revenge story', actors: ['Choi Min-sik'], directors: ['Park Chan-wook'], genres: ['Action', 'Thriller'] },
    { title: 'Pacific Rim', image: '../../../../assets/poster-nine.jpg', description: 'Robots vs Monsters', actors: ['Charlie Hunnam'], directors: ['Guillermo del Toro'], genres: ['Action', 'Sci-Fi'] },
    { title: 'Jurassic World', image: '../../../../assets/poster-ten.jpg', description: 'Dinosaur Park', actors: ['Chris Pratt'], directors: ['Colin Trevorrow'], genres: ['Action', 'Sci-Fi'] },
    { title: 'The Garfield Show', image: '../../../../assets/poster-eleven.jpg', description: 'Cartoon show', actors: ['Frank Welker'], directors: ['Phil Roman'], genres: ['Comedy', 'Family'] },
    { title: 'Blazing Saddles', image: '../../../../assets/poster-twelve.png', description: 'Western parody', actors: ['Cleavon Little'], directors: ['Mel Brooks'], genres: ['Comedy', 'Western'] },    { title: 'Apollo 13', image: '../../../../assets/poster-one.jpg', description: 'Space mission', actors: ['Tom Hanks'], directors: ['Ron Howard'], genres: ['Drama', 'History'] },
    { title: 'Oldboy', image: '../../../../assets/poster-two.jpg', description: 'Revenge story', actors: ['Choi Min-sik'], directors: ['Park Chan-wook'], genres: ['Action', 'Thriller'] },
    { title: 'Pacific Rim', image: '../../../../assets/poster-three.jpg', description: 'Robots vs Monsters', actors: ['Charlie Hunnam'], directors: ['Guillermo del Toro'], genres: ['Action', 'Sci-Fi'] },
    { title: 'Jurassic World', image: '../../../../assets/poster-four.jpg', description: 'Dinosaur Park', actors: ['Chris Pratt'], directors: ['Colin Trevorrow'], genres: ['Action', 'Sci-Fi'] },
    { title: 'The Garfield Show', image: '../../../../assets/poster-five.jpg', description: 'Cartoon show', actors: ['Frank Welker'], directors: ['Phil Roman'], genres: ['Comedy', 'Family'] },
    { title: 'Blazing Saddles', image: '../../../../assets/poster-six.jpg', description: 'Western parody', actors: ['Cleavon Little'], directors: ['Mel Brooks'], genres: ['Comedy', 'Western'] },
    { title: 'Apollo 13', image: '../../../../assets/poster-seven.jpg', description: 'Space mission', actors: ['Tom Hanks'], directors: ['Ron Howard'], genres: ['Drama', 'History'] },
    { title: 'Oldboy', image: '../../../../assets/poster-eight.jpg', description: 'Revenge story', actors: ['Choi Min-sik'], directors: ['Park Chan-wook'], genres: ['Action', 'Thriller'] },
    { title: 'Pacific Rim', image: '../../../../assets/poster-nine.jpg', description: 'Robots vs Monsters', actors: ['Charlie Hunnam'], directors: ['Guillermo del Toro'], genres: ['Action', 'Sci-Fi'] },
    { title: 'Jurassic World', image: '../../../../assets/poster-ten.jpg', description: 'Dinosaur Park', actors: ['Chris Pratt'], directors: ['Colin Trevorrow'], genres: ['Action', 'Sci-Fi'] },
    { title: 'The Garfield Show', image: '../../../../assets/poster-eleven.jpg', description: 'Cartoon show', actors: ['Frank Welker'], directors: ['Phil Roman'], genres: ['Comedy', 'Family'] },
    { title: 'Blazing Saddles', image: '../../../../assets/poster-twelve.png', description: 'Western parody', actors: ['Cleavon Little'], directors: ['Mel Brooks'], genres: ['Comedy', 'Western'] },
    // Add more movies as needed
  ];

  filteredMovies = this.movies;

  searchMovies() {
    this.filteredMovies = this.movies.filter(movie => {
      return (
        movie.title.toLowerCase().includes(this.searchCriteria.title.toLowerCase()) &&
        movie.description.toLowerCase().includes(this.searchCriteria.description.toLowerCase()) &&
        movie.actors.some(actor => actor.toLowerCase().includes(this.searchCriteria.actors.toLowerCase())) &&
        movie.directors.some(director => director.toLowerCase().includes(this.searchCriteria.directors.toLowerCase())) &&
        (this.searchCriteria.genres.length === 0 || this.searchCriteria.genres.some(genre => movie.genres.includes(genre)))
      );
    });
  }
}
