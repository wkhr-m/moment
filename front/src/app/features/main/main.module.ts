import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BooksComponent } from './pages/books/books.component';
import { BookService } from './services/book.service';
import { HeaderService } from './services/header.service';
import { WordService } from './services/word.service';

import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MainRoutingModule } from './main-routing.module';
import { BookComponent } from './pages/book/book.component';
import { HomeComponent } from './pages/home/home.component';
import { SentenseViewerComponent } from './pages/sentense-viewer/sentense-viewer.component';
import { DownloadBookComponent } from './parts/download-book/download-book.component';
import { EnSentenseComponent } from './parts/en-sentense/en-sentense.component';
import { HeaderComponent } from './parts/header/header.component';
import { MeanWordComponent } from './parts/mean-word/mean-word.component';

@NgModule({
  declarations: [
    HomeComponent,
    SentenseViewerComponent,
    HeaderComponent,
    BooksComponent,
    BookComponent,
    EnSentenseComponent,
    MeanWordComponent,
    DownloadBookComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MainRoutingModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    NgxSkeletonLoaderModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
  ],
  providers: [BookService, HeaderService, WordService],
})
export class MainModule {}
