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
var MemberReports = (function () {
    function MemberReports(_parentRouter, af) {
        //,_elementRef: ElementRef, _loader: DynamicComponentLoader,
        //_parentRouter: Router, @Attribute('name') nameAttr: string) {
        //super(_elementRef, _loader, _parentRouter, nameAttr);
        //this.messagesRef = Login.messagesRef;
        this.af = af;
        this.suredeletestore = false;
        this.jwtHelper = new angular2_jwt_1.JwtHelper();
        if (!localStorage.getItem('uid')) {
            _parentRouter.parent.navigateByUrl('/Login');
        }
        this.jwt = localStorage.getItem('uid');
        //var uu = this.jwt && this.jwtHelper.decodeToken(this.jwt);
        this.carduid = this.jwt; // uu.d.uid;
        this.loadStores();
    }
    MemberReports.prototype.loadStores = function () {
        var _this = this;
        // var usersRef = this.messagesRef.child("users").child(this.carduid).child("buyatstores");
        this.stores = this.af.list("/users/" + this.carduid + "/buyatstores"); //observableFirebaseArray(usersRef);
        var oo = this.stores;
        oo.subscribe(function (res) {
            if (res) {
                res.map(function (item) {
                    //console.log("name:" + item.name + " id=" + item.ownerid);
                    MemberReports.s_store = item.name;
                    MemberReports.s_ownerid = item.ownerid;
                });
            }
        });
        setTimeout(function () {
            //console.log("storename:" + MemberReports.s_store + " id=" + MemberReports.s_ownerid );
            if (MemberReports.s_store && MemberReports.s_ownerid) {
                _this.selectedStore = MemberReports.s_store;
                _this.selectedownerid = MemberReports.s_ownerid;
                _this.showStoreTrans(MemberReports.s_store, MemberReports.s_ownerid);
            }
        }, 1000);
    };
    MemberReports.prototype.showStoreTrans = function (store, ownerid) {
        this.selectedStore = store;
        this.selectedownerid = ownerid;
        //console.log("Hhh:" + store + ownerid);
        //var usersRef = this.messagesRef.child("users").child(this.carduid).child("buyatstores").child(this.selectedStore).child("transaction"); //this.messagesRef.child("transaction").child(this.selectedownerid).child("buyatstores");
        this.trans = this.af.list("/users/" + this.carduid + "/buyatstores/" + this.selectedStore + "/transaction"); // observableFirebaseArray(usersRef);
    };
    MemberReports.prototype.deleteStore = function () {
        //this.messagesRef.child("users").child(this.carduid).child("buyatstores").child(this.selectedStore)
        this.af.object("/users/" + this.carduid + "/buyatstores/" + this.selectedStore).remove();
        this.suredeletestore = false;
        this.loadStores();
    };
    MemberReports = __decorate([
        core_1.Component({
            selector: 'home',
            directives: [router_1.ROUTER_DIRECTIVES],
            template: "\n<div class=\"home\">\n    <br/>\n    <div style=\"color:green\">\n        Select store to show your records:<br/>\n        <label *ngFor=\"#d of stores | async\" >\n           <input  class=\"radio-inline\" type=\"radio\" name=\"nstores\" (click)=\"showStoreTrans(d.name, d.ownerid)\" checked=\"checked\" /> {{d.name }} &nbsp;\n        </label>\n    </div>\n    <div *ngIf=\"selectedStore\">\n            <button class=\"btn btn-primary\" [disabled]=\"!selectedStore\" [hidden]=\"suredeletestore\"  (click)=\"suredeletestore = true\">Delete</button>\n            <button class=\"btn btn-primary\" [hidden]=\"!selectedStore || !suredeletestore\"  (click)=\"deleteStore()\"  style=\"color:Crimson\">Sure to delete? Yes</button>\n            <button class=\"btn btn-primary\" [hidden]=\"!selectedStore || !suredeletestore\"  (click)=\"suredeletestore = false\"  style=\"color:DarkGreen\">Sure to delete? Cancel</button>\n\n    For store: {{selectedStore}}\n    <table  border=\"1\"  cellpadding=\"0\" cellspacing=\"0\"  style=\"border-collapse:collapse;\">\n        <tr>\n          <th> Branch</th><th> Date</th><th> Type</th><th>Cardtype</th><th> Invoice# </th><th>Total$</th><th>Reason</th><th>Points</th>\n        </tr>\n        <tr *ngFor=\"#t of trans | async\" >\n          <td> {{t.branch }}</td><td> {{t.date }} </td><td> {{t.ttype }} </td><td> {{t.cardtype}} </td><td> {{t.invoice}} </td><td>{{t.totaldollar}}</td><td> {{t.reason}}</td><td> {{t.points}}</td>\n        </tr>\n    </table>\n    </div>\n</div>\n  "
        }), 
        __metadata('design:paramtypes', [router_1.Router, angularfire2_1.AngularFire])
    ], MemberReports);
    return MemberReports;
}());
exports.MemberReports = MemberReports;
//# sourceMappingURL=MemberReports.js.map