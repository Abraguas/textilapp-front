import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryDTO } from '../models/category-dto';
import { Category } from '../models/category';
import { SubCategory } from '../models/sub-category';


@Injectable()
export class CategoryService {

    private API_URL: string = 'http://localhost:9090/category';

    constructor(private http: HttpClient) { }

    getAll(): Observable<CategoryDTO[]> {
        let auth_token = localStorage.getItem('token');
        const headers = new HttpHeaders({

            'Content-Type': 'application/json',

            'Authorization': `Bearer ${auth_token}`

        });
        const requestOptions = { headers: headers };
        return this.http.get<CategoryDTO[]>(this.API_URL, requestOptions);
    }
    register(category: Category): Observable<any> {
        let auth_token = localStorage.getItem('token');
        const headers = new HttpHeaders({

            'Content-Type': 'application/json',

            'Authorization': `Bearer ${auth_token}`

        });
        const requestOptions = { headers: headers };
        return this.http.post<any>(this.API_URL, category, requestOptions);
    }
    update(categoryId: number, category: Category): Observable<any> {
        let auth_token = localStorage.getItem('token');
        const headers = new HttpHeaders({

            'Content-Type': 'application/json',

            'Authorization': `Bearer ${auth_token}`

        });
        const requestOptions = { headers: headers };
        return this.http.put<any>(`${this.API_URL}/${categoryId}`, category, requestOptions);
    }
    delete(categoryId: number): Observable<any> {
        let auth_token = localStorage.getItem('token');
        const headers = new HttpHeaders({

            'Content-Type': 'application/json',

            'Authorization': `Bearer ${auth_token}`

        });
        const requestOptions = { headers: headers };
        return this.http.delete<any>(`${this.API_URL}/${categoryId}`, requestOptions);
    }
    registerSubCategory(subCategory: SubCategory): Observable<any> {
        let auth_token = localStorage.getItem('token');
        const headers = new HttpHeaders({

            'Content-Type': 'application/json',

            'Authorization': `Bearer ${auth_token}`

        });
        const requestOptions = { headers: headers };
        return this.http.post<any>(this.API_URL + '/subCategory', subCategory, requestOptions);
    }
    updateSubCategory(subCategoryId: number, subCategory: SubCategory): Observable<any> {
        let auth_token = localStorage.getItem('token');
        const headers = new HttpHeaders({

            'Content-Type': 'application/json',

            'Authorization': `Bearer ${auth_token}`

        });
        const requestOptions = { headers: headers };
        return this.http.put<any>(`${this.API_URL}/subCategory/${subCategoryId}`, subCategory, requestOptions);
    }
    deleteSubCategory(subCategoryId: number): Observable<any> {
        let auth_token = localStorage.getItem('token');
        const headers = new HttpHeaders({

            'Content-Type': 'application/json',

            'Authorization': `Bearer ${auth_token}`

        });
        const requestOptions = { headers: headers };
        return this.http.delete<any>(`${this.API_URL}/subCategory/${subCategoryId}`, requestOptions);
    }
}
