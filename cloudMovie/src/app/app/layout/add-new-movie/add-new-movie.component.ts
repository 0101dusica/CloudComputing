import { Component } from '@angular/core';
import { Movie } from "../movie";
import { Observable, of, switchMap } from "rxjs";
import { env } from "../../../../env/env";
import { HttpClient } from "@angular/common/http";
import Decimal from "decimal.js";
import { MovieService } from "../movie.service";
import { Director } from "../director.enum";

@Component({
  selector: 'app-add-new-movie',
  templateUrl: './add-new-movie.component.html',
  styleUrls: ['./add-new-movie.component.css']
})
export class AddNewMovieComponent {
  movie: Movie = {
    fileName: "",
    contentType: "video",
    fileSize: "",
    title: "",
    description: "",
    actors: [],
    director: "", // Initial director value should be an empty string
    genres: [],
    duration: "",
    movieId: "",
    createdAt: "",
    updatedAt: "",
    type: "movie",
    numberOfSeasons: "0"
  };
  actorsInput: string = ""; // Variable to store the input for actors
  selectedFile: File | null = null; // Variable to store the selected file

  constructor(private http: HttpClient, private movieService: MovieService) { }

  genres = ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'Sci-Fi', 'Thriller'];
  actors = ['Actor 1', 'Actor 2', 'Actor 3', 'Actor 4'];
  directors = Object.values(Director); // Get the list of directors from the enum

  onFileSelected(event: any, type: string) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files && fileInput.files[0];
    this.selectedFile = file;
    // Implement your file handling logic here
    this.movie.fileSize = new Decimal(parseFloat((file!.size / (1024 * 1024)).toFixed(1))).toString(); // Convert size to MB
    this.getMovieDuration(file!).then(duration => {
      this.movie.duration = new Decimal(duration).toString()
    });
    this.movie.fileName = file!.name.toLowerCase(); // Convert file name to lower case
  }

  onSubmit() {
    // Convert actors input to an array and lowercase
    this.movie.actors = this.actorsInput.split(',').map(actor => actor.trim().toLowerCase());
    // Convert title, description, director, and genres to lowercase
    this.movie.title = this.movie.title.toLowerCase();
    this.movie.description = this.movie.description.toLowerCase();
    this.movie.director = this.movie.director.toLowerCase();
    this.movie.genres = this.movie.genres.map(genre => genre.toLowerCase());

    console.log('Movie data:', this.movie);
    const movieReader = new FileReader();
    movieReader.readAsDataURL(this.selectedFile!);
    movieReader.onload = () => {
      const movieContent = movieReader.result as string;
      // Because movieContent starts with data:video/mp4;base64,{base64string}

      this.movieService.uploadMovie(this.movie, movieContent)
          .subscribe(() => {
            alert('Movie uploaded successfully')
          }, error => {
            console.log(error);
            alert('Error uploading')
          });
    }
  }

  onCheckboxChange(event: any, type: 'actors' | 'genres') {
    const value = event.target.value.toLowerCase(); // Convert checkbox value to lower case
    if (event.target.checked) {
      this.movie[type].push(value);
    } else {
      const index = this.movie[type].indexOf(value);
      if (index !== -1) {
        this.movie[type].splice(index, 1);
      }
    }
  }

  getMovieDuration(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
      const videoElement = document.createElement('video');
      videoElement.preload = 'metadata';

      videoElement.onloadedmetadata = () => {
        window.URL.revokeObjectURL(videoElement.src);
        const durationInMinutes = videoElement.duration / 60;
        resolve(durationInMinutes);
      };

      videoElement.onerror = () => {
        reject(new Error('Failed to load video metadata'));
      };

      videoElement.src = URL.createObjectURL(file);
    });
  }
}
