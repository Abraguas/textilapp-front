import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginDTO } from '../models/login-dto';
import { Observable } from 'rxjs';
import { ClientRegisterDTO } from '../models/client-register-dto';
import { User } from '../models/user';

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
  getRole(): Observable<string> {
    let auth_token = localStorage.getItem('token');
    const headers = new HttpHeaders({

      'Content-Type': 'application/json',

      'Authorization': `Bearer ${auth_token}`

    });
    const requestOptions = { headers: headers };
    return this.http.get<string>(`${this.API_URL}user/role`, requestOptions);
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
}
