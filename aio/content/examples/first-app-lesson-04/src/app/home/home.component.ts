import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HousingLocationComponent } from '../housing-location/housing-location.component';
// #docregion housing-location-import
import { HousingLocation } from '../housinglocation';
// #enddocregion

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HousingLocationComponent
  ],
  template: `
    <section>
      <form>
        <input type="text" placeholder="Filter by city">
        <button class="primary" type="button">Search</button>
      </form>
    </section>
    <section class="results">
      <app-housing-location></app-housing-location>
    </section>
  `,
  styleUrls: ['./home.component.css'],
})
// #docregion only-house
export class HomeComponent {
  housingLocation: HousingLocation = {
    id: 9999,
    name: 'Test Home',
    city: 'Test city',
    state: 'ST',
    photo: 'assets/example-house.jpg',
    availableUnits: 99,
    wifi: true,
    laundry: false,
  };
}
// #enddocregion
