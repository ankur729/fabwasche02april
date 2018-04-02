import { Component, OnInit,Output,EventEmitter,ViewChild,AfterViewInit, ElementRef, NgZone,ViewContainerRef } from '@angular/core';
import { AppGlobals } from '../app.global';
import {HomeCleaningService} from './home-cleaning.service';
import {HomeCleaning} from './home-cleaning.model';
import {HomeCleaningCart} from './home-cleaning-cart.model';
import {MapsAPILoader} from '@agm/core';
import { Payu } from '../location-listing/payu.model';
import {LocationService} from '../location-listing/location.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
 
import SHA512 from 'sha512-es';
import * as _ from "lodash";
declare   var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-home-cleaning',
  templateUrl: './home-cleaning.component.html',
  styleUrls: ['./home-cleaning.component.css']
})
export class HomeCleaningComponent implements OnInit,AfterViewInit  {

  steps:string;
  tot_steps:string;
  imgUrl_raw:string;
  payu:Payu;
  called_from_service:boolean;

  homeCleaningImg:string;
  homeCleaning;
  homeCleaningCart;
  err_login:boolean;
  err_msg_login:string;
  isUnservicable:boolean;
  formatted_address:string;
  user_postal_code:string;
  time_solts:any;
  pay_mode_selected:boolean;
  selected_pay_mode:string;  // 1 for COD 2 for Online 3 for Wallet FOR PLACING ORDER
  user_email:string;
  user_mobile:string;
  //DEFINING OUR CART VARIABLES
  
  categories:any;
  cart
  packages:any;
  selectedTimeSlot:string;
  selectedDaySlot:string;
  addedInCart:any;
  search:string;
  cart_total:string;
  global:any;
  loggedInEmail:string;
  service_name:string;
  wallet_resp:any;
  wallet_amt_post:any;
  pre_order_resp:any;
  //DEFINING OUR CART VARIABLES 
 
  @Output() isserviceopen = new EventEmitter<boolean>();
 
  is_payu_call:boolean;
  serviceid=this.localStorage.getItem('serviceid');

  constructor(private _global:AppGlobals,private homeCleaningService:HomeCleaningService,
    private mapsAPILoader: MapsAPILoader, private ngZone: NgZone,  private locationService:LocationService,
     private localStorage: CoolLocalStorage,vcr: ViewContainerRef,public toastr: ToastsManager,) { 
   
    this.steps='1';
    this.global=this._global;
    this.isUnservicable=false;
    this.err_login=false;
    this.pay_mode_selected=false;
    this.wallet_amt_post=0;
    this.toastr.setRootViewContainerRef(vcr);
   
  } 

  @ViewChild('search') public searchElement: ElementRef;
  ngAfterViewInit(){
    
    
  }
  ngOnInit() {
    this.is_payu_call=false;
    this.payu = Object.create(Payu.prototype);
     //Assigning our cart.
    this.homeCleaningCart=HomeCleaningCart;
    this.homeCleaningCart.cart_total=0;
    this.service_name=this.global.response.service_name;
    
    console.log('GLOBAL DDDDDDATA RECEIVE');
    console.log(this.global);
    $('#locationView').hide();
    $('.owl-nav').removeClass('disabled');
 
    $('div').preloader();
 
     this.imgUrl_raw=this._global.imgUrl_raw;
     this.homeCleaningImg=this._global.response.web_banner;
     this.steps='2';
     console.log('This is my service id');
     
 
      this.homeCleaning=HomeCleaning;
            this.homeCleaningService.getStepOneData(this.serviceid).subscribe(
              (response)=>
                  { 
                    console.log('This is my response');
                    console.log(response);
                   
                  this.homeCleaning.step_2=response;
                  this.categories=this.homeCleaning.step_2.data;
                  console.log(this.homeCleaning.step_2);
                   
                    $('div').preloader('remove');
                
                    
                  },
              (error)=>console.log(error)
        );
    $(".services_popup").css("display", "block");
   
    this.loadMapApi();
  
  } 

