import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-failure',
  templateUrl: './payment-failure.component.html',
  styleUrls: ['./payment-failure.component.css']
})
export class PaymentFailureComponent implements OnInit {

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
