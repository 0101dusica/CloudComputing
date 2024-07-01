import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent  {
  
  constructor(private router: Router) {
  }

  changePage(path: string) : void {
    console.log("this is path", path)
    this.router.navigate(['/' + path]);
  }
  

}