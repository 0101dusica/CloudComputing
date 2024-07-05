import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-movie',
  templateUrl: './edit-movie.component.html',
  styleUrls: ['./edit-movie.component.css']
})
export class EditMovieComponent implements OnInit {
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

  loadedFiles: { [key: string]: File | null } = {
    thumbnail: null,
    trailer: null,
    video: null
  };

  ngOnInit(): void {
    this.loadMovieData();
  }

  loadMovieData() {
    // Fetch the movie data from the server or any other source
    // This is a placeholder example
    this.movie = {
      title: 'Sample Movie',
      year: 2023,
      description: 'This is a sample movie description.',
      actors: ['Actor 1', 'Actor 3'],
      directors: ['Director 1'],
      genres: ['Action', 'Comedy']
    };

    // Simulate loaded files
    this.loadedFiles['thumbnail'] = { name: 'sample-thumbnail.jpg' } as File;
    this.loadedFiles['trailer'] = { name: 'sample-trailer.mp4' } as File;
    this.loadedFiles['video'] = { name: 'sample-movie.mp4' } as File;
  }

  onFileSelected(event: any, type: string) {
    const file = event.target.files[0];
    this.loadedFiles[type] = file;
  }

  deleteFile(type: string) {
    this.loadedFiles[type] = null;
  }

  onSubmit() {
    console.log('Updated movie data:', this.movie);
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
