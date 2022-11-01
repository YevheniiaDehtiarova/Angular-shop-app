import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";
import { Recipe } from "./recipe.model";
import * as ShoppingListActions from '../shopping-list/store/shopping-list.action'

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>;
  private recipes: Array<Recipe> = [];
      constructor(private store: Store<{shoppingList: {ingredients: Array<Ingredient>}}>) {}

      setRecipes(recipes: Array<Recipe>){
        this.recipes = recipes;
        this.recipesChanged.next(this.recipes.slice())
      }
      
      getRecipes(){
        return this.recipes.slice();
      }

      getRecipe(index: number) {
        return this.recipes.slice()[index];
      }

      addIngredientsToShoppingList(ingredients: Array<Ingredient>){
        this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
      }

      addRecipe(recipe: Recipe) {
       this.recipes.push(recipe);
       this.recipesChanged.next(this.recipes.slice());
      }

      updateRecipe(index:number, newRecipe: Recipe){
       this.recipes[index]=newRecipe;
      }
      deleteRecipe(index: number) {
        this.recipes.splice(index,1);
        this.recipesChanged.next(this.recipes.splice(index,1))
      }
}