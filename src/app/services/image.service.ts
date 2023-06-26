import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class ImageService {
    private API_URL: string = 'http://localhost:9090/image';

    constructor(private http: HttpClient) { }

    save(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        let auth_token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${auth_token}`
        });
        return this.http.post<any>(this.API_URL, formData, { headers });
    }
}
