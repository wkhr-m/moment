import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnSentenseComponent } from './en-sentense.component';

describe('EnSentenseComponent', () => {
  let component: EnSentenseComponent;
  let fixture: ComponentFixture<EnSentenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnSentenseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnSentenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
