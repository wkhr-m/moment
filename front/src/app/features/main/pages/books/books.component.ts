import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { DownloadBookComponent } from '../../parts/download-book/download-book.component';
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
    private headerService: HeaderService,
    public dialog: Dialog
  ) {}

  ngOnInit(): void {
    this.headerService.init();
    this.loadBooks();
  }

  private loadBooks(): void {
    this.bookService.getAllBooks().subscribe((res) => {
      this.books = res;
      this.isReady = true;
    });
  }

  onOpenDialog(): void {
    const dialogRef = this.dialog.open(DownloadBookComponent, {
      backdropClass: ['dialog-backdrop', 'cdk-overlay-dark-backdrop'],
      data: {},
    });
    dialogRef.closed.subscribe((result: any) => {
      this.loadBooks();
    });
  }
}
