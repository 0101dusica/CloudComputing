import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribeDialogComponent } from './subscribe-dialog.component';

describe('SubscribeDialogComponent', () => {
  let component: SubscribeDialogComponent;
  let fixture: ComponentFixture<SubscribeDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubscribeDialogComponent]
    });
    fixture = TestBed.createComponent(SubscribeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
