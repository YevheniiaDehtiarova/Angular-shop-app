import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { LogginService } from '../logging.service';
import { Ingredient } from '../shared/ingredient.model';
import * as ShoppingListActions from './store/shopping-list.action';
import * as formApp from '../store/app.reducer'

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ingredients: Array<Ingredient>}>;
  /*private igChangeSub: Subscription;*/

  constructor(private logginService: LogginService,
              private store: Store<formApp.AppState>) {}

  ngOnDestroy(): void {
   /*this.igChangeSub.unsubscribe();*/
  }

  ngOnInit(): void {
    this.ingredients = this.store.select('shoppingList');
    //this.store.select('shoppingList').subscribe();
    /*this.ingredients = this.slService.getIngredients();
    this.igChangeSub = this.slService.ingredientsChanged.subscribe(
      (ingredients: Array<Ingredient>) =>{
        this.ingredients = ingredients;
      }
    )*/
    this.logginService.printLog('hello from shop list comp');
  }

  onEditItem(index: number){
    //this.slService.startedEditing.next(index);
    this.store.dispatch(new ShoppingListActions.StartEdit(index))
  }
}
