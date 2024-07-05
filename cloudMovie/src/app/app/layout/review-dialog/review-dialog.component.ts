import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-review-dialog',
  templateUrl: './review-dialog.component.html',
  styleUrls: ['./review-dialog.component.css']
})
export class ReviewDialogComponent {
  ratings: number[] = [1, 2, 3, 4, 5];
  selectedRating: number | null = null;

  constructor(public dialogRef: MatDialogRef<ReviewDialogComponent>) {}

  submitRating(): void {
    if (this.selectedRating !== null) {
      console.log(`Submitted Rating: ${this.selectedRating}`);
      this.dialogRef.close(this.selectedRating);
    }
  }
  
}
