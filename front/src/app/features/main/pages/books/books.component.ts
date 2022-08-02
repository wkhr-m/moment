import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import type { Book } from '../../types/books';
import { HeaderService } from './../../services/header.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss'],
})
export class BooksComponent implements OnInit {
  books: Book[] = [];
  isReady: boolean = false;

  constructor(
    private bookService: BookService,
    private headerService: HeaderService
  ) {}

  ngOnInit(): void {
    this.headerService.init();
    this.bookService.getAllBooks().subscribe((res) => {
      this.books = res;
      this.isReady = true;
    });
  }
}
