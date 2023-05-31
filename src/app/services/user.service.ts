import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginDTO } from '../models/login-dto';
import { Observable } from 'rxjs';
import { ClientRegisterDTO } from '../models/client-register-dto';
import { User } from '../models/user';
import { UserRankingDTO } from '../models/user-ranking-dto';

@Injectable()
export class UserService {

    private API_URL: string = 'http://localhost:9090/';

    constructor(private http: HttpClient) { }
    login(loginDTO: LoginDTO): Observable<any> {
        return this.http.post<any>(`${this.API_URL}authenticate`, loginDTO);
    }
    registerClient(user: ClientRegisterDTO): Observable<any> {
        return this.http.post<any>(`${this.API_URL}user/client`, user);
    }
    updateSelf(user: User): Observable<any> {
        let auth_token = localStorage.getItem('token');
        const headers = new HttpHeaders({

            'Content-Type': 'application/json',

            'Authorization': `Bearer ${auth_token}`

        });
        const requestOptions = { headers: headers };
        return this.http.put<any>(`${this.API_URL}user/self`, user, requestOptions);
    }
    getRole(): Observable<any> {
        let auth_token = localStorage.getItem('token');
        const headers = new HttpHeaders({

            'Content-Type': 'application/json',

            'Authorization': `Bearer ${auth_token}`

        });
        const requestOptions = { headers: headers };
        return this.http.get<any>(`${this.API_URL}user/role`, requestOptions);
    }
    getSelf(): Observable<User> {
        let auth_token = localStorage.getItem('token');
        const headers = new HttpHeaders({

            'Content-Type': 'application/json',

            'Authorization': `Bearer ${auth_token}`

        });
        const requestOptions = { headers: headers };
        return this.http.get<User>(`${this.API_URL}user/self`, requestOptions);
    }
    getAll(searchString: string): Observable<User[]> {
        let auth_token = localStorage.getItem('token');
        const headers = new HttpHeaders({

            'Content-Type': 'application/json',

            'Authorization': `Bearer ${auth_token}`

        });
        let params = new HttpParams();
        params = params.append('searchString', searchString);
        const requestOptions = { headers: headers, params: params };
        return this.http.get<User[]>(`${this.API_URL}user`, requestOptions);
    }
    getRanking(startDate: string, endDate: string): Observable<UserRankingDTO[]> {
        let auth_token = localStorage.getItem('token');
        const headers = new HttpHeaders({

            'Content-Type': 'application/json',

            'Authorization': `Bearer ${auth_token}`

        });
        let params = new HttpParams();
        params = params.append('startDate', startDate);
        params = params.append('endDate', endDate);
        const requestOptions = { headers: headers, params: params };
        return this.http.get<UserRankingDTO[]>(`${this.API_URL}user/ranking`, requestOptions);
    }
}
