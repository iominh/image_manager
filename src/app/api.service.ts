import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getSomeData() {
    return this.http.get('/api/images');
  }

  // more methods for POST, PUT, DELETE...
}