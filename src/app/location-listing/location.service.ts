import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Location } from './location.model';
import {AppGlobals} from '../app.global';

@Injectable()

export class LocationService{
    
    location: Location;
  
    constructor(private http:HttpClient,private _global:AppGlobals){

      console.log('HOME PAGE');
     // console.log(this._global.baseAppUrl+this._global.apiUrl);
    }

    // getHomePageData(){
        

    //   return  this.http.get<Location>(this._global.baseAppUrl+this._global.apiUrl+'globalsettings');
    // }

    getLocationServices(data){

      return this.http.post(this._global.baseAppUrl+this._global.apiUrl+'baseapi/gethomepagedata' , 
      data,this._global.httpOptions).map(x => {
               
                  return x;
              })  ;

  }

 
  
}