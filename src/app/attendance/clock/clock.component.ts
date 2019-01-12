import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss']
})
export class ClockComponent implements OnInit {
  timeNow;

  constructor() {}

  ngOnInit() {
    setInterval(() => {
      this.timeNow = new Date();
    }, 1000);
  }
}
