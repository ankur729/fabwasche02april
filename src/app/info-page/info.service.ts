import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
 
import {AppGlobals} from '../app.global';

@Injectable()

export class InfoService{
    
   
  
    constructor(private http:HttpClient,private _global:AppGlobals){

  
     // console.log(this._global.baseAppUrl+this._global.apiUrl);
    }

    // getHomePageData(){
        

    //   return  this.http.get<Location>(this._global.baseAppUrl+this._global.apiUrl+'globalsettings');
    // }

    getPagesData(slug){

        return  this.http.get(this._global.baseAppUrl+this._global.apiUrl+'baseapi/getpagedata/'+slug).map(x=>{
            return x;
        });

  }

 
  
}