import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { speechWord } from 'src/app/utils/speech';
import { MeanWordComponent } from '../../parts/mean-word/mean-word.component';
import { BookService } from '../../services/book.service';
import type { DetailBook, Sentense } from '../../types/books';
import { HeaderService } from './../../services/header.service';

@Component({
  selector: 'app-sentense-viewer',
  templateUrl: './sentense-viewer.component.html',
  styleUrls: ['./sentense-viewer.component.scss'],
})
export class SentenseViewerComponent implements OnInit {
  book?: DetailBook;
  sentenses: Sentense[] = [];
  activeSentenseNumber: number = 0;
  isSecondHide: boolean = true;

  constructor(
    private bookService: BookService,
    private headerService: HeaderService,
    private route: ActivatedRoute,
    public dialog: Dialog
  ) {}

  ngOnInit(): void {
    const bookId = this.route.snapshot.paramMap.get('bookId') || '';
    const section = this.route.snapshot.queryParams['section'];

    this.bookService.getBookAndChapters(bookId).subscribe((book) => {
      this.book = book;
      this.setHeader(book);
    });

    this.bookService.getBookSentences(bookId).subscribe((sentenses) => {
      if (section) {
        this.sentenses = sentenses.filter(
          (sentense) => sentense.section === section
        );
      } else {
        this.sentenses = sentenses;
      }
      this.setSentenseNumberAtHeader(this.activeSentenseNumber);
    });
  }

  onClickHide(): void {
    this.isSecondHide = false;
  }

  onChangePage(page: number) {
    const newActiveNumber = this.activeSentenseNumber + page;
    this.activeSentenseNumber = newActiveNumber;
    this.isSecondHide = true;
    this.setSentenseNumberAtHeader(newActiveNumber);
  }

  onPlay(rate: number) {
    speechWord(this.sentenses[this.activeSentenseNumber].en, rate);
  }

  onClickWord(word: string) {
    this.dialog.open(MeanWordComponent, {
      data: {
        word,
      },
      backdropClass: ['dialog-backdrop', 'cdk-overlay-dark-backdrop'],
    });
  }

  private setSentenseNumberAtHeader(activeSentenseNumber: number) {
    this.headerService.setTitle(
      `${activeSentenseNumber + 1} / ${this.sentenses.length}`
    );
  }
  // headerにタイトルや色を設定する
  private setHeader(book: DetailBook): void {
    this.headerService.setBackURL(`book/${book.id}`);
    this.headerService.setBgColor(book.bgColor);
    this.headerService.setColor(book.color);
  }
}
