import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-subscribe-dialog',
  templateUrl: './subscribe-dialog.component.html',
  styleUrls: ['./subscribe-dialog.component.css']
})
export class SubscribeDialogComponent {

  actors: string[] = ["actor 1", "actor 2", "actor 3"];
  directors: string[] = ["director 1", "director 2"];
  genres: string[] = ["drama", "crime", "history"];

  selectedActor: number | null = null;
  selectedDirector: number | null = null;
  selectedGenre: number | null = null;

  constructor(public dialogRef: MatDialogRef<SubscribeDialogComponent>) {}

  submitRating(): void {
    if(this.selectedActor !== null || this.selectedDirector !== null || this.selectedGenre !== null){
      this.dialogRef.close({"actor": this.selectedActor, "director": this.selectedDirector, "genre": this.selectedGenre });
    }
  }
}
