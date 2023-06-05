import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaymentMethod } from '../models/payment-method';
import { RegisterPaymentDTO } from '../models/register-payment-dto';
import { EarningsPerMonthDTO } from '../models/earnings-per-month-dto';

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
    getTotalEarningsPerMonth(startDate: string, endDate: string): Observable<EarningsPerMonthDTO[]> {
        let auth_token = localStorage.getItem('token');
        const headers = new HttpHeaders({

            'Content-Type': 'application/json',

            'Authorization': `Bearer ${auth_token}`

        });
        let params = new HttpParams();
        params = params.append('startDate', startDate);
        params = params.append('endDate', endDate);
        const requestOptions = { headers: headers, params: params };
        return this.http.get<EarningsPerMonthDTO[]>(`${this.API_URL}/totalEarningsPerMonth`, requestOptions);
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
