import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { map, tap } from "rxjs";
import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";
import * as fromApp from '../store/app.reducer';
import * as RecipesAction from '../recipes/store/recipe.action';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private store: Store<fromApp.AppState>
  ) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http
      .post('url form firebase json', recipes)
      .subscribe((recipes: Array<Recipe>) => {
        console.log(recipes);
      });
  }

  fetchRecipes() {
    return this.http
      .get<Array<Recipe>>('url form firebase json')
      .pipe(
        map((recipes: Array<Recipe>) => {
          return recipes.map((recipe) => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : [],
            };
          });
        }),
        tap((recipes) => {
          this.store.dispatch(new RecipesAction.SetRecipes(recipes));
        })
      );
  }
}