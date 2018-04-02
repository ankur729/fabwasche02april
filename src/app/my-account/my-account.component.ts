import { Component, OnInit } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { AppGlobals } from '../app.global';
import { Home } from '../home/home.model';
import { AuthService } from "angularx-social-login";
import { Router } from '@angular/router';
import { rootRoute } from '@angular/router/src/router_module';
 

declare   var jquery:any;
declare var $ :any;
@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {
  
  globaldata:Home;
  imgUrl:any;
  loggedInUserData:any;
  is_logged_in:boolean;
  editableText = 'myText';
  editablePassword = 'myPassword';
  editableTextArea = 'Text in text area';
  editableSelect = 2;
  editableSelectOptions =[
    {value: 1, text: 'status1'},
    {value: 2, text: 'status2', disabled:"false"},
    {value: 3, text: 'status3'},
    {value: 4, text: 'status4'}
  ];
  isenquiry:boolean
  routename:string;

  constructor(private _global: AppGlobals,public localStorage:CoolLocalStorage,private authService: AuthService,
    private  router: Router,) { 
      this.isenquiry=false; 
      this.routename='My Referral';
      console.log('This is url');
 
      var curr_url=this.router.url;
      var split_url=curr_url.split('/');
      
       var last_segment=split_url[split_url.length-1];
      
        if(last_segment=='orders'){
           
          this.routename='My Orders';
        }
        else if(last_segment=='my-account'){
          this.routename='My Refferal';
        }
       
    }

  ngOnInit() {
    console.log('MY ACCOUNT');
    
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
    this.globaldata=JSON.parse(localStorage.getItem('global'));
    console.log(this.globaldata);
    console.log(this._global);
    console.log(this.loggedInUserData);

 
    
  }


  logout(){
 
   
    this.authService.signOut();
    this.is_logged_in=false;
    $('div').preloader();

      setTimeout(()=>{ 

        this.router.navigate(['']);
        this.localStorage.removeItem('u_i');
        $('div').preloader('remove');
       
          }, 1500);
}

makeEditable(){
  $("#namefield").prop("disabled",false);
  $("#namefield").focus();
  console.log('ediut');
}

openEnquiryForm(){

  console.log('Open enquiry');
  this.isenquiry=true;
}

onCloseEnquiryHandler(data:any){

  console.log('Receiving Event');
  this.isenquiry=false;
}

onRouteChange(routename){
  console.log(routename);

  this.routename=routename;
}

ngOnChanges(){

  console.log('I HAVE CHANGED');
}
 
ngAfterContentChecked(){

  this.loggedInUserData=this.localStorage.getObject('u_i');
}


}
