import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTvShowComponent } from './edit-tv-show.component';

describe('EditTvShowComponent', () => {
  let component: EditTvShowComponent;
  let fixture: ComponentFixture<EditTvShowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditTvShowComponent]
    });
    fixture = TestBed.createComponent(EditTvShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
