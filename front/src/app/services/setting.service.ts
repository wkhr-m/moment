import { Injectable } from '@angular/core';
import { Setting } from '@m-types/setting';
import { STORE_TYPE } from '@utils/db-config';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { map, Observable } from 'rxjs';
import { ViewerOrder } from './../../types/setting';

const INIT_SETTING = {
  id: 'setting',
  order: ViewerOrder.ENJA,
  secondLangIsHide: false,
  isAutoPlay: false,
  useSpeechSynthesis: false,
};
@Injectable()
export class SettingService {
  constructor(private dbService: NgxIndexedDBService) {}

  getSetting(): Observable<Setting> {
    return this.dbService
      .getByKey<Setting>(STORE_TYPE.STORE_SETTING, 'setting')
      .pipe(
        map((res) => {
          if (res === undefined) {
            return INIT_SETTING;
          }
          return res;
        })
      );
  }

  setSetting(setting: Setting): Observable<Setting> {
    setting.id = 'setting';
    return this.dbService.update<Setting>(STORE_TYPE.STORE_SETTING, setting);
  }
}
