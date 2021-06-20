import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class StorageService {

  constructor(
  ) { }

  set(key: string, data: any) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.log('Cache local storage error ', error);
    }
  }

  get(key: string) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (error) {
      console.log('Get cache local storage error ', error);
      return null;
    }
  }
}
