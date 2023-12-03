import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export const API_PATH = 'http://localhost:3000';

export interface CopyFile {
  source: string;
  destination: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getSomeData(): Observable<Object> {
    return this.http.get(`${API_PATH}/list-files`);
  }

  createDirs(): Observable<Object> {
    return this.http.post(`${API_PATH}/create-dirs`, {});
  }

  copyFiles(fileList: CopyFile[]): Observable<Object> {
    return this.http.post(`${API_PATH}/copy-files`, fileList);
  }

  // more methods for POST, PUT, DELETE...
}