import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import type { Book, Sentense } from '@m-types/books';
import { STORE_TYPE } from '@utils/db-config';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { map, merge, Observable } from 'rxjs';

const LOCAL_URL = 'http://192.168.11.17:8080/api/';
const PROD_URL = '/api/';

const LOCAL_HEADER = {
  mode: 'cors',
  credentials: 'include',
};

type Response = {
  id: string;
  title: string;
  sentenses: Sentense[];
};

@Injectable()
export class BookService {
  constructor(
    private http: HttpClient,
    private dbService: NgxIndexedDBService
  ) {}

  downloadBook(id: string, name: string): Observable<Sentense[]> {
    return this.http
      .get<Response>(
        `${
          isDevMode() ? LOCAL_URL : PROD_URL
        }read-sheet?sheetId=${id}&sheetName=${name}`,
        {
          headers: isDevMode() ? LOCAL_HEADER : {},
        }
      )
      .pipe(
        map((book) => {
          merge(
            this.dbService.update(STORE_TYPE.STORE_SENTENSES, {
              id: id,
              sentenses: book.sentenses,
            }),
            this.dbService.update(STORE_TYPE.STORE_BOOK, {
              updatedAt: this.getNow(),
              id: id,
              title: book.title,
              count: book.sentenses.length,
              section: this.setSection(book.sentenses),
            })
          ).subscribe(() => console.log('import sucess'));

          return book.sentenses;
        })
      );
  }

  // 現在の時刻を取得し、文字列で返す
  private getNow() {
    const now = new Date();
    return `${now.getFullYear()}年${
      now.getMonth() + 1
    }月${now.getDate()}日 ${now.getHours()}:${now.getMinutes()}`;
  }

  deleteBook(id: string) {
    return merge(
      this.dbService.deleteByKey(STORE_TYPE.STORE_SENTENSES, id),
      this.dbService.deleteByKey(STORE_TYPE.STORE_BOOK, id)
    );
  }

  private setSection(sentenses: Sentense[]) {
    const section: { [key: string]: number } = {};
    sentenses.forEach((row) => {
      section[row.section] = section[row.section] ? ++section[row.section] : 1;
    });
    return Object.keys(section).map((id) => ({
      id,
      count: section[id],
    }));
  }

  getAllBooks(): Observable<Book[]> {
    return this.dbService.getAll<Book>(STORE_TYPE.STORE_BOOK);
  }

  getBookAndChapters(id: string): Observable<Book> {
    return this.dbService.getByKey<Book>(STORE_TYPE.STORE_BOOK, id);
  }

  getBookSentences(
    id: string
  ): Observable<{ id: string; sentenses: Sentense[] }> {
    return this.dbService.getByKey<{ id: string; sentenses: Sentense[] }>(
      STORE_TYPE.STORE_SENTENSES,
      id
    );
  }
}
