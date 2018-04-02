import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LocationListingComponent} from './location-listing/location-listing.component';
import {ErrorComponent} from './error/error.component';
import {PayuComponent} from './payu/payu.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { HomeComponent } from './home/home.component';
import { MyOrderComponent } from './my-order/my-order.component';
import { MyRefferComponent } from './my-reffer/my-reffer.component';
import { InfoPageComponent } from './info-page/info-page.component';
import { UpdateProfileComponent } from './my-account/update-profile/update-profile.component';
import { SuccessPaymentComponent } from './my-account/success-payment/success-payment.component';
import { PaymentFailureComponent } from './my-account/payment-failure/payment-failure.component';
// import { RecipesComponent } from './recipes/recipes.component';
// import { ShoppingListComponent } from './shopping-list/shopping-list.component';
// import { RecipeStartComponent } from './recipes/recipe-start/recipe-start.component';
// import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
// import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';

const appRoutes: Routes = [
  { path: '',  

  children: [
    {
      path: '',
       
      component: HomeComponent,
    },
    {
      path: 'my-account',
      
      
      component: MyAccountComponent,
      children: [
        {
          path: '',
          
          component: MyRefferComponent,
        },
        {
          path: 'orders',
          
          component: MyOrderComponent,
        },

        {
          path: 'payment-success',
          
          component: SuccessPaymentComponent,
        },
        {
          path: 'payment-failure',
          
          component: PaymentFailureComponent,
        },
        {
          path: 'update-profile',
          
          component: UpdateProfileComponent,
        },
       
      ],
      
    },
    {

      path:'pages',
      
      children: [
        {
          path: ':seo-url',
          
          component: InfoPageComponent,
        },
      ]
    }
  
    

   
  ]

  },
  { path: 'fab', redirectTo: '/'},
  { path: 'payusend', component: PayuComponent ,pathMatch: 'full' },
  // { path: 'my-account', component: MyAccountComponent  },
  {path: '**', component:ErrorComponent}
//   { path: 'recipes', component: RecipesComponent, children: [
//     { path: '', component: RecipeStartComponent },
//     { path: 'new', component: RecipeEditComponent },
//     { path: ':id', component: RecipeDetailComponent },
//     { path: ':id/edit', component: RecipeEditComponent },
//   ] },
//   { path: 'shopping-list', component: ShoppingListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
