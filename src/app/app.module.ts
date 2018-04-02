import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import { AppGlobals } from './app.global';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { CoolStorageModule } from 'angular2-cool-storage';
import { HttpClientModule } from '@angular/common/http';
import {HomeService} from './home/home.service';
import {RegisterService} from './login/register.service';
import {LoginService} from './login/login.service';
import {DryCleaningService} from './dry-cleaning/dry-cleaning.service';
import {LocationService} from './location-listing/location.service';
import {InfoService} from './info-page/info.service';
import {MyAccountService} from './my-account/my-account.service';
import {EnquiryService} from './enquiry/enquiry.service';
import {HomeCleaningService} from './home-cleaning/home-cleaning.service';
import { LocationListingComponent } from './location-listing/location-listing.component';
import { DryCleaningComponent } from './dry-cleaning/dry-cleaning.component';
import { HomeCleaningComponent } from './home-cleaning/home-cleaning.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorComponent } from './error/error.component';
import { OwlModule } from 'ngx-owl-carousel';
import { Ng2CarouselamosModule } from 'ng2-carouselamos';
import {ToastModule} from 'ng2-toastr/ng2-toastr';

// import { FetchLocationComponent } from './fetch-location/fetch-location.component';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PayuComponent } from './payu/payu.component';
//import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";
import { MyAccountComponent } from './my-account/my-account.component';
import { MyRefferComponent } from './my-reffer/my-reffer.component';
import { MyOrderComponent } from './my-order/my-order.component';
import { InfoPageComponent } from './info-page/info-page.component';
import { SuccessPaymentComponent } from './my-account/success-payment/success-payment.component';
import { PaymentFailureComponent } from './my-account/payment-failure/payment-failure.component';
import { EnquiryComponent } from './enquiry/enquiry.component';
import { UpdateProfileComponent } from './my-account/update-profile/update-profile.component';
import { UpdateMobileComponent } from './my-account/update-mobile/update-mobile.component';

let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("51133650885-tl4kmlt8f9r2aotmegauqof069l60hsk.apps.googleusercontent.com")
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider("Facebook-App-Id")
  }
]);
export function provideConfig() {
  return config;
}    
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    LocationListingComponent,
    DryCleaningComponent,
    HomeCleaningComponent,
    ErrorComponent,
    PayuComponent,
    MyAccountComponent,
    MyRefferComponent,
    MyOrderComponent,
    InfoPageComponent,
    SuccessPaymentComponent,
    PaymentFailureComponent,
    EnquiryComponent,
    UpdateProfileComponent,
    UpdateMobileComponent,
     
    
    
  ],
  imports: [
    
    ToastModule.forRoot(),
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    OwlModule,
    Ng2CarouselamosModule,
    AgmCoreModule.forRoot({
      
        
      apiKey: 'AIzaSyBToLOaqD4Ot7740BVsg7OO5gwI8FyTuiU',
      libraries: ["places"]
    }),
    CoolStorageModule,
    SocialLoginModule,
    
   // Ng4LoadingSpinnerModule.forRoot()
  ],
  providers: [AppGlobals,HomeService,LoginService,RegisterService,LocationService,HomeCleaningService,InfoService,EnquiryService,MyAccountService,DryCleaningService,
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
