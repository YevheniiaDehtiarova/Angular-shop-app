import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';

import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipeActions from '../recipes/store/recipe.action'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userSub: Subscription;
  isAuthenticated = false;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  ngOnInit(): void {
    /*this.userSub = this.authService.user.subscribe(user => {*/
    this.userSub = this.store
    .select('auth')
    .pipe(map(authState => 
      authState.user))
      .subscribe(user => {
      this.isAuthenticated = !!user;
      console.log(!!user);
    });
  }

  onSaveData(){
    //this.dataStorageService.storeRecipes();
    this.store.dispatch(new RecipeActions.StoreRecipes())
  }

  onFetchData() {
    //this.dataStorageService.fetchRecipes().subscribe();
    this.store.dispatch(new RecipeActions.FetchRecipes())
  }

  onLogout() {
    //this.authService.logout();
    this.store.dispatch(new AuthActions.Logout());
  }
}
