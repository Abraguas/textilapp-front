import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaymentMethod } from '../models/payment-method';
import { RegisterPaymentDTO } from '../models/register-payment-dto';

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
    getPaymentMethods(): Observable<PaymentMethod[]> {
        let auth_token = localStorage.getItem('token');
        const headers = new HttpHeaders({

            'Content-Type': 'application/json',

            'Authorization': `Bearer ${auth_token}`

        });
        const requestOptions = { headers: headers };
        return this.http.get<PaymentMethod[]>(`${this.API_URL}-method`, requestOptions);
    }
    registerPayment(body: RegisterPaymentDTO): Observable<PaymentMethod[]> {
        let auth_token = localStorage.getItem('token');
        const headers = new HttpHeaders({

            'Content-Type': 'application/json',

            'Authorization': `Bearer ${auth_token}`

        });
        const requestOptions = { headers: headers };
        return this.http.post<any>(`${this.API_URL}`, body, requestOptions);
    }
}
