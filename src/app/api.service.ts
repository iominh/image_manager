import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export const API_PATH = 'http://localhost:3000'

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getSomeData(): Observable<Object> {
    return this.http.get(`${API_PATH}/list-files`);
  }

  // more methods for POST, PUT, DELETE...
}