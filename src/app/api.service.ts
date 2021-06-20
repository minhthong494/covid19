import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE_URL = 'https://covid-api.mmediagroup.fr/v1';

@Injectable({
  providedIn: 'root'
})

export class APIService {

  constructor(
    private httpClient: HttpClient
  ) { }

  fetchLiveCases(): Observable<HttpResponse<any>> {
    return this.httpClient.get<any>(`${BASE_URL}/cases`, { observe: 'response', responseType: 'json' });
  }

  fetchHistoricalCases(queryParams): Observable<HttpResponse<any>> {
    return this.httpClient.get<any>(`${BASE_URL}/history`, { observe: 'response', responseType: 'json', params: queryParams });
  }
}
