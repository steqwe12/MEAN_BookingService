import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private apiUrl = 'http://localhost:4000/api/send-email';

  constructor(private http: HttpClient) {}

  sendEmail(to: string, subject: string, text: string): Observable<any> {
    const emailData = { to, subject, text };
    return this.http.post<any>(this.apiUrl, emailData);
  }
}
