import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import type { Book, DetailBook, Sentense } from '@m-types/books';
import { STORE_TYPE } from '@utils/db-config';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { map, merge, Observable } from 'rxjs';

const LOCAL_URL = 'http://localhost:8080/api/';
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

  getAudioUrl(driveUrl: string, fileName: string): Observable<{ url: string }> {
    const driveId = driveUrl
      .match(/^https?:\/{2,}drive.google.com\/drive\/folders\/(.*).*?/)?.[1]
      .split('?')[0];
    return this.http.get<{ url: string }>(
      `${
        isDevMode() ? LOCAL_URL : PROD_URL
      }get-audio-url?folderId=${driveId}&fileName=${fileName}`,
      {
        headers: isDevMode() ? LOCAL_HEADER : {},
      }
    );
  }

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

  deleteBook(id: string) {
    return merge(
      this.dbService.deleteByKey(STORE_TYPE.STORE_SENTENSES, id),
      this.dbService.deleteByKey(STORE_TYPE.STORE_BOOK, id),
      this.dbService.deleteByKey(STORE_TYPE.STORE_DRIVE_URL, id)
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

  setDriveUrl(id: string, driveUrl?: string): Observable<any> {
    return this.dbService.update(STORE_TYPE.STORE_DRIVE_URL, {
      id,
      driveUrl,
    });
  }

  getDriveUrl(id: string): Observable<string> {
    return this.dbService
      .getByKey<{ id: string; driveUrl: string }>(
        STORE_TYPE.STORE_DRIVE_URL,
        id
      )
      .pipe(map((item) => item?.driveUrl));
  }

  getAllBooks(): Observable<Book[]> {
    return this.dbService.getAll<Book>(STORE_TYPE.STORE_BOOK);
  }

  getBookAndChapters(id: string): Observable<DetailBook> {
    return this.dbService.getByKey<DetailBook>(STORE_TYPE.STORE_BOOK, id);
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
