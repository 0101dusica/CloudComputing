import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Person {
  firstName: string,
  lastName: string,
  yearOfBirth: number,
  type: string,
  photo: string
};

@Component({
  selector: 'app-all-subscriptions',
  templateUrl: './all-subscriptions.component.html',
  styleUrls: ['./all-subscriptions.component.css']
})
export class AllSubscriptionsComponent {
  users: Person[] = [];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.users = [
      { firstName: 'John', lastName: 'Doe', yearOfBirth: 1990, type: 'Director', photo: '../../../../assets/director-one.jpg' },
      { firstName: 'Jane', lastName: 'Doe', yearOfBirth: 1985, type: 'Actor', photo: '../../../../assets/actor-one.jpg' },
      { firstName: 'Jim', lastName: 'Beam', yearOfBirth: 1975, type: 'Actor', photo: '../../../../assets/actor-teo.jpg' },
      { firstName: 'Jack', lastName: 'Daniels', yearOfBirth: 1980, type: 'Director', photo: '../../../../assets/director-two.jpg' }
    ];
  }

  unsubscribe(user: Person): void {
    this.users = this.users.filter(u => u !== user);
  }
}
