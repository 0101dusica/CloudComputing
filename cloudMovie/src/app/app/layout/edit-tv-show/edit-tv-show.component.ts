import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-tv-show',
  templateUrl: './edit-tv-show.component.html',
  styleUrls: ['./edit-tv-show.component.css']
})
export class EditTvShowComponent implements OnInit {
  show = {
    title: '',
    year: 0,
    description: '',
    seasons: 0, 
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
    this.loadShowData();
  }

  loadShowData() {
    // Fetch the movie data from the server or any other source
    // This is a placeholder example
    this.show = {
      title: 'Sample TV Show',
      year: 2023,
      description: 'This is a sample show description.',
      seasons: 3,
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
    console.log('Updated show data:', this.show);
    // Implement your submit logic here
  }

  onCheckboxChange(event: any, type: 'actors' | 'directors' | 'genres') {
    const value = event.target.value;
    if (event.target.checked) {
      this.show[type].push(value);
    } else {
      const index = this.show[type].indexOf(value);
      if (index !== -1) {
        this.show[type].splice(index, 1);
      }
    }
  }
}
