import { Injectable } from '@angular/core';
 
import { HttpClient,HttpHeaders } from '@angular/common/http';
 
@Injectable()
export class AppGlobals {
    readonly baseAppUrl: string = 'http://idigities.com/fab/';
    readonly apiUrl:string='management/api/';

    
    readonly imgUrl:string=this.baseAppUrl+'management/public/uploads/images/thumb/';
    readonly imgUrl_thumb:string=this.baseAppUrl+'management/public/uploads/images/thumb/';
    readonly imgUrl_large:string=this.baseAppUrl+'management/public/uploads/images/large/';
    readonly imgUrl_medium:string=this.baseAppUrl+'management/public/uploads/images/medium/';
    readonly imgUrl_raw:string=this.baseAppUrl+'management/public/uploads/images/raw/';
    readonly imgUrl_small:string=this.baseAppUrl+'management/public/uploads/images/small/';
  //  readonly baseAPIUrl: string = 'Baseapi/globalsettings';
  
  //Payment Gateway Details

  readonly payu_key:string='gtKFFx';
  readonly payu_salt:string='eCwWELxi';
  readonly payu_service_provider:string='payubiz';
  readonly payu_surl:string='http://localhost:4200';
  readonly payu_furl:string='http://localhost:4200';
  
    
  services: any[];
  user_data:any;
  err_page:boolean=true;
  customer_wallet_restrict:string;

  constructor(private http:HttpClient) {
            this.services = [{ id: '1001', name: 'Kitchen-Cleaning'},
            { id: '1002', name: 'Dry-Cleaning'},
            { id: '1003', name: 'Bathroom-Cleaning'},
            { id: '1004', name: 'Sofa-Cleaning'},
            { id: '1005', name: 'Home-Cleaning'},
            ];
        }
 
    readonly httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/x-www-form-urlencoded',
             
            })
          };

 public response:any;


    public sendOTP(mobile){
 
      var data="mobile="+mobile;
     return this.http.post(this.baseAppUrl+this.apiUrl+'loginapi/getotponcart' , 
          
            data,this.httpOptions).map(x => {
                  
                      return x;
                  })  ;
    }

//    arrayFactory<T>(obj: { [key: number]: T }): T[] {
//     let arr = [];

//     Object.keys(obj).forEach(key => {
//         arr[parseInt(key)] = obj[key];
//     });

//     return arr;
// }
}