  loadMapApi(){


    this.mapsAPILoader.load().then(
      () => {
        console.log('MAP API');
      let autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement, {  types: ['address'],componentRestrictions: {country: "in"} });
    
        autocomplete.addListener("place_changed", () => {
        
        $('div').preloader();

        this.ngZone.run(() => {
    
        let place: google.maps.places.PlaceResult = autocomplete.getPlace();
        console.log(place);
        if(place.geometry === undefined || place.geometry === null ){
          return;
        }
        else{
    
          for (var i = 0; i < place.address_components.length; i++) {
              for (var j = 0; j < place.address_components[i].types.length; j++) {
                if (place.address_components[i].types[j] == "postal_code") {
                    
                  this._global.response.postal_code=place.address_components[i].long_name;
                  this.user_postal_code=this._global.response.postal_code;
                } 
    
                if (place.address_components[i].types[j] == "sublocality_level_1") {
                   
                  
                  this._global.response.locality=place.address_components[i].long_name;
    
             
              }
              if (place.address_components[i].types[j] == "administrative_area_level_1") {
                 
                  
                  this._global.response.city=place.address_components[i].long_name;
    
          
              }
              }
            }
            $('#search').val(this._global.response.locality+" , "+this._global.response.postal_code);
      
        
        }
        
        
        setTimeout(() =>{ 
          
    
            this.callLocationService();
            $('div').preloader('remove');
         
              
      }
              , 1000);

          console.log('User Place');
          console.log(place);
        this.formatted_address=place.formatted_address;
      
        });
        });
      }
    );

  }
  
  autoDetectLocation(){
    
    $('div').preloader();
  
    this.getCustomerCurrentPosition().then((results) =>  {

          console.log('MY RESSS');
          console.log(results);
              this._global.response.formatted_address=results[0].formatted_address;
              this.formatted_address=results[0].formatted_address;
              this.searchElement.nativeElement.value=this._global.response.formatted_address;
             
                 for (var i=0; i< results[0].address_components.length; i++) {

                     for (var j=0;j<results[0].address_components[i].types.length;j++) {
         
                        if (results[0].address_components[i].types[j] == "postal_code") {
                            
                            this._global.response.postal_code=results[0].address_components[i].long_name;
                            this.user_postal_code=this._global.response.postal_code;
                           } 
         
                           if (results[0].address_components[i].types[j] == "sublocality_level_1") {
                             
                              
                           this._global.response.locality=results[0].address_components[i].long_name;
         
                         
                         }
                         if (results[0].address_components[i].types[j] == "administrative_area_level_1") {
                         
                              
                           this._global.response.city=results[0].address_components[i].long_name;
         
                         
                         }
                     }
                 }  
                  
                 $('#search').val(this._global.response.locality+" , "+this._global.response.postal_code);
                  
                    setTimeout(() =>{ 

                      
                      this.callLocationService();

                       $('div').preloader('remove');
                     //   this.router.navigate(['/',this._global.response.locality.replace(" ", "-")]);
                //   this.service_component=true;
                                }
                            , 1000);
                
       
    }, function(errStatus) {
        console.log(errStatus);
        
    });
   
  }

  callLocationService(){
    

    var data;
    if(this._global.response.postal_code==''){

         data="city="+this._global.response.city+"&pincode=";

    }
    else if(this._global.response.postal_code!=''){

      data="city="+this._global.response.city+"&pincode="+this._global.response.postal_code;
    }
    console.log(data);
    var city;
    this.locationService.getLocationServices(data).subscribe(

          (response)=>
              { 
                city=this._global.response.city;
                this._global.response=response;
            

              if(this._global.response.status==201){

                $('#house_no').prop("disabled", "disabled");
                $('#landmark').prop("disabled", "disabled");
               
                $("#addrNextBtn").css({"background":"#79888e"});
                this.isUnservicable=true;
                 
              }
              else if(this._global.response.status==200){

               
                this._global.response.services=this._global.response.homdata.services;
                delete  this._global.response.homdata;
                this._global.response.city=city;
                $('#house_no').removeAttr("disabled");
                $('#landmark').removeAttr("disabled");
                $("#addrNextBtn").css({"background":"#33b3e4"});
                this.isUnservicable=false;
 
              }
           
                    
              
              },
          (error)=>{
              
                $('div').preloader('remove');
               console.log('RESPONSE FAILED');console.log(error)}
      );


  }

  getCustomerCurrentPosition() {

    var geocoder = new google.maps.Geocoder();

    return new Promise(function(resolve, reject) {

    let geocoder = new google.maps.Geocoder();
    console.log(navigator.geolocation);
    navigator.geolocation.getCurrentPosition(function (p) {
    
     
     let LatLng = new google.maps.LatLng(p.coords.latitude, p.coords.longitude);


     console.log(LatLng);
     var geocoder = geocoder = new google.maps.Geocoder();
     geocoder.geocode({ 'latLng': LatLng }, function (results, status) {
     
         if (status == google.maps.GeocoderStatus.OK) {

             if(results.length>0){

                       resolve(results);
        
             }else{

                alert('GOOGLE AUTODETECTION WORK ONLY ON HTTPS SERVER..')
             }
          
         }
         
     });
      
  });
  
    });

   
}
 
  closeLoginRegisterPopup(){
    
    this.called_from_service=false;
    $(".services_popup").css("display", "none");
    $('#locationView').hide();
    this.steps='1';
    this.homeCleaning.step_2=undefined;
    this.isserviceopen.emit(false);
  }

  
  onNext(step){

   // this.steps='2';
     
    if(step=='1' || step==1){
      
  //    if(this.homeCleaning.step_2==undefined){

    //       $('div').preloader();
    //       this.homeCleaningService.getStepTwoData().subscribe(
    //         (response)=>
    //             { 
                  
    //               this.homeCleaning.step_2=response;
    //               this.categories=this.homeCleaning.step_2.data;
    //               console.log(this.homeCleaning.step_2);
                  
    //               $('div').preloader('remove');
    //               this.steps='2';
                  
    //             },
    //         (error)=>console.log(error)
    //   );

    // }
    //   console.log(this.homeCleaning.step_2==undefined);
    
    }
    else if(step=='2'){

      console.log('This si smy category id');
      console.log(this.homeCleaningCart.category_id);
      
      if(this.homeCleaningCart.category_id==undefined){

          this.err_login=true;
          this.err_msg_login="*Please select category type.!";
      }
      else{

        this.err_login=false;
        $('div').preloader();
              
        this.homeCleaningService.getStepTwoData(this.homeCleaningCart.category_id).subscribe(
                (response)=>
                    { 
                      
                      this.homeCleaning.step_3=response;

                      console.log('Step 3 resp');
                      console.log(this.homeCleaning.step_3);
                      if(this.homeCleaning.step_3.status==201){

                        alert('no package found');
                      }
                      else{

                        this.packages=this.homeCleaning.step_3.data;
                        this.homeCleaningCart.cart_info=this.packages;
                        
                        this.homeCleaningCart.cart_info =  this.homeCleaningCart.cart_info.map(
                                        data => (
                                          
                                          { 
                                            'item_id':data.id,
                                            'category_id':data.category_id,
                                            'description':data.description,
                                            'discount_per':data.discount_per,
                                            'package_name':data.package_name,
                                            'allowed_qty':data.allowed_qty,
                                            'price':data.price,
                                            'item_qty': '0',
                                            'is_added':'false',
                                            'item_total':'0',
                                            'before_discount_price':''
                                             
                                        
                                          }
                                        
                                          ));
                                          
                                          console.log('OUR CART');
                                          
                                          var discounted_amt=0.0;
                                          var final_price=0.0;
                                          var disc_per=0.0;
                                          for (var i in this.homeCleaningCart.cart_info) {
                                            
                                            discounted_amt=0.0;
                                            final_price=0.0;
                                            disc_per=0.0;
                                            this.homeCleaningCart.cart_info[i].before_discount_price=this.homeCleaningCart.cart_info[i].price;
                                            disc_per=parseInt(this.homeCleaningCart.cart_info[i].discount_per)/100;
                                           
                                            discounted_amt=parseInt(this.homeCleaningCart.cart_info[i].price)*disc_per;
                                            final_price=parseInt(this.homeCleaningCart.cart_info[i].price)-discounted_amt;
                                            
                                            this.homeCleaningCart.cart_info[i].price = final_price.toString();
                                               
                                          }
                                          this.steps='3';
                      }

                                        
                      $('div').preloader('remove');
                       
                      
                    },
                (error)=>console.log(error)
          );
    

      }
     
    } 
    else if(step=='3'){
     
      if(this.addedInCart==undefined ||  this.addedInCart.length==0){
          this.err_login=true;
          this.err_msg_login='*Please select at least one package to continue.!';
      }
      else{
        this.err_login=false;
        this.steps='4';
      } 
     
    } 
    else if(step=='4'){
      
        
      $('#locationView').show();
      this.steps='5';
                 

     
    } 
    else if(step=='5'){
    
      this.selectedDaySlot=undefined;
      this.selectedTimeSlot=undefined;

      if(this.isUnservicable){
        this.err_login=false;
      }else{

         var house_no=$('#house_no').val();
         var location=this.formatted_address;
         var landmark=$('#landmark').val();
         
         if(house_no==''){

            this.err_login=true;
            this.err_msg_login='*House no. is required.';
         }
         else if(location==''){
          this.err_login=true;
          this.err_msg_login='*Location is required.';
         }
         else if(landmark==''){
          this.err_login=true;
          this.err_msg_login='*Landmark is required.';
         }
         else{
            
            this.err_login=false;
            $('#locationView').hide();
 
            var data="pincode="+this.user_postal_code+"&service_id="+this.serviceid;
            $('div').preloader();
            this.homeCleaningService.getTimeSlots(data).subscribe(

              (response)=>
                  {
                 
                  
                  this.time_solts=response;
                  console.log(this.time_solts);
                  this.steps='6';
                  $('div').preloader('remove');
                  },
                (error)=>{
                    
                      $('div').preloader('remove');
                    console.log('RESPONSE FAILED');console.log(error)}
            );
            

         }
       
       
      }
   

      
    } 
    else if(step=='6'){
       
     
      if(this.selectedDaySlot==undefined){

            this.err_login=true;
            this.err_msg_login='Please select your preferred day slot.!';
      }
      else if(this.selectedTimeSlot==undefined){

          this.err_login=true;
          this.err_msg_login='Please select your preferred time slot.!';
      }
     else{

          this.err_login=false;
     
          if(this.localStorage.getObject('u_i')!=undefined){
            
              console.log('This is our LOCAL STORAGE..');
              console.log(this.localStorage.getObject('u_i'));
              this.homeCleaningCart.user=this.localStorage.getObject('u_i');
              this._global.user_data=this.localStorage.getObject('u_i');
            
              if(this._global.user_data.hasOwnProperty('mobile_email')){
               
                this.loggedInEmail=this._global.user_data.mobile_email;

              }else{

                this.loggedInEmail=this._global.user_data.email;
              }
              

              this.steps='7';
          }else{

            this.err_login=false;
            this.called_from_service=true;
              $(".services_popup").css("display", "none");
              $(".login_popup").css("display", "block");
           
              this.steps='7';

          }

     }
     
      
    } 
    else if(step=='7'){
     
      this.err_msg_login='*Mobile no. is required.!';
      var email=$('#email_ver').val();
      var mobile=$('#mobile_ver').val();

      this.user_email=email;
      this.user_mobile=mobile;
    
      if(this.validateVerifyLoginScreen(mobile)){
        
        $('div').preloader();

        this._global.sendOTP(mobile).subscribe(

          (response)=>
              {
              $('div').preloader('remove');
              console.log('OTP RESS');
              this.global.user_data.otp_resp=response;
              console.log(response);
              
              },
            (error)=>{
                
                  $('div').preloader('remove');
                console.log('RESPONSE FAILED');console.log(error)}
        );
        
        this.global.user_data.hidden_mobile=this.hiddenMobile(mobile);
        $('div').preloader('remove');
        this.steps='8';
      }
 //    this.steps='8';
 
      
    } 
    else if(step=='8'){

      console.log('STEP 9 CART ');
      this.err_login=false;
    
      console.log('FINALL ADDR');
    
      var otp_ver=$('#otp_ver').val();

    if(otp_ver==''){

      this.err_login=true;
      this.err_msg_login='*OTP required.!';

    }
     else if(this.global.user_data.otp_resp.otp!=otp_ver){

         this.err_login=true;
         this.err_msg_login='Invalid OTP.!';
      }
      else{

        this.steps='9';
        
      }
     
      // this.steps='9';
    } 

    else if(step=='9'){

      console.log('STEP 9 CART ');
      this.err_login=false;

      if(this.pay_mode_selected==false){

        this.err_login=true;
        this.err_msg_login='Please select your payment mode.!';
      }
      else{
          
        console.log(this.selected_pay_mode);

        // FOR COD
        if(this.selected_pay_mode=='1'){

            $('div').preloader();

        var addr={'house_no':'','location':'','landmark':''};
        addr.house_no=$('#house_no').val();
        addr.location=this.formatted_address;
        addr.landmark=$('#landmark').val();
   
       var data="user_id="+this.global.user_data.id+"&mobile="+this.user_mobile+"&email="+this.user_email+"&address="+JSON.stringify(addr)+"&wallet_amount="+this.wallet_amt_post+"&total_amount="+this.homeCleaningCart.cart_total+"&payment_mode="+this.selected_pay_mode+"&payment_amount=0&cart_data="+ JSON.stringify(this.homeCleaningCart.cart_info)+"&day_slot="+JSON.stringify(this.selectedDaySlot)+"&time_slot="+JSON.stringify(this.selectedTimeSlot);
 
                
                   this.homeCleaningService.preOrder(data).subscribe(
  
                    (response)=>
                        {
                        
                           
                          $('div').preloader('remove');
                          alert('Order successfull.!');
                          $("#payment_btn").css({"background":"#79888e"});
                        },
                      (error)=>{
                        $('div').preloader('remove');
                          console.log('RESPONSE FAILED');console.log(error)}
                  );
        }

        else if(this.selected_pay_mode=='2'){

          $('div').preloader();

          var addr={'house_no':'','location':'','landmark':''};
          addr.house_no=$('#house_no').val();
          addr.location=this.formatted_address;
          addr.landmark=$('#landmark').val();
    
          console.log('FINALL ADDR');
          console.log('FINAL EMAIL');
          console.log(this.global.user_data);
         // console.log(addr);
         var data="user_id="+this.global.user_data.id+"&mobile="+this.user_mobile+"&email="+this.user_email+"&address="+JSON.stringify(addr)+"&wallet_amount=&total_amount="+this.homeCleaningCart.cart_total+"&payment_mode="+this.selected_pay_mode+"&payment_amount=0&cart_data="+ JSON.stringify(this.homeCleaningCart.cart_info)+"&day_slot="+JSON.stringify(this.selectedDaySlot)+"&time_slot="+JSON.stringify(this.selectedTimeSlot);
    
           
                     this.homeCleaningService.preOrder(data).subscribe(
    
                      (response)=>
                          {
                          
                            console.log('This is order response');
                            console.log(response);
                            this.pre_order_resp=response;
                            console.log(this.pre_order_resp.order_id);
                            $('div').preloader('remove');
                            
                            $("#payment_btn").css({"background":"#79888e"});
                            window.location.href = 'http://idigities.com/fab/management/payment/ccavenue/'+this.pre_order_resp.order_id;
                            //this.is_payu_call=true;

                          },
                        (error)=>{
                          $('div').preloader('remove');
                            console.log('RESPONSE FAILED');console.log(error)}
                    );
           

        }

        else if(this.selected_pay_mode=='3'){

          $('div').preloader();

          var addr={'house_no':'','location':'','landmark':''};
          addr.house_no=$('#house_no').val();
          addr.location=this.formatted_address;
          addr.landmark=$('#landmark').val();
    
          console.log('FINALL ADDR');
          console.log('FINAL EMAIL');
          console.log(this.global.user_data);
         // console.log(addr);
         var data="user_id="+this.global.user_data.id+"&mobile="+this.user_mobile+"&email="+this.user_email+"&address="+JSON.stringify(addr)+"&wallet_amount=&total_amount="+this.homeCleaningCart.cart_total+"&payment_mode="+this.selected_pay_mode+"&payment_amount=0&cart_data="+ JSON.stringify(this.homeCleaningCart.cart_info)+"&day_slot="+JSON.stringify(this.selectedDaySlot)+"&time_slot="+JSON.stringify(this.selectedTimeSlot);
    
           
                     this.homeCleaningService.preOrder(data).subscribe(
    
                      (response)=>
                          {
                          
                            console.log('This is order response');
                            console.log(response);
                            this.pre_order_resp=response;
                            console.log(this.pre_order_resp.order_id);
                            $('div').preloader('remove');
                            
                            $("#payment_btn").css({"background":"#79888e"});
                            window.location.href = 'http://idigities.com/fab/management/payment/ccavenue/'+this.pre_order_resp.order_id;
                            //this.is_payu_call=true;

                          },
                        (error)=>{
                          $('div').preloader('remove');
                            console.log('RESPONSE FAILED');console.log(error)}
                    );
           


        //  window.location.href = 'http://idigities.com/fab/management/payment/ccavenue/'+this.pre_order_resp.order_id;
              
        //  alert('Under Development...');
        }

      }

      
    } 

  }

  onBack(step){

    if(step=='1'){
      this.steps='1';
    }
    else if(step=='2'){
      
     
      this.steps='2';
    } 
    else if(step=='3'){
      console.log('This is our selected cateogry');
      delete this.homeCleaningCart.category_id;
     
      this.steps='2';
    } 
    else if(step=='4'){
      this.steps='3';
    }
    else if(step=='5'){
      
      $('#locationView').hide();
      
      
      this.steps='4';
    }
    else if(step=='6'){


      $('#locationView').show();
      
      this.steps='5';
    }
    else if(step=='7'){

      this.steps='5';
      $('#locationView').show();
      
    }
    else if(step=='8'){
      this.steps='7';
    }
    else if(step=='9'){
      this.steps='7';
    }
  }

  validateVerifyLoginScreen(mobile){
      console.log(`This is Mobile ${mobile}`);
    if(mobile.length==0){
      this.err_login=true;
      this.err_msg_login='*Mobile no. is required.!';
      //this.toastr.error('*Mobile no. is required.!', 'Oops!');
      return false;
    }
   else if(isNaN(mobile) || mobile.length!=10){

      this.err_login=true;
      this.err_msg_login='Please enter valid mobile no.!';
      return false;
  }
 
  else{

    return true;
  }
 

  }

  

  hiddenMobile(mobile){

    var str1= mobile.substring(0, 2);
    var str2= mobile.substring(8,10 );
    var  moblile_hidden=str1+"xxxxxx"+str2;
    console.log('HIDDEN MOBILE');
    console.log(moblile_hidden);
     return moblile_hidden;
}

