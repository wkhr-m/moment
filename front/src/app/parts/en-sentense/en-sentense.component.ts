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
  @Input() pronanciation?: string = '';
  @Output() wordClick = new EventEmitter<string>();
  splitedSentense: string[] = [];
  splitedPronanciation: string[] = [];

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.splitedPronanciation =
      changes['pronanciation']?.currentValue?.split(' ') || [];
    this.splitedSentense = changes['sentense']?.currentValue.split(' ') || [];
  }

  onClickWord(word: string) {
    this.wordClick.emit(word.replace('.', ''));
  }
}
