import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import type { Book, Sentense } from '@m-types/books';
import { speechWord } from '@utils/speech';
import { MeanWordComponent } from '../../parts/mean-word/mean-word.component';
import { BookService } from '../../services/book.service';
import { HeaderService } from './../../services/header.service';

@Component({
  selector: 'app-sentense-viewer',
  templateUrl: './sentense-viewer.component.html',
  styleUrls: ['./sentense-viewer.component.scss'],
})
export class SentenseViewerComponent implements OnInit {
  book?: Book;
  sentenses: Sentense[] = [];
  activeSentenseNumber: number = 0;
  isSecondHide: boolean = true;
  isLoaded = false;
  isExist: boolean = true;

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
      this.isExist = !!book;
      this.book = book;
      this.setHeader(book);
    });

    this.bookService.getBookSentences(bookId).subscribe((book) => {
      if (section) {
        this.sentenses = book.sentenses.filter(
          (sentense) => sentense.section === section
        );
      } else {
        this.sentenses = book.sentenses;
      }
      // 文章がない場合
      if (this.sentenses.length === 0) {
        this.isExist = false;
        this.headerService.setBackURL('books');
        this.isLoaded = true;
        return;
      }
      this.setSentenseNumberAtHeader(this.activeSentenseNumber);
      this.isLoaded = true;
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
    if (!!this.sentenses[this.activeSentenseNumber].audioUrl) {
      const music = new Audio(
        this.sentenses[this.activeSentenseNumber].audioUrl
      );
      music.playbackRate = rate;
      music.play();
    } else {
      speechWord(this.sentenses[this.activeSentenseNumber].en, rate);
    }
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
  private setHeader(book: Book): void {
    this.headerService.setBackURL(book ? `book/${book.id}` : 'books');
  }
}
