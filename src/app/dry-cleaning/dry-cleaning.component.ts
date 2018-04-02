import { Component, OnInit,Input,Output,EventEmitter,ViewChild,ElementRef,NgZone } from '@angular/core';
import { DryCleaningService} from './dry-cleaning.service';
import { Router } from '@angular/router';
import {MapsAPILoader} from '@agm/core';
import { AppGlobals } from '../app.global';
import {LocationService} from '../location-listing/location.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import {HomeCleaningCart} from '../home-cleaning/home-cleaning-cart.model';
import {HomeCleaningService} from '../home-cleaning/home-cleaning.service';
import * as _ from "lodash";
declare   var jquery:any;
declare var $ :any;
@Component({
  selector: 'app-dry-cleaning',
  templateUrl: './dry-cleaning.component.html',
  styleUrls: ['./dry-cleaning.component.css']
})
export class DryCleaningComponent implements OnInit {
  
  steps:string;
  tot_steps:string;
  selected_package:string; //1 for regular and 2 for monthly
  selected_tab:string;// for selecting men , women, child , household etc..
  selected_delivery_option:string; //1 for regular and 2 for express delivery..
  addedInCart:any;
  received_package_list:any;
  show_package_on_tab:any;
  err:boolean;
  err_msg:string;
  isUnservicable:boolean;
  dry_clean_cart:any;
  cart_total:string;
  checkout_cart:any;
  show_package_on_checkout_tab:any;
  cart_count:number;
  user_postal_code:string;
  formatted_address:string;
  time_solts:any;
  selectedTimeSlot:string;
  selectedDaySlot:string;
  loggedInEmail:string;
  called_from_service:boolean;
  serviceid:string;
  imgUrl_raw:string;
  homeCleaningImg:string;
  user_email:string;
  user_mobile:string;
  global:any;
  pay_mode_selected:boolean;
  selected_pay_mode:string;  // 1 for COD 2 for Online 3 for Wallet FOR PLACING ORDER
  wallet_amt_post:any;
  wallet_resp:any;
  homeCleaningCart;
  pre_order_resp:any;
  service_name:string;
  monthly_services:any;
  selected_monthly_service:any;

  @Input('services') services: string;
  @Output() isserviceopen = new EventEmitter<boolean>();

  constructor(private  router: Router,private dryCleaningService:DryCleaningService,
    private mapsAPILoader: MapsAPILoader, private ngZone: NgZone,private _global:AppGlobals,
    private locationService:LocationService,private localStorage: CoolLocalStorage,
    private homeCleaningService:HomeCleaningService,) {

    this.err=false;
    this.dry_clean_cart=[];
    this.isUnservicable=false;
    this.serviceid='2';
    this.global=this._global;
    this.pay_mode_selected=false;
   }
   
