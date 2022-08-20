import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeanWordComponent } from './mean-word.component';

describe('MeanWordComponent', () => {
  let component: MeanWordComponent;
  let fixture: ComponentFixture<MeanWordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeanWordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeanWordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
