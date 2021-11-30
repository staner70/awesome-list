import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  save(user: User, jwt: string): Observable<User|null> {
    const url = `
      ${environment.firebase.firestore.baseURL}/users?key=
      ${environment.firebase.apiKey}&documentId=${user.id}
    `;

    const data = this.getDataForFirestore(user);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      })
    };

    return this.http.post(url, data, httpOptions).pipe(
      switchMap((data: any) => {
        return of(this.getUserFromFirestore(data.fields));
        })
    );
  }

  private getUserFromFirestore(fields: any): User {
    return new User({
      id: fields.id.stringValue,
      email: fields.email.stringValue,
      pomodoroDuration: fields.pomodoroDuration.integerValue,
      name: fields.name.stringValue,
      avatar: fields.avatar.stringValue,    
    });
  }
  
  private getDataForFirestore(user: User): Object {
    return {
      fields: {
        id: { stringValue: user.id },
        email: { stringValue: user.email },
        pomodoroDuration: { integerValue: user.pomodoroDuration },
        name: { stringValue: user.name },
        avatar: { stringValue: user.avatar }
      }
    };
  }
  
}