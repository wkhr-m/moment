import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

export type EditorDialogData = {
  en: string;
  ja: string;
  pronunciation?: string;
  note: string;
};
@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
  form: FormGroup;

  constructor(
    public dialogRef: DialogRef<string>,
    @Inject(DIALOG_DATA) public data: EditorDialogData
  ) {
    this.form = new FormGroup({
      en: new FormControl(data?.en),
      ja: new FormControl(data?.ja),
      pronunciation: new FormControl(data?.pronunciation),
      note: new FormControl(data?.note),
    });
  }

  onClose() {
    this.dialogRef.close();
  }
}
