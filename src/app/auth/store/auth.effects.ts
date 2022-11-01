import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap, tap, throwError } from "rxjs";
import { AuthResponseData, AuthService } from "../auth.service";
import { User } from "../user.model";
import * as AuthActions from './auth.actions';

const handleAuthentication = (expiresIn: number, email: string,
  userId: string, token: string) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));
  return of(
    new AuthActions.AuthenticateSuccess({
      email: email,
      userId: userId,
      token: token,
      expirationDate: expirationDate,
      redirect: true
    }),
    catchError(errorRes => {
      return handleError(errorRes);
    }))
};

const handleError = (errorRes: any) => {
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
};

@Injectable()
export class AuthEffects {

  constructor(private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService) { }

  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupAction: AuthActions.SignupStart) => {
      return this.http
        .post<AuthResponseData>('url from firebase', {
          email: signupAction.payload.email,
          password: signupAction.payload.password,
          returnSecureToken: true,
        })
        .pipe(
          tap(resData => {
            this.authService.setLogoutTimer(+resData.expiresIn)
          }),
        )
    })
  )

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http
        .post<AuthResponseData>('url', {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true,
        }).pipe(
          tap(resData => {
            this.authService.setLogoutTimer(+resData.expiresIn * 1000)
          }),
          map(resData => {
            return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken)
          }),
          catchError(errorRes => {
            return handleError(errorRes);
          })
        );
    })
  )

  @Effect({ dispatch: false })
  authRedirect = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
      if(authSuccessAction.payload.redirect) {
        this.router.navigate(['/'])
      }
    }))

  @Effect()
  autoLogin = this.actions$.pipe(ofType(AuthActions.AUTO_LOGIN),
  tap(() => {
      const userData: {
        email: string;
        id: string;
        _token: string;
        _tokenExpirationDate: Date;
      } = JSON.parse(localStorage.getItem('userData'));

      /*if (!userData) {
        return 
      }*/

      const loadedUser = new User(
        userData.email,
        userData.id,
        userData._token,
        new Date(userData._tokenExpirationDate)
      );

      if (loadedUser.token) {
        //this.user.next(loadedUser);
        const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
        this.authService.setLogoutTimer(expirationDuration);
        return new AuthActions.AuthenticateSuccess({
          email: loadedUser.email,
          userId: loadedUser.id,
          token: loadedUser.token,
          expirationDate: new Date(userData._tokenExpirationDate),
          redirect: false
        });
      }
        //const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
        //this.autologout(expirationDuration);
        return {
          type: 'SMTH'
        }
      
    }))

  @Effect()
  authLogout = this.actions$.pipe(ofType(AuthActions.LOGOUT),
    tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem('userData');
      this.router.navigate(['/auth']);
    }))


}