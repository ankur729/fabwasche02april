import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Home } from './home.model';
import {AppGlobals} from '../app.global';

@Injectable()

export class HomeService{
    
    home: Home;
  
    constructor(private http:HttpClient,private _global:AppGlobals){

      console.log('HOME PAGE');
     // console.log(this._global.baseAppUrl+this._global.apiUrl);
    }

    getHomePageData(){
        

      return  this.http.get<Home>(this._global.baseAppUrl+this._global.apiUrl+'baseapi/globalsettings');
    }

}