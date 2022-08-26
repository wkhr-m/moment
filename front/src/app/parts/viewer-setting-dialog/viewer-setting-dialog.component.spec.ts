import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerSettingDialogComponent } from './viewer-setting-dialog.component';

describe('ViewerSettingDialogComponent', () => {
  let component: ViewerSettingDialogComponent;
  let fixture: ComponentFixture<ViewerSettingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewerSettingDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewerSettingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
