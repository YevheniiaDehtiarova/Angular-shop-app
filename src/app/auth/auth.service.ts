import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, Subject, tap, throwError } from 'rxjs';
import { User } from './user.model';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';


export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User>(null); // started value in ()
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, 
              private store: Store<fromApp.AppState>) {}

  setLogoutTimer(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(new AuthActions.Logout());
    }, expirationDuration)
  }

  clearLogoutTimer(){
    if(this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }

  /*signup(email: string, password: string): Observable<AuthResponseData> {
    return this.http
      .post<AuthResponseData>('url from firebase', {
        email: email,
        password: password,
        returnSecureToken: true,
      })
      .pipe(
        catchError(this.hadleError),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }*/

  /*login(email: string, password: string) {
  }*/

  /*autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: Date;
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      //this.user.next(loadedUser);
      this.store.dispatch(new AuthActions.AuthenticateSuccess({
        email: loadedUser.email, 
        userId: loadedUser.id, 
        token: loadedUser.token,
        expirationDate: new Date(userData._tokenExpirationDate),
      })
      );
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autologout(expirationDuration);
    }
  }*/

  /*logout() {
    this.store.dispatch(new AuthActions.Logout());
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer)
    }
    this.tokenExpirationTimer = null;
  }*/

  /*autologout(expirationDuration: number){
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }*/

  /*private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    //this.user.next(user);
      this.store.dispatch(new AuthActions.AuthenticateSuccess({
      email: email,
      userId: userId,
      token: token,
      expirationDate: expirationDate
    }))
    this.autologout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }*/

  /*private hadleError(errorRes: HttpErrorResponse) {
    let errorMsg = 'unknown error';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(() => errorMsg);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMsg = 'this email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMsg = 'This email does not exist';
        break;
      case 'INVALID_PASSWORD':
        errorMsg = 'This password is not correct';
        break;
    }
    return throwError(() => errorMsg);
  }*/
}
