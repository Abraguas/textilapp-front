import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderDTO } from '../models/order-dto';
import { Observable } from 'rxjs';
import { GetOrderDTO } from '../models/get-order-dto';
import { OrderState } from '../models/order-state';
import { HighestSellingProductDTO } from '../models/highest-selling-product-dto';

@Injectable()
export class OrderService {
    private API_URL: string = 'http://localhost:9090/order';

    constructor(private http: HttpClient) { }
    save(orderDTO: OrderDTO): Observable<any> {
        let auth_token = localStorage.getItem('token');
        const headers = new HttpHeaders({

            'Content-Type': 'application/json',

            'Authorization': `Bearer ${auth_token}`

        });
        const requestOptions = { headers: headers };
        return this.http.post<any>(this.API_URL, orderDTO, requestOptions);
    }
    getMyOrders(pageNum: number, pageSize: number): Observable<any> {
        let auth_token = localStorage.getItem('token');
        const headers = new HttpHeaders({

            'Content-Type': 'application/json',

            'Authorization': `Bearer ${auth_token}`

        });
        let params = new HttpParams();
        params = params.append('pageNum', pageNum);
        params = params.append('pageSize', pageSize);
        const requestOptions = { headers: headers, params: params };
        return this.http.get<any>(this.API_URL + '/myOrders', requestOptions);
    }
    getPendingOrders(pageNum: number, pageSize: number, searchString: string): Observable<GetOrderDTO[]> {
        let auth_token = localStorage.getItem('token');
        const headers = new HttpHeaders({

            'Content-Type': 'application/json',

            'Authorization': `Bearer ${auth_token}`

        });
        let params = new HttpParams();
        params = params.append('pageNum', pageNum);
        params = params.append('pageSize', pageSize);
        params = params.append('searchString', searchString);
        const requestOptions = { headers: headers, params: params };
        return this.http.get<GetOrderDTO[]>(this.API_URL + '/pending', requestOptions);
    }
    cancelOrder(orderId: number): Observable<any> {
        let auth_token = localStorage.getItem('token');
        const headers = new HttpHeaders({

            'Content-Type': 'application/json',

            'Authorization': `Bearer ${auth_token}`

        });
        const requestOptions = { headers: headers };
        return this.http.put<any>(`${this.API_URL}/cancel/${orderId}`, {}, requestOptions);
    }
    updateOrderState(orderId: number, state: OrderState): Observable<any> {
        let auth_token = localStorage.getItem('token');
        const headers = new HttpHeaders({

            'Content-Type': 'application/json',

            'Authorization': `Bearer ${auth_token}`

        });
        const requestOptions = { headers: headers };
        return this.http.put<any>(`${this.API_URL}/state/${orderId}`, state, requestOptions);
    }
    getById(orderId: number): Observable<GetOrderDTO> {
        let auth_token = localStorage.getItem('token');
        const headers = new HttpHeaders({

            'Content-Type': 'application/json',

            'Authorization': `Bearer ${auth_token}`

        });
        const requestOptions = { headers: headers };
        return this.http.get<GetOrderDTO>(`${this.API_URL}/${orderId}`, requestOptions);
    }
    getHighestSellingProducts(startDate: string, endDate: string): Observable<HighestSellingProductDTO[]> {
        let auth_token = localStorage.getItem('token');
        const headers = new HttpHeaders({

            'Content-Type': 'application/json',

            'Authorization': `Bearer ${auth_token}`

        });
        let params = new HttpParams();
        params = params.append('startDate', startDate);
        params = params.append('endDate', endDate);
        const requestOptions = { headers: headers, params: params };
        return this.http.get<HighestSellingProductDTO[]>(`${this.API_URL}/highestSellingProducts`, requestOptions);
    }
    getAllPaginated(pageNum: number, pageSize: number, searchString: string): Observable<any> {
        let auth_token = localStorage.getItem('token');
        const headers = new HttpHeaders({

            'Content-Type': 'application/json',

            'Authorization': `Bearer ${auth_token}`

        });
        let params = new HttpParams();
        params = params.append('pageNum', pageNum);
        params = params.append('pageSize', pageSize);
        params = params.append('searchString', searchString);
        const requestOptions = { headers: headers, params: params };
        return this.http.get<any>(`${this.API_URL}`, requestOptions);
    }
}
