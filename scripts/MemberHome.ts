
import {Component,NgZone, Directive, Attribute, ElementRef, DynamicComponentLoader, Pipe, PipeTransform} from 'angular2/core';
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
    selector: 'member-home',
    directives: [ROUTER_DIRECTIVES],
    template: `
<div class="home">
    <br/>
Welcome {{fname}} {{lname}}

</div>
  `
}) 
    
export class MemberHome {
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
    trans: Observable<any[]>;

    fname: string;
    lname: string;
    email: string;
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

        let my: Observable<any> = this.af.object("/users/" + this.carduid );//observableFirebaseObject(this.messagesRef.child("users").child(this.carduid));
        my.subscribe(kk=> {
            this.fname = kk.fname;
            this.lname = kk.lname;
            this.email = kk.email;
        }
        );

    }
 
}