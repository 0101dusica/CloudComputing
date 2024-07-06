import {Component, OnInit} from '@angular/core';
import {Episode} from "../movie";
import {ActivatedRoute} from "@angular/router";
import {MovieService} from "../movie.service";
import Decimal from "decimal.js";

@Component({
  selector: 'app-add-new-episode',
  templateUrl: './add-new-episode.component.html',
  styleUrls: ['./add-new-episode.component.css']
})
export class AddNewEpisodeComponent implements OnInit{
  episode: Episode = {
    episodeId: "",
    title: '',
    seasonNumber: "",
    episodeNumber: "",
    description: '',
    type: "episode",
    createdAt: "",
    updatedAt: "",
    contentType: "video",
    fileSize: "",
    duration: "",
    fileName: "",
    seriesId: ""
  };

  selectedFile: File | null = null; // Variable to store the selected file
  constructor(private route: ActivatedRoute,
              private movieService: MovieService) {
  }
  ngOnInit() {
    // Subscribe to both route params and query params
    this.route.params.subscribe(params => {
       // Get movieId from route params
      this.episode.seriesId = params['seriesId']
    });
  }

  onFileSelected(event: any, type: string) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files && fileInput.files[0];
    this.selectedFile = file;
    // Implement your file handling logic here
    this.episode.fileSize = new Decimal(parseFloat((file!.size / (1024 * 1024)).toFixed(1))).toString(); // Convert size to MB
    this.getEpisodeDuration(file!).then(duration => {
      this.episode.duration = new Decimal(duration).toString()
    });
    this.episode.fileName = file!.name;
  }

  onSubmit() {
    console.log('Episode data:', this.episode);
    this.episode.episodeNumber = new Decimal(this.episode.episodeNumber).toString();
    this.episode.seasonNumber = new Decimal(this.episode.seasonNumber).toString();
    const movieReader = new FileReader();
      movieReader.readAsDataURL(this.selectedFile!);
      movieReader.onload = () => {
        const movieContent = movieReader.result as string;
        //Because movieContent starts with data:video/mp4;base64,{base64string}


        this.movieService.uploadMovie(this.episode,movieContent)
                .subscribe(() => {
                 alert('Movie uploaded successfully')
                }, error => {
                  console.log(error);
                  alert('Error uploading')
                });
      }
  }

  getEpisodeDuration(file: File): Promise<number> {
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
