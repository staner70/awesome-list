import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, delay, finalize, switchMap, tap } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user';
import { environment } from 'src/environments/environment';
import { ErrorService } from './error.service';
import { LoaderService } from './loader.service';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user: BehaviorSubject<User|null> = new BehaviorSubject<User|null>(null);
  readonly user$: Observable<User|null> = this.user.asObservable();

  constructor(
    private http: HttpClient, 
    private usersService: UsersService, 
    private errorService: ErrorService,
    private loaderService: LoaderService,
    private router: Router) { }

  public login(email: string, password: string): Observable<User|null> {
    const url = `${environment.firebase.auth.baseURL}:signInWithPassword?key=
                 ${environment.firebase.apiKey}`;
    const data = {
      email: email,
      password: password,
      returnSecureToken: true
    };
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    this.loaderService.setLoading(true);
    return this.http.post(url, data, httpOptions).pipe(
      switchMap((data: any) => {
        const jwt: string = data.idToken;
        const userId: string = data.localId;
        this.saveAuthData(userId, jwt);
        return this.usersService.get(userId, jwt);
      }),
      tap(user => this.user.next(user)),
      tap(_ => this.logoutTimer(3600)),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );

  }

  submit() {
  //   this.authService.login('John', 'Doe').subscribe(user => {
  //    this.user = user;
  //    // Effectuer une autre action, avec l’utilisateur venant de s’inscrire.
  //   });
  }

   register(name: string, email: string, password: string): Observable<User|null> {
    // const API_KEY: string = 'AIzaSyAaicRMXm1VpkyiJdLPJ4Fb2IUu03ofhA0';
    // const API_AUTH_BASEURL: string = `https://www.googleapis.com/identitytoolkit/v3/relyingparty`;
    const url = `
      ${environment.firebase.auth.baseURL}:signUp?key=
      ${environment.firebase.apiKey}
    `
    
    const data = {
      email: email,
      password: password,
      returnSecureToken: true
    };

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    this.loaderService.setLoading(true);

    return this.http.post(url, data, httpOptions).pipe(
      switchMap((data: any) => {
        const jwt: string = data.idToken;
        const user = new User({
          email: data.email,
          id: data.localId,
          name: name,
        });
        this.saveAuthData(data.localId, jwt);
        return this.usersService.save(user, jwt);
      }),
      tap(user => this.user.next(user)),
      tap(_ => this.logoutTimer(3600)),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  private logoutTimer(expirationTime: number): void {
    of(true).pipe(
      delay(expirationTime * 1000),
    ).subscribe(_ => this.logout());
  }

  logout(): void {
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.user.next(null);
    this.router.navigate(['/login']);
  }
  
  private saveAuthData(userId: string, token: string) {
    const now = new Date();
    const expirationDate = (now.getTime() + 3600 * 1000).toString();
    localStorage.setItem('expirationDate', expirationDate)
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
  }

  autoLogin(user: User) {
    this.user.next(user);
    this.router.navigate(['app/dashboard'])
  }
}
