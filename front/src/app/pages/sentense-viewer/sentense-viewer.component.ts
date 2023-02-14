import { Dialog } from '@angular/cdk/dialog';
import { Location } from '@angular/common';
import {
  AfterViewChecked,
  Component,
  HostListener,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import type { Book, Sentense } from '@m-types/books';
import { Setting, ViewerOrder } from '@m-types/setting';
import { FixedQueue } from '@utils/fixed-queue';
import { speechWord } from '@utils/speech';
import SwiperCore, {
  EffectCreative,
  Keyboard,
  Navigation,
  Virtual,
} from 'swiper';
import { EditorComponent } from '../../parts/editor/editor.component';
import { MeanWordComponent } from '../../parts/mean-word/mean-word.component';
import { ViewerSettingDialogComponent } from '../../parts/viewer-setting-dialog/viewer-setting-dialog.component';
import { BookService } from '../../services/book.service';
import { HeaderService } from '../../services/header.service';
import { SettingService } from '../../services/setting.service';
import { releaseRecord } from './../../../utils/record';

SwiperCore.use([Virtual, EffectCreative, Navigation, Keyboard]);

type SwiperElement = HTMLElement & { swiper: SwiperCore };

@Component({
  selector: 'app-sentense-viewer',
  templateUrl: './sentense-viewer.component.html',
  styleUrls: ['./sentense-viewer.component.scss'],
})
export class SentenseViewerComponent
  implements OnInit, OnDestroy, AfterViewChecked
{
  viewerOrder = ViewerOrder;
  book?: Book;
  section?: string;
  sentenses: Sentense[] = [];
  activeSentenseNumber: number = 0;
  isSecondSentenseHide: boolean = true;
  isLoaded = false;
  isBookExist: boolean = true;
  setting?: Setting;
  private swiperEl?: SwiperElement;

  private audioFixedQueue: FixedQueue<HTMLAudioElement | null> = new FixedQueue(
    0,
    []
  );

  constructor(
    private bookService: BookService,
    private settingService: SettingService,
    private headerService: HeaderService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private ngZone: NgZone,
    public dialog: Dialog
  ) {}

  ngOnInit(): void {
    const bookId = this.route.snapshot.paramMap.get('bookId') || '';

    if (!!this.route.snapshot.paramMap.get('activeSentenseNumber')) {
      this.activeSentenseNumber =
        Number(this.route.snapshot.paramMap.get('activeSentenseNumber')) - 1;
    }
    this.section = this.route.snapshot.queryParams['section'];

    this.getSetting();

    this.bookService.getBookAndChapters(bookId).subscribe((book) => {
      this.isBookExist = !!book;
      this.book = book;
      this.setHeader(book);
    });

    this.bookService.getBookSentences(bookId).subscribe((book) => {
      if (!!this.section) {
        this.sentenses = book.sentenses.filter(
          (sentense) => sentense.section === this.section
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

      //activeNumberの確認
      if (this.activeSentenseNumber > book.sentenses.length - 1) {
        this.activeSentenseNumber = 0;
        this.setActiveNumberFromUrl(1);
      }

      // 音声準備
      const firstAudio = new Audio(
        this.sentenses[this.activeSentenseNumber - 1]?.audioUrl
      );
      firstAudio.load();
      const secondAudio = new Audio(
        this.sentenses[this.activeSentenseNumber]?.audioUrl
      );
      secondAudio.load();
      const thirdAudio = new Audio(
        this.sentenses[this.activeSentenseNumber + 1]?.audioUrl
      );
      secondAudio.load();
      this.audioFixedQueue = new FixedQueue(3, [
        firstAudio,
        secondAudio,
        thirdAudio,
      ]);

      this.setSentenseNumberAtHeader(this.activeSentenseNumber);
      this.isLoaded = true;
    });
  }

  ngAfterViewChecked() {
    const swiperEl = document.querySelector<SwiperElement>('swiper-container');
    if (!this.swiperEl && !!swiperEl) {
      this.swiperEl = swiperEl;
      (this.swiperEl as any).initialize();
      if (this.activeSentenseNumber > 0) {
        this.swiperEl?.swiper.slideTo(this.activeSentenseNumber, 0);
      }
      this.swiperEl.addEventListener('slidechange', (event) => {
        this.ngZone.run(() => this.onSlideChange(event));
      });
    }
  }

  ngOnDestroy(): void {
    this.swiperEl?.removeEventListener('slideChange', this.onSlideChange);
    releaseRecord();
  }

  onClickHide(): void {
    this.isSecondSentenseHide = false;
  }

  onSlideChange(event: any) {
    const newActiveIndex = event.currentTarget.swiper.activeIndex;
    if (newActiveIndex === this.activeSentenseNumber) {
      return;
    }
    this.isSecondSentenseHide = true;
    releaseRecord();

    this.setSentenseNumberAtHeader(newActiveIndex);
    this.setActiveNumberFromUrl(newActiveIndex + 1);

    if (this.activeSentenseNumber > newActiveIndex) {
      if (!this.sentenses[newActiveIndex - 1]?.audioUrl) {
        this.audioFixedQueue.dequeue(null);
      } else {
        const tmp = new Audio(this.sentenses[newActiveIndex - 1].audioUrl);
        tmp.load();
        this.audioFixedQueue.dequeue(tmp);
      }
    } else {
      if (!this.sentenses[newActiveIndex + 1]?.audioUrl) {
        this.audioFixedQueue.enqueue(null);
      } else {
        const tmp = new Audio(this.sentenses[newActiveIndex + 1].audioUrl);
        tmp.load();
        this.audioFixedQueue.enqueue(tmp);
      }
    }

    this.activeSentenseNumber = newActiveIndex;
  }

  onPlay() {
    const audio = this.audioFixedQueue.getItem(1);
    const rate = this.setting?.speechRate || 1;
    if (
      !!audio?.src &&
      audio?.readyState !== 0 &&
      !this.setting?.useSpeechSynthesis
    ) {
      audio.playbackRate = rate;
      audio.currentTime = 0;
      audio.play();
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
      panelClass: ['dialog-section'],
      backdropClass: ['dialog-backdrop', 'cdk-overlay-dark-backdrop'],
    });
  }

  onOpenEditor() {
    this.swiperEl?.swiper.keyboard.disable();
    const dialogRef = this.dialog.open(EditorComponent, {
      data: {
        pronunciation: this.sentenses[this.activeSentenseNumber].pronunciation,
        en: this.sentenses[this.activeSentenseNumber].en,
        ja: this.sentenses[this.activeSentenseNumber].ja,
        note: this.sentenses[this.activeSentenseNumber].note,
      },
      panelClass: ['dialog-section'],
      backdropClass: ['dialog-backdrop', 'cdk-overlay-dark-backdrop'],
    });
    dialogRef.closed.subscribe((res) => {
      const row = dialogRef.componentInstance?.form.value;
      if (
        row.ja !== this.sentenses[this.activeSentenseNumber].ja ||
        row.en !== this.sentenses[this.activeSentenseNumber].en ||
        row.pronunciation !==
          this.sentenses[this.activeSentenseNumber].pronunciation ||
        row.note !== this.sentenses[this.activeSentenseNumber].note
      ) {
        this.bookService
          .updateSheetRow(
            this.book?.id || '',
            this.book?.sheetName || '',
            this.activeSentenseNumber,
            row
          )
          .subscribe((res) => {
            this.sentenses = res;
          });
      }
      this.swiperEl?.swiper.keyboard.enable();
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

  private setActiveNumberFromUrl(newActiveNumber: number) {
    const url = this.router
      .createUrlTree(['book', this.book?.id, 'sentense', newActiveNumber], {
        queryParams: {
          section: this.section,
        },
      })
      .toString();
    this.location.replaceState(url);
  }
  // headerにタイトルや色を設定する
  private setHeader(book: Book): void {
    this.headerService.setBackURL(book ? `book/${book.id}` : 'books');
  }

  @HostListener('window:keydown.control.space', ['$event'])
  @HostListener('window:keydown.space', ['$event'])
  spaceEvent(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.onPlay();
  }
}
