import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StockMovement } from '../models/stock-movement';
import { StockMovementDTO } from '../models/stock-movement-dto';
import { StockMovementProdDTO } from '../models/stock-movement-prod-dto';

@Injectable()
export class StockMovementService {

    private API_URL: string = 'http://localhost:9090/stockMovement';

    constructor(private http: HttpClient) { }

    register(movement: StockMovement): Observable<any> {
        let auth_token = localStorage.getItem('token');
        const headers = new HttpHeaders({

            'Content-Type': 'application/json',

            'Authorization': `Bearer ${auth_token}`

        });
        const requestOptions = { headers: headers };
        return this.http.post<any>(this.API_URL, movement, requestOptions);
    }
    getStockByProductId(id: number): Observable<number> {
        let auth_token = localStorage.getItem('token');
        const headers = new HttpHeaders({

            'Content-Type': 'application/json',

            'Authorization': `Bearer ${auth_token}`

        });
        const requestOptions = { headers: headers };
        return this.http.get<number>(`${this.API_URL}/product/${id}`, requestOptions);
    }
    getMovementsByProductId(id: number): Observable<StockMovementDTO[]> {
        let auth_token = localStorage.getItem('token');
        const headers = new HttpHeaders({

            'Content-Type': 'application/json',

            'Authorization': `Bearer ${auth_token}`

        });
        const requestOptions = { headers: headers };
        return this.http.get<StockMovementDTO[]>(`${this.API_URL}/${id}`, requestOptions);
    }
    getAllMovements(): Observable<StockMovementProdDTO[]> {
        let auth_token = localStorage.getItem('token');
        const headers = new HttpHeaders({

            'Content-Type': 'application/json',

            'Authorization': `Bearer ${auth_token}`

        });
        const requestOptions = { headers: headers };
        return this.http.get<StockMovementProdDTO[]>(`${this.API_URL}`, requestOptions);
    }
}
