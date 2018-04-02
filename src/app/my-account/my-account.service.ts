import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
 
import {AppGlobals} from '../app.global';

@Injectable()

export class MyAccountService{
    
  
  
    constructor(private http:HttpClient,private _global:AppGlobals){

      console.log('My Account PAGE');
     // console.log(this._global.baseAppUrl+this._global.apiUrl);
    }
    
   
    updateUserProfile(data){

      return this.http.post(this._global.baseAppUrl+this._global.apiUrl+'customer/profile_update' , 
      data,this._global.httpOptions).map(x => {
               
                  return x;
              })  ;

  }

  fetchRegularOrder(data){

    // return  this.http.get(this._global.baseAppUrl+this._global.apiUrl+'order/regular_order/'+id).map(x=>{
    //       return x;
    //   });
    return this.http.post(this._global.baseAppUrl+this._global.apiUrl+'order/regular_order' , 
      data,this._global.httpOptions).map(x => {
               
                  return x;
              })  ;
  }

  fetchMonthlyOrder(data){

    // return  this.http.get(this._global.baseAppUrl+this._global.apiUrl+'order/regular_order/'+id).map(x=>{
    //       return x;
    //   });
    return this.http.post(this._global.baseAppUrl+this._global.apiUrl+'order/monthly_order' , 
      data,this._global.httpOptions).map(x => {
               
                  return x;
              })  ;
  }

  validateMonthlyUserQty(data){


    return this.http.post(this._global.baseAppUrl+this._global.apiUrl+'order/validate_user_monthly_order' , 
    data,this._global.httpOptions).map(x => {
             
                return x;
            })  ;
  }

  getMonthlyPackages(data){
        

    return this.http.post(this._global.baseAppUrl+this._global.apiUrl+'services/get_monthly_packages', 
    data,this._global.httpOptions).map(x => {
             
                return x;
            })  ;

  }

  getTimeSlots(data){

    return this.http.post(this._global.baseAppUrl+this._global.apiUrl+'services/gettimeslots', 
    data,this._global.httpOptions).map(x => {
             
                return x;
            })  ;


}

//   forgotUser(data){

//     return this.http.post(this._global.baseAppUrl+this._global.apiUrl+'loginapi/forgotpasswordotp' , 
//     data,this._global.httpOptions).map(x => {
             
//                 return x;
//             })  ;

//   }

//   forgotUserUpdate(data){

//     return this.http.post(this._global.baseAppUrl+this._global.apiUrl+'loginapi/resetpassword' , 
//     data,this._global.httpOptions).map(x => {
             
//                 return x;
//             })  ;

//   }
  
}