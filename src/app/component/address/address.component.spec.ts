import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirestoreuserComponent } from './firestoreuser.component';

describe('FirestoreuserComponent', () => {
  let component: FirestoreuserComponent;
  let fixture: ComponentFixture<FirestoreuserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirestoreuserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirestoreuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
