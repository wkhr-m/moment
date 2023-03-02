import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  NgZone,
  Output,
  ViewChild,
} from '@angular/core';
import { Sentense } from '@m-types/books';
import { Setting, ViewerOrder } from '@m-types/setting';
import { Direction, Pan, PointerListener } from 'contactjs';

var ticking: boolean = false;
var isSwiping: boolean = false;
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements AfterViewInit {
  @Input() sentense?: Sentense;
  @Input() setting?: Setting;
  @Input() isOpeningDialog: boolean = false;
  @Input() active: boolean = false;
  @Input() isLast: boolean = false;
  @Output() swipeEvent: EventEmitter<null> = new EventEmitter();
  @ViewChild('cardEl') cardEl?: ElementRef<HTMLElement>;
  pointListener?: PointerListener;
  isSecondSentenseHide: boolean = true;
  swipeDirection: string = '';
  beforePoint?: { x: 0; y: 0 };
  viewerOrder = ViewerOrder;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    // 一番上のカードだけswipeできるようにする
    if (this.cardEl && this.active) {
      const panRecognizer = new Pan(this.cardEl.nativeElement, {
        supportedDirections: [Direction.Up, Direction.Right, Direction.Left],
      });
      this.pointListener = new PointerListener(this.cardEl.nativeElement, {
        DEBUG: false,
        bubbles: false,
        supportedGestures: [panRecognizer],
      });
    }
  }

  onPan(event: any) {
    const direction = event.detail.global.direction;
    this.swipeDirection = direction;
    // 座標はデフォルトでは左右の動き
    let x = event.detail.global.deltaX;
    let y = event.detail.global.deltaY;
    if (x === this.beforePoint?.x && y === this.beforePoint?.y) {
      return;
    }
    this.beforePoint = { x, y };
    const transformStr = `translate3d(${x}px, ${y}px, 0)`;
    this.requestElementUpdate(transformStr, event.detail.recognizer.domElement);
  }

  onPanEnd(event: any) {
    if (!this.cardEl) {
      return;
    }
    const direction = event.detail.global.direction;
    const cardElRect = this.cardEl.nativeElement.getClientRects()[0];
    // 座標はデフォルトでは左右の動き
    const x = event.detail.global.deltaX;
    const y = event.detail.global.deltaY;
    if (direction !== Direction.Up && Math.abs(x) > cardElRect.width / 3) {
      this.swipe(x > 0 ? Direction.Right : Direction.Left);
      return;
    } else if (direction === Direction.Up && -y > cardElRect.height / 3) {
      this.swipe(Direction.Up);
      return;
    }
    this.swipeDirection = '';
    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(function (timestamp) {
        event.detail.recognizer.domElement.style.transform =
          'translate3d(0px, 0px, 0)';
      });
    });
  }

  onSwipe(direction: string) {
    let dir = Direction.Right;
    switch (direction) {
      case 'left':
        dir = Direction.Left;
        return;
      case 'up':
        dir = Direction.Up;
        return;
    }
    this.swipe(dir);
  }

  onClickHide(): void {
    this.isSecondSentenseHide = false;
  }

  private requestElementUpdate(transformString: string, element: any) {
    if (!ticking) {
      this.ngZone.runOutsideAngular(() => {
        requestAnimationFrame(
          this.requestAnimation.bind(this, transformString, element)
        );
        ticking = true;
      });
    }
  }

  private requestAnimation(transformString: string, element: any) {
    element.style.transform = transformString;
    ticking = false;
  }

  private swipe(direction: Direction) {
    if (isSwiping) {
      return;
    }
    isSwiping = true;
    this.beforePoint = undefined;
    const el = this.cardEl?.nativeElement;
    if (!el) {
      return;
    }
    el.style.transition = 'all .4s ease-in';
    this.swipeDirection = direction;
    switch (direction) {
      case Direction.Up:
        el.style.transform = 'translate3d(0, -200%, 0)';
        break;
      case Direction.Right:
        el.style.transform = 'translate3d(200%, 0, 0)';
        break;
      case Direction.Left:
        el.style.transform = 'translate3d(-200%, 0, 0)';
        break;
    }
    this.swipeEvent.emit();
    if (!this.isLast) {
      setTimeout(() => {
        isSwiping = false;
        this.swipeDirection = '';
        el.style.transition = '';
        el.style.transform = 'translate3d(0, 0, 0)';
      }, 400);
    }
  }

  @HostListener('window:keydown.arrowRight', ['$event'])
  rightKeyEvent(event: Event) {
    if (this.isOpeningDialog || !this.active || this.isLast) {
      return;
    }
    this.swipe(Direction.Right);
  }

  @HostListener('window:keydown.arrowLeft', ['$event'])
  leftKeyEvent(event: Event) {
    if (this.isOpeningDialog || !this.active || this.isLast) {
      return;
    }
    this.swipe(Direction.Left);
  }

  @HostListener('window:keydown.ArrowUp', ['$event'])
  upKeyEvent(event: Event) {
    if (this.isOpeningDialog || !this.active || this.isLast) {
      return;
    }
    this.swipe(Direction.Up);
  }
}
