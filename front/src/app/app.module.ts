import { DialogModule } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { dbConfig } from '@utils/db-config';
import { NgxIndexedDBModule } from 'ngx-indexed-db';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SwiperModule } from 'swiper/angular';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BookComponent } from './pages/book/book.component';
import { BooksComponent } from './pages/books/books.component';
import { SentenseViewerComponent } from './pages/sentense-viewer/sentense-viewer.component';
import { BookSettingsDialogComponent } from './parts/book-settings-dialog/book-settings-dialog.component';
import { DownloadBookComponent } from './parts/download-book/download-book.component';
import { EnSentenseComponent } from './parts/en-sentense/en-sentense.component';
import { HeaderComponent } from './parts/header/header.component';
import { MeanWordComponent } from './parts/mean-word/mean-word.component';
import { ViewerSettingDialogComponent } from './parts/viewer-setting-dialog/viewer-setting-dialog.component';
import { BookService } from './services/book.service';
import { HeaderService } from './services/header.service';
import { WordService } from './services/word.service';

@NgModule({
  declarations: [
    AppComponent,
    SentenseViewerComponent,
    HeaderComponent,
    BooksComponent,
    BookComponent,
    EnSentenseComponent,
    MeanWordComponent,
    DownloadBookComponent,
    BookSettingsDialogComponent,
    ViewerSettingDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    DialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    NgxSkeletonLoaderModule,
    SwiperModule,
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    NgxIndexedDBModule.forRoot(dbConfig),
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [HeaderService, BookService, WordService],
  bootstrap: [AppComponent],
})
export class AppModule {}
