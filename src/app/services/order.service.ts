import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderDTO } from '../models/order-dto';
import { Observable } from 'rxjs';

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
}
