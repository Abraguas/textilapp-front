import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryDTO } from '../models/category-dto';


@Injectable()
export class CategoryService {

  private API_URL: string = 'http://localhost:9090/category';

  constructor(private http: HttpClient) { }

  getAll(): Observable<CategoryDTO[]>{
    return this.http.get<CategoryDTO[]>(this.API_URL);
  }
}
