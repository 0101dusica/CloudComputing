import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MovieService} from "../movie.service";
import {AuthService} from "../../auth/auth.service";

interface Subscription {
  name: string,
  type: string
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
  username: string | undefined;
  constructor(private route: ActivatedRoute, private movieService: MovieService, private authService: AuthService) { }

  ngOnInit(): void {
    this.username = this.authService.email;
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      this.id = idParam !== null ? +idParam : null;
    });

    this.getSubscriptions();

  }

  getSubscriptions() {
    this.movieService.getSubscriptions(this.username!).subscribe(
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
          type: 'Actor'
        });
      });

      directors.forEach((director: string) => {
        this.results.push({
          name: director,
          type: 'Director'
        });
      });

      genres.forEach((genre: string) => {
        this.results.push({
          name: genre,
          type: 'Genre'
        });
      });


    });
  }

  unsubscribe(subscribe: Subscription): void {
    this.movieService.unsubscribe(this.username!, subscribe.name).subscribe(
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
