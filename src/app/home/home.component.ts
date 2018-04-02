import { Component, OnInit,ViewChild, ElementRef, NgZone,Input } from '@angular/core';

import {MapsAPILoader} from '@agm/core';
import {} from '@types/googlemaps';
import { CoolLocalStorage } from 'angular2-cool-storage';
import {HomeService} from './home.service';
import { AppGlobals } from '../app.global';
import { Router } from '@angular/router';
import { Home } from './home.model';

import {LocationService} from '../location-listing/location.service';

declare   var jquery:any;
declare var $ :any;
//import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
    localStorage: CoolLocalStorage;
    public resp;
    public  auto_loc:any;
  //private spinnerService: Ng4LoadingSpinnerService
  public lower_panel = false;
  public upper_panel=true;
  location: string;
  data:any;
  globaldata:Home;
  imgUrl:any;
  @Input() service_component:boolean;
  // service_component:boolean;
  no_service_popup:boolean;
  calling_payu:boolean;

  constructor(private mapsAPILoader: MapsAPILoader, private ngZone: NgZone,
                localStorage: CoolLocalStorage,private homeService:HomeService,
                private _global: AppGlobals,private  router: Router,
                private locationService:LocationService) { 
                    this.localStorage = localStorage;   
                    this.no_service_popup=false;
                    this.calling_payu=false;
              } 


  @ViewChild('search') public searchElement: ElementRef;
  
  ngOnInit() {

      console.log('THis is our User Location');
      console.log(this.localStorage.getObject('user_loc'));

  //    if(this.localStorage.getObject('user_loc')==null){

             //INITIALIZING THIS GLOBAL RESPONSE
        this.service_component=false;
        this._global.response={'locality':'','postal_code':'','city':''};

       
        $(document).ready(function(){
            $('div').preloader();
            }); 
        
        this.imgUrl=this._global.imgUrl;
       this.homeService.getHomePageData().subscribe(
            (response)=>
                { 
                     this.globaldata=response;

                     this._global.customer_wallet_restrict=this.globaldata.data.wallet_restrict;
                     console.log(response);
               
                    console.log(this.globaldata.data.punch_line);

                   this.localStorage.setObject('global',this.globaldata);
                    $('div').preloader('remove');
               
                   
                },
            (error)=>console.log(error)
    );


      this.mapsAPILoader.load().then(
        () => {
          
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
                   // document.getElementById('postal_code').innerHTML = place.address_components[i].long_name;
                  
                    this._global.response.postal_code=place.address_components[i].long_name;
                  } 

                  if (place.address_components[i].types[j] == "sublocality_level_1") {
                    //this is the object you are looking for
                
                  //  city= place[0].address_components[i];
                     
                    this._global.response.locality=place.address_components[i].long_name;

                 //   break;
                }
                if (place.address_components[i].types[j] == "administrative_area_level_1") {
                    //this is the object you are looking for
                
                  //  city= place[0].address_components[i];
                     
                    this._global.response.city=place.address_components[i].long_name;

                 //   break;
                }
                }
              }
              $('#search').val(this._global.response.locality+" , "+this._global.response.postal_code);
           // this.spinnerService.hide();
        //    this.lower_panel=true;
        //    this.localStorage.setItem('location', place.vicinity);
        //    this.location=place.vicinity;
        //      console.log(place.vicinity);
           //  this.router.navigate(['/',this.localStorage.getItem('location')]);
           
           }
          
          
           setTimeout(() =>{ 
            

                  this.callLocationService();
     
            $('div').preloader('remove');
          //  this.service_component=true;
         //   this.router.navigate(['/',this._global.response.locality.replace(" ", "-")]);

                
        }
                , 1000);
        
           console.log(this._global.response);
           console.log(this._global.response);
          });
          });
        }
      );


      // }
      // else{
      //   console.log('We have user location');
      //   this._global.response={'locality':'','postal_code':'','city':''};
      //   var user_loc:any=this.localStorage.getObject('user_loc');
      //   this._global.response.postal_code=user_loc.postal_code;
      //   this._global.response.locality=user_loc.locality;
      //   this._global.response.city=user_loc.city;
      //   this.callLocationService();
         
      // }
         
      
     
      
  }

    onClickLocation(city){

        this._global.response.postal_code='';  
        this._global.response.city=city;  
        console.log(this._global.response);
        this.callLocationService();
    }


  callLocationService(){
    console.log('HIDDEN CHECK');
    console.log(this._global.response);

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
              
                console.log('New Gllobal Response');
                console.log(this._global.response);

              if(this._global.response.status==201){

                  
                    this.no_service_popup=true;  

              }
              else if(this._global.response.status==200){

               
               
                this._global.response.services=this._global.response.homdata.services;
                delete  this._global.response.homdata;
                this._global.response.city=city;

                    console.log('Service Available');
                    $('div').preloader();
                 //   var t=JSON.parse(JSON.stringify(this._global.response));
                   // console.log(this._global.response.homdata);
                     this.service_component=true;
              }
              //      $('div').preloader('remove');
                   console.log('RESPONSE ARRIVED');
                   console.log(response);
              
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
  autoDetectLocation(){
    
    $('div').preloader();
  
    this.getCustomerCurrentPosition().then((results) =>  {

        
      
                 for (var i=0; i< results[0].address_components.length; i++) {

                     for (var j=0;j<results[0].address_components[i].types.length;j++) {
         
                        if (results[0].address_components[i].types[j] == "postal_code") {
                            
                            this._global.response.postal_code=results[0].address_components[i].long_name;
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
               
                 this.localStorage.setObject('user_loc',{'postal_code':this._global.response.postal_code,
                 'locality': this._global.response.locality,
                'city': this._global.response.city});

                    setTimeout(() =>{ 

                      console.log('Before Check');
                      console.log(this._global.response);
                      this.callLocationService();

                       $('div').preloader('remove');
                     //   this.router.navigate(['/',this._global.response.locality.replace(" ", "-")]);
                //   this.service_component=true;
                                }
                            , 1000);
                 console.log('FINAL RESPONSE');
                 console.log(this._global.response);
       
    }, function(errStatus) {
        console.log(errStatus);
        
    });
   
  }

 
  getCurrentPos(){

    let geocoder = new google.maps.Geocoder();
    console.log(navigator.geolocation);
    navigator.geolocation.getCurrentPosition(function (p) {
    
     
     let LatLng = new google.maps.LatLng(p.coords.latitude, p.coords.longitude);


     console.log(LatLng);
     var geocoder = geocoder = new google.maps.Geocoder();
     geocoder.geocode({ 'latLng': LatLng }, function (results, status) {
      let city={'long_name':''};
         if (status == google.maps.GeocoderStatus.OK) {

             if(results.length>0){


                return results;
                // if (results[1]) {
 
                //     // results[0].address_components[1].short_name+','+
                //     for (var i=0; i<results[0].address_components.length; i++) {
                //      for (var b=0;b<results[0].address_components[i].types.length;b++) {
         
                //      //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
                //          if (results[0].address_components[i].types[b] == "administrative_area_level_1") {
                //              //this is the object you are looking for
                //              city= results[0].address_components[i];
                //              break;
                //          }
                //      }
                //  }
                //     console.log('THIS IS RESULTS');
                //     console.log(city.long_name);
                   
                //     this.auto_loc=city.long_name;
                //     $('#search').val(city.long_name);
                
                //       this.localStorage.setItem('location', city.long_name);
                     
                    
                //  // this.router.navigate(['/',this.localStorage.getItem('location')]);
                 
                    
                // }

             }else{

                alert('GOOGLE AUTODETECTION WORK ONLY ON HTTPS SERVER..')
             }
          
         }
         
     });
      
  });

  }



   getAddress(latlng) {

    var geocoder = geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'latLng': latlng }, function (results, status) {

        if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {

                // results[0].address_components[1].short_name+','+

                console.log('THIS IS RESULTS');
                console.log(results);
            }
        }
    });
}


  toggleLocation(){

    //console.log('this.upper_panel');
    //this.upper_panel=true;
    // if(!this.upper_panel){
    //     $("html, body").animate({ scrollTop: $(document).height() }, 1000);
    //     this.upper_panel=true;
    //     this.lower_panel=false;
    // }
    // else{

    //     this.upper_panel=false;
    //     this.lower_panel=true;
    // }

  }
  serviceTest(){

    console.log(this._global.services);
  //  this.router.navigate(['/',this.localStorage.getItem('location')]);
    // $('div').preloader();
    // console.log('test');
    // this.homeService.getHomePageData().subscribe(
    //         (response)=>
    //             { 
    //                 this.resp=response;
    //                 this.data=this.resp.data[0];
    //                 console.log(this.resp.data[0]);
    //                 console.log(this._global.baseAppUrl);
    //                 $('div').preloader('remove');
    //             },
    //         (error)=>console.log(error)
    // );
   
  }

  onCloseNoServicePopup(){
 
      if(this.no_service_popup){

        this.no_service_popup=!this.no_service_popup;
        
      }
  }
  

  onCallingPayu(data:any){

    console.log(' I AM CALLING PAYU');
    this.calling_payu=true;

  }


  onSwitchLocationHandler(data:any){

    this.service_component=false;
   // $('div').preloader();
      console.log('SWITCHING LOCASTION');
  }


}



