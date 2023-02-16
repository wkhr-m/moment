import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import type { Book, Sentense } from '@m-types/books';
import { STORE_TYPE } from '@utils/db-config';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { map, merge, Observable, zip } from 'rxjs';

const LOCAL_URL = 'http://127.0.0.1:8080/api/';
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
          const key = this.createKey(id, name);
          merge(
            this.dbService.update(STORE_TYPE.STORE_SENTENSES, {
              id: key,
              sentenses: book.sentenses,
            }),
            this.dbService.update(STORE_TYPE.STORE_BOOK, {
              updatedAt: this.getNow(),
              id: key,
              sheetId: id,
              title: book.title,
              count: book.sentenses.length,
              sheetName: name,
              section: this.setSection(book.sentenses),
            })
          ).subscribe(() => console.log('import sucess'));

          return book.sentenses;
        })
      );
  }

  updateSheetRow(
    id: string,
    name: string,
    rowIndex: number,
    row: { en: string; ja: string; pronunciation: string; note: string }
  ): Observable<Sentense[]> {
    return zip(
      this.http.post<Response>(
        `${
          isDevMode() ? LOCAL_URL : PROD_URL
        }update-sheet-row?sheetId=${id}&sheetName=${name}`,
        { rowIndex: rowIndex + 1, row },
        {
          headers: isDevMode() ? LOCAL_HEADER : {},
        }
      ),
      this.getBookSentences(id, name)
    ).pipe(
      map((result) => {
        const newSentenses = result[1].sentenses.concat();
        newSentenses[rowIndex] = { ...newSentenses[rowIndex], ...row };
        const key = this.createKey(id, name);
        this.dbService
          .update(STORE_TYPE.STORE_SENTENSES, {
            id: key,
            sentenses: newSentenses,
          })
          .subscribe(() => console.log('update'));
        return newSentenses;
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

  deleteBook(id: string, name: string) {
    const key = this.createKey(id, name);
    return merge(
      this.dbService.deleteByKey(STORE_TYPE.STORE_SENTENSES, key),
      this.dbService.deleteByKey(STORE_TYPE.STORE_BOOK, key)
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

  saveAudio() {
    const url =
      'https://doc-04-8c-docs.googleusercontent.com/docs/securesc/ha0ro937gcuc7l7deffksulhg5h7mbp1/v49i2i1mchb35l02d70ruhtaiujqvedq/1676509425000/00970553223073830182/*/117JLBKrF82jMKzhqe1RZczKokw4aoJPk?e=download&uuid=345f17b7-4612-47b6-96c5-3932fbe605e9';
    fetch(url).then(async (res: any) => {
      const arybuffer = await res.arrayBuffer();
      console.log(arybuffer);

      const key = 'sheetId___sheetName___0';
      this.dbService
        .update(STORE_TYPE.STORE_AUDIO, {
          id: key,
          audio: arybuffer,
        })
        .subscribe((a) => {
          this.dbService
            .getByKey<{ id: string; audio: ArrayBuffer }>(
              STORE_TYPE.STORE_AUDIO,
              'sheetId___sheetName___0'
            )
            .subscribe(async (data) => {
              if (!data) {
                console.log('data', data);
                return;
              }
              const audioCtx = new AudioContext();
              const buffer = await audioCtx.decodeAudioData(data.audio);
              const source = audioCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(audioCtx.destination);
              source.start();
            });
        });
    });
  }

  getAllBooks(): Observable<Book[]> {
    return this.dbService.getAll<Book>(STORE_TYPE.STORE_BOOK);
  }

  getBookAndChapters(id: string, name: string): Observable<Book> {
    const key = this.createKey(id, name);
    return this.dbService.getByKey<Book>(STORE_TYPE.STORE_BOOK, key);
  }

  getBookSentences(
    id: string,
    name: string
  ): Observable<{ id: string; sentenses: Sentense[] }> {
    const key = this.createKey(id, name);
    return this.dbService.getByKey<{ id: string; sentenses: Sentense[] }>(
      STORE_TYPE.STORE_SENTENSES,
      key
    );
  }

  private createKey(id: string, name: string): string {
    return `${id}___${name}`;
  }
}
