import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { initVoices } from '@utils/speech';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { register } from 'swiper/element/bundle';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));

// SpeechSynthesisVoiceの読み込みは非同期なので最初に読み込む必要がある
initVoices();

// install swiper
register();
