import { Component } from '@angular/core';
import {Movie} from "../movie";
import {Observable, of, switchMap} from "rxjs";
import {env} from "../../../../env/env";
import {HttpClient} from "@angular/common/http";
import Decimal from "decimal.js";
import {MovieService} from "../movie.service";

@Component({
  selector: 'app-add-new-movie',
  templateUrl: './add-new-movie.component.html',
  styleUrls: ['./add-new-movie.component.css']
})
export class AddNewMovieComponent {
  movie : Movie = {
    fileName: "",
    contentType: "video",
    fileSize: "",
    title: "",
    description: "",
    actors: [],
    director: "Tom",
    genres: [],
    duration: "",
    movieId: "",
    createdAt: "",
    updatedAt: ""
  };

  selectedFile: File | null = null; // Variable to store the selected file

  constructor(private http: HttpClient, private movieService: MovieService){}

  genres = ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'Sci-Fi', 'Thriller'];
  actors = ['Actor 1', 'Actor 2', 'Actor 3', 'Actor 4'];
  directors = ['Director 1', 'Director 2', 'Director 3', 'Director 4'];

  onFileSelected(event: any, type: string) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files && fileInput.files[0];
    this.selectedFile = file;
    // Implement your file handling logic here
    this.movie.fileSize = new Decimal(parseFloat((file!.size / (1024 * 1024)).toFixed(1))).toString(); // Convert size to MB
    this.getMovieDuration(file!).then(duration => {
      this.movie.duration = new Decimal(duration).toString()
    });
    this.movie.fileName = file!.name;

  }

  onSubmit() {
    console.log('Movie data:', this.movie);
    const movieReader = new FileReader();
      movieReader.readAsDataURL(this.selectedFile!);
      movieReader.onload = () => {
        const movieContent = movieReader.result as string;
        //Because movieContent starts with data:video/mp4;base64,{base64string}


        this.movieService.uploadMovie(this.movie,movieContent)
                .subscribe(() => {
                 alert('Movie uploaded successfully')
                }, error => {
                  console.log(error);
                  alert('Error uploading')
                });
      }

  }

  onCheckboxChange(event: any, type: 'actors' | 'genres') {
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

  //   uploadMovie(): {
  //   // return this.http.post<any>(`${env.apiGatewayHost}upload`, movie).pipe(
  //   //   switchMap(response => {
  //   //     const presignedUrl = response.presignedUrl;
  //   //     const movieId = response.id;
  //   //     if (presignedUrl) {
  //   //       const byteArray = this.base64ToArrayBuffer(fileContent);
  //   //       const blob = new Blob([byteArray], { type: 'video/mp4' });
  //   //
  //   //       // Upload the file to S3 using the presigned URL
  //   //       return this.http.put(presignedUrl, blob, {
  //   //         headers: {
  //   //           'Content-Type': 'application/octet-stream'
  //   //         }
  //   //       }).pipe(
  //   //         switchMap(() => {
  //   //           return of({ message: 'File uploaded successfully', movieId: movieId });
  //   //         })
  //   //       );
  //   //     } else {
  //   //       return of({ message: 'Presigned URL not found' });
  //   //     }
  //   //   })
  //   // );
  //
  // }


  //   private base64ToArrayBuffer(base64: string): Uint8Array {
  //   const byteCharacters = atob(base64.split(',')[1]);
  //   const byteNumbers = new Array(byteCharacters.length);
  //   for (let i = 0; i < byteCharacters.length; i++) {
  //     byteNumbers[i] = byteCharacters.charCodeAt(i);
  //   }
  //   return new Uint8Array(byteNumbers);
  // }

  uploadMovieService(movie: Movie){
    return this.http.post<any>(`${env.apiGatewayHost}upload`, movie)
  }
}
