"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('angular2/core');
var angular2_jwt_1 = require('./angular2-jwt');
var router_1 = require('angular2/router');
//import {observableFirebaseObject, observableFirebaseArray} from './myfbOb';
var angularfire2_1 = require('angularfire2');
var OwnerHome = (function () {
    function OwnerHome(params, zone, _parentRouter, af) {
        //,_elementRef: ElementRef, _loader: DynamicComponentLoader,
        //_parentRouter: Router, @Attribute('name') nameAttr: string) {
        //super(_elementRef, _loader, _parentRouter, nameAttr);
        this.zone = zone;
        this.af = af;
        this.cardloaded = false;
        this.issuecard = false;
        this.dollarpoints = 1;
        this.renewYears = 1;
        this.maxPurchase = 1000;
        this.maxRedeem = 1000;
        this.jwtHelper = new angular2_jwt_1.JwtHelper();
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
        this.storeownerid = this.jwt; // uu.d.uid;
        //this.messagesRef = Login.messagesRef;
        this.ownerstores = this.af.list("/users/" + this.storeownerid + "/stores"); // observableFirebaseArray(this.messagesRef.child("users").child(this.storeownerid).child("stores").limitToLast(100));
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
    OwnerHome.prototype.selectStore = function (store, ownerid) {
        this.store = store;
        //console.log("go to home");
        //localStorage.setItem("store", store);
        //localStorage.setItem("ownerid", ownerid);
        //this.router.parent.navigate(['/OwnerHome']);
    };
    OwnerHome = __decorate([
        core_1.Component({
            selector: 'home',
            directives: [router_1.ROUTER_DIRECTIVES],
            template: "\n    <div  class=\"home\">Your stores:\n        <div>\n            <label   *ngFor=\"#dd of ownerstores | async\">\n                <input class=\"form-control\" type=\"radio\" name= \"nownerstores\" value=\"{{dd.name}}\" (click)=\"selectStore(dd.name,dd.ownerid)\" > {{dd.name }}\n            </label>\n        </div>\n    </div>\n  <div *ngIf=\"store\" >\n   Welcome to :  {{store}}  <br>\n\n </div>\n\n  "
        }), 
        __metadata('design:paramtypes', [router_1.RouteParams, core_1.NgZone, router_1.Router, angularfire2_1.AngularFire])
    ], OwnerHome);
    return OwnerHome;
}());
exports.OwnerHome = OwnerHome;
//# sourceMappingURL=OwnerHome.js.map