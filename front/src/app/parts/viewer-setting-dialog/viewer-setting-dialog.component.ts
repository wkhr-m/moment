import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

type ViewerSettingInput = {
  order: 'JaEn' | 'EnJa';
};

@Component({
  selector: 'app-viewer-setting-dialog',
  templateUrl: './viewer-setting-dialog.component.html',
  styleUrls: ['./viewer-setting-dialog.component.scss'],
})
export class ViewerSettingDialogComponent implements OnInit {
  constructor(
    public dialogRef: DialogRef,
    @Inject(DIALOG_DATA) public data: ViewerSettingInput,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  onClose(): void {
    this.dialogRef.close();
  }
}
