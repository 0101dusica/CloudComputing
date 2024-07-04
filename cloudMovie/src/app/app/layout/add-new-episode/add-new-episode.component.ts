import { Component } from '@angular/core';

@Component({
  selector: 'app-add-new-episode',
  templateUrl: './add-new-episode.component.html',
  styleUrls: ['./add-new-episode.component.css']
})
export class AddNewEpisodeComponent {
  episode = {
    title: '',
    season: 0, 
    number: 0,
    description: ''
  };

  onFileSelected(event: any, type: string) {
    const file = event.target.files[0];
    // Implement your file handling logic here
  }

  onSubmit() {
    console.log('Episode data:', this.episode);
    // Implement your submit logic here
  }
}
