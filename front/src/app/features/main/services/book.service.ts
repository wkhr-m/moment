import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { map, merge, Observable } from 'rxjs';
import type { Book, DetailBook, Sentense } from '../types/books';
import { STORE_BOOK, STORE_SENTENSES } from './../../../utils/db-config';

const FUNCTION_URL = 'https://asia-northeast1-wk-moment.cloudfunctions.net/';
const LOCAL_URL = 'http://localhost:8080/api/';
const PROD_URL = '/api/';

const LOCAL_HEADER = {
  'Access-Control-Allow-Origin': FUNCTION_URL,
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

  downloadBook(id: string): Observable<Sentense[]> {
    return this.http
      .get<Response>(
        `${
          isDevMode() ? LOCAL_URL : PROD_URL
        }read-sheet?sheetId=${id}&sheetName=シート1`,
        {
          headers: isDevMode() ? LOCAL_HEADER : {},
        }
      )
      .pipe(
        map((book) => {
          merge(
            this.dbService.update(STORE_SENTENSES, {
              id: id,
              sentenses: book.sentenses,
            }),
            this.dbService.update(STORE_BOOK, {
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
    return this.dbService.getAll<Book>(STORE_BOOK);
  }

  getBookAndChapters(id: string): Observable<DetailBook> {
    return this.dbService.getByKey<DetailBook>(STORE_BOOK, id);
  }

  getBookSentences(
    id: string
  ): Observable<{ id: string; sentenses: Sentense[] }> {
    return this.dbService.getByKey<{ id: string; sentenses: Sentense[] }>(
      STORE_SENTENSES,
      id
    );
  }
}
