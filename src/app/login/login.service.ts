import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Login } from './login.model';
import {AppGlobals} from '../app.global';

@Injectable()

export class LoginService{
    
    home: Login;
  
    constructor(private http:HttpClient,private _global:AppGlobals){

      console.log('HOME PAGE');
     // console.log(this._global.baseAppUrl+this._global.apiUrl);
    }

    getHomePageData(){
        

      return  this.http.get<Login>(this._global.baseAppUrl+this._global.apiUrl+'globalsettings');
    }

    loginUser(data){

      return this.http.post(this._global.baseAppUrl+this._global.apiUrl+'loginapi/makecustomerlogin' , 
      data,this._global.httpOptions).map(x => {
               
                  return x;
              })  ;

  }

  forgotUser(data){

    return this.http.post(this._global.baseAppUrl+this._global.apiUrl+'loginapi/forgotpasswordotp' , 
    data,this._global.httpOptions).map(x => {
             
                return x;
            })  ;

  }

  forgotUserUpdate(data){

    return this.http.post(this._global.baseAppUrl+this._global.apiUrl+'loginapi/resetpassword' , 
    data,this._global.httpOptions).map(x => {
             
                return x;
            })  ;

  }
  
}