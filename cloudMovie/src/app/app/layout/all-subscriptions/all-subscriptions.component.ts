import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MovieService} from "../movie.service";

interface Subscription {
  name: string,
  type: string,
  photo: string
};

@Component({
  selector: 'app-all-subscriptions',
  templateUrl: './all-subscriptions.component.html',
  styleUrls: ['./all-subscriptions.component.css']
})
export class AllSubscriptionsComponent {
  results: Subscription[] = [];
  subscriptions : [] | undefined;
  id: number | null = null;
  constructor(private route: ActivatedRoute, private movieService: MovieService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      this.id = idParam !== null ? +idParam : null;
    });

    this.getSubscriptions();

  }

  getSubscriptions() {
    this.movieService.getSubscriptions("1").subscribe(
      (data: any) => {
        console.log(data)
        // this.subscriptions = data;
        this.processSubscriptions(data);
      },
      (error) => {
        console.error('Error fetching subscriptions:', error);
      }
    );
  }

  processSubscriptions(subscriptions: any[]): void {
    this.results = [];

    subscriptions.forEach(subscription => {
      const { genres, actors, directors } = subscription;

      actors.forEach((actor: string) => {
        this.results.push({
          name: actor,
          type: 'Actor',
          photo: '../../../../assets/bell-icon.png'
        });
      });

      directors.forEach((director: string) => {
        this.results.push({
          name: director,
          type: 'Director',
          photo: '../../../../assets/bell-icon.png'
        });
      });

      genres.forEach((genre: string) => {
        this.results.push({
          name: genre,
          type: 'Genre',
          photo: '../../../../assets/bell-icon.png'
        });
      });


    });
  }

  unsubscribe(subscribe: Subscription): void {
    this.movieService.unsubscribe("1", subscribe.name).subscribe(
      () => {
        this.results = this.results.filter(s => s !== subscribe);
        alert('Successfully unsubscribed!');
      },
      (error) => {
        console.error('Error unsubscribing:', error);
        alert('Unsuccessfully unsubscribed. Please try again later.');
      }
    );
  }
}
