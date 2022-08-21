import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-en-sentense',
  templateUrl: './en-sentense.component.html',
  styleUrls: ['./en-sentense.component.scss'],
})
export class EnSentenseComponent implements OnChanges {
  @Input() sentense?: string = '';
  @Input() pronunciation?: string = '';
  @Output() wordClick = new EventEmitter<string>();
  splitedSentense: string[] = [];
  splitedPronunciation: string[] = [];

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.splitedPronunciation =
      changes['pronunciation']?.currentValue?.split(' ') || [];
    this.splitedSentense = changes['sentense']?.currentValue.split(' ') || [];
  }

  onClickWord(word: string) {
    this.wordClick.emit(word.replace('.', ''));
  }
}
