// #docplaster
// #docregion
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { forbiddenNameValidator } from '../shared/forbidden-name.directive';
import { UniqueAlterEgoValidator } from '../shared/alter-ego.directive';

@Component({
  selector: 'app-hero-form-reactive',
  templateUrl: './hero-form-reactive.component.html',
  styleUrls: ['./hero-form-reactive.component.css'],
})
export class HeroFormReactiveComponent implements OnInit {

  powers = ['Really Smart', 'Super Flexible', 'Weather Changer'];

  hero = { name: 'Dr.', alterEgo: 'Dr. What', power: this.powers[0] };

  heroForm: FormGroup;

  ngOnInit(): void {
    // #docregion async-validator-usage
    const alterEgoControl = new FormControl('', {
      asyncValidators: [this.alterEgoValidator.validate.bind(this.alterEgoValidator)],
      updateOn: 'blur'
    });
    alterEgoControl.setValue(this.hero.alterEgo);
    // #enddocregion async-validator-usage

    this.heroForm = new FormGroup({
      name: new FormControl(this.hero.name, [
        Validators.required,
        Validators.minLength(4),
        forbiddenNameValidator(/bob/i)
      ]),
      alterEgo: alterEgoControl,
      power: new FormControl(this.hero.power, Validators.required)
    });
  }

  get name() { return this.heroForm.get('name'); }

  get power() { return this.heroForm.get('power'); }

  get alterEgo() { return this.heroForm.get('alterEgo'); }

  // #docregion async-validator-inject
  constructor(private alterEgoValidator: UniqueAlterEgoValidator) {}
  // #enddocregion async-validator-inject
}
