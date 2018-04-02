import { Component, OnInit ,Output,EventEmitter} from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Home } from '../home/home.model';
import { AppGlobals } from '../app.global';
import { Router } from '@angular/router';
import {InfoService} from './info.service';
import { AuthService } from "angularx-social-login";
declare   var jquery:any;
declare var $ :any;
@Component({
  selector: 'app-info-page',
  templateUrl: './info-page.component.html',
  styleUrls: ['./info-page.component.css']
})
export class InfoPageComponent implements OnInit {

  globaldata:Home;
  imgUrl:any;
  menu_items:any;
  info_data:any;
  is_logged_in:boolean;
  loggedInUserData:any;
  isenquiry:boolean
  constructor(public localStorage:CoolLocalStorage,private _global: AppGlobals,private router : Router,
    private infoService:InfoService,private authService: AuthService ) { 

      this.isenquiry=false;
  }
 
 // page_urls:any=['']
  ngOnInit() {
    this.is_logged_in=false;
    this.globaldata=JSON.parse(this.localStorage.getItem('global'));
    this.imgUrl=this._global.imgUrl;
    this.menu_items=this.globaldata.data.menu_items;
    var slug= this.getOurSeoUrl(this.router.url);
    console.log('G Data');
      
    console.log( this.globaldata)
    console.log(this.globaldata.data.menu_items);
   var ret= this.menu_items.find(function(el){ return el.seo_url === slug; })
   if(ret==undefined){

    this.router.navigate(['/']);
   }
   else{

 
    this.infoService.getPagesData(slug).subscribe(
      (response)=>
          { 
            
            console.log('This is INFO response');
            console.log(response);
            this.info_data=response;

            this.loggedInUserData=this.localStorage.getObject('u_i');
            console.log('Info Login Data');
            console.log(this.loggedInUserData);

            if(this.loggedInUserData!=undefined){
              
              console.log('Yes its login');
              this.is_logged_in=true;
              this.loggedInUserData=this.localStorage.getObject('u_i');
              
             }
             else{

              this.is_logged_in=false;
              
             }

            var scrollToTop = window.setInterval(function() {
              var pos = window.pageYOffset;
              if ( pos > 0 ) {
                  window.scrollTo( 0, pos - 20 ); // how far to scroll on each step
              } else {
                  window.clearInterval( scrollToTop );
              }
          }, 16); 
        
           
            // $('div').preloader('remove');
        
            
          },
      (error)=>console.log(error)
);

   }
   console.log('Our ret resp');
   console.log(ret);
  }

  getOurSeoUrl(url){

    var our_url=this.router.url.split("/");
    var our_seo_url=our_url[our_url.length-1];

    return our_seo_url;
  }

  onLoginRegisterClick(){

    $(".login_popup").css("display", "block");
 
    }

    ngAfterContentInit(){

        $('div').preloader('remove');

    }

    logout(){
 
      this.localStorage.removeItem('u_i');
      this.authService.signOut();
      this.is_logged_in=false;
      $('div').preloader();
  
        setTimeout(function(){ 
          
          
          $('div').preloader('remove');
          // this.router.navigate(['']);
            }, 1500);
  }

  isLoggedInHandler(data:any){

    console.log('LOGIN EVENT CALLED..........');
    console.log(data);
    this.localStorage.setObject('u_i',data);
    this.is_logged_in=true;
    this.loggedInUserData=this.localStorage.getObject('u_i');;
}

  navigateFooter(url){

      console.log(url);
      this.router.navigateByUrl('/pages/'+url);
      this.fetchingNewSlug(url);
   //   this.router.navigate(['/pages/terms']);
  }

  fetchingNewSlug(slug){

     
    this.infoService.getPagesData(slug).subscribe(
      (response)=>
          { 
            
            console.log('This is INFO response');
            console.log(response);
            this.info_data=response;

            this.loggedInUserData=this.localStorage.getObject('u_i');
            console.log('Info Login Data');
            console.log(this.loggedInUserData);

            if(this.loggedInUserData!=undefined){
              
              console.log('Yes its login');
              this.is_logged_in=true;
              this.loggedInUserData=this.localStorage.getObject('u_i');
                //consol
             }
             else{

              this.is_logged_in=false;
              //this.router.navigate(['']);
             }

            var scrollToTop = window.setInterval(function() {
              var pos = window.pageYOffset;
              if ( pos > 0 ) {
                  window.scrollTo( 0, pos - 20 ); // how far to scroll on each step
              } else {
                  window.clearInterval( scrollToTop );
              }
          }, 16); 
        
           
            // $('div').preloader('remove');
        
            
          },
      (error)=>console.log(error)
);
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
