import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {HomeCleaning } from './home-cleaning.model';
import {AppGlobals} from '../app.global';

@Injectable()

export class HomeCleaningService{
    
    // homeCleaning: HomeCleaning;
  
    constructor(private http:HttpClient,private _global:AppGlobals){

      
     // console.log(this._global.baseAppUrl+this._global.apiUrl);
    }

    getStepOneData(id){
        

      return  this.http.get(this._global.baseAppUrl+this._global.apiUrl+'services/getcategories/'+id).map(x=>{
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
        return this.http.post(this._global.baseAppUrl+this._global.apiUrl+'order/add' , 
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