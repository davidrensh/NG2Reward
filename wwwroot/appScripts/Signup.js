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
var router_1 = require('angular2/router');
var common_1 = require('angular2/common');
require('rxjs/add/operator/share');
//import {observableFirebaseObject, observableFirebaseArray} from './myfbOb';
var Login_1 = require('./Login');
var shareds_1 = require('./shareds');
var angularfire2_1 = require('angularfire2');
var Signup = (function () {
    function Signup(_parentRouter, ss, af) {
        this.ss = ss;
        this.af = af;
        this.isSigned = false;
        //this.messagesRef = Login.messagesRef;
        this.parentRouter = _parentRouter;
    }
    Signup.prototype.signupStore = function (fname, lname, email, password, storename, renewYears, maxPurchase, maxRedeem) {
        this.af.auth.createUser({
            email: email,
            password: password
        }).then(function (authData) {
            //console.log("Authenticated successfully with payload:", authData);
            this.authData = authData;
            this.isSigned = true;
            localStorage.setItem('uid', authData.uid);
            // var usersRef = this.messagesRef.child("users").child(authData.uid);
            this.af.object("/users/" + this.authData.uid).update({
                uid: authData.uid,
                email: email,
                fname: fname,
                lname: lname,
                isowner: true,
                isemployee: true,
                ismember: true
            });
            // usersRef.child("loginstores").child(storename)
            this.af.object("/users/" + this.authData.uid + "/loginstores/" + storename).update({
                ownerid: authData.uid,
                name: storename
            });
            //usersRef.child("buyatstores").child(storename)
            this.af.object("/users/" + this.authData.uid + "/buyatstores/" + storename).update({
                ownerid: authData.uid,
                name: storename
            });
            //var rref = this.messagesRef.child("users").child(authData.uid).child("stores").child(storename);
            this.af.object("/users/" + this.authData.uid + "/stores/" + storename).update({
                name: storename,
                renewyears: renewYears,
                maxpurchase: maxPurchase,
                maxredeem: maxRedeem
            });
            //rref.child("employees").child(authData.uid)
            this.af.object("/users/" + this.authData.uid + "/stores/" + storename + "/employees/" + authData.uid).update({
                uid: authData.uid,
                email: email,
                fname: fname,
                lname: lname
            });
            var emailx = Login_1.Login.xemail(email);
            // var rref = this.messagesRef.child("members").child(emailx);
            this.af.object("/members/" + emailx).update({
                uid: authData.uid,
                email: email
            });
            //console.log("gooo");
            this.ss.setlevel(3);
            this.parentRouter.parent.navigateByUrl('/Login');
        }).catch(function (error) {
            switch (error.code) {
                case "INVALID_EMAIL":
                    console.log("The specified email is not a valid email.");
                    break;
                default:
                    console.log("Error creating user:", error);
                case "EMAIL_TAKEN":
                    console.log("The new user account cannot be created because the email is already in use. Use the credential to setup store.");
            }
        });
        //this.messagesRef.createUser({
        //    email: email,
        //    password: password
        //}, function (error, userData) {
        //    if (error) {
        //        switch (error.code) {
        //            case "INVALID_EMAIL":
        //                console.log("The specified email is not a valid email.");
        //                break;
        //            default:
        //                console.log("Error creating user:", error);
        //            case "EMAIL_TAKEN":
        //                console.log("The new user account cannot be created because the email is already in use. Use the credential to setup store.");
        //        }
        //        return;
        //    } else {
        //    }
        //});
        //setTimeout(() => {
        //    this.messagesRef.authWithPassword({
        //        email: email,
        //        password: password
        //    }, (error, authData) => {
        //        if (error) {
        //            console.log(error);
        //        } else {
        //            //console.log("Authenticated successfully with payload:", authData);
        //            this.authData = authData;
        //            this.isSigned = true;
        //            localStorage.setItem('jwt', authData.token);
        //            var usersRef = this.messagesRef.child("users").child(authData.uid);
        //            usersRef.update({
        //                uid: authData.uid,
        //                email: email,
        //                fname: fname,
        //                lname: lname,
        //                isowner: true,
        //                isemployee: true,
        //                ismember: true
        //            });
        //            usersRef.child("loginstores").child(storename).update({
        //                ownerid: authData.uid,
        //                name: storename
        //            });
        //            usersRef.child("buyatstores").child(storename).update({
        //                ownerid: authData.uid,
        //                name: storename
        //            });
        //            var rref = this.messagesRef.child("users").child(authData.uid).child("stores").child(storename);
        //            rref.update({
        //                name: storename,
        //                renewyears: renewYears,
        //                maxpurchase: maxPurchase,
        //                maxredeem: maxRedeem
        //            });
        //            rref.child("employees").child(authData.uid).update({
        //                uid: authData.uid,
        //                email: email,
        //                fname: fname,
        //                lname: lname
        //            });
        //            let emailx = Login.xemail(email);
        //            var rref = this.messagesRef.child("members").child(emailx);
        //            rref.update({
        //                uid: authData.uid,
        //                email: email
        //            });
        //            //console.log("gooo");
        //            this.ss.setlevel(3);
        //            this.parentRouter.parent.navigateByUrl('/Login');
        //        }
        //    });
        //}, 1000);
    };
    Signup = __decorate([
        core_1.Component({
            selector: 'display',
            template: "\n\t  \t<div *ngIf=\"!isSigned\"\tclass=\"card\">\n            <div class=\"card-header card-inverse card-info\">\n                Register store\n             </div>\n          <form class=\"form-inline\">\n\t\t  <span class=\"radio\">\n            <input class=\"form-control\" required [(ngModel)]=\"fname\" placeholder=\"First name\"><input class=\"form-control\" required [(ngModel)]=\"lname\"  placeholder=\"Last name\"><br>\n            <input class=\"form-control\" required [(ngModel)]=\"email\" placeholder=\"User email\"><input class=\"form-control\" type=\"password\" required #password  placeholder=\"Password\"><br>\n            <input class=\"form-control\" required [(ngModel)]=\"storename\"  placeholder=\"Store name\"><input class=\"form-control\" required [(ngModel)]=\"renewYears\"  placeholder=\"Years for one renew, i.e.: 1\"><br>\n            <input class=\"form-control\" required  [(ngModel)]=\"maxPurchase\"  placeholder=\"Max purchase$ limit, i.e.: 1000\"><input class=\"form-control\" required  [(ngModel)]=\"maxRedeem\"  placeholder=\"Max redeem points limit, i.e.: 1000\"><br>\n\t\t  </span><br>\n\t\t  <button class=\"btn btn-primary\" [disabled]=\"!(fname && lname && email && password.value && storename && renewYears && maxPurchase && maxRedeem)\"  (click)=\"signupStore(fname, lname,email,password.value,storename,renewYears,maxPurchase,maxRedeem)\">Signup</button>\n          </form>\n\t\t</div>\n\t",
            directives: [common_1.NgFor, router_1.RouterLink],
        }), 
        __metadata('design:paramtypes', [router_1.Router, shareds_1.SharedService, angularfire2_1.AngularFire])
    ], Signup);
    return Signup;
}());
exports.Signup = Signup;
//# sourceMappingURL=Signup.js.map