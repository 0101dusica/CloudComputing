import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MovieService} from "../movie.service";
import {Location} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {Episode, Movie} from "../movie";
import {Director} from "../director.enum";
import Decimal from "decimal.js";

@Component({
  selector: 'app-edit-movie',
  templateUrl: './edit-movie.component.html',
  styleUrls: ['./edit-movie.component.css']
})
export class EditMovieComponent implements OnInit {
  movie: Movie | undefined;
  episode: Episode | undefined;

  selectedFile: File | null = null; // Variable to store the selected file

    generatePresignedUrl: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private router: Router,
    private location: Location,
    private dialog: MatDialog
  ) {}
 genres = [
    { name: 'Action', isChecked: false },
    { name: 'Comedy', isChecked: false },
    { name: 'Drama', isChecked: false },
    { name: 'Fantasy', isChecked: false },
    { name: 'Horror', isChecked: false },
    { name: 'Romance', isChecked: false },
    { name: 'Sci-Fi', isChecked: false },
    { name: 'Thriller', isChecked: false }
  ];  actors = ['Actor 1', 'Actor 2', 'Actor 3', 'Actor 4'];
  directors: string[] = Object.values(Director).map(director => this.capitalizeFirstLetters(director)); // Get the list of directors from the enum

  loadedFiles: { [key: string]: File | null } = {
    thumbnail: null,
    trailer: null,
    video: null
  };
  actorsString: string = ''; // String for comma-separated actors
  selectedDirector: string | undefined;
  movieContent: string = ''; // String for comma-separated actors

  ngOnInit(): void {
    this.loadMovieData();

    this.route.params.subscribe(params => {
      const movieId = params['movieId']; // Get movieId from route params
      this.route.queryParams.subscribe(queryParams => {
        const createdAt = queryParams['createdAt']; // Get createdAt from query params

        // Call service method to get movie details
        this.movieService.getMovieById(movieId, createdAt).subscribe(data => {

          this.movie = data;
          console.log(this.movie)
          this.actorsString = this.movie!.actors.join(', '); // Convert actors array to string

          this.selectedDirector = this.capitalizeFirstLetters(this.movie!.director); // Set initial selected director

          this.genres.forEach(genre => {
            genre.isChecked = this.movie!.genres.includes(genre.name.toLowerCase());
          });
          console.log(data);
        });
      });
    });
  }

  loadMovieData() {
    // Fetch the movie data from the server or any other source
    // This is a placeholder example
    this.loadedFiles['video'] = { name: this.movie?.fileName } as File;
  }

  onFileSelected(event: any, type: string) {
     const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files && fileInput.files[0];
    this.loadedFiles[type] = file;
    this.generatePresignedUrl = true;
    this.selectedFile = file;
    // Implement your file handling logic here
    if(this.movie){
      this.movie.fileSize = new Decimal(parseFloat((file!.size / (1024 * 1024)).toFixed(1))).toString(); // Convert size to MB
    this.getMovieDuration(file!).then(duration => {
      this.movie!.duration = new Decimal(duration).toString()
    });
    this.movie.fileName = file!.name.toLowerCase(); // Convert file name to lower case
    }

  }

  deleteFile(type: string) {
    this.loadedFiles[type] = null;
  }

  onSubmit() {
    console.log('Updated movie data:', this.movie);
    // Implement your submit logic here
      this.movie!.director = this.selectedDirector!;
      this.movie!.actors = this.actorsString.split(',').map(actor => actor.trim().toLowerCase());
      this.movie!.genres = this.movie!.genres.map(genre => genre.toLowerCase());


      if(this.generatePresignedUrl){
          const movieReader = new FileReader();
        movieReader.readAsDataURL(this.selectedFile!);
        movieReader.onload = () => {
             this.movieContent = movieReader.result as string;
            // Because movieContent starts with data:video/mp4;base64,{base64string}
        }
          this.movieService.updateMovie(this.movie!.movieId,this.movie!, this.movieContent,this.generatePresignedUrl)
              .subscribe(() => {
                alert('Movie uploaded successfully')
              }, error => {
                console.log(error);
                alert('Error uploading')
              });

      }else{
           this.movieService.updateMovie(this.movie!.movieId,this.movie!, this.movieContent,this.generatePresignedUrl)
              .subscribe(() => {
                alert('Movie uploaded successfully')
              }, error => {
                console.log(error);
                alert('Error uploading')
              });
      }

  }

  onCheckboxChange(event: any, genre: string) {
    const isChecked = event.target.checked;
    if (isChecked) {
      if (!this.movie!.genres.includes(genre.toLowerCase())) {
        this.movie!.genres.push(genre.toLowerCase());
      }
    } else {
      const index = this.movie!.genres.indexOf(genre.toLowerCase());
      if (index !== -1) {
        this.movie!.genres.splice(index, 1);
      }
    }
  }

  private capitalizeFirstLetters(str: string): string {
    return str.split(' ').map(word => this.capitalizeFirstLetter(word)).join(' ');
  }

    private capitalizeFirstLetter(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
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
