import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-subscribe-dialog',
  templateUrl: './subscribe-dialog.component.html',
  styleUrls: ['./subscribe-dialog.component.css']
})
export class SubscribeDialogComponent {

  actors: string[] = [];
  director: string = '' ;
  genres: string[] = [];

  selectedActors: { [key: string]: boolean } = {};
  selectedDirector: boolean = false;
  selectedGenres: { [key: string]: boolean } = {};

  constructor(
    public dialogRef: MatDialogRef<SubscribeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.movie) {
      console.log('Data received:', data.movie);
      this.actors = data.movie.actors || [];
      this.director = data.movie.director || [];
      this.genres = data.movie.genres || [];
    }
  }


  submitRating(): void {
    const selectedActorsArray = Object.keys(this.selectedActors).filter(key => this.selectedActors[key]);
    const selectedGenresArray = Object.keys(this.selectedGenres).filter(key => this.selectedGenres[key]);

    if (selectedActorsArray.length > 0 || this.selectedDirector || selectedGenresArray.length > 0) {
      this.dialogRef.close({
        actors: selectedActorsArray,
        director: this.selectedDirector ? this.director : null,
        genres: selectedGenresArray
      });
    }
  }
}