resendOTP(){
 
  var mobile=this.global.user_data.mobile;
  $('div').preloader();

  this._global.sendOTP(mobile).subscribe(

    (response)=>
        {
        $('div').preloader('remove');
        console.log('OTP RESS');
        this.global.user_data.otp_resp=response;
        console.log(response);
        this.err_login=true;
        this.err_msg_login='OTP successfully resend.!';
        
        },
      (error)=>{
          
            $('div').preloader('remove');
          console.log('RESPONSE FAILED');console.log(error)}
  );
}

  UserDataHandler(data:any){

    console.log('RECEVING EMITTTTT');
    console.log(data);
 //   console.log( this.global.user_data.email);
    this.loggedInEmail=data.mobile_email;
    this.loggedInEmail=data.email;
    this.localStorage.setObject('u_i',data);
    // if(typeof(this.global.user_data.email) !== "undefined"){

    //   this.loggedInEmail=this.global.user_data.email;
    // }
    


    // Object.create(this.global.user_data.prototype);
    //  this.global.user_data.email=data.mobile_email;
   // Object.create(Payu.prototype);
    //console.log(this.global.user_data);
   
  //  this.steps='5';
    
  }

  LoginCloseEventHandler(data:any){

 
    this.steps='5';
    $('#locationView').show();

  }
  updateCategoryId(id){

    this.homeCleaningCart.category_id=id;

    
  }


  updateCart(item_id,type){
 
     var  objIndex ;
     var qty;
     var sum;

     console.log('THIS IS OUR CART');
     console.log(this.homeCleaningCart.cart_info);

        if(type=='increase'){

          

          // WRITE QTY CHECK HERE..
          this.err_login=false;
          objIndex = this.homeCleaningCart.cart_info.findIndex((obj => obj.item_id == item_id));
          
          if(parseInt(this.homeCleaningCart.cart_info[objIndex].item_qty)==parseInt(this.homeCleaningCart.cart_info[objIndex].allowed_qty)){

            console.log('Allowed qty is-'+this.homeCleaningCart.cart_info[objIndex].item_qty);

          }
          else{ 

            qty=parseInt(this.homeCleaningCart.cart_info[objIndex].item_qty);
            this.homeCleaningCart.cart_info[objIndex].is_added = "true";
            this.homeCleaningCart.cart_info[objIndex].item_qty= (parseInt(this.homeCleaningCart.cart_info[objIndex].item_qty)+1).toString();
            this.homeCleaningCart.cart_info[objIndex].item_total= (parseFloat( this.homeCleaningCart.cart_info[objIndex].price)* parseInt(this.homeCleaningCart.cart_info[objIndex].item_qty));
  


          }
         
        }
        else if(type=='decrease'){
          
          console.log('Before Cart');
          console.log(this.homeCleaningCart.cart_info);
          objIndex = this.homeCleaningCart.cart_info.findIndex((obj => obj.item_id == item_id));
          qty=parseInt(this.homeCleaningCart.cart_info[objIndex].item_qty);
          if( qty >0){
        
       
            this.homeCleaningCart.cart_info[objIndex].item_qty= (parseInt(this.homeCleaningCart.cart_info[objIndex].item_qty)-1).toString();
            if(parseInt( this.homeCleaningCart.cart_info[objIndex].item_qty)==0){
              this.homeCleaningCart.cart_info[objIndex].is_added = "false";
  //              this.steps='3';
            }
            else{
              this.homeCleaningCart.cart_info[objIndex].is_added = "true";
            }
           
            this.homeCleaningCart.cart_info[objIndex].item_total=(parseFloat( this.homeCleaningCart.cart_info[objIndex].price)* parseInt(this.homeCleaningCart.cart_info[objIndex].item_qty));

          }
          else if(qty<1){
           
            // this.homeCleaningCart.cart_info[objIndex].is_added = "false";
            // this.homeCleaningCart.cart_info[objIndex].item_qty= '0';
            // this.homeCleaningCart.cart_info[objIndex].item_total='0';
            
            // this.steps='3';

          }
          
          console.log('After Cart');
          console.log(this.homeCleaningCart.cart_info);

        }

        this.addedInCart=this.homeCleaningCart.cart_info.filter((data) => data.is_added == 'true' );
        console.log('ADDED IN CART');
        console.log(this.addedInCart);
      
        if(this.addedInCart.length>0){

          
          sum= _.sumBy(this.addedInCart, 'item_total');
          this.cart_total=sum.toString();
          this.homeCleaningCart.cart_total=sum;

        }
        else if(this.addedInCart.length<1){

          sum=0.0;
          this.cart_total=sum.toString();
          this.homeCleaningCart.cart_total=sum;
          this.steps='3';
        }
        

 

  }

  selectTimeSlot(time){

     
    var str='#'+time.id;
     
    $('.timer.active').removeClass('active');
    $(str).addClass("active");
 
    this.selectedTimeSlot=time;
    
 

  }

  selectDaySlot(day){

    var str='#'+day.weekday;
    $('.calender.active').removeClass('active');
    $(str).addClass("active");
    this.selectedDaySlot=day;
     
  }

  selectPaymentMode(paymode){

      
      this.err_login=false;

      $('.choose_btn.active').removeClass('active');
      if(paymode=='cod'){
        
        $('#cod_btn').addClass("active");
        this.pay_mode_selected=true;
        this.selected_pay_mode='1';

        console.log('This is our cart total');
        console.log(this.homeCleaningCart.cart_total);
        console.log('This is our wallet amt post');
        console.log(parseFloat(this.wallet_amt_post));

        var w_m_post=parseFloat(this.wallet_amt_post);
        if(w_m_post>0){

          this.homeCleaningCart.cart_total=parseFloat(this.homeCleaningCart.cart_total)+parseFloat(this.wallet_amt_post);
          this.wallet_amt_post=0;
        }
     
      }
      else if(paymode=='online'){
        
        $('#online_btn').addClass("active");
        this.pay_mode_selected=true;
        this.selected_pay_mode='2';
 
      //  this.callPaymentGateway();
        
        var w_m_post=parseFloat(this.wallet_amt_post);
        if(w_m_post>0){

          this.homeCleaningCart.cart_total=parseFloat(this.homeCleaningCart.cart_total)+parseFloat(this.wallet_amt_post);
          this.wallet_amt_post=0;
        }
      
       
      }
      else if(paymode=='wallet'){

        $('div').preloader();
        $('#wallet_btn').addClass("active");
        this.pay_mode_selected=true;
        this.selected_pay_mode='3';
        console.log('Wallet Call');
        console.log(this.global.user_data.id);
        var data="customer_id="+this.global.user_data.id;
        console.log('Payment Amt');
        console.log(this.homeCleaningCart.cart_total);
        console.log(this.global);
       
        this.homeCleaningService.getCustomerWalletData(data).subscribe(
          
          (response)=>
              {
             
              
                this.wallet_resp=response;
                if(this.wallet_resp.status==201){

                  alert('Insufficient Wallet Balance');
                }
                else if(this.wallet_resp.status==200){

                  // alert('Valid Amount '+this.wallet_resp.balance);
                var deduct_amt:any=this.getPercentAmt(this.global.customer_wallet_restrict,this.homeCleaningCart.cart_total);
                var payble_amt:number=parseFloat(this.homeCleaningCart.cart_total)-parseFloat(deduct_amt);
                this.wallet_amt_post=deduct_amt;
                this.homeCleaningCart.cart_total=this.homeCleaningCart.cart_total-deduct_amt;
                console.log(deduct_amt); // This is our Wallet amount in post...
                  console.log('This is wallet amt post');
                  console.log(this.wallet_amt_post);
                //this.wallet_amt_post=
                //STEP1. IF WALLET IS INSUFFICIENT JITNE BHI H UTNE KAT KAR wallet_amt_post me set kr do
                //and then Wallet_amt_post variable minus kar do cart_total m se..then cart total updated.
                //STEP2; If Wallet is SUFFICIENT.. then deduct that amount and update kar do wallet_amt_post m
                //
                if(parseFloat(this.wallet_resp.balance)>=deduct_amt){

                    // ok now i can my update wallet_amt_post

                }
                else{

                  // take that amount and left remainig amt in wallet (apne matlab ka lelo aur baki chor do)
                  
                }
                console.log('Payble Amt');
                console.log(payble_amt);
                alert('Your Wallet Amt-'+this.wallet_resp.balance+'\n'+'Before Deduct Payble Amt-'+this.homeCleaningCart.cart_total+'\n'+'Allowed Wallet Usage %-'+this.global.customer_wallet_restrict+
                      '\n'+'After Deduct Amt-'+deduct_amt+'\n'+'Final Payble Amt-'+payble_amt);

                      window.location.href = 'http://idigities.com/fab/management/payment/ccavenue/2';
                }
              console.log(this.wallet_resp);
              //this.steps='6';
              $('div').preloader('remove');
              },
            (error)=>{
                
                  $('div').preloader('remove');
                console.log('RESPONSE FAILED');console.log(error)}
        );



      }

  }

  callPaymentGateway(){

       
        this.payu.key=this.global.payu_key;
        this.payu.salt = this.global.payu_salt;
        this.payu.txnid = '555555553543';
        this.payu.amount = this.homeCleaningCart.cart_total.toString();
        this.payu.productinfo = 'test';
        this.payu.firstname = 'textbox';
        this.payu.email = 'textemail';
    
        this.payu.surl =  this.global.payu_surl;
        this.payu.furl =  this.global.payu_furl;
    
        this.payu.phone = "7428066040";
        this.payu.service_provider = this.global.payu_service_provider;
    
        var h_string = this.payu.key + '|' + this.payu.txnid + '|' +this.payu.amount + '|' + this.payu.productinfo + '|' + this.payu.firstname + '|' + this.payu.email + '|||||||||||' + this.payu.salt;
        var has_final_string =SHA512.hash(h_string); 
        this.payu.hash = has_final_string;
        
         
       this.localStorage.setObject('payu',this.payu);
  
 
       return true;

  }

  getPercentAmt(amt,perc){

    // For example if payment amount is 900 and perc is 20 then you will get 180
    console.log('Amount');
    console.log(amt);
    console.log('Perc');
    console.log(perc);

    var perc_amt:any=(parseFloat(perc)/100).toFixed(2);

    console.log('Perc Amt');
    console.log(perc_amt);

    var perc_calc:any=parseFloat(amt)*perc_amt;

    console.log('Perc Calc');
    console.log(perc_calc);

    return parseFloat(perc_calc).toFixed(2);

  }

}


