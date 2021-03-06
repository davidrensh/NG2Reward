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
var MemberHome = (function () {
    function MemberHome(_parentRouter, af) {
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
        var my = this.af.object("/users/" + this.carduid); //observableFirebaseObject(this.messagesRef.child("users").child(this.carduid));
        my.subscribe(function (kk) {
            _this.fname = kk.fname;
            _this.lname = kk.lname;
            _this.email = kk.email;
        });
    }
    MemberHome = __decorate([
        core_1.Component({
            selector: 'member-home',
            directives: [router_1.ROUTER_DIRECTIVES],
            template: "\n<div class=\"home\">\n    <br/>\nWelcome {{fname}} {{lname}}\n\n</div>\n  "
        }), 
        __metadata('design:paramtypes', [router_1.Router, angularfire2_1.AngularFire])
    ], MemberHome);
    return MemberHome;
}());
exports.MemberHome = MemberHome;
//# sourceMappingURL=MemberHome.js.map