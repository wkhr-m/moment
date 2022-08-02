import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import type { Book, DetailBook, Sentense } from '../types/books';
import { MOCK } from './mock';

const FUNCTION_URL = 'https://asia-northeast1-wk-moment.cloudfunctions.net/';
const URL = 'http://localhost:8080/';

@Injectable()
export class BookService {
  constructor(private http: HttpClient) {}

  getAllBooks(): Observable<Book[]> {
    return of([
      { id: 'target1100', title: '英単語1100', count: 1000 },
      { id: 'duo3.0', title: 'Duo3.0', count: 560 },
    ]);
  }

  getBookAndChapters(id: string): Observable<DetailBook> {
    this.http
      .get(
        `/api/read-sheet?sheetId=1eIcJQJgV1DnrLucqpuqbo3sWoYJZtJnDqerCwJdSbAg&sheetName=シート1`
        // {
        //   headers: {
        //     'Access-Control-Allow-Origin': FUNCTION_URL,
        //     mode: 'cors',
        //     credentials: 'include',
        //   },
        // }
      )
      .subscribe((res) => console.log(res));
    return of({
      id: 'target1100',
      title: '英単語1100',
      count: 1100,
      section: [
        { id: 'section1', count: 100 },
        { id: 'section2', count: 100 },
        { id: 'section3', count: 100 },
        { id: 'section4', count: 100 },
        { id: 'section5', count: 100 },
        { id: 'section6', count: 100 },
        { id: 'section7', count: 100 },
        { id: 'section8', count: 100 },
        { id: 'section9', count: 100 },
        { id: 'section10', count: 100 },
        { id: 'section11', count: 100 },
      ],
    });
  }

  getBookSentences(id: string): Observable<Sentense[]> {
    return of(MOCK);
  }
}
