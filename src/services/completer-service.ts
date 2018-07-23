import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { LocalData } from './local-data';
import { RemoteData } from './remote-data';
import { LocalDataFactory } from './local-data-factory';
import { RemoteDataFactory } from './remote-data-factory';

@Injectable()
export class CompleterService {
    constructor(
        private localDataFactory: LocalDataFactory, // Using any instead of () => LocalData because of AoT errors
        private remoteDataFactory: RemoteDataFactory // Using any instead of () => LocalData because of AoT errors
    ) { }

    public local(
        data: any[] | Observable<any>,
        searchFields: string | null = '',
        titleField: string | null = ''
    ): LocalData {

        const localData = this.localDataFactory.create();
        return localData
            .data(data)
            .searchFields(searchFields)
            .titleField(titleField);
    }

    public remote(url: string | null, searchFields: string | null = '', titleField: string | null = ''): RemoteData {

        const remoteData = this.remoteDataFactory.create();
        return remoteData
            .remoteUrl(url)
            .searchFields(searchFields)
            .titleField(titleField);
    }
}