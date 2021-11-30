import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';
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
    private loaderService: LoaderService) { }

  login(email: string, password: string): Observable<User|null> {
    // 1. A faire : Faire un appel au backend.
    // 2. A faire : Mettre à jour l’état en fonction de la réponse du backend.
    // 3. A faire : Retournez la réponse du backend sous la forme d’un Observable,
    //    pour le composant qui déclenche cette action.
    const url = `${environment.firebase.auth.baseURL}/verifyPassword?key=
                 ${environment.firebase.apiKey}`;
    const data = {
      email: email,
      password: password,
      returnSecureToken: true
    };
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
    
    return this.http.post<User>(url, data, httpOptions);
    // Simple code pour calmer votre IDE.
    // Retourne un Observable contenant un utilisateur,
    // grâce à l’opérateur of de RxJS.
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
      ${environment.firebase.auth.baseURL}/signupNewUser?key=
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
        return this.usersService.save(user, jwt);
      }),
      tap(user => this.user.next(user)),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }


    logout() {
      return of(null);
    }
}
