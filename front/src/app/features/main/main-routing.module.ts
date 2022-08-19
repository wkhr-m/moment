import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookComponent } from './pages/book/book.component';
import { BooksComponent } from './pages/books/books.component';
import { HomeComponent } from './pages/home/home.component';
import { SentenseViewerComponent } from './pages/sentense-viewer/sentense-viewer.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'books',
        pathMatch: 'full',
        component: BooksComponent,
      },
      {
        path: 'book/:bookId/sentense',
        pathMatch: 'full',
        component: SentenseViewerComponent,
      },
      {
        path: 'book/:bookId',
        pathMatch: 'full',
        component: BookComponent,
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'books',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
