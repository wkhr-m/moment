import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import type { Book } from '@m-types/books';
import {
  SettingsDialogComponent,
  SETTING_OUTPUT_TYPE,
} from '../../parts/settings-dialog/settings-dialog.component';
import { SettingOutput } from './../../parts/settings-dialog/settings-dialog.component';
import { BookService } from './../../services/book.service';
import { HeaderService } from './../../services/header.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
})
export class BookComponent implements OnInit {
  book?: Book;
  bookId: string;
  driveUrl: string = '';
  isLoading: boolean = false;
  isExist: boolean = true;

  constructor(
    private headerService: HeaderService,
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar,
    public dialog: Dialog
  ) {
    this.bookId = this.route.snapshot.paramMap.get('bookId') || '';
  }

  ngOnInit(): void {
    this.bookService.getBookAndChapters(this.bookId).subscribe((book: Book) => {
      this.isExist = !!book;
      this.book = book;
      this.setHeader(book);
    });
  }

  openSettings() {
    const dialogRef = this.dialog.open<SettingOutput>(SettingsDialogComponent, {
      backdropClass: ['dialog-backdrop', 'cdk-overlay-dark-backdrop'],
      data: {
        title: this.book?.title,
        driveUrl: this.driveUrl,
        bookId: this.bookId,
      },
    });
    dialogRef.closed.subscribe((result?: SettingOutput) => {
      if (result) {
        for (const setting of result) {
          switch (setting.key) {
            case SETTING_OUTPUT_TYPE.DELETE:
              this.deleteBook();
              break;
            case SETTING_OUTPUT_TYPE.RESYNC:
              this.resyncBook(setting.value);
              break;
          }
        }
      }
    });
  }

  private resyncBook(value?: string) {
    this.isLoading = true;
    this.bookService.downloadBook(this.bookId, value || '').subscribe({
      next: () => {
        this.isLoading = false;
        this._snackBar.open('再同期完了しました。', '', {
          duration: 5000,
        });
      },
      error: () => {
        this.isLoading = false;
        this._snackBar.open(
          '失敗しました。時間を置いてから再度お試しください。',
          '',
          {
            duration: 5000,
          }
        );
      },
    });
  }

  private deleteBook() {
    this.bookService.deleteBook(this.bookId).subscribe(() => {
      this.router.navigateByUrl('/books');
    });
  }

  // headerにタイトルや色を設定する
  private setHeader(book: Book): void {
    this.headerService.setBackURL('books');
    this.headerService.setTitle(book.title);
  }
}