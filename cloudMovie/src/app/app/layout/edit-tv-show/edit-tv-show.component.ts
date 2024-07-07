import { Component, OnInit } from '@angular/core';
import { Movie } from "../movie";
import { ActivatedRoute, Router } from "@angular/router";
import { MovieService } from "../movie.service";
import { Location } from "@angular/common";
import { MatDialog } from "@angular/material/dialog";
import { Director } from "../director.enum";

@Component({
  selector: 'app-edit-tv-show',
  templateUrl: './edit-tv-show.component.html',
  styleUrls: ['./edit-tv-show.component.css']
})
export class EditTvShowComponent implements OnInit {
  series: Movie | undefined;
  selectedFile: File | null = null;
  generatePresignedUrl: boolean = false;
  genres = [
    { name: 'Action', isChecked: false },
    { name: 'Comedy', isChecked: false },
    { name: 'Drama', isChecked: false },
    { name: 'Fantasy', isChecked: false },
    { name: 'Horror', isChecked: false },
    { name: 'Romance', isChecked: false },
    { name: 'Sci-Fi', isChecked: false },
    { name: 'Thriller', isChecked: false }
  ];
  actors = ['Actor 1', 'Actor 2', 'Actor 3', 'Actor 4'];
  directors: string[] = Object.values(Director).map(director => this.capitalizeFirstLetters(director));
  loadedFiles: { [key: string]: File | null } = {
    thumbnail: null,
    trailer: null,
    video: null
  };
  actorsString: string = ''; // String for comma-separated actors
  selectedDirector: string | undefined;
  movieContent: string = ''; // String for comma-separated actors
  loadedEpisodeFiles: { [key: number]: { [key: number]: { [key: string]: File | null } } } = {};
  episodes: { [key: number]: { title: string, season: number, number: number, description: string }[] } = {};
  seasonsArray: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private router: Router,
    private location: Location,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadShowData();

    this.route.params.subscribe(params => {
      const movieId = params['movieId']; // Get movieId from route params
      this.route.queryParams.subscribe(queryParams => {
        const createdAt = queryParams['createdAt']; // Get createdAt from query params

        // Call service method to get movie details
        this.movieService.getMovieById(movieId, createdAt).subscribe(data => {
          this.series = data;
          console.log(this.series);
          this.actorsString = this.series!.actors.join(', '); // Convert actors array to string

          this.selectedDirector = this.capitalizeFirstLetters(this.series!.director); // Set initial selected director
          this.generateSeasonsArray();
          this.genres.forEach(genre => {
            genre.isChecked = this.series!.genres.includes(genre.name.toLowerCase());
          });

          // Load episodes by series ID
          this.loadEpisodesBySeriesId(movieId);
        });
      });
    });
  }

  loadShowData() {
    this.loadedFiles['video'] = { name: this.series?.fileName } as File;
  }

  onFileSelected(event: any, type: string) {
    const file = event.target.files[0];
    this.loadedFiles[type] = file;
  }

  deleteFile(type: string) {
    this.loadedFiles[type] = null;
  }

  onEpisodeFileSelected(event: any, season: number, episodeNumber: number, type: string) {
    const file = event.target.files[0];
    if (!this.loadedEpisodeFiles[season]) {
      this.loadedEpisodeFiles[season] = {};
    }
    if (!this.loadedEpisodeFiles[season][episodeNumber]) {
      this.loadedEpisodeFiles[season][episodeNumber] = {};
    }
    this.loadedEpisodeFiles[season][episodeNumber][type] = file;
  }

  deleteEpisodeFile(season: number, episodeNumber: number, type: string) {
    if (this.loadedEpisodeFiles[season] && this.loadedEpisodeFiles[season][episodeNumber]) {
      this.loadedEpisodeFiles[season][episodeNumber][type] = null;
    }
  }

  onSubmit() {
    console.log('Updated show data:', this.series);
    console.log('Updated episode data:', this.episodes);
    // Implement your submit logic here
  }

  onCheckboxChange(event: any, genre: string) {
    const isChecked = event.target.checked;
    if (isChecked) {
      if (!this.series!.genres.includes(genre.toLowerCase())) {
        this.series!.genres.push(genre.toLowerCase());
      }
    } else {
      const index = this.series!.genres.indexOf(genre.toLowerCase());
      if (index !== -1) {
        this.series!.genres.splice(index, 1);
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

  private generateSeasonsArray() {
    if (this.series?.numberOfSeasons) {
      const numberOfSeasons = Number(this.series.numberOfSeasons);
      if (!isNaN(numberOfSeasons) && numberOfSeasons > 0) {
        this.seasonsArray = Array.from({ length: numberOfSeasons }, (_, i) => i + 1);
      }
    }
  }

  private loadEpisodesBySeriesId(seriesId: string) {
    this.movieService.getEpisodesBySeriesId(seriesId).subscribe(episodes => {
      this.episodes = this.groupEpisodesBySeason(episodes);
      this.initializeLoadedEpisodeFiles();
    });
  }

  private groupEpisodesBySeason(episodes: any[]): { [key: number]: any[] } {
    const groupedEpisodes: { [key: number]: any[] } = {};
    episodes.forEach(episode => {
      const seasonNumber = Number(episode.seasonNumber);
      if (!groupedEpisodes[seasonNumber]) {
        groupedEpisodes[seasonNumber] = [];
      }
      groupedEpisodes[seasonNumber].push(episode);
    });
    return groupedEpisodes;
  }

  private initializeLoadedEpisodeFiles() {
    for (const season in this.episodes) {
      if (!this.loadedEpisodeFiles[season]) {
        this.loadedEpisodeFiles[season] = {};
      }
      this.episodes[season].forEach(episode => {
        if (!this.loadedEpisodeFiles[season][episode.number]) {
          this.loadedEpisodeFiles[season][episode.number] = {
            video: null
          };
        }
      });
    }
  }
}
