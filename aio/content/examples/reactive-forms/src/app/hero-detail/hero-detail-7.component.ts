/* tslint:disable:component-class-suffix */
// #docplaster
// #docregion imports
import { Component, Input, OnChanges }             from '@angular/core';
import { FormBuilder, FormGroup, Validators }      from '@angular/forms';

// #docregion import-address
import { Address, Hero, states } from '../data-model';
// #enddocregion import-address

// #enddocregion imports

@Component({
  selector: 'app-hero-detail-7',
  templateUrl: './hero-detail-5.component.html'
})
// #docregion v7
export class HeroDetailComponent7 implements OnChanges {
  @Input() hero: Hero;

  heroForm: FormGroup;
  states = states;

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  createForm() {
    // #docregion address-form-group
    this.heroForm = this.fb.group({
      name: ['', Validators.required ],
      address: this.fb.group(new Address()), // <-- a FormGroup with a new address
      power: '',
      sidekick: ''
    });
    // #enddocregion address-form-group
  }

  // #docregion ngOnChanges
  ngOnChanges() {
    this.rebuildForm();
  }
   // #enddocregion ngOnChanges

    // #docregion rebuildForm
  rebuildForm() {
    this.heroForm.reset({
      name: this.hero.name,
      // #docregion set-value-address
      address: this.hero.addresses[0] || new Address()
      // #enddocregion set-value-address
    });
  }
  // #enddocregion rebuildForm

  /* First version of rebuildForm */
  rebuildForm1() {
    // #docregion reset
    this.heroForm.reset();
     // #enddocregion reset
     // #docregion set-value
     this.heroForm.setValue({
      name:    this.hero.name,
      address: this.hero.addresses[0] || new Address()
   });
    // #enddocregion set-value
  }
}
