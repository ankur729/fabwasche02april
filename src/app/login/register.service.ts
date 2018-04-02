import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
 
import { Register } from './register.model';
import {AppGlobals} from '../app.global';
import 'rxjs/add/operator/map';
@Injectable()

export class RegisterService{
    
    register: Register;
  
    constructor(private http:HttpClient,private _global:AppGlobals){

      console.log('HOME PAGE');
     // console.log(this._global.baseAppUrl+this._global.apiUrl);
    }

    validateEmailMobile(data){

        console.log('THIS IS SERVICE');
       
        return this.http.post(this._global.baseAppUrl+this._global.apiUrl+'loginapi/getotpforregister' , 
        data,this._global.httpOptions).map(x => {
                 
                    return x;
                })  ;
         
    }
    
    validateReferalCode(data){

        return this.http.post(this._global.baseAppUrl+this._global.apiUrl+'loginapi/checkrefcodeexist' , 
        data,this._global.httpOptions).map(x => {
                 
                    return x;
                })  ;

    }

    registerUser(data){

        return this.http.post(this._global.baseAppUrl+this._global.apiUrl+'loginapi/registercustomer' , 
        data,this._global.httpOptions).map(x => {
                 
                    return x;
                })  ;

    }
    


}