import { bootstrap } from 'angular2/platform/browser';
import {Component,  NgZone, Directive, Attribute, ElementRef, DynamicComponentLoader, Pipe, PipeTransform} from 'angular2/core';
import { FORM_DIRECTIVES, CORE_DIRECTIVES, DatePipe, NgIf,NgFor} from 'angular2/common';
import { JwtHelper } from './angular2-jwt';
import {Login} from "./Login";

import {
ROUTER_DIRECTIVES,
ROUTER_PROVIDERS,
HashLocationStrategy,
LocationStrategy,
RouteConfig, Router, RouterOutlet, RouteParams, RouterLink, ComponentInstruction
} from 'angular2/router';

import {Observable} from 'rxjs/Observable';
//import {observableFirebaseObject, observableFirebaseArray} from './myfbOb';

import {AngularFire, FirebaseAuth} from 'angularfire2';

@Component({
    selector: 'home',
    directives: [ROUTER_DIRECTIVES],
    template: `
    <div  class="home">Your stores:
        <div>
            <label   *ngFor="#dd of ownerstores | async">
                <input class="form-control" type="radio" name= "nownerstores" value="{{dd.name}}" (click)="selectStore(dd.name,dd.ownerid)" > {{dd.name }}
            </label>
        </div>
    </div>
  <div *ngIf="store" >
   Welcome to :  {{store}}  <br>

 </div>

  `
}) 

export class OwnerHome {
    ownerstores: Observable<any[]>;

    cardloaded: boolean = false;
    issuecard: boolean = false;
    cardtypes: Observable<any[]>;
    //messagesRef: Firebase;
    store: string;
    branch: string;
    cardemail: string;
    carduid: string;
    name: string;
    points: number;
    last: string;
    //lasts: string;
    expiry: string;
    cardtype: string;

    itotal: number;
    reason: string;
    inumber: string;
    redeempoints: number;
    ptype: number;
    private parentRouter: Router;
    
    showMore: boolean;
    err: string;
    dollarpoints: number = 1;
    renewYears: number = 1;
    maxPurchase: number = 1000;
    maxRedeem: number = 1000;

    employeeuid: string;
    storeownerid: string;
    jwt: string;
    decodedJwt: string;
    jwtHelper: JwtHelper = new JwtHelper();
    constructor(params: RouteParams, private zone: NgZone, _parentRouter: Router, public af: AngularFire) {
        //,_elementRef: ElementRef, _loader: DynamicComponentLoader,
        //_parentRouter: Router, @Attribute('name') nameAttr: string) {
        //super(_elementRef, _loader, _parentRouter, nameAttr);

        this.ptype = 0;
        this.showMore = false;
        //this.store = localStorage.getItem('store'); //params.get('a');
        //this.storeownerid = localStorage.getItem('ownerid'); //params.get('b');
        this.parentRouter = _parentRouter;
        console.log("aaaa1111");
        if (!localStorage.getItem('uid')) {
            this.parentRouter.parent.navigateByUrl('/Login');
        }
        this.jwt = localStorage.getItem('uid');
        //var uu = this.jwt && this.jwtHelper.decodeToken(this.jwt);
        this.storeownerid = this.jwt;// uu.d.uid;
        //this.messagesRef = Login.messagesRef;
        this.ownerstores = this.af.list("/users/" + this.storeownerid + "/stores");// observableFirebaseArray(this.messagesRef.child("users").child(this.storeownerid).child("stores").limitToLast(100));

        //var usersRef = this.messagesRef.child("users").child(this.employeeuid).child("loginstores").child(this.store);
        //let o: Observable<any> = observableFirebaseObject(usersRef);
        //o.subscribe(res => {
        //    this.storeownerid = res.ownerid;
        //}
        //);

        //var rref = this.messagesRef.child("users").child(this.storeownerid).child("stores").child(this.store);
        //let ostore: Observable<any> = observableFirebaseObject(rref);
        //ostore.subscribe(res => {
        //    this.renewYears = res.renewYears,
        //    this.maxPurchase = res.maxpurchase;
        //    this.maxRedeem = res.maxredeem;
        //}
        //);
        //this.cardtypes = observableFirebaseArray(this.messagesRef.child("users").child(this.storeownerid).child("stores").child(this.store).child("cardtypes").limitToLast(100));
    }
    selectStore(store: string, ownerid: string) {
        this.store = store;
        //console.log("go to home");
        //localStorage.setItem("store", store);
        //localStorage.setItem("ownerid", ownerid);
        //this.router.parent.navigate(['/OwnerHome']);
    }


}