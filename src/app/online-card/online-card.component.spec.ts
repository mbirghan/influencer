import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineCardComponent } from './online-card.component';

describe('OnlineCardComponent', () => {
  let component: OnlineCardComponent;
  let fixture: ComponentFixture<OnlineCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlineCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
