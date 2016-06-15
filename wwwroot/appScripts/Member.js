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
var angularfire2_1 = require('angularfire2');
var Login_1 = require('./Login');
var Member = (function () {
    function Member(_parentRouter, _builder, af) {
        this.af = af;
        this.isSigned = false;
        //this.messagesRef = Login.messagesRef;
        this.parentRouter = _parentRouter;
        //this.form = _builder.group({
        //    fcname: ['', Validators.required],
        //    password: ['', Validators.required]
        //});
    }
    Member.prototype.signupMember = function (fname, lname, email, password) {
        this.addedmsg = null;
        this.isSigned = false;
        if (fname !== "" && lname !== "" && email !== "" && password !== "") {
            this.af.auth.createUser({
                email: email,
                password: password
            }).then(function (authData) {
                this.authData = authData;
                // var usersRef = this.messagesRef.child("users").child(Member.gAuid);
                this.af.object("/users/" + this.authData.uid).update({
                    uid: Member.gAuid,
                    email: email,
                    fname: fname,
                    lname: lname,
                    ismember: true
                });
                var emailx = Login_1.Login.xemail(email);
                // var rref = this.messagesRef.child("members").child(emailx);
                this.af.object("/members/" + emailx).update({
                    uid: this.authData.uid,
                    email: email
                });
                this.fname = "";
                this.lname = "";
                this.email = "";
                this.password = "";
                this.isSigned = true;
                this.addedmsg = "Card added!";
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
        }
    };
    Member = __decorate([
        core_1.Component({
            selector: 'display',
            template: "\n\t    <div  class=\"card\">\n            <div class=\"card-header card-inverse card-info\">\n                Register membership\n             </div>\n          <br>\n        <form class=\"form-inline\">\n\t\t  <span class=\"radio\">\n            <input class=\"form-control\" required [(ngModel)]=\"fname\" placeholder=\"First name\" ><input class=\"form-control\" required [(ngModel)]=\"lname\"  placeholder=\"Last name\"><br>\n            <input class=\"form-control\" required [(ngModel)]=\"email\" placeholder=\"User email\"><input class=\"form-control\" required type=\"password\" [(ngModel)]=\"password\"  placeholder=\"Password\"><br>\n\t\t  </span><br>\n\t\t  <button class=\"btn btn-primary\" type=\"submit\"  (click)=\"signupMember(fname, lname,email,password)\">Signup</button>\n        </form>\n\t\t</div>\n\t  \t<div *ngIf=\"isSigned && addedmsg\">\n            {{addedmsg}}\n\t\t</div>        \n\t",
            directives: [common_1.NgFor, router_1.RouterLink],
        }), 
        __metadata('design:paramtypes', [router_1.Router, common_1.FormBuilder, angularfire2_1.AngularFire])
    ], Member);
    return Member;
}());
exports.Member = Member;
//# sourceMappingURL=Member.js.map