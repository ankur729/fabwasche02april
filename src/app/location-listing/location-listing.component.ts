import { Component, OnInit, Input,Output,EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { Payu } from './payu.model';
import SHA512 from 'sha512-es';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AppGlobals } from '../app.global';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Home } from '../home/home.model';
import {LocationService} from './location.service';
import { AuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";
declare   var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-location-listing',
  templateUrl: './location-listing.component.html',
  styleUrls: ['./location-listing.component.css']
})

export class LocationListingComponent implements OnInit {

  location: string;
  globaldata:Home;
  imgUrl_thumb:string;
  imgUrl_raw:string;
  services_arr:any;
  payu:Payu;
  is_logged_in:boolean;
  loggedInUserData:any;
  isenquiry:boolean

  @Input() services:string;
  @Output() onSwitchLocation = new EventEmitter<boolean>();

  constructor(private route: ActivatedRoute,private  router: Router,private _global: AppGlobals,
              public localStorage: CoolLocalStorage,private locationService:LocationService,location: Location,
              private authService: AuthService) { 
                
                 this.isenquiry=false;
                  
  }

  ngOnInit() {
  
    $('div').preloader();
       this.payu = Object.create(Payu.prototype);
       this.payu.key='test';
    this.location = this._global.response.city;
    this.globaldata=JSON.parse(localStorage.getItem('global'));
    this.imgUrl_thumb=this._global.imgUrl_thumb;
    this.imgUrl_raw=this._global.imgUrl_raw;
    this.services_arr=this._global.response.services;
    
   // this.services_arr=this._global.response.homedata.services;

      //console.log(localStorage.getItem('location'));
      console.log('GLOBAL 99 DATA');
      console.log( this.services_arr);
      console.log('IMAGE URL');
      console.log(this._global.imgUrl);

    

       console.log('Checking if user is logged in');
       if(this.localStorage.getObject('u_i')!=undefined){

        this.is_logged_in=true;
        this.loggedInUserData=this.localStorage.getObject('u_i');
          //consol
       }
       else{
         this.is_logged_in=false;
       }
      // console.log(this.localStorage.getObject('u_i'));
      // $(".review_slider").owlCarousel({
      //   items : 1,
      //   slideSpeed : 2000,
      // paginationSpeed : 2000,
      // autoPlay : 5000,
      // singleItem:true,
      // autoplayTimeout:2500,    
      // responsive: true,
      // responsiveRefreshRate : 200,
      // responsiveBaseWidth: window,
      // });
  }

  ngAfterViewInit(){

    
      //console.log(localStorage.getItem('global'));
     
      $(".why_jqfcntion .style").hover(function(){
        $(this).parent(".list").addClass("active");
        $(this).parent(".list").prevAll(".list").removeClass("active");
        $(this).parent(".list").nextAll(".list").removeClass("active");
      });
       //Checking if user is Logged In

  }

  ngAfterContentInit(){
    $('div').preloader('remove');
  

  }
  toggleLocation(){
    //$('div').preloader();
    // let currentUrl = this.router.url + '?';
    // console.log(currentUrl);
  //  this.router.navigate([currentUrl]);
     localStorage.removeItem('user_loc');
console.log('Toggle Location');
     this.onSwitchLocation.emit(true);
     //this.router.navigate(['/fab']);
    // routerLink="/"
   //  window.location.href = '/';
  //  $('div').preloader('remove');
  }

  onLoginRegisterClick(){

  $(".login_popup").css("display", "block");
  // $('div').preloader();
  //   setInterval(function () {
      
  // },3000); 
  //  this.spinnerService.show();
   /// $(".login_popup").css("display", "block");
//    alert('sadfs');
  }

