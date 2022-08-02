import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentenseViewerComponent } from './sentense-viewer.component';

describe('SentenseViewerComponent', () => {
  let component: SentenseViewerComponent;
  let fixture: ComponentFixture<SentenseViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SentenseViewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SentenseViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
