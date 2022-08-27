import { Dialog } from '@angular/cdk/dialog';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import type { Book, Sentense } from '@m-types/books';
import { Setting, ViewerOrder } from '@m-types/setting';
import { playRecord, RecordVoice } from '@utils/record';
import { speechWord } from '@utils/speech';
import { SettingService } from 'app/services/setting.service';
import SwiperCore, {
  EffectCreative,
  Keyboard,
  Navigation,
  Swiper,
  Virtual,
} from 'swiper';
import { MeanWordComponent } from '../../parts/mean-word/mean-word.component';
import { BookService } from '../../services/book.service';
import { releaseRecord } from './../../../utils/record';
import { ViewerSettingDialogComponent } from './../../parts/viewer-setting-dialog/viewer-setting-dialog.component';
import { HeaderService } from './../../services/header.service';

SwiperCore.use([Virtual, EffectCreative, Navigation, Keyboard]);

@Component({
  selector: 'app-sentense-viewer',
  templateUrl: './sentense-viewer.component.html',
  styleUrls: ['./sentense-viewer.component.scss'],
})
export class SentenseViewerComponent implements OnInit, OnDestroy {
  viewerOrder = ViewerOrder;
  book?: Book;
  sentenses: Sentense[] = [];
  activeSentenseNumber: number = 0;
  isSecondSentenseHide: boolean = true;
  isLoaded = false;
  isBookExist: boolean = true;
  audio?: HTMLAudioElement;
  setting?: Setting;
  isRecorded: boolean = false;
  isRecording: boolean = false;

  constructor(
    private bookService: BookService,
    private settingService: SettingService,
    private headerService: HeaderService,
    private route: ActivatedRoute,
    public dialog: Dialog
  ) {}

  ngOnInit(): void {
    const bookId = this.route.snapshot.paramMap.get('bookId') || '';
    const section = this.route.snapshot.queryParams['section'];

    this.getSetting();

    this.bookService.getBookAndChapters(bookId).subscribe((book) => {
      this.isBookExist = !!book;
      this.book = book;
      this.setHeader(book);
    });

    this.bookService.getBookSentences(bookId).subscribe((book) => {
      if (section) {
        this.sentenses = book.sentenses.filter(
          (sentense) => sentense.section === section
        );
      } else {
        this.sentenses = book.sentenses;
      }
      // 文章がない場合
      if (this.sentenses.length === 0) {
        this.isBookExist = false;
        this.headerService.setBackURL('books');
        this.isLoaded = true;
        return;
      }
      if (!!this.sentenses[0].audioUrl) {
        this.audio = new Audio(this.sentenses[0].audioUrl);
      }
      this.setSentenseNumberAtHeader(this.activeSentenseNumber);
      this.isLoaded = true;
    });
  }

  ngOnDestroy(): void {
    releaseRecord();
  }

  onClickHide(): void {
    this.isSecondSentenseHide = false;
  }

  onSlideChange(swipers: Swiper[]) {
    this.isSecondSentenseHide = true;
    this.isRecorded = false;
    releaseRecord();
    const newActiveIndex = swipers[0].activeIndex;
    this.activeSentenseNumber = newActiveIndex;
    this.setSentenseNumberAtHeader(newActiveIndex);
    if (!!this.sentenses[newActiveIndex].audioUrl) {
      this.audio = new Audio(this.sentenses[newActiveIndex].audioUrl);
    }
  }

  onPlay(rate: number) {
    if (!!this.audio?.src) {
      this.audio.playbackRate = rate;
      this.audio.play();
    } else {
      speechWord(
        this.sentenses[this.activeSentenseNumber].en,
        rate,
        this.setting?.voice
      );
    }
  }

  onClickWord(word: string) {
    this.dialog.open(MeanWordComponent, {
      data: {
        word,
        voice: this.setting?.voice,
      },
      backdropClass: ['dialog-backdrop', 'cdk-overlay-dark-backdrop'],
    });
  }

  onOpenSetting(): void {
    const dialogRef = this.dialog.open(ViewerSettingDialogComponent, {
      data: this.setting,
      backdropClass: ['dialog-backdrop', 'cdk-overlay-dark-backdrop'],
    });
    dialogRef.closed.subscribe(() => {
      this.getSetting();
    });
  }

  onRecordVoice(): void {
    this.isRecording = !this.isRecording;
    if (!this.isRecording) {
      this.isRecorded = true;
    }
    RecordVoice();
  }

  onHearVoice(): void {
    playRecord();
  }

  private getSetting() {
    this.settingService.getSetting().subscribe((res) => {
      this.setting = res;
    });
  }

  private setSentenseNumberAtHeader(activeSentenseNumber: number) {
    this.headerService.setTitle(
      `${activeSentenseNumber + 1} / ${this.sentenses.length}`
    );
  }
  // headerにタイトルや色を設定する
  private setHeader(book: Book): void {
    this.headerService.setBackURL(book ? `book/${book.id}` : 'books');
  }
}
