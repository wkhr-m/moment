import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `<app-header></app-header>
    <main>
      <router-outlet></router-outlet>
    </main> `,
})
export class AppComponent {}
