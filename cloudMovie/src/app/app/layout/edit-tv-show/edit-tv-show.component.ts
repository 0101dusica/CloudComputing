import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-tv-show',
  templateUrl: './edit-tv-show.component.html',
  styleUrls: ['./edit-tv-show.component.css']
})
export class EditTvShowComponent implements OnInit {
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

  loadedFiles: { [key: string]: File | null } = {
    thumbnail: null,
    trailer: null,
    video: null
  };

  loadedEpisodeFiles: { [key: number]: { [key: number]: { [key: string]: File | null } } } = {};

  episodes: { [key: number]: { title: string, season: number, number: number, description: string }[] } = {};

  seasonsArray: number[] = [];

  ngOnInit(): void {
    this.loadShowData();
  }

  loadShowData() {
    // Fetch the TV show data from the server or any other source
    // This is a placeholder example
    this.show = {
      title: 'Sample TV Show',
      description: 'This is a sample show description.',
      seasons: 3,
      actors: ['Actor 1', 'Actor 3'],
      directors: ['Director 1'],
      genres: ['Action', 'Comedy']
    };

    this.updateSeasonsArray();

    // Simulate episodes
    for (let i = 1; i <= this.show.seasons; i++) {
      this.episodes[i] = [
        { title: `Episode 1`, season: i, number: 1, description: `Description of Episode 1 of Season ${i}` },
        { title: `Episode 2`, season: i, number: 2, description: `Description of Episode 2 of Season ${i}` }
      ];

      this.loadedEpisodeFiles[i] = {
        1: {video: { name: 'episode1-video.mp4' } as File },
        2: {video: { name: 'episode2-video.mp4' } as File }
      };
    }
  }

  updateSeasonsArray() {
    this.seasonsArray = Array.from({ length: this.show.seasons }, (_, i) => i + 1);
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
    console.log('Updated show data:', this.show);
    console.log('Updated episode data:', this.episodes);
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
