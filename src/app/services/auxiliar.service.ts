import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Unit } from '../models/unit';
import { Color } from '../models/color';
import { Brand } from '../models/brand';
import { OrderState } from '../models/order-state';

@Injectable()
export class AuxiliarService {

    private API_URL: string = 'http://localhost:9090/';

    constructor(private http: HttpClient) { }

    getUnits(): Observable<Unit[]> {
        let auth_token = localStorage.getItem('token');
        const headers = new HttpHeaders({

            'Content-Type': 'application/json',

            'Authorization': `Bearer ${auth_token}`

        });
        const requestOptions = { headers: headers };
        return this.http.get<Unit[]>(this.API_URL + 'unit', requestOptions);
    }
    getColors(): Observable<Color[]> {
        let auth_token = localStorage.getItem('token');
        const headers = new HttpHeaders({

            'Content-Type': 'application/json',

            'Authorization': `Bearer ${auth_token}`

        });
        const requestOptions = { headers: headers };
        return this.http.get<Color[]>(this.API_URL + 'color', requestOptions);
    }
    getBrands(): Observable<Brand[]> {
        let auth_token = localStorage.getItem('token');
        const headers = new HttpHeaders({

            'Content-Type': 'application/json',

            'Authorization': `Bearer ${auth_token}`

        });
        const requestOptions = { headers: headers };
        return this.http.get<Brand[]>(this.API_URL + 'brand', requestOptions);
    }
    getOrderStates(): Observable<OrderState[]> {
        let auth_token = localStorage.getItem('token');
        const headers = new HttpHeaders({

            'Content-Type': 'application/json',

            'Authorization': `Bearer ${auth_token}`

        });
        const requestOptions = { headers: headers };
        return this.http.get<OrderState[]>(this.API_URL + 'orderState', requestOptions);
    }
    deleteBrand(brandId: number): Observable<any> {
        let auth_token = localStorage.getItem('token');
        const headers = new HttpHeaders({

            'Content-Type': 'application/json',

            'Authorization': `Bearer ${auth_token}`

        });
        const requestOptions = { headers: headers };
        return this.http.delete<any>(this.API_URL + 'brand/' + brandId, requestOptions);
    }
    updateBrand(brandId: number, brand: Brand): Observable<any> {
        let auth_token = localStorage.getItem('token');
        const headers = new HttpHeaders({

            'Content-Type': 'application/json',

            'Authorization': `Bearer ${auth_token}`

        });
        const requestOptions = { headers: headers };
        return this.http.put<any>(this.API_URL + 'brand/' + brandId, brand, requestOptions);
    }
    registerBrand(brand: Brand): Observable<any> {
        let auth_token = localStorage.getItem('token');
        const headers = new HttpHeaders({

            'Content-Type': 'application/json',

            'Authorization': `Bearer ${auth_token}`

        });
        const requestOptions = { headers: headers };
        return this.http.post<any>(this.API_URL + 'brand', brand, requestOptions);
    }
}
