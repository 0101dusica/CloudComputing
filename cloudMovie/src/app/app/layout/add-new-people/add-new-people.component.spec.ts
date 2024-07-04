import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewPeopleComponent } from './add-new-people.component';

describe('AddNewPeopleComponent', () => {
  let component: AddNewPeopleComponent;
  let fixture: ComponentFixture<AddNewPeopleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewPeopleComponent]
    });
    fixture = TestBed.createComponent(AddNewPeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
