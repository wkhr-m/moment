import { DialogModule } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MainRoutingModule } from './main-routing.module';
import { BookComponent } from './pages/book/book.component';
import { BooksComponent } from './pages/books/books.component';
import { HomeComponent } from './pages/home/home.component';
import { SentenseViewerComponent } from './pages/sentense-viewer/sentense-viewer.component';
import { DownloadBookComponent } from './parts/download-book/download-book.component';
import { EnSentenseComponent } from './parts/en-sentense/en-sentense.component';
import { HeaderComponent } from './parts/header/header.component';
import { MeanWordComponent } from './parts/mean-word/mean-word.component';
import { SettingsDialogComponent } from './parts/settings-dialog/settings-dialog.component';
import { BookService } from './services/book.service';
import { HeaderService } from './services/header.service';
import { WordService } from './services/word.service';

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
    SettingsDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MainRoutingModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    DialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    NgxSkeletonLoaderModule,
  ],
  providers: [BookService, HeaderService, WordService],
})
export class MainModule {}
