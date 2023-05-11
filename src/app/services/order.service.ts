import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderDTO } from '../models/order-dto';
import { Observable } from 'rxjs';
import { GetOrderDTO } from '../models/get-order-dto';

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
    getMyOrders(): Observable<GetOrderDTO[]> {
        let auth_token = localStorage.getItem('token');
        const headers = new HttpHeaders({

            'Content-Type': 'application/json',

            'Authorization': `Bearer ${auth_token}`

        });
        const requestOptions = { headers: headers };
        return this.http.get<GetOrderDTO[]>(this.API_URL + '/myOrders', requestOptions);
    }
    getPendingOrders(): Observable<GetOrderDTO[]> {
        let auth_token = localStorage.getItem('token');
        const headers = new HttpHeaders({

            'Content-Type': 'application/json',

            'Authorization': `Bearer ${auth_token}`

        });
        const requestOptions = { headers: headers };
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
    getById(orderId: number): Observable<GetOrderDTO> {
        let auth_token = localStorage.getItem('token');
        const headers = new HttpHeaders({

            'Content-Type': 'application/json',

            'Authorization': `Bearer ${auth_token}`

        });
        const requestOptions = { headers: headers };
        return this.http.get<GetOrderDTO>(`${this.API_URL}/${orderId}`, requestOptions);
    }
}
