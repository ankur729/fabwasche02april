import { Component, OnInit } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Router } from '@angular/router';
@Component({
  selector: 'app-my-reffer',
  templateUrl: './my-reffer.component.html',
  styleUrls: ['./my-reffer.component.css']
})
export class MyRefferComponent implements OnInit {

  constructor(public localStorage:CoolLocalStorage,private  router: Router) { }

  loggedInUserData:any;


  ngOnInit() {
    console.log('REFFER COMPONSENT');
    this.loggedInUserData=this.localStorage.getObject('u_i');
    if(this.loggedInUserData!=undefined){

      
      this.loggedInUserData=this.localStorage.getObject('u_i');
      console.log("logged in user data from refer");
      console.log(this.loggedInUserData);
        //consol
     }
     else{
      this.router.navigate(['']);
     }

  }

}
