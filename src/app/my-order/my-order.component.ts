import { Component, OnInit,EventEmitter,ViewChild,ElementRef,NgZone } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { AppGlobals } from '../app.global';
import { Home } from '../home/home.model';
import { Router } from '@angular/router';
import {MyAccountService} from '../my-account/my-account.service';
import {MapsAPILoader} from '@agm/core';
import {LocationService} from '../location-listing/location.service';
import {HomeCleaningService} from '../home-cleaning/home-cleaning.service';

declare   var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.component.html',
  styleUrls: ['./my-order.component.css']
})
export class MyOrderComponent implements OnInit {

  globaldata:Home;
  imgUrl:any;
  loggedInUserData:any;
  is_logged_in:boolean;
  regular_order_data:any;
  viewtype:string;
  monthly_order_data:any;
 
  is_create_order:boolean;
  selected_monthly_order:any;
  enteredQty:string;
  err:boolean;
  err_msg:string;
  steps:string;
  is_service_display:boolean;
  imgUrl_raw:string;
  homeCleaningImg:string;
  isUnservicable:boolean;
  received_package_list:any;
  show_package_on_tab:any;
  cart_total:string;
  checkout_cart:any;
  show_package_on_checkout_tab:any;
  cart_count:number;
  addedInCart:any;
  user_postal_code:string;
  formatted_address:string;
  time_solts:any;
  selectedTimeSlot:string;
  selectedDaySlot:string;
  loggedInEmail:string;
  user_email:string;
  user_mobile:string;
  global:any;
  constructor(private _global: AppGlobals,public localStorage:CoolLocalStorage,private  router: Router,
    private myAccountService:MyAccountService, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone,
    private locationService:LocationService,private homeCleaningService:HomeCleaningService) {

      this.viewtype='regular';
      this.regular_order_data=[];
      this.is_create_order=false;
      this.err=false;
       
      this.is_service_display=false;
      this.isUnservicable=false;
      this.global=this._global;

   }
   @ViewChild('search') public searchElement: ElementRef;
  ngOnInit() {
  
    this.loggedInUserData=this.localStorage.getObject('u_i');
    if(this.loggedInUserData!=undefined){

      this.is_logged_in=true;
      this.loggedInUserData=this.localStorage.getObject('u_i');
        //consol
     }
     else{
      this.router.navigate(['']);
     }
    this.imgUrl=this._global.imgUrl;


    console.log('IMAGE URL');
    console.log(this.imgUrl_raw);
    console.log(this.homeCleaningImg);
    this.globaldata=JSON.parse(localStorage.getItem('global'));

    console.log('Looged in user data');
    console.log(this.loggedInUserData);
    
    
    
    $('div').preloader();

    setTimeout(()=>{ 
   

    }, 1000);

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

  ngAfterViewInit()	
{

  console.log('I AM CALLED');


}

ngAfterViewChecked(){

  console.log('This is before regular order response');
  console.log
  if(this.regular_order_data.length<1){
    
    $('div').preloader();
    var data="user_id="+this.loggedInUserData.id;
    this.myAccountService.fetchRegularOrder(data).subscribe(
  
      (response)=>
          {
          
            console.log('This is order response');
            console.log(response);
            var dt:any=response;
  
            this.regular_order_data=dt.data;
            console.log('This is After order response');
            console.log(JSON.parse(JSON.parse(this.regular_order_data[0].cart_data)));
            $('div').preloader('remove');
           //  this.pre_order_resp=response;
           //  console.log(this.pre_order_resp.order_id);
           //  $('div').preloader('remove');
            
           //  $("#payment_btn").css({"background":"#79888e"});
           //  window.location.href = 'http://idigities.com/fab/management/payment/ccavenue/'+this.pre_order_resp.order_id;
           //  //this.is_payu_call=true;
  
          },
        (error)=>{
          
          $('div').preloader('remove');
            console.log('RESPONSE FAILED');console.log(error)}
    );
    
  }
  console.log('After view checked');
}


switchOrderView(viewtype){

  console.log(viewtype);
  if(viewtype=='regular'){

    var str='#regulartype';
     
    $('.list.active').removeClass('active');
    $(str).addClass("active");
    this.viewtype='regular';
 
   
  }
  else if(viewtype=='monthly'){

    var str='#monthlytype';
     
    $('.list.active').removeClass('active');
    $(str).addClass("active");

    var data="user_id="+this.loggedInUserData.id;
    this.myAccountService.fetchMonthlyOrder(data).subscribe(
  
      (response)=>
          {
          
            console.log('This is Monthly order response');
            console.log(response);
            this.imgUrl_raw=this._global.imgUrl_raw;
            this.homeCleaningImg=this._global.response.web_banner;
            console.log(this.imgUrl_raw);
            console.log(this._global);
             var dt:any=response;
            var temp_pkg:any;
             for(var i=0;i<dt.data.length;i++){

              temp_pkg=[];
              temp_pkg.push(JSON.parse(JSON.parse(dt.data[i].package_data)));
           //   for(var j=0;j<temp_pkg.length;j++){
                dt.data[i].package_data=temp_pkg;

            //  }
              
             }
             
             this.monthly_order_data=dt.data;
             console.log('MONTHLY ORDER');
             console.log(this.monthly_order_data);
            // this.regular_order_data=dt.data;
            // console.log('This is After order response');
            // console.log(JSON.parse(JSON.parse(this.regular_order_data[0].cart_data)));
             $('div').preloader('remove');
    
          },
        (error)=>{
          
          $('div').preloader('remove');
            console.log('RESPONSE FAILED');console.log(error)}
    );


    this.viewtype='monthly';
  }
}


createMonthlyOrder(order){
  console.log('This is order');
  console.log(order);
 
  this.selected_monthly_order=order;
 
  this.is_create_order=true;

  

}

closeCreateOrder(){


  this.is_create_order=false;
}


validateQty(){

  console.log("this is entered qty");
  console.log(this.enteredQty);
  var qty:any=this.enteredQty;

    if(isNaN(qty)){

    this.err=true;
    this.err_msg='Please enter valid qty.!';
  }
  else if(parseInt(qty)<1){

    this.err=true;
    this.err_msg='Entered qty should be greater than 0.!';

  }
  else{

    $('div').preloader();
    var data="order_id="+this.selected_monthly_order.order_id+"&qty="+this.enteredQty;
    this.myAccountService.validateMonthlyUserQty(data).subscribe(
    
      (response)=>
          {
          
            console.log('This is order response');
            console.log(response);
             var dt:any=response;
            
             if(dt.status==201){

              this.err=true;
              this.err_msg=dt.message;
             }
             else if(dt.status==200){

              this.err=false;

              var data="service_id=2&delivery_option=3";
              console.log('Before data');
              console.log(data);
              $('div').preloader();
              this.myAccountService.getMonthlyPackages(data).subscribe(
        
                (response)=>
                    {
                   
                    var dt:any=response;
                    this.received_package_list=dt.data;
                      
                    console.log('SUPER COOL RESPONSE');
                    console.log(response);
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
                  
                    this.is_create_order=false;
                    this.is_service_display=true;
                    this.steps='1_1';
                    $('div').preloader('remove');
                    },
                  (error)=>{
                      
                        $('div').preloader('remove');
                      console.log('RESPONSE FAILED');console.log(error)}
              );

             }
   
            $('div').preloader('remove');
 
  
          },
        (error)=>{
          
          $('div').preloader('remove');
            console.log('RESPONSE FAILED');console.log(error)}
    );

  }
 // if(this.selected_monthly_order)

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


  onNext(step){

    if(this.steps=='1_1'){
    
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
     
      this.steps='1_2';
      console.log('Move next page');
    }

    else if(this.steps=='1_2'){

     
     // this.loadMapApi();
      this.steps='1_3';
      
      console.log('We have to show location');
      
    }
    else if(this.steps=='1_3'){

     
      console.log('This is OUR ORDER..');
      console.log(this.checkout_cart);

     
      var data="pincode="+this.user_postal_code+"&service_id=2";
      $('div').preloader();
      this.myAccountService.getTimeSlots(data).subscribe(

        (response)=>
            {
           
            
            this.time_solts=response;
            console.log(this.time_solts);
            $('#locationView').hide();
 
            this.steps='1_4';
            $('div').preloader('remove');
            },
          (error)=>{
              
                $('div').preloader('remove');
              console.log('RESPONSE FAILED');console.log(error)}
      );
    }
    else if(this.steps=='1_4'){

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
          console.log('This is monthly order id');
          console.log(this.selected_monthly_order.order_id);

          this.steps='1_5';
      }else{

        this.err=false;
    //    this.called_from_service=true;
          $(".services_popup").css("display", "none");
          $(".login_popup").css("display", "block");
       
          this.steps='1_5';

      }
    }

    else if(this.steps=='1_5'){


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
 
        //   $('div').preloader('remove');
    
          this.steps='1_6';
        
      }
    }
    else if(this.steps=='1_6'){

      console.log('Final checkout arrrived.');

              // ORDER PROCESS

              var temp_arr=[];
        
  
              if(this.checkout_cart.length>0){
        
                for(var i=0;i<this.checkout_cart.length;i++){
        
                  for(var j=0;j<this.checkout_cart[i].packages.length;j++){
        
                    if(this.checkout_cart[i].packages[j].is_added=="true"){
      
                      temp_arr.push(this.checkout_cart[i].packages[j]);
                      
                    }
                  }
                }
              }
       
               this.checkout_cart=temp_arr;
             
              var addr={'house_no':'','location':'','landmark':''};
              addr.house_no=$('#house_no').val();
              addr.location=this.formatted_address;
              addr.landmark=$('#landmark').val();
              
              console.log('This is monthly order id');
              console.log(this.selected_monthly_order.order_id);
             var data="user_id="+this.global.user_data.id+"&mobile="+this.user_mobile+"&email="+this.user_email+"&address="+JSON.stringify(addr)+"&wallet_amount=0"+"&total_amount=0"+"&payment_mode=1"+"&payment_amount=0&cart_data="+ JSON.stringify(this.checkout_cart)+"&day_slot="+JSON.stringify(this.selectedDaySlot)+"&time_slot="+JSON.stringify(this.selectedTimeSlot)+"&subscription_type=1"+"&monthly_order_id="+this.selected_monthly_order.order_id;
       
              console.log('Our Final String');
              console.log(data);
                         this.homeCleaningService.preOrder(data).subscribe(
        
                          (response)=>
                              {
                              
                                 
                                $('div').preloader('remove');
                                alert('Order successfull.!');
                              //  $("#payment_btn").css({"background":"#79888e"});
                              },
                            (error)=>{
                              $('div').preloader('remove');
                                console.log('RESPONSE FAILED');console.log(error)}
                        );
               
      
              //ORDER PROCESS
     // this.steps='1_7';

    }

  }

  onBack(){


    if(this.steps=='1_2'){

      this.steps='1_1';
    }
    else if(this.steps=='1_3'){

      this.steps='1_2';
    }
    else if(this.steps=='1_4'){

      $('#locationView').show();
    }
    else if(this.steps=='1_'){

      this.steps='1_2';
    }
    else if(this.steps=='1_3'){

      this.steps='1_2';
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

  closeLoginRegisterPopup(){

      this.is_service_display=false;
  }

}
