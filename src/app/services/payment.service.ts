import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class PaymentService {
    private API_URL: string = 'http://localhost:9090/payment';

    constructor(private http: HttpClient) { }
    getPaymentState(paymentId: number): Observable<any> {
        let auth_token = localStorage.getItem('token');
        const headers = new HttpHeaders({

            'Content-Type': 'application/json',

            'Authorization': `Bearer ${auth_token}`

        });
        const requestOptions = { headers: headers };
        return this.http.get<any>(`${this.API_URL}/${paymentId}`, requestOptions);
    }
}
