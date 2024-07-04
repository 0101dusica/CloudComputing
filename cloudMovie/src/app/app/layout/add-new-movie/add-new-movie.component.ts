import { Component } from '@angular/core';

@Component({
  selector: 'app-add-new-movie',
  templateUrl: './add-new-movie.component.html',
  styleUrls: ['./add-new-movie.component.css']
})
export class AddNewMovieComponent {
  movie = {
    title: '',
    year: 0,
    description: '',
    actors: [] as string[],
    directors: [] as string[],
    genres: [] as string[]
  };

  genres = ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'Sci-Fi', 'Thriller'];
  actors = ['Actor 1', 'Actor 2', 'Actor 3', 'Actor 4'];
  directors = ['Director 1', 'Director 2', 'Director 3', 'Director 4'];

  onFileSelected(event: any, type: string) {
    const file = event.target.files[0];
    // Implement your file handling logic here
  }

  onSubmit() {
    console.log('Movie data:', this.movie);
    // Implement your submit logic here
  }

  onCheckboxChange(event: any, type: 'actors' | 'directors' | 'genres') {
    const value = event.target.value;
    if (event.target.checked) {
      this.movie[type].push(value);
    } else {
      const index = this.movie[type].indexOf(value);
      if (index !== -1) {
        this.movie[type].splice(index, 1);
      }
    }
  }
}
