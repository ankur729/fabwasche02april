import { Component,OnInit,Input } from '@angular/core';
import {AppGlobals} from './app.global';

declare   var jquery:any;
declare var $ :any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit  {
  title = 'app';
  @Input() err_page:boolean;
 

  constructor(private _global:AppGlobals,) {
    console.log('APP URL');
 

 }

  ngOnInit(){
     
    //this.err_page=false;
  }
 
 
}
