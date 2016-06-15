import {Component, NgZone, Directive, Attribute, ElementRef, DynamicComponentLoader, Pipe, PipeTransform} from 'angular2/core';
import { FORM_DIRECTIVES, CORE_DIRECTIVES, DatePipe, NgIf, NgFor} from 'angular2/common';
import { JwtHelper } from './angular2-jwt';
import {Login} from "./Login";

import {AngularFire, FirebaseAuth} from 'angularfire2';
import {
ROUTER_DIRECTIVES,
ROUTER_PROVIDERS,
HashLocationStrategy,
LocationStrategy,
RouteConfig, Router, RouterOutlet, RouteParams, RouterLink, ComponentInstruction
} from 'angular2/router';

import {Observable} from 'rxjs/Observable';
//import {observableFirebaseObject, observableFirebaseArray} from './myfbOb';

@Component({
    selector: 'reports',
    template: `
<div class="home">
    <br/>
    <div style="color:green">
        Select store to show your records:
        <label *ngFor="#d of stores | async" >
           <input class="radio-inline" type="radio" name="nstores" (click)="showStoreTrans(d.name, d.ownerid)" checked="checked" /> {{d.name }} &nbsp;
        </label>
    </div>
    <div *ngIf="selectedstore">
    For store: {{selectedstore}}
    <table  border="1"  cellpadding="0" cellspacing="0"  style="border-collapse:collapse;">
        <tr>
          <th> Branch</th><th> Date</th><th> Type</th><th>Cardtype</th><th> Invoice# </th><th>Total$</th><th>Reason</th><th>Points</th>
        </tr>
        <tr *ngFor="#kk of ownertrans | async" >
          <td> {{kk.branch }}</td><td> {{kk.date }} </td><td> {{kk.ttype }} </td><td> {{kk.cardtype}} </td><td> {{kk.invoice}} </td><td>{{kk.totaldollar}}</td><td> {{kk.reason}}</td><td> {{kk.points}}</td>
        </tr>

    </table>
    </div>
</div>
	`,
    directives: [NgFor, RouterLink],
})
export class OwnerReports  {
    //messagesRef: Firebase;
    jwt: string;
    decodedJwt: string;
    jwtHelper: JwtHelper = new JwtHelper();
    carduid: string;
    stores: Observable<any[]>;
    selectedstore: string;
    selectedownerid: string;
    static s_store: string;
    static s_ownerid: string;
    ownertrans: Observable<any[]>;
    constructor(_parentRouter: Router, public af: AngularFire) {
        //,_elementRef: ElementRef, _loader: DynamicComponentLoader,
        //_parentRouter: Router, @Attribute('name') nameAttr: string) {
        //super(_elementRef, _loader, _parentRouter, nameAttr);
        //this.messagesRef = Login.messagesRef;

        if (!localStorage.getItem('uid')) {
            _parentRouter.parent.navigateByUrl('/Login');
        }
        this.jwt = localStorage.getItem('uid');
        //var uu = this.jwt && this.jwtHelper.decodeToken(this.jwt);
        this.carduid = this.jwt;// uu.d.uid; uu.d.uid;
        this.selectedownerid = this.carduid;
       // console.log("id:" + this.carduid);
        //var usersRef = this.messagesRef.child("users").child(this.carduid).child("stores");
        this.stores = this.af.list("/users/" + this.carduid + "/stores");// observableFirebaseArray(usersRef);
        let oo = this.stores;
        oo.subscribe(res => {
            if (res) {
                res.map(function (item) {
                    //console.log("name:" + item.name );
                    OwnerReports.s_store = item.name;
                    //OwnerReports.s_ownerid = this.carduid;
                });
            }
        }
        );
        setTimeout(() => {
            //console.log("storename:" + OwnerReports.s_store + " id=" + OwnerReports.s_ownerid );
            if (OwnerReports.s_store) {
                this.selectedstore = OwnerReports.s_store;
                this.selectedownerid = this.carduid;
                this.showStoreTrans(OwnerReports.s_store, this.carduid);
            }
        }, 1300);
    }
    showStoreTrans(store: string, ownerid: string) {
        this.selectedstore = store;
        this.selectedownerid = ownerid;
        //console.log("Hhh:" + this.selectedownerid + "  st" + this.selectedstore);
        //var usersRef = this.messagesRef.child("xyz").child(ownerid).child(store);
       // var usersRef = this.messagesRef.child("users").child(this.carduid).child("stores").child(this.selectedstore).child("transaction"); //this.messagesRef.child("transaction").child(this.selectedownerid).child("buyatstores");

        this.ownertrans = this.af.list("/users/" + this.carduid + "/stores/" + this.selectedstore + "/transaction");// observableFirebaseArray(usersRef);
        //let oo = this.ownertrans;
        //oo.subscribe(res => {
        //    if (res) {
        //        res.map(function (item) {
        //            console.log("name:" + item.branch + " id=" + item.ttype + item.points);
        //        });
        //    }
        //}
        //);
    }
}