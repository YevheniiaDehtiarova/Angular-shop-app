import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { map, switchMap, withLatestFrom } from "rxjs";
import { Store } from "@ngrx/store";

import { Recipe } from "../recipe.model";

import * as RecipeActions from './recipe.action';
import * as fromApp from '../../store/app.reducer'


@Injectable()
export class RecipeEffects {

  @Effect()
  fetchRecipes = this.actions$.pipe(ofType(RecipeActions.FETCH_RECIPES),
    switchMap(() => {
      return this.http.get<Array<Recipe>>('url')
    }),
    map((recipes: Array<Recipe>) => {
      return recipes.map((recipe) => {
        return {
          ...recipe,
          ingredients: recipe.ingredients ? recipe.ingredients : [],
        };
      });
    }),
    map(recipes => {
      return new RecipeActions.SetRecipes(recipes);
    }))

  @Effect({dispatch: false})
  storeRecipes = this.actions$.pipe(ofType(RecipeActions.STORE_RECIPES),
    withLatestFrom(this.store.select('recipes')),
    switchMap(([actionData, recipesState]) => {
      return this.http
        .post('url form firebase json', recipesState.recipes)
    }))


  constructor(private actions$: Actions,
              private http: HttpClient,
              private store: Store<fromApp.AppState>) { }
}