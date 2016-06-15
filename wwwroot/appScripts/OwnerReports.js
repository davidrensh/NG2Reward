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
var common_1 = require('angular2/common');
var angular2_jwt_1 = require('./angular2-jwt');
var angularfire2_1 = require('angularfire2');
var router_1 = require('angular2/router');
//import {observableFirebaseObject, observableFirebaseArray} from './myfbOb';
var OwnerReports = (function () {
    function OwnerReports(_parentRouter, af) {
        //,_elementRef: ElementRef, _loader: DynamicComponentLoader,
        //_parentRouter: Router, @Attribute('name') nameAttr: string) {
        //super(_elementRef, _loader, _parentRouter, nameAttr);
        //this.messagesRef = Login.messagesRef;
        var _this = this;
        this.af = af;
        this.jwtHelper = new angular2_jwt_1.JwtHelper();
        if (!localStorage.getItem('uid')) {
            _parentRouter.parent.navigateByUrl('/Login');
        }
        this.jwt = localStorage.getItem('uid');
        //var uu = this.jwt && this.jwtHelper.decodeToken(this.jwt);
        this.carduid = this.jwt; // uu.d.uid; uu.d.uid;
        this.selectedownerid = this.carduid;
        // console.log("id:" + this.carduid);
        //var usersRef = this.messagesRef.child("users").child(this.carduid).child("stores");
        this.stores = this.af.list("/users/" + this.carduid + "/stores"); // observableFirebaseArray(usersRef);
        var oo = this.stores;
        oo.subscribe(function (res) {
            if (res) {
                res.map(function (item) {
                    //console.log("name:" + item.name );
                    OwnerReports.s_store = item.name;
                    //OwnerReports.s_ownerid = this.carduid;
                });
            }
        });
        setTimeout(function () {
            //console.log("storename:" + OwnerReports.s_store + " id=" + OwnerReports.s_ownerid );
            if (OwnerReports.s_store) {
                _this.selectedstore = OwnerReports.s_store;
                _this.selectedownerid = _this.carduid;
                _this.showStoreTrans(OwnerReports.s_store, _this.carduid);
            }
        }, 1300);
    }
    OwnerReports.prototype.showStoreTrans = function (store, ownerid) {
        this.selectedstore = store;
        this.selectedownerid = ownerid;
        //console.log("Hhh:" + this.selectedownerid + "  st" + this.selectedstore);
        //var usersRef = this.messagesRef.child("xyz").child(ownerid).child(store);
        // var usersRef = this.messagesRef.child("users").child(this.carduid).child("stores").child(this.selectedstore).child("transaction"); //this.messagesRef.child("transaction").child(this.selectedownerid).child("buyatstores");
        this.ownertrans = this.af.list("/users/" + this.carduid + "/stores/" + this.selectedstore + "/transaction"); // observableFirebaseArray(usersRef);
        //let oo = this.ownertrans;
        //oo.subscribe(res => {
        //    if (res) {
        //        res.map(function (item) {
        //            console.log("name:" + item.branch + " id=" + item.ttype + item.points);
        //        });
        //    }
        //}
        //);
    };
    OwnerReports = __decorate([
        core_1.Component({
            selector: 'reports',
            template: "\n<div class=\"home\">\n    <br/>\n    <div style=\"color:green\">\n        Select store to show your records:\n        <label *ngFor=\"#d of stores | async\" >\n           <input class=\"radio-inline\" type=\"radio\" name=\"nstores\" (click)=\"showStoreTrans(d.name, d.ownerid)\" checked=\"checked\" /> {{d.name }} &nbsp;\n        </label>\n    </div>\n    <div *ngIf=\"selectedstore\">\n    For store: {{selectedstore}}\n    <table  border=\"1\"  cellpadding=\"0\" cellspacing=\"0\"  style=\"border-collapse:collapse;\">\n        <tr>\n          <th> Branch</th><th> Date</th><th> Type</th><th>Cardtype</th><th> Invoice# </th><th>Total$</th><th>Reason</th><th>Points</th>\n        </tr>\n        <tr *ngFor=\"#kk of ownertrans | async\" >\n          <td> {{kk.branch }}</td><td> {{kk.date }} </td><td> {{kk.ttype }} </td><td> {{kk.cardtype}} </td><td> {{kk.invoice}} </td><td>{{kk.totaldollar}}</td><td> {{kk.reason}}</td><td> {{kk.points}}</td>\n        </tr>\n\n    </table>\n    </div>\n</div>\n\t",
            directives: [common_1.NgFor, router_1.RouterLink],
        }), 
        __metadata('design:paramtypes', [router_1.Router, angularfire2_1.AngularFire])
    ], OwnerReports);
    return OwnerReports;
}());
exports.OwnerReports = OwnerReports;
//# sourceMappingURL=OwnerReports.js.map