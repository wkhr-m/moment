import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentenseCardComponent } from './sentense-card.component';

describe('SentenseCardComponent', () => {
  let component: SentenseCardComponent;
  let fixture: ComponentFixture<SentenseCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SentenseCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SentenseCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
