import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../movie.service';
import {Movie} from "../movie"; // Adjust the path as per your project structure

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  movies: Movie[] = []; // Define the movies array to hold movie data

  constructor(private route: ActivatedRoute, private movieService: MovieService) { }

  id: number | null = null;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      this.id = idParam !== null ? +idParam : null;
    });

    // Call the getMovies function when component initializes
    this.getMovies();
  }

  getMovies() {
    this.movieService.getMovies().subscribe(
      (data: any) => {
        console.log(data)
        this.movies = data; // Assign the retrieved movies data to the movies array
      },
      (error) => {
        console.error('Error fetching movies:', error);
      }
    );
  }

}
