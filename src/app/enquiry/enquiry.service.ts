import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
 
import {AppGlobals} from '../app.global';

@Injectable()

export class EnquiryService{
    
    constructor(private http:HttpClient,private _global:AppGlobals){

        console.log('HOME PAGE');
       // console.log(this._global.baseAppUrl+this._global.apiUrl);
      }

    sendEnquiry(data){

      return this.http.post(this._global.baseAppUrl+this._global.apiUrl+'baseapi/insertenquiry' , 
      data,this._global.httpOptions).map(x => {
               
                  return x;
              })  ;

  }

 
  
}