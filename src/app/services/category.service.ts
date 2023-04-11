import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryDTO } from '../models/category-dto';


@Injectable()
export class CategoryService {

  private API_URL: string = 'http://localhost:9090/category';

  constructor(private http: HttpClient) { }

  getAll(): Observable<CategoryDTO[]>{
    let auth_token = localStorage.getItem('token');
    const headers = new HttpHeaders({

      'Content-Type': 'application/json',

      'Authorization': `Bearer ${auth_token}`

    });
    const requestOptions = { headers: headers };
    return this.http.get<CategoryDTO[]>(this.API_URL, requestOptions);
  }
}
