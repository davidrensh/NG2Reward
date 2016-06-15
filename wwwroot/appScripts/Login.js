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
var router_1 = require('angular2/router');
var common_2 = require('angular2/common');
require('rxjs/add/operator/share');
var shareds_1 = require('./shareds');
var ng2_bootstrap_1 = require('ng2-bootstrap/ng2-bootstrap');
var angularfire2_1 = require('angularfire2');
var Login = (function () {
    function Login(router, zone, ss, af) {
        //Login.messagesRef = new Firebase(Login.firebaseUrl);
        this.router = router;
        this.zone = zone;
        this.ss = ss;
        this.af = af;
        this.showfork = false;
        this.hasMember = false;
        this.hasEmployee = false;
        this.hasOwner = false;
        this.isLoggedIn = false;
        //fbitems: Observable<any[]>;
        this.progressValue = 40;
        this.oneAtATime = true;
        this.items = ['Item 1', 'Item 2', 'Item 3'];
        this.status = {
            isFirstOpen: true,
            isFirstDisabled: false
        };
        this.groups = [
            {
                title: 'Dynamic Group Header - 1',
                content: 'Dynamic Group Body - 1'
            },
            {
                title: 'Dynamic Group Header - 2',
                content: 'Dynamic Group Body - 2'
            }
        ];
        //this.fbitems = af.database.list('/users');
        //console.log("000a" + af.database);
        //af.auth.subscribe(res => {
        //    console.log("0001" + res);
        //}
        //);
    }
    Login.prototype.addItem = function () {
        this.items.push("Items " + (this.items.length + 1));
    };
    Login.prototype.step = function (val) {
        this.progressValue += val;
    };
    Login.xemail = function (e) {
        return e.replace(".", "^");
    };
    Login.prototype.setLevel = function (l) {
        //console.log("setLevel:" + l);
        this.ss.setlevel(l);
        //amain  .loggedLevel = l;
        if (l === 1) {
            this.router.parent.navigate(['/MemberHome']);
        }
        if (l === 2) {
            this.router.parent.navigate(['/EmployeeHome']);
        }
        if (l === 3) {
            this.router.parent.navigate(['/SetupStore']);
        }
        //this.loggedLevel = l;
        //console.log("aaa" + l);
        //store owner
        //if (l === 3) {
        //    console.log("ownerstorescount" + this.ownerstorescount + " lastownerstore" + this.lastownerstore);
        //}
    };
    Login.prototype.authWithPassword = function (email, password) {
        var _this = this;
        this.errmsg = "";
        this.email = email;
        var o;
        this.af.auth.login({ email: this.email, password: this.password }).then(function (authData) {
            _this.authData = authData;
            _this.isLoggedIn = true;
            localStorage.setItem('uid', authData.uid);
            //console.log("aaa" + this.authData);
            var usersRef = _this.af.object("/users/" + _this.authData.uid);
            usersRef.update({
                uid: _this.authData.uid,
                email: email,
                lastlogin: (new Date()).toISOString()
            });
            o = _this.af.object("/users/" + _this.authData.uid);
            var s = o.subscribe(function (res) {
                _this.hasOwner = res.isowner;
                _this.hasEmployee = res.isemployee;
                _this.hasMember = res.ismember;
                //console.log("reset zz");
                _this.showfork = true; //this one not working
            });
        }).catch(function (error) {
            _this.errmsg = error;
            console.log(error);
        });
        //Login.messagesRef.authWithPassword({
        //    email: email,
        //    password: password
        //}, (error, authData) => {
        //    if (error) {
        //        this.errmsg = error;
        //        console.log(error);
        //    } else {
        //        this.authData = authData;
        //        this.isLoggedIn = true;
        //        localStorage.setItem('jwt', authData.token);
        //        //console.log(this.authData.uid);
        //        var usersRef = Login.messagesRef.child("users").child(this.authData.uid);
        //        usersRef.update({
        //            uid: this.authData.uid,
        //            email: email,
        //            lastlogin: (new Date()).toISOString()
        //        });
        //        o = observableFirebaseObject(Login.messagesRef.child("users").child(this.authData.uid));
        //        var s = o.subscribe(res => {
        //            this.hasOwner = res.isowner;
        //            this.hasEmployee = res.isemployee;
        //            this.hasMember = res.ismember;
        //            //console.log("reset zz");
        //            this.showfork = true;//this one not working
        //        }
        //        );
        //    }
        //});
        setTimeout(function () {
            // console.log("reset zz222");
            if (_this.hasMember && !_this.hasEmployee && !_this.hasOwner)
                _this.setLevel(1);
            if (!_this.hasMember && _this.hasEmployee && !_this.hasOwner)
                _this.setLevel(2);
            if (!_this.hasMember && !_this.hasEmployee && _this.hasOwner)
                _this.setLevel(3);
            if (_this.authData)
                _this.showfork = true;
            o = null;
        }, 1000);
    };
    Login.prototype.doneTyping = function ($event, email) {
        this.errmsg = "";
        //console.log("aab");
        if ($event.which === 13) {
            //console.log("aab");
            this.authWithPassword(email, $event.target.value);
        }
    };
    Login.prototype.doneTyping0 = function ($event, password, passctl) {
        this.errmsg = "";
        if ($event.which === 13) {
            //this.authWithPassword($event.target.value, password);
            //console.log("aa");
            passctl.focus();
            passctl.select();
        }
    };
    Login.url = "https://ngr.firebaseio.com";
    Login.messagesRef = new Firebase(Login.url);
    Login = __decorate([
        core_1.Component({
            selector: 'display',
            template: "\n<div id=\"phone\" class=\"text-center hidden-sm-up\">\n        <input class=\"form-control\" type=\"hidden\" [(ngModel)]=\"isLoggedIn\" placeholder=\"\">\n\t  \t<div >\n          <br>\n           <form class=\"form-inline\">\n\t\t  <span class=\"radio\">\n            <input class=\"form-control\" required [(ngModel)]=\"email\" placeholder=\"User email\" (keyup)=\"doneTyping0($event,password,pass)\"><br>\n            <input class=\"form-control\" #pass required [(ngModel)]=\"password\" type=\"password\" (keyup)=\"doneTyping($event,email)\" placeholder=\"Password\"><br>\n\t\t  </span>\n\t\t  <button class=\"btn btn-primary\"  [disabled]=\"!(email && password)\"    (click)=\"authWithPassword(email , password)\">Sign in</button>\n           </form>\n\t  \t    <div *ngIf=\"errmsg\"  style=\"color:Crimson\">\n                {{errmsg}}\n\t\t    </div>\n\t\t</div>\n        <div *ngIf=\"showfork\" >\n            <label class=\"radio-inline\" *ngIf=\"hasMember\">\n                <input  type=\"radio\" name=\"nlogin\"   (click)=\"setLevel(1)\" >Login as member<br/>\n            </label>\n            <label class=\"radio-inline\" *ngIf=\"hasEmployee\">\n                <input  type=\"radio\" name=\"nlogin\"   (click)=\"setLevel(2)\" >Login as employee<br/>\n            </label>\n            <label class=\"radio-inline\" *ngIf=\"hasOwner\">\n                <input  type=\"radio\" name=\"nlogin\"   (click)=\"setLevel(3)\" >Login as owner\n            </label>\n        </div>\n        <ul class=\"list-group alert alert-danger text-left\">\n            <li class=\"list-group-item\">Store owner, click top menu to create store, branches and manage it.</li>\n            <li class=\"list-group-item\">Store employee, just login with your email and password. </li>\n            <li class=\"list-group-item\">Member, just login with your email and password. Then, check your points, transactions, etc.</li>\n            <li class=\"list-group-item\">You can use any email address. It's just for login. The only issue is that you cannot reset password or receive notifications.</li>\n        </ul>\n</div>\n<div id=\"othermedia\" class=\"text-left hidden-md-down\">\n        <input class=\"form-control\" type=\"hidden\" [(ngModel)]=\"isLoggedIn\" placeholder=\"\">\n\t  \t<div >\n          <br>\n           <form class=\"form-inline\">\n\t\t  <span class=\"radio\">\n            <input class=\"form-control\" required [(ngModel)]=\"email\" placeholder=\"User email\" (keyup)=\"doneTyping0($event,password,pass)\"><br>\n            <input class=\"form-control\" #pass required [(ngModel)]=\"password\" type=\"password\" (keyup)=\"doneTyping($event,email)\" placeholder=\"Password\"><br>\n\t\t  </span><br>\n\t\t  <button class=\"btn btn-primary\"  [disabled]=\"!(email && password)\"    (click)=\"authWithPassword(email , password)\">Sign in</button>\n           </form>\n\t  \t    <div *ngIf=\"errmsg\"  style=\"color:Crimson\">\n                {{errmsg}}\n\t\t    </div>\n\t\t</div>\n        <div *ngIf=\"showfork\" >\n            <label *ngIf=\"hasMember\">\n                <input class=\"form-control\" type=\"radio\" name=\"nlogin\"   (click)=\"setLevel(1)\" >Login as member<br/>\n            </label>\n            <label *ngIf=\"hasEmployee\">\n                <input class=\"form-control\" type=\"radio\" name=\"nlogin\"   (click)=\"setLevel(2)\" >Login as employee<br/>\n            </label>\n            <label *ngIf=\"hasOwner\">\n                <input class=\"form-control\" type=\"radio\" name=\"nlogin\"   (click)=\"setLevel(3)\" >Login as owner\n            </label>\n        </div>\n        <ul class=\"list-group alert alert-danger text-left\">\n            <li class=\"list-group-item\">Store owner, click top menu to create store, branches and manage it.</li>\n            <li class=\"list-group-item\">Store employee, just login with your email and password. </li>\n            <li class=\"list-group-item\">Member, just login with your email and password. Then, check your points, transactions, etc.</li>\n            <li class=\"list-group-item\">You can use any email address. It's just for login. The only issue is that you cannot reset password or receive notifications.</li>\n        </ul>\n</div>\n\n\t",
            directives: [common_2.NgFor, router_1.RouterLink, ng2_bootstrap_1.ACCORDION_DIRECTIVES, common_1.CORE_DIRECTIVES, common_1.FORM_DIRECTIVES],
        }), 
        __metadata('design:paramtypes', [router_1.Router, core_1.NgZone, shareds_1.SharedService, angularfire2_1.AngularFire])
    ], Login);
    return Login;
}());
exports.Login = Login;
//# sourceMappingURL=Login.js.map