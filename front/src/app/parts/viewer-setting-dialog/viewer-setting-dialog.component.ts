import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Setting, ViewerOrder } from '@m-types/setting';
import { LANG_EN } from './../../../utils/speech';

@Component({
  selector: 'app-viewer-setting-dialog',
  templateUrl: './viewer-setting-dialog.component.html',
  styleUrls: ['./viewer-setting-dialog.component.scss'],
})
export class ViewerSettingDialogComponent implements OnInit {
  viewerOrder = ViewerOrder;
  voiceOptions: SpeechSynthesisVoice[] = [];
  form: FormGroup;

  constructor(
    public dialogRef: DialogRef,
    @Inject(DIALOG_DATA) public data: Setting,
    private _snackBar: MatSnackBar
  ) {
    this.voiceOptions = window.speechSynthesis
      .getVoices()
      .filter((item) => item.lang === LANG_EN);
    this.form = new FormGroup({
      order: new FormControl(data.order || ViewerOrder.ENJA),
      voice: new FormControl(data.voice || this.voiceOptions[0].voiceURI),
    });
  }

  ngOnInit(): void {}

  onClose(): void {
    this.dialogRef.close();
  }
}
