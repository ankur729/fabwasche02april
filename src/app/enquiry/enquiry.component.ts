import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import {EnquiryService } from './enquiry.service';
import {Enquiry} from './enquiry.model';
declare   var jquery:any;
declare var $ :any;
@Component({
  selector: 'app-enquiry',
  templateUrl: './enquiry.component.html',
  styleUrls: ['./enquiry.component.css']
})
export class EnquiryComponent implements OnInit {

  @Input() isenquiry:boolean;
  @Output() onCloseEnquiry = new EventEmitter<boolean>();
  
  enquiry:Enquiry;
  name:string;
  email:string;
  category_id:string;
  msg:string;

  constructor(private enquiryService:EnquiryService) { }

  ngOnInit() {
  }


  closeEnquiryForm(){

    console.log('Closing Enquiry');
    this.onCloseEnquiry.emit(true);
    //this.isenquiry=false;
  }

  saveEnquiry(){

    console.log(this.name);

    $('div').preloader();
    var data="name="+this.name+"&email="+this.email+"&category_id="+this.category_id+"&msg="+this.msg;
    console.log(data);
    this.enquiryService.sendEnquiry(data).subscribe(
          (response)=>
              {
                
                console.log('Enquiry response');
                console.log(response);
                this.name='';
                this.msg='';
                this.email='';
                this.category_id='';
                $('div').preloader('remove');
              
              },
          (error)=>{
              
            $('div').preloader('remove');
               console.log('RESPONSE FAILED');console.log(error)}
      );

  }
}
