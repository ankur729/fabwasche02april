import { Component, OnInit,Input } from '@angular/core';
import {Payu} from '../location-listing/payu.model';
import { CoolLocalStorage } from 'angular2-cool-storage';
declare   var jquery:any;
declare var $ :any;
@Component({
  selector: 'app-payu',
  templateUrl: './payu.component.html',
  styleUrls: ['./payu.component.css']
})
export class PayuComponent implements OnInit {


  pay_model:Payu;
 

  @Input() is_payu_call:boolean;
  
  constructor(private localStorage: CoolLocalStorage) {
  //  this.pay_model=this.localStorage.getObject('payu');
       
   }

  ngOnInit() {

    console.log('PAYU COMPONENT LOADED');
    this.pay_model = Object.create(Payu.prototype);
     this.pay_model=this.localStorage.getObject('payu');
  console.log(this.localStorage.getObject('payu'));
     setTimeout(function(){
      
     $('#payuForm').submit();
    
       }, 1000);
    // this.pay_model=this.localStorage.getObject('payu');
   

    // setTimeout(function(){
      
    //  $('#payuForm').submit();
    
    // }, 3000);
    // console.log($('#mkey1').val());
    // console.log('f');
    // console.log(this.pay_model.key);
    //this.pay_model.key=pdata.key;
  }


  OnCallingPayu(data:any){

    console.log(' I AM CALLING');
}


}
