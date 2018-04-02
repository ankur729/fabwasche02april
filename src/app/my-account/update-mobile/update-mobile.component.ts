import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { last } from 'rxjs/operators/last';
import { first } from 'rxjs/operator/first';
import {AppGlobals} from '../../app.global';
import {MyAccountService} from  '../my-account.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
declare   var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-update-mobile',
  templateUrl: './update-mobile.component.html',
  styleUrls: ['./update-mobile.component.css']
})
export class UpdateMobileComponent implements OnInit {

  @Input() user_id: string;
  @Input() user_mobile: string;
  @Input() verify_otp: string;
  @Input() name: string;
  @Input() loggedInUserData: any;
  @Output() onCloseUpdateMobile=new EventEmitter<boolean>();

  hiddenMobile:string;

  err_login:boolean
  err_msg_login:string;

  user_entered_otp:string;
  
  constructor(public _global:AppGlobals,private myAccountService:MyAccountService,public localStorage:CoolLocalStorage,) { }

  ngOnInit() {
    console.log('child loaded');
    console.log(this.user_mobile);

    this.hiddenMobile= this.hiddenMobileFn(this.user_mobile);
  
    console.log(this.hiddenMobile);
    console.log(this.verify_otp);
    this.err_login=false;
    this.err_msg_login='';
  }

  hiddenMobileFn(mobile){

    var first2=this.user_mobile.slice(0,2);
    var last2=this.user_mobile.slice(8,10);
    var mid_string="xxxxxx";
    var final_str=first2+mid_string+last2;

    return final_str;
  }

  onUpdateProfileClick(){

    console.log('This is user entered OTP');
    console.log(this.user_entered_otp);

    if(this.user_entered_otp==''){

      this.err_login=true;
      this.err_msg_login='*OTP required.!';


    }
    else if(isNaN(parseInt(this.user_entered_otp))){

      this.err_login=true;
      this.err_msg_login='*Invalid OTP.!';

    }
    else if(parseInt(this.user_entered_otp)!=parseInt(this.verify_otp)){

      this.err_login=true;
      this.err_msg_login='*Invalid OTP.!';

    }
    else if(parseInt(this.user_entered_otp)==parseInt(this.verify_otp)){

      this.err_login=false;
      this.err_msg_login='';
      console.log('ALL VALID');

      var data="name="+this.name+"&email_mobile="+this.user_mobile+"&type=mobile"+"&user_id="+this.user_id;

      $('div').preloader();
      this.myAccountService.updateUserProfile(data).subscribe(

        (response)=>
            {
              console.log('Profile upate response');
              console.log(response);
              console.log('This is our logged in user data');
              console.log(this.loggedInUserData);
              if(this.loggedInUserData.hasOwnProperty('mobile_email')){

               this.loggedInUserData.mobile_email=this.user_mobile;
        
              }
              else{
        
                this.loggedInUserData.mobile=this.user_mobile
        
              }
              this.loggedInUserData.name=this.name;

              this.localStorage.removeItem('u_i');
              this.localStorage.setObject('u_i',this.loggedInUserData);

              this.onClose();
            
            $('div').preloader('remove');
            },
          (error)=>{
              
                $('div').preloader('remove');
              console.log('RESPONSE FAILED');console.log(error)}
      );
    }


  }

  resendOTP(){


    $('div').preloader();

    this._global.sendOTP(this.user_mobile).subscribe(

      (response)=>
          {
          $('div').preloader('remove');
          
          console.log(response);
          var res:any=response;
          if(res.status==200){

            this.verify_otp=res.otp;
            this.err_login=true;
            this.err_msg_login='*OTP successfully resend.!'
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

  onClose(){

     
    this.onCloseUpdateMobile.emit(true);
  }

}
