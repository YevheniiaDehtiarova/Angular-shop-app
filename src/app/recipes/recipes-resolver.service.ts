import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Store } from "@ngrx/store";
import { map, Observable, of, switchMap, take } from "rxjs";
import { Recipe } from "./recipe.model";
import * as fromApp from '../store/app.reducer';
import * as RecipesActions from './store/recipe.action';
import { Actions, ofType} from '@ngrx/effects'

@Injectable({providedIn: 'root'})
export class RecipesResolverService implements Resolve<Array<Recipe>>{
    constructor(private store: Store<fromApp.AppState>,
                private actions$: Actions) {}
    
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Array<Recipe> | Observable<Recipe[]> | Promise<Recipe[]> {
      return this.store.select('recipes').pipe(map(recipesState => {
        return recipesState.recipes;
      }),
      switchMap((recipes: Array<Recipe>) => {
        if(recipes.length === 0) {
          this.store.dispatch(new RecipesActions.FetchRecipes());
          return this.actions$.pipe(ofType(RecipesActions.SET_RECIPES),
                 take(1)) 
        } else {
          return of(recipes)
        }
    
      })
      );
      /*this.store.dispatch(new RecipesActions.FetchRecipes());
      return this.actions$.pipe(ofType(RecipesActions.SET_RECIPES),
             take(1))    */   
    }

}
