import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

// HeaderComponentに情報を共有するためのService

const APP_NAME = 'Moment';
@Injectable()
export class HeaderService {
  color$ = new Subject<string>();
  bgColor$ = new Subject<string>();
  title$ = new BehaviorSubject<string>(APP_NAME);
  backURL$ = new Subject<string>();

  constructor() {}

  setColor(color?: string): void {
    this.color$.next(color || '');
  }

  setBgColor(bgColor?: string): void {
    this.bgColor$.next(bgColor || '');
  }

  setTitle(title: string): void {
    this.title$.next(title);
  }

  setBackURL(url: string): void {
    this.backURL$.next(url);
  }

  init() {
    this.color$.next('');
    this.bgColor$.next('');
    this.title$.next(APP_NAME);
    this.backURL$.next('');
  }
}
