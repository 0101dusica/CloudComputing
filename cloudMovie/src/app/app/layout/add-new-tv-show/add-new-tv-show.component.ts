import { Component } from '@angular/core';

@Component({
  selector: 'app-add-new-tv-show',
  templateUrl: './add-new-tv-show.component.html',
  styleUrls: ['./add-new-tv-show.component.css']
})
export class AddNewTvShowComponent {
  show = {
    title: '',
    description: '',
    seasons: 0, 
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
    console.log('Show data:', this.show);
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
