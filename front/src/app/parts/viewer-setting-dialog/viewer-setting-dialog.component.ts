import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Setting, ViewerOrder } from '@m-types/setting';
import { getVoices, initVoices, speechWord } from '@utils/speech';
import { SettingService } from './../../services/setting.service';

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
    @Optional() @Inject(DIALOG_DATA) public data: Setting,
    private settingService: SettingService
  ) {
    this.voiceOptions = getVoices();
    initVoices();
    this.form = new FormGroup({
      order: new FormControl(data?.order),
      voice: new FormControl(data?.voice || this.voiceOptions[0]?.voiceURI),
      useSpeechSynthesis: new FormControl(data?.useSpeechSynthesis),
      secondLangIsHide: new FormControl(data?.secondLangIsHide),
      speechRate: new FormControl(data?.speechRate),
      isAutoPlay: new FormControl(data?.isAutoPlay),
    });
  }

  ngOnInit(): void {
    this.form.valueChanges.subscribe((setting) => {
      this.settingService.setSetting(setting).subscribe();
    });
    if (this.voiceOptions.length === 0) {
      this.voiceOptions = getVoices();
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onAudition() {
    speechWord(
      'Hello world',
      this.form.value['speechRate'],
      this.form.value['voice']
    );
  }
}
