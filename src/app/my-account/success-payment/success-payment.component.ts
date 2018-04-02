import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success-payment',
  templateUrl: './success-payment.component.html',
  styleUrls: ['./success-payment.component.css']
})
export class SuccessPaymentComponent implements OnInit {

  constructor(private router:Router) {

   }

  no_service_popup:boolean;

  ngOnInit() {

    this.no_service_popup=true;
  }

  onClosePaymentPopup(){

    this.router.navigate(['/my-account']);
  }

}
