import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteBookDialogComponent } from './delete-book-dialog.component';

describe('DeleteBookDialogComponent', () => {
  let component: DeleteBookDialogComponent;
  let fixture: ComponentFixture<DeleteBookDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteBookDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteBookDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