   closeLoginRegisterPopup(){
 
    // $(".design_box").css("display", "none");
    // $(".services_popup").css("display", "none");
   this.isserviceopen.emit(false);
    this.steps='1';
  }
  @ViewChild('search') public searchElement: ElementRef;
  ngOnInit() {

    console.log('ACCEPTING SERVICE');
    this.steps='1';
    $(".services_popup").css("display", "block");
    console.log(this.services);  
    this.homeCleaningCart=HomeCleaningCart;
    this.homeCleaningCart.cart_total=0;
    this.wallet_amt_post=0;
    this.service_name=this.global.response.service_name;
    $('#locationView').hide();
    this.imgUrl_raw=this._global.imgUrl_raw;
    this.homeCleaningImg=this._global.response.web_banner;
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
    
    if(this.selected_package=='2'){

      this.steps='2_3';

    }
    if(this.selected_package=='1'){

      this.steps='1_8';
    }

    // Object.create(this.global.user_data.prototype);
    //  this.global.user_data.email=data.mobile_email;
   // Object.create(Payu.prototype);
    //console.log(this.global.user_data);
   
   // this.steps='1_8';
    
  }
  LoginCloseEventHandler(data:any){

    console.log('Closing Popup');
    console.log(this.selected_package);

    if(this.selected_package=='2'){

      this.steps='2_2';
    }
    if(this.selected_package=='1'){

      this.steps='1_6';
    }
    
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
 
  onNext(step){

   // this.steps='2';
   console.log('This is current steps');
   console.log(this.steps);
     console.log(step);
    if(step=='1' || step==1){

      console.log(this.selected_package);
      if(this.selected_package=='' || this.selected_package==undefined){

        this.err=true;
        this.err_msg='*Please choose your package.!';
      }
      else{
        
        this.err=false;
        if(this.selected_package=='1'){

            this.steps='1_2';
        }
        else if(this.selected_package=='2'){

          //  this.steps='2_2';
          $('div').preloader();
            this.dryCleaningService.getMonthlyPackages().subscribe(

              (response)=>
                  {
                    console.log(response);
                    var dt:any=response;
                    this.monthly_services=dt.data;
                    this.steps='2_2';
                  // var dt:any=response;
                  // this.received_package_list=dt.data;
                
                  //   // OUR SUPER COOL MAPPER....
      
                  //  this.mapOurPackage();
                    
       
                  // this.show_package_on_tab=this.received_package_list[0];
                  // setTimeout(()=>{
                    
                  //   var str='#'+this.received_package_list[0].category_name;
                  //   console.log(str);
                  //   $('.list.active').removeClass('active');
                  //   $(str).addClass("active");
                  
                  // }, 200);
               
                  // console.log(this.received_package_list);
                  // this.steps='1_4';
                  $('div').preloader('remove');
                  },
                (error)=>{
                    
                      $('div').preloader('remove');
                    console.log('RESPONSE FAILED');console.log(error)}
            );

        } 
        
      }
     // this.steps='2';
    }
    else if(step=='1_2'){
      this.steps='1_3';
    } 

    else if(step=='1_3'){

      var data="service_id=2&delivery_option="+this.selected_delivery_option;
      console.log('Before data');
      console.log(data);
      $('div').preloader();
      this.dryCleaningService.getPackagesByDeliveryOptions(data).subscribe(

        (response)=>
            {
           
            var dt:any=response;
            this.received_package_list=dt.data;
          
              // OUR SUPER COOL MAPPER....

             this.mapOurPackage();
              
 
            this.show_package_on_tab=this.received_package_list[0];
            setTimeout(()=>{
              
              var str='#'+this.received_package_list[0].category_name;
              console.log(str);
              $('.list.active').removeClass('active');
              $(str).addClass("active");
            
            }, 200);
         
            console.log(this.received_package_list);
            this.steps='1_4';
            $('div').preloader('remove');
            },
          (error)=>{
              
                $('div').preloader('remove');
              console.log('RESPONSE FAILED');console.log(error)}
      );
     // this.steps='1_4';
    } 
    else if(step=='1_4'){

      console.log('STEP 5--------->');

      
      //this.dry_clean_cart.push(this.received_package_list[k].packages.filter((data) => data.id == item_id ));      
      this.checkout_cart=this.received_package_list.filter((obj) => {
        for (let i = 0; i< obj.packages.length;  i++) {
          if (obj.packages[i].is_added === "true") {
            return obj.category_name;
          }
        }
      });
      this.show_package_on_checkout_tab=this.checkout_cart[0];
      var count=0;
       var tot=0;
       if(this.checkout_cart !=undefined){

        if(this.checkout_cart.length>0){

            for(var s=0;s<this.checkout_cart.length;s++){

              for(var m=0;m<this.checkout_cart[s].packages.length;m++){

                 if(this.checkout_cart[s].packages[m].is_added=="true"){
                  tot=tot+this.checkout_cart[s].packages[m].item_total;
                  count++;
                 }
              }
          //    this.addedInCart=this.checkout_cart[k].packages.filter((data) => data.is_added == 'true' );
            }
         
         console.log('ADDED IN CART 5656');
         console.log(this.addedInCart);
     
          this.cart_total=tot.toFixed(2);
          this.cart_count=count;
          console.log('TOTAL CART COUNT..');
          console.log( this.cart_total);
          console.log('This is TOTAL AMOUNT');
          console.log(this.cart_count);
       
            
       }

       }
      setTimeout(()=>{
              
        var str='#'+this.checkout_cart[0].category_name;
        console.log(str);
        $('.list.active').removeClass('active');
        $(str).addClass("active");
      
      }, 200);
      console.log(this.checkout_cart);
      this.steps='1_5';


    }

    else if(step=='1_5'){
     
      $('#locationView').show();
       
      this.steps='1_6';
    }
    else if(step=='1_6'){

      // $(".services_popup").css("display", "none");
      // $(".login_popup").css("display", "block");

      this.selectedDaySlot=undefined;
      this.selectedTimeSlot=undefined;

      if(this.isUnservicable){
        this.err=false;
      }else{

         var house_no=$('#house_no').val();
         var location=this.formatted_address;
         var landmark=$('#landmark').val();
         
         if(house_no==''){

            this.err=true;
            this.err_msg='*House no. is required.';
         }
         else if(location==''){
          this.err=true;
          this.err_msg='*Location is required.';
         }
         else if(landmark==''){
          this.err=true;
          this.err_msg='*Landmark is required.';
         }
         else{
            
            this.err=false;
            $('#locationView').hide();
 
            var data="pincode="+this.user_postal_code+"&service_id="+this.serviceid;
            $('div').preloader();
            this.dryCleaningService.getTimeSlots(data).subscribe(

              (response)=>
                  {
                 
                  
                  this.time_solts=response;
                  console.log(this.time_solts);
                  this.steps='1_7';
                  $('div').preloader('remove');
                  },
                (error)=>{
                    
                      $('div').preloader('remove');
                    console.log('RESPONSE FAILED');console.log(error)}
            );
            

         }
       
       
      }
   
      
    }

    else if(step=='1_7'){


      if(this.selectedDaySlot==undefined){

        this.err=true;
        this.err_msg='Please select your preferred day slot.!';
  }
  else if(this.selectedTimeSlot==undefined){

      this.err=true;
      this.err_msg='Please select your preferred time slot.!';
      
  }
 else{

      this.err=false;
 
      if(this.localStorage.getObject('u_i')!=undefined){
        
          console.log('This is our LOCAL STORAGE..');
          console.log(this.localStorage.getObject('u_i'));
     //     this.homeCleaningCart.user=this.localStorage.getObject('u_i');
          this._global.user_data=this.localStorage.getObject('u_i');
        
          if(this._global.user_data.hasOwnProperty('mobile_email')){
           
            this.loggedInEmail=this._global.user_data.mobile_email;

          }else{

            this.loggedInEmail=this._global.user_data.email;
          }
          

          this.steps='1_8';
      }else{

        this.err=false;
        this.called_from_service=true;
          $(".services_popup").css("display", "none");
          $(".login_popup").css("display", "block");
       
          this.steps='1_7';

      }

    }

 }

    else if(step=='1_8'){

      this.err_msg='*Mobile no. is required.!';
    
      var email=$('#email_ver').val();
      var mobile=$('#mobile_ver').val();

      this.user_email=email;
      this.user_mobile=mobile;
    
      if(this.validateVerifyLoginScreen(mobile)){
    
        $('div').preloader();
        var m=parseInt(mobile);
        this._global.sendOTP(m).subscribe(

          (response)=>
              {
            
              $('div').preloader('remove');
              console.log('OTP RESS');
              this.global.user_data.otp_resp=response;
             
              },
            (error)=>{
                
              $('div').preloader('remove');
              console.log('RESPONSE FAILED');console.log(error)

              }
        );
        
         
        this.global.user_data.hidden_mobile=this.hiddenMobile(mobile);
        $('div').preloader('remove');
        this.steps='1_9';
        
      }
    }

    else if(step=='1_9'){


      console.log('STEP 9 CART ');
      this.err=false;
    
      console.log('FINALL ADDR');
    
      var otp_ver=$('#otp_ver').val();

    if(otp_ver==''){

      this.err=true;
      this.err_msg='*OTP required.!';

    }
     else if(this.global.user_data.otp_resp.otp!=otp_ver){

         this.err=true;
         this.err_msg='Invalid OTP.!';
      }
      else{

        var temp_arr=[];
        var sum;
  
        if(this.checkout_cart.length>0){
  
          for(var i=0;i<this.checkout_cart.length;i++){
  
            for(var j=0;j<this.checkout_cart[i].packages.length;j++){
  
              if(this.checkout_cart[i].packages[j].is_added=="true"){

                temp_arr.push(this.checkout_cart[i].packages[j]);
                
              }
            }
          }
        }
  
        sum= _.sumBy(temp_arr, function(o) { return o.item_total; });
        sum=sum.toFixed(2);
    
         this.cart_total=sum.toString();
         this.homeCleaningCart.cart_total=sum;
         this.homeCleaningCart.cart_info=temp_arr;
         this.steps='1_10';
        
      }
    }
    else if(step=='1_10'){

      this.err=false;

      if(this.pay_mode_selected==false){

        this.err=true;
        this.err_msg='Please select your payment mode.!';
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
 
        console.log('Our Final String') ;
        console.log(data);
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

    else if(step=='2_2'){

       
      if(this.selected_monthly_service==undefined){

        this.err=true;
        this.err_msg='Please select atleast one package to continue.!';
      }
      else{
        
        this.err=false;
        if(this.localStorage.getObject('u_i')!=undefined){
            
          console.log('This is our LOCAL STORAGE..');
          console.log(this.localStorage.getObject('u_i'));
    //     this.homeCleaningCart.user=this.localStorage.getObject('u_i');
          this._global.user_data=this.localStorage.getObject('u_i');
        
          if(this._global.user_data.hasOwnProperty('mobile_email')){
          
            this.loggedInEmail=this._global.user_data.mobile_email;

          }else{

            this.loggedInEmail=this._global.user_data.email;
          }
          

          this.steps='2_3';
      }else{

        this.err=false;
        this.called_from_service=true;
          $(".services_popup").css("display", "none");
          $(".login_popup").css("display", "block");
      
          this.steps='2_3';

      }

      }

     

    }

    else if(step=='2_3'){

  //    this.steps='2_4';
      console.log('Inside 2_3');
      this.err_msg='*Mobile no. is required.!';
      var email=$('#email_monthly_ver').val();
      var mobile=$('#mobile_monthly_ver').val();

      this.user_email=email;
      this.user_mobile=mobile;
    
      if(this.validateVerifyLoginScreen(mobile)){
        console.log('I M VALID..');
        $('div').preloader();
        var m=parseInt(mobile);
        this._global.sendOTP(m).subscribe(

          (response)=>
              {
                console.log('INSIDE TRUE OTP');
                console.log(response);
              $('div').preloader('remove');
              console.log('OTP RESS');
              this.global.user_data.otp_resp=response;
             
              
              },
            (error)=>{
                
                  $('div').preloader('remove');
                console.log('RESPONSE FAILED');console.log(error)}
        );
        
         
        this.global.user_data.hidden_mobile=this.hiddenMobile(mobile);
        $('div').preloader('remove');
        this.steps='2_4';
      }
    }

    else if(step=='2_4'){
     // this.steps='2_5';
      this.err=false;
    
      console.log('FINALL ADDR');
    
      var otp_ver=$('#otp_monthly_ver').val();

    if(otp_ver==''){

      this.err=true;
      this.err_msg='*OTP required.!';
    
    }
     else if(this.global.user_data.otp_resp.otp!=otp_ver){

         this.err=true;
         this.err_msg='Invalid OTP.!';
      }
      else{

        console.log('OTP VALID.!');
        console.log("This is SELECTED SERVICE");
        
        console.log(this.selected_monthly_service);
        var temp_arr=[];
        var sum;
        temp_arr.push(this.selected_monthly_service);
 
        console.log("This is our final AFTER cart");
        console.log(temp_arr);
       // this.steps='1_10';
        sum= _.sumBy(temp_arr, function(o) { return parseFloat(o.package_price); });
        sum=sum.toFixed(2);
  
        console.log('This is total amt.');
        console.log(sum);
  
         this.cart_total=sum.toString();
         this.homeCleaningCart.cart_total=sum;
         this.homeCleaningCart.cart_info=temp_arr;
          this.steps='2_5';
        
      }


    }
    else if(step=='2_5'){

      console.log(this.selected_pay_mode);
      console.log(this.selected_monthly_service);
      // FOR COD
      if(this.selected_pay_mode=='1'){

          $('div').preloader();

 
     var data="user_id="+this.global.user_data.id+"&package_id="+this.selected_monthly_service.id+"&package_kg="+this.selected_monthly_service.package_kg+"&package_price="+this.selected_monthly_service.package_price+"&package_data="+JSON.stringify(this.selected_monthly_service)+"&wallet_amount="+this.wallet_amt_post+"&total_amount="+this.homeCleaningCart.cart_total+"&payment_mode="+this.selected_pay_mode+"&payment_amount=0";

      console.log('Our Final String') ;
       console.log(data);
       
                 this.dryCleaningService.preOrder(data).subscribe(

                  (response)=>
                      {
                      
                         
                        $('div').preloader('remove');
                        alert('Order successfull.!');
                        $("#payment_btn").css({"background":"#79888e"});
                        console.log('This is after order response');
                        console.log(response);
                        
                      },
                    (error)=>{
                      $('div').preloader('remove');
                        console.log('RESPONSE FAILED');console.log(error)}
                );
      }

      else if(this.selected_pay_mode=='2'){

        $('div').preloader();
   
 
       var data="user_id="+this.global.user_data.id+"&package_id="+this.selected_monthly_service.id+"&package_kg="+this.selected_monthly_service.package_kg+"&package_price="+this.selected_monthly_service.package_price+"&package_data="+JSON.stringify(this.selected_monthly_service)+"&wallet_amount="+this.wallet_amt_post+"&total_amount="+this.homeCleaningCart.cart_total+"&payment_mode="+this.selected_pay_mode+"&payment_amount=0";

         
                   this.dryCleaningService.preOrder(data).subscribe(
  
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

       
       var data="user_id="+this.global.user_data.id+"&package_id="+this.selected_monthly_service.id+"&package_kg="+this.selected_monthly_service.package_kg+"&package_price="+this.selected_monthly_service.package_price+"&package_data="+JSON.stringify(this.selected_monthly_service)+"&wallet_amount="+this.wallet_amt_post+"&total_amount="+this.homeCleaningCart.cart_total+"&payment_mode="+this.selected_pay_mode+"&payment_amount=0";
    
                   this.dryCleaningService.preOrder(data).subscribe(
  
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

    else if(step=='2'){
      this.steps='3';
    } 
    else if(step=='3'){
      this.steps='4';
    } 
    else if(step=='4'){
      this.steps='5';
    } 
    else if(step=='5'){
      this.steps='6';
    } 
    else if(step=='6'){
      this.steps='7';
    } 
    else if(step=='7'){
      this.steps='8';
    } 
    else if(step=='8'){
      this.steps='9';
    } 
    else if(step=='9'){
      this.steps='10';
    } 
    else if(step=='10'){
      //this.steps='6';
    } 

  }

  onBack(step){

    if(step=='1'){
      console.log(this.services);
      //this.services='home-cleaning';
      this.steps='1';
    }
    else if(step=='1_2'){
      this.steps='1';
    } 
    else if(step=='1_3'){
      this.steps='1_2';
    }
    else if(step=='1_4'){
      this.steps='1_3';
    }
    else if(step=='1_5'){
      setTimeout(()=>{
              
        var str='#'+this.checkout_cart[0].category_name;
        console.log(str);
        $('.list.active').removeClass('active');
        $(str).addClass("active");
      
      }, 200);
      this.steps='1_4';
    }
    else if(step=='1_6'){

      this.steps='1_5';
    } 
    else if(step=='1_7'){
     
      $('#locationView').show();
      this.steps='1_6';
    } 
    else if(step=='1_8'){

      this.steps='1_7';
    } 
    else if(step=='1_9'){

      this.steps='1_8';

    } 
    else if(step=='1_10'){

      this.steps='1_8';
    } 
    else if(step=='2_2'){
      console.log('This is step---'+step);
      this.steps='1';
    } 
    else if(step=='2_3'){
      console.log('This is step---'+step);
      this.steps='2_2';
    } 
    else if(step=='2_4'){
      console.log('This is step---'+step);
      this.steps='2_2';
    } 
    else if(step=='2_5'){
      console.log('This is step---'+step);
      this.steps='2_3';
    } 
    else if(step=='2'){
      this.steps='1';
    } 
    else if(step=='3'){
      this.steps='2';
    } 
    else if(step=='4'){
      this.steps='3';
    }
    else if(step=='5'){
      this.steps='4';
    }
    else if(step=='6'){
      this.steps='5';
    }
    else if(step=='7'){
      this.steps='6';
    }
    else if(step=='8'){
      this.steps='7';
    }
    else if(step=='9'){
      this.steps='8';
    }
    else if(step=='10'){
      this.steps='9';
    }


  }

  selectPaymentMode(paymode){

      
    this.err=false;

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

                  //  window.location.href = 'http://idigities.com/fab/management/payment/ccavenue/2';
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
  validateVerifyLoginScreen(mobile){
    console.log(`This is Mobile ${mobile}`);
      if(mobile.length==0){
        this.err=true;
        this.err_msg='*Mobile no. is required.!';
        //this.toastr.error('*Mobile no. is required.!', 'Oops!');
        return false;
      }
    else if(isNaN(mobile) || mobile.length!=10){

        this.err=true;
        this.err_msg='Please enter valid mobile no.!';
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
      this.err=true;
      this.err_msg='OTP successfully resend.!';
      
      },
    (error)=>{
        
          $('div').preloader('remove');
        console.log('RESPONSE FAILED');console.log(error)}
);
}


  selectPackage(selected_package){

    this.selected_package=selected_package;
    console.log(selected_package);
  }

  selectDeliveryOption(deliveryoption){

    this.selected_delivery_option=deliveryoption;
    console.log(deliveryoption);
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

  updateCart(item_id,type){
 
    var objIndex ;
    var qty;
    var sum;
    objIndex=0;

    console.log('THIS IS OUR CART');
    console.log(this.received_package_list);
    console.log(item_id)
       if(type=='increase'){

         

         // WRITE QTY CHECK HERE..
         this.err=false;
         //--------->dry_clean_cart

         var t:any;
         for(var k=0;k<this.received_package_list.length;k++){

         objIndex = this.received_package_list[k].packages.findIndex((obj => obj.id == item_id));
     //     this.dry_clean_cart.push(this.received_package_list[k].packages.filter((data) => data.id == item_id ));
      //t=this.received_package_list[k].packages.filter((data) => data.id === item_id )
        t=  this.received_package_list[k].packages.filter(function (el) {
          return  el.id == item_id;
        });

     if(objIndex!=-1){


        if(parseInt(this.received_package_list[k].packages[objIndex].item_qty)==parseInt(this.received_package_list[k].packages[objIndex].allowed_qty)){

           console.log('Allowed qty is-'+this.received_package_list[k].packages[objIndex].item_qty);

         }
         else{ 

          console.log('I am at right place');
           qty=parseInt(this.received_package_list[k].packages[objIndex].item_qty);
           this.received_package_list[k].packages[objIndex].is_added = "true";
           this.received_package_list[k].packages[objIndex].item_qty= (parseInt(this.received_package_list[k].packages[objIndex].item_qty)+1).toString();
           this.received_package_list[k].packages[objIndex].item_total= (parseFloat( this.received_package_list[k].packages[objIndex].price)* parseInt(this.received_package_list[k].packages[objIndex].item_qty));
 


         }
         break;
  }
}
       }
  
       else if(type=='decrease'){
         console.log("DECREASEING");
         console.log('Before Cart');
         console.log(this.received_package_list);

         var t:any;
         for(var k=0;k<this.received_package_list.length;k++){
         objIndex = this.received_package_list[k].packages.findIndex((obj => obj.id == item_id));
         t=  this.received_package_list[k].packages.filter(function (el) {
          return  el.id == item_id;
        });
        
        if(objIndex!=-1){
         qty=parseInt(this.received_package_list[k].packages[objIndex].item_qty);
         if( qty >0){
       
      
          this.received_package_list[k].packages[objIndex].item_qty= (parseInt(this.received_package_list[k].packages[objIndex].item_qty)-1).toString();
          console.log('New QTY');
          console.log( this.received_package_list[k].packages[objIndex].item_qty);
           if(parseInt( this.received_package_list[k].packages[objIndex].item_qty)==0){
            this.received_package_list[k].packages[objIndex].is_added = "false";
            console.log('GOING TO ZERO');
            this.resetOurCart();
 //              this.steps='3';
           }
           else{
            this.received_package_list[k].packages[objIndex].is_added = "true";
           }
          
           this.received_package_list[k].packages[objIndex].item_total=(parseFloat( this.received_package_list[k].packages[objIndex].price)* parseInt(this.received_package_list[k].packages[objIndex].item_qty));

         }
         else if(qty<1){

          
           // this.homeCleaningCart.cart_info[objIndex].is_added = "false";
           // this.homeCleaningCart.cart_info[objIndex].item_qty= '0';
           // this.homeCleaningCart.cart_info[objIndex].item_total='0';
           
           // this.steps='3';

         }
         
         break;
        }
         console.log('After Cart');
         console.log(this.received_package_list);
        }
       }
       
       var count=0;
       var tot=0;
       if(this.checkout_cart !=undefined){

        if(this.checkout_cart.length>0){

            for(var s=0;s<this.checkout_cart.length;s++){

              for(var m=0;m<this.checkout_cart[s].packages.length;m++){

                 if(this.checkout_cart[s].packages[m].is_added=="true"){
                  tot=tot+this.checkout_cart[s].packages[m].item_total;
                  count++;
                 }
              }
          //    this.addedInCart=this.checkout_cart[k].packages.filter((data) => data.is_added == 'true' );
            }
         
         console.log('ADDED IN CART 5656');
         console.log(this.addedInCart);
     
          this.cart_total=tot.toFixed(2);
          this.cart_count=count;
          console.log('TOTAL CART COUNT..');
          console.log( this.cart_total);
          console.log('This is TOTAL AMOUNT');
          console.log(this.cart_count);
       
            
       }

       }

       
        
    }

    
 

  switchTab(cat_name){

    var data:any = this.received_package_list.filter(function (el) {
      return el.category_name === cat_name;
  });

 

  this.show_package_on_tab=data[0];
  var str='#'+cat_name;
     
  $('.list.active').removeClass('active');
  $(str).addClass("active");
    console.log(data.packages);
  }

    switchTabCheckout(cat_name){
      var data:any = this.received_package_list.filter(function (el) {
        return el.category_name === cat_name;
    });

  

    this.show_package_on_checkout_tab=data[0];
    var str='#'+cat_name;
      
    $('.list.active').removeClass('active');
    $(str).addClass("active");
      console.log(data.packages);
    }

  mapOurPackage(){

    for(var j=0;j<this.received_package_list.length;j++){
      this.received_package_list[j].packages =  this.received_package_list[j].packages.map(
        data => (
          
          { 
            'id':data.id,
            'package_name':data.package_name,
            'package_type':data.package_type,
            'category_id':data.category_id,
            'price':data.price,
            'discount_per':data.discount_per,
            'allowed_qty':data.allowed_qty,
            'description':data.description,
            'service_id':data.service_id,
            'item_qty': '0',
            'is_added':'false',
            'item_total':'0',
            'before_discount_price':''
             
        
          }
        
          ));

    }

    var discounted_amt=0.0;
    var final_price=0.0;
    var disc_per=0.0;
    for(var s=0;s<this.received_package_list.length;s++){

      for (var i in this.received_package_list[s].packages) {
      
        discounted_amt=0.0;
        final_price=0.0;
        disc_per=0.0;
        this.received_package_list[s].packages[i].before_discount_price=this.received_package_list[s].packages[i].price;
        disc_per=parseInt(this.received_package_list[s].packages[i].discount_per)/100;
       
        discounted_amt=parseInt(this.received_package_list[s].packages[i].price)*disc_per;
        final_price=parseInt(this.received_package_list[s].packages[i].price)-discounted_amt;
        
        this.received_package_list[s].packages[i].price = final_price.toString();
           
       }

    }
  }

  resetOurCart(){

    if(this.checkout_cart!=undefined){

      if(this.checkout_cart.length>0){

        this.checkout_cart=this.received_package_list.filter((obj) => {
          for (let i = 0; i< obj.packages.length;  i++) {
            if (obj.packages[i].is_added === "true") {
              return obj.category_name;
            }
          }
        });
        this.show_package_on_checkout_tab=this.checkout_cart[0];
        setTimeout(()=>{
                
          var str='#'+this.checkout_cart[0].category_name;
          console.log(str);
          $('.list.active').removeClass('active');
          $(str).addClass("active");
        
        }, 200);
        console.log('OUR CHECKOUT CART');
        console.log(this.checkout_cart);
        if(this.checkout_cart.length<1){
          
          this.steps='1_3';
    
        }
  
      }
      

    }

    
  }

  selectMonthlyPackage(selectedpackage){

    console.log(selectedpackage);
    this.selected_monthly_service=selectedpackage;


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
