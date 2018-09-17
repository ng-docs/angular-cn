import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { FavoriteColorComponent } from './favorite-color.component';
import { createNewEvent } from '../../shared/utils';

describe('Favorite Color Component', () => {
  let component: FavoriteColorComponent;
  let fixture: ComponentFixture<FavoriteColorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ ReactiveFormsModule ],
      declarations: [ FavoriteColorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // #docregion view-to-model
  it('should update the value of the input field', () => {
    const input = fixture.nativeElement.querySelector('input');
    const event = createNewEvent('input');

    input.value = 'Red';
    input.dispatchEvent(event);

    expect(fixture.componentInstance.favoriteColor.value).toEqual('Red');
  });
  // #enddocregion view-to-model

  // #docregion model-to-view
  it('should update the value in the control', () => {
    component.favoriteColor.setValue('Blue');

    const input = fixture.nativeElement.querySelector('input');

    expect(input.value).toBe('Blue');
  });
  // #enddocregion model-to-view
});
