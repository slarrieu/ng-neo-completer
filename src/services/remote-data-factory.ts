import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { RemoteData } from './remote-data';

@Injectable()
export class RemoteDataFactory {
    constructor(private http: HttpClient) { }

    public create() {
        return new RemoteData(this.http);
    }
}