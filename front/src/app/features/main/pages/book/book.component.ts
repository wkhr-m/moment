import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import type { DetailBook } from '../../types/books';
import { BookService } from './../../services/book.service';
import { HeaderService } from './../../services/header.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
})
export class BookComponent implements OnInit {
  book?: DetailBook;

  constructor(
    private headerService: HeaderService,
    private bookService: BookService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const bookId = this.route.snapshot.paramMap.get('bookId') || '';
    this.bookService
      .getBookAndChapters(bookId)
      .subscribe((book: DetailBook) => {
        this.book = book;
        this.setHeader(book);
      });
  }

  // headerにタイトルや色を設定する
  private setHeader(book: DetailBook): void {
    this.headerService.setBackURL('books');
    this.headerService.setTitle(book.title);
  }
}
