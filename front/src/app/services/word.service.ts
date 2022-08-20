import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

export interface Word {
  word: string;
  results?: ResultsEntity[] | null;
  syllables: Syllables;
  pronunciation: Pronunciation;
  frequency: number;
}
export interface ResultsEntity {
  definition: string;
  partOfSpeech: string;
  synonyms?: string[] | null;
  typeOf?: string[] | null;
  hasTypes?: string[] | null;
  antonyms?: string[] | null;
  derivation?: string[] | null;
  examples?: string[] | null;
}
export interface Syllables {
  count: number;
  list: string[] | null;
}
export interface Pronunciation {
  all: string;
}
@Injectable()
export class WordService {
  constructor(private http: HttpClient) {}

  getWordInformation(word: string): Observable<Word> {
    return this.http.get<Word>(
      `https://wordsapiv1.p.rapidapi.com/words/${word}`,
      {
        headers: new HttpHeaders({
          'X-RapidAPI-Host': environment.xRapidApiHost,
          'X-RapidAPI-Key': environment.xRapidApiKey,
        }),
      }
    );
  }
}
