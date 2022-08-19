import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, Optional } from '@angular/core';

@Component({
  selector: 'app-delete-book-dialog',
  templateUrl: './delete-book-dialog.component.html',
  styleUrls: ['./delete-book-dialog.component.scss'],
})
export class DeleteBookDialogComponent {
  constructor(
    public dialogRef: DialogRef,
    @Optional()
    @Inject(DIALOG_DATA)
    public data: { title: string; deleteBook: () => void }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onDelete(): void {
    // this.data.deleteBook();
    console.log('delete');
    this.dialogRef.close();
  }
}
