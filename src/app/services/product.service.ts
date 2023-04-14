import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { Observable } from 'rxjs';

@Injectable()
export class ProductService {

   private API_URL: string = 'http://localhost:9090/product/listed';

   constructor(private http: HttpClient) { }
 
   
   getAll(): Observable<Product[]>{
    let auth_token = localStorage.getItem('token');
    const headers = new HttpHeaders({

      'Content-Type': 'application/json',

      'Authorization': `Bearer ${auth_token}`

    });
    const requestOptions = { headers: headers };
     return this.http.get<Product[]>(this.API_URL,requestOptions);
   }
   getBySubcategory(subCategoryId: number): Observable<Product[]>{
    let auth_token = localStorage.getItem('token');
    const headers = new HttpHeaders({

      'Content-Type': 'application/json',

      'Authorization': `Bearer ${auth_token}`

    });
    const requestOptions = { headers: headers };
    return this.http.get<Product[]>(this.API_URL+'/'+subCategoryId,requestOptions);
  }
}
