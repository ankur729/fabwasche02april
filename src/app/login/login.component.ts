import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';

import {RegisterService} from './register.service';
import {LoginService} from './login.service';
import {Register} from './register.model';
import {Login} from './login.model';
import {AppGlobals} from '../app.global';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { AuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";
declare   var jquery:any;
declare var $ :any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  @Input() called_from_service: boolean;
  register:Register;
  login:Login;
  reg_step:string;
  err_msg:string;
  err_msg_forgot:string;
  err_msg_login:string;
  err:boolean;
  err_login:boolean;
  err_forgot:boolean;
  succ:boolean;
  succ_msg:string;
  succ_login:boolean;
  succ_msg_login:string;
  forgot_panel:boolean;
  login_panel:boolean;
  create_pass_panel:boolean;
  recovery_otp_panel:boolean;

  email_verfication_link_resp:boolean=false;
   

  private socialuser: SocialUser;
  private loggedIn: boolean;


  constructor(private registerService:RegisterService,private loginService:LoginService,private _global:AppGlobals,
          private localStorage: CoolLocalStorage,private authService: AuthService) {

      this.register=new Register();
      this.login=new Login();
     
   }

   @Output() UserData = new EventEmitter();
   @Output() LoginCloseEvent = new EventEmitter();
   @Output() is_logged_in = new EventEmitter();
   
  ngOnInit() {

    this.reg_step='1';
    this.err=false;
    this.succ=false;
    this.forgot_panel=false;
    this.login_panel=true;
    this.recovery_otp_panel=false;
    this.create_pass_panel=false;
   
    if(this.localStorage.getObject('u_i')==undefined){
 
      this.authService.authState.subscribe((user) => {
 
        console.log(user);
       
        this.socialuser = user;
        this.loggedIn = (user != null);
        
        if(this.loggedIn){
          console.log('YES I AM LOGGED IN');
          this.is_logged_in.emit(this.socialuser);
            $(".login_popup").css("display", "none");
          this.checkEmailIdExist(this.socialuser.email).then((data) => {
            console.log('New User');
  
            var u="mobile_email="+this.socialuser.email+"&name="+this.socialuser.name+"&password="+
           'google login'+"&refcode="+'';
  
                    this.registerViaSocial(u).then((d) => {
                        console.log('successfully Registered new user via google login');
                        
                        $(".login_popup").css("display", "none");
                      
                        this.UserData.emit(this.socialuser);
                        this.is_logged_in.emit(this.socialuser);

                        this.localStorage.setObject('u_i',this.socialuser);
                        $(".services_popup").css("display", "block");
                      //  this.is_logged_in.emit(this.socialuser);
                    }).catch((ex) => {
                      console.error('Error fetching users', ex);
                    });
            console.log(data);
         }).catch((ex) => {

          $(".login_popup").css("display", "none");
                      
          this.UserData.emit(this.socialuser);
          this.is_logged_in.emit(this.socialuser);
          this.localStorage.setObject('u_i',this.socialuser);
          $(".services_popup").css("display", "block");
           console.log('Already Registered User');
           console.error('Error fetching users', ex);
         });
        }
  
     
       // this.checkEmailIdExist(this.socialuser.email);
        //this.checkEmailIdExist(t)
        
      });
   }
   else{


   }
    

    console.log('THIS IS LOGGED I USER');
    console.log(this.localStorage.getObject('u_i'));
    
  }

  closeLoginRegisterPopup(){
    
    $(".login_popup").css("display", "none");
    this.err=false;
    this.err_login=false;
    this.LoginCloseEvent.emit(this.login);
    this.register=new Register();
    this.login=new Login();
    
    if(this.called_from_service){

      $(".services_popup").css("display", "block");

    }
    var pro=$(".services_popup").css('display');
    console.log('TESTING PROERTY');
    console.log(this.called_from_service);
    // if( $(".services_popup").css('display') == 'block') {

    //   $(".services_popup").css("display", "block");
    // }
     //$(".services_popup").css("display", "block");
  }

  onRegister(step){

    //console.log(data);

    if(this.reg_step=='1'){

      //this.register.name=data.name;
      this.err=false;
      if(this.register.name==''){
        
        this.err=true;
        this.err_msg='*Name is required';
       
      }
      else{
        this.err=false;
        this.reg_step='2';
      }
    
     // this.regData.name=data;

    }
    else if(this.reg_step=='2'){

      console.log('Step 2');
      console.log(this.register);
      this.err=false;
      $('div').preloader();
 
      var data="mobile_email="+this.register.mobile_email;

        this.registerService.validateEmailMobile(data).subscribe(
              (response)=>
                  {
                  this._global.response=response;

                  if(this._global.response.status==201){

                         this.err=true;
                         this.err_msg=this._global.response.message;

                  }
                  else if(this._global.response.status==200){

                        this.reg_step='3';

                  }
                       $('div').preloader('remove');
                       console.log('RESPONSE ARRIVED');
                       console.log(this._global.response);
                  
                  },
              (error)=>{
                  
                    $('div').preloader('remove');
                   console.log('RESPONSE FAILED');console.log(error)}
          );
 

    }
    else if(this.reg_step=='3'){

          this.err=false;
          
          if(this.register.mobile_email_otp==''){

            this.err=true;
            this.err_msg='*OTP is required.!';
          }
          else if(this.register.mobile_email_otp==this._global.response.data.otp_code){

            this.reg_step='4';
            console.log('correct');
          }else{

            this.err=true;
            this.err_msg='Invalid OTP';
          }
          console.log(this._global.response);
    }
    else if(this.reg_step=='4'){

      this.err=false;
      console.log(this.register);
      if(this.register.refcode==''){
        console.log('asdfas');
            this.err=true;
            this.err_msg='You can skip, if you dont have refer code';
            
      }else{

        this.err=false;
        $('div').preloader();
        var data="refcode="+this.register.refcode;
       
        this.registerService.validateReferalCode(data).subscribe(
          (response)=>
              {
              this._global.response=response;

              if(this._global.response.status==201){

                     this.err=true;
                     this.err_msg=this._global.response.message;
                     this.register.refcode='';

              }
              else if(this._global.response.status==200){

                    this.reg_step='5';

              }
                   $('div').preloader('remove');
                   console.log('RESPONSE ARRIVED');
                   console.log(this._global.response);
              
              },
          (error)=>{
              
                $('div').preloader('remove');
               console.log('RESPONSE FAILED');console.log(error)}
      );
        // API TO CALL PENDING--
     //   this.reg_step='5';
      }

  }
  else if(this.reg_step=='5'){
    console.log(this.register);
    this.err=false;
     if(this.register.password != this.register.confirm_password){
        this.err=true;
        this.err_msg='Confirm password should be same as password';
     }
     else{

        this.err=false;
      console.log('ALL VALID');
      $('div').preloader();
      var data="mobile_email="+this.register.mobile_email+"&name="+this.register.name+"&password="+
                this.register.password+"&refcode="+this.register.refcode;
      console.log('final DATA');
      console.log(data);

      this.registerService.registerUser(data).subscribe(
            (response)=>
                {
                this._global.response=response;

                if(this._global.response.status==201){

                       this.err=true;
                       this.err_msg=this._global.response.message;

                }
                else if(this._global.response.status==200){

                     
                      this.login.login_data=this.register;
                      var my_mobile=parseInt(this.register.mobile_email);
                      var my_email='';
                      console.log('THIS IS OUR LOGIN DATA');
                      console.log(this.register);
                      console.log(this.login.login_data);

                      if(isNaN(my_mobile)){
                        
                        my_email=this.register.mobile_email;
                        this.login.login_data.name=this.register.name;
                        this.login.login_data.email=this.register.mobile_email;
                        this.login.login_data.mobile='';
                        this._global.user_data= this.login.login_data;
                        this.localStorage.setObject('u_i', this.login.login_data);
                      }
                      else{

                        this.login.login_data.name=this.register.name;
                        this.login.login_data.email='';
                        this.login.login_data.mobile=this.register.mobile_email;
                        this._global.user_data= this.login.login_data;
                        this.localStorage.setObject('u_i', this.login.login_data);
                      }
                      console.log('THIS IS OUR LOGIN AFTER DATA');
                      console.log(this.register);
                      console.log(this.login.login_data);
                      
                      //Emitting Our Super Cool Event
                      this.is_logged_in.emit(this.login.login_data);

                      this.reg_step='1';
                      this.register=new Register();
                      this.succ=true;
                      this.succ_msg='You are successfully registered, you can login now.!';

                   
                      $(".login_popup").css("display", "none");
                      $(".services_popup").css("display", "block");
                      this.UserData.emit(this.login.login_data);

                }
                     $('div').preloader('remove');
                     console.log('RESPONSE ARRIVED');
                     console.log(this._global.response);
                
                },
            (error)=>{
                
                  $('div').preloader('remove');
                 console.log('RESPONSE FAILED');console.log(error)}
        );
      
    }
    
}

     // console.log(this.regData);
   // this.reg_step='2';
  }

  validateEmail(emailField){
    
    var email = emailField;
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (!filter.test(email)) {
     
    email.focus;
    return false;

    }else{return true};
    
}

  validateContact(contact){

    if(contact.length==10){
      return true;
    }
    else{
      return false;
    }
  }
  onBack(step){

    if(step=='2'){
      
      this.err=false;
      this.reg_step='1';
   

    }
    else if(step=='3'){
      this.err=false;
      this.reg_step='2';
    
    }
    else if(step=='4'){
      this.err=false;
      this.reg_step='3';
    
    }
    else if(step=='5'){
      this.err=false;
      this.reg_step='4';
    
    }
    
  }

  onResendOTP(){

    //console.log('asdfads');
    this.err=true;
    this.err_msg='OTP Successfully Resend';
    
    this.onRegister(this.reg_step='2');

    setTimeout(function(){ 
      console.log('INTERVAL CALLED');
      this.err=false;
      this.err_msg='';
    
    }, 3000);
    

  }
  onResendForgotOTP(){

    this.err_forgot=true;
    this.err_msg_forgot='OTP successfully resend';
    console.log(this.register);
     this.onForgot();

  }

    onSkip(){

      console.log(this.register);
      this.err=false;
    if(this.reg_step=='4'){
      this.reg_step='5';
    }

   }


   onLogin(){
    this.succ_login=false;
    this.err_login=false;
    $('div').preloader();
      
      var data="mobile_email="+this.login.mobile_email+"&password="+
                this.login.password;
                console.log(this.login);
                console.log(data);
      this.loginService.loginUser(data).subscribe(
        (response)=>
            {
            this._global.response=response;

            if(this._global.response.status==201){

                   this.err_login=true;
                   this.err_msg_login=this._global.response.message;

            }
            else if(this._global.response.status==200){

                 
                  this.succ_login=true;
                  this.succ_msg_login='You are successfully Logged in.!';
                  this.login.login_data=this._global.response.data;
                  this.is_logged_in.emit(this.login.login_data);
                  console.log('THIS IS OUR LOGIN DATA');
                  // console.log( this.login.login_data);
                  this.localStorage.setObject('u_i', this.login.login_data);
                  this._global.user_data= this.login.login_data;
                  $(".login_popup").css("display", "none");
                  $(".services_popup").css("display", "block");
                  this.UserData.emit(this.login.login_data);
                
            }
                 $('div').preloader('remove');
                 console.log('RESPONSE ARRIVED');
                 console.log(this.login.login_data);
            
            },
        (error)=>{
            
              $('div').preloader('remove');
             console.log('RESPONSE FAILED');console.log(error)}
    );

   }

   onLogout(){

      this.localStorage.removeItem('u_i');
   }
   onChangePanelToForgot(){

    this.login_panel=false;
    this.forgot_panel=true;
   }

   onChangePanelToLogin(){

    this.login_panel=true;
    this.forgot_panel=false;
    this.create_pass_panel=false;
    this.err_forgot=false;
    this.login=new Login();
   }

   onChangePanelToForgotPanel(){

    this.recovery_otp_panel=false;
    this.forgot_panel=true;

   }

   onForgot(){

    if(this.register.mobile_email==''){

        this.err_forgot=true;
        this.err_msg_forgot='*Mobile/Email is required.!';
    }
    else{

      this.err_forgot=false;
      $('div').preloader();

      var data="mobile_email="+this.register.mobile_email;
  
      this.loginService.forgotUser(data).subscribe(
          (response)=>
          {
  
          this._global.response=response;
  
          if(this._global.response.status==201){
  
                this.err_forgot=true;
                this.err_msg_forgot=this._global.response.message;
  
          }
          else if(this._global.response.status==200){
  
                this.forgot_panel=false;
                this.recovery_otp_panel=true;
                // this.succ=true;
                // this.succ_msg='You are successfully Logged in.!';
  
          }
              $('div').preloader('remove');
              console.log('RESPONSE ARRIVED');
              console.log(this._global.response);
  
          },
          (error)=>{
  
            $('div').preloader('remove');
          console.log('RESPONSE FAILED');console.log(error)}
          );

    }

  
   }

   onChangePanelToPassRecover(){

      this.forgot_panel=true;
      this.create_pass_panel=false;

   }

   validateRecoverOTP(){
    
    console.log( this._global.response);
    if(this.register.mobile_email_otp==''){
      this.err_forgot=true;
      this.err_msg_forgot='*OTP is required !';
    }
    else if(this.register.mobile_email_otp !=this._global.response.otp){

      this.err_forgot=true;
      this.err_msg_forgot='Invalid OTP !';
    }
    else{

        this.err_forgot=false;
        this.recovery_otp_panel=false;
        this.create_pass_panel=true;

    }

   }
   onForgotUpdate(){

      if(this.register.password !=this.register.confirm_password){

        this.err_forgot=true;
        this.err_msg_forgot='Confirm password should be same as password';
      }
      else{
        
        $('div').preloader();

        var data="mobile_email="+this.register.mobile_email+"&password="+this.register.password+
                  "&verifycode="+this.register.mobile_email_otp;
  
        this.loginService.forgotUserUpdate(data).subscribe(
            (response)=>
            {
    
            this._global.response=response;
    
            if(this._global.response.status==201){
    
                  this.err_forgot=true;
                  this.err_msg_forgot=this._global.response.message;
    
            }
            else if(this._global.response.status==200){
    
                  this.recovery_otp_panel=false;
                  this.create_pass_panel=false;
                  this.login_panel=true;
                  this.succ_login=true;
                  this.succ_msg_login=this._global.response.message;
                  this.register=new Register();
    
            }
                $('div').preloader('remove');
                console.log('RESPONSE ARRIVED');
                console.log(this._global.response);
    
            },
            (error)=>{
    
              $('div').preloader('remove');
            console.log('RESPONSE FAILED');console.log(error)}
            );

      }
    console.log(this.register);

   }

   signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);

    
  }


  registerViaSocial(u){

      console.log('Registering');
      console.log(this.socialuser);
      return new Promise((resolve, reject) => {

           var data=u;
    console.log('final DATA');
    console.log(data);

    this.registerService.registerUser(data).subscribe(
          (response)=>
              {
             
                this._global.response=response;

              if(this._global.response.status==201){

                     this.err=true;
                     this.err_msg=this._global.response.message;

              }
              else if(this._global.response.status==200){

                   
                    this.login.login_data=this.register;
                    var my_mobile=parseInt(this.socialuser.email);
                    var my_email='';
               

                    if(isNaN(my_mobile)){
                      
                      my_email=this.socialuser.email;
                      this.login.login_data.name=this.socialuser.name;
                      this.login.login_data.email=this.socialuser.email;
                      this.login.login_data.mobile_email=this.socialuser.email;
                      this.login.login_data.mobile='';
                  //    this._global.user_data= this.login.login_data;
                      this.localStorage.setObject('u_i', this.login.login_data);
                    }
                    else{

                      // this.login.login_data.name=this.register.name;
                      // this.login.login_data.email='';
                      // this.login.login_data.mobile=this.register.mobile_email;
                      // this._global.user_data= this.login.login_data;
                      // this.localStorage.setObject('u_i', this.login.login_data);
                    }
                  
                    console.log(this.socialuser);
                   
                    this.reg_step='1';
                    this.register=new Register();
                    this.succ=true;
                    this.succ_msg='You are successfully registered, you can login now.!';

                    console.log('This is our Emit Data');
                    console.log(this.login.login_data);
                    this.UserData.emit(this.login.login_data);
                    
                    // Emitting Our Super Cool Event.
                    this.is_logged_in.emit(this.login.login_data);
                    
                    setTimeout(function(){
                       
                      $(".login_popup").css("display", "none");
                      $(".services_popup").css("display", "block");
                    }, 600);
                   
                   

              }
                //   $('div').preloader('remove');
                   console.log('RESPONSE ARRIVED');
                   console.log(this._global.response);
              
              },
          (error)=>{
              
               // $('div').preloader('remove');
               console.log('RESPONSE FAILED');console.log(error)}
      );
    


      });
    // $('div').preloader();
   
  }

  checkEmailIdExist(mobile_email){

  //  $('div').preloader();
    return new Promise((resolve, reject) => {
     

      var data="mobile_email="+mobile_email;

      this.registerService.validateEmailMobile(data).subscribe(
            (response)=>
                {
                this._global.response=response;

                if(this._global.response.status==201){

                       //this.err=true;
                       //this.err_msg=this._global.response.message;
                     //   return false;
                        reject();
                }
                else if(this._global.response.status==200){

                    console.log('MY RESPONSDE');
                    console.log(response);
                      //this.reg_step='3';
                      resolve();
                     // return true;


                }
                   //  $('div').preloader('remove');
                
                },
            (error)=>{
                
                 // $('div').preloader('remove');
                 console.log('RESPONSE FAILED');console.log(error)}
        );
    });
   


  }

}
