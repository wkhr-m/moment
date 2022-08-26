import { Injectable } from '@angular/core';
import { Setting } from '@m-types/setting';
import { STORE_TYPE } from '@utils/db-config';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable } from 'rxjs';

@Injectable()
export class SettingService {
  constructor(private dbService: NgxIndexedDBService) {}

  getSetting(): Observable<Setting> {
    return this.dbService.getByKey<Setting>(
      STORE_TYPE.STORE_SETTING,
      'setting'
    );
  }

  setSetting(setting: Setting): Observable<Setting> {
    setting.id = 'setting';
    return this.dbService.update<Setting>(STORE_TYPE.STORE_SETTING, setting);
  }
}
