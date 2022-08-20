import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { speechWord } from '@utils/speech';
import { Word, WordService } from './../../services/word.service';

export type DialogData = {
  word: string;
};
@Component({
  selector: 'app-mean-word',
  templateUrl: './mean-word.component.html',
  styleUrls: ['./mean-word.component.scss'],
})
export class MeanWordComponent implements OnInit {
  isLoaded: boolean = false;
  isError: boolean = false;
  information?: Word;

  constructor(
    public dialogRef: DialogRef<string>,
    @Inject(DIALOG_DATA) public data: DialogData,
    private wordService: WordService
  ) {}

  ngOnInit(): void {
    this.wordService.getWordInformation(this.data.word).subscribe({
      next: (res) => {
        this.information = res;
        this.isLoaded = true;
      },
      error: (error) => {
        this.isError = true;
        this.isLoaded = true;
      },
    });
  }

  onPlayWord(): void {
    speechWord(this.data.word);
  }

  onClose() {
    this.dialogRef.close();
  }
}
