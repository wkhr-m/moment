import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  template: `<app-header></app-header>
    <main>
      <router-outlet></router-outlet>
    </main> `,
})
export class AppComponent implements OnInit {
  constructor(private _snackBar: MatSnackBar, updates: SwUpdate) {
    updates.versionUpdates
      .pipe(
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY')
      )
      .subscribe(() => {
        const snackbarRef = this._snackBar.open(
          '更新情報があります。更新しますか？',
          '更新する'
        );
        snackbarRef.onAction().subscribe((res) => {
          localStorage.setItem('isUpdated', 'TRUE');
          document.location.reload();
        });
      });
  }

  ngOnInit(): void {
    const isUpdataed = localStorage.getItem('isUpdated');
    if (isUpdataed === 'TRUE') {
      this._snackBar.open('更新しました。', '', {
        duration: 5000,
      });
      localStorage.removeItem('isUpdated');
    }
  }
}
