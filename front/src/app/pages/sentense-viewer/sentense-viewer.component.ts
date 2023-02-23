import { Dialog } from '@angular/cdk/dialog';
import { Location } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import type { Book, Sentense } from '@m-types/books';
import { Setting, ViewerOrder } from '@m-types/setting';
import { FixedQueue } from '@utils/fixed-queue';
import { speechWord } from '@utils/speech';
import KeenSlider, { KeenSliderInstance } from 'keen-slider';
import { EditorComponent } from '../../parts/editor/editor.component';
import { ViewerSettingDialogComponent } from '../../parts/viewer-setting-dialog/viewer-setting-dialog.component';
import { BookService } from '../../services/book.service';
import { HeaderService } from '../../services/header.service';
import { SettingService } from '../../services/setting.service';
import { releaseRecord } from './../../../utils/record';

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
  isOpeningDialog: boolean = false;
  @ViewChild('sliderRef') sliderRef?: ElementRef<HTMLElement>;
  indexes: number[] = [];

  slider?: KeenSliderInstance;

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
    public dialog: Dialog,
    private _snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const sheetId = this.route.snapshot.paramMap.get('sheetId') || '';
    const sheetName = this.route.snapshot.paramMap.get('sheetName') || '';

    if (!!this.route.snapshot.paramMap.get('activeSentenseNumber')) {
      this.activeSentenseNumber =
        Number(this.route.snapshot.paramMap.get('activeSentenseNumber')) - 1;
    }
    this.section = this.route.snapshot.queryParams['section'];

    this.getSetting();

    this.bookService.getBookAndChapters(sheetId, sheetName).subscribe({
      next: (book) => {
        this.isBookExist = !!book;
        this.book = book;
        this.setHeader(book);
      },
      error: () => {
        this.router.navigateByUrl('/books');
      },
    });

    this.bookService.getBookSentences(sheetId, sheetName).subscribe((book) => {
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
    });
  }

  ngAfterViewChecked() {
    if (this.sliderRef && !this.slider && this.sentenses.length > 0) {
      this.slider = new KeenSlider(this.sliderRef.nativeElement, {
        initial: this.activeSentenseNumber,
        loop: {
          min: 0,
          max: this.sentenses.length - 1,
        },
        range: {
          align: true,
          min: 0,
          max: this.sentenses.length - 1,
        },
        mode: 'snap',
        slideChanged: (event) => {
          this.onSlideChange(event);
        },
        detailsChanged: (s) => {
          const newIndexes = s.track.details.slides.map((slide) => {
            return slide.abs;
          });
          if (this.indexes.length === 0) {
            this.indexes = newIndexes;
            return;
          }
          if (
            this.indexes[0] === newIndexes[0] &&
            this.indexes[1] === newIndexes[1]
          ) {
            // 配列に変わりがない場合は何も変えない
            return;
          } else if (
            Math.abs(this.indexes[0] - newIndexes[0]) === 2 &&
            Math.abs(this.indexes[1] - newIndexes[1]) === 2
          ) {
            // 一瞬、2つ先のスライドが映るバグを回避するため
            return;
          }

          this.indexes = newIndexes;
        },
        slides: {
          spacing: 8,
          number: 2,
          perView: 1,
        },
      });
      this.isLoaded = true;
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy(): void {
    if (this.slider) this.slider.destroy();

    releaseRecord();
  }

  onClickHide(): void {
    this.isSecondSentenseHide = false;
  }

  onSlideChange(event: any) {
    const newActiveIndex = event.track.details.abs;

    if (newActiveIndex === this.activeSentenseNumber) {
      return;
    } else if (Math.abs(newActiveIndex - this.activeSentenseNumber) !== 1) {
      // keen sliderで2個先のスライドをだすバグを回避するため
      return;
    }
    this.isSecondSentenseHide = true;

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

  onOpenEditor() {
    this.isOpeningDialog = true;
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
      this.isOpeningDialog = false;
      const row = dialogRef.componentInstance?.form.value;
      if (
        row.ja !== this.sentenses[this.activeSentenseNumber].ja ||
        row.en !== this.sentenses[this.activeSentenseNumber].en ||
        row.pronunciation !==
          this.sentenses[this.activeSentenseNumber].pronunciation ||
        row.note !== this.sentenses[this.activeSentenseNumber].note
      ) {
        const beforeRow = { ...this.sentenses[this.activeSentenseNumber] };
        const newRow = { ...beforeRow, ...row };
        this.sentenses[this.activeSentenseNumber] = newRow;
        const snackbarRef = this._snackBar.open('保存中', '');
        this.bookService
          .updateSheetRow(
            this.book?.sheetId || '',
            this.book?.sheetName || '',
            this.activeSentenseNumber,
            row
          )
          .subscribe({
            next: (res) => {
              this.sentenses = res;
              snackbarRef.dismiss();
            },
            error: (error) => {
              this.sentenses[this.activeSentenseNumber] = beforeRow;
              snackbarRef.dismiss();
              let msg = '読み込みに失敗しました。';
              if (error.status === 0) {
                msg =
                  'インターネットに接続されていないため、読み込みに失敗しました。';
              } else if (
                error.status === HttpStatusCode.InternalServerError &&
                typeof error.error === 'string'
              ) {
                msg = error.error;
              }
              this._snackBar.open(msg, '', {
                duration: 5000,
                panelClass: ['warn-snackbar'],
              });
            },
          });
      }
    });
  }

  onOpenSetting(): void {
    this.isOpeningDialog = true;
    const dialogRef = this.dialog.open(ViewerSettingDialogComponent, {
      data: this.setting,
      backdropClass: ['dialog-backdrop', 'cdk-overlay-dark-backdrop'],
    });
    dialogRef.closed.subscribe(() => {
      this.isOpeningDialog = false;
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
      .createUrlTree(
        [
          'book',
          this.book?.sheetId,
          this.book?.sheetName,
          'sentense',
          newActiveNumber,
        ],
        {
          queryParams: {
            section: this.section,
          },
        }
      )
      .toString();
    this.location.replaceState(url);
  }
  // headerにタイトルや色を設定する
  private setHeader(book: Book): void {
    this.headerService.setBackURL(
      book ? `book/${book.sheetId}/${book.sheetName}` : 'books'
    );
  }

  @HostListener('window:keydown.control.space', ['$event'])
  @HostListener('window:keydown.space', ['$event'])
  spaceEvent(event: Event) {
    if (this.isOpeningDialog) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    this.onPlay();
  }

  @HostListener('window:keydown.arrowRight', ['$event'])
  rightKeyEvent(event: Event) {
    if (this.isOpeningDialog) {
      return;
    }
    this.slider?.next();
  }

  @HostListener('window:keydown.arrowLeft', ['$event'])
  leftKeyEvent(event: Event) {
    if (this.isOpeningDialog) {
      return;
    }
    this.slider?.prev();
  }
}
