import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewTvShowComponent } from './add-new-tv-show.component';

describe('AddNewTvShowComponent', () => {
  let component: AddNewTvShowComponent;
  let fixture: ComponentFixture<AddNewTvShowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewTvShowComponent]
    });
    fixture = TestBed.createComponent(AddNewTvShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
