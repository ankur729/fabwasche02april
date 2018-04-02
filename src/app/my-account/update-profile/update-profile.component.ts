import { Component, OnInit,Output,EventEmitter } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Router } from '@angular/router';
import {MyAccountService} from '../my-account.service';
import {AppGlobals} from '../../app.global';
declare   var jquery:any;
declare var $ :any;
@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit {

  constructor(public localStorage:CoolLocalStorage,private  router: Router,
              private myAccountService:MyAccountService,public _global:AppGlobals) {
                
               }
  loggedInUserData:any;
  mobile_email:string;
  name:string;
  user_auth_type:string;
  is_update_mobile:boolean;
  

  user_mobile:string;
  verify_otp:string;

  err_login:boolean
  err_msg_login:string;
  user_id:string;
  @Output() onCloseUpdateMobile=new EventEmitter<boolean>();
  
  ngOnInit() {

    this.is_update_mobile=false;

    this.loggedInUserData=this.localStorage.getObject('u_i');
    if(this.loggedInUserData!=undefined){

      console.log(this.loggedInUserData);
     // alert(JSON.stringify(this.loggedInUserData));
      if(this.loggedInUserData.hasOwnProperty('mobile_email')){

        this.mobile_email=this.loggedInUserData.mobile_email;

      }
      else{

        if(this.loggedInUserData.email !=''){
          this.mobile_email=this.loggedInUserData.email;
        }
       else if(this.loggedInUserData.mobile !=''){
          this.mobile_email=this.loggedInUserData.mobile;
        }

      }

      if(isNaN(parseInt(this.mobile_email))){

        this.user_auth_type='Email';
        
        
      }
      else{
        this.user_auth_type='Mobile';
       
      }
      //alert(this.loggedInUserData.name);
      this.name=this.loggedInUserData.name;
      this.user_id=this.loggedInUserData.id;
     }
     else{
      this.router.navigate(['']);
     }


     this.err_login=false;
  }

  onUpdateClick(){

    console.log(this.user_auth_type);
      if(this.user_auth_type=='Mobile'){

        console.log('Mobile updating');
        // this.user_mobile=this.mobile_email;
        // this.is_update_mobile=true;
      if(this.name==''){

        this.err_login=true;
        this.err_msg_login='*Name is required';
      }
      else if(this.mobile_email==''){

        this.err_login=true;
        this.err_msg_login='*Mobile No. is required';

      } 
      else if(typeof this.name!='string'){

        this.err_login=true;
        this.err_msg_login='*Invalid Name';

      }
      else if(isNaN(parseInt(this.mobile_email))){

        this.err_login=true;
        this.err_msg_login='*Invalid Mobile No.';

      }
      else if(this.mobile_email.length!=10){

        this.err_login=true;
        this.err_msg_login='*Invalid Mobile No.';

      }
      else{


        $('div').preloader();

        this._global.sendOTP(this.mobile_email).subscribe(

          (response)=>
              {
              $('div').preloader('remove');
              console.log('OTP RESS');
              this.user_mobile=this.mobile_email;
              console.log(response);
              var res:any=response;
              if(res.status==200){

                this.verify_otp=res.otp;
                 this.is_update_mobile=true;
              }
              else{

                alert('Server error');
              }
             // this.verify_otp=res.
             
              
              },
            (error)=>{
                
                  $('div').preloader('remove');
                console.log('RESPONSE FAILED');console.log(error)}
        );
        

      }


        
      
      }else{

        // console.log('Email updating');
        // console.log(this.mobile_email);
        var data="name="+this.name+"&email_mobile="+this.mobile_email+"&type=email"+"&user_id="+this.user_id;

        $('div').preloader();
        this.myAccountService.updateUserProfile(data).subscribe(
  
          (response)=>
              {
                console.log('Profile upate response');
                console.log(response);
                if(this.loggedInUserData.hasOwnProperty('mobile_email')){

                  this.loggedInUserData.mobile_email=this.mobile_email;
           
                 }
                 else{
           
                   this.loggedInUserData.email=this.mobile_email
           
                 }
                this.loggedInUserData.name=this.name;

                this.localStorage.removeItem('u_i');
                this.localStorage.setObject('u_i',this.loggedInUserData);
  
                this.router.navigate(['my-account']);
              $('div').preloader('remove');
              },
            (error)=>{
                
                  $('div').preloader('remove');
                console.log('RESPONSE FAILED');console.log(error)}
        );
        
      }
      console.log('updating');
  }

  onCloseUpdateMobileHandler(){

    this.is_update_mobile=false;
    this.router.navigate(['my-account']);
  }


 
}
