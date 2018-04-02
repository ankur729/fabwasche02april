import { Component, OnInit,Input } from '@angular/core';
declare   var jquery:any;
declare var $ :any;
@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  constructor() { }

  @Input() err_page:boolean;

  ngOnInit() {
    this.err_page=true;
  }

  onClose(){

    
 
      $(".page_404").css("display", "none");
       
     
  }
} 