  onServiceClick(service_id,web_banner,service_name){
    console.log('Service Clicked/.');
      console.log(service_id);
        if(service_id=='1'){
          
          this.localStorage.setItem('serviceid',service_id);
            this._global.response.web_banner= web_banner;
            this._global.response.service_name= service_name;
            this.services='home-cleaning';
            
            console.log('This is my service response');
            console.log(  this._global.response);
            
            $(".services_popup").css("display", "block");
            
            console.log('Dry Cleaning');
          }
          else if(service_id=='2'){

            this.localStorage.setItem('serviceid',service_id);
            this._global.response.web_banner= web_banner;
            this._global.response.service_name= service_name;
            this.services='dry-cleaning';
            
            console.log('This is my service response');
            console.log(  this._global.response);
            console.log('WEB BANNER');
            console.log(web_banner);
            
            $(".services_popup").css("display", "block");
            
            console.log('Dry Cleaning');
          }
          else if(service_id=='3'){
          
            this.localStorage.setItem('serviceid',service_id);
              this._global.response.web_banner= web_banner;
              this._global.response.service_name= service_name;
              this.services='home-cleaning';
              
              console.log('This is my service response');
              console.log(  this._global.response);
              
              $(".services_popup").css("display", "block");
              
              console.log('Dry Cleaning');
            }
          else if(service_id=='4'){

            this.localStorage.setItem('serviceid',service_id);
            this._global.response.web_banner= web_banner;
            this._global.response.service_name= service_name;
            this.services='home-cleaning';
            
            console.log('This is my service response');
            console.log(  this._global.response);
            
            $(".services_popup").css("display", "block");
            
            console.log('Dry Cleaning');
          }
          else if(service_id=='5'){

            this.localStorage.setItem('serviceid',service_id);
            this._global.response.web_banner= web_banner;
            this._global.response.service_name= service_name;
            this.services='home-cleaning';
            
            console.log('This is my service response');
            console.log(  this._global.response);
            
            $(".services_popup").css("display", "block");
            
            console.log('Bathroom Cleaning');
          }
          else if(service_id=='6'){

            this.localStorage.setItem('serviceid',service_id);
            this._global.response.web_banner= web_banner;
            this._global.response.service_name= service_name;
            this.services='home-cleaning';
            
            console.log('This is my service response');
            console.log(  this._global.response);
            
            $(".services_popup").css("display", "block");
            
            console.log('Bathroom Cleaning');
          }
          // else if(service_id=='6'){

          //   this.localStorage.setItem('serviceid',service_id);
          //   this._global.response.web_banner= web_banner;
          //   this._global.response.service_name= service_name;
          //   this.services='home-cleaning';
            
          //   console.log('This is my service response');
          //   console.log(  this._global.response);
            
          //   $(".services_popup").css("display", "block");
            
          //   console.log('Bathroom Cleaning');
          // }
          
          // else if(this._global.services[4].id==service_id){

          //   this.services='home-cleaning';
        
          //  $(".services_popup").css("display", "block");
          //   console.log('Home Cleaning');
          // }
      
  }


  isserviceopen(data:any){

      this.services='';
  }

  OnCallingPayu(data:any){

    console.log(' I AM CALLING');
}

  payuMethod(){

   // this.calling_payu=true;
 
    console.log(this.globaldata);
  //   this.payu.key="gtKFFx";
  //   this.payu.salt = "eCwWELxi";
  //   this.payu.txnid = '555555553543';
  //   this.payu.amount = '22';
  //   this.payu.productinfo = 'test';
  //   this.payu.firstname = 'textbox';
  //   this.payu.email = 'textemail';

  //   this.payu.surl = "http://localhost:4200";
  //   this.payu.furl = "http://localhost:4200";

  //   this.payu.phone = "7428066040";
  //   this.payu.service_provider = "payubiz";

  //   var h_string = this.payu.key + '|' + this.payu.txnid + '|' +this.payu.amount + '|' + this.payu.productinfo + '|' + this.payu.firstname + '|' + this.payu.email + '|||||||||||' + this.payu.salt;
  //   var has_final_string =SHA512.hash(h_string); 
  //   this.payu.hash = has_final_string;
    
     
  //  this.localStorage.setObject('payu',this.payu);
  //   //window.location.href = " https://test.payu.in/_payment?key="+this.payu.key+"&salt="+this.payu.salt+"&txnid="+this.payu.txnid+"&amount="+this.payu.amount+"&productinfo="+this.payu.productinfo+"&firstname="+this.payu.firstname+"&email="+this.payu.email+"&hash="+this.payu.hash+"&phone="+this.payu.phone;
  //   //this.ngZone.run(() => this.router.navigateByUrl('/payusend'))
  //   // this.router.navigate(['/payusend']);
    console.log('calling AA');
       console.log(this.localStorage.getObject('payu'));
      
  }

  isLoggedInHandler(data:any){

      console.log('LOGIN EVENT CALLED..........');
      console.log(data);
      this.localStorage.setObject('u_i',data);
      this.is_logged_in=true;
      this.loggedInUserData=this.localStorage.getObject('u_i');;
          

  }

  logout(){
 
      this.localStorage.removeItem('u_i');
      this.authService.signOut();
      this.is_logged_in=false;
      $('div').preloader();

        setTimeout(function(){ 
          
          
          $('div').preloader('remove');

            }, 1500);
  }

  onClickMyAccount(){

    console.log('My Acc');
    this.router.navigateByUrl('/my-account');
  }
 
  openEnquiryForm(){

    console.log('Open enquiry');
    this.isenquiry=true;
  }

  onCloseEnquiryHandler(data:any){

    console.log('Receiving Event');
    this.isenquiry=false;
  }
 
}
