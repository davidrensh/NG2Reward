import {Component, NgZone, Directive, Attribute, ElementRef, DynamicComponentLoader, Pipe, PipeTransform} from 'angular2/core';
import { FORM_DIRECTIVES, CORE_DIRECTIVES, DatePipe, NgIf, NgFor} from 'angular2/common';
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
<div class="home">
    <br/>
    <div style="color:green">
        Select store to show your records:<br/>
        <label *ngFor="#d of stores | async" >
           <input  class="radio-inline" type="radio" name="nstores" (click)="showStoreTrans(d.name, d.ownerid)" checked="checked" /> {{d.name }} &nbsp;
        </label>
    </div>
    <div *ngIf="selectedStore">
            <button class="btn btn-primary" [disabled]="!selectedStore" [hidden]="suredeletestore"  (click)="suredeletestore = true">Delete</button>
            <button class="btn btn-primary" [hidden]="!selectedStore || !suredeletestore"  (click)="deleteStore()"  style="color:Crimson">Sure to delete? Yes</button>
            <button class="btn btn-primary" [hidden]="!selectedStore || !suredeletestore"  (click)="suredeletestore = false"  style="color:DarkGreen">Sure to delete? Cancel</button>

    For store: {{selectedStore}}
    <table  border="1"  cellpadding="0" cellspacing="0"  style="border-collapse:collapse;">
        <tr>
          <th> Branch</th><th> Date</th><th> Type</th><th>Cardtype</th><th> Invoice# </th><th>Total$</th><th>Reason</th><th>Points</th>
        </tr>
        <tr *ngFor="#t of trans | async" >
          <td> {{t.branch }}</td><td> {{t.date }} </td><td> {{t.ttype }} </td><td> {{t.cardtype}} </td><td> {{t.invoice}} </td><td>{{t.totaldollar}}</td><td> {{t.reason}}</td><td> {{t.points}}</td>
        </tr>
    </table>
    </div>
</div>
  `
})

export class MemberReports {
    suredeletestore: boolean = false;

    //messagesRef: Firebase;
    jwt: string;
    decodedJwt: string;
    jwtHelper: JwtHelper = new JwtHelper();
    carduid: string;
    stores: Observable<any[]>;
    selectedStore: string;
    selectedownerid: string;
    static s_store: string;
    static s_ownerid: string;
    trans: Observable<any[]>;
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
        this.carduid = this.jwt;// uu.d.uid;
        this.loadStores();

    }
    loadStores() {
       // var usersRef = this.messagesRef.child("users").child(this.carduid).child("buyatstores");
        this.stores = this.af.list("/users/" + this.carduid + "/buyatstores");//observableFirebaseArray(usersRef);
        let oo = this.stores;
        oo.subscribe(res => {
            if (res) {
                res.map(function (item) {
                    //console.log("name:" + item.name + " id=" + item.ownerid);
                    MemberReports.s_store = item.name;
                    MemberReports.s_ownerid = item.ownerid;
                });
            }
        }
        );
        setTimeout(() => {
            //console.log("storename:" + MemberReports.s_store + " id=" + MemberReports.s_ownerid );
            if (MemberReports.s_store && MemberReports.s_ownerid) {
                this.selectedStore = MemberReports.s_store;
                this.selectedownerid = MemberReports.s_ownerid;
                this.showStoreTrans(MemberReports.s_store, MemberReports.s_ownerid);
            }
        }, 1000);
    }
    showStoreTrans(store: string, ownerid: string) {
        this.selectedStore = store;
        this.selectedownerid = ownerid;
        //console.log("Hhh:" + store + ownerid);
        //var usersRef = this.messagesRef.child("users").child(this.carduid).child("buyatstores").child(this.selectedStore).child("transaction"); //this.messagesRef.child("transaction").child(this.selectedownerid).child("buyatstores");
        this.trans = this.af.list("/users/" + this.carduid + "/buyatstores/" + this.selectedStore + "/transaction");// observableFirebaseArray(usersRef);
    }
    deleteStore() {
        //this.messagesRef.child("users").child(this.carduid).child("buyatstores").child(this.selectedStore)
        this.af.object("/users/" + this.carduid + "/buyatstores/" + this.selectedStore ).remove();
        this.suredeletestore = false;
        this.loadStores();
    }
}