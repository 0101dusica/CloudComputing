import { Component } from '@angular/core';
import {Movie} from "../movie";
import {MovieService} from "../movie.service";
import Decimal from "decimal.js";

@Component({
  selector: 'app-add-new-tv-show',
  templateUrl: './add-new-tv-show.component.html',
  styleUrls: ['./add-new-tv-show.component.css']
})
export class AddNewTvShowComponent {
  show : Movie = {
    movieId: '',
    createdAt: '',
    updatedAt: '',
    type: "show",
    contentType: " ",
    fileName: ' ',
    fileSize: new Decimal(0).toString(),
    title: '',
    description: '',
    numberOfSeasons: "",
    actors: [],
    director: "Tom Nolan",
    genres: [],
    duration: new Decimal(0).toString(),
  };

  genres = ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'Sci-Fi', 'Thriller'];
  actors = ['Actor 1', 'Actor 2', 'Actor 3', 'Actor 4'];
  directors = ['Director 1', 'Director 2', 'Director 3', 'Director 4'];

  constructor(private movieService: MovieService)  {
  }

  onSubmit() {
    console.log('Show data:', this.show);
    this.show.numberOfSeasons = new Decimal(this.show.numberOfSeasons).toString()
    this.movieService.uploadMovie(this.show,"")
        .subscribe(() => {
         alert('TV show uploaded successfully')
        }, error => {
          console.log(error);
          alert('Error uploading')
        });
  }

  onCheckboxChange(event: any, type: 'actors' | 'genres') {
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
