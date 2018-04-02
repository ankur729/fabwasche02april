import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
 
import {AppGlobals} from '../app.global';

@Injectable()

export class DryCleaningService

{
    
    // homeCleaning: HomeCleaning;
  
    constructor(private http:HttpClient,private _global:AppGlobals){

      
     // console.log(this._global.baseAppUrl+this._global.apiUrl);
    }

    getPackagesByDeliveryOptions(data){
        

        return this.http.post(this._global.baseAppUrl+this._global.apiUrl+'services/get_packages_by_delivery_option', 
        data,this._global.httpOptions).map(x => {
                 
                    return x;
                })  ;

      }

    getMonthlyPackages(){
        

      return  this.http.get(this._global.baseAppUrl+this._global.apiUrl+'services/get_monthly_service/').map(x=>{
          return x;
      });
    }

    getStepTwoData(id){
        

        return  this.http.get(this._global.baseAppUrl+this._global.apiUrl+'services/getpackages/'+id).map(x=>{
            return x;
        });
      }

    getStepThreeData(id){
        

        return  this.http.get(this._global.baseAppUrl+this._global.apiUrl+'services/getpackages/'+id).map(x=>{
            return x;
        });
      }

    preOrder(data){
        //this._global.baseAppUrl+this._global.apiUrl
        return this.http.post(this._global.baseAppUrl+this._global.apiUrl+'order/add_monthly_order' , 
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

    getCustomerWalletData(data){

        return this.http.post(this._global.baseAppUrl+this._global.apiUrl+'customer/customerwalletbalance', 
        data,this._global.httpOptions).map(x => {
                 
                    return x;
                })  ;


    }

}